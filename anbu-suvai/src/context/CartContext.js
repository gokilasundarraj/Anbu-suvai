import { createContext, useEffect, useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase/firebaseConfig";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setCart([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const loadCart = async () => {
      try {
        const ref = doc(db, "userCart", userId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setCart(snap.data().items || []);
        } else {
          setCart([]);
        }
      } catch (err) {
        console.error("Load cart error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [userId]);

  const syncCart = async (updatedCart) => {
    if (!userId) return;
    const ref = doc(db, "userCart", userId);
    await setDoc(ref, { items: updatedCart }, { merge: true });
  };

  const addToCart = (food) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === food.id);
      const updatedCart = exists
        ? prev.map((i) =>
            i.id === food.id ? { ...i, qty: i.qty + 1 } : i
          )
        : [...prev, { ...food, price: Number(food.price), qty: 1 }];

      syncCart(updatedCart);
      return updatedCart;
    });
  };

  const decreaseQty = (id) => {
    setCart((prev) => {
      const updatedCart = prev
        .map((i) =>
          i.id === id ? { ...i, qty: i.qty - 1 } : i
        )
        .filter((i) => i.qty > 0);

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
      value={{
        cart,
        addToCart,
        decreaseQty,
        removeFromCart,
        clearCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
