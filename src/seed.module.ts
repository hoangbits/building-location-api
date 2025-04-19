


import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { LocationModule } from './location/location.module';

@Module({
  imports: [LocationModule], // Import LocationModule to inject LocationService
  providers: [SeedService],
  exports: [SeedService], // Export SeedService so it can be used in AppModule
})
export class SeedModule {}