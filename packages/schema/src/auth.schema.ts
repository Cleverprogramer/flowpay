import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z
    .email(
      "Your email address is incomplete. Make sure it follows the correct format with a domain name.",
    )
    .trim()
    .min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password should be at least 8 characters"),
});

export const signInSchema = z.object({
  email: z
    .email("Enter a valid email address")
    .trim()
    .min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Use at least 8 characters"),
});
