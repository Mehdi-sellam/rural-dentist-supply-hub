import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useLanguage } from '@/hooks/useLanguage';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { useToast } from "@/components/ui/use-toast"

const AdminDashboard = () => {
  const { user, profile } = useAuth();
  // Determine admin from profile
  const isAdmin = profile?.is_admin;
  const { t } = useLanguage();
  const locale = typeof navigator !== "undefined" && navigator.language ? navigator.language : "fr-FR";
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })
  const { toast } = useToast();

  // useQuery updated to correct object format
  const { data: ordersData, refetch: refetchOrders } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }
      return data || [];
    }
  });

  useEffect(() => {
    setOrders(Array.isArray(ordersData) ? ordersData : []);
  }, [ordersData]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        console.error("Error fetching products:", error);
        return;
      }

      setProducts(data || []);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        console.error("Error fetching users:", error);
        return;
      }

      setUsers(data || []);
    };

    fetchUsers();
  }, []);

  // Filter by date
  useEffect(() => {
    if (date?.from && date?.to) {
      const filtered = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        const fromDate = new Date(date.from as Date);
        const toDate = new Date(date.to as Date);

        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);

        return orderDate >= fromDate && orderDate <= toDate;
      });
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  }, [date, orders]);

  // Filter by search term
  useEffect(() => {
    const results = orders.filter(order =>
      (order.id && order.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customer_email && order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredOrders(results);
  }, [searchTerm, orders]);

  useEffect(() => {
    if (!user || !isAdmin) {
      window.location.href = '/';
    }
  }, [user, isAdmin]);

  const handlePaymentStatusChange = async (order: any, status: string) => {
    let updates: Record<string, any> = { payment_status: status };
    if (status === "partial" && (!order.amount_paid || order.amount_paid === 0)) {
      updates.amount_paid = 0;
      updates.remaining_balance = order.total_amount; // set remaining to total when partiel
    }
    await supabase
      .from('orders')
      .update(updates)
      .eq('id', order.id);

    refetchOrders && refetchOrders();
  };

  const handleAmountPaidChange = async (order: any, amountPaid: number) => {
    // Clamp to [0, total_amount]
    const validAmount = Math.min(Math.max(0, amountPaid), Number(order.total_amount));
    await supabase
      .from('orders')
      .update({
        amount_paid: validAmount,
        remaining_balance: Number(order.total_amount) - validAmount,
      })
      .eq('id', order.id);

    refetchOrders && refetchOrders();
  };

  if (!user || !isAdmin) {
    return <div className="flex justify-center items-center h-screen">
      <span className="loading loading-ring loading-lg"></span>
    </div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-5">Admin Dashboard</h1>

      {/* Orders Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Commandes</h2>
        <div className="mb-4 flex gap-4">
          <Input
            type="text"
            placeholder="Rechercher par ID de commande ou email"
            className="input input-bordered w-full max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}`
                  ) : (
                    format(date.from, "dd/MM/yyyy")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" side="bottom">
              <Calendar
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                disabled={{ from: new Date(2020, 1, 1) }}
                numberOfMonths={2}
                pagedNavigation
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>A list of your recent orders.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Montant Total</TableHead>
                <TableHead>Statut Paiement</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer_email}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString(locale)}</TableCell>
                  <TableCell>{Number(order.total_amount).toLocaleString(locale, {
                    style: 'currency',
                    currency: 'DZD',
                  })}</TableCell>
                  <TableCell>
                    {order.payment_status === 'pending' && <Badge variant="secondary">En attente</Badge>}
                    {order.payment_status === 'partial' && <Badge variant="outline">Partiel</Badge>}
                    {order.payment_status === 'paid' && <Badge>Payé</Badge>}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col md:flex-row gap-4 md:items-center mt-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`payment-status-${order.id}`} className="font-medium min-w-[120px]">
                          Statut paiement
                        </Label>
                        <Select
                          value={order.payment_status}
                          onValueChange={e => handlePaymentStatusChange(order, e)}
                        >
                          <SelectTrigger id={`payment-status-${order.id}`} className="w-[180px]">
                            <SelectValue placeholder="Theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="partial">Partiel</SelectItem>
                            <SelectItem value="paid">Payé</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {/* Montant payé input appears when status is partiel */}
                      {order.payment_status === "partial" && (
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`amount-paid-${order.id}`} className="font-medium min-w-[120px]">
                            Montant payé
                          </Label>
                          <Input
                            id={`amount-paid-${order.id}`}
                            type="number"
                            min={0}
                            max={order.total_amount}
                            step={0.01}
                            className="w-[120px]"
                            value={order.amount_paid ?? ""}
                            onChange={e => handleAmountPaidChange(order, Number(e.target.value))}
                            placeholder="Saisir montant payé"
                          />
                          <span className="text-sm text-gray-500">
                            Reste à payer: {Math.max(0, Number(order.total_amount) - Number(order.amount_paid)).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} DZD
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Products Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Produits</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Prix</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>
                    <button className="btn btn-sm btn-primary">Modifier</button>
                    <button className="btn btn-sm btn-error">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Users Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Utilisateurs</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Nom</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.full_name}</td>
                  <td>
                    <button className="btn btn-sm btn-primary">Modifier</button>
                    <button className="btn btn-sm btn-error">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
