import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
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

  /**
   * Creates a new location with the provided data.
   * Validates the parent location (if specified) to ensure it exists and is not soft-deleted.
   */
  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    this.logger.log(`Creating location: ${createLocationDto.locationName}`);

    const location = this.locationRepository.create(createLocationDto);

    if (createLocationDto.parentId) {
      const parent = await this.locationRepository.findOne({
        where: { id: createLocationDto.parentId, deletedAt: IsNull() },
      });
      if (!parent) {
        this.logger.error(
          `Parent location with ID ${createLocationDto.parentId} not found `,
        );
        throw new NotFoundException(
          `Parent location with ID ${createLocationDto.parentId} not found `,
        );
      }
      location.parent = parent;
    }

    return this.locationRepository.save(location);
  }

  /**
   * Retrieves all locations, excluding soft-deleted ones.
   * Includes parent and children relations.
   */
  async findAll(): Promise<Location[]> {
    this.logger.log('Fetching all locations');
    return this.locationRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['parent', 'children'],
    });
  }

  /**
   * Retrieves a single location by ID, excluding soft-deleted ones.
   * Includes parent and children relations.
   * Throws NotFoundException if the location is not found or is soft-deleted.
   */
  async findOne(id: number): Promise<Location> {
    this.logger.log(`Fetching location with ID ${id}`);

    const location = await this.locationRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['parent', 'children'],
    });

    if (!location) {
      this.logger.error(`Location with ID ${id} not found `);
      throw new NotFoundException(`Location with ID ${id} not found `);
    }

    return location;
  }

  /**
   * Updates a location by ID with the provided data.
   * Validates the new parent (if specified) to ensure it exists and is not soft-deleted.
   * Throws NotFoundException if the location or parent is not found or is soft-deleted.
   */
  async update(id: number, updateLocationDto: UpdateLocationDto): Promise<Location> {
    this.logger.log(`Updating location with ID ${id}`);

    const location = await this.findOne(id);

    if (updateLocationDto.parentId !== undefined) {
      if (updateLocationDto.parentId === null) {
        location.parent = null;
      } else {
        const parent = await this.locationRepository.findOne({
          where: { id: updateLocationDto.parentId, deletedAt: IsNull() },
        });
        if (!parent) {
          this.logger.error(
            `Parent location with ID ${updateLocationDto.parentId} not found `,
          );
          throw new NotFoundException(
            `Parent location with ID ${updateLocationDto.parentId} not found `,
          );
        }
        if (parent.id === location.id) {
          this.logger.error(`Location with ID ${id} cannot be its own parent`);
          throw new NotFoundException(`Location cannot be its own parent`);
        }
        location.parent = parent;
      }
    }

    if (updateLocationDto.building !== undefined) {
      location.building = updateLocationDto.building;
    }
    if (updateLocationDto.locationName !== undefined) {
      location.locationName = updateLocationDto.locationName;
    }
    if (updateLocationDto.locationNumber !== undefined) {
      location.locationNumber = updateLocationDto.locationNumber;
    }
    if (updateLocationDto.area !== undefined) {
      location.area = updateLocationDto.area;
    }

    return this.locationRepository.save(location);
  }

  /**
   * Soft-deletes a location by ID.
   * Sets the parent of all children to null before soft-deleting.
   */
  async delete(id: number): Promise<void> {
    this.logger.log(`Soft-deleting location with ID ${id}`);

    const location = await this.findOne(id);

    if (location.children && location.children.length > 0) {
      this.logger.log(
        `Setting parent to null for ${location.children.length} children of location ID ${id}`,
      );
      for (const child of location.children) {
        child.parent = null;
        await this.locationRepository.save(child);
      }
    }

    await this.locationRepository.softDelete(id);
    this.logger.log(`Location with ID ${id} soft-deleted successfully`);
  }


}