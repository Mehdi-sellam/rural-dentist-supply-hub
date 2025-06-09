
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
          <p>Vous n'avez pas les permissions pour accéder à cette page.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const savedOrders = JSON.parse(localStorage.getItem('dentgo_orders') || '[]');
  const savedUsers = JSON.parse(localStorage.getItem('dentgo_users') || '[]');

  const updateOrderStatus = (orderId: string, status: string) => {
    const orders = savedOrders.map((order: any) => 
      order.id === orderId ? { ...order, status } : order
    );
    localStorage.setItem('dentgo_orders', JSON.stringify(orders));
    toast.success('Statut mis à jour');
    window.location.reload();
  };

  const updatePaymentStatus = (orderId: string, paymentStatus: string) => {
    const orders = savedOrders.map((order: any) => 
      order.id === orderId ? { ...order, paymentStatus } : order
    );
    localStorage.setItem('dentgo_orders', JSON.stringify(orders));
    toast.success('Statut de paiement mis à jour');
    window.location.reload();
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Administration</h1>

        {/* Navigation */}
        <div className="flex space-x-4 mb-8">
          <Button 
            variant={activeTab === 'orders' ? 'default' : 'outline'}
            onClick={() => setActiveTab('orders')}
          >
            Commandes
          </Button>
          <Button 
            variant={activeTab === 'clients' ? 'default' : 'outline'}
            onClick={() => setActiveTab('clients')}
          >
            Clients
          </Button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <Card>
            <CardHeader>
              <CardTitle>Gestion des commandes</CardTitle>
            </CardHeader>
            <CardContent>
              {savedOrders.length === 0 ? (
                <p className="text-muted-foreground">Aucune commande trouvée.</p>
              ) : (
                <div className="space-y-6">
                  {savedOrders.map((order: any) => {
                    const customer = savedUsers.find((u: any) => u.id === order.userId);
                    return (
                      <div key={order.id} className="border rounded p-4">
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h3 className="font-medium">Commande #{order.id}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                            <p className="text-sm">
                              Client: {customer?.fullName || 'Client introuvable'}
                            </p>
                            <p className="text-sm">
                              Cabinet: {customer?.dentalOfficeName}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              {order.totalAmount.toLocaleString()} DZD
                            </p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Statut de la commande</Label>
                            <Select 
                              value={order.status} 
                              onValueChange={(value) => updateOrderStatus(order.id, value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">En attente</SelectItem>
                                <SelectItem value="confirmed">Confirmée</SelectItem>
                                <SelectItem value="shipped">Expédiée</SelectItem>
                                <SelectItem value="delivered">Livrée</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Statut du paiement</Label>
                            <Select 
                              value={order.paymentStatus} 
                              onValueChange={(value) => updatePaymentStatus(order.id, value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">En attente</SelectItem>
                                <SelectItem value="partial">Partiel</SelectItem>
                                <SelectItem value="paid">Payé</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

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
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <Card>
            <CardHeader>
              <CardTitle>Clients enregistrés</CardTitle>
            </CardHeader>
            <CardContent>
              {savedUsers.length === 0 ? (
                <p className="text-muted-foreground">Aucun client enregistré.</p>
              ) : (
                <div className="space-y-4">
                  {savedUsers.map((client: any) => (
                    <div key={client.id} className="border rounded p-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-medium">{client.fullName}</h3>
                          <p className="text-sm text-muted-foreground">{client.dentalOfficeName}</p>
                          <p className="text-sm">{client.email}</p>
                        </div>
                        <div>
                          <p className="text-sm">{client.phone}</p>
                          <p className="text-sm">{client.wilaya}</p>
                          <p className="text-sm">{client.address}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
