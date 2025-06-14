import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Manufacturer } from './manufacturer.entity';
import { Repository } from 'typeorm';
import { CreateManufacturerDto } from './dtos/create-manufacturer.dto';

@Injectable()
export class ManufacturerService {
  constructor(
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,
  ) {}

  async create(createManufacturerDto: CreateManufacturerDto) {
    try {
      const newManufacturer = this.manufacturerRepository.create(
        createManufacturerDto,
      );

      return await this.manufacturerRepository.save(newManufacturer);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getAll() {
    try {
      return await this.manufacturerRepository.find();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: number, attrs: Partial<Manufacturer>) {
    try {
      const manufacturer = await this.manufacturerRepository.findOneBy({ id });
      if (!manufacturer) {
        throw new NotFoundException('Manufacturer not found with this ID!');
      }

      Object.assign(manufacturer, attrs);
      return this.manufacturerRepository.save(manufacturer);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
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
