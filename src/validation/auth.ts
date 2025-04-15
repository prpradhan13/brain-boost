import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }).trim(),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    fullName: z.string().min(3, "Full name must be at least 3 characters long").trim(),
    username: z.string().min(3, "Full name must be at least 3 characters long").trim(),
    email: z.string().email({ message: 'Invalid email address' }).trim(),
    password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one digit")
    .regex(/[@$#!%*?&]/, "Password must contain at least one special character (@, $, !, %, *, ?, &)")
  })

export type SignupSchema = z.infer<typeof signupSchema>;