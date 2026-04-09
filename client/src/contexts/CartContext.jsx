import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === product.id && item.variant === product.variant
      );
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.variant === product.variant
            ? { ...item, qty: item.qty + product.qty }
            : item
        );
      }
      return [...prev, product];
    });
  };

  const removeItem = (id, variant) => {
    setItems((prev) =>
      prev.filter((item) => !(item.id === id && item.variant === variant))
    );
  };

  const changeQty = (id, variant, delta) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id && item.variant === variant
            ? { ...item, qty: Math.max(0, item.qty + delta) }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const updateVariant = (id, oldVariant, newVariant) => {
    setItems((prev) => {
      const existing = prev.find(
        (item) => item.id === id && item.variant === newVariant
      );
      if (existing) {
        return prev
          .map((item) =>
            item.id === id && item.variant === newVariant
              ? { ...item, qty: item.qty + (prev.find(i => i.id === id && i.variant === oldVariant)?.qty || 0) }
              : item
          )
          .filter((item) => !(item.id === id && item.variant === oldVariant));
      }
      return prev.map((item) =>
        item.id === id && item.variant === oldVariant
          ? { ...item, variant: newVariant }
          : item
      );
    });
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((o) => !o);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        changeQty,
        updateVariant,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
}
