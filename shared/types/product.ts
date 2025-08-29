import type { IReview } from '#shared/types/review'

export interface IPrice {
  eur?: number;
  uah?: number;
}

export interface IDiscount {
  eur?: number;   // в валютных единицах
  uah?: number;
}

export interface IImageVariants {
  id: string;
  variants: {
    thumb: string;
    small: string;
    large: string;
  };
}
export interface IProduct{
  name: string;
  description?: string;
  vendor?: string;
  slug: string;
  price: IPrice;
  discount: IDiscount;
  images: IImageVariants[];
  category?: string;
  filters: string[];
  availability: boolean;
  showAsNew: boolean;
  attributes: Record<string, never>;
  reviewsList?: IReview[];
  reviews?: {
    list: IReview[];
    reviewCount: number;
    averageRating: number | null;
  };
  priceAfterDiscount?: {
    eur?: number;
    uah?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
