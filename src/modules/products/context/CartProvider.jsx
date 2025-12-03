import { createContext, useState, useEffect, useContext } from 'react';

const CART_KEY = 'cart';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const storedCart = localStorage.getItem(CART_KEY);
      // Inicializa el carrito leyendo desde localStorage
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error('Error al parsear el carrito desde localStorage', error);
      return [];
    }
  });

  // Sincroniza el estado del carrito con localStorage cada vez que 'cart' cambia
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  /**
   * Agrega/Actualiza un producto en el carrito.
   * @param {object} product - El objeto del producto.
   * @param {number} quantity - La cantidad a establecer para el producto.
   */
  const addToCart = (product, quantity) => {
    if (quantity < 1) { // Validación de la consigna 
      console.warn('La cantidad a agregar debe ser mayor a 0');
      return;
    }

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);

      if (existingItemIndex > -1) {
        // Actualizar la cantidad del producto existente
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity = quantity;
        
        return newCart;
      } else {
        // Nuevo producto, agregar
        const newCartItem = {
          id: product.id,
          sku: product.sku,
          name: product.name,
          currentUnitPrice: product.currentUnitPrice, // Precio al momento de la adición
          quantity: quantity,
        };
        return [...prevCart, newCartItem];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => { // Usado después de una compra exitosa
    setCart([]);
    localStorage.removeItem(CART_KEY);
  };
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + (item.currentUnitPrice * item.quantity), 0).toFixed(2);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    totalItems,
    totalAmount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}