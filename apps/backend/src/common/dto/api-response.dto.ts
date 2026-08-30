import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationMetaDto } from './pagination-meta.dto';


export class ApiResponseDto<T = unknown> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Berhasil' })
  message: string;

  data?: T;

  @ApiPropertyOptional({ type: PaginationMetaDto })
  meta?: PaginationMetaDto;

  //<---------- success -------------->
  static success<T>(
    data: T,
    message = 'Berhasil',
    meta?: PaginationMetaDto,
  ): ApiResponseDto<T> {
    const response = new ApiResponseDto<T>();
    response.success = true;
    response.message = message;
    response.data = data;
    response.meta = meta;
    return response;
  }
}
