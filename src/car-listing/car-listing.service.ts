import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CarList } from './car-listing.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCarListDto } from './dtos/create-car-listing.dto';
import { CreateCarListingProvider } from './providers/create-car-listing.provider';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';
import { UpdateCarListingProvider } from './providers/update-car-listing.provider';
import { PriceRange } from './enums/price-range.enum';
import { getPriceBounds } from './utils/price.utils';

@Injectable()
export class CarListingService {
  constructor(
    @InjectRepository(CarList)
    private readonly carListRepository: Repository<CarList>,

    private readonly createCarListingProvider: CreateCarListingProvider,

    private readonly updateCarListingProvider: UpdateCarListingProvider,
  ) {}

  async create(
    createCarListingDto: CreateCarListDto,
    modelId: number,
    manufacturerId: number,
    sub: ActiveUserData,
    files: Express.Multer.File[],
  ) {
    return await this.createCarListingProvider.create(
      createCarListingDto,
      modelId,
      manufacturerId,
      sub,
      files,
    );
  }

  async getAll(filters: {
    year?: number;
    priceRange?: PriceRange;
    model?: string;
    manufacturer?: string;
    city?: string;
  }) {
    try {
      const query = this.carListRepository
        .createQueryBuilder('car')
        .leftJoinAndSelect('car.model', 'model')
        .leftJoinAndSelect('car.manufacturer', 'manufacturer')
        .leftJoinAndSelect('car.owner', 'owner');

      if (filters.year) {
        query.andWhere('car.year = :year', { year: filters.year });
      }
      if (filters.priceRange) {
        const bounds = getPriceBounds(filters.priceRange);
        if (bounds.min !== undefined && bounds.max !== undefined) {
          query.andWhere('CAST(car.price AS NUMERIC) BETWEEN :min AND :max', {
            min: bounds.min,
            max: bounds.max,
          });
        } else if (bounds.min !== undefined) {
          query.andWhere('CAST(car.price AS NUMERIC) > :min', {
            min: bounds.min,
          });
        }
      }

      if (filters.model) {
        query.andWhere('model.model ILIKE :model', {
          model: `%${filters.model}%`,
        });
      }

      if (filters.manufacturer) {
        query.andWhere('manufacturer.make ILIKE :manufacturer', {
          manufacturer: `%${filters.manufacturer}%`,
        });
      }

      if (filters.city) {
        query.andWhere('car.city ILIKE :city', { city: `%${filters.city}%` });
      }

      return await query.getMany();
    } catch (error) {
      throw new BadRequestException(error.message || error);
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

  async update(
    carId: number,

    attrs: Partial<CarList>,
    files: Express.Multer.File[],
  ) {
    return this.updateCarListingProvider.update(carId, attrs, files);
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
