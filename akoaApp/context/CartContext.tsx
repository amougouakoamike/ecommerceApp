import { dummyCart, dummyWishlist } from "@/assets/assets";
import { Product, WishlistContextType } from "@/constants/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export type  CartItem ={
    id: string;
    productId: string;
    product: Product;
    quantity:number;
    size:string;
    price:number;
}

type CartContextType = {
    cartItems: CartItem[],
    addToCart: (product : Product, size: string) => Promise<void>;
    removeFromCart: (itemId : string, size: string) => Promise<void>;
    updateQuantity: (itemId : string, quantity: number, size : string) => Promise<void>;
    clearCart: () => Promise<void>;
    cartTotal: number;
    itemCount: number;
    isLoading: boolean;
}


const CartContext =  createContext< CartContextType| undefined>(undefined)

export function  CartProvider({children}: {children: ReactNode}){

    const [cartItems, setCartItems]= useState<CartItem[]>([])
    const [isLoading, setIsLoading]= useState(false);
    const [cartTotal, setCartTotal]= useState(0)

    const recalculateTotal = (items: CartItem[]) => {
        const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        setCartTotal(total);
    };

    const fetchCart = async () =>{
        setIsLoading(true);
        const  serverCart = dummyCart;
        const mappedItems: CartItem[] = serverCart.items.map((item) => ({
            id: `${item.product._id}-${item.size || 'M'}`,
            productId: item.product._id,
            product: item.product as Product,
            quantity: item.quantity,
            size: item?.size || 'M',
            price: item.price

        })) as CartItem[];
        setCartItems(mappedItems);
        recalculateTotal(mappedItems);
        setIsLoading(false)

    }

    const addToCart = async (product : Product, size : string) =>{
        setCartItems((currentItems) => {
            const normalizedSize = size || 'M';
            const existingItem = currentItems.find(
              (item) => item.productId === product._id && item.size === normalizedSize,
            );

            const nextItems = existingItem
              ? currentItems.map((item) =>
                  item.productId === product._id && item.size === normalizedSize
                    ? { ...item, quantity: item.quantity + 1 }
                    : item,
                )
              : [
                  ...currentItems,
                  {
                    id: `${product._id}-${normalizedSize}`,
                    productId: product._id,
                    product,
                    quantity: 1,
                    size: normalizedSize,
                    price: product.price,
                  },
                ];

            recalculateTotal(nextItems);
            return nextItems;
        });
    }
     const removeFromCart = async (productId: string, size : string) =>{
        setCartItems((currentItems) => {
            const nextItems = currentItems.filter(
              (item) => !(item.productId === productId && item.size === (size || 'M')),
            );

            recalculateTotal(nextItems);
            return nextItems;
        });
    }
     const updateQuantity = async (productId : string, quantity: number,  size : string = "M") =>{
        const safeSize = size || 'M';
        const nextQuantity = Math.max(0, quantity);

        setCartItems((currentItems) => {
            const nextItems = currentItems
              .map((item) =>
                item.productId === productId && item.size === safeSize
                  ? { ...item, quantity: nextQuantity }
                  : item,
              )
              .filter((item) => !(item.productId === productId && item.size === safeSize && item.quantity <= 0));

            recalculateTotal(nextItems);
            return nextItems;
        });
    }
     const clearCart = async () =>{
        setCartItems([]);
        setCartTotal(0);
    }

    const itemCount = cartItems.reduce((sum,item)=> sum + item.quantity, 0)

    useEffect(()=>{
        fetchCart();
    }, [])


    return (
        <CartContext.Provider  value={{
           cartItems, addToCart,
             removeFromCart, updateQuantity, 
             clearCart, cartTotal, itemCount, isLoading
        }}>
         {children}
        </CartContext.Provider>
    )

}

export function useCart(){
    const context = useContext(CartContext);
    if(context === undefined){
        throw new Error('useCart must be used within a CartProvider')
    }
   return context  
}