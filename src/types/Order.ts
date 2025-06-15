
export interface Order {
  id: string;
  customer_name: string;
  total: number | string;
  status: string;
  payment_status: string;
  partial_payment?: string | number;
  // Add any other fields as needed
}
