"use client";

import React from "react";
import { toast } from "react-hot-toast";
import { api } from "@/convex/_generated/api";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input, InputPassword } from "@/components/ui/form/input";
import { merchantFormSchema, type MerchantFormValues } from "@/lib/schemas/merchant";

export function MerchantForm() {
   const router = useRouter();
   const { signIn } = useAuthActions();
   const merchantApplication = useMutation(api.merchant.becomeMerchant);

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting }
   } = useForm<MerchantFormValues>({
      resolver: zodResolver(merchantFormSchema)
   });

   const onSubmit = async (data: MerchantFormValues) => {
      try {
         const { name, email, password, nid, mobile } = data;
         await signIn("password", { name, email, password, flow: "signUp" });
         await merchantApplication({ email, nid, mobile });

         toast.success("Successfully submitted the application");
         reset();
         router.push("/merchant-application-submitted");
      } catch (error) {
         toast.error(error instanceof Error ? error.message : "Failed to submit the application");
      }
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
         <div className="space-y-4">
            <Input label="Name" {...register("name")} error={errors.name} autoComplete="name" />

            <Input
               label="Email"
               type="email"
               {...register("email")}
               error={errors.email}
               autoComplete="email"
            />

            <div className="grid grid-cols-2 gap-4">
               <Input
                  label="NID Number"
                  {...register("nid")}
                  error={errors.nid}
                  autoComplete="off"
               />

               <Input
                  label="Mobile Number"
                  {...register("mobile")}
                  error={errors.mobile}
                  autoComplete="tel"
                  placeholder="+880 1XXXXXXXXX"
               />
            </div>

            <InputPassword
               label="Password"
               {...register("password")}
               error={errors.password}
               autoComplete="new-password"
            />
         </div>

         <Button type="submit" className="w-full" disabled={isSubmitting}>
            Become Seller
         </Button>
      </form>
   );
}
