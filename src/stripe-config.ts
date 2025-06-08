export const products = {
  formation: {
    priceId: 'price_1234567890abcdef', // Replace this with your actual Stripe price ID
    name: 'Formation Cinema & AI',
    description: 'Formation complète sur le cinéma et l\'intelligence artificielle',
    mode: 'payment' as const,
    price: '1€',
  },
} as const;