import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Logger, Query } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './location.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from './dto/pagination.dto';

@ApiTags('locations')
@Controller('locations')
export class LocationController {
  private readonly logger = new Logger(LocationController.name);

  constructor(private readonly locationService: LocationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new location' })
  @ApiResponse({ status: 201, description: 'The location has been successfully created.', type: Location })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createLocationDto: CreateLocationDto): Promise<Location> {
    this.logger.log(`Received request to create location: ${createLocationDto.locationName}`);
    return this.locationService.create(createLocationDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all locations with pagination', 
    description: 'Fetches a paginated list of locations (excluding soft-deleted ones).'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (1-based)', example: 1 })
  @ApiQuery({ name: 'per_page', required: false, type: Number, description: 'Items per page', example: 10 })
  @ApiResponse({ 
    status: 200, 
    description: 'Paginated list of locations.', 
    type: Object, 
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/Location' } },
        total: { type: 'number', example: 15 },
        page: { type: 'number', example: 1 },
        per_page: { type: 'number', example: 10 },
      },
    },
  })
  async findAll(@Query() paginationDto: PaginationDto): Promise<{
    data: Location[];
    total: number;
    page: number;
    per_page: number;
  }> {
    this.logger.log('Received request to fetch all locations with pagination');
    return this.locationService.findAll(paginationDto);
  }



  @Get(':id')
  @ApiOperation({ summary: 'Get a location by ID' })
  @ApiResponse({ status: 200, description: 'The location details.', type: Location })
  @ApiResponse({ status: 404, description: 'Location not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Location> {
    this.logger.log(`Received request to fetch location with ID ${id}`);
    return this.locationService.findOne(id);
  }


  @Put(':id')
  @ApiOperation({ summary: 'Update a location by ID' })
  @ApiResponse({ status: 200, description: 'The updated location.', type: Location })
  @ApiResponse({ status: 404, description: 'Location not found' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    this.logger.log(`Received request to update location with ID ${id}`);
    return this.locationService.update(id, updateLocationDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'delete a location by ID',
    description:
      'deletes a location by ID, marking it as deleted without removing it from the database. If the location has children, their parent will be set to null.',
  })
  @ApiResponse({ status: 200, description: 'Location deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Location not found.' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.logger.log(`Received request to delete location with ID ${id}`);
    return this.locationService.delete(id);
  }


}