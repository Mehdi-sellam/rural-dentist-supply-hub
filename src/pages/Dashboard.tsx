
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  // Get user orders
  const savedOrders = JSON.parse(localStorage.getItem('dentgo_orders') || '[]');
  const userOrders = savedOrders.filter((order: any) => order.userId === user.id);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline">En attente</Badge>;
      case 'confirmed': return <Badge className="bg-blue-500">Confirmée</Badge>;
      case 'shipped': return <Badge className="bg-orange-500">Expédiée</Badge>;
      case 'delivered': return <Badge className="bg-green-500">Livrée</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline">En attente</Badge>;
      case 'partial': return <Badge className="bg-orange-500">Partiel</Badge>;
      case 'paid': return <Badge className="bg-green-500">Payé</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>

        {/* User Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Informations du compte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p><strong>Nom:</strong> {user.fullName}</p>
                <p><strong>Cabinet:</strong> {user.dentalOfficeName}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
              <div>
                <p><strong>Téléphone:</strong> {user.phone}</p>
                <p><strong>Wilaya:</strong> {user.wilaya}</p>
                <p><strong>Adresse:</strong> {user.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Mes commandes</CardTitle>
          </CardHeader>
          <CardContent>
            {userOrders.length === 0 ? (
              <p className="text-muted-foreground">Aucune commande trouvée.</p>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order: any) => (
                  <div key={order.id} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">Commande #{order.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(order.status)}
                        <div className="mt-1">
                          {getPaymentStatusBadge(order.paymentStatus)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1 mb-2">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="text-sm flex justify-between">
                          <span>{item.name} x{item.quantity}</span>
                          <span>{(item.price * item.quantity).toLocaleString()} DZD</span>
                        </div>
                      ))}
                      {order.bundles.map((bundle: any) => (
                        <div key={bundle.id} className="text-sm flex justify-between">
                          <span>{bundle.name} x{bundle.quantity}</span>
                          <span>{(parseInt(bundle.bundlePrice.replace(/[^0-9]/g, '')) * bundle.quantity).toLocaleString()} DZD</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>{order.totalAmount.toLocaleString()} DZD</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
