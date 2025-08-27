// src/lib/stripe.ts
import { supabase } from './supabase';
import { products } from '../stripe-config';

type CustomerData = {
  firstName: string;
  lastName: string;
  email: string;
};

export async function createCheckoutSession(
  priceId: string,
  mode: 'payment' | 'subscription',
  customerData: CustomerData,
) {
  // 1) Намираме продукта по priceId
  const product = Object.values(products).find((p) => p.priceId === priceId);
  if (!product) {
    throw new Error('Invalid price ID');
  }

  // 2) Създаваме pending запис и взимаме неговото id
  let payment: { id: string } | null = null;

  const { data: paymentRow, error: dbInsertError } = await supabase
    .from('payments')
    .insert([
      {
        first_name: customerData.firstName,
        last_name: customerData.lastName,
        email: customerData.email,
        payment_status: 'pending',
      },
    ])
    .select('id')
    .single();

  if (dbInsertError) {
    throw new Error('Failed to create payment record');
  }

  payment = paymentRow;

  try {
    // 3) Викаме Edge функцията за създаване на Stripe Checkout Session
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // за Edge функция в Supabase са нужни и двете:
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY!}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          mode,
          // Edge ще замести плейсхолдъра с реалното session_id
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/cancel`,
          customer_email: customerData.email,
          customer_name: `${customerData.firstName} ${customerData.lastName}`,
          payment_id: payment!.id,
        }),
      }
    );

    if (!response.ok) {
      // четем текста само веднъж и хвърляме
      const errText = await response.text();
      console.error('Edge error:', errText);
      throw new Error(errText || 'Checkout session creation failed');
    }

    const data: { url?: string } = await response.json();
    if (!data.url) {
      throw new Error('No checkout URL returned');
    }

    // 4) Пренасочване към Stripe Checkout
    window.location.href = data.url;
  } catch (error) {
    // 5) Почисти pending записа при провал (ако политиките го позволяват)
    try {
      if (payment?.id) {
        await supabase.from('payments').delete().match({ id: payment.id });
      }
    } catch (_) {
      /* ignore cleanup errors */
    }
    throw error;
  }
}
