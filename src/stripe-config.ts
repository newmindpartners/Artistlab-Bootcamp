export const products = {
  formation: {
    priceId: 'price_1QhqGH2eZvKYlo2CqFwrjQQs', // Test price for 1 EUR - replace with your actual test price ID
    name: 'Formation Cinema & AI (Test)',
    description: 'Formation test à 1€ pour valider le système de paiement',
    mode: 'payment' as const,
    price: '1€',
  },
} as const;