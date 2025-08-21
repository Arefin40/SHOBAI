"use client";

import React from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logInSchema } from "@/lib/schemas/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuthActions } from "@convex-dev/auth/react";
import { SignInWithGoogle } from "@/components/oauth/SignInWithGoogle";
import { Input, InputPassword, FormSeparator } from "@/components/ui/form";
import toast from "react-hot-toast";
type FormFields = z.infer<typeof logInSchema>;

export default function SignInForm() {
   const router = useRouter();
   const {
      register,
      handleSubmit,
      formState: { errors }
   } = useForm<FormFields>({ resolver: zodResolver(logInSchema) });

   const { signIn } = useAuthActions();
   const onSubmit: SubmitHandler<FormFields> = async (data) => {
      try {
         await signIn("password", {
            email: data.email,
            password: data.password,
            flow: "signIn"
         });
         toast.success("Logged in successfully!");
         router.push("/");
      } catch (error) {
         console.log(error);
         toast.error("Failed to log in!");
      }
   };

   return (
      <form
         method="post"
         data-testid="signin-form"
         onSubmit={handleSubmit(onSubmit)}
         className="text-foreground flex flex-col gap-y-8 pt-3"
      >
         <SignInWithGoogle />

         <FormSeparator>Or continue with</FormSeparator>

         <div className="grid w-full items-center gap-6">
            <Input
               {...register("email")}
               label="Email"
               placeholder="Enter email"
               autoComplete="email"
               startIcon={<User className="text-muted-foreground size-4" />}
               error={errors.email}
            />

            <InputPassword
               {...register("password")}
               label="Password"
               placeholder="Enter password"
               autoComplete="current-password"
               startIcon={<Lock className="text-muted-foreground size-4" />}
               error={errors.password}
               forgotPasswordUrl="/forgot-password"
            />
         </div>

         <Button data-testid="login-button" color="primary" className="w-full">
            Sign In
         </Button>
      </form>
   );
}
