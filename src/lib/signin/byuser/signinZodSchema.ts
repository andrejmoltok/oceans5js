import { z } from "zod";

export const signinZodSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters long."),
    password: z
      .string()
      .min(8, "Provide a password at least 8 characters long"),
    confirm: z.string().min(8, "Provide a password at least 8 characters long"),
  })
  .refine((values) => values.password === values.confirm, {
    message: "Passwords don't match, Try again!",
    path: ["confirm"],
  });
