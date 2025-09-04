import { cva, type VariantProps } from 'class-variance-authority';

// Базовый пресет
const baseBox   = 'rounded-lg';
const baseText  = 'text-[var(--color-primary-black)]';
const mutedText = 'text-[#8E8E93]';

export const cardRoot = cva(baseBox, {
  variants: {
    variant: {
      default: 'w-full max-w-[280px] p-7 flex flex-col',
      cart:    'w-full p-4 flex gap-6 items-start',
    },
  },
  defaultVariants: { variant: 'default' },
});

export const cardImg = cva('object-contain rounded-md', {
  variants: {
    variant: {
      default: 'mx-auto w-[180px] h-[180px] md:w-[135px] md:h-[135px] sm:w-[128px] sm:h-[114px]',
      cart:    'w-[120px] h-[120px] shrink-0 bg-transparent',
    },
  },
  defaultVariants: { variant: 'default' },
});

export const cardName = cva(baseText, {
  variants: {
    variant: {
      default: 'text-[20px] leading-[22px] font-medium min-h-[52px] line-clamp-2',
      cart:    'text-[20px] leading-6 font-medium truncate',
    },
  },
  defaultVariants: { variant: 'default' },
});

export const ratingWrap = cva(`flex items-center ${mutedText}`, {
  variants: {
    variant: {
      default: 'mb-[27px]',
      cart:    'mt-3 mb-4',
    },
  },
  defaultVariants: { variant: 'default' },
});

export const priceOld = cva('line-through text-[#8E8E93]', {
  variants: {
    variant: {
      default: 'absolute -top-3 left-0 text-[15px]',
      cart:    'text-[16px]',
    },
  },
  defaultVariants: { variant: 'default' },
});

export const priceCur = cva('font-medium', {
  variants: {
    discount: {
      true:  'text-[#EF4B4B]',
      false: '',
    },
    variant: {
      default: 'text-[24px] leading-[22px]',
      cart:    'text-[20px]',
    },
  },
  compoundVariants: [
    { variant: 'default', discount: true,  class: 'text-[#EF4B4B]' },
  ],
  defaultVariants: { variant: 'default', discount: false },
});

export type ProductCardVariant = VariantProps<typeof cardRoot>['variant']
