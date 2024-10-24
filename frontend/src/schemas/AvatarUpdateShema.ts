import { z } from "zod";
import { passwordValidation } from "./SignUpSchema";

const MAX_FILE_SIZE = 10 * 1024 * 1024; //10MB

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const ImageUpdateSchema = z.object({
  avatar: z
    .instanceof(File, {
      message: "Please select an image file",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `The image is too big. Please choose a smaller image than ${formatBytes}`,
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Please upload a valid image file(JPEG< PNG< or WebP)",
    }),
});

export const CoverImageSchema = z.object({
  coverImage: z
    .instanceof(File, {
      message: "Please select an image file",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `The image is too big. Please choose a smaller image than ${formatBytes}`,
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Please upload a valid image file(JPEG< PNG< or WebP)",
    }),
});

export const usernameValidation = z
  .string()
  .min(4, "Username must be atleast 4 characters")
  .max(20, "Username cannot be more than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contin special character");

export const fullnameValidation = z
  .string()
  .min(4, "fullName must be atleast 4 characters")
  .max(20, "fullName cannot be more than 20 characters")
  .regex(
    /^[A-Za-z]+(?:\s[A-Za-z]+)*$/,
    "FullName must not contain special character"
  );

export const UserDetailsUpdateSchema = z.object({
  username: usernameValidation,
  fullName: fullnameValidation,
  email: z.string().email({ message: "Invalid Email Address" }),
});

export const PasswordUpdateSchema = z.object({
  oldPassword: passwordValidation,
  newPassword: passwordValidation,
  confPassword: passwordValidation,
});
