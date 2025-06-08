import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

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
  console.log('=== STARTING EMAIL SEND PROCESS ===');
  console.log('Recipient email:', formData.email);
  console.log('Registration data:', JSON.stringify(formData, null, 2));
  
  const locationInfo = locationMap[formData.date as keyof typeof locationMap];

  if (!locationInfo) {
    console.error('Invalid location selected:', formData.date);
    console.error('Available locations:', Object.keys(locationMap));
    throw new Error(`Invalid location selected: ${formData.date}`);
  }

  // Determine language based on location or default to French
  const isEnglish = formData.date === 'london';
  console.log('Email language:', isEnglish ? 'English' : 'French');
  
  const emailContent = {
    fr: {
      subject: '✅ Confirmation d\'inscription - Formation Cinéma & IA - Artist Lab CAMPUS',
      greeting: `Bonjour ${formData.prenom} ${formData.nom},`,
      thanks: 'Félicitations ! Votre inscription à notre formation "Cinéma & IA" est confirmée. Votre paiement a été traité avec succès.',
      detailsTitle: '📋 Détails de votre formation',
      location: 'Lieu',
      date: 'Date',
      duration: 'Durée',
      durationValue: '2 jours intensifs (14 heures de formation)',
      price: 'Prix',
      priceValue: '€1.00 (prix de lancement)',
      nextStepsTitle: '🚀 Prochaines étapes',
      nextSteps: [
        'Vous recevrez un email avec le programme détaillé et les outils à installer dans les 48h',
        'Les informations pratiques (adresse exacte, horaires, matériel à apporter) vous seront envoyées 1 semaine avant la formation',
        'Un groupe WhatsApp sera créé pour faciliter les échanges entre participants',
        'Préparez votre ordinateur portable (Windows/Mac) avec au moins 8GB de RAM'
      ],
      whatYouWillLearn: '🎯 Ce que vous allez apprendre',
      skills: [
        'Maîtrise complète de Midjourney pour la création d\'images professionnelles',
        'Génération de vidéos avec RunwayML et Kling.ai',
        'Création de voix off et doublage automatique',
        'Effets spéciaux avec Luma AI',
        'Montage et finalisation de votre court-métrage',
        'Techniques avancées de prompting et workflow professionnel'
      ],
      contact: 'Des questions ? Contactez-nous à info@artistlab.studio ou répondez directement à cet email.',
      signature: 'L\'équipe Artist Lab CAMPUS',
      footer: '🎬 Préparez-vous à révolutionner votre approche du cinéma avec l\'IA !',
      ps: 'P.S. : Suivez-nous sur nos réseaux sociaux pour des conseils et actualités sur l\'IA dans le cinéma.'
    },
    en: {
      subject: '✅ Registration Confirmation - Cinema & AI Training - Artist Lab CAMPUS',
      greeting: `Hello ${formData.prenom} ${formData.nom},`,
      thanks: 'Congratulations! Your registration for our "Cinema & AI" training is confirmed. Your payment has been processed successfully.',
      detailsTitle: '📋 Your training details',
      location: 'Location',
      date: 'Date',
      duration: 'Duration',
      durationValue: '2 intensive days (14 hours of training)',
      price: 'Price',
      priceValue: '€1.00 (launch price)',
      nextStepsTitle: '🚀 Next steps',
      nextSteps: [
        'You will receive an email with the detailed program and tools to install within 48h',
        'Practical information (exact address, schedule, equipment to bring) will be sent 1 week before the training',
        'A WhatsApp group will be created to facilitate exchanges between participants',
        'Prepare your laptop (Windows/Mac) with at least 8GB of RAM'
      ],
      whatYouWillLearn: '🎯 What you will learn',
      skills: [
        'Complete mastery of Midjourney for professional image creation',
        'Video generation with RunwayML and Kling.ai',
        'Voice-over creation and automatic dubbing',
        'Special effects with Luma AI',
        'Editing and finalizing your short film',
        'Advanced prompting techniques and professional workflow'
      ],
      contact: 'Questions? Contact us at info@artistlab.studio or reply directly to this email.',
      signature: 'The Artist Lab CAMPUS team',
      footer: '🎬 Get ready to revolutionize your approach to cinema with AI!',
      ps: 'P.S.: Follow us on social media for tips and news about AI in cinema.'
    }
  };

  const content = isEnglish ? emailContent.en : emailContent.fr;
  const location = isEnglish ? locationInfo.location_en : locationInfo.location_fr;
  const date = isEnglish ? locationInfo.date_en : locationInfo.date_fr;

  console.log('Preparing email content...');
  console.log('Subject:', content.subject);
  console.log('Location:', location);
  console.log('Date:', date);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="${isEnglish ? 'en' : 'fr'}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${content.subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            🎬 Artist Lab CAMPUS
          </h1>
          <p style="color: #ffffff; margin: 15px 0 0 0; font-size: 18px; opacity: 0.95; font-weight: 500;">
            Formation Cinéma & IA
          </p>
        </div>
        
        <!-- Success Banner -->
        <div style="background-color: #10B981; padding: 20px; text-align: center;">
          <div style="color: white; font-size: 48px; margin-bottom: 10px;">✅</div>
          <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">
            ${isEnglish ? 'Registration Confirmed!' : 'Inscription Confirmée !'}
          </h2>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 40px 30px;">
          <p style="color: #374151; font-size: 18px; line-height: 1.6; margin-bottom: 30px; font-weight: 500;">
            ${content.greeting}
          </p>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            ${content.thanks}
          </p>
          
          <!-- Training Details -->
          <div style="background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%); padding: 30px; border-radius: 16px; margin-bottom: 30px; border: 1px solid #D1D5DB;">
            <h3 style="color: #0EA5E9; margin: 0 0 25px 0; font-size: 22px; font-weight: bold;">
              ${content.detailsTitle}
            </h3>
            <div style="display: grid; gap: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 2px solid #E5E7EB;">
                <span style="color: #6B7280; font-weight: 600; font-size: 16px;">${content.location}:</span>
                <span style="color: #1F2937; font-weight: 700; font-size: 16px;">${location}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 2px solid #E5E7EB;">
                <span style="color: #6B7280; font-weight: 600; font-size: 16px;">${content.date}:</span>
                <span style="color: #1F2937; font-weight: 700; font-size: 16px;">${date}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 2px solid #E5E7EB;">
                <span style="color: #6B7280; font-weight: 600; font-size: 16px;">${content.duration}:</span>
                <span style="color: #1F2937; font-weight: 700; font-size: 16px;">${content.durationValue}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0;">
                <span style="color: #6B7280; font-weight: 600; font-size: 16px;">${content.price}:</span>
                <span style="color: #10B981; font-weight: 700; font-size: 18px;">${content.priceValue}</span>
              </div>
            </div>
          </div>
          
          <!-- What You Will Learn -->
          <div style="background-color: #FEF3C7; padding: 25px; border-radius: 12px; margin-bottom: 30px; border-left: 5px solid #F59E0B;">
            <h3 style="color: #92400E; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">
              ${content.whatYouWillLearn}
            </h3>
            <ul style="color: #92400E; font-size: 15px; line-height: 1.6; padding-left: 0; list-style: none; margin: 0;">
              ${content.skills.map(skill => `
                <li style="margin-bottom: 10px; display: flex; align-items: flex-start;">
                  <span style="color: #F59E0B; margin-right: 10px; font-weight: bold;">🎯</span>
                  <span>${skill}</span>
                </li>
              `).join('')}
            </ul>
          </div>
          
          <!-- Next Steps -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #0EA5E9; margin: 0 0 25px 0; font-size: 22px; font-weight: bold;">
              ${content.nextStepsTitle}
            </h3>
            <ul style="color: #374151; font-size: 16px; line-height: 1.6; padding-left: 0; list-style: none; margin: 0;">
              ${content.nextSteps.map((step, index) => `
                <li style="margin-bottom: 15px; display: flex; align-items: flex-start;">
                  <span style="background: linear-gradient(135deg, #0EA5E9, #38BDF8); color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; margin-right: 15px; flex-shrink: 0; margin-top: 2px;">
                    ${index + 1}
                  </span>
                  <span>${step}</span>
                </li>
              `).join('')}
            </ul>
          </div>
          
          <!-- Contact Info -->
          <div style="background-color: #EBF8FF; padding: 25px; border-radius: 12px; border-left: 5px solid #0EA5E9; margin-bottom: 30px;">
            <p style="color: #1E40AF; margin: 0; font-size: 16px; font-weight: 500;">
              💬 ${content.contact}
            </p>
          </div>
          
          <!-- Footer Message -->
          <div style="text-align: center; padding: 30px; background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%); border-radius: 12px; margin-bottom: 20px;">
            <p style="color: #0EA5E9; font-size: 18px; font-weight: 700; margin: 0 0 10px 0;">
              ${content.footer}
            </p>
            <p style="color: #6B7280; font-size: 14px; margin: 0; font-style: italic;">
              ${content.ps}
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #1F2937; padding: 30px; text-align: center;">
          <p style="color: #9CA3AF; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
            ${content.signature}
          </p>
          <p style="color: #6B7280; margin: 0; font-size: 13px;">
            Artist Lab Studio - Formation professionnelle en cinéma et IA
          </p>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #374151;">
            <p style="color: #6B7280; margin: 0; font-size: 12px;">
              Cet email a été envoyé automatiquement suite à votre inscription confirmée.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Check if we have RESEND_API_KEY
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  if (!resendApiKey) {
    console.error('❌ RESEND_API_KEY not found in environment variables');
    console.log('Available environment variables:', Object.keys(Deno.env.toObject()));
    throw new Error('RESEND_API_KEY environment variable is not set');
  }

  try {
    console.log('Sending email using Resend API...');
    console.log('API Key exists:', !!resendApiKey);
    console.log('API Key length:', resendApiKey.length);
    
    // Use Resend API to send email
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Artist Lab CAMPUS <noreply@artistlab.studio>',
        to: [formData.email],
        subject: content.subject,
        html: htmlContent,
      }),
    });

    console.log('Email API response status:', emailResponse.status);
    console.log('Email API response headers:', Object.fromEntries(emailResponse.headers.entries()));

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error('Email service error response:', errorData);
      throw new Error(`Email service error: ${emailResponse.status} - ${errorData}`);
    }

    const result = await emailResponse.json();
    console.log('✅ EMAIL SENT SUCCESSFULLY!');
    console.log('Email result:', result);
    
    return { success: true, emailId: result.id };
  } catch (error) {
    console.error('❌ EMAIL SENDING FAILED:');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    throw new Error(`Failed to send confirmation email: ${error.message}`);
  }
}

Deno.serve(async (req) => {
  console.log('=== WEBHOOK REQUEST RECEIVED ===');
  console.log('Method:', req.method);
  console.log('Headers:', Object.fromEntries(req.headers.entries()));
  
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }

    if (req.method !== 'POST') {
      console.error('Invalid method:', req.method);
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
      console.log('✅ Webhook event constructed successfully');
      console.log('Event type:', event.type);
      console.log('Event ID:', event.id);
      console.log('Event created:', new Date(event.created * 1000).toISOString());
    } catch (error: any) {
      console.error('❌ Webhook signature verification failed:', error.message);
      return new Response(`Webhook signature verification failed: ${error.message}`, { status: 400 });
    }

    // Handle the event
    await handleEvent(event);

    console.log('✅ Webhook processed successfully');
    return new Response(JSON.stringify({ received: true, eventType: event.type }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('❌ Error processing webhook:', error);
    console.error('Error stack:', error.stack);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

async function handleEvent(event: Stripe.Event) {
  console.log('=== HANDLING EVENT ===');
  console.log('Event type:', event.type);
  console.log('Event ID:', event.id);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('Processing completed checkout session:', session.id);
    console.log('Customer ID:', session.customer);
    console.log('Payment intent:', session.payment_intent);
    console.log('Payment status:', session.payment_status);

    try {
      // Get the payment intent details
      if (!session.payment_intent) {
        throw new Error('No payment intent found in checkout session');
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
      console.log('Payment intent retrieved:');
      console.log('- Status:', paymentIntent.status);
      console.log('- ID:', paymentIntent.id);
      console.log('- Amount:', paymentIntent.amount);
      console.log('- Currency:', paymentIntent.currency);
      
      // Get the customer details from Stripe
      if (!session.customer) {
        throw new Error('No customer found in checkout session');
      }

      const customer = await stripe.customers.retrieve(session.customer as string);
      console.log('Customer retrieved:');
      console.log('- ID:', customer.id);
      console.log('- Email:', customer.email);
      
      if (!customer.email) {
        throw new Error('No customer email found in Stripe customer record');
      }

      // Find the registration for this customer
      console.log('Searching for registration with email:', customer.email);
      
      const { data: registrations, error: fetchError } = await supabase
        .from('registrations')
        .select('*')
        .eq('email', customer.email)
        .order('created_at', { ascending: false })
        .limit(5); // Get last 5 to see all recent registrations

      if (fetchError) {
        console.error('Error fetching registrations:', fetchError);
        throw fetchError;
      }

      console.log('Found registrations:', registrations?.length || 0);
      registrations?.forEach((reg, index) => {
        console.log(`Registration ${index + 1}:`, {
          id: reg.id,
          email: reg.email,
          payment_status: reg.payment_status,
          payment_id: reg.payment_id,
          created_at: reg.created_at
        });
      });

      if (!registrations || registrations.length === 0) {
        console.error('No registrations found for email:', customer.email);
        throw new Error('No registration found for this email address');
      }

      // Find the most recent pending registration, or the most recent one if none are pending
      let registration = registrations.find(reg => reg.payment_status === 'pending');
      if (!registration) {
        registration = registrations[0]; // Most recent
        console.log('No pending registration found, using most recent:', registration.id);
      } else {
        console.log('Found pending registration:', registration.id);
      }

      // Check if this payment was already processed
      if (registration.payment_id === paymentIntent.id) {
        console.log('Payment already processed for this registration, skipping');
        return;
      }

      // Update the registration with payment details
      console.log('Updating registration with payment details...');
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

      console.log('✅ Registration updated successfully');
      console.log('- Registration ID:', registration.id);
      console.log('- Payment ID:', paymentIntent.id);
      console.log('- New status:', paymentIntent.status === 'succeeded' ? 'completed' : paymentIntent.status);

      // Send confirmation email only if payment succeeded
      if (paymentIntent.status === 'succeeded') {
        console.log('💌 Payment succeeded, sending confirmation email...');
        try {
          const emailResult = await sendConfirmationEmail(registration);
          console.log('✅ Confirmation email sent successfully:', emailResult);
        } catch (emailError) {
          console.error('❌ Failed to send confirmation email:', emailError);
          console.error('Email error details:', emailError.message);
          console.error('Email error stack:', emailError.stack);
          
          // Log the registration data for debugging
          console.log('Registration data that failed to send:', JSON.stringify(registration, null, 2));
          
          // Don't throw here - payment was successful, email failure shouldn't fail the webhook
          // But we should log it prominently
          console.error('🚨 CRITICAL: Payment processed but confirmation email failed to send!');
        }
      } else {
        console.log('Payment not succeeded (status:', paymentIntent.status, '), skipping confirmation email');
      }
    } catch (error) {
      console.error('❌ Error processing successful payment:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  } else if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('Processing expired checkout session:', session.id);
    
    try {
      if (!session.customer) {
        throw new Error('No customer found in expired session');
      }

      // Get the customer details from Stripe
      const customer = await stripe.customers.retrieve(session.customer as string);
      
      if (!customer.email) {
        throw new Error('No customer email found');
      }

      console.log('Marking registration as expired for email:', customer.email);

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

      console.log('✅ Registration marked as expired for email:', customer.email);
    } catch (error) {
      console.error('❌ Error processing expired session:', error);
      throw error;
    }
  } else {
    console.log('ℹ️ Unhandled event type:', event.type);
  }
}