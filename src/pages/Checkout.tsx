
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type PaymentMethod = Database['public']['Enums']['payment_method'];

const WILAYAS = [
  { name: 'Alger', day: 'Lundi' },
  { name: 'Blida', day: 'Mardi' },
  { name: 'Tipaza', day: 'Mercredi' },
  { name: 'Boumerdès', day: 'Jeudi' }
];

const PAYMENT_METHODS = [
  { id: 'cod' as PaymentMethod, name: 'Paiement à la livraison', details: 'Payez en espèces lors de la réception' },
  { id: 'transfer' as PaymentMethod, name: 'Virement bancaire', details: 'IBAN: DZ12 3456 7890 1234 5678 - Bénéficiaire: DentGo SARL' },
  { id: 'baridimob' as PaymentMethod, name: 'BaridiMob/CCP', details: 'CCP: 1234567890 - Nom: DentGo SARL' }
];

const Checkout = () => {
  const { items, bundles, totalAmount, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const selectedWilaya = WILAYAS.find(w => w.name === profile?.wilaya);

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      toast.error('Veuillez sélectionner un mode de paiement');
      return;
    }

    setIsLoading(true);

    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalAmount,
          payment_method: paymentMethod,
          delivery_date: deliveryDate || null,
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      if (items.length > 0) {
        const orderItems = items.map(item => ({
          order_id: order.id,
          product_id: item.id,
          product_name: item.name,
          product_price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      // Insert order bundles
      if (bundles.length > 0) {
        const orderBundles = bundles.map(bundle => ({
          order_id: order.id,
          bundle_id: bundle.id,
          bundle_name: bundle.name,
          bundle_price: bundle.bundlePrice,
          quantity: bundle.quantity
        }));

        const { error: bundlesError } = await supabase
          .from('order_bundles')
          .insert(orderBundles);

        if (bundlesError) throw bundlesError;
      }

      // Clear cart after successful order
      await clearCart();

      toast.success('Commande passée avec succès !');
      navigate('/order-confirmation', { state: { order } });
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Erreur lors de la commande');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0 && bundles.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Panier vide</h1>
          <p>Ajoutez des produits à votre panier pour passer commande.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Finaliser la commande</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Résumé de commande</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{(item.price * item.quantity).toLocaleString()} DZD</span>
                  </div>
                ))}
                {bundles.map((bundle) => (
                  <div key={bundle.id} className="flex justify-between">
                    <span>{bundle.name} x{bundle.quantity}</span>
                    <span>{(parseInt(bundle.bundlePrice.replace(/[^0-9]/g, '')) * bundle.quantity).toLocaleString()} DZD</span>
                  </div>
                ))}
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{totalAmount.toLocaleString()} DZD</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info & Payment */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de livraison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Nom complet</Label>
                  <Input value={profile?.full_name || ''} disabled />
                </div>
                <div>
                  <Label>Cabinet dentaire</Label>
                  <Input value={profile?.dental_office_name || ''} disabled />
                </div>
                <div>
                  <Label>Téléphone</Label>
                  <Input value={profile?.phone || ''} disabled />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={profile?.email || user.email || ''} disabled />
                </div>
                <div>
                  <Label>Wilaya</Label>
                  <Input value={profile?.wilaya || ''} disabled />
                </div>
                <div>
                  <Label>Adresse de livraison</Label>
                  <Input value={profile?.address || ''} disabled />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            {selectedWilaya && (
              <Card>
                <CardHeader>
                  <CardTitle>Informations de livraison</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Nous livrons à {selectedWilaya.name} chaque {selectedWilaya.day}. 
                    Votre commande arrivera le prochain {selectedWilaya.day} disponible.
                  </p>
                  <div>
                    <Label htmlFor="deliveryDate">Date de livraison préférée</Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Mode de paiement</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  {PAYMENT_METHODS.map((method) => (
                    <div key={method.id} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Label htmlFor={method.id} className="font-medium">
                          {method.name}
                        </Label>
                      </div>
                      {paymentMethod === method.id && (
                        <div className="ml-6 p-3 bg-muted rounded text-sm">
                          {method.details}
                        </div>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            <Button 
              onClick={handlePlaceOrder} 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Traitement...' : 'Passer la commande'}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
