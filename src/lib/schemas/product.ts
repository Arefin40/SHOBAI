import { z } from "zod";

export const productFormSchema = z.object({
   name: z.string().min(1, "Name is required"),
   category: z.string().min(1, "Category is required"),
   description: z.string().min(1, "Description is required"),
   price: z.number().min(1, "Price must be at least 1 Tk."),
   stock: z.number().min(0, "Stock cannot be negative"),
   image: z.string().optional(),
   images: z.array(z.string()).optional()
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
