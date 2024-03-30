import { z } from "zod";

export const signinEmailZodSchema = z
  .object({
    email: z
      .string({
        required_error: "Email input is required",
        invalid_type_error: "Invalid email format",
      })
      .email(),
    password: z
      .string()
      .min(8, "Provide a password at least 8 characters long"),
    confirm: z.string().min(8, "Provide a password at least 8 characters long"),
  })
  .refine((values) => values.password === values.confirm, {
    message: "Passwords don't match, Try again!",
    path: ["confirm"],
  });
