import { Test, TestingModule } from '@nestjs/testing';
import { CarListingService } from './car-listing.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CarList } from './car-listing.entity';
import { CreateCarListingProvider } from './providers/create-car-listing.provider';
import { UpdateCarListingProvider } from './providers/update-car-listing.provider';
import { PaginationProvider } from '../common/pagination/providers/pagination.provider';
import { CreateCarListDto } from './dtos/create-car-listing.dto';
import { ActiveUserData } from '../auth/interfaces/active-user.interface';
import { PriceRange } from './enums/price-range.enum';
import { CarBodyType } from './enums/car-body-types.enum';
import { CarStatus } from './enums/car-status.enum';
import { PaginationQueryDto } from '../common/pagination/dtos/pagination-query.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Role } from '../auth/enums/role.enum';

const mockCarListRepository = {
  createQueryBuilder: jest.fn(),
  findOneBy: jest.fn(),
  remove: jest.fn(),
  save: jest.fn(),
};

const mockCreateCarListingProvider = {
  create: jest.fn(),
};

const mockUpdateCarListingProvider = {
  update: jest.fn(),
};

const mockPaginationProvider = {
  paginateQuery: jest.fn(),
};

jest.mock('./utils/price.utils', () => ({
  getPriceBounds: jest.fn((priceRange) => {
    switch (priceRange) {
      case PriceRange.LOW:
        return { min: 0, max: 10000 };
      case PriceRange.MID:
        return { min: 10001, max: 20000 };
      case PriceRange.HIGH:
        return { min: 20001, max: undefined };
      default:
        return { min: undefined, max: undefined };
    }
  }),
}));

describe('CarListingService', () => {
  let service: CarListingService;
  let carListRepository: Repository<CarList>;
  let createCarListingProvider: CreateCarListingProvider;
  let updateCarListingProvider: UpdateCarListingProvider;
  let paginationProvider: PaginationProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarListingService,
        {
          provide: getRepositoryToken(CarList),
          useValue: mockCarListRepository,
        },
        {
          provide: CreateCarListingProvider,
          useValue: mockCreateCarListingProvider,
        },
        {
          provide: UpdateCarListingProvider,
          useValue: mockUpdateCarListingProvider,
        },
        {
          provide: PaginationProvider,
          useValue: mockPaginationProvider,
        },
      ],
    }).compile();

    service = module.get<CarListingService>(CarListingService);
    carListRepository = module.get<Repository<CarList>>(
      getRepositoryToken(CarList),
    );
    createCarListingProvider = module.get<CreateCarListingProvider>(
      CreateCarListingProvider,
    );
    updateCarListingProvider = module.get<UpdateCarListingProvider>(
      UpdateCarListingProvider,
    );
    paginationProvider = module.get<PaginationProvider>(PaginationProvider);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should delegate creation to createCarListingProvider', async () => {
      const createDto: CreateCarListDto = {
        /* ... minimal valid dto */
      } as CreateCarListDto;
      const modelId = 1;
      const manufacturerId = 2;
      const user: ActiveUserData = {
        sub: 1,
        email: 'test@example.com',
        role: Role.User,
        tokenVersion: 0,
      };
      const files: Express.Multer.File[] = [];
      const expectedResult = { id: 1, ...createDto };

      mockCreateCarListingProvider.create.mockResolvedValue(expectedResult);

      const result = await service.create(
        createDto,
        modelId,
        manufacturerId,
        user,
        files,
      );

      expect(createCarListingProvider.create).toHaveBeenCalledWith(
        createDto,
        modelId,
        manufacturerId,
        user,
        files,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAll', () => {
    const mockQueryBuilder: Partial<SelectQueryBuilder<CarList>> = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
    };

    beforeEach(() => {
      (mockQueryBuilder.leftJoinAndSelect as jest.Mock)
        .mockClear()
        .mockReturnThis();
      (mockQueryBuilder.andWhere as jest.Mock).mockClear().mockReturnThis();

      mockCarListRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as SelectQueryBuilder<CarList>,
      );
      mockPaginationProvider.paginateQuery.mockResolvedValue({
        data: [],
        total: 0,
      });
    });

    it('should call createQueryBuilder', async () => {
      await service.getAll({});
      expect(carListRepository.createQueryBuilder).toHaveBeenCalledWith('car');
    });

    it('should apply year filter if provided', async () => {
      const filters = { year: 2020 };
      await service.getAll(filters);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'car.year = :year',
        {
          year: 2020,
        },
      );
    });

    it('should apply priceRange filter for min and max bounds', async () => {
      const filters = { priceRange: PriceRange.LOW };
      await service.getAll(filters);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'CAST(car.price AS NUMERIC) BETWEEN :min AND :max',
        { min: 0, max: 10000 },
      );
    });

    it('should apply priceRange filter for min only (e.g., HIGH)', async () => {
      const filters = { priceRange: PriceRange.HIGH };
      await service.getAll(filters);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'CAST(car.price AS NUMERIC) > :min',
        { min: 20001 },
      );
    });

    it('should apply model filter if provided', async () => {
      const filters = { model: 'audi' };
      await service.getAll(filters);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'model.model ILIKE :model',
        {
          model: '%audi%',
        },
      );
    });

    it('should apply manufacturer filter if provided', async () => {
      const filters = { manufacturer: 'bmw' };
      await service.getAll(filters);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'manufacturer.make ILIKE :manufacturer',
        {
          manufacturer: '%bmw%',
        },
      );
    });

    it('should apply city filter if provided', async () => {
      const filters = { city: 'tbilisi' };
      await service.getAll(filters);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'car.city ILIKE :city',
        {
          city: '%tbilisi%',
        },
      );
    });

    it('should apply bodyType filter if provided', async () => {
      const filters = { bodyType: CarBodyType.SUV };
      await service.getAll(filters);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'car.bodyType ILIKE :bodyType',
        {
          bodyType: `%${CarBodyType.SUV}%`,
        },
      );
    });

    it('should apply carStatus filter if provided', async () => {
      const filters = { carStatus: CarStatus.NEW };
      await service.getAll(filters);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'car.carStatus = :carStatus',
        {
          carStatus: filters.carStatus,
        },
      );
    });

    it('should apply inStock filter for true', async () => {
      const filters = { inStock: true };
      await service.getAll(filters);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'car.inStock = :inStock',
        {
          inStock: true,
        },
      );
    });

    it('should apply inStock filter for false', async () => {
      const filters = { inStock: false };
      await service.getAll(filters);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'car.inStock = :inStock',
        {
          inStock: false,
        },
      );
    });

    it('should call paginationProvider.paginateQuery', async () => {
      const paginationDto: PaginationQueryDto = { limit: 5, page: 2 };
      await service.getAll({}, paginationDto);
      expect(paginationProvider.paginateQuery).toHaveBeenCalledWith(
        { limit: paginationDto.limit, page: paginationDto.page },
        carListRepository,
      );
    });

    it('should throw BadRequestException on unexpected error from query builder', async () => {
      jest.clearAllMocks();

      mockCarListRepository.createQueryBuilder.mockImplementation(() => {
        throw new Error('Database connection failed');
      });

      mockPaginationProvider.paginateQuery.mockReset();

      await expect(service.getAll({})).rejects.toThrow(
        new BadRequestException('Database connection failed'),
      );

      expect(carListRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockPaginationProvider.paginateQuery).not.toHaveBeenCalled();
      expect(
        mockQueryBuilder.leftJoinAndSelect as jest.Mock,
      ).not.toHaveBeenCalled();
      expect(mockQueryBuilder.andWhere as jest.Mock).not.toHaveBeenCalled();
    });
  });

  describe('getOne', () => {
    it('should return car if found', async () => {
      const carId = 1;
      const mockCar = { id: carId, model: 'Test Car' };
      mockCarListRepository.findOneBy.mockResolvedValue(mockCar);

      const result = await service.getOne(carId);
      expect(carListRepository.findOneBy).toHaveBeenCalledWith({ id: carId });
      expect(result).toEqual(mockCar);
    });

    it('should throw NotFoundException if car not found', async () => {
      const carId = 1;
      mockCarListRepository.findOneBy.mockResolvedValue(null);

      await expect(service.getOne(carId)).rejects.toThrow(NotFoundException);
      await expect(service.getOne(carId)).rejects.toThrow('Car list not found');
    });

    it('should re-throw NotFoundException if already a NotFoundException', async () => {
      const carId = 1;
      mockCarListRepository.findOneBy.mockRejectedValue(
        new NotFoundException('Specific not found'),
      );

      await expect(service.getOne(carId)).rejects.toThrow(NotFoundException);
      await expect(service.getOne(carId)).rejects.toThrow('Specific not found');
    });

    it('should throw BadRequestException on other errors', async () => {
      const carId = 1;
      mockCarListRepository.findOneBy.mockRejectedValue(new Error('DB error'));

      await expect(service.getOne(carId)).rejects.toThrow(BadRequestException);
      await expect(service.getOne(carId)).rejects.toThrow(Error);
    });
  });

  describe('update', () => {
    it('should delegate update to updateCarListingProvider', async () => {
      const carId = 1;
      const attrs: Partial<CarList> = { price: 30000 };
      const files: Express.Multer.File[] = [];
      const expectedResult = { id: carId, ...attrs };

      mockUpdateCarListingProvider.update.mockResolvedValue(expectedResult);

      const result = await service.update(carId, attrs, files);

      expect(updateCarListingProvider.update).toHaveBeenCalledWith(
        carId,
        attrs,
        files,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('delete', () => {
    it('should remove car and return success message if found', async () => {
      const carId = 1;
      const mockCar = { id: carId, model: 'Car to delete' };
      mockCarListRepository.findOneBy.mockResolvedValue(mockCar);
      mockCarListRepository.remove.mockResolvedValue(mockCar);

      const result = await service.delete(carId);

      expect(carListRepository.findOneBy).toHaveBeenCalledWith({ id: carId });
      expect(carListRepository.remove).toHaveBeenCalledWith(mockCar);
      expect(result).toEqual({ deleted: true, id: carId });
    });

    it('should throw NotFoundException if car not found', async () => {
      const carId = 1;
      mockCarListRepository.findOneBy.mockResolvedValue(null);

      await expect(service.delete(carId)).rejects.toThrow(NotFoundException);
      expect(carListRepository.remove).not.toHaveBeenCalled();
    });

    it('should re-throw NotFoundException if already a NotFoundException', async () => {
      const carId = 1;
      mockCarListRepository.findOneBy.mockRejectedValue(
        new NotFoundException('Item not found'),
      );

      await expect(service.delete(carId)).rejects.toThrow(NotFoundException);
      await expect(service.delete(carId)).rejects.toThrow('Item not found');
    });

    it('should throw BadRequestException on other errors', async () => {
      const carId = 1;
      mockCarListRepository.findOneBy.mockResolvedValue({ id: carId });
      mockCarListRepository.remove.mockRejectedValue(
        new Error('DB delete error'),
      );

      await expect(service.delete(carId)).rejects.toThrow(BadRequestException);
      await expect(service.delete(carId)).rejects.toThrow(Error);
    });
  });
});
