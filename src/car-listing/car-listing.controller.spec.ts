import { Test, TestingModule } from '@nestjs/testing';
import { CarListingController } from './car-listing.controller';

describe('CarListingController', () => {
  let controller: CarListingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarListingController],
    }).compile();

    controller = module.get<CarListingController>(CarListingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
