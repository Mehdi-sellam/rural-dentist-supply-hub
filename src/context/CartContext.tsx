
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Bundle } from '@/types/product';

interface BundleCartItem {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  bundlePrice: string;
  items: string[];
  quantity: number;
  type: 'bundle';
}

interface CartContextType {
  items: CartItem[];
  bundles: BundleCartItem[];
  addItem: (product: Product) => void;
  addBundle: (bundle: Bundle) => void;
  removeItem: (id: string) => void;
  removeBundle: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateBundleQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [bundles, setBundles] = useState<BundleCartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem('cart-items');
    const savedBundles = localStorage.getItem('cart-bundles');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
    if (savedBundles) {
      setBundles(JSON.parse(savedBundles));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart-items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('cart-bundles', JSON.stringify(bundles));
  }, [bundles]);

  const addItem = (product: Product) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const addBundle = (bundle: Bundle) => {
    setBundles(prevBundles => {
      const existingBundle = prevBundles.find(item => item.id === bundle.id);
      if (existingBundle) {
        return prevBundles.map(item =>
          item.id === bundle.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevBundles, { 
        ...bundle, 
        quantity: 1,
        type: 'bundle' as const
      }];
    });
  };

  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const removeBundle = (id: string) => {
    setBundles(prevBundles => prevBundles.filter(bundle => bundle.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const updateBundleQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeBundle(id);
      return;
    }
    setBundles(prevBundles =>
      prevBundles.map(bundle =>
        bundle.id === id ? { ...bundle, quantity } : bundle
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setBundles([]);
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0) + 
                   bundles.reduce((total, bundle) => total + bundle.quantity, 0);

  const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0) +
                     bundles.reduce((total, bundle) => {
                       const price = parseInt(bundle.bundlePrice.replace(/[^0-9]/g, ''));
                       return total + (price * bundle.quantity);
                     }, 0);

  return (
    <CartContext.Provider value={{
      items,
      bundles,
      addItem,
      addBundle,
      removeItem,
      removeBundle,
      updateQuantity,
      updateBundleQuantity,
      clearCart,
      itemCount,
      totalAmount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
