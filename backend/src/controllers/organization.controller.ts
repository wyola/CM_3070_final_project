import { Request, Response } from 'express';
import { z } from 'zod';
import { OrganizationService } from '../services/organization.service';
import {
  organizationSchema,
  organizationQuerySchema,
} from '../types/organization.types';
import fs from 'fs/promises';

const organizationService = new OrganizationService();

export class OrganizationController {
  public register = async (req: Request, res: Response): Promise<void> => {
    const isLogoMissing = !req.file;

    try {
      const validatedData = organizationSchema.parse(req.body);

      if (isLogoMissing) {
        res.status(400).json({
          message: 'Validation failed',
          errors: [
            {
              field: 'logo',
              message: 'Logo is missing',
            },
          ],
        });
        return;
      }

      const result = await organizationService.register(
        validatedData,
        req.file!.path
      );

      res.status(201).json({
        message: 'Organization registered successfully',
        data: {
          organization: result.organization,
          user: {
            id: result.user.id,
            email: result.user.email,
          },
        },
      });
    } catch (error) {
      if (req.file) {
        await fs.unlink(req.file.path).catch(() => {
          // Ignore error if file deletion fails
        });
      }

      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        if (isLogoMissing) {
          errors.push({
            field: 'logo',
            message: 'Logo is missing',
          });
        }
        res.status(400).json({
          message: 'Validation failed',
          errors,
        });
        return;
      }
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public getOrganizations = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const query = organizationQuerySchema.parse({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        voivodeship: req.query.voivodeship,
        acceptsReports: req.query.acceptsReports,
        animals: req.query.animals,
        needs: req.query.needs
      });

      const result = await organizationService.getOrganizations(query);

      res.status(200).json({
        message: 'Organizations retrieved successfully',
        data: result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: 'Invalid query parameters',
        });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public getOrganizationById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          message: 'Invalid ID format',
        });
        return;
      }

      const organization = await organizationService.getOrganizationById(id);

      if (!organization) {
        res.status(404).json({
          message: 'Organization not found',
        });
        return;
      }

      res.status(200).json({
        message: 'Organization retrieved successfully',
        organization,
      });
    } catch (error) {
      console.error('Error getting organization:', error);
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  };

  public getOrganizationByKrs = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { krs } = req.params;

      const organizationInfo =
        await organizationService.getOrganizationInfoByKrs(krs);

      res.status(200).json({
        message: 'Organization information retrieved successfully',
        data: organizationInfo,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }
      console.error('Error getting organization by KRS:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}
