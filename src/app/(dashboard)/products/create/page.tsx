"use client";
import Image from "next/image";
import toast from "react-hot-toast";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Label, Textarea } from "@/components/ui/form";
import { productFormSchema, ProductFormValues } from "@/lib/schemas/product";
import { uploadImagesToCloudinary } from "@/actions/image-upload";
import DashboardContainer from "@/components/DashboardContainer";

export default function AddProduct() {
   const createProduct = useMutation(api.products.createProduct);
   const router = useRouter();
   const {
      register,
      handleSubmit,
      watch,
      formState: { errors }
   } = useForm<ProductFormValues>({
      resolver: zodResolver(productFormSchema),
      defaultValues: {
         name: "Product-1",
         category: "Kurti",
         price: 1250,
         stock: 12,
         description: "Demo product description"
      }
   });

   const formValues = watch();
   const [mainImage, setMainImage] = useState<File | undefined>();
   const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
   const [additionalImages, setAdditionalImages] = useState<File[]>([]);
   const [additionalImagesPreview, setAdditionalImagesPreview] = useState<string[]>([]);
   const [loading, setLoading] = useState(false);

   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         setMainImage(file);
         const reader = new FileReader();
         reader.onloadend = () => setMainImagePreview(reader.result as string);
         reader.readAsDataURL(file);
      } else {
         setMainImage(undefined);
         setMainImagePreview(null);
      }
   };

   const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
         const newFiles = Array.from(files);
         setAdditionalImages(newFiles);

         const readers = newFiles.map(
            (file) =>
               new Promise<string>((resolve) => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve(reader.result as string);
                  reader.readAsDataURL(file);
               })
         );

         Promise.all(readers).then((base64s) => setAdditionalImagesPreview(base64s));
      }
   };

   async function onSubmit(values: ProductFormValues) {
      if (!mainImage) return;

      const formData = new FormData();
      formData.append("image", mainImage);
      if (additionalImages.length > 0) {
         Array.from(additionalImages).forEach((image) => formData.append("image", image));
      }
      formData.append("upload_preset", "shobai-sme");

      try {
         setLoading(true);
         const imageUrls = await uploadImagesToCloudinary(formData);
         if (imageUrls.success && imageUrls.urls) {
            values.image = imageUrls.urls[0];
            if (imageUrls.urls.length > 1) {
               values.images = imageUrls.urls.slice(1);
            }
         }

         const response = await createProduct({
            ...values,
            image: values.image,
            images: values.images || []
         });

         if (response.success) {
            toast.success(response.message);
            router.push("/manage-inventory");
         }
      } catch (error) {
         if (error instanceof Error) {
            toast.error(error.message);
         } else {
            toast.error("Failed to add product");
         }
      } finally {
         setLoading(false);
      }
   }

   return (
      <DashboardContainer title="Add Product" description="Create a new product for your store">
         <div className="grid grid-cols-2 gap-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
               <div className="grid gap-6">
                  <Input
                     label="Product Name"
                     placeholder="Enter product name"
                     {...register("name")}
                     autoComplete="off"
                     error={errors.name}
                  />
                  <Input
                     label="Category"
                     placeholder="Enter category"
                     {...register("category")}
                     autoComplete="off"
                     error={errors.category}
                  />
                  <div className="grid grid-cols-2 gap-6">
                     <Input
                        type="number"
                        label="Price"
                        placeholder="Enter price"
                        {...register("price", { valueAsNumber: true })}
                        error={errors.price}
                        autoComplete="off"
                        baseClassName="appearance-none"
                     />
                     <Input
                        type="number"
                        label="Stock"
                        placeholder="Enter stock"
                        {...register("stock", { valueAsNumber: true })}
                        error={errors.stock}
                        autoComplete="off"
                        baseClassName="appearance-none"
                     />
                  </div>
                  <Input
                     label="Product Image"
                     type="file"
                     accept="image/*"
                     name="product-image"
                     onChange={handleImageChange}
                  />
                  <Input
                     label="Additional Images"
                     type="file"
                     accept="image/*"
                     multiple
                     name="additional-images"
                     onChange={handleAdditionalImagesChange}
                  />
                  <div className="space-y-2">
                     <Label htmlFor="description">Description</Label>
                     <Textarea
                        id="description"
                        placeholder="Enter product description"
                        className="min-h-[120px]"
                        {...register("description")}
                     />
                     {errors.description && (
                        <span className="text-destructive text-sm">
                           {errors.description.message}
                        </span>
                     )}
                  </div>

                  <div className="flex">
                     <Button
                        type="submit"
                        disabled={loading}
                        className="h-11 min-w-56 rounded-full"
                     >
                        Add Product
                     </Button>
                  </div>
               </div>
            </form>

            <main className="bg-muted flex flex-col gap-y-6 rounded-lg p-6">
               <div className="flex justify-center">
                  <div className="shadow-card border-border w-full max-w-96 space-y-3 rounded-lg border bg-white p-4">
                     <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                        {mainImagePreview ? (
                           <Image
                              fill
                              src={mainImagePreview!}
                              alt="Product preview"
                              className="border-border border object-cover object-top"
                           />
                        ) : (
                           <div className="flex h-full items-center justify-center text-gray-400">
                              No image selected
                           </div>
                        )}
                     </div>

                     <div className="grid grid-cols-3 gap-2">
                        {additionalImagesPreview.slice(0, 5).map((image, index) => (
                           <div
                              key={index}
                              className="relative aspect-square flex-1 overflow-hidden rounded-lg bg-gray-100"
                           >
                              <Image
                                 fill
                                 src={image!}
                                 alt={`Additional image {index + 1}`}
                                 className="border-border border object-cover object-top"
                              />
                           </div>
                        ))}
                     </div>

                     <div className="space-y-1.5">
                        <div className="flex flex-col gap-y-0.5">
                           <h3 className="text-lg font-semibold">
                              {formValues.name || "Product Name"}
                           </h3>
                           <p className="text-muted-foreground text-sm">
                              {formValues.category || "Category"}
                           </p>
                        </div>

                        <div className="flex items-center gap-x-2">
                           <p className="text-xl font-medium">৳{formValues.price || 0}</p>
                           <span className="text-muted-foreground">⋅</span>
                           <p className="text-muted-foreground text-sm">
                              {formValues.stock || 0} in stock
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </main>
         </div>
      </DashboardContainer>
   );
}
