import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CarModel } from '../car-model.entity';
import { Manufacturer } from 'src/manufacturer/manufacturer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCarModelDto } from '../dtos/create-car-model.dto';

@Injectable()
export class CarModelProvider {
  constructor(
    @InjectRepository(CarModel)
    private readonly carModelRepository: Repository<CarModel>,

    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,
  ) {}
  async create(createCarModelDto: CreateCarModelDto) {
    try {
      const manufacturer = await this.manufacturerRepository.findOneBy({
        id: createCarModelDto.manufacturerId,
      });

      if (!manufacturer) {
        throw new NotFoundException('Manufacturer not found');
      }

      const newCarModel = this.carModelRepository.create({
        model: createCarModelDto.model,
        manufacturer,
      });

      return await this.carModelRepository.save(newCarModel);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error || 'Failed to create car model.');
    }
  }
}
