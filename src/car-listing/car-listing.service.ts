import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CarList } from './car-listing.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CarListingService {
  constructor(
    @InjectRepository(CarList)
    private readonly carListRepository: Repository<CarList>,
  ) {}
}
