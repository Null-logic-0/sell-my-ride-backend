import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CarList } from './car-listing.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCarListDto } from './dtos/create-car-listing.dto';
import { CarListingProvider } from './providers/car-listing.provider';

@Injectable()
export class CarListingService {
  constructor(
    @InjectRepository(CarList)
    private readonly carListRepository: Repository<CarList>,

    private readonly carListingProvider: CarListingProvider,
  ) {}

  async create(
    createCarListingDto: CreateCarListDto,
    modelId: number,
    manufacturerId: number,
  ) {
    try {
      return await this.carListingProvider.create(
        createCarListingDto,
        modelId,
        manufacturerId,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
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
      if (error instanceof NotFoundException) {
        throw error;
      }
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
      if (error instanceof NotFoundException) {
        throw error;
      }
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
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }
}
