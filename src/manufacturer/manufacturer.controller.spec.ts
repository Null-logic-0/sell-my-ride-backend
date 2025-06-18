import { Test, TestingModule } from '@nestjs/testing';
import { ManufacturerController } from './manufacturer.controller';
import { ManufacturerService } from './manufacturer.service';
import { CreateManufacturerDto } from './dtos/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dtos/update-manufacturer.dto';

const mockManufacturerService = {
  getAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('ManufacturerController', () => {
  let controller: ManufacturerController;
  let service: ManufacturerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManufacturerController],
      providers: [
        {
          provide: ManufacturerService,
          useValue: mockManufacturerService,
        },
      ],
    }).compile();

    controller = module.get<ManufacturerController>(ManufacturerController);
    service = module.get<ManufacturerService>(ManufacturerService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllManufacturers', () => {
    it('should call manufacturerService.getAll and return the result', async () => {
      const expectedResult = [{ id: 1, make: 'BMW' }];
      mockManufacturerService.getAll.mockResolvedValue(expectedResult);

      const result = await controller.getAllManufacturers();

      expect(service.getAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createManufacturer', () => {
    it('should call manufacturerService.create with the provided DTO', async () => {
      const createDto: CreateManufacturerDto = { make: 'Tesla' };
      const expectedResult = { id: 2, ...createDto };
      mockManufacturerService.create.mockResolvedValue(expectedResult);

      const result = await controller.createManufacturer(createDto);

      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateManufacturer', () => {
    it('should call manufacturerService.update with the provided id and DTO', async () => {
      const manufacturerId = 1;
      const updateDto: UpdateManufacturerDto = { make: 'Mercedes-Benz' };
      const expectedResult = { id: manufacturerId, make: 'Mercedes-Benz' };
      mockManufacturerService.update.mockResolvedValue(expectedResult);

      const result = await controller.updateManufacturer(
        manufacturerId,
        updateDto,
      );

      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(manufacturerId, updateDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteManufacturer', () => {
    it('should call manufacturerService.delete with the provided id', async () => {
      const manufacturerId = 1;
      const expectedResult = { deleted: true, id: manufacturerId };
      mockManufacturerService.delete.mockResolvedValue(expectedResult);

      const result = await controller.deleteManufacturer(manufacturerId);

      expect(service.delete).toHaveBeenCalledTimes(1);
      expect(service.delete).toHaveBeenCalledWith(manufacturerId);
      expect(result).toEqual(expectedResult);
    });
  });
});
