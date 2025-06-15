import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Database } from '@/integrations/supabase/types';

type PaymentStatus = Database['public']['Enums']['payment_status'];
type OrderStatus = Database['public']['Enums']['order_status'];

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

  // Cancel order function for clients
  const cancelOrder = async (orderId: string) => {
    try {
      console.log('Client cancelling order:', orderId);
      
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)
        .eq('user_id', user?.id); // Ensure user can only cancel their own orders

      if (error) throw error;
      
      await fetchUserOrders();
      toast.success('Commande annulée avec succès');
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Erreur lors de l\'annulation de la commande');
    }
  };

  // Update payment status function for admins
  const updatePaymentStatus = async (orderId: string, newStatus: PaymentStatus) => {
    try {
      console.log('Updating payment status for order:', orderId, 'to:', newStatus);
      
      // First check if we have admin permissions
      if (!profile?.is_admin) {
        console.error('User is not admin');
        toast.error('Vous n\'avez pas les permissions nécessaires');
        return;
      }

      // Find the order to get its total amount
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        toast.error('Commande non trouvée');
        return;
      }

      // Calculate amount_paid based on the selected status to work with the trigger
      let newAmountPaid = order.amount_paid || 0;
      switch (newStatus) {
        case 'pending':
          newAmountPaid = 0;
          break;
        case 'partial':
          // Keep existing amount if it's partial, or set to half if it was full
          newAmountPaid = order.amount_paid > 0 && order.amount_paid < order.total_amount 
            ? order.amount_paid 
            : Math.floor(order.total_amount / 2);
          break;
        case 'paid':
          newAmountPaid = order.total_amount;
          break;
        case 'refunded':
          newAmountPaid = 0;
          break;
      }

      const { data, error } = await supabase
        .from('orders')
        .update({ 
          payment_status: newStatus,
          amount_paid: newAmountPaid,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select('*')
        .single();

      if (error) {
        console.error('Supabase error updating payment status:', error);
        throw error;
      }

      if (!data) {
        console.error('No data returned from update');
        throw new Error('Aucune donnée retournée de la mise à jour');
      }

      console.log('Payment status updated successfully:', data);
      
      // Update the local state immediately for better UX
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, payment_status: newStatus, amount_paid: newAmountPaid, updated_at: new Date().toISOString() }
            : order
        )
      );
      
      toast.success('Statut de paiement mis à jour avec succès');
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Erreur lors de la mise à jour du statut de paiement');
    }
  };

  // Update order status function for admins
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      console.log('Updating order status for order:', orderId, 'to:', newStatus);
      
      // First check if we have admin permissions
      if (!profile?.is_admin) {
        console.error('User is not admin');
        toast.error('Vous n\'avez pas les permissions nécessaires');
        return;
      }
      
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select('*')
        .single();

      if (error) {
        console.error('Supabase error updating order status:', error);
        throw error;
      }

      if (!data) {
        console.error('No data returned from update');
        throw new Error('Aucune donnée retournée de la mise à jour');
      }

      console.log('Order status updated successfully:', data);
      
      // Update the local state immediately for better UX
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus, updated_at: new Date().toISOString() }
            : order
        )
      );
      
      toast.success('Statut de commande mis à jour avec succès');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Erreur lors de la mise à jour du statut de commande');
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
                        <div className="text-right flex flex-col gap-2">
                          <div className="flex gap-2">
                            {/* Order Status */}
                            {profile?.is_admin ? (
                              <Select
                                value={order.status}
                                onValueChange={(value) => updateOrderStatus(order.id, value as OrderStatus)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">En attente</SelectItem>
                                  <SelectItem value="confirmed">Confirmée</SelectItem>
                                  <SelectItem value="shipped">Expédiée</SelectItem>
                                  <SelectItem value="delivered">Livrée</SelectItem>
                                  <SelectItem value="cancelled">Annulée</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              getStatusBadge(order.status)
                            )}
                            
                            {/* Payment Status */}
                            {profile?.is_admin ? (
                              <Select
                                value={order.payment_status}
                                onValueChange={(value) => updatePaymentStatus(order.id, value as PaymentStatus)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">En attente</SelectItem>
                                  <SelectItem value="partial">Partiel</SelectItem>
                                  <SelectItem value="paid">Payé</SelectItem>
                                  <SelectItem value="refunded">Remboursé</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              getPaymentStatusBadge(order.payment_status)
                            )}
                          </div>
                          
                          {/* Cancel button - only show for pending orders and non-admins */}
                          {!profile?.is_admin && (order.status === 'pending' || order.status === 'confirmed') && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => cancelOrder(order.id)}
                              className="flex items-center gap-1"
                            >
                              <X className="w-3 h-3" />
                              Annuler
                            </Button>
                          )}
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
