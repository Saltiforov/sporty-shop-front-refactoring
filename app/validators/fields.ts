import { z } from 'zod';

export const fieldSchemas = {
  username: z.string().min(1, { message: 'Required' }),
  password: z.string().min(6),
  email: z.string().email(),
  phone: z.string().regex(/^\+?\d+$/),
};

export const loginSchema = z.object({
  username: fieldSchemas.username,
  password: fieldSchemas.password,
});

export const registerSchema = z.object({
  username: fieldSchemas.username,
  email: fieldSchemas.email,
  password: fieldSchemas.password,
  phone: fieldSchemas.phone,
});
