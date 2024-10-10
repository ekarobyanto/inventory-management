import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export const responseWriter = <T>(
  res: Response,
  status: HttpStatus,
  message: any,
  data?: T,
) => res.status(status).json({ message, data });
