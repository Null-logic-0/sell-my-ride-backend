import { Test, TestingModule } from '@nestjs/testing';
import { CarModelController } from './car-model.controller';
import { CarModelService } from './car-model.service';
import { CreateCarModelDto } from './dtos/create-car-model.dto';
import { UpdateCarModelDto } from './dtos/update-car-model.dto';

const mockCarModelService = {
  getAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('CarModelController', () => {
  let controller: CarModelController;
  let service: CarModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarModelController],
      providers: [
        {
          provide: CarModelService,
          useValue: mockCarModelService,
        },
      ],
    }).compile();

    controller = module.get<CarModelController>(CarModelController);
    service = module.get<CarModelService>(CarModelService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllModels', () => {
    it('should call carModelService.getAll and return the result', async () => {
      const expectedResult = [{ id: 1, name: 'A4' }];
      mockCarModelService.getAll.mockResolvedValue(expectedResult);

      const result = await controller.getAllModels();

      expect(service.getAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createNewModel', () => {
    it('should call carModelService.create with the provided DTO', async () => {
      const createDto: CreateCarModelDto = {
        model: 'New Model',
      };
      const expectedResult = { id: 2, ...createDto };
      mockCarModelService.create.mockResolvedValue(expectedResult);

      const result = await controller.createNewModel(createDto);

      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateModel', () => {
    it('should call carModelService.update with the provided id and DTO', async () => {
      const modelId = 1;
      const updateDto: UpdateCarModelDto = { model: 'Updated Model' };
      const expectedResult = { id: modelId, model: 'Updated Model' };
      mockCarModelService.update.mockResolvedValue(expectedResult);

      const result = await controller.updateModel(modelId, updateDto);

      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(modelId, updateDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteModel', () => {
    it('should call carModelService.delete with the provided id', async () => {
      const modelId = 1;
      const expectedResult = { deleted: true, id: modelId };
      mockCarModelService.delete.mockResolvedValue(expectedResult);

      const result = await controller.deleteModel(modelId);

      expect(service.delete).toHaveBeenCalledTimes(1);
      expect(service.delete).toHaveBeenCalledWith(modelId);
      expect(result).toEqual(expectedResult);
    });
  });
});
