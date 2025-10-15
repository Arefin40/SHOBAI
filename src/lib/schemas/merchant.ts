import { z } from "zod";
import { getImageSchema } from "@/lib/schemas/image-schema";

export const merchantFormSchema = z.object({
   name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
   email: z.string().email("Please enter a valid email address"),
   nid: z.string().regex(/^[0-9]{10}$|^[0-9]{13}$|^[0-9]{17}$/, "Invalid NID number"),
   mobile: z
      .string()
      .regex(/^(?:\+880|0)(1[3-9]\d{8})$/, "Invalid mobile number")
      .transform((val) => {
         if (val.startsWith("0")) return "+880" + val.slice(1);
         return val;
      }),
   password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
         "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      )
});

export type MerchantFormValues = z.infer<typeof merchantFormSchema>;

export const storeFormSchema = z.object({
   name: z.string().min(2, "Name must be at least 2 characters"),
   slug: z.string().min(2, "Slug must be at least 2 characters"),
   description: z.string().min(10, "Description must be at least 10 characters"),
   logo: getImageSchema(2 * 1024 * 1024, true),
   cover: getImageSchema(5 * 1024 * 1024, true)
});

export type StoreFormValues = z.infer<typeof storeFormSchema>;
