import { z } from "zod";

export const disableZodSchema = z
  .object({
    password: z
      .string()
      .min(8, "Provide a password at least 8 characters long"),
    confirm: z.string().min(8, "Provide a password at least 8 characters long"),
  })
  .refine((values) => values.password === values.confirm, {
    message: "Passwords don't match!",
    path: ["confirm"],
  });
