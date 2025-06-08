import { products } from '../stripe-config';

export async function createCheckoutSession(priceId: string, mode: 'payment' | 'subscription') {
  const { VITE_SUPABASE_URL } = import.meta.env;

  const response = await fetch(`${VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('sb-token')}`,
    },
    body: JSON.stringify({
      price_id: priceId,
      mode,
      success_url: `${window.location.origin}/success`,
      cancel_url: `${window.location.origin}/cancel`,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Unknown error from Stripe checkout service');
  }

  const { url } = await response.json();
  return url;
}