import { cva, type VariantProps } from 'class-variance-authority';

export const drawerOverlay = cva(
  'fixed inset-0 z-[400] bg-black/50 backdrop-blur-sm transition-opacity duration-300',
  {
    variants: {
      open: {
        true:  'opacity-100 pointer-events-auto',
        false: 'opacity-0 pointer-events-none',
      },
    },
    defaultVariants: { open: false },
  },
);

export const drawerPanel = cva(
  'fixed top-0 h-full z-[500] bg-[var(--color-gray-light-lavender)] shadow-lg ' +
  'transition-transform duration-300 will-change-transform rounded-tl-[32px] rounded-bl-[32px] ' +
  'pt-[36px] pb-[28px] pl-[46px] pr-[30px]',
  {
    variants: {
      side: {
        right: 'right-0',
        left:  'left-0',
      },
      open: {
        true:  'translate-x-0',
        false: '',
      },
      size: {
        sm: 'w-[70%] max-w-[420px]',
        md: 'w-[70%] max-w-[520px]',
        lg: 'w-[70%] max-w-[619px]', // твоя текущая ширина
      },
    },
    compoundVariants: [
      { side: 'right', open: true, class: 'translate-x-0' },
      { side: 'left',  open: true, class: 'translate-x-0' },
    ],
    defaultVariants: {
      side: 'right',
      size: 'lg',
      open: false,
    },
  },
);

export type DrawerOverlayVariants = VariantProps<typeof drawerOverlay>
export type DrawerPanelVariants   = VariantProps<typeof drawerPanel>
