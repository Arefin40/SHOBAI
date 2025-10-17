import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const addToCart = mutation({
   args: {
      productId: v.id("products")
   },
   handler: async (ctx, args) => {
      // Check if the user is authenticated
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new ConvexError({ status: 401, message: "Unauthorized" });

      // Check if the product exsits
      const product = await ctx.db.get(args.productId);
      if (!product) throw new ConvexError("Product not found");

      // Check if associated store with the product exists
      const store = await ctx.db.get(product.storeId);
      if (!store) throw new ConvexError("Store associated with the product not found");

      // Check if user is trying to add-to-cart own product
      if (store.merchant === userId) throw new ConvexError("Cannot add own product to cart");

      // Check if product is not out of stock
      if (!product.stock) throw new ConvexError("Out of stock");

      // Check if user cart exists
      let cart = await ctx.db
         .query("cart")
         .withIndex("by_cart_userId", (q) => q.eq("userId", userId))
         .first();

      // If not exists try to create a new cart
      if (!cart) {
         const newCartId = await ctx.db.insert("cart", { userId, totalQuantity: 0, totalPrice: 0 });
         cart = await ctx.db.get(newCartId);
      }

      // If still unable to resolve cart, then throw error
      if (!cart) throw new ConvexError("Unable to resolve cart");

      // Check if cartItem already exists
      const cartItem = await ctx.db
         .query("cart_items")
         .withIndex("by_cartitem_cardId", (q) => q.eq("cartId", cart._id))
         .filter((q) => q.eq(q.field("productId"), args.productId))
         .first();

      if (cartItem) {
         // Increament the existing cartItem quanity
         if (cartItem.quantity + 1 > product.stock)
            throw new ConvexError("Quantity exceeds available stock");

         await ctx.db.patch(cartItem._id, { quantity: cartItem.quantity + 1 });
      } else {
         // Insert new cartItem
         await ctx.db.insert("cart_items", {
            cartId: cart._id,
            productId: args.productId,
            quantity: 1
         });
      }

      // update cart totalPrice and totalQuantity
      await ctx.db.patch(cart._id, {
         totalPrice: cart.totalPrice + product.price,
         totalQuantity: cart.totalQuantity + 1
      });

      return true;
   }
});
