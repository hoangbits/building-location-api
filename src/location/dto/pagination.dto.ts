import { IsInt, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({ 
    description: 'Page number (1-based)', 
    required: false, 
    default: 1,
    example: 1,
  })
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({ 
    description: 'Number of items per page', 
    required: false, 
    default: 10,
    example: 10,
  })
  per_page: number = 10;
}