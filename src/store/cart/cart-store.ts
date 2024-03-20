import { CartProduct } from "@/interfaces/product.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];
  addProductToCart: (product: CartProduct) => void;
  getTotalItems: () => number;
  updateProductQuantity: (product: CartProduct, quantity: number) => number;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      addProductToCart: (product: CartProduct) => {
        const { cart } = get();

        const productInCart = cart.some(
          (prod) => prod.id === product.id && prod.size === product.size
        );

        if (!productInCart) {
          set({ cart: [...cart, product] });
          return;
        }

        const updatedCartProducts = cart.map((prod) => {
          if (prod.id === product.id && prod.size === product.size) {
            return { ...prod, quantity: prod.quantity + product.quantity };
          }

          return prod;
        });

        set({ cart: updatedCartProducts });
      },
      getTotalItems: () => {
        const { cart } = get();

        return cart.reduce((acum, item) => acum + item.quantity, 0);
      },
      updateProductQuantity: (product: CartProduct, quantity: number) => {
        console.log({ product, quantity });
      },
    }),
    {
      name: "shopping-cart",
    }
  )
);
