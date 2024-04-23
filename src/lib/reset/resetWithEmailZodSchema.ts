import { z } from "zod";

export const resetWithEmailZodSchema = z
  .object({
    email: z
      .string({
        required_error: "Email input is required",
        invalid_type_error: "Invalid email format",
      })
      .email(),
    confirm: z
      .string({
        required_error: "Email input is required",
        invalid_type_error: "Invalid email format",
      })
      .email(),
  })
  .refine((values) => values.email === values.confirm, {
    message: "Emails don't match, Try again!",
    path: ["confirm"],
  });
