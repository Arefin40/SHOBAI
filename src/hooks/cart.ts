import toast from "react-hot-toast";
import type { CartItem } from "@/types/Cart";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
   getCartItems,
   addToCart,
   updateCartItemQuantity,
   clearCart,
   deleteCartItem
} from "@/actions/cart";

export function useCartItems() {
   return useQuery({
      queryKey: ["cart"],
      queryFn: async () => {
         const { success, data } = await getCartItems();
         if (!success || !data) return [];
         return data;
      }
   });
}

export function useAddProductToCart() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (productId: string) => {
         const result = await addToCart(productId);
         if (!result.success && result.error) toast.error(result.error);
         return { success: true, message: "Product added to cart" };
      },
      onError: (err) => {
         console.error(err);
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
   });
}

export function useUpdateCart() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
         const result = await updateCartItemQuantity(productId, quantity);
         if (!result.success && result.error) toast.error(result.error);
         return result;
      },

      onMutate: async (updatedCartItem) => {
         // Cancel any outgoing refetches
         await queryClient.cancelQueries({ queryKey: ["cart"] });

         // Snapshot the previous value
         const previousCartData = queryClient.getQueryData<CartItem[]>(["cart"]);

         // Optimistically update to the new value
         queryClient.setQueryData(["cart"], (old: CartItem[] | undefined) => {
            if (!old) return [];
            return old.map((item) =>
               item.product?.id === updatedCartItem.productId
                  ? { ...item, quantity: updatedCartItem.quantity }
                  : item
            );
         });

         // Return a context object with the snapshotted value
         return { previousCartData: previousCartData ? previousCartData : [] };
      },
      onError: (err, updatedCart, context) => {
         if (context?.previousCartData) {
            queryClient.setQueryData(["cart"], context.previousCartData);
         }
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
   });
}

export function useDeleteCartItem() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async (productId: string) => {
         const result = await deleteCartItem(productId);
         if (!result.success && result.error) toast.error(result.error);
         return result;
      },

      onMutate: async (productId: string) => {
         await queryClient.cancelQueries({ queryKey: ["cart"] });
         const previousCartData = queryClient.getQueryData<CartItem[]>(["cart"]);

         queryClient.setQueryData(["cart"], (old: CartItem[] | undefined) => {
            if (!old) return [];
            return old.filter((item) => item.product?.id !== productId);
         });

         return { previousCartData: previousCartData ? previousCartData : [] };
      },

      onError: (err, updatedCart, context) => {
         if (context?.previousCartData) {
            queryClient.setQueryData(["cart"], context.previousCartData);
         }
         toast.error("Failed to delete item from cart");
      },

      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
   });
}

export function useClearCart() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: clearCart,
      onMutate: async () => {
         await queryClient.cancelQueries({ queryKey: ["cart"] });
         const previousCartData = queryClient.getQueryData<CartItem[]>(["cart"]);
         queryClient.setQueryData(["cart"], () => []);
         return { previousCartData: previousCartData ? previousCartData : [] };
      },
      onError: (err, updatedCart, context) => {
         if (context?.previousCartData) {
            queryClient.setQueryData(["cart"], context.previousCartData);
         }
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
   });
}
