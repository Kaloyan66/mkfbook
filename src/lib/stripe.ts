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
    const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // ВАЖНО: за Supabase Edge трябва и двата хедъра
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        price_id: priceId,
        mode,
        // Stripe ще замести плейсхолдъра с реалния session id
        success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/cancel`,
        customer_email: customerData.email,
        customer_name: `${customerData.firstName} ${customerData.lastName}`,
        payment_id: payment.id,
      }),
    }
  );

  if (!response.ok) {
    // покажи реалното съобщение от Edge функцията – лесно за дебъг
    const errText = await response.text();
    console.error('Edge error:', errText);
    throw new Error(errText || 'Checkout session creation failed');
  }

  const data = await response.json();
  if (!data.url) {
    throw new Error('No checkout URL returned');
  }

  // пренасочване към Stripe Checkout
  window.location.href = data.url;

} catch (error) {
  // Ако се провалим, опитай да почистиш „pending“ записа (ако политиките го позволяват)
  try {
    if (payment?.id) {
      await supabase.from('payments').delete().match({ id: payment.id });
    }
  } catch (_) {}

  throw error; 
}
