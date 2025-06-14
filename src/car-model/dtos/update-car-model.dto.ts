import { PartialType } from '@nestjs/swagger';
import { CreateCarModelDto } from './create-car-model.dto';

export class UpdateCarModelDto extends PartialType(CreateCarModelDto) {}
