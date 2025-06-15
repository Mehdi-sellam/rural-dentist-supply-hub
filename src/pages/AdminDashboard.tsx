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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [refetchOrders, setRefetchOrders] = useState<() => void>(() => {});

  // Helper for updating payment status, now with support for amount_paid for "partiel"
  const handlePaymentStatusChange = async (order, status) => {
    // If switching to "partiel" and no amount_paid, set to 0 by default
    let updates = {
      payment_status: status,
    };
    if (status === "partiel" && (!order.amount_paid || order.amount_paid === 0)) {
      updates.amount_paid = 0;
    }
    await supabase.from("orders").update(updates).eq("id", order.id);
    if (refetchOrders) refetchOrders();
  };

  const handleAmountPaidChange = async (order, amountPaid) => {
    const validAmount = Math.min(Math.max(0, Number(amountPaid)), Number(order.total_amount));
    await supabase.from("orders").update({
      amount_paid: validAmount,
      // Update remaining_balance in DB for convenience
      remaining_balance: Number(order.total_amount) - validAmount
    }).eq("id", order.id);
    if (refetchOrders) refetchOrders();
  };

  useEffect(() => {
    if (!user || user.email !== 'admin@dentgo.net') {
      navigate('/auth');
    }
  }, [user, navigate]);

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

  const handleOrderStatusChange = async (orderId: number, newStatus: string) => {
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

  if (!user || user.email !== 'admin@dentgo.net') {
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
                  <SelectItem value="partiel">Partiel</SelectItem>
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
                      value={order.status}
                      onValueChange={(status) => handleOrderStatusChange(order.id, status)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="processing">En cours</SelectItem>
                        <SelectItem value="shipped">Expédiée</SelectItem>
                        <SelectItem value="delivered">Livrée</SelectItem>
                        <SelectItem value="cancelled">Annulée</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  {/* Payment status cell */}
                  <TableCell>
                    <Select
                      value={order.payment_status}
                      onValueChange={(status) => handlePaymentStatusChange(order, status)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="paid">Payé</SelectItem>
                        <SelectItem value="partiel">Partiel</SelectItem>
                      </SelectContent>
                    </Select>
                    {/* Only show amount_paid field if status is "partiel" */}
                    {order.payment_status === "partiel" && (
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
                          onChange={(e) => handleAmountPaidChange(order, e.target.value)}
                        />
                        <span className="text-xs ml-1">
                          / {Number(order.total_amount)?.toLocaleString()} DZD
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
