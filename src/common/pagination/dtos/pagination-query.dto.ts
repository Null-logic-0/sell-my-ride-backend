import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';
import { GetAllCarsFilterDto } from 'src/car-listing/dtos/get-all-car-lisitng.dto';

export class PaginationQueryDto extends GetAllCarsFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number;
}
