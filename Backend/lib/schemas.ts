import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
});

export const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.email(),
  password: z.string().min(6),
  image: z.url().optional().or(z.literal(""))
});

export const createBookSchema = z.object({
  name: z.string().trim().min(2),
  author: z.string().trim().optional().or(z.literal("")),
  isbn: z.string().trim().optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
  initialStock: z.number().int().min(0).default(0)
});

export const updateBookSchema = z.object({
  name: z.string().trim().min(2).optional(),
  author: z.string().trim().optional().or(z.literal("")),
  isbn: z.string().trim().optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
  enabled: z.boolean().optional()
});

export const createMovementSchema = z.object({
  bookId: z.string().min(1),
  type: z.enum(["ENTRADA", "SALIDA"]),
  quantity: z.number().int().positive(),
  note: z.string().trim().optional().or(z.literal(""))
});

export const updateUserRoleSchema = z.object({
  role: z.enum(["ADMIN", "USER"]),
  enabled: z.boolean().optional()
});
