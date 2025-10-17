"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { EmptyCart } from "@/icons";
import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { ArrowLeft, ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/form";
import CartLoading from "./CartLoading";

type PreloadedCart = {
   preloadedCart: Preloaded<typeof api.cart.getCart>;
};

function UserCart({ preloadedCart }: PreloadedCart) {
   const cart = usePreloadedQuery(preloadedCart);
   if (cart === undefined) return <CartLoading />;
   if (!cart.totalQuantity) return <EmptyState />;

   return (
      <section className="box-container scroll-hide grid size-full gap-4 overflow-hidden overflow-y-auto xl:grid-cols-[1fr_20rem] xl:overflow-y-hidden">
         <section className="flex flex-col space-y-10 rounded-xl bg-white p-6 xl:overflow-hidden">
            <header className="flex items-center justify-between pb-2">
               <h1 className="text-foreground text-2xl font-bold">Shopping Cart</h1>
               <div className="flex items-center gap-4">
                  <p className="space-x-1.5">
                     <span className="text-foreground font-semibold">{cart.totalQuantity}</span>
                     <span>items</span>
                  </p>
                  <div className="h-8 w-[1px] bg-gray-200"></div>
                  <button
                     data-testid="clear-cart-button"
                     className="hover:text-primary transition-colors"
                  >
                     Clear All
                  </button>
               </div>
            </header>

            <section className="flex flex-1 flex-col xl:overflow-hidden xl:overflow-y-auto">
               <header className="grid grid-cols-[2fr_1fr_1fr_1fr_5rem] border-b border-gray-100 pb-3 uppercase">
                  <div>Product</div>
                  <div className="text-center">Quantity</div>
                  <div className="text-center">Price</div>
                  <div className="text-center">Total</div>
                  <div className="text-center">Action</div>
               </header>

               <main
                  data-testid="cart-items"
                  className="scroll-hide flex-1 overflow-hidden overflow-y-auto"
               >
                  {cart.items.map((item) => (
                     <div
                        key={item.id}
                        data-testid="cart-item"
                        className="grid grid-cols-[2fr_1fr_1fr_1fr_5rem] border-b border-gray-100 py-3 pb-6"
                     >
                        <div className="flex items-center gap-x-6">
                           <Link href={`/products/${item.id}/details`} className="shrink-0">
                              <Image
                                 priority
                                 width={64}
                                 height={64}
                                 src={item.image!}
                                 alt={item.name}
                                 className="size-16 shrink-0 rounded-md object-cover object-top"
                              />
                           </Link>
                           <div className="space-y-0.5">
                              <Link
                                 href={`/products/${item.id}/details`}
                                 className="text-foreground font-semibold"
                              >
                                 {item.name}
                              </Link>
                           </div>
                        </div>
                        <div className="flex-center">
                           <div className="flex-center gap-x-2">
                              <button className="flex-center size-9 rounded-full bg-gray-100 transition-all hover:bg-gray-200 active:scale-90">
                                 <Minus className="size-4" />
                              </button>
                              <Input
                                 readOnly
                                 value={item.quantity}
                                 baseClassName="w-16 text-center appearance-none"
                              />
                              <button className="flex-center size-9 rounded-full bg-gray-100 transition-all hover:bg-gray-200 active:scale-90">
                                 <Plus className="size-4" />
                              </button>
                           </div>
                        </div>
                        <div className="flex-center text-foreground">{item.price} Tk.</div>
                        <div className="flex-center text-foreground">
                           {(item.price || 0) * item.quantity} Tk.
                        </div>
                        <div className="flex-center">
                           <button className="flex-center group size-10 rounded-full bg-gray-100 transition-all hover:bg-gray-200 active:scale-90">
                              <Trash2 className="text-muted-foreground size-4 group-hover:text-black" />
                           </button>
                        </div>
                     </div>
                  ))}
               </main>
            </section>

            <footer className="mt-full flex justify-between">
               <Link
                  href="/products"
                  className="text-muted-foreground flex items-center gap-x-2 rounded-xl border px-4 py-3"
               >
                  <ArrowLeft className="size-5" />
                  <span>Continue Shopping</span>
               </Link>
               <div className="flex items-center gap-x-6">
                  <p className="space-x-1.5">
                     <span>Total:</span>
                     <span className="text-foreground font-semibold">{cart.totalPrice} Tk.</span>
                  </p>

                  <Link
                     href="/checkout"
                     data-testid="checkout-button"
                     className="bg-primary flex items-center gap-x-2 rounded-xl border px-4 py-3 text-white"
                  >
                     <span>Checkout</span>
                     <ArrowRight className="size-5" />
                  </Link>
               </div>
            </footer>
         </section>

         <aside className="flex w-full flex-col items-start">
            <section className="w-full space-y-6 rounded-xl bg-white px-5 py-6">
               <h2 className="font-bold">Order Summary</h2>

               <div className="flex gap-2">
                  <Input placeholder="Coupon Code" baseClassName="h-10" />
                  <button className="h-10">Apply</button>
               </div>

               <div className="flex w-full flex-col gap-y-2 pt-4 text-sm">
                  <p className="flex justify-between">
                     <span className="text-gray-700">Sub Total</span>
                     <span className="font-semibold">{cart.totalPrice} BDT</span>
                  </p>
                  <p className="flex justify-between">
                     <span>
                        <span className="text-gray-700">Tax</span>
                        <span className="text-muted-foreground ml-1">/ 5%</span>
                     </span>
                     <span className="font-semibold">{cart.totalPrice * 0.05} BDT</span>
                  </p>
                  <p className="flex justify-between">
                     <span>
                        <span className="text-gray-700">Shipping</span>
                        <span className="text-muted-foreground ml-1">/ STANDARD</span>
                     </span>
                     <span className="font-semibold">{100} BDT</span>
                  </p>
                  <p className="mt-2 flex justify-between border-t pt-4">
                     <span className="font-semibold">Grand Total</span>
                     <span className="font-semibold">{cart.totalPrice * 1.05 + 100} BDT</span>
                  </p>
               </div>
            </section>
         </aside>
      </section>
   );
}

function EmptyState() {
   return (
      <section data-testid="empty-cart" className="flex-center h-full pt-20">
         <div className="flex-center flex-1 flex-col">
            <EmptyCart className="mx-auto w-full max-w-md" />
            <p className="text-foreground text-center text-2xl leading-relaxed font-semibold tracking-tight">
               Your cart is looking a bit lonely
               <span className="text-muted-foreground mt-1 block text-lg font-normal">
                  Add some items to make it happy!
               </span>
            </p>
         </div>
      </section>
   );
}

export default UserCart;
