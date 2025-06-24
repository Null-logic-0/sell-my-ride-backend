import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Manufacturer } from './manufacturer.entity';
import { CreateManufacturerDto } from './dtos/create-manufacturer.dto';
import { UpdateManufacturerProvider } from './providers/update-manufacturer.provider';
import { CreateManufacturerProvider } from './providers/create-manufacturer.provider';

@Injectable()
export class ManufacturerService {
  constructor(
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,

    private readonly updateManufacturerProvider: UpdateManufacturerProvider,

    private readonly createManufacturerProvider: CreateManufacturerProvider,
  ) {}

  async create(
    createManufacturerDto: CreateManufacturerDto,
    userId: number,
    file: Express.Multer.File,
  ) {
    return this.createManufacturerProvider.create(
      createManufacturerDto,
      userId,
      file,
    );
  }

  async getAll() {
    try {
      return await this.manufacturerRepository.find({
        order: {
          updatedAt: 'DESC',
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getOne(id: number) {
    try {
      const manufacturer = await this.manufacturerRepository.findOneBy({ id });
      if (!manufacturer) {
        throw new NotFoundException('Manufacturer not found with this ID!');
      }
      return manufacturer;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async update(
    id: number,
    userId: number,
    attrs: Partial<Manufacturer>,
    file?: Express.Multer.File,
  ) {
    return this.updateManufacturerProvider.update(id, userId, attrs, file);
  }

  async delete(id: number) {
    try {
      const manufacturer = await this.manufacturerRepository.findOneBy({ id });
      if (!manufacturer) {
        throw new NotFoundException('Manufacturer not found with this ID!');
      }

      await this.manufacturerRepository.remove(manufacturer);
      return {
        deleted: true,
        id,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }
}
