import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().min(3).max(254).email(),
    password: z.string().min(1).max(128),
});

export type DatosLogin = z.infer<typeof loginSchema>;