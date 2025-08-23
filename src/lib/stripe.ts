import { supabase } from './supabase';
import { products } from '../stripe-config';

export async function createCheckoutSession(
  priceId: string,
  mode: 'payment' | 'subscription',
  customerData: {
    firstName: string;
    lastName: string;
    email: string;
  }
) {
  const product = Object.values(products).find((p) => p.priceId === priceId);

  if (!product) {
    throw new Error('Invalid price ID');
  }

  // Create a pending payment record
  const { data: payment, error: dbError } = await supabase
    .from('payments')
    .insert([
      {
        first_name: customerData.firstName,
        last_name: customerData.lastName,
        email: customerData.email,
        payment_status: 'pending'
      }
    ])
    .select()
    .single();

  if (dbError) {
    throw new Error('Failed to create payment record');
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        price_id: priceId,
        mode,
        success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/`,
        customer_email: customerData.email,
        customer_name: `${customerData.firstName} ${customerData.lastName}`,
        payment_id: payment.id
      }),
    });

    if (!response.ok) {
      // Cleanup the pending payment record
      await supabase
        .from('payments')
        .delete()
        .match({ id: payment.id });

      const errorData = await response.json();
      throw new Error(errorData.error || 'Checkout session creation failed');
    }

    const data = await response.json();

    if (!data.url) {
      throw new Error('No checkout URL returned');
    }

    window.location.href = data.url;
  } catch (error) {
    // Cleanup the pending payment record if it exists
    if (payment?.id) {
      await supabase
        .from('payments')
        .delete()
        .match({ id: payment.id });
    }
    throw error;
  }
}