import { PrismaClient } from '@prisma/client';
import { KindsOfNeeds, NeedDto, NeedResponse } from '../types/need.types';

const prisma = new PrismaClient();

export class NeedService {
  async createNeed(data: NeedDto): Promise<NeedResponse> {
    // Check if organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: data.organizationId },
    });

    if (!organization) {
      throw new Error('Organization not found');
    }

    const need = await prisma.need.create({
      data: {
        kind: data.kind.toString(),
        priority: data.priority,
        description: data.description,
        organization: {
          connect: { id: data.organizationId },
        },
      },
    });
    return this.transformNeed(need);
  }

  async getNeedsByOrganizationId(
    organizationId: number
  ): Promise<NeedResponse[]> {
    const needs = await prisma.need.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });

    return needs.map(this.transformNeed);
  }

  async getNeedById(id: number): Promise<NeedResponse | null> {
    const need = await prisma.need.findUnique({
      where: { id },
    });

    return need ? this.transformNeed(need) : null;
  }

  private transformNeed(need: any) {
    return {
      ...need,
      kind: need.kind as KindsOfNeeds,
    } as NeedResponse;
  }
}
