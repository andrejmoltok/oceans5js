import { z } from "zod";

const Base = z
  .object({
    username: z
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
    firstname: z
      .string({
        required_error: "Firstname input is required",
        invalid_type_error: "Invalid firstname format",
      })
      .min(2, "Provide your first name"),
    lastname: z.string(),
    password: z
      .string()
      .min(8, "Provide a password at least 8 characters long"),
    confirm: z.string().min(8, "Provide a password at least 8 characters long"),
  })
  .partial();

export const signupZodSchema = Base.required({
  username: true,
  email: true,
  firstname: true,
  password: true,
  confirm: true,
}).refine((values) => values.password === values.confirm, {
  message: "Passwords don't match!",
  path: ["confirm"],
});
