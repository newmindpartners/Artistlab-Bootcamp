# Artist Lab CAMPUS - Formation Cinéma & IA

Une application web moderne pour l'inscription à la formation intensive "Cinéma & IA" d'Artist Lab Studio.

## 🎬 À propos

Cette application permet aux participants de s'inscrire à une formation de 2 jours sur l'utilisation de l'intelligence artificielle dans la création cinématographique. La formation couvre 6 outils d'IA révolutionnaires et permet aux participants de créer leur propre court-métrage professionnel.

## ✨ Fonctionnalités

- **Interface multilingue** (Français/Anglais)
- **Inscription sécurisée** avec validation des données
- **Paiement intégré** via Stripe (€490)
- **Confirmation par email** automatique via Mailgun
- **Design responsive** optimisé pour tous les appareils
- **Gestion des sessions** multiples (Aix-en-Provence, Cannes, Paris, Londres, En ligne)

## 🛠 Technologies utilisées

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS avec design system personnalisé
- **Backend**: Supabase (Base de données + Auth + Edge Functions)
- **Paiements**: Stripe Checkout + Webhooks
- **Emails**: Mailgun SMTP
- **Déploiement**: Netlify

## 🚀 Installation et développement

### Prérequis

- Node.js 18+
- npm ou yarn
- Compte Supabase
- Compte Stripe
- Compte Mailgun

### Configuration

1. Clonez le repository :
```bash
git clone <repository-url>
cd artistlab-bootcamp
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez les variables d'environnement dans `.env` :
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Configurez les variables d'environnement Supabase (dans le dashboard Supabase) :
```env
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
MAILGUN_DOMAIN=artistlab-bootcamp.com
MAILGUN_SMTP_USER=postmaster@artistlab-bootcamp.com
MAILGUN_SMTP_PASSWORD=your_mailgun_smtp_password
```

### Développement

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## 📊 Structure de la base de données

### Tables principales

- **registrations**: Stockage des inscriptions
- **stripe_customers**: Liaison utilisateurs Supabase ↔ Stripe
- **stripe_subscriptions**: Gestion des abonnements
- **stripe_orders**: Historique des commandes

### Edge Functions

- **stripe-checkout**: Création des sessions de paiement
- **stripe-webhook**: Traitement des événements Stripe
- **webhook-test**: Tests de configuration

## 💳 Configuration Stripe

1. Créez un produit dans Stripe Dashboard
2. Notez le `price_id` 
3. Configurez les webhooks pour pointer vers votre edge function
4. Ajoutez les clés API dans les variables d'environnement Supabase

## 📧 Configuration Email

L'application utilise Mailgun pour l'envoi d'emails :

1. Configurez votre domaine `artistlab-bootcamp.com` dans Mailgun
2. Ajoutez les enregistrements DNS requis
3. Configurez les variables SMTP dans Supabase

## 🌍 Déploiement

### Netlify (Recommandé)

1. Connectez votre repository GitHub à Netlify
2. Configurez les variables d'environnement
3. Le déploiement se fait automatiquement

### Variables d'environnement de production

```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## 🎨 Design System

L'application utilise un design system personnalisé avec :

- **Couleurs**: Navy (#0F172A), Primary (#0EA5E9), Accent (#38BDF8)
- **Typographie**: Sohne (Adobe Fonts)
- **Composants**: Cards, buttons, forms avec effets glassmorphism
- **Animations**: Gradients animés, transitions fluides

## 📱 Responsive Design

- **Mobile First**: Optimisé pour les appareils mobiles
- **Breakpoints**: sm, md, lg, xl
- **Navigation**: Menu hamburger sur mobile
- **Formulaires**: Validation en temps réel

## 🔒 Sécurité

- **RLS (Row Level Security)** activé sur toutes les tables
- **Validation côté client et serveur**
- **Tokens JWT** pour l'authentification
- **HTTPS** obligatoire en production
- **Webhooks** sécurisés avec signatures Stripe

## 📈 Monitoring

- **Logs Supabase**: Surveillance des edge functions
- **Stripe Dashboard**: Suivi des paiements
- **Mailgun Analytics**: Statistiques d'emails

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence privée - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

Pour toute question ou support :
- Email: info@artistlab.studio
- Site web: [Artist Lab Studio](https://www.artistlab.studio/)

---

**Artist Lab CAMPUS** - Révolutionnez votre approche du cinéma avec l'IA ! 🎬✨