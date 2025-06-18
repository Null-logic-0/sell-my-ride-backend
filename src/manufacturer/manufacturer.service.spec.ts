import { Test, TestingModule } from '@nestjs/testing';
import { ManufacturerService } from './manufacturer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manufacturer } from './manufacturer.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateManufacturerDto } from './dtos/create-manufacturer.dto';

const mockManufacturerRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  remove: jest.fn(),
};

describe('ManufacturerService', () => {
  let service: ManufacturerService;
  let manufacturerRepository: Repository<Manufacturer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ManufacturerService,
        {
          provide: getRepositoryToken(Manufacturer),
          useValue: mockManufacturerRepository,
        },
      ],
    }).compile();

    service = module.get<ManufacturerService>(ManufacturerService);
    manufacturerRepository = module.get<Repository<Manufacturer>>(
      getRepositoryToken(Manufacturer),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a new manufacturer', async () => {
      const createDto: CreateManufacturerDto = { make: 'New Make' };
      const newManufacturer = { id: 1, ...createDto } as Manufacturer;
      mockManufacturerRepository.create.mockReturnValue(newManufacturer);
      mockManufacturerRepository.save.mockResolvedValue(newManufacturer);

      const result = await service.create(createDto);

      expect(manufacturerRepository.create).toHaveBeenCalledTimes(1);
      expect(manufacturerRepository.create).toHaveBeenCalledWith(createDto);
      expect(manufacturerRepository.save).toHaveBeenCalledTimes(1);
      expect(manufacturerRepository.save).toHaveBeenCalledWith(newManufacturer);
      expect(result).toEqual(newManufacturer);
    });

    it('should throw BadRequestException on database error during creation', async () => {
      const createDto: CreateManufacturerDto = { make: 'Error Make' };
      const dbError = new Error('Unique constraint violation');

      mockManufacturerRepository.create.mockReturnValue({ ...createDto });
      mockManufacturerRepository.save.mockRejectedValue(dbError);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createDto)).rejects.toThrow(dbError.message);
    });
  });

  describe('getAll', () => {
    it('should return all manufacturers', async () => {
      const allManufacturers: Manufacturer[] = [
        { id: 1, make: 'BMW' },
        { id: 2, make: 'Mercedes-Benz' },
      ];
      mockManufacturerRepository.find.mockResolvedValue(allManufacturers);

      const result = await service.getAll();

      expect(manufacturerRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(allManufacturers);
    });

    it('should throw BadRequestException on database error during fetching all', async () => {
      const dbError = new Error('Connection refused');
      mockManufacturerRepository.find.mockRejectedValue(dbError);

      await expect(service.getAll()).rejects.toThrow(BadRequestException);
      await expect(service.getAll()).rejects.toThrow(dbError.message);
    });
  });

  describe('update', () => {
    const manufacturerId = 1;
    const existingManufacturer: Manufacturer = {
      id: manufacturerId,
      make: 'Old Make',
    };
    const updateAttrs: Partial<Manufacturer> = { make: 'Updated Make' };
    const updatedManufacturer: Manufacturer = {
      ...existingManufacturer,
      ...updateAttrs,
    };

    it('should successfully update a manufacturer', async () => {
      mockManufacturerRepository.findOneBy.mockResolvedValue(
        existingManufacturer,
      );
      mockManufacturerRepository.save.mockResolvedValue(updatedManufacturer);

      const result = await service.update(manufacturerId, updateAttrs);

      expect(manufacturerRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(manufacturerRepository.findOneBy).toHaveBeenCalledWith({
        id: manufacturerId,
      });
      expect(manufacturerRepository.save).toHaveBeenCalledTimes(1);
      expect(manufacturerRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updatedManufacturer),
      );
      expect(result).toEqual(updatedManufacturer);
    });

    it('should throw NotFoundException if manufacturer not found', async () => {
      mockManufacturerRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(manufacturerId, updateAttrs)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(manufacturerId, updateAttrs)).rejects.toThrow(
        'Manufacturer not found with this ID!',
      );
      expect(manufacturerRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException on other database error during update', async () => {
      const dbError = new BadRequestException();
      mockManufacturerRepository.findOneBy.mockResolvedValue(
        existingManufacturer,
      );
      mockManufacturerRepository.save.mockRejectedValue(dbError);

      await expect(service.update(manufacturerId, updateAttrs)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.update(manufacturerId, updateAttrs)).rejects.toThrow(
        dbError.message,
      );
    });
  });

  describe('delete', () => {
    const manufacturerId = 1;
    const existingManufacturer: Manufacturer = {
      id: manufacturerId,
      make: 'Make to Delete',
    };

    it('should successfully delete a manufacturer', async () => {
      mockManufacturerRepository.findOneBy.mockResolvedValue(
        existingManufacturer,
      );
      mockManufacturerRepository.remove.mockResolvedValue(existingManufacturer);

      const result = await service.delete(manufacturerId);

      expect(manufacturerRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(manufacturerRepository.findOneBy).toHaveBeenCalledWith({
        id: manufacturerId,
      });
      expect(manufacturerRepository.remove).toHaveBeenCalledTimes(1);
      expect(manufacturerRepository.remove).toHaveBeenCalledWith(
        existingManufacturer,
      );
      expect(result).toEqual({ deleted: true, id: manufacturerId });
    });

    it('should throw NotFoundException if manufacturer not found', async () => {
      mockManufacturerRepository.findOneBy.mockResolvedValue(null);

      await expect(service.delete(manufacturerId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.delete(manufacturerId)).rejects.toThrow(
        'Manufacturer not found with this ID!',
      );
      expect(manufacturerRepository.remove).not.toHaveBeenCalled();
    });

    it('should re-throw NotFoundException if it was the original error during delete', async () => {
      const notFoundError = new NotFoundException(
        'Specific error for testing re-throw',
      );
      mockManufacturerRepository.findOneBy.mockRejectedValue(notFoundError);

      await expect(service.delete(manufacturerId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.delete(manufacturerId)).rejects.toThrow(
        'Specific error for testing re-throw',
      );
    });

    it('should throw BadRequestException on other database error during delete', async () => {
      const dbError = new Error('Data integrity issue');
      mockManufacturerRepository.findOneBy.mockResolvedValue(
        existingManufacturer,
      );
      mockManufacturerRepository.remove.mockRejectedValue(dbError);

      await expect(service.delete(manufacturerId)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.delete(manufacturerId)).rejects.toThrow(
        dbError.message,
      );
    });
  });
});
