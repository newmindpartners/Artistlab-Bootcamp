import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'Artist Lab CAMPUS',
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

async function sendPaymentConfirmationEmailSMTP(formData: any, paymentDetails: any) {
  console.log('=== SENDING PAYMENT CONFIRMATION EMAIL VIA MAILGUN SMTP ===');
  console.log('Recipient:', formData.email);
  console.log('Payment amount:', paymentDetails.amount_received / 100, paymentDetails.currency.toUpperCase());
  console.log('Payment ID:', paymentDetails.id);
  
  const locationInfo = locationMap[formData.date as keyof typeof locationMap];

  if (!locationInfo) {
    console.error('Invalid location selected:', formData.date);
    throw new Error(`Invalid location selected: ${formData.date}`);
  }

  // Determine language based on location
  const isEnglish = formData.date === 'london';
  console.log('Email language:', isEnglish ? 'English' : 'French');
  
  const emailContent = {
    fr: {
      subject: '🎉 Paiement confirmé - Formation Cinéma & IA - Artist Lab CAMPUS',
      greeting: `Bonjour ${formData.prenom} ${formData.nom},`,
      paymentSuccess: 'Excellente nouvelle ! Votre paiement a été traité avec succès et votre place est maintenant réservée pour notre formation "Cinéma & IA".',
      paymentDetailsTitle: '💳 Détails du paiement',
      paymentId: 'ID de transaction',
      amount: 'Montant payé',
      paymentDate: 'Date de paiement',
      paymentMethod: 'Méthode de paiement',
      trainingDetailsTitle: '📋 Détails de votre formation',
      location: 'Lieu',
      date: 'Date',
      duration: 'Durée',
      durationValue: '2 jours intensifs (14 heures de formation)',
      nextStepsTitle: '🚀 Prochaines étapes importantes',
      nextSteps: [
        'Vous recevrez un email avec le programme détaillé et la liste des outils à installer dans les 48h',
        'Les informations pratiques (adresse exacte, horaires, matériel requis) vous seront envoyées 1 semaine avant la formation',
        'Un groupe WhatsApp sera créé pour faciliter les échanges entre participants',
        'Assurez-vous d\'avoir un ordinateur portable (Windows/Mac) avec au moins 8GB de RAM'
      ],
      whatIncluded: '✅ Ce qui est inclus dans votre formation',
      included: [
        'Formation complète sur 6 outils d\'IA révolutionnaires',
        'Accès à tous les logiciels et plateformes pendant la formation',
        'Création de votre propre court-métrage professionnel',
        'Certificat de formation Artist Lab CAMPUS',
        'Accès au réseau exclusif des anciens participants',
        'Support technique pendant et après la formation'
      ],
      importantNote: '⚠️ Information importante',
      noteText: 'Votre inscription est maintenant définitive. En cas d\'empêchement, vous pouvez reporter votre participation à une session ultérieure en nous contactant au moins 7 jours avant la date de formation.',
      contact: 'Des questions ? Notre équipe est à votre disposition à info@artistlab.studio',
      signature: 'L\'équipe Artist Lab CAMPUS',
      footer: '🎬 Préparez-vous à révolutionner votre approche du cinéma !',
      thankYou: 'Merci de votre confiance et à très bientôt !'
    },
    en: {
      subject: '🎉 Payment confirmed - Cinema & AI Training - Artist Lab CAMPUS',
      greeting: `Hello ${formData.prenom} ${formData.nom},`,
      paymentSuccess: 'Great news! Your payment has been processed successfully and your spot is now reserved for our "Cinema & AI" training.',
      paymentDetailsTitle: '💳 Payment details',
      paymentId: 'Transaction ID',
      amount: 'Amount paid',
      paymentDate: 'Payment date',
      paymentMethod: 'Payment method',
      trainingDetailsTitle: '📋 Your training details',
      location: 'Location',
      date: 'Date',
      duration: 'Duration',
      durationValue: '2 intensive days (14 hours of training)',
      nextStepsTitle: '🚀 Important next steps',
      nextSteps: [
        'You will receive an email with the detailed program and tools installation list within 48h',
        'Practical information (exact address, schedule, required equipment) will be sent 1 week before the training',
        'A WhatsApp group will be created to facilitate exchanges between participants',
        'Make sure you have a laptop (Windows/Mac) with at least 8GB of RAM'
      ],
      whatIncluded: '✅ What\'s included in your training',
      included: [
        'Complete training on 6 revolutionary AI tools',
        'Access to all software and platforms during training',
        'Creation of your own professional short film',
        'Artist Lab CAMPUS training certificate',
        'Access to the exclusive alumni network',
        'Technical support during and after training'
      ],
      importantNote: '⚠️ Important information',
      noteText: 'Your registration is now final. In case of impediment, you can postpone your participation to a later session by contacting us at least 7 days before the training date.',
      contact: 'Questions? Our team is available at info@artistlab.studio',
      signature: 'The Artist Lab CAMPUS team',
      footer: '🎬 Get ready to revolutionize your approach to cinema!',
      thankYou: 'Thank you for your trust and see you soon!'
    }
  };

  const content = isEnglish ? emailContent.en : emailContent.fr;
  const location = isEnglish ? locationInfo.location_en : locationInfo.location_fr;
  const date = isEnglish ? locationInfo.date_en : locationInfo.date_fr;

  // Format payment date
  const paymentDate = new Date().toLocaleDateString(isEnglish ? 'en-GB' : 'fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

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
        <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
          <div style="color: white; font-size: 48px; margin-bottom: 15px;">🎉</div>
          <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            ${isEnglish ? 'Payment Confirmed!' : 'Paiement Confirmé !'}
          </h1>
          <p style="color: #ffffff; margin: 15px 0 0 0; font-size: 18px; opacity: 0.95; font-weight: 500;">
            Artist Lab CAMPUS - Formation Cinéma & IA
          </p>
        </div>
        
        <!-- Success Message -->
        <div style="padding: 30px; background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); border-bottom: 3px solid #10B981;">
          <p style="color: #065F46; font-size: 18px; line-height: 1.6; margin: 0; font-weight: 600; text-align: center;">
            ${content.paymentSuccess}
          </p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 40px 30px;">
          <p style="color: #374151; font-size: 18px; line-height: 1.6; margin-bottom: 30px; font-weight: 500;">
            ${content.greeting}
          </p>
          
          <!-- Payment Details -->
          <div style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); padding: 25px; border-radius: 16px; margin-bottom: 30px; border: 2px solid #F59E0B;">
            <h3 style="color: #92400E; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">
              ${content.paymentDetailsTitle}
            </h3>
            <div style="display: grid; gap: 15px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #F59E0B;">
                <span style="color: #92400E; font-weight: 600;">${content.paymentId}:</span>
                <span style="color: #1F2937; font-weight: 700; font-family: monospace; font-size: 14px;">${paymentDetails.id}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #F59E0B;">
                <span style="color: #92400E; font-weight: 600;">${content.amount}:</span>
                <span style="color: #10B981; font-weight: 700; font-size: 18px;">${(paymentDetails.amount_received / 100).toFixed(2)} ${paymentDetails.currency.toUpperCase()}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #F59E0B;">
                <span style="color: #92400E; font-weight: 600;">${content.paymentDate}:</span>
                <span style="color: #1F2937; font-weight: 700;">${paymentDate}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
                <span style="color: #92400E; font-weight: 600;">${content.paymentMethod}:</span>
                <span style="color: #1F2937; font-weight: 700;">💳 ${paymentDetails.payment_method_types?.[0] || 'Card'}</span>
              </div>
            </div>
          </div>
          
          <!-- Training Details -->
          <div style="background: linear-gradient(135deg, #EBF8FF 0%, #DBEAFE 100%); padding: 25px; border-radius: 16px; margin-bottom: 30px; border: 2px solid #0EA5E9;">
            <h3 style="color: #0C4A6E; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">
              ${content.trainingDetailsTitle}
            </h3>
            <div style="display: grid; gap: 15px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #0EA5E9;">
                <span style="color: #0C4A6E; font-weight: 600;">${content.location}:</span>
                <span style="color: #1F2937; font-weight: 700;">${location}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #0EA5E9;">
                <span style="color: #0C4A6E; font-weight: 600;">${content.date}:</span>
                <span style="color: #1F2937; font-weight: 700;">${date}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
                <span style="color: #0C4A6E; font-weight: 600;">${content.duration}:</span>
                <span style="color: #1F2937; font-weight: 700;">${content.durationValue}</span>
              </div>
            </div>
          </div>
          
          <!-- What's Included -->
          <div style="background-color: #F0FDF4; padding: 25px; border-radius: 12px; margin-bottom: 30px; border-left: 5px solid #10B981;">
            <h3 style="color: #14532D; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">
              ${content.whatIncluded}
            </h3>
            <ul style="color: #14532D; font-size: 15px; line-height: 1.6; padding-left: 0; list-style: none; margin: 0;">
              ${content.included.map(item => `
                <li style="margin-bottom: 10px; display: flex; align-items: flex-start;">
                  <span style="color: #10B981; margin-right: 10px; font-weight: bold;">✅</span>
                  <span>${item}</span>
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
          
          <!-- Important Note -->
          <div style="background-color: #FEF2F2; padding: 20px; border-radius: 12px; border-left: 5px solid #EF4444; margin-bottom: 30px;">
            <h4 style="color: #991B1B; margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">
              ${content.importantNote}
            </h4>
            <p style="color: #991B1B; margin: 0; font-size: 14px; line-height: 1.5;">
              ${content.noteText}
            </p>
          </div>
          
          <!-- Contact Info -->
          <div style="background-color: #EBF8FF; padding: 25px; border-radius: 12px; border-left: 5px solid #0EA5E9; margin-bottom: 30px;">
            <p style="color: #1E40AF; margin: 0; font-size: 16px; font-weight: 500;">
              💬 ${content.contact}
            </p>
          </div>
          
          <!-- Thank You Message -->
          <div style="text-align: center; padding: 30px; background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%); border-radius: 12px; margin-bottom: 20px;">
            <p style="color: #10B981; font-size: 18px; font-weight: 700; margin: 0 0 10px 0;">
              ${content.footer}
            </p>
            <p style="color: #374151; font-size: 16px; margin: 0; font-weight: 600;">
              ${content.thankYou}
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
              Confirmation de paiement automatique - Transaction sécurisée par Stripe
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Check if Mailgun SMTP credentials are available
  const mailgunDomain = Deno.env.get('MAILGUN_DOMAIN');
  const mailgunSmtpUser = Deno.env.get('MAILGUN_SMTP_USER'); // Should be postmaster@YOUR_DOMAIN_NAME
  const mailgunSmtpPassword = Deno.env.get('MAILGUN_SMTP_PASSWORD'); // Your SMTP password
  
  if (!mailgunDomain) {
    console.error('❌ MAILGUN_DOMAIN environment variable is not set!');
    throw new Error('Email service not configured - missing MAILGUN_DOMAIN');
  }
  
  if (!mailgunSmtpUser) {
    console.error('❌ MAILGUN_SMTP_USER environment variable is not set!');
    console.log('💡 Set MAILGUN_SMTP_USER to: postmaster@' + mailgunDomain);
    throw new Error('Email service not configured - missing MAILGUN_SMTP_USER');
  }
  
  if (!mailgunSmtpPassword) {
    console.error('❌ MAILGUN_SMTP_PASSWORD environment variable is not set!');
    throw new Error('Email service not configured - missing MAILGUN_SMTP_PASSWORD');
  }

  console.log('✅ Mailgun SMTP credentials found, proceeding with email send...');
  console.log('SMTP User:', mailgunSmtpUser);
  console.log('Mailgun domain:', mailgunDomain);

  // Use Mailgun SMTP to send email
  try {
    console.log('Sending payment confirmation email using Mailgun SMTP...');
    
    // Create the email message in RFC 2822 format
    const boundary = `----=_NextPart_${Date.now()}_${Math.random().toString(36)}`;
    const emailMessage = [
      `From: Artist Lab CAMPUS <noreply@${mailgunDomain}>`,
      `To: ${formData.email}`,
      `Reply-To: info@artistlab.studio`,
      `Subject: ${content.subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      `X-Mailgun-Tag: payment_confirmation`,
      `X-Mailgun-Tag: training_location_${formData.date}`,
      `X-Mailgun-Tag: payment_amount_${(paymentDetails.amount_received / 100).toString()}`,
      ``,
      `--${boundary}`,
      `Content-Type: text/html; charset=UTF-8`,
      `Content-Transfer-Encoding: 8bit`,
      ``,
      htmlContent,
      ``,
      `--${boundary}--`
    ].join('\r\n');

    // Send via Mailgun SMTP using fetch to their API (more reliable than raw SMTP in edge functions)
    const formData_smtp = new FormData();
    formData_smtp.append('from', `Artist Lab CAMPUS <noreply@${mailgunDomain}>`);
    formData_smtp.append('to', formData.email);
    formData_smtp.append('subject', content.subject);
    formData_smtp.append('html', htmlContent);
    formData_smtp.append('h:Reply-To', 'info@artistlab.studio');
    formData_smtp.append('o:tag', 'payment_confirmation');
    formData_smtp.append('o:tag', `training_location_${formData.date}`);
    formData_smtp.append('o:tag', `payment_amount_${(paymentDetails.amount_received / 100).toString()}`);
    
    // Use the SMTP credentials for API authentication
    const emailResponse = await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${mailgunSmtpPassword}`)}`, // Use SMTP password as API key
      },
      body: formData_smtp,
    });

    console.log('Email API response status:', emailResponse.status);

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error('Mailgun SMTP API error response:', errorData);
      throw new Error(`Mailgun SMTP API error: ${emailResponse.status} - ${errorData}`);
    }

    const result = await emailResponse.json();
    console.log('✅ PAYMENT CONFIRMATION EMAIL SENT SUCCESSFULLY VIA MAILGUN SMTP!');
    console.log('Mailgun result:', result);
    
    return { success: true, messageId: result.id };
  } catch (error) {
    console.error('❌ PAYMENT CONFIRMATION EMAIL FAILED:');
    console.error('Error details:', error);
    throw new Error(`Failed to send payment confirmation email via Mailgun SMTP: ${error.message}`);
  }
}

Deno.serve(async (req) => {
  console.log('=== STRIPE WEBHOOK REQUEST RECEIVED ===');
  console.log('Method:', req.method);
  console.log('Timestamp:', new Date().toISOString());
  
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
    return new Response(JSON.stringify({ 
      received: true, 
      eventType: event.type,
      eventId: event.id,
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('❌ Error processing webhook:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

async function handleEvent(event: Stripe.Event) {
  console.log('=== HANDLING STRIPE EVENT ===');
  console.log('Event type:', event.type);
  console.log('Event ID:', event.id);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('Processing completed checkout session:', session.id);
    console.log('Session mode:', session.mode);
    console.log('Payment status:', session.payment_status);

    try {
      // Get the payment intent details
      if (!session.payment_intent) {
        throw new Error('No payment intent found in checkout session');
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
      console.log('Payment intent status:', paymentIntent.status);
      console.log('Payment intent amount:', paymentIntent.amount_received, paymentIntent.currency);
      
      // Get the customer details from Stripe
      if (!session.customer) {
        throw new Error('No customer found in checkout session');
      }

      const customer = await stripe.customers.retrieve(session.customer as string);
      console.log('Customer email:', customer.email);
      
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
        .limit(5);

      if (fetchError) {
        console.error('Error fetching registrations:', fetchError);
        throw fetchError;
      }

      console.log('Found registrations:', registrations?.length || 0);

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

      // Send payment confirmation email if payment succeeded
      if (paymentIntent.status === 'succeeded') {
        console.log('💌 Payment succeeded, sending payment confirmation email via Mailgun SMTP...');
        try {
          const emailResult = await sendPaymentConfirmationEmailSMTP(registration, paymentIntent);
          console.log('✅ Payment confirmation email sent successfully via Mailgun SMTP:', emailResult);
        } catch (emailError) {
          console.error('❌ Failed to send payment confirmation email via Mailgun SMTP:', emailError);
          // Log the error but don't fail the webhook - payment was successful
          console.error('🚨 CRITICAL: Payment processed but confirmation email failed to send!');
          console.error('Registration ID:', registration.id);
          console.error('Customer email:', customer.email);
          console.error('Payment ID:', paymentIntent.id);
        }
      } else {
        console.log('Payment not succeeded (status:', paymentIntent.status, '), skipping confirmation email');
      }
    } catch (error) {
      console.error('❌ Error processing successful payment:', error);
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
  } else if (event.type === 'payment_intent.succeeded') {
    // Additional confirmation for payment success
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.log('Payment intent succeeded:', paymentIntent.id);
    console.log('Amount received:', paymentIntent.amount_received, paymentIntent.currency);
  } else {
    console.log('ℹ️ Unhandled event type:', event.type);
  }
}