import { z } from 'zod'

export const userNameSchema = z
  .string()
  .min(1, { message: 'Username is required.' })

export const passwordSchema = z
  .string()
  .min(3, { message: 'Password must be at least 3 characters long.' })
  .max(8, { message: 'Password must not exceed 8 characters.' })
  .refine((value) => /[a-z]/.test(value), {
    errorType: 'lowercase',
    message: 'Password must contain at least one lowercase letter.',
  })
  .refine((value) => /[A-Z]/.test(value), {
    errorType: 'uppercase',
    message: 'Password must contain at least one uppercase letter.',
  })
  .refine((value) => /d/.test(value), {
    errorType: 'number',
    message: 'Password must contain at least one number.',
  })
