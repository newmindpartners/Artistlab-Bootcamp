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
  apiVersion: '2023-10-16',
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

// Location mapping with both French and English
const locationMap = {
  aix: {
    location_fr: 'Aix-en-Provence, France',
    location_en: 'Aix-en-Provence, France',
    date_fr: '27-28 Juin 2025',
    date_en: 'June 27-28, 2025'
  },
  cannes: {
    location_fr: 'Cannes, France',
    location_en: 'Cannes, France',
    date_fr: '12-13 Juillet 2025',
    date_en: 'July 12-13, 2025'
  },
  paris: {
    location_fr: 'Paris, France',
    location_en: 'Paris, France',
    date_fr: '26-27 Juillet 2025',
    date_en: 'July 26-27, 2025'
  },
  london: {
    location_fr: 'Londres, Royaume-Uni',
    location_en: 'London, UK',
    date_fr: '5-6 Septembre 2025',
    date_en: 'September 5-6, 2025'
  },
  online: {
    location_fr: 'Formation en ligne',
    location_en: 'Online Training',
    date_fr: '1 Septembre 2025',
    date_en: 'September 1, 2025'
  }
};

async function sendConfirmationEmail(formData: any) {
  console.log('Sending confirmation email to:', formData.email);
  
  const locationInfo = locationMap[formData.date as keyof typeof locationMap];

  if (!locationInfo) {
    console.error('Invalid location selected:', formData.date);
    throw new Error('Invalid location selected');
  }

  // Check if SMTP credentials are available
  const smtpUser = Deno.env.get('SMTP_USER');
  const smtpPass = Deno.env.get('SMTP_PASS');

  if (!smtpUser || !smtpPass) {
    console.error('SMTP credentials not configured');
    throw new Error('Email service not configured');
  }

  const transporter = nodemailer.createTransporter({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });

  // Determine language based on location or default to French
  const isEnglish = formData.date === 'london';
  
  const emailContent = {
    fr: {
      subject: 'Confirmation d\'inscription - Formation Cinéma & IA',
      greeting: `Bonjour ${formData.prenom} ${formData.nom},`,
      thanks: 'Nous vous remercions pour votre inscription à notre formation "Cinéma & IA". Votre paiement a été confirmé avec succès.',
      detailsTitle: 'Détails de votre formation',
      location: 'Lieu',
      date: 'Date',
      duration: 'Durée',
      durationValue: '2 jours intensifs',
      nextStepsTitle: 'Prochaines étapes',
      nextSteps: [
        'Vous recevrez un email avec le programme détaillé dans les prochains jours',
        'Les informations pratiques (lieu exact, horaires, matériel à apporter) vous seront envoyées 1 semaine avant la formation',
        'Un groupe WhatsApp sera créé pour faciliter les échanges entre participants'
      ],
      contact: 'Si vous avez des questions, n\'hésitez pas à nous contacter à info@artistlab.studio',
      signature: 'L\'équipe Artist Lab CAMPUS',
      footer: 'Préparez-vous à vivre une expérience unique dans le monde du cinéma et de l\'IA !'
    },
    en: {
      subject: 'Registration Confirmation - Cinema & AI Training',
      greeting: `Hello ${formData.prenom} ${formData.nom},`,
      thanks: 'Thank you for registering for our "Cinema & AI" training. Your payment has been successfully confirmed.',
      detailsTitle: 'Your training details',
      location: 'Location',
      date: 'Date',
      duration: 'Duration',
      durationValue: '2 intensive days',
      nextStepsTitle: 'Next steps',
      nextSteps: [
        'You will receive an email with the detailed program in the coming days',
        'Practical information (exact location, schedule, equipment to bring) will be sent 1 week before the training',
        'A WhatsApp group will be created to facilitate exchanges between participants'
      ],
      contact: 'If you have any questions, please contact us at info@artistlab.studio',
      signature: 'The Artist Lab CAMPUS team',
      footer: 'Get ready for a unique experience in the world of cinema and AI!'
    }
  };

  const content = isEnglish ? emailContent.en : emailContent.fr;
  const location = isEnglish ? locationInfo.location_en : locationInfo.location_fr;
  const date = isEnglish ? locationInfo.date_en : locationInfo.date_fr;

  const mailOptions = {
    from: '"Artist Lab CAMPUS" <info@artistlab.studio>',
    to: formData.email,
    subject: content.subject,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Artist Lab CAMPUS</h1>
          <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Formation Cinéma & IA</p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 40px 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #10B981; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 24px;">✓</span>
            </div>
            <h2 style="color: #1F2937; margin: 0; font-size: 24px; font-weight: bold;">Inscription Confirmée !</h2>
          </div>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            ${content.greeting}
          </p>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            ${content.thanks}
          </p>
          
          <!-- Training Details -->
          <div style="background-color: #F3F4F6; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
            <h3 style="color: #0EA5E9; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">
              ${content.detailsTitle}
            </h3>
            <div style="display: grid; gap: 15px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #E5E7EB;">
                <span style="color: #6B7280; font-weight: 500;">${content.location}:</span>
                <span style="color: #1F2937; font-weight: 600;">${location}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #E5E7EB;">
                <span style="color: #6B7280; font-weight: 500;">${content.date}:</span>
                <span style="color: #1F2937; font-weight: 600;">${date}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0;">
                <span style="color: #6B7280; font-weight: 500;">${content.duration}:</span>
                <span style="color: #1F2937; font-weight: 600;">${content.durationValue}</span>
              </div>
            </div>
          </div>
          
          <!-- Next Steps -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #0EA5E9; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">
              ${content.nextStepsTitle}
            </h3>
            <ul style="color: #374151; font-size: 16px; line-height: 1.6; padding-left: 0; list-style: none;">
              ${content.nextSteps.map((step, index) => `
                <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
                  <span style="background-color: #0EA5E9; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px; flex-shrink: 0; margin-top: 2px;">
                    ${index + 1}
                  </span>
                  <span>${step}</span>
                </li>
              `).join('')}
            </ul>
          </div>
          
          <!-- Contact Info -->
          <div style="background-color: #FEF3C7; padding: 20px; border-radius: 8px; border-left: 4px solid #F59E0B; margin-bottom: 30px;">
            <p style="color: #92400E; margin: 0; font-size: 14px;">
              <strong>💡 ${content.contact}</strong>
            </p>
          </div>
          
          <!-- Footer Message -->
          <div style="text-align: center; padding: 20px; background-color: #F9FAFB; border-radius: 8px;">
            <p style="color: #0EA5E9; font-size: 16px; font-weight: 600; margin: 0;">
              ${content.footer}
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #1F2937; padding: 30px; text-align: center;">
          <p style="color: #9CA3AF; margin: 0; font-size: 14px;">
            ${content.signature}
          </p>
          <p style="color: #6B7280; margin: 10px 0 0 0; font-size: 12px;">
            Artist Lab Studio - Formation professionnelle en cinéma et IA
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully to:', formData.email);
    return { success: true };
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
      console.error('No Stripe signature found in request headers');
      return new Response('No signature found', { status: 400 });
    }

    const body = await req.text();
    console.log('Received webhook payload length:', body.length);

    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
      console.log('Webhook event constructed successfully:', event.type, 'ID:', event.id);
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
  console.log('Processing event:', event.type, 'ID:', event.id);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('Processing completed checkout session:', session.id);

    try {
      // Get the payment intent details
      const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
      console.log('Payment intent status:', paymentIntent.status, 'ID:', paymentIntent.id);
      
      // Get the customer details from Stripe
      const customer = await stripe.customers.retrieve(session.customer as string);
      console.log('Customer retrieved:', customer.id, 'Email:', customer.email);
      
      if (!customer.email) {
        throw new Error('No customer email found in Stripe customer record');
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
        
        // Try to find any registration for this email (in case status was already updated)
        const { data: anyRegistrations, error: anyFetchError } = await supabase
          .from('registrations')
          .select('*')
          .eq('email', customer.email)
          .order('created_at', { ascending: false })
          .limit(1);

        if (anyFetchError) {
          console.error('Error fetching any registration:', anyFetchError);
          throw anyFetchError;
        }

        if (!anyRegistrations || anyRegistrations.length === 0) {
          throw new Error('No registration found for this email address');
        }

        console.log('Found existing registration with status:', anyRegistrations[0].payment_status);
        
        // If payment is already completed, don't process again
        if (anyRegistrations[0].payment_status === 'completed') {
          console.log('Registration already marked as completed, skipping');
          return;
        }
      }

      const registration = registrations?.[0] || anyRegistrations?.[0];
      console.log('Found registration:', registration.id, 'Status:', registration.payment_status);

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
        console.log('Payment succeeded, sending confirmation email...');
        try {
          await sendConfirmationEmail(registration);
          console.log('Confirmation email sent successfully');
        } catch (emailError) {
          console.error('Failed to send confirmation email, but payment was processed:', emailError);
          // Don't throw here - payment was successful, email failure shouldn't fail the webhook
        }
      } else {
        console.log('Payment not succeeded (status:', paymentIntent.status, '), skipping confirmation email');
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

      console.log('Registration marked as expired for email:', customer.email);
    } catch (error) {
      console.error('Error processing expired session:', error);
      throw error;
    }
  } else {
    console.log('Unhandled event type:', event.type);
  }
}