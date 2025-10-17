import { z, type infer as Infer } from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

export type LoginSchema = Infer<typeof loginSchema>;
