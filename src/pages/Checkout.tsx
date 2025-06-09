
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

const WILAYAS = [
  { name: 'Alger', day: 'Lundi' },
  { name: 'Blida', day: 'Mardi' },
  { name: 'Tipaza', day: 'Mercredi' },
  { name: 'Boumerdès', day: 'Jeudi' }
];

const PAYMENT_METHODS = [
  { id: 'cod', name: 'Paiement à la livraison', details: 'Payez en espèces lors de la réception' },
  { id: 'transfer', name: 'Virement bancaire', details: 'IBAN: DZ12 3456 7890 1234 5678 - Bénéficiaire: DentGo SARL' },
  { id: 'baridimob', name: 'BaridiMob/CCP', details: 'CCP: 1234567890 - Nom: DentGo SARL' }
];

const Checkout = () => {
  const { items, bundles, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const selectedWilaya = WILAYAS.find(w => w.name === user.wilaya);

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      toast.error('Veuillez sélectionner un mode de paiement');
      return;
    }

    setIsLoading(true);

    try {
      const order = {
        id: Date.now().toString(),
        userId: user.id,
        items,
        bundles,
        totalAmount,
        paymentMethod,
        deliveryDate,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString()
      };

      // Save order
      const savedOrders = JSON.parse(localStorage.getItem('dentgo_orders') || '[]');
      savedOrders.push(order);
      localStorage.setItem('dentgo_orders', JSON.stringify(savedOrders));

      // Clear cart
      clearCart();

      toast.success('Commande passée avec succès !');
      navigate('/order-confirmation', { state: { order } });
    } catch (error) {
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
                  <Input value={user.fullName} disabled />
                </div>
                <div>
                  <Label>Cabinet dentaire</Label>
                  <Input value={user.dentalOfficeName} disabled />
                </div>
                <div>
                  <Label>Téléphone</Label>
                  <Input value={user.phone} disabled />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={user.email} disabled />
                </div>
                <div>
                  <Label>Wilaya</Label>
                  <Input value={user.wilaya} disabled />
                </div>
                <div>
                  <Label>Adresse de livraison</Label>
                  <Input value={user.address} disabled />
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
