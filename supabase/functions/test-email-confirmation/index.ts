import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

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

async function sendTestConfirmationEmail(formData: any) {
  console.log('=== STARTING TEST EMAIL SEND PROCESS ===');
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
      subject: '✅ TEST - Confirmation d\'inscription - Formation Cinéma & IA - Artist Lab CAMPUS',
      greeting: `Bonjour ${formData.prenom} ${formData.nom},`,
      thanks: 'Ceci est un email de test. Félicitations ! Votre inscription à notre formation "Cinéma & IA" est confirmée. Votre paiement a été traité avec succès.',
      detailsTitle: '📋 Détails de votre formation',
      location: 'Lieu',
      date: 'Date',
      duration: 'Durée',
      durationValue: '2 jours intensifs (14 heures de formation)',
      price: 'Prix',
      priceValue: '€1.00 (prix de lancement)',
      contact: 'Des questions ? Contactez-nous à info@artistlab.studio ou répondez directement à cet email.',
      signature: 'L\'équipe Artist Lab CAMPUS',
      footer: '🎬 Ceci est un email de test pour vérifier la configuration !',
    },
    en: {
      subject: '✅ TEST - Registration Confirmation - Cinema & AI Training - Artist Lab CAMPUS',
      greeting: `Hello ${formData.prenom} ${formData.nom},`,
      thanks: 'This is a test email. Congratulations! Your registration for our "Cinema & AI" training is confirmed. Your payment has been processed successfully.',
      detailsTitle: '📋 Your training details',
      location: 'Location',
      date: 'Date',
      duration: 'Duration',
      durationValue: '2 intensive days (14 hours of training)',
      price: 'Price',
      priceValue: '€1.00 (launch price)',
      contact: 'Questions? Contact us at info@artistlab.studio or reply directly to this email.',
      signature: 'The Artist Lab CAMPUS team',
      footer: '🎬 This is a test email to verify the configuration!',
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
            Formation Cinéma & IA - TEST EMAIL
          </p>
        </div>
        
        <!-- Success Banner -->
        <div style="background-color: #10B981; padding: 20px; text-align: center;">
          <div style="color: white; font-size: 48px; margin-bottom: 10px;">✅</div>
          <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">
            ${isEnglish ? 'TEST - Registration Confirmed!' : 'TEST - Inscription Confirmée !'}
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
              Cet email de test a été envoyé pour vérifier la configuration email.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Check if Resend API key is available
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }

  console.log('Resend API Key available:', !!resendApiKey);
  console.log('Resend API Key length:', resendApiKey.length);

  // Use Resend API to send email
  try {
    console.log('Sending test email using Resend API...');
    
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

    const responseText = await emailResponse.text();
    console.log('Email API response body:', responseText);

    if (!emailResponse.ok) {
      console.error('Email service error response:', responseText);
      throw new Error(`Email service error: ${emailResponse.status} - ${responseText}`);
    }

    const result = JSON.parse(responseText);
    console.log('✅ TEST EMAIL SENT SUCCESSFULLY!');
    console.log('Email result:', result);
    
    return { success: true, emailId: result.id, result };
  } catch (error) {
    console.error('❌ TEST EMAIL SENDING FAILED:');
    console.error('Error details:', error);
    throw new Error(`Failed to send test confirmation email: ${error.message}`);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log('=== TEST EMAIL CONFIRMATION FUNCTION CALLED ===');
    
    // Get test data from request body or use default
    let testData;
    try {
      testData = await req.json();
    } catch {
      // Use default test data if no body provided
      testData = {
        prenom: 'Test',
        nom: 'User',
        email: 'test@example.com',
        date: 'paris'
      };
    }

    console.log('Test data:', testData);

    // Validate required fields
    if (!testData.email || !testData.prenom || !testData.nom || !testData.date) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: email, prenom, nom, date' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Send test email
    const result = await sendTestConfirmationEmail(testData);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Test confirmation email sent successfully!',
      result 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    console.error('Error in test email function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});