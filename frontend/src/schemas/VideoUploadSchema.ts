import { z } from "zod";

export const titleValidation = z
  .string()
  .min(4, "Title must atleast 4 characters");

export const descriptionValidation = z
  .string()
  .min(20, "Description must contain atleast 20 characters");

const MAX_VIDEO_SIZE = 100 * 1024 * 1024; //100MB

const ACCEPTED_VIDEO_TYPES = ["video/mp4"];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

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

export const videoUploadSchema = z.object({
  title: titleValidation,
  description: descriptionValidation,
  thumbnail: z
    .instanceof(File, {
      message: "Please select an image",
    })
    .refine((file) => file.size <= MAX_IMAGE_SIZE, {
      message: `The image is too big.Please choose a smaller image than ${formatBytes(
        MAX_IMAGE_SIZE
      )}`,
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Please Upload a Valid image file(JPEG, PNG, or WEBP)",
    }),
  videoFile: z
    .instanceof(File, {
      message: "Please select an image",
    })
    .refine((file) => file.size <= MAX_VIDEO_SIZE, {
      message: `The image is too big.Please choose a smaller image than ${formatBytes(
        MAX_VIDEO_SIZE
      )}`,
    })
    .refine((file) => ACCEPTED_VIDEO_TYPES.includes(file.type), {
      message: "Please Upload a Valid image file(JPEG, PNG, or WEBP)",
    }),
});
