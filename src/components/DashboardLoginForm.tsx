"use client";

import React from "react";
import { z } from "zod";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Lock, User } from "lucide-react";
import { logInSchema } from "@/lib/schemas/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input, InputPassword } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CurlyUnderline } from "@/icons";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";

type FormFields = z.infer<typeof logInSchema>;

export default function DashboardLoginForm({ formType }: { formType: "merchant" | "admin" }) {
   const router = useRouter();
   const { signIn } = useAuthActions();
   const {
      register,
      handleSubmit,
      formState: { errors }
   } = useForm<FormFields>({ resolver: zodResolver(logInSchema) });

   const onSubmit: SubmitHandler<FormFields> = async (data) => {
      try {
         const { email, password } = data;
         await signIn("password", { email, password, flow: "signIn" });
         router.push("/dashboard");
      } catch (error) {
         console.error(error);
      }
   };

   return (
      <div
         className={cn(
            "hero-pattern bg-background flex min-h-screen items-center px-4 py-16 sm:px-6 lg:px-8",
            { "hero-pattern-2": formType === "admin", "hero-pattern-1": formType === "merchant" }
         )}
      >
         <div className="mx-auto w-full max-w-md space-y-8">
            <div>
               <h1 className="mb-2 text-center text-4xl font-bold tracking-tight text-gray-900">
                  Welcome Back
               </h1>
               {formType === "merchant" && (
                  <h2 className="text-center text-lg text-gray-600">
                     Sign in to your merchant account
                  </h2>
               )}
            </div>

            <div className="bg-background border-border rounded-2xl border p-8 shadow-2xl">
               <form
                  data-testid="signin-form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
               >
                  <Input
                     {...register("email")}
                     label="Email"
                     placeholder="Enter your email"
                     autoComplete="email"
                     startIcon={<User className="text-primary size-4" />}
                     error={errors.email}
                     className="bg-white/50"
                  />

                  <InputPassword
                     {...register("password")}
                     label="Password"
                     placeholder="Enter your password"
                     autoComplete="current-password"
                     startIcon={<Lock className="text-primary size-4" />}
                     error={errors.password}
                     className="bg-white/50"
                  />

                  <Button
                     type="submit"
                     data-testid="login-button"
                     className="bg-primary hover:bg-primary w-full transform rounded-lg py-2.5 text-white transition-all duration-200 hover:scale-[1.02]"
                  >
                     Sign In
                  </Button>
               </form>

               {formType === "merchant" && (
                  <div className="mt-8 flex flex-col items-center justify-center gap-2 border-t border-gray-200 px-3 pt-6 text-sm">
                     <span className="text-gray-600">Don&apos;t have a merchant account yet?</span>
                     <div className="relative inline-block">
                        <Link
                           href="/become-merchant"
                           className="text-primary hover:text-primary/80 font-medium transition-colors outline-none"
                        >
                           Become a Merchant
                        </Link>
                        <CurlyUnderline className="w-16" />
                     </div>
                  </div>
               )}
            </div>

            <div className="text-center text-sm text-gray-600">
               <p>
                  Need help?{" "}
                  <Link href="/contact" className="text-primary hover:text-primary font-medium">
                     Contact support
                  </Link>
               </p>
            </div>
         </div>
      </div>
   );
}
