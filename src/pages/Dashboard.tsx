
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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

  // Calculate statistics
  const totalOrdered = userOrders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);
  const totalPaid = userOrders.reduce((sum: number, order: any) => sum + (order.amountPaid || 0), 0);
  const totalRemaining = totalOrdered - totalPaid;
  const paymentPercentage = totalOrdered > 0 ? (totalPaid / totalOrdered) * 100 : 0;

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

        {/* User Info - Moved to top */}
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

        {/* Payment Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Commandé</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalOrdered.toLocaleString()} DZD</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Payé</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{totalPaid.toLocaleString()} DZD</p>
              <Progress value={paymentPercentage} className="mt-2" />
              <p className="text-sm text-muted-foreground mt-1">{paymentPercentage.toFixed(1)}% du total</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Restant à Payer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-muted-foreground">{totalRemaining.toLocaleString()} DZD</p>
            </CardContent>
          </Card>
        </div>

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
                {userOrders.map((order: any) => {
                  const orderPaid = order.amountPaid || 0;
                  const orderRemaining = order.totalAmount - orderPaid;
                  const orderPaymentPercentage = (orderPaid / order.totalAmount) * 100;
                  
                  return (
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
                      
                      <div className="grid md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="font-medium">{order.totalAmount.toLocaleString()} DZD</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Payé</p>
                          <p className="font-medium text-green-600">{orderPaid.toLocaleString()} DZD</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Restant</p>
                          <p className="font-medium text-muted-foreground">{orderRemaining.toLocaleString()} DZD</p>
                        </div>
                      </div>
                      
                      <Progress value={orderPaymentPercentage} className="mb-3" />
                      <p className="text-xs text-muted-foreground mb-3">{orderPaymentPercentage.toFixed(1)}% payé</p>
                      
                      <div className="space-y-1">
                        <h4 className="font-medium">Produits:</h4>
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
                    </div>
                  );
                })}
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
