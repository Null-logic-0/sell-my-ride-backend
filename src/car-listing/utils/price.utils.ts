import { PriceRange } from '../enums/price-range.enum';

export function getPriceBounds(range: PriceRange): {
  min?: number;
  max?: number;
} {
  switch (range) {
    case PriceRange.low:
      return { min: 0, max: 10000 };
    case PriceRange.mid:
      return { min: 10000, max: 20000 };
    case PriceRange.high:
      return { min: 20000, max: 50000 };
    case PriceRange.premium:
      return { min: 50000 };
    default:
      return {};
  }
}
