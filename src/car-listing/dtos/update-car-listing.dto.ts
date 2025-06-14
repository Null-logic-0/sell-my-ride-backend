import { PartialType } from '@nestjs/swagger';
import { CreateCarListDto } from './create-car-listing.dto';

export class UpdateCarListingDto extends PartialType(CreateCarListDto) {}
