import { Prisma, Organization } from '@prisma/client';
import bcrypt from 'bcrypt';
import {
  OrganizationRegistrationDto,
  RegistrationResult,
  OrganizationQueryDto,
  PaginatedOrganizationsResult,
} from '../types/organization.types';
import { prisma } from '../lib/prisma-client';
import { WhitelistService } from './whitelist.service';
import { GeolocationService } from './geolocation.service';

const organizationSelect = {
  id: true,
  name: true,
  email: true,
  krs: true,
  phone: true,
  city: true,
  postalCode: true,
  address: true,
  voivodeship: true,
  geolocation: true,
  logo: true,
  description: true,
  website: true,
  acceptsReports: true,
  animals: true,
  user: {
    select: {
      id: true,
    },
  },
} as const;

export class OrganizationService {
  private whitelistService: WhitelistService;
  private geolocationService: GeolocationService;

  constructor() {
    this.whitelistService = new WhitelistService();
    this.geolocationService = new GeolocationService();
  }

  async register(
    data: OrganizationRegistrationDto,
    logoPath: string
  ): Promise<RegistrationResult> {
    try {
      if (!this.whitelistService.isKrsWhitelisted(data.krs)) {
        throw new Error('Organization KRS is not whitelisted');
      }

      const voivodeship = this.whitelistService
        .getVoivodeshipForKrs(data.krs)
        .toLowerCase();
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const geolocation =
        await this.geolocationService.getCoordinatesFromAddress({
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
        });

      const result = await prisma.$transaction(async (tx) => {
        const { password, ...organizationData } = data;

        const organization = await tx.organization.create({
          data: {
            ...organizationData,
            name: organizationData.name.toLowerCase(),
            city: organizationData.city.toLowerCase(),
            voivodeship,
            logo: logoPath,
            animals: JSON.stringify(data.animals),
            geolocation: geolocation ? JSON.stringify(geolocation) : null,
          },
          select: organizationSelect,
        });

        const user = await tx.user.create({
          data: {
            email: data.email,
            password: hashedPassword,
            organizationId: organization.id,
          },
          select: {
            id: true,
            email: true,
          },
        });

        return { organization: this.transformOrganization(organization), user };
      });

      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const field = error.meta?.target as string[];
          throw new Error(`Organization with this ${field[0]} already exists`);
        }
      }
      throw error;
    }
  }

  async getOrganizations(
    query: OrganizationQueryDto
  ): Promise<PaginatedOrganizationsResult> {
    const {
      page,
      limit,
      search,
      voivodeship,
      acceptsReports,
      animals,
      needs,
      lat,
      long,
    } = query;

    let where: Prisma.OrganizationWhereInput = {};

    if (search) {
      const searchLower = search.toLowerCase();
      where.OR = [
        { name: { contains: searchLower } },
        { city: { contains: searchLower } },
      ];
    }

    if (voivodeship) {
      where.voivodeship = { equals: voivodeship };
    }

    if (acceptsReports !== undefined) {
      where.acceptsReports = acceptsReports;
    }

    if (animals && animals.length > 0) {
      where.AND = animals.map((animal) => ({
        animals: {
          contains: animal,
        },
      }));
    }

    if (needs && needs.length > 0) {
      where.needs = {
        some: {
          kind: {
            in: needs,
          },
        },
      };
    }

    // If geolocation coordinates are provided for distance sorting
    if (lat !== undefined && long !== undefined) {
      return this.getOrganizationsByDistance(where, { page, limit, lat, long });
    } else {
      return this.getOrganizationsByName(where, { page, limit });
    }
  }

  private async getOrganizationsByDistance(
    where: Prisma.OrganizationWhereInput,
    options: { page: number; limit: number; lat: number; long: number }
  ): Promise<PaginatedOrganizationsResult> {
    const { page, limit, lat, long } = options;
    const skip = (page - 1) * limit;

    const [total, allMatchingOrganizations] = await Promise.all([
      prisma.organization.count({ where }),
      prisma.organization.findMany({
        where,
        select: { id: true, geolocation: true },
      }),
    ]);

    // sort by distance from lat and long
    const sortedIds = allMatchingOrganizations
      .map((org) => {
        const geoData = org.geolocation ? JSON.parse(org.geolocation) : null;
        // if no geolocation, put it at the end
        let distance = Number.MAX_VALUE;

        if (geoData) {
          distance = this.geolocationService.calculateDistance(
            lat,
            long,
            geoData.lat,
            geoData.lon
          );
        }

        return {
          id: org.id,
          distance,
        };
      })
      .sort((a, b) => a.distance - b.distance)
      .map((org) => org.id);

    const idsForCurrentPage = sortedIds.slice(skip, skip + limit);

    // get full org data for current page
    const pagedOrganizations = await prisma.organization.findMany({
      where: {
        id: {
          in: idsForCurrentPage,
        },
      },
      select: organizationSelect,
      orderBy: {
        id: 'asc',
      },
    });

    // Ensure proper sort order based on previous sorting
    const sortedOrganizations = idsForCurrentPage
      .map((id) => pagedOrganizations.find((org) => org.id === id))
      .filter(Boolean)
      .map((org) => this.transformOrganization(org!));

    const pages = Math.ceil(total / limit);

    return {
      organizations: sortedOrganizations,
      pagination: {
        total,
        page,
        limit,
        pages,
      },
    };
  }

  private async getOrganizationsByName(
    where: Prisma.OrganizationWhereInput,
    options: { page: number; limit: number }
  ): Promise<PaginatedOrganizationsResult> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [total, organizations] = await Promise.all([
      prisma.organization.count({ where }),
      prisma.organization
        .findMany({
          where,
          skip,
          take: limit,
          orderBy: { name: 'asc' },
          select: organizationSelect,
        })
        .then((orgs) => orgs.map(this.transformOrganization)),
    ]);

    const pages = Math.ceil(total / limit);

    return {
      organizations,
      pagination: {
        total,
        page,
        limit,
        pages,
      },
    };
  }

  public async getOrganizationById(id: number): Promise<Organization | null> {
    const organization = await prisma.organization.findUnique({
      where: { id },
    });

    return organization ? this.transformOrganization(organization) : null;
  }

  async getOrganizationInfoByKrs(krs: string): Promise<any> {
    if (!/^[0-9]{10}$/.test(krs)) {
      throw new Error('Invalid KRS format. Must be 10 digits.');
    }

    const existingOrganization = await prisma.organization.findUnique({
      where: { krs },
    });

    if (existingOrganization) {
      throw new Error('Organization with this KRS is already registered');
    }

    const whitelistInfo = this.whitelistService.getOrganizationInfoByKrs(krs);

    if (!whitelistInfo) {
      throw new Error('Organization with this KRS not found in whitelist');
    }

    return {
      name: whitelistInfo.Name,
      voivodeship: whitelistInfo.Voivodeship,
      city: whitelistInfo.City || '',
    };
  }

  async updateOrganization(
    id: number,
    data: Partial<OrganizationRegistrationDto>,
    logoPath?: string
  ): Promise<Organization> {
    try {
      const organization = await prisma.organization.findUnique({
        where: { id },
      });

      if (!organization) {
        throw new Error('Organization not found');
      }

      let geolocation = organization.geolocation;
      const addressChanged =
        (data.address && data.address !== organization.address) ||
        (data.city && data.city !== organization.city) ||
        (data.postalCode && data.postalCode !== organization.postalCode);

      if (addressChanged) {
        const geoData = await this.geolocationService.getCoordinatesFromAddress(
          {
            address: data.address || organization.address,
            city: data.city || organization.city,
            postalCode: data.postalCode || organization.postalCode,
          }
        );

        geolocation = geoData ? JSON.stringify(geoData) : null;
      }

      const updateData: Prisma.OrganizationUpdateInput = {
        ...data,
        geolocation,
        name: data.name?.toLowerCase(),
        city: data.city?.toLowerCase(),
        voivodeship: data.voivodeship?.toLowerCase(),
        animals: JSON.stringify(data.animals),
      };

      if (logoPath) {
        updateData.logo = logoPath;
      }

      // Don't allow KRS to be updated
      delete updateData.krs;

      const updatedOrganization = await prisma.organization.update({
        where: { id },
        data: updateData,
        select: organizationSelect,
      });

      return this.transformOrganization(updatedOrganization);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const field = error.meta?.target as string[];
          throw new Error(`Organization with this ${field[0]} already exists`);
        }
      }
      throw error;
    }
  }

  private transformOrganization(org: any) {
    const { user, ...orgData } = org;
    const ownerId = user ? user.id : null;

    return {
      ...orgData,
      ownerId,
      animals: JSON.parse(orgData.animals),
      geolocation: orgData.geolocation ? JSON.parse(orgData.geolocation) : null,
    };
  }
}
