import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { errorParser } from 'src/utils/error_parser.util';
import { responseWriter } from 'src/utils/response_writer.util';

@Catch()
export class GlobalErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorResponse = exception.getResponse();
      responseWriter(res, status, errorParser(errorResponse));
      return;
    }

    responseWriter(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Internal Server Error',
      exception,
    );
    return;
  }
}
