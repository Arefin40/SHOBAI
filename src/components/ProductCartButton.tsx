"use client";

import React from "react";
import { Heart } from "@/icons";
import { useMutation } from "convex/react";
import { ShoppingCart } from "lucide-react";
import { ConvexError } from "convex/values";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import toast from "react-hot-toast";

export function WishlistButton({ productId }: { productId: Id<"products"> }) {
   const toggleWishlistItem = useMutation(api.wishlist.toggleWishlistItem);

   const handleToggleWishlistItem = async () => {
      try {
         await toggleWishlistItem({ productId });
      } catch (error) {
         toast.error(error instanceof ConvexError ? error.data : "Failed to add/remove item");
      }
   };

   return (
      <Button
         size="icon"
         variant="ghost"
         data-testid="toggle-wishlist-button"
         onClick={handleToggleWishlistItem}
         className="text-foreground flex flex-shrink-0 items-center gap-x-1 rounded-full bg-white/75 p-3 py-2 text-sm backdrop-blur-sm"
      >
         <Heart className="text-foreground size-4" />
      </Button>
   );
}

export function AddToCartButton({ productId }: { productId: Id<"products"> }) {
   const addProductToCart = useMutation(api.cart.addToCart);

   const handleAddToCart = async () => {
      try {
         await addProductToCart({ productId });
      } catch (error) {
         toast.error(
            error instanceof ConvexError ? error.data : "Failed to add product to the cart"
         );
      }
   };

   return (
      <Button
         variant="ghost"
         data-testid="add-to-cart-button"
         onClick={handleAddToCart}
         className="text-foreground flex flex-shrink-0 items-center gap-x-1 rounded-full bg-white/75 p-3 py-2 text-sm backdrop-blur-sm"
      >
         <ShoppingCart className="size-4" />
      </Button>
   );
}
