import { Test, TestingModule } from '@nestjs/testing';
import { CarModelService } from './car-model.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarModel } from './car-model.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateCarModelDto } from './dtos/create-car-model.dto';
import { UpdateCarModelDto } from './dtos/update-car-model.dto';

const mockCarModelRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  remove: jest.fn(),
};

describe('CarModelService', () => {
  let service: CarModelService;
  let carModelRepository: Repository<CarModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarModelService,
        {
          provide: getRepositoryToken(CarModel),
          useValue: mockCarModelRepository,
        },
      ],
    }).compile();

    service = module.get<CarModelService>(CarModelService);
    carModelRepository = module.get<Repository<CarModel>>(
      getRepositoryToken(CarModel),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a new car model', async () => {
      const createDto: CreateCarModelDto = { model: 'Test Model 123' };
      const newCarModel = { id: 1, ...createDto } as CarModel;

      mockCarModelRepository.create.mockReturnValue(newCarModel);
      mockCarModelRepository.save.mockResolvedValue(newCarModel);

      const result = await service.create(createDto);

      expect(carModelRepository.create).toHaveBeenCalledTimes(1);
      expect(carModelRepository.create).toHaveBeenCalledWith({
        model: createDto.model,
      });
      expect(carModelRepository.save).toHaveBeenCalledTimes(1);
      expect(carModelRepository.save).toHaveBeenCalledWith(newCarModel);
      expect(result).toEqual(newCarModel);
    });

    it('should throw BadRequestException on database error during creation', async () => {
      const createDto: CreateCarModelDto = { model: 'Error Model' };
      const dbError = new Error('Database connection lost');

      mockCarModelRepository.create.mockReturnValue({ model: createDto.model });
      mockCarModelRepository.save.mockRejectedValue(dbError);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createDto)).rejects.toThrow(dbError.message);
    });

    it('should re-throw NotFoundException if it occurs during creation (though unlikely here)', async () => {
      const createDto: CreateCarModelDto = { model: 'NotFound Test' };
      const notFoundError = new NotFoundException('Some dependency not found');

      mockCarModelRepository.create.mockReturnValue({ model: createDto.model });
      mockCarModelRepository.save.mockRejectedValue(notFoundError);

      await expect(service.create(createDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(createDto)).rejects.toThrow(
        'Some dependency not found',
      );
    });
  });

  describe('getAll', () => {
    it('should return all car models', async () => {
      const allModels: CarModel[] = [
        { id: 1, model: 'Model A' },
        { id: 2, model: 'Model B' },
      ];
      mockCarModelRepository.find.mockResolvedValue(allModels);

      const result = await service.getAll();

      expect(carModelRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(allModels);
    });

    it('should throw BadRequestException on database error during fetching all', async () => {
      const dbError = new BadRequestException();
      mockCarModelRepository.find.mockRejectedValue(dbError);

      await expect(service.getAll()).rejects.toThrow(BadRequestException);
      await expect(service.getAll()).rejects.toThrow(dbError.message);
    });
  });

  describe('update', () => {
    const modelId = 1;
    const existingModel: CarModel = { id: modelId, model: 'Old Model' };
    const updateAttrs: UpdateCarModelDto = { model: 'New Model Name' };
    const updatedModel: CarModel = { ...existingModel, ...updateAttrs };

    it('should successfully update a car model', async () => {
      mockCarModelRepository.findOneBy.mockResolvedValue(existingModel);
      mockCarModelRepository.save.mockResolvedValue(updatedModel);

      const result = await service.update(modelId, updateAttrs);

      expect(carModelRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(carModelRepository.findOneBy).toHaveBeenCalledWith({
        id: modelId,
      });
      expect(carModelRepository.save).toHaveBeenCalledTimes(1);
      expect(carModelRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ ...existingModel, ...updateAttrs }),
      );
      expect(result).toEqual(updatedModel);
    });

    it('should throw NotFoundException if car model not found', async () => {
      mockCarModelRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(modelId, updateAttrs)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(modelId, updateAttrs)).rejects.toThrow(
        'Car model not found with this ID!',
      );
      expect(carModelRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException on other database error during update', async () => {
      const dbError = new BadRequestException();
      mockCarModelRepository.findOneBy.mockResolvedValue(existingModel);
      mockCarModelRepository.save.mockRejectedValue(dbError);

      await expect(service.update(modelId, updateAttrs)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.update(modelId, updateAttrs)).rejects.toThrow(
        dbError.message,
      );
    });
  });

  describe('delete', () => {
    const modelId = 1;
    const existingModel: CarModel = { id: modelId, model: 'Model to Delete' };

    it('should successfully delete a car model', async () => {
      mockCarModelRepository.findOneBy.mockResolvedValue(existingModel);
      mockCarModelRepository.remove.mockResolvedValue(existingModel);

      const result = await service.delete(modelId);

      expect(carModelRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(carModelRepository.findOneBy).toHaveBeenCalledWith({
        id: modelId,
      });
      expect(carModelRepository.remove).toHaveBeenCalledTimes(1);
      expect(carModelRepository.remove).toHaveBeenCalledWith(existingModel);
      expect(result).toEqual({ deleted: true, id: modelId });
    });

    it('should throw NotFoundException if car model not found', async () => {
      mockCarModelRepository.findOneBy.mockResolvedValue(null);

      await expect(service.delete(modelId)).rejects.toThrow(NotFoundException);
      await expect(service.delete(modelId)).rejects.toThrow(
        'Car model not found with this ID!',
      );
      expect(carModelRepository.remove).not.toHaveBeenCalled();
    });

    it('should re-throw NotFoundException if it was the original error during delete', async () => {
      const notFoundError = new NotFoundException('Specific error for testing');
      mockCarModelRepository.findOneBy.mockRejectedValue(notFoundError);

      await expect(service.delete(modelId)).rejects.toThrow(NotFoundException);
      await expect(service.delete(modelId)).rejects.toThrow(
        'Specific error for testing',
      );
    });

    it('should throw BadRequestException on other database error during delete', async () => {
      const dbError = new BadRequestException();
      mockCarModelRepository.findOneBy.mockResolvedValue(existingModel);
      mockCarModelRepository.remove.mockRejectedValue(dbError);

      await expect(service.delete(modelId)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.delete(modelId)).rejects.toThrow(dbError.message);
    });
  });
});
