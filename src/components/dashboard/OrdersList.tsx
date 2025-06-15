
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderCard } from './OrderCard';
import type { Database } from '@/integrations/supabase/types';

type PaymentStatus = Database['public']['Enums']['payment_status'];
type OrderStatus = Database['public']['Enums']['order_status'];

interface OrdersListProps {
  orders: any[];
  loading: boolean;
  isAdmin: boolean;
  onCancelOrder: (orderId: string) => void;
  onUpdatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const OrdersList: React.FC<OrdersListProps> = ({
  orders,
  loading,
  isAdmin,
  onCancelOrder,
  onUpdatePaymentStatus,
  onUpdateOrderStatus
}) => {
  return (
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
            {orders.map((order: any) => (
              <OrderCard
                key={order.id}
                order={order}
                isAdmin={isAdmin}
                onCancelOrder={onCancelOrder}
                onUpdatePaymentStatus={onUpdatePaymentStatus}
                onUpdateOrderStatus={onUpdateOrderStatus}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
