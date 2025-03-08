import { Request, Response } from 'express';
import { z } from 'zod';
import { NeedService } from '../services/need.service';
import { needSchema } from '../types/need.types';
import { RequestWithUser } from '../middleware/auth.middleware';

const needService = new NeedService();

export class NeedController {
  public createNeed = async (
    req: RequestWithUser,
    res: Response
  ): Promise<void> => {
    try {
      const organizationId = parseInt(req.params.organizationId);

      if (isNaN(organizationId)) {
        res.status(400).json({
          message: 'Invalid organization ID format',
        });
        return;
      }

      const validatedData = needSchema.parse({
        ...req.body,
        organizationId,
      });

      const need = await needService.createNeed(validatedData);

      res.status(201).json({
        message: 'Need created successfully',
        need,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

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

  public getNeedsByOrganizationId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const organizationId = parseInt(req.params.organizationId);

      if (isNaN(organizationId)) {
        res.status(400).json({
          message: 'Invalid organization ID format',
        });
        return;
      }

      const needs = await needService.getNeedsByOrganizationId(organizationId);

      res.status(200).json({
        message: 'Needs retrieved successfully',
        needs,
      });
    } catch (error) {
      console.error('Error getting needs:', error);
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  };

  public getNeedById = async (req: Request, res: Response): Promise<void> => {
    try {
      const needId = parseInt(req.params.needId);
      const organizationId = parseInt(req.params.organizationId);

      if (isNaN(needId) || isNaN(organizationId)) {
        res.status(400).json({
          message: 'Invalid ID format',
        });
        return;
      }

      const need = await needService.getNeedById(needId);

      if (!need) {
        res.status(404).json({
          message: 'Need not found',
        });
        return;
      }

      // Verify that the need belongs to the specified organization
      if (need.organizationId !== organizationId) {
        res.status(404).json({
          message: 'Need not found for this organization',
        });
        return;
      }

      res.status(200).json({
        message: 'Need retrieved successfully',
        need,
      });
    } catch (error) {
      console.error('Error getting need:', error);
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  };
}
