import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Manufacturer } from '../manufacturer.entity';
import { Repository } from 'typeorm';
import { S3Service } from 'src/uploads/s3.service';

@Injectable()
export class UpdateManufacturerProvider {
  constructor(
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,
    private readonly s3Service: S3Service,
  ) {}

  async update(
    id: number,
    userId: number,
    attrs: Partial<Manufacturer>,
    file?: Express.Multer.File,
  ) {
    try {
      const manufacturer = await this.manufacturerRepository.findOneBy({ id });
      if (!manufacturer) {
        throw new NotFoundException('Manufacturer not found with this ID!');
      }

      if (file) {
        const imageUrl = await this.s3Service.uploadMakeImage(file, userId);
        attrs.image = imageUrl;
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
}
