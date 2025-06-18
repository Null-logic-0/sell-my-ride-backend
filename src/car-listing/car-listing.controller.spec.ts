import { Test, TestingModule } from '@nestjs/testing';
import { CarListingController } from './car-listing.controller';
import { CarListingService } from './car-listing.service';
import { CreateCarListDto } from './dtos/create-car-listing.dto';
import { UpdateCarListingDto } from './dtos/update-car-listing.dto';
import { ActiveUserData } from '../auth/interfaces/active-user.interface';
import { PaginationQueryDto } from '../common/pagination/dtos/pagination-query.dto';
import { PriceRange } from './enums/price-range.enum';
import { CarBodyType } from './enums/car-body-types.enum';
import { CarStatus } from './enums/car-status.enum';
import { CarColor } from './enums/car-color.enum';
import { CabinColor } from './enums/cabin-color.enum';
import { CabinMaterial } from './enums/cabin-material.enum';
import { FuelType } from './enums/fuel-type.enum';
import { NumOfCylinders } from './enums/number-of-cylinders.enum';
import { Role } from '../auth/enums/role.enum';
import { MileageType } from './enums/mileage-type.enum';
import { SteeringWheel } from './enums/steering-wheel.enum';
import { DriveWheels } from './enums/drive-wheels.enum';
import { DoorNumbers } from './enums/door-numbers.enum';
import { Airbag } from './enums/airbag.enum';
import { Transmission } from './enums/transmission.enum';

const mockCarListingService = {
  getAll: jest.fn(),
  create: jest.fn(),
  getOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('CarListingController', () => {
  let controller: CarListingController;
  let service: CarListingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarListingController],
      providers: [
        {
          provide: CarListingService,
          useValue: mockCarListingService,
        },
      ],
    }).compile();

    controller = module.get<CarListingController>(CarListingController);
    service = module.get<CarListingService>(CarListingService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllCarLists', () => {
    it('should call carListingService.getAll with provided query parameters', async () => {
      const mockQueryResult = [{ id: 1, model: 'M3' }];
      mockCarListingService.getAll.mockResolvedValue(mockQueryResult);

      const queryParams = {
        year: 2020,
        priceRange: PriceRange.LOW,
        model: 'X5',
        manufacturer: 'BMW',
        city: 'Tbilisi',
        bodyType: CarBodyType.SUV,
        carStatus: CarStatus.NEW,
        inStock: true,
      };
      const pagination: PaginationQueryDto = { limit: 10, page: 1 };

      const result = await controller.getAllCarLists(
        queryParams.year,
        queryParams.priceRange,
        queryParams.model,
        queryParams.manufacturer,
        queryParams.city,
        queryParams.bodyType,
        queryParams.carStatus,
        queryParams.inStock,
        pagination,
      );

      expect(service.getAll).toHaveBeenCalledWith(
        {
          year: queryParams.year,
          priceRange: queryParams.priceRange,
          model: queryParams.model,
          manufacturer: queryParams.manufacturer,
          city: queryParams.city,
          bodyType: queryParams.bodyType,
          carStatus: queryParams.carStatus,
          inStock: queryParams.inStock,
        },
        pagination,
      );
      expect(result).toEqual(mockQueryResult);
    });

    it('should call carListingService.getAll with default (undefined) query parameters and pagination', async () => {
      const mockQueryResult = [{ id: 1, model: 'Default' }];
      mockCarListingService.getAll.mockResolvedValue(mockQueryResult);

      const pagination: PaginationQueryDto = { limit: 5, page: 1 };

      const result = await controller.getAllCarLists(
        undefined, // year
        undefined, // priceRange
        undefined, // model
        undefined, // manufacturer
        undefined, // city
        undefined, // bodyType
        undefined, // carStatus
        undefined, // inStock
        pagination,
      );

      expect(service.getAll).toHaveBeenCalledWith(
        {
          year: undefined,
          priceRange: undefined,
          model: undefined,
          manufacturer: undefined,
          city: undefined,
          bodyType: undefined,
          carStatus: undefined,
          inStock: undefined,
        },
        pagination,
      );
      expect(result).toEqual(mockQueryResult);
    });
  });

  describe('createCarListing', () => {
    it('should call carListingService.create with correct arguments, including files and user', async () => {
      const createDto: CreateCarListDto = {
        modelId: 1,
        manufacturerId: 10,
        year: 2022,
        price: 25000,
        photos: [
          'https://example.com/car-images/car1.jpg',
          'https://example.com/car-images/car2.jpg',
        ],
        description: 'Great car!',
        city: 'New York',
        region: 'USA',
        catalyst: true,
        mileageType: MileageType.KM,
        steeringWheel: SteeringWheel.LEFT,
        driveWheels: DriveWheels.FOUR_WHEEL_DRIVE,
        numberOfDoors: DoorNumbers.FOUR,
        airbag: Airbag.TWO,
        phoneNumber: '+995555277404',
        turbo: false,
        inStock: true,
        transmission: Transmission.AUTOMATIC,
        mileage: 5000,
        fuelType: FuelType.DIESEL,
        numberOfCylinders: NumOfCylinders.SIX,
        engineCapacity: 2.0,
        cabinColor: CabinColor.BLACK,
        carColor: CarColor.BLACK,
        cabinMaterial: CabinMaterial.LEATHER,
        bodyType: CarBodyType.SEDAN,
        carStatus: CarStatus.NEW,
      };
      const files: Express.Multer.File[] = [
        {
          originalname: 'pic1.jpg',
          buffer: Buffer.from('abc'),
        } as Express.Multer.File,
        {
          originalname: 'pic2.png',
          buffer: Buffer.from('def'),
        } as Express.Multer.File,
      ];
      const activeUser: ActiveUserData = {
        sub: 1,
        email: 'test@example.com',
        role: Role.User,
        tokenVersion: 0,
      };
      const expectedResult = { id: 1, ...createDto };

      mockCarListingService.create.mockResolvedValue(expectedResult);

      const result = await controller.createCarListing(
        files,
        createDto,
        activeUser,
      );

      expect(service.create).toHaveBeenCalledWith(
        createDto,
        createDto.modelId,
        createDto.manufacturerId,
        activeUser,
        files,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getSingleCarList', () => {
    it('should call carListingService.getOne with the provided ID', async () => {
      const carId = 123;
      const expectedResult = { id: carId, model: 'Corolla' };
      mockCarListingService.getOne.mockResolvedValue(expectedResult);

      const result = await controller.getSingleCarList(carId);

      expect(service.getOne).toHaveBeenCalledWith(carId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateSingleCarList', () => {
    it('should call carListingService.update with the provided ID, DTO, and files', async () => {
      const carId = 456;
      const updateDto: UpdateCarListingDto = {
        price: 26000,
        description: 'Updated desc',
      };
      const files: Express.Multer.File[] = [
        {
          originalname: 'new_pic.jpg',
          buffer: Buffer.from('ghi'),
        } as Express.Multer.File,
      ];
      const expectedResult = { id: carId, ...updateDto };

      mockCarListingService.update.mockResolvedValue(expectedResult);

      const result = await controller.updateSingleCarList(
        files,
        carId,
        updateDto,
      );

      expect(service.update).toHaveBeenCalledWith(carId, updateDto, files);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteCarList', () => {
    it('should call carListingService.delete with the provided ID', async () => {
      const carId = 789;
      const expectedResult = { deleted: true, id: carId };
      mockCarListingService.delete.mockResolvedValue(expectedResult);

      const result = await controller.deleteCarList(carId);

      expect(service.delete).toHaveBeenCalledWith(carId);
      expect(result).toEqual(expectedResult);
    });
  });
});
