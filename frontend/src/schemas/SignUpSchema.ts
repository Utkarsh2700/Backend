import { z } from "zod";

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

export const passwordValidation = z
  .string()
  .regex(
    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
    "Password must contain a special character, uppercase character, lowercase character and a number"
  );

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
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
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const signUpSchema = z.object({
  username: usernameValidation,
  fullName: fullnameValidation,
  email: z.string().email({ message: "Invalid Email Address" }),
  password: passwordValidation,
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
