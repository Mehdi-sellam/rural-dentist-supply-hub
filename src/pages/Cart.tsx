import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';

const Cart = () => {
  const { items, bundles, totalAmount, itemCount, updateQuantity, updateBundleQuantity, removeItem, removeBundle, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  console.log('[Cart] Rendering cart with', items.length, 'items and', bundles.length, 'bundles');

  const generateWhatsAppOrder = () => {
    let message = "Bonjour! J'aimerais passer une commande:\n\n";
    items.forEach(item => {
      message += `${item.name} - Quantité: ${item.quantity} - ${(item.price * item.quantity).toLocaleString()} DZD\n`;
    });
    bundles.forEach(bundle => {
      const price = parseInt(bundle.bundlePrice.replace(/[^0-9]/g, ''));
      message += `${bundle.name} (Kit) - Quantité: ${bundle.quantity} - ${(price * bundle.quantity).toLocaleString()} DZD\n`;
    });
    message += `\nTotal: ${totalAmount.toLocaleString()} DZD\n\nMerci de confirmer la disponibilité et les détails de livraison.`;
    return `https://wa.me/213XXXXXXXXX?text=${encodeURIComponent(message)}`;
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/auth');
    }
  };

  if (items.length === 0 && bundles.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('cart.empty')}</h1>
            <p className="text-gray-600 mb-8">Commencez vos achats pour ajouter des articles à votre panier</p>
            <Link to="/shop">
              <Button size="lg">
                {t('cart.continueShopping')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{t('cart.title')}</h1>
          <p className="text-gray-600">{itemCount} articles dans votre panier</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-primary">{item.price.toLocaleString()} DZD</span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {item.originalPrice.toLocaleString()} DZD
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="font-bold text-lg">{(item.price * item.quantity).toLocaleString()} DZD</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {bundles.map((bundle) => (
              <Card key={bundle.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {/* Bundle Image */}
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📦</span>
                    </div>

                    {/* Bundle Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{bundle.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">Kit ({bundle.items.length} articles)</p>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-primary">{bundle.bundlePrice}</span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateBundleQuantity(bundle.id, bundle.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{bundle.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateBundleQuantity(bundle.id, bundle.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Bundle Total */}
                    <div className="text-right">
                      <p className="font-bold text-lg">{(parseInt(bundle.bundlePrice.replace(/[^0-9]/g, '')) * bundle.quantity).toLocaleString()} DZD</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBundle(bundle.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={clearCart}>
                Vider le panier
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.open(generateWhatsAppOrder(), '_blank')}
                className="gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Commander via WhatsApp
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Résumé de la commande</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{totalAmount.toLocaleString()} DZD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span className="text-green-600">Gratuite</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{totalAmount.toLocaleString()} DZD</span>
                  </div>
                </div>

                <Button 
                  onClick={handleCheckout}
                  className="w-full mb-3"
                  size="lg"
                >
                  Passer la commande
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => window.open(generateWhatsAppOrder(), '_blank')}
                  className="w-full gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Commander via WhatsApp
                </Button>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-3">Informations de livraison</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>🚚 Livraison gratuite partout en Algérie</p>
                  <p>⏰ Délai: 24-48h dans les grandes villes</p>
                  <p>🏘️ 48h garantie dans les zones rurales</p>
                  <p>💳 Paiement à la livraison</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
