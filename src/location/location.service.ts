


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

  async seedData(): Promise<void> {
    this.logger.log('Seeding initial location data');

    const locations = [
      { building: 'A', locationName: 'Car Park', locationNumber: 'A-CarPark', area: 80.62 },
      { building: 'A', locationName: 'Level 1', locationNumber: 'A-01', area: 100.92 },
      { building: 'A', locationName: 'Lobby Level1', locationNumber: 'A-01-Lobby', area: 80.62, parentId: 2 },
      { building: 'A', locationName: 'Corridor Level 1', locationNumber: 'A-01-Corridor', area: 30.2, parentId: 2 },
      { building: 'A', locationName: 'Master Room', locationNumber: 'A-01-01', area: 50.11, parentId: 2 },
      { building: 'A', locationName: 'Meeting Room 1', locationNumber: 'A-01-01-M1', area: 20.11, parentId: 5 },
      { building: 'A', locationName: 'Meeting Room 2', locationNumber: 'A-01-01-M2', area: 20.11, parentId: 5 },
      { building: 'A', locationName: 'Toilet Level 1', locationNumber: 'A-01-02', area: 30.2, parentId: 2 },
      { building: 'B', locationName: 'Level 5', locationNumber: 'B-05', area: 150.0 },
      { building: 'B', locationName: 'Utility Room', locationNumber: 'B-05-11', area: 10.2, parentId: 9 },
      { building: 'B', locationName: 'Sanitary Room', locationNumber: 'B-05-12', area: 12.2, parentId: 9 },
      { building: 'B', locationName: 'Male Toilet', locationNumber: 'B-05-13', area: 30.2, parentId: 9 },
      { building: 'B', locationName: 'Genset Room', locationNumber: 'B-05-14', area: 35.2, parentId: 9 },
      { building: 'B', locationName: 'Pantry Level 5', locationNumber: 'B-05-15', area: 50.2, parentId: 9 },
      { building: 'B', locationName: 'Corridor Level 5', locationNumber: 'B-05-Corridor', area: 30.0, parentId: 9 },
    ];

    for (const loc of locations) {
      await this.create(loc as CreateLocationDto);
    }
  }
}