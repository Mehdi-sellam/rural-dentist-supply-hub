import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Box,
} from '@mui/material';
import { Check, Close, Edit } from '@mui/icons-material';
import { Order } from '../types/Order';
import { getOrders, updateOrder } from '../api/orderApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SelectItem } from '@radix-ui/react-select';
import { Input } from '@/components/ui/input';

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [open, setOpen] = useState(false);
  const [editOrder, setEditOrder] = useState<Order>({} as Order);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (order: Order) => {
    setEditOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (event: any) => {
    const value = event.target.value;
    setEditOrder((prev) => ({ ...prev, status: value }));
  };

  const handlePaymentStatusChange = (event: any) => {
    const value = event.target.value;
    setEditOrder((prev) => ({ ...prev, payment_status: value }));
  };

  const saveOrder = async () => {
    try {
      await updateOrder(editOrder.id, editOrder);
      toast.success('Order updated successfully!');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order.');
    } finally {
      handleClose();
    }
  };

  if (loading) {
    return <Typography>Loading orders...</Typography>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="orders table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {order.id}
                </TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.payment_status}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => handleOpen(order)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Order</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid component="div" item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Name"
                name="customer_name"
                value={editOrder.customer_name || ''}
                onChange={handleInputChange}
                margin="dense"
              />
            </Grid>
            <Grid component="div" item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total"
                name="total"
                value={editOrder.total || ''}
                onChange={handleInputChange}
                margin="dense"
              />
            </Grid>
            <Grid component="div" item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={editOrder.status || ''}
                  onChange={handleStatusChange}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid component="div" item xs={12} sm={6}>
              {/* Only logic for showing partial_payment field (no UI/UX change) */}
              <FormControl fullWidth margin="dense">
                <InputLabel id="payment-status-label">Payment Status</InputLabel>
                <Select
                  labelId="payment-status-label"
                  name="payment_status"
                  value={editOrder.payment_status || ''}
                  onChange={handlePaymentStatusChange}
                >
                  <MenuItem value="pending">En attente</MenuItem>
                  <MenuItem value="paid">Payée</MenuItem>
                  <MenuItem value="partiel">Partiel</MenuItem>
                </Select>
              </FormControl>
              {editOrder.payment_status === "partiel" && (
                <TextField
                  fullWidth
                  margin="dense"
                  label="Montant payé partiellement"
                  name="partial_payment"
                  value={editOrder.partial_payment ?? ""}
                  onChange={handleInputChange}
                />
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} startIcon={<Close />} color="error">
            Cancel
          </Button>
          <Button onClick={saveOrder} startIcon={<Check />} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
