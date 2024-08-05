import {z} from "zod";

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, {message: "Email is required"})
    .email({message: "Please provide a valid email address."}),

  password: z
    .string()
    .min(6, {message: "Password must be at least 6 characters long."})
    .max(100, {message: "Password cannot exceed 100 characters."}),
});
