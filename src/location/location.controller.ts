import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Logger } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './location.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

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
  @ApiOperation({ summary: 'Get all locations' })
  @ApiResponse({ status: 200, description: 'List of locations.', type: [Location] })
  async findAll(): Promise<Location[]> {
    this.logger.log('Received request to fetch all locations');
    return this.locationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a location by ID' })
  @ApiResponse({ status: 200, description: 'The location details.', type: Location })
  @ApiResponse({ status: 404, description: 'Location not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Location> {
    this.logger.log(`Received request to fetch location with ID ${id}`);
    return this.locationService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a location by ID' })
  @ApiResponse({ status: 200, description: 'The updated location.', type: Location })
  @ApiResponse({ status: 404, description: 'Location not found.' })
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
    summary: 'Delete a location by ID',
    description: 'Deletes a location by ID. If the location has children, their parent will be set to null.'
  })
  @ApiResponse({ status: 200, description: 'Location deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Location not found.' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.logger.log(`Received request to delete location with ID ${id}`);
    return this.locationService.delete(id);
  }
}