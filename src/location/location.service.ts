import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

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

  async update(id: number, updateLocationDto: UpdateLocationDto): Promise<Location> {
    this.logger.log(`Updating location with ID ${id}`);

    const location = await this.findOne(id);

    if (updateLocationDto.parentId !== undefined) {
      if (updateLocationDto.parentId === null) {
        // still no parent then nilify it.
        location.parent = null;
      } else {
        const parent = await this.locationRepository.findOne({ where: { id: updateLocationDto.parentId } });
        if (!parent) {
          this.logger.error(`Parent location with ID ${updateLocationDto.parentId} not found`);
          throw new NotFoundException(`Parent location with ID ${updateLocationDto.parentId} not found`);
        }
        if (parent.id === location.id) {
          this.logger.error(`Location with ID ${id} cannot be its own parent`);
          throw new NotFoundException(`Location cannot be its own parent`);
        }
        location.parent = parent;
      }
    }

    if (updateLocationDto.building !== undefined) location.building = updateLocationDto.building;
    if (updateLocationDto.locationName !== undefined) location.locationName = updateLocationDto.locationName;
    if (updateLocationDto.locationNumber !== undefined) location.locationNumber = updateLocationDto.locationNumber;
    if (updateLocationDto.area !== undefined) location.area = updateLocationDto.area;

    return this.locationRepository.save(location);
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Deleting location with ID ${id}`);

    const location = await this.findOne(id);

    // If the location has children, set their parent to null
    if (location.children && location.children.length > 0) {
      this.logger.log(`Setting parent to null for ${location.children.length} children of location ID ${id}`);
      for (const child of location.children) {
        child.parent = null;
        await this.locationRepository.save(child);
      }
    }

    await this.locationRepository.remove(location);
    this.logger.log(`Location with ID ${id} deleted successfully`);
  }
}