import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { orderId, newStatus, userId } = await req.json()
    
    console.log('Payment status update request:', { orderId, newStatus, userId });

    // Verify user is admin
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();

    if (!profile?.is_admin) {
      console.log('Unauthorized: User is not admin');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get the order to calculate amount_paid
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select('total_amount, amount_paid')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('Order not found:', orderError);
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Calculate amount_paid based on the selected status
    let newAmountPaid = order.amount_paid || 0;
    switch (newStatus) {
      case 'pending':
        newAmountPaid = 0;
        break;
      case 'partial':
        // Keep existing amount if it's already partial and reasonable, otherwise set to half
        newAmountPaid = order.amount_paid > 0 && order.amount_paid < order.total_amount 
          ? order.amount_paid 
          : Math.floor(order.total_amount / 2);
        break;
      case 'paid':
        newAmountPaid = order.total_amount;
        break;
      case 'refunded':
        newAmountPaid = 0;
        break;
      default:
        newAmountPaid = order.amount_paid || 0;
    }

    console.log('Updating order:', { orderId, newStatus, newAmountPaid });

    // Update the order
    const { data: updatedOrder, error: updateError } = await supabaseClient
      .from('orders')
      .update({ 
        payment_status: newStatus,
        amount_paid: newAmountPaid,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select('*')
      .single();

    if (updateError) {
      console.error('Database update error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update payment status', details: updateError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Payment status updated successfully:', updatedOrder);

    return new Response(
      JSON.stringify({ 
        success: true, 
        order: updatedOrder,
        message: 'Payment status updated successfully' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in update-payment-status function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})
