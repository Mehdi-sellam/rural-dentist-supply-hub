
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X } from 'lucide-react';
import { StatusSelector } from './StatusSelector';
import type { Database } from '@/integrations/supabase/types';

type PaymentStatus = Database['public']['Enums']['payment_status'];
type OrderStatus = Database['public']['Enums']['order_status'];

interface OrderCardProps {
  order: any;
  isAdmin: boolean;
  onCancelOrder: (orderId: string) => void;
  onUpdatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  isAdmin,
  onCancelOrder,
  onUpdatePaymentStatus,
  onUpdateOrderStatus
}) => {
  const orderPaid = order.amount_paid || 0;
  const orderRemaining = order.total_amount - orderPaid;
  const orderPaymentPercentage = (orderPaid / order.total_amount) * 100;

  return (
    <div className="border rounded p-4">
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
            <StatusSelector
              isAdmin={isAdmin}
              currentStatus={order.status}
              onStatusChange={(value) => onUpdateOrderStatus(order.id, value as OrderStatus)}
              type="order"
            />
            
            <StatusSelector
              isAdmin={isAdmin}
              currentStatus={order.payment_status}
              onStatusChange={(value) => onUpdatePaymentStatus(order.id, value as PaymentStatus)}
              type="payment"
            />
          </div>
          
          {!isAdmin && (order.status === 'pending' || order.status === 'confirmed') && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onCancelOrder(order.id)}
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
};
