"use client";

import React from "react";
import { Heart } from "@/icons";
import { useMutation } from "convex/react";
import { ShoppingCart } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";

export function WishlistButton({ productId }: { productId: Id<"products"> }) {
   const toggleWishlistItem = useMutation(api.wishlist.toggleWishlistItem);

   return (
      <Button
         size="icon"
         variant="ghost"
         data-testid="toggle-wishlist-button"
         onClick={() => toggleWishlistItem({ productId })}
         className="text-foreground flex flex-shrink-0 items-center gap-x-1 rounded-full bg-white/75 p-3 py-2 text-sm backdrop-blur-sm"
      >
         <Heart className="text-foreground size-4" />
      </Button>
   );
}

export function AddToCartButton({ productId }: { productId: string }) {
   const addProductToCart = (productId: string) => {
      console.log(productId);
   };

   return (
      <Button
         variant="ghost"
         data-testid="add-to-cart-button"
         onClick={() => addProductToCart(productId)}
         className="text-foreground flex flex-shrink-0 items-center gap-x-1 rounded-full bg-white/75 p-3 py-2 text-sm backdrop-blur-sm"
      >
         <ShoppingCart className="size-4" />
      </Button>
   );
}
