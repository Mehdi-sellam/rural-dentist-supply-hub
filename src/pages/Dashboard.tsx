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

  // Update payment status function for admins - fixed to bypass trigger conflicts
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

      // Calculate amount_paid based on the selected status
      let newAmountPaid = order.amount_paid || 0;
      switch (newStatus) {
        case 'pending':
          newAmountPaid = 0;
          break;
        case 'partial':
          // Keep existing amount if it's already partial and reasonable, otherwise set to half
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

      // Use RPC or direct SQL to bypass the trigger that auto-calculates payment_status
      const { data, error } = await supabase.rpc('update_order_payment_status', {
        order_id: orderId,
        new_payment_status: newStatus,
        new_amount_paid: newAmountPaid
      });

      // If RPC doesn't exist, fall back to regular update but disable the trigger temporarily
      if (error && error.message?.includes('function update_order_payment_status')) {
        console.log('RPC not available, using direct update');
        
        const { data: updateData, error: updateError } = await supabase
          .from('orders')
          .update({ 
            payment_status: newStatus,
            amount_paid: newAmountPaid,
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId);

        if (updateError) {
          console.error('Supabase error updating payment status:', updateError);
          throw updateError;
        }
      } else if (error) {
        console.error('RPC error updating payment status:', error);
        throw error;
      }

      console.log('Payment status updated successfully');
      
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
