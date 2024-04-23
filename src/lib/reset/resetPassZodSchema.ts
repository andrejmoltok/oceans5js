import { z } from "zod";

export const resetPassZodSchema = z
  .object({
    password: z
      .string({
        required_error: "Password input is required",
        invalid_type_error: "Invalid password format",
      })
      .min(8),
    confirm: z
      .string({
        required_error: "Password input is required",
        invalid_type_error: "Invalid password format",
      })
      .min(8),
  })
  .refine((values) => values.password === values.confirm, {
    message: "Passwords don't match, Try again!",
    path: ["confirm"],
  });
