export const products = {
  formation: {
    // TODO: Replace this with the correct price ID from your Stripe Dashboard
    // 1. Go to https://dashboard.stripe.com/products
    // 2. Find your "Formation Cinema & AI" product
    // 3. Copy the price ID (starts with "price_")
    // 4. Make sure you're in the correct environment (test/live) that matches your STRIPE_SECRET_KEY
    priceId: 'REPLACE_WITH_CORRECT_PRICE_ID', // Replace this placeholder
    name: 'Formation Cinema & AI',
    description: '2 jours de formation intensive',
    mode: 'payment' as const,
  },
} as const;