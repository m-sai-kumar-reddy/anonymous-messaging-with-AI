import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "User name must be atleast 2 chars")
  .max(20, "User name must not be more than 20 chars")
  .regex(/^[a-zA-Z0-9_]+$/, "User name must not contain special chars");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be atleast 6 chars" }),
});
