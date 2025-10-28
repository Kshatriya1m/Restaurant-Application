import React, { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (dish) => {
    const dishId = dish.id || dish._id;
    setCartItems((prev) => {
      const existing = prev.find((item) => (item.id || item._id) === dishId);
      if (existing) {
        return prev.map((item) =>
          (item.id || item._id) === dishId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => (item.id || item._id) === id);
      if (!existing) return prev;
      if (existing.quantity === 1) {
        return prev.filter((item) => (item.id || item._id) !== id);
      }
      return prev.map((item) =>
        (item.id || item._id) === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const clearCart = () => setCartItems([]);

  const totalItems = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [cartItems, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = () => useContext(CartContext);
