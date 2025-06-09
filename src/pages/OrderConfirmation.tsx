
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const OrderConfirmation = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Commande introuvable</h1>
          <Link to="/shop">
            <Button>Retour à la boutique</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Commande confirmée !</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Votre commande #{order.id} a été enregistrée avec succès.
          </p>

          <Card className="text-left">
            <CardHeader>
              <CardTitle>Détails de la commande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Produits commandés:</h3>
                <div className="space-y-1">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{(item.price * item.quantity).toLocaleString()} DZD</span>
                    </div>
                  ))}
                  {order.bundles.map((bundle: any) => (
                    <div key={bundle.id} className="flex justify-between text-sm">
                      <span>{bundle.name} x{bundle.quantity}</span>
                      <span>{(parseInt(bundle.bundlePrice.replace(/[^0-9]/g, '')) * bundle.quantity).toLocaleString()} DZD</span>
                    </div>
                  ))}
                </div>
              </div>

              <hr />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{order.totalAmount.toLocaleString()} DZD</span>
              </div>

              <div>
                <h3 className="font-medium mb-1">Mode de paiement:</h3>
                <p className="text-sm text-muted-foreground">
                  {order.paymentMethod === 'cod' && 'Paiement à la livraison'}
                  {order.paymentMethod === 'transfer' && 'Virement bancaire'}
                  {order.paymentMethod === 'baridimob' && 'BaridiMob/CCP'}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-medium mb-2">Prochaines étapes:</h3>
                <ul className="text-sm space-y-1">
                  <li>• Vous recevrez un email de confirmation</li>
                  <li>• Notre équipe préparera votre commande</li>
                  <li>• Vous serez contacté pour la livraison</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 space-x-4">
            <Link to="/dashboard">
              <Button>Voir mes commandes</Button>
            </Link>
            <Link to="/shop">
              <Button variant="outline">Continuer les achats</Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
