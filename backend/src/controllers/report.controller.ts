import { Request, Response } from 'express';
import { z } from 'zod';
import { ReportService } from '../services/report.service';
import { reportSchema } from '../types/report.types';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

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
}
