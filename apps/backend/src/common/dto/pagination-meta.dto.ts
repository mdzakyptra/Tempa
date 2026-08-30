import { ApiProperty } from '@nestjs/swagger';


export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}

// Ditandai lewat kehadiran `items`/`meta` — dipakai ResponseInterceptor buat
// bedain hasil paginated (di-unwrap jadi data + meta di level envelope) dari
// return value biasa (langsung jadi `data` apa adanya).
export interface Paginated<T> {
  items: T[];
  meta: PaginationMetaDto;
}
