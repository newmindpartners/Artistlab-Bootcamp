import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';
import nodemailer from 'npm:nodemailer@6.9.9';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'Bolt Integration',
    version: '1.0.0',
  },
  apiVersion: '2023-10-16', // Specify API version explicitly
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Location mapping
const locationMap = {
  aix: {
    location: 'Aix-en-Provence, France',
    date: '1-2 Juillet 2025'
  },
  cannes: {
    location: 'Cannes, France',
    date: '15-16 Juillet 2025'
  },
  paris: {
    location: 'Paris, France',
    date: '22-23 Juillet 2025'
  },
  london: {
    location: 'London, UK',
    date: '29-30 Juillet 2025'
  },
  online: {
    location: 'Formation en ligne',
    date: '1-2 Septembre 2025'
  }
};

async function sendConfirmationEmail(formData: any) {
  console.log('Sending confirmation email to:', formData.email);
  
  const locationInfo = locationMap[formData.date as keyof typeof locationMap];

  if (!locationInfo) {
    throw new Error('Invalid location selected');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: Deno.env.get('SMTP_USER'),
      pass: Deno.env.get('SMTP_PASS')
    }
  });

  const mailOptions = {
    from: '"Artist Lab CAMPUS" <info@artistlab.studio>',
    to: formData.email,
    subject: 'Confirmation d\'inscription - Formation Cinéma & IA',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Confirmation d'inscription</h1>
        
        <p>Bonjour ${formData.prenom} ${formData.nom},</p>
        
        <p>Nous vous remercions pour votre inscription à notre formation "Cinéma & IA". Voici les détails de votre formation :</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #06B6D4; margin-top: 0;">Détails de la formation</h2>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Lieu :</strong> ${locationInfo.location}</li>
            <li><strong>Date :</strong> ${locationInfo.date}</li>
            <li><strong>Durée :</strong> 2 jours</li>
          </ul>
        </div>
        
        <p>Nous vous enverrons prochainement un email avec :</p>
        <ul>
          <li>Le programme détaillé</li>
          <li>Les informations pratiques (lieu exact, horaires, etc.)</li>
          <li>La liste des éléments à apporter</li>
        </ul>
        
        <p>Si vous avez des questions, n'hésitez pas à nous contacter à info@artistlab.studio</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            Cordialement,<br>
            L'équipe Artist Lab CAMPUS
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
}

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return new Response('No signature found', { status: 400 });
    }

    const body = await req.text();
    console.log('Received webhook payload:', body);

    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
      console.log('Webhook event constructed successfully:', event.type);
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return new Response(`Webhook signature verification failed: ${error.message}`, { status: 400 });
    }

    // Handle the event
    await handleEvent(event);

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

async function handleEvent(event: Stripe.Event) {
  console.log('Processing event:', event.type);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('Processing completed checkout session:', session.id);

    try {
      // Get the payment intent details
      const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
      console.log('Payment intent status:', paymentIntent.status);
      
      // Get the customer details from Stripe
      const customer = await stripe.customers.retrieve(session.customer as string);
      console.log('Customer email:', customer.email);
      
      if (!customer.email) {
        throw new Error('No customer email found');
      }

      // Find the pending registration for this customer
      const { data: registrations, error: fetchError } = await supabase
        .from('registrations')
        .select('*')
        .eq('email', customer.email)
        .eq('payment_status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error('Error fetching registration:', fetchError);
        throw fetchError;
      }

      if (!registrations || registrations.length === 0) {
        console.error('No pending registration found for email:', customer.email);
        throw new Error('No pending registration found');
      }

      const registration = registrations[0];
      console.log('Found pending registration:', registration.id);

      // Update the registration with payment details
      const { error: updateError } = await supabase
        .from('registrations')
        .update({
          payment_status: paymentIntent.status === 'succeeded' ? 'completed' : paymentIntent.status,
          payment_id: paymentIntent.id
        })
        .eq('id', registration.id);

      if (updateError) {
        console.error('Error updating registration:', updateError);
        throw updateError;
      }

      console.log('Registration updated successfully with payment ID:', paymentIntent.id);

      // Send confirmation email only if payment succeeded
      if (paymentIntent.status === 'succeeded') {
        await sendConfirmationEmail(registration);
      } else {
        console.log('Payment not succeeded, skipping confirmation email');
      }
    } catch (error) {
      console.error('Error processing successful payment:', error);
      throw error;
    }
  } else if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('Processing expired checkout session:', session.id);
    
    try {
      // Get the customer details from Stripe
      const customer = await stripe.customers.retrieve(session.customer as string);
      
      if (!customer.email) {
        throw new Error('No customer email found');
      }

      // Update the registration status to expired
      const { error: updateError } = await supabase
        .from('registrations')
        .update({ payment_status: 'expired' })
        .eq('email', customer.email)
        .eq('payment_status', 'pending');

      if (updateError) {
        console.error('Error updating expired registration:', updateError);
        throw updateError;
      }

      console.log('Registration marked as expired');
    } catch (error) {
      console.error('Error processing expired session:', error);
      throw error;
    }
  }
}