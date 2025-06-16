import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { CarList } from '../car-listing.entity';
import { Repository } from 'typeorm';
import { CarModel } from 'src/car-model/car-model.entity';
import { Manufacturer } from 'src/manufacturer/manufacturer.entity';
import { CreateCarListDto } from '../dtos/create-car-listing.dto';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';

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
  ) {}

  async create(
    createCarListingDto: CreateCarListDto,
    modelId: number,
    manufacturerId: number,
    user: ActiveUserData,
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
