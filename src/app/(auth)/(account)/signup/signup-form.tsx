"use client";

import React from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input, InputPassword, FormSeparator } from "@/components/ui/form";
import { signUpSchema } from "@/lib/schemas/auth-schema";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthActions } from "@convex-dev/auth/react";
import { SignInWithGoogle } from "@/components/oauth/SignInWithGoogle";
import toast from "react-hot-toast";

type FormFields = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
   const {
      register,
      reset,
      handleSubmit,
      formState: { errors }
   } = useForm<FormFields>({ resolver: zodResolver(signUpSchema) });
   const { signIn } = useAuthActions();

   const onSubmit: SubmitHandler<FormFields> = async (data) => {
      try {
         await signIn("password", {
            name: data.fname + " " + data.lname,
            email: data.email,
            password: data.password,
            flow: "signUp",
            redirectTo: "/"
         });
         toast.success("Account created successfully");
         reset();
      } catch (error) {
         console.log(error);
         toast.error("Failed to create an account");
      }
   };

   return (
      <form
         method="post"
         data-testid="signup-form"
         onSubmit={handleSubmit(onSubmit)}
         className="text-foreground flex flex-col gap-y-8 pt-3"
      >
         <SignInWithGoogle />

         <FormSeparator>Or continue with</FormSeparator>

         <div className="grid w-full items-center gap-5">
            <div className="flex flex-wrap gap-5">
               <Input
                  {...register("fname")}
                  label="First name"
                  placeholder="Enter your first name"
                  autoComplete="given-name"
                  error={errors.fname}
               />
               <Input
                  {...register("lname")}
                  label="Last name"
                  placeholder="Enter your last name"
                  autoComplete="family-name"
                  error={errors.lname}
               />
            </div>

            <Input
               {...register("email")}
               label="Email"
               placeholder="Enter email address"
               autoComplete="email"
               error={errors.email}
            />

            <InputPassword
               {...register("password")}
               label="Password"
               placeholder="Enter a password"
               autoComplete="new-password"
               error={errors.password}
            />
            <InputPassword
               {...register("confirmPassword")}
               label="Confirm Password"
               placeholder="Enter the password again"
               autoComplete="new-password"
               error={errors.confirmPassword}
            />
         </div>

         <Button color="primary" className="w-full" data-testid="signup-button">
            Create account
         </Button>
      </form>
   );
}
