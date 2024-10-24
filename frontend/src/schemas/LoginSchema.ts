import { z } from "zod";
export const usernameValidation = z.string();

export const passwordValidation = z
  .string()
  .regex(
    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
    "Password must contain a special character, uppercase character, lowercase character and a number"
  );

export const LoginSchema = z.object({
  username: usernameValidation,
  email: z.string(),
  password: passwordValidation,
});
