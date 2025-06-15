
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectItem,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client";

// Inline User type
type User = {
  id: string;
  full_name: string;
  dental_office_name: string;
  phone: string;
  email: string;
  wilaya: string;
  address: string;
  is_admin: boolean;
};

// Inline Order type
type Order = {
  id: string;
  user_id: string;
  payment_status: string;
  amount_paid?: number;
  total_amount: number;
  created_at: string;
  [key: string]: any;
};

interface AdminDashboardProps {
  session: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ session }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Add a new state variable to track the partial payment amount for each order
  const [partialPayments, setPartialPayments] = React.useState<{ [orderId: string]: number }>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('*');

        if (usersError) {
          console.error("Error fetching users:", usersError);
          return;
        }

        if (usersData) {
          setUsers(usersData as User[]);
        }
      } catch (error) {
        console.error("Unexpected error fetching users:", error);
      }
    };

    const fetchOrders = async () => {
      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*');

        if (ordersError) {
          console.error("Error fetching orders:", ordersError);
          return;
        }

        if (ordersData) {
          setOrders(ordersData as Order[]);
        }
      } catch (error) {
        console.error("Unexpected error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    fetchOrders();
  }, []);

  const getUserById = (userId: string | undefined) => {
    return users.find(user => user.id === userId);
  };

  const handlePaymentStatusChange = (orderId: string, newStatus: string) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, payment_status: newStatus }
          : order
      )
    );
  };

  // New handler for partial payment input
  const handlePartialPaymentInput = (orderId: string, value: string) => {
    setPartialPayments(prev => ({
      ...prev,
      [orderId]: Number(value),
    }));
  };

  const handlePaymentUpdate = async (order: any) => {
    let updates: any = { payment_status: order.payment_status };

    // Only send partial payment info if payment_status is 'partiel'
    if (order.payment_status === 'partiel' && partialPayments[order.id] != null) {
      updates.amount_paid = partialPayments[order.id];
    }

    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', order.id);

    if (!error) {
      toast.success('Order updated!');
    } else {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-10">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Users</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                      <AvatarFallback>{user.full_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{user.full_name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{user.is_admin ? "Admin" : "User"}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
      <section>
        <h3 className="text-xl font-semibold mb-2">Commandes</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut paiement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(order => {
              const user = getUserById(order.user_id);
              return (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    {user ? (
                      <div className="flex items-center space-x-2">
                        <Avatar>
                          <AvatarImage src="https://github.com/shadcn.png" alt={user.full_name} />
                          <AvatarFallback>{user.full_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span>{user.full_name}</span>
                      </div>
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>{order.total_amount}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Select
                      value={order.payment_status}
                      onValueChange={(val) => handlePaymentStatusChange(order.id, val)}
                    >
                      <SelectTrigger />
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="partiel">Partiel</SelectItem>
                        <SelectItem value="paid">Payé</SelectItem>
                      </SelectContent>
                    </Select>
                    {/* If "partiel" is selected, show amount paid input */}
                    {order.payment_status === "partiel" && (
                      <div className="mt-2 flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          step={1}
                          value={partialPayments[order.id] ?? order.amount_paid ?? ""}
                          onChange={(e) => handlePartialPaymentInput(order.id, e.target.value)}
                          placeholder="Montant payé"
                          className="w-32"
                        />
                        <Button
                          type="button"
                          onClick={() => handlePaymentUpdate(order)}
                          size="sm"
                        >
                          Enregistrer
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>
    </div>
  );
};

export default AdminDashboard;
