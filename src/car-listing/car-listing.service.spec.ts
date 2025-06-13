import { Test, TestingModule } from '@nestjs/testing';
import { CarListingService } from './car-listing.service';

describe('CarListingService', () => {
  let service: CarListingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarListingService],
    }).compile();

    service = module.get<CarListingService>(CarListingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
