
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { Database } from '@/integrations/supabase/types';

type PaymentStatus = Database['public']['Enums']['payment_status'];
type OrderStatus = Database['public']['Enums']['order_status'];

interface StatusSelectorProps {
  isAdmin: boolean;
  currentStatus: string;
  onStatusChange: (newStatus: any) => void;
  type: 'payment' | 'order';
}

export const StatusSelector: React.FC<StatusSelectorProps> = ({
  isAdmin,
  currentStatus,
  onStatusChange,
  type
}) => {
  const getStatusBadge = (status: string) => {
    if (type === 'payment') {
      switch (status) {
        case 'pending': return <Badge variant="outline">En attente</Badge>;
        case 'partial': return <Badge className="bg-orange-500">Partiel</Badge>;
        case 'paid': return <Badge className="bg-green-500">Payé</Badge>;
        case 'refunded': return <Badge variant="destructive">Remboursé</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
      }
    } else {
      switch (status) {
        case 'pending': return <Badge variant="outline">En attente</Badge>;
        case 'confirmed': return <Badge className="bg-blue-500">Confirmée</Badge>;
        case 'shipped': return <Badge className="bg-orange-500">Expédiée</Badge>;
        case 'delivered': return <Badge className="bg-green-500">Livrée</Badge>;
        case 'cancelled': return <Badge variant="destructive">Annulée</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
      }
    }
  };

  if (!isAdmin) {
    return getStatusBadge(currentStatus);
  }

  return (
    <Select value={currentStatus} onValueChange={onStatusChange}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {type === 'payment' ? (
          <>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="partial">Partiel</SelectItem>
            <SelectItem value="paid">Payé</SelectItem>
            <SelectItem value="refunded">Remboursé</SelectItem>
          </>
        ) : (
          <>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="confirmed">Confirmée</SelectItem>
            <SelectItem value="shipped">Expédiée</SelectItem>
            <SelectItem value="delivered">Livrée</SelectItem>
            <SelectItem value="cancelled">Annulée</SelectItem>
          </>
        )}
      </SelectContent>
    </Select>
  );
};
