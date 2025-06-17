import { PriceRange } from '../enums/price-range.enum';

export function getPriceBounds(range: PriceRange): {
  min?: number;
  max?: number;
} {
  switch (range) {
    case PriceRange.LOW:
      return { min: 0, max: 10000 };
    case PriceRange.MID:
      return { min: 10000, max: 20000 };
    case PriceRange.HIGH:
      return { min: 20000, max: 50000 };
    case PriceRange.PREMIUM:
      return { min: 50000 };
    default:
      return {};
  }
}
