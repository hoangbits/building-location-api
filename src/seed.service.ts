import { Injectable, Logger } from '@nestjs/common';
import { LocationService } from './location/location.service';
import { CreateLocationDto } from './location/dto/create-location.dto';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly locationService: LocationService) {}

  async seedData(): Promise<void> {
    this.logger.log('Seeding initial location data');

    const locations: CreateLocationDto[] = [
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
      await this.locationService.create(loc);
    }
  }
}