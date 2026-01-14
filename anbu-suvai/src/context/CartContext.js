import { createContext, useEffect, useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = "demoUser123";

  useEffect(() => {
    const loadCart = async () => {
      try {
        const ref = doc(db, "userCart", userId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setCart(snap.data().items || []);
        }
      } catch (err) {
        console.error("Load cart error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const syncCart = async (updatedCart) => {
    const ref = doc(db, "userCart", userId);
    await setDoc(ref, { items: updatedCart }, { merge: true });
  };

  const addToCart = (food) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === food.id);
      let updatedCart;

      if (exists) {
        updatedCart = prev.map((i) =>
          i.id === food.id ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        updatedCart = [
          ...prev,
          {
            ...food,
            price: Number(food.price),
            qty: 1,
          },
        ];
      }

      syncCart(updatedCart);
      return updatedCart;
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      syncCart(updated);
      return updated;
    });
  };

  const clearCart = async () => {
    setCart([]);
    await syncCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, loading }}
    >
      {children}
    </CartContext.Provider>
  );
};
