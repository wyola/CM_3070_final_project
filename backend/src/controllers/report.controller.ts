import { Request, Response } from 'express';
import { z } from 'zod';
import { ReportService } from '../services/report.service';
import { reportSchema, reportStatusUpdateSchema } from '../types/report.types';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { prisma } from '../lib/prisma-client';
import { RequestWithUser } from '../middleware/auth.middleware';

const reportService = new ReportService();

export class ReportController {
  public createReport = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = reportSchema.parse(req.body);

      let imagePath: string | undefined;

      if (req.file) {
        // Resize image to reduce size
        const resizedImageBuffer = await sharp(req.file.path)
          .resize(800)
          .jpeg({ quality: 80 })
          .toBuffer();

        const filename = `${Date.now()}-${path.basename(req.file.path)}`;
        const resizedImagePath = path.join('uploads', 'reports', filename);

        await fs.mkdir(path.dirname(resizedImagePath), { recursive: true });
        await fs.writeFile(resizedImagePath, resizedImageBuffer);

        // Delete the original file
        await fs.unlink(req.file.path).catch(() => {
          // Ignore error if file deletion fails
        });

        imagePath = resizedImagePath;
      }

      const report = await reportService.createReport(validatedData, imagePath);

      res.status(201).json({
        message: 'Report created successfully',
        data: report,
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

  public getOrganizationReports = async (
    req: RequestWithUser,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.user?.sub;

      if (!userId) {
        res.status(401).json({
          message: 'Unauthorized',
        });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: { organizationId: true },
      });

      if (!user) {
        res.status(404).json({
          message: 'User not found',
        });
        return;
      }

      const reports = await reportService.getReportsByOrganizationId(
        user.organizationId
      );

      res.status(200).json({
        message: 'Reports retrieved successfully',
        data: reports,
      });
    } catch (error) {
      console.error('Error getting organization reports:', error);
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  };

  public markReportAsViewed = async (
    req: RequestWithUser,
    res: Response
  ): Promise<void> => {
    try {
      const reportId = parseInt(req.params.reportId);
      const userId = req.user?.sub;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      await reportService.markReportAsViewed(reportId, parseInt(userId));

      res.status(200).json({
        message: 'Report marked as viewed successfully',
      });
    } catch (error: any) {
      if (error.message === 'Report not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error.message === 'Organization not assigned to this report') {
        res.status(403).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public deleteReport = async (
    req: RequestWithUser,
    res: Response
  ): Promise<void> => {
    try {
      const reportId = parseInt(req.params.reportId);
      const userId = req.user?.sub;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      if (isNaN(reportId)) {
        res.status(400).json({ message: 'Invalid report ID' });
        return;
      }

      await reportService.deleteReport(reportId, parseInt(userId));

      res.status(200).json({
        message: 'Report deleted successfully',
      });
    } catch (error: any) {
      if (error.message === 'Report not found') {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error.message === 'Organization not assigned to this report') {
        res.status(403).json({ message: error.message });
        return;
      }
      if (error.message === 'User not associated with any organization') {
        res.status(401).json({ message: error.message });
        return;
      }

      console.error('Error deleting report:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public updateReportStatus = async (
    req: RequestWithUser,
    res: Response
  ): Promise<void> => {
    try {
      const reportId = parseInt(req.params.reportId);
      const userId = req.user?.sub;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      if (isNaN(reportId)) {
        res.status(400).json({ message: 'Invalid report ID' });
        return;
      }

      // Validate the status using Zod
      const validatedData = reportStatusUpdateSchema.parse(req.body);

      await reportService.updateReportStatus(
        reportId,
        parseInt(userId),
        validatedData.status
      );

      res.status(200).json({
        message: 'Report status updated successfully',
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
        if (error.message === 'Report not found') {
          res.status(404).json({ message: error.message });
          return;
        }
        if (error.message === 'Organization not assigned to this report') {
          res.status(403).json({ message: error.message });
          return;
        }
        if (error.message === 'User not associated with any organization') {
          res.status(401).json({ message: error.message });
          return;
        }
        if (error.message === 'Invalid report status') {
          res.status(400).json({ message: error.message });
          return;
        }

        res.status(400).json({ message: error.message });
        return;
      }

      console.error('Error updating report status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}
