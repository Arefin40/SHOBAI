import { z } from "zod";

export const getImageSchema = (maxSize: number = 2 * 1024 * 1024, isRequired = false) => {
   const schema = isRequired ? z.any() : z.any().optional();

   return schema
      .transform((files) => {
         if (!files?.length) return null;
         const file = files[0];
         const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
         return file.size <= maxSize && validTypes.includes(file.type) ? file : null;
      })
      .refine((file) => !file || file.size <= maxSize, `Image must be less than ${maxSize}MB`)
      .refine(
         (file) =>
            !file || ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
         "Only .jpg, .jpeg, .png and .webp formats are supported"
      );
};

export const getImagesSchema = (maxSize: number = 2 * 1024 * 1024, isRequired = false) => {
   const schema = isRequired ? z.any() : z.any().optional();

   return schema
      .transform((files) => {
         if (!files?.length) return null;
         const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
         const filesArray = Array.from(files as FileList);
         return filesArray
            .filter((file) => file.size <= maxSize && validTypes.includes(file.type))
            .slice(0, 5); // Limit to maximum 5 images
      })
      .refine(
         (files) => !files || files.every((file) => file.size <= maxSize),
         `Each image must be less than ${maxSize}MB`
      )
      .refine(
         (files) =>
            !files ||
            files.every((file) =>
               ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)
            ),
         "Only .jpg, .jpeg, .png and .webp formats are supported"
      );
};
