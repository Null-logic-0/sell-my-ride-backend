import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../../users/users.service';
import { CarList } from '../car-listing.entity';
import { Repository } from 'typeorm';
import { CarModel } from '../../car-model/car-model.entity';
import { Manufacturer } from '../../manufacturer/manufacturer.entity';
import { S3Service } from '../../uploads/s3.service';

@Injectable()
export class UpdateCarListingProvider {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(CarList)
    private readonly carListRepository: Repository<CarList>,

    @InjectRepository(CarModel)
    private readonly carModelRepository: Repository<CarModel>,

    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,

    private readonly s3Service: S3Service,
  ) {}

  async update(
    id: number,
    attrs: Partial<CarList>,
    files: Express.Multer.File[],
  ) {
    try {
      const car = await this.carListRepository.findOneBy({ id });
      if (!car) {
        throw new NotFoundException('Car list not found');
      }

      if (!files || files.length === 0) {
        throw new BadRequestException('At least one image is required.');
      }

      if (!car.owner?.id) {
        throw new BadRequestException(
          'Owner ID is required for uploading photos',
        );
      }

      attrs.photos = await this.s3Service.uploadCarImages(files, car.owner?.id);

      Object.assign(car, attrs);
      return this.carListRepository.save(car);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }
}
