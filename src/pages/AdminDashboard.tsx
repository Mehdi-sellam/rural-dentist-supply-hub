import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Order = Database['public']['Tables']['orders']['Row'];

const AdminDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [refetchOrders, setRefetchOrders] = useState<() => void>(() => {});

  // NEW: type-correct handlePaymentStatusChange, updates
  const handlePaymentStatusChange = async (
    order: Order,
    status: Database['public']['Enums']['payment_status']
  ) => {
    // If switching to "partial" and no amount_paid, set to 0 by default
    const updates: Partial<Order> = {
      payment_status: status,
    };
    if (
      status === "partial" &&
      (typeof order.amount_paid !== "number" || isNaN(order.amount_paid))
    ) {
      updates.amount_paid = 0;
      updates.remaining_balance = Number(order.total_amount);
    }
    await supabase.from("orders").update(updates).eq("id", order.id);
    if (refetchOrders) refetchOrders();
  };

  const handleAmountPaidChange = async (
    order: Order,
    amountPaidStr: string
  ) => {
    const amountPaid = parseFloat(amountPaidStr);
    const validAmount = Math.min(Math.max(0, amountPaid), Number(order.total_amount));
    await supabase.from("orders").update({
      amount_paid: validAmount,
      remaining_balance: Number(order.total_amount) - validAmount
    }).eq("id", order.id);
    if (refetchOrders) refetchOrders();
  };

  // Use effect to redirect if not admin
  useEffect(() => {
    if (!user || !profile || !profile.is_admin) {
      navigate('/auth');
    }
  }, [user, profile, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders.');
      } else {
        setOrders(data || []);
      }
    };

    fetchOrders();
    setRefetchOrders(() => fetchOrders); // Update the refetchOrders function
  }, [user, navigate]);

  const handleOrderStatusChange = async (
    orderId: string, // matches Order['id'] which is string
    newStatus: Database['public']['Enums']['order_status']
  ) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status.');
    } else {
      toast.success('Order status updated successfully!');
      if (refetchOrders) refetchOrders();
    }
  };

  const filteredOrders = orders.filter(order => {
    const searchTerms = searchQuery.toLowerCase().split(' ');
    const matchesSearch = searchTerms.every(term => {
      return (
        order.user_id.toLowerCase().includes(term) ||
        order.payment_method.toLowerCase().includes(term) ||
        order.status.toLowerCase().includes(term) ||
        order.payment_status.toLowerCase().includes(term) ||
        String(order.total_amount).includes(term)
      );
    });

    const matchesPaymentStatus = paymentStatusFilter ? order.payment_status === paymentStatusFilter : true;
    const matchesOrderStatus = orderStatusFilter ? order.status === orderStatusFilter : true;

    return matchesSearch && matchesPaymentStatus && matchesOrderStatus;
  });

  // Only allow admin access
  if (!user || !profile || !profile.is_admin) {
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Commandes</CardTitle>
          <CardDescription>Gérer les commandes et les paiements.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="search">Rechercher:</Label>
              <Input
                type="text"
                id="search"
                placeholder="Rechercher par ID utilisateur, méthode de paiement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="paymentStatus">Statut paiement:</Label>
              <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="paid">Payé</SelectItem>
                  <SelectItem value="partial">Partiel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="orderStatus">Statut commande:</Label>
              <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="processing">En cours</SelectItem>
                  <SelectItem value="shipped">Expédiée</SelectItem>
                  <SelectItem value="delivered">Livrée</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Table>
            <TableCaption>Liste de toutes les commandes.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Méthode de paiement</TableHead>
                <TableHead>Statut commande</TableHead>
                <TableHead>Statut paiement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.user_id}</TableCell>
                  <TableCell>{Number(order.total_amount)?.toLocaleString()} DZD</TableCell>
                  <TableCell>{order.payment_method}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status || ""}
                      onValueChange={(status) =>
                        handleOrderStatusChange(
                          order.id,
                          status as Database['public']['Enums']['order_status']
                        )
                      }
                    >
                      <SelectTrigger className="w-[140px]">
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
                  </TableCell>
                  {/* Payment status cell */}
                  <TableCell>
                    <Select
                      value={order.payment_status || ""}
                      onValueChange={(status) =>
                        handlePaymentStatusChange(
                          order,
                          status as Database['public']['Enums']['payment_status']
                        )
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="paid">Payé</SelectItem>
                        <SelectItem value="partial">Partiel</SelectItem>
                        <SelectItem value="refunded">Remboursé</SelectItem>
                      </SelectContent>
                    </Select>
                    {/* Only show amount_paid field if status is "partial" */}
                    {order.payment_status === "partial" && (
                      <div className="mt-2 flex items-center gap-1">
                        <Label htmlFor={`amount_paid_${order.id}`}>Montant payé</Label>
                        <Input
                          id={`amount_paid_${order.id}`}
                          type="number"
                          min={0}
                          max={order.total_amount}
                          className="w-[100px] px-1 py-1"
                          value={
                            typeof order.amount_paid === "number" && !isNaN(order.amount_paid)
                              ? order.amount_paid
                              : ""
                          }
                          onChange={(e) =>
                            handleAmountPaidChange(order, e.target.value)
                          }
                        />
                        <span className="text-xs ml-1">
                          / {Number(order.total_amount)?.toLocaleString()} DZD
                        </span>
                        <span className="text-xs ml-1 text-gray-500">
                          {"Reste: "}
                          {order.total_amount != null && typeof order.amount_paid === "number"
                            ? (Number(order.total_amount) - Number(order.amount_paid)).toLocaleString()
                            : ""}
                          {" DZD"}
                        </span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
