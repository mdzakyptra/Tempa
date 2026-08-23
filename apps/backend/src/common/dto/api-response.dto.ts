import { ApiProperty } from '@nestjs/swagger';


export class ApiResponseDto<T = unknown> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Berhasil' })
  message: string;

  data?: T;

  //<---------- success -------------->
  static success<T>(data: T, message = 'Berhasil'): ApiResponseDto<T> {
    const response = new ApiResponseDto<T>();
    response.success = true;
    response.message = message;
    response.data = data;
    return response;
  }
}
