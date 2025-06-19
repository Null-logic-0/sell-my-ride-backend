import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Manufacturer } from '../manufacturer.entity';
import { S3Service } from 'src/uploads/s3.service';
import { Repository } from 'typeorm';
import { CreateManufacturerDto } from '../dtos/create-manufacturer.dto';

@Injectable()
export class CreateManufacturerProvider {
  constructor(
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,
    private readonly s3Service: S3Service,
  ) {}

  async create(
    createManufacturerDto: CreateManufacturerDto,
    userId: number,
    file: Express.Multer.File,
  ) {
    try {
      const newManufacturer = this.manufacturerRepository.create(
        createManufacturerDto,
      );
      newManufacturer.image = await this.s3Service.uploadMakeImage(
        file,
        userId,
      );

      return await this.manufacturerRepository.save(newManufacturer);
    } catch (error) {
      throw new BadRequestException(error.message || error);
    }
  }
}
