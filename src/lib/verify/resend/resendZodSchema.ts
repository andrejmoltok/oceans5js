import { z } from "zod";

export const resendZodSchema = z
  .object({
    username: z
      .string({
        required_error: "username input is required",
        invalid_type_error: "Invalid username format",
      })
      .min(3, "Username must be at least 3 characters long."),
    confirmUser: z
      .string({
        required_error: "username input is required",
        invalid_type_error: "Invalid username format",
      })
      .min(3, "Username must be at least 3 characters long."),
    email: z
      .string({
        required_error: "Email input is required",
        invalid_type_error: "Invalid email format",
      })
      .email(),
    confirmEmail: z
      .string({
        required_error: "Email input is required",
        invalid_type_error: "Invalid email format",
      })
      .email(),
  })
  .refine((values) => values.username === values.confirmUser, {
    message: "Usernames don't match!",
    path: ["confirmUser"],
  })
  .refine((values) => values.email === values.confirmEmail, {
    message: "Emails don't match!",
    path: ["confirmEmail"],
  });
