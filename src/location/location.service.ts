import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';
import { CreateLocationDto } from './dto/create-location.dto';

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);

  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    this.logger.log(`Creating location: ${createLocationDto.locationName}`);
    const location = this.locationRepository.create(createLocationDto);

    if (createLocationDto.parentId) {
      const parent = await this.locationRepository.findOne({ where: { id: createLocationDto.parentId } });
      if (!parent) {
        this.logger.error(`Parent location with ID ${createLocationDto.parentId} not found`);
        throw new NotFoundException(`Parent location with ID ${createLocationDto.parentId} not found`);
      }
      location.parent = parent;
    }

    return this.locationRepository.save(location);
  }

  async findAll(): Promise<Location[]> {
    this.logger.log('Fetching all locations');
    return this.locationRepository.find({ relations: ['parent', 'children'] });
  }

  async findOne(id: number): Promise<Location> {
    this.logger.log(`Fetching location with ID ${id}`);
    const location = await this.locationRepository.findOne({ where: { id }, relations: ['parent', 'children'] });
    if (!location) {
      this.logger.error(`Location with ID ${id} not found`);
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    return location;
  }
}