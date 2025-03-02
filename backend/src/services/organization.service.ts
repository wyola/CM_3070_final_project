import { PrismaClient, Prisma, Organization } from '@prisma/client';
import bcrypt from 'bcrypt';
import {
  OrganizationRegistrationDto,
  RegistrationResult,
  OrganizationQueryDto,
  PaginatedOrganizationsResult,
} from '../types/organization.types';
import { WhitelistService } from './whitelist.service';

const prisma = new PrismaClient();

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
} as const;

export class OrganizationService {
  private whitelistService: WhitelistService;

  constructor() {
    this.whitelistService = new WhitelistService();
  }

  async register(
    data: OrganizationRegistrationDto,
    logoPath: string
  ): Promise<RegistrationResult> {
    try {
      if (!this.whitelistService.isKrsWhitelisted(data.krs)) {
        throw new Error('Organization KRS is not whitelisted');
      }

      const voivodeship = this.whitelistService.getVoivodeshipForKrs(data.krs);
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const result = await prisma.$transaction(async (tx) => {
        const { password, ...organizationData } = data;

        const organization = await tx.organization.create({
          data: {
            ...organizationData,
            logo: logoPath,
            voivodeship,
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

        return { organization, user };
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
    const { page, limit, search, voivodeship, acceptsReports } = query;
    const skip = (page - 1) * limit;

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

    const [total, organizations] = await Promise.all([
      prisma.organization.count({ where }),
      prisma.organization.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        select: organizationSelect,
      }),
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

    return organization;
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
}
