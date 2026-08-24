import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorResponseDto } from '../dto/api-error-response.dto';


@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  //<---------- catch -------------->
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Stack trace & detail internal cuma di log di server, gak pernah dikirim ke client.
    if (Number(statusCode) === Number(HttpStatus.INTERNAL_SERVER_ERROR)) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const errorResponse: ApiErrorResponseDto = {
      success: false,
      message: this.extractMessage(exception, statusCode),
      statusCode,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(errorResponse);
  }

  //<---------- extractMessage -------------->
  private extractMessage(exception: unknown, statusCode: number): string {
    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      if (typeof body === 'string') return body;
      if (typeof body === 'object' && body !== null && 'message' in body) {
        const message = (body as { message: string | string[] }).message;
        return Array.isArray(message) ? message.join(', ') : message;
      }
    }

    const isServerError =
      Number(statusCode) === Number(HttpStatus.INTERNAL_SERVER_ERROR);

    return isServerError ? 'Terjadi kesalahan pada server' : 'Terjadi kesalahan';
  }
}
