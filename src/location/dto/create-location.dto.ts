import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @IsString()
  @ApiProperty({ description: 'Building name' })
  building: string;

  @IsString()
  @ApiProperty({ description: 'Location name' })
  locationName: string;

  @IsString()
  @ApiProperty({ description: 'Location number' })
  locationNumber: string;

  @IsNumber()
  @Min(0)
  @ApiProperty({ description: 'Area in square meters' })
  area: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Parent location ID (if any)', required: false })
  parentId?: number;
}