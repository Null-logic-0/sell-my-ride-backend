import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CarModel } from './car-model.entity';
import { Repository } from 'typeorm';
import { CreateCarModelDto } from './dtos/create-car-model.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CarModelService {
  constructor(
    @InjectRepository(CarModel)
    private readonly carModelRepository: Repository<CarModel>,
  ) {}

  async create(createCarModelDto: CreateCarModelDto) {
    try {
      const newCarModel = this.carModelRepository.create({
        model: createCarModelDto.model,
      });

      return await this.carModelRepository.save(newCarModel);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        error || error.message || 'Failed to create car model.',
      );
    }
  }

  async getAll() {
    try {
      return await this.carModelRepository.find({
        order: {
          updatedAt: 'DESC',
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message || error);
    }
  }

  async getOne(id: number) {
    try {
      const model = await this.carModelRepository.findOneBy({ id });
      if (!model) {
        throw new NotFoundException('Car model not found with this ID!');
      }
      return model;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message || error);
    }
  }

  async update(id: number, attrs: Partial<CarModel>) {
    try {
      const carModel = await this.carModelRepository.findOneBy({ id });
      if (!carModel) {
        throw new NotFoundException('Car model not found with this ID!');
      }

      Object.assign(carModel, attrs);
      return this.carModelRepository.save(carModel);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message || error);
    }
  }

  async delete(id: number) {
    try {
      const carModel = await this.carModelRepository.findOneBy({ id });
      if (!carModel) {
        throw new NotFoundException('Car model not found with this ID!');
      }

      await this.carModelRepository.remove(carModel);
      return {
        deleted: true,
        id,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message || error);
    }
  }
}
