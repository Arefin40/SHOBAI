import toast from "react-hot-toast";
import { Google } from "@/icons";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

export function SignInWithGoogle() {
   const { signIn } = useAuthActions();

   const googleSignIn = () => {
      void signIn("google", { redirectTo: "/" });
      toast.success("Logged in successfully!");
   };

   return (
      <Button
         type="button"
         variant="outline"
         className="w-full gap-x-3 text-sm"
         onClick={googleSignIn}
      >
         <Google />
         <span>Sign in with Google</span>
      </Button>
   );
}
