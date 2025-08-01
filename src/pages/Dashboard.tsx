
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserInfoCard } from '@/components/dashboard/UserInfoCard';
import { PaymentStatsCards } from '@/components/dashboard/PaymentStatsCards';
import { OrdersList } from '@/components/dashboard/OrdersList';
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

  // Update payment status function using backend service
  const updatePaymentStatus = async (orderId: string, newStatus: PaymentStatus) => {
    try {
      console.log('=== PAYMENT STATUS UPDATE STARTED ===');
      console.log('Order ID:', orderId);
      console.log('New Status:', newStatus);
      console.log('User is admin:', profile?.is_admin);
      
      // First check if we have admin permissions
      if (!profile?.is_admin) {
        console.error('User is not admin');
        toast.error('Vous n\'avez pas les permissions nécessaires');
        return;
      }

      // Call the backend service
      const { data, error } = await supabase.functions.invoke('update-payment-status', {
        body: {
          orderId: orderId,
          newStatus: newStatus,
          userId: user?.id
        }
      });

      if (error) {
        console.error('Backend service error:', error);
        throw error;
      }

      if (!data.success) {
        console.error('Backend service failed:', data.error);
        throw new Error(data.error);
      }

      console.log('Backend service response:', data);
      
      // Update the local state immediately for better UX
      setOrders(prevOrders => {
        const updatedOrders = prevOrders.map(order => 
          order.id === orderId 
            ? { 
                ...order, 
                payment_status: newStatus, 
                amount_paid: data.order.amount_paid,
                updated_at: data.order.updated_at 
              }
            : order
        );
        console.log('Local state updated');
        return updatedOrders;
      });
      
      // Force a refetch to ensure consistency
      setTimeout(() => {
        console.log('Refetching orders to verify update...');
        fetchUserOrders();
      }, 500);
      
      toast.success('Statut de paiement mis à jour avec succès');
      console.log('=== PAYMENT STATUS UPDATE COMPLETED ===');
    } catch (error) {
      console.error('=== PAYMENT STATUS UPDATE FAILED ===');
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

        <UserInfoCard profile={profile} userEmail={user.email} />

        <PaymentStatsCards
          totalOrdered={totalOrdered}
          totalPaid={totalPaid}
          totalRemaining={totalRemaining}
          paymentPercentage={paymentPercentage}
        />

        <OrdersList
          orders={orders}
          loading={loading}
          isAdmin={profile?.is_admin || false}
          onCancelOrder={cancelOrder}
          onUpdatePaymentStatus={updatePaymentStatus}
          onUpdateOrderStatus={updateOrderStatus}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
