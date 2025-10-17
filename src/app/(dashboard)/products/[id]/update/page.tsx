"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { useRouter, useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, ChangeEvent } from "react";
import { Input, Label, Textarea } from "@/components/ui/form";
import { uploadImagesToCloudinary } from "@/actions/image-upload";
import { productFormSchema, ProductFormValues } from "@/lib/schemas/product";
import { imageFilesToPreviews, imageFileToPreview } from "@/lib/utils";
import DashboardContainer from "@/components/DashboardContainer";
import type { Id } from "@/convex/_generated/dataModel";

export default function UpdateProduct() {
   const { id } = useParams();
   const router = useRouter();
   const resolvedProductId = id as Id<"products">;
   const updateProduct = useMutation(api.products.updateProduct);
   const product = useQuery(api.products.getProductById, { id: resolvedProductId });

   const {
      register,
      handleSubmit,
      setValue,
      watch,
      formState: { errors }
   } = useForm<ProductFormValues>({
      resolver: zodResolver(productFormSchema)
   });

   const formValues = watch();
   const [mainImage, setMainImage] = useState<File>();
   const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
   const [additionalImages, setAdditionalImages] = useState<File[]>([]);
   const [additionalImagesPreview, setAdditionalImagesPreview] = useState<string[]>([]);
   const [loading, setLoading] = useState(false);

   // Prefill form and image previews from product data
   useEffect(() => {
      if (product && !Array.isArray(product)) {
         setValue("name", product.name);
         setValue("category", product.category);
         setValue("description", product.description);
         setValue("price", product.price);
         setValue("stock", product.stock);
         setMainImagePreview(product.image || null);
         setAdditionalImagesPreview(product.images || []);
      }
   }, [product, setValue]);

   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setMainImage(file);
      imageFileToPreview(file).then(setMainImagePreview);
   };

   const handleAdditionalImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      setAdditionalImages(files);
      imageFilesToPreviews(files).then(setAdditionalImagesPreview);
   };

   async function onSubmit(values: ProductFormValues) {
      setLoading(true);
      try {
         let mainImageUrl = product?.image || "";
         let otherImages = product?.images || [];

         // If uploading new images, update URLs
         if (mainImage || additionalImages.length > 0) {
            const formData = new FormData();
            if (mainImage) formData.append("image", mainImage);
            additionalImages.forEach((img) => formData.append("image", img));
            formData.append("upload_preset", "shobai-sme");
            const { success, urls } = await uploadImagesToCloudinary(formData);
            if (success && urls) {
               if (mainImage) {
                  mainImageUrl = urls[0];
                  otherImages = urls.slice(1);
               } else {
                  otherImages = urls;
               }
            }
         }

         const updateData = {
            ...values,
            image: mainImageUrl,
            images: otherImages
         };

         await updateProduct({
            id: resolvedProductId,
            data: updateData
         });

         toast.success("Product updated successfully");
         router.push("/manage-inventory");
      } catch (error) {
         toast.error("Failed to update product");
      } finally {
         setLoading(false);
      }
   }

   const displayValue = <T,>(formVal: T | undefined, prodVal: T | undefined, fallback: T) =>
      formVal ?? prodVal ?? fallback;

   return (
      <DashboardContainer title="Update Product" description="Edit your product details">
         <div className="grid grid-cols-2 gap-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
               <div className="grid gap-6">
                  <Input
                     label="Product Name"
                     placeholder="Enter product name"
                     {...register("name")}
                     error={errors.name}
                     autoComplete="off"
                  />
                  <Input
                     label="Category"
                     placeholder="Enter category"
                     {...register("category")}
                     error={errors.category}
                     autoComplete="off"
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
                     type="file"
                     accept="image/*"
                     name="main-image"
                     label="Product Image"
                     onChange={handleImageChange}
                  />
                  <Input
                     type="file"
                     multiple
                     accept="image/*"
                     name="additional-images"
                     label="Additional Images"
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
                        className="h-11 min-w-56 rounded-full"
                        disabled={loading}
                     >
                        {loading ? "Updating..." : "Update Product"}
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
                              priority
                              src={mainImagePreview}
                              alt="Product preview"
                              sizes="100% 100%"
                              className="border-border border object-cover object-top"
                           />
                        ) : (
                           <div className="flex h-full items-center justify-center text-gray-400">
                              No image selected
                           </div>
                        )}
                     </div>

                     <div className="grid grid-cols-3 gap-2">
                        {(additionalImagesPreview.length > 0
                           ? additionalImagesPreview
                           : product?.images || []
                        )
                           .slice(0, 5)
                           .map((img, idx) => (
                              <div
                                 key={idx}
                                 className="relative aspect-square flex-1 overflow-hidden rounded-lg bg-gray-100"
                              >
                                 <Image
                                    fill
                                    priority
                                    src={img}
                                    sizes="100% 100%"
                                    alt={`Additional image ${idx + 1}`}
                                    className="border-border border object-cover object-top"
                                 />
                              </div>
                           ))}
                     </div>

                     <div className="space-y-1.5">
                        <div className="flex flex-col gap-y-0.5">
                           <h3 className="text-lg font-semibold">
                              {displayValue(formValues.name, product?.name, "Product Name")}
                           </h3>
                           <p className="text-muted-foreground text-sm">
                              {displayValue(formValues.category, product?.category, "Category")}
                           </p>
                        </div>
                        <div className="flex items-center gap-x-2">
                           <p className="text-xl font-medium">
                              ৳{displayValue(formValues.price, product?.price, 0)}
                           </p>
                           <span className="text-muted-foreground">⋅</span>
                           <p className="text-muted-foreground text-sm">
                              {displayValue(formValues.stock, product?.stock, 0)} in stock
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
