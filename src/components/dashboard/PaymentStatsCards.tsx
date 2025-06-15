
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface PaymentStatsCardsProps {
  totalOrdered: number;
  totalPaid: number;
  totalRemaining: number;
  paymentPercentage: number;
}

export const PaymentStatsCards: React.FC<PaymentStatsCardsProps> = ({
  totalOrdered,
  totalPaid,
  totalRemaining,
  paymentPercentage
}) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Total Commandé</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalOrdered.toLocaleString()} DZD</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Total Payé</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">{totalPaid.toLocaleString()} DZD</p>
          <Progress value={paymentPercentage} className="mt-2" />
          <p className="text-sm text-muted-foreground mt-1">{paymentPercentage.toFixed(1)}% du total</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Restant à Payer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-muted-foreground">{totalRemaining.toLocaleString()} DZD</p>
        </CardContent>
      </Card>
    </div>
  );
};
