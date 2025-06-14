import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CarModel } from './car-model.entity';
import { Repository } from 'typeorm';
import { CreateCarModelDto } from './dtos/create-car-model.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CarModelProvider } from './providers/car-model.provider';

@Injectable()
export class CarModelService {
  constructor(
    @InjectRepository(CarModel)
    private readonly carModelRepository: Repository<CarModel>,

    private readonly carModelProvider: CarModelProvider,
  ) {}

  async create(createCarModelDto: CreateCarModelDto) {
    return this.carModelProvider.create(createCarModelDto);
  }

  async getAll() {
    try {
      return await this.carModelRepository.find();
    } catch (error) {
      throw new BadRequestException(error);
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
      throw new BadRequestException(error);
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
      throw new BadRequestException(error);
    }
  }
}
