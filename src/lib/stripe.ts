import { products } from '../stripe-config';

export async function createCheckoutSession(priceId: string, mode: 'payment' | 'subscription') {
  const { VITE_SUPABASE_URL } = import.meta.env;

  try {
    console.log('Creating checkout session with:', { priceId, mode });
    
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
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(30000)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Stripe checkout error response:', error);
      throw new Error(error.error || 'Unknown error from Stripe checkout service');
    }

    const { url } = await response.json();
    console.log('Checkout session created successfully:', url);
    return url;
  } catch (error: any) {
    console.error('Stripe checkout session creation failed:', error);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your internet connection and try again.');
    }
    
    if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
      throw new Error('Unable to connect to the payment service. Please check your internet connection and try again.');
    }
    
    throw error;
  }
}