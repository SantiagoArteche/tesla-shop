import { CartProduct } from "@/interfaces/product.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SummaryInfo {
  subTotal: number;
  tax: number;
  itemsInCart: number;
  total: number;
}

interface State {
  cart: CartProduct[];
  addProductToCart: (product: CartProduct) => void;
  getTotalItems: () => number;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeProductFromCart: (product: CartProduct) => void;
  getSummaryInfo: () => SummaryInfo;
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
        const { cart } = get();

        const updatedProductQuantity = cart.map((prod) => {
          if (prod.id === product.id && prod.size === product.size) {
            return { ...prod, quantity };
          }
          return prod;
        });

        set({ cart: updatedProductQuantity });
      },
      removeProductFromCart: (product: CartProduct) => {
        const { cart } = get();

        const prodInCart = cart.find((prod) => {
          return prod.id === product.id && prod.size === product.size;
        });

        if (!prodInCart) {
          throw new Error("Product not found");
        }

        const removeProduct = cart.filter((prod) => prod !== prodInCart);

        set({ cart: removeProduct });
      },
      getSummaryInfo: (): SummaryInfo => {
        const { cart } = get();

        const subTotal = cart.reduce(
          (acum, item) => acum + item.quantity * item.price,
          0
        );

        const tax = subTotal * 0.15;
        const total = subTotal + tax;
        const itemsInCart = cart.reduce(
          (acum, item) => acum + item.quantity,
          0
        );

        return {
          subTotal,
          tax,
          total,
          itemsInCart,
        };
      },
    }),
    {
      name: "shopping-cart",
    }
  )
);
