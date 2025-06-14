
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface Bundle {
  id: string;
  name: string;
  nameAr?: string;
  nameFr?: string;
  bundlePrice: string;
  originalPrice: string;
  items: string[];
  quantity: number;
  type: 'bundle';
}

interface CartContextType {
  items: CartItem[];
  bundles: Bundle[];
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
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const { user } = useAuth();

  // Load cart from database when user logs in
  useEffect(() => {
    if (user) {
      loadCartFromDatabase();
    } else {
      // Clear cart when user logs out
      setItems([]);
      setBundles([]);
    }
  }, [user]);

  const loadCartFromDatabase = async () => {
    if (!user) return;

    try {
      // Load cart items
      const { data: cartItems, error: itemsError } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (*)
        `)
        .eq('user_id', user.id);

      if (itemsError) {
        console.error('Error loading cart items:', itemsError);
      } else {
        const formattedItems: CartItem[] = cartItems.map((item: any) => ({
          id: item.products.id,
          name: item.products.name_fr,
          nameAr: item.products.name_ar || '',
          nameFr: item.products.name_fr,
          description: item.products.description_fr,
          descriptionAr: item.products.description_ar || '',
          descriptionFr: item.products.description_fr,
          price: item.products.price,
          originalPrice: item.products.original_price,
          image: item.products.image,
          category: '',
          rating: item.products.rating || 4.5,
          reviews: item.products.reviews || 0,
          inStock: item.products.in_stock,
          badge: item.products.badge,
          specifications: item.products.specifications,
          productId: item.products.product_id,
          productCode: item.products.product_code,
          quantity: item.quantity
        }));
        setItems(formattedItems);
      }

      // Load cart bundles
      const { data: cartBundles, error: bundlesError } = await supabase
        .from('cart_bundles')
        .select(`
          *,
          bundles (*)
        `)
        .eq('user_id', user.id);

      if (bundlesError) {
        console.error('Error loading cart bundles:', bundlesError);
      } else {
        const formattedBundles: Bundle[] = cartBundles.map((item: any) => ({
          id: item.bundles.id,
          name: item.bundles.name_fr || item.bundles.name,
          nameAr: item.bundles.name_ar,
          nameFr: item.bundles.name_fr,
          bundlePrice: item.bundles.bundle_price,
          originalPrice: item.bundles.original_price,
          items: item.bundles.items,
          quantity: item.quantity,
          type: 'bundle' as const
        }));
        setBundles(formattedBundles);
      }
    } catch (error) {
      console.error('Error loading cart from database:', error);
    }
  };

  const addItem = async (product: Product) => {
    if (!user) {
      toast.error('Veuillez vous connecter pour ajouter des articles au panier');
      return;
    }

    try {
      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .single();

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        // Insert new item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: product.id,
            quantity: 1
          });

        if (error) throw error;
      }

      // Reload cart from database
      loadCartFromDatabase();
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Erreur lors de l\'ajout au panier');
    }
  };

  const addBundle = async (bundle: Bundle) => {
    if (!user) {
      toast.error('Veuillez vous connecter pour ajouter des kits au panier');
      return;
    }

    try {
      // Check if bundle already exists in cart
      const { data: existingBundle } = await supabase
        .from('cart_bundles')
        .select('*')
        .eq('user_id', user.id)
        .eq('bundle_id', bundle.id)
        .single();

      if (existingBundle) {
        // Update quantity
        const { error } = await supabase
          .from('cart_bundles')
          .update({ quantity: existingBundle.quantity + 1 })
          .eq('id', existingBundle.id);

        if (error) throw error;
      } else {
        // Insert new bundle
        const { error } = await supabase
          .from('cart_bundles')
          .insert({
            user_id: user.id,
            bundle_id: bundle.id,
            quantity: 1
          });

        if (error) throw error;
      }

      // Reload cart from database
      loadCartFromDatabase();
    } catch (error) {
      console.error('Error adding bundle to cart:', error);
      toast.error('Erreur lors de l\'ajout du kit au panier');
    }
  };

  const removeItem = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', id);

      if (error) throw error;
      loadCartFromDatabase();
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const removeBundle = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_bundles')
        .delete()
        .eq('user_id', user.id)
        .eq('bundle_id', id);

      if (error) throw error;
      loadCartFromDatabase();
    } catch (error) {
      console.error('Error removing bundle from cart:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', id);

      if (error) throw error;
      loadCartFromDatabase();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const updateBundleQuantity = async (id: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      removeBundle(id);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_bundles')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('bundle_id', id);

      if (error) throw error;
      loadCartFromDatabase();
    } catch (error) {
      console.error('Error updating bundle quantity:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      // Clear cart items
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      // Clear cart bundles
      await supabase
        .from('cart_bundles')
        .delete()
        .eq('user_id', user.id);

      setItems([]);
      setBundles([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Erreur lors du vidage du panier');
    }
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
