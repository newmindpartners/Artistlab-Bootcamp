export const products = {
  formation: {
    priceId: 'price_1234567890abcdef', // Replace this with your actual Stripe price ID
    name: 'Formation Intensive Cinéma & IA sur 2 Jours',
    description: 'Une formation approfondie pour maîtriser les outils d\'IA les plus puissants du marché. Chaque outil est exploré en détail pendant 2 heures pour une maîtrise complète. Formation sur Aix-en-Provence, Cannes, Paris, Londres et En-ligne.',
    mode: 'payment' as const,
    price: '490€',
  },
} as const;