"use client";

import { z } from "zod";
import Image from "next/image";
import toast from "react-hot-toast";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/form";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { zodResolver } from "@hookform/resolvers/zod";
import DashboardContainer from "@/components/DashboardContainer";

const postSchema = z.object({
   content: z.string().min(1, "Content is required"),
   products: z.array(z.string()).min(1, "Select at least one product").max(3, "Maximum 3 products")
});

type PostFormValues = z.infer<typeof postSchema>;

export default function CreatePostPage() {
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

   const products = useQuery(api.products.getMyStoreProducts);
   const createPost = useMutation(api.posts.createPost);

   const {
      register,
      handleSubmit,
      setValue,
      formState: { errors }
   } = useForm<PostFormValues>({
      resolver: zodResolver(postSchema),
      defaultValues: {
         content: "",
         products: []
      }
   });

   const handleProductSelect = (productId: Id<"products">) => {
      setSelectedProducts((prev) => {
         let newSelection;
         if (prev.includes(productId)) {
            newSelection = prev.filter((id) => id !== productId);
         } else {
            if (prev.length >= 3) return prev;
            newSelection = [...prev, productId];
         }
         setValue("products", newSelection, { shouldValidate: true });
         return newSelection;
      });
   };

   const onSubmit = async (data: PostFormValues) => {
      try {
         setLoading(true);
         if (!data.products || data.products.length === 0) {
            toast.error("Please select at least one product");
            return;
         }
         await createPost({
            content: data.content,
            products: data.products as Id<"products">[]
         });
         toast.success("Post created successfully");
         router.push("/manage-posts");
      } catch (error) {
         toast.error("Failed to create post");
      } finally {
         setLoading(false);
      }
   };

   if (products === undefined) {
      return (
         <DashboardContainer
            title="Create Post"
            description="Share updates and products with your followers"
         >
            <div>Loading your products...</div>
         </DashboardContainer>
      );
   }

   if (!products || products.length === 0) {
      return (
         <DashboardContainer
            title="Create Post"
            description="Share updates and products with your followers"
         >
            <div className="my-12 text-center text-gray-500">
               No products found. Please add products to your store before creating a post.
            </div>
         </DashboardContainer>
      );
   }

   return (
      <DashboardContainer
         title="Create Post"
         description="Share updates and products with your followers"
      >
         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
            <div className="grid gap-6">
               <div className="max-w-4xl">
                  <Textarea
                     {...register("content")}
                     placeholder="What's on your mind?"
                     className="min-h-[150px]"
                     disabled={loading}
                  />
                  {errors.content && (
                     <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
                  )}
               </div>

               <div>
                  <h3 className="mb-4 text-lg font-semibold">Select Products (1-3)</h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                     {products.map((product) => (
                        <button
                           type="button"
                           key={product._id}
                           onClick={() => handleProductSelect(product._id)}
                           className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg transition-all focus:outline-none"
                           tabIndex={0}
                           aria-pressed={selectedProducts.includes(product._id)}
                           disabled={loading}
                        >
                           {product.image ? (
                              <Image
                                 fill
                                 src={product.image}
                                 alt={product.name || "Product"}
                                 className="object-cover object-top"
                                 sizes="200px"
                              />
                           ) : (
                              <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400">
                                 No Image
                              </div>
                           )}

                           {selectedProducts.includes(product._id) && (
                              <div className="flex-center absolute inset-0 bg-black/50 py-2">
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="fill-current text-emerald-500"
                                 >
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path
                                       fill="none"
                                       className="stroke-current text-white"
                                       d="m9 12 2 2 4-4"
                                    ></path>
                                 </svg>
                              </div>
                           )}
                        </button>
                     ))}
                  </div>
                  {errors.products && (
                     <p className="mt-1 text-sm text-red-500">
                        {errors.products.message as string}
                     </p>
                  )}
               </div>

               <div className="flex">
                  <Button type="submit" disabled={loading} className="h-11 min-w-56 rounded-full">
                     {loading ? "Posting..." : "Create Post"}
                  </Button>
               </div>
            </div>
         </form>
      </DashboardContainer>
   );
}
