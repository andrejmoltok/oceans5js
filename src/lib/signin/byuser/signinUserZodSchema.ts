import { z } from "zod";

export const signinUserZodSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Invalid username format",
        required_error: "Username input is required",
      })
      .min(2, "Username must be at least 2 characters long."),
    password: z
      .string()
      .min(8, "Provide a password at least 8 characters long"),
    confirm: z.string().min(8, "Provide a password at least 8 characters long"),
  })
  .refine((values) => values.password === values.confirm, {
    message: "Passwords don't match, Try again!",
    path: ["confirm"],
  });
