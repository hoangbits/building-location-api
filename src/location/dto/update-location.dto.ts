import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLocationDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Building name', required: false })
  building?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Location name', required: false })
  locationName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Location number', required: false })
  locationNumber?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({ description: 'Area in square meters', required: false })
  area?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Parent location ID (if any)', required: false })
  parentId?: number;
}