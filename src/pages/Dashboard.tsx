
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  // Add effect to refetch orders when user navigates back to dashboard
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        fetchUserOrders();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  const fetchUserOrders = async () => {
    if (!user?.id) {
      console.log('No user ID available for fetching orders');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching orders for user:', user.id);
      
      // Fetch orders with related order items and bundles
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*),
          order_bundles (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        throw ordersError;
      }

      console.log('Successfully fetched orders:', ordersData);
      setOrders(ordersData || []);
      
      if (!ordersData || ordersData.length === 0) {
        console.log('No orders found for user');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    console.log('No user authenticated, redirecting...');
    return null;
  }

  // Calculate statistics from database orders
  const totalOrdered = orders.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0);
  const totalPaid = orders.reduce((sum: number, order: any) => sum + (order.amount_paid || 0), 0);
  const totalRemaining = totalOrdered - totalPaid;
  const paymentPercentage = totalOrdered > 0 ? (totalPaid / totalOrdered) * 100 : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline">En attente</Badge>;
      case 'confirmed': return <Badge className="bg-blue-500">Confirmée</Badge>;
      case 'shipped': return <Badge className="bg-orange-500">Expédiée</Badge>;
      case 'delivered': return <Badge className="bg-green-500">Livrée</Badge>;
      case 'cancelled': return <Badge variant="destructive">Annulée</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline">En attente</Badge>;
      case 'partial': return <Badge className="bg-orange-500">Partiel</Badge>;
      case 'paid': return <Badge className="bg-green-500">Payé</Badge>;
      case 'refunded': return <Badge variant="destructive">Remboursé</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <button 
            onClick={fetchUserOrders}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            {loading ? 'Actualisation...' : 'Actualiser'}
          </button>
        </div>

        {/* User Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Informations du compte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p><strong>Nom:</strong> {profile?.full_name || 'Non défini'}</p>
                <p><strong>Cabinet:</strong> {profile?.dental_office_name || 'Non défini'}</p>
                <p><strong>Email:</strong> {profile?.email || user.email}</p>
              </div>
              <div>
                <p><strong>Téléphone:</strong> {profile?.phone || 'Non défini'}</p>
                <p><strong>Wilaya:</strong> {profile?.wilaya || 'Non défini'}</p>
                <p><strong>Adresse:</strong> {profile?.address || 'Non défini'}</p>
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
            <CardTitle>Mes commandes ({orders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-muted-foreground mt-2">Chargement des commandes...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucune commande trouvée.</p>
                <p className="text-sm text-muted-foreground mt-1">Vos commandes apparaîtront ici après votre premier achat.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => {
                  const orderPaid = order.amount_paid || 0;
                  const orderRemaining = order.total_amount - orderPaid;
                  const orderPaymentPercentage = (orderPaid / order.total_amount) * 100;
                  
                  return (
                    <div key={order.id} className="border rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">Commande #{order.id.slice(0, 8)}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                          </p>
                          {order.preferred_delivery_date && (
                            <p className="text-sm text-muted-foreground">
                              Date de livraison préférée: {new Date(order.preferred_delivery_date).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          {getStatusBadge(order.status)}
                          <div className="mt-1">
                            {getPaymentStatusBadge(order.payment_status)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="font-medium">{order.total_amount.toLocaleString()} DZD</p>
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
                        {order.order_items?.map((item: any) => (
                          <div key={item.id} className="text-sm flex justify-between">
                            <span>{item.product_name} x{item.quantity}</span>
                            <span>{(item.product_price * item.quantity).toLocaleString()} DZD</span>
                          </div>
                        ))}
                        {order.order_bundles?.map((bundle: any) => (
                          <div key={bundle.id} className="text-sm flex justify-between">
                            <span>{bundle.bundle_name} x{bundle.quantity}</span>
                            <span>{(parseInt(bundle.bundle_price.replace(/[^0-9]/g, '')) * bundle.quantity).toLocaleString()} DZD</span>
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
