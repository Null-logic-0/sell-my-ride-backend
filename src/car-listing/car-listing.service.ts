import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CarList } from './car-listing.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCarListDto } from './dtos/create-car-listing.dto';

@Injectable()
export class CarListingService {
  constructor(
    @InjectRepository(CarList)
    private readonly carListRepository: Repository<CarList>,
  ) {}

  async create(createCarListingDto: CreateCarListDto) {
    try {
      const newCarListing = this.carListRepository.create(createCarListingDto);
      return await this.carListRepository.save(newCarListing);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getAll() {
    try {
      return await this.carListRepository.find();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getOne(id: number) {
    try {
      const car = await this.carListRepository.findOneBy({ id });
      if (!car) {
        throw new NotFoundException('Car list not found');
      }
      return car;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: number, attrs: Partial<CarList>) {
    try {
      const car = await this.carListRepository.findOneBy({ id });
      if (!car) {
        throw new NotFoundException('Car list not found');
      }

      Object.assign(car, attrs);
      return this.carListRepository.save(car);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async delete(id: number) {
    try {
      const car = await this.carListRepository.findOneBy({ id });
      if (!car) {
        throw new NotFoundException('Car list not found');
      }

      await this.carListRepository.remove(car);
      return {
        deleted: true,
        id,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
