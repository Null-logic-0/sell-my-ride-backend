import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../../users/users.service';
import { CarList } from '../car-listing.entity';
import { Repository } from 'typeorm';
import { CarModel } from '../../car-model/car-model.entity';
import { Manufacturer } from '../../manufacturer/manufacturer.entity';
import { CreateCarListDto } from '../dtos/create-car-listing.dto';
import { ActiveUserData } from '../../auth/interfaces/active-user.interface';
import { S3Service } from '../../uploads/s3.service';

@Injectable()
export class CreateCarListingProvider {
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

  async create(
    createCarListingDto: CreateCarListDto,
    modelId: number,
    manufacturerId: number,
    user: ActiveUserData,
    files: Express.Multer.File[],
  ) {
    try {
      const owner = await this.usersService.getSingleUser(user.sub);
      if (!owner) {
        throw new UnauthorizedException('You are not sign in application!');
      }
      const manufacturer = await this.manufacturerRepository.findOneBy({
        id: manufacturerId,
      });

      if (!manufacturer) {
        throw new NotFoundException('Manufacturer not found');
      }
      const model = await this.carModelRepository.findOneBy({ id: modelId });
      if (!model) {
        throw new NotFoundException('Car model not found');
      }

      if (!files || files.length === 0) {
        throw new BadRequestException('At least one image is required.');
      }

      createCarListingDto.photos = await this.s3Service.uploadCarImages(
        files,
        user.sub,
      );

      const newCarListing = this.carListRepository.create({
        ...createCarListingDto,
        manufacturer,
        model,
        owner,
      });

      return await this.carListRepository.save(newCarListing);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }
}
