import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { CarList } from '../car-listing.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CreateCarListingProvider {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(CarList)
    private readonly carListRepository: Repository<CarList>,
  ) {}
}
