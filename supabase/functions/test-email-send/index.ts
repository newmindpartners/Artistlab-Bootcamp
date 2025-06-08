import nodemailer from 'npm:nodemailer@6.9.9';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Test registration data for laurent.bellandi@me.com
const testRegistrationData = {
  prenom: 'Laurent',
  nom: 'Bellandi',
  email: 'laurent.bellandi@me.com',
  telephone: '+33 6 12 34 56 78',
  ville: 'Paris',
  date: 'paris' // Paris location
};

// Location mapping
const locationMap = {
  paris: {
    location_fr: 'Paris, France',
    location_en: 'Paris, France',
    date_fr: '26-27 Juillet 2025',
    date_en: 'July 26-27, 2025'
  }
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  console.log('=== STARTING TEST EMAIL SEND ===');
  console.log('Target email: laurent.bellandi@me.com');

  try {
    // Check SMTP credentials
    const smtpUser = Deno.env.get('SMTP_USER');
    const smtpPass = Deno.env.get('SMTP_PASS');

    console.log('SMTP User configured:', !!smtpUser);
    console.log('SMTP Pass configured:', !!smtpPass);

    if (!smtpUser || !smtpPass) {
      throw new Error('SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS environment variables.');
    }

    console.log('Creating email transporter...');
    const transporter = nodemailer.createTransporter({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    // Test the connection
    console.log('Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully');

    const locationInfo = locationMap.paris;
    const isEnglish = false; // French by default

    const emailContent = {
      subject: '✅ TEST - Confirmation d\'inscription - Formation Cinéma & IA - Artist Lab CAMPUS',
      greeting: `Bonjour ${testRegistrationData.prenom} ${testRegistrationData.nom},`,
      thanks: '🧪 Ceci est un email de test pour vérifier la configuration SMTP. Votre inscription à notre formation "Cinéma & IA" est confirmée. Votre paiement a été traité avec succès.',
      detailsTitle: '📋 Détails de votre formation (TEST)',
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
      ps: 'P.S. : Ceci était un email de test pour vérifier la configuration SMTP.'
    };

    const mailOptions = {
      from: '"Artist Lab CAMPUS (TEST)" <info@artistlab.studio>',
      to: testRegistrationData.email,
      subject: emailContent.subject,
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${emailContent.subject}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Test Banner -->
            <div style="background-color: #F59E0B; padding: 15px; text-align: center;">
              <p style="color: #ffffff; margin: 0; font-size: 16px; font-weight: bold;">
                🧪 EMAIL DE TEST - CONFIGURATION SMTP
              </p>
            </div>
            
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
                Test Email - Inscription Confirmée !
              </h2>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 40px 30px;">
              <p style="color: #374151; font-size: 18px; line-height: 1.6; margin-bottom: 30px; font-weight: 500;">
                ${emailContent.greeting}
              </p>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                ${emailContent.thanks}
              </p>
              
              <!-- Training Details -->
              <div style="background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%); padding: 30px; border-radius: 16px; margin-bottom: 30px; border: 1px solid #D1D5DB;">
                <h3 style="color: #0EA5E9; margin: 0 0 25px 0; font-size: 22px; font-weight: bold;">
                  ${emailContent.detailsTitle}
                </h3>
                <div style="display: grid; gap: 20px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 2px solid #E5E7EB;">
                    <span style="color: #6B7280; font-weight: 600; font-size: 16px;">${emailContent.location}:</span>
                    <span style="color: #1F2937; font-weight: 700; font-size: 16px;">${locationInfo.location_fr}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 2px solid #E5E7EB;">
                    <span style="color: #6B7280; font-weight: 600; font-size: 16px;">${emailContent.date}:</span>
                    <span style="color: #1F2937; font-weight: 700; font-size: 16px;">${locationInfo.date_fr}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 2px solid #E5E7EB;">
                    <span style="color: #6B7280; font-weight: 600; font-size: 16px;">${emailContent.duration}:</span>
                    <span style="color: #1F2937; font-weight: 700; font-size: 16px;">${emailContent.durationValue}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0;">
                    <span style="color: #6B7280; font-weight: 600; font-size: 16px;">${emailContent.price}:</span>
                    <span style="color: #10B981; font-weight: 700; font-size: 18px;">${emailContent.priceValue}</span>
                  </div>
                </div>
              </div>
              
              <!-- What You Will Learn -->
              <div style="background-color: #FEF3C7; padding: 25px; border-radius: 12px; margin-bottom: 30px; border-left: 5px solid #F59E0B;">
                <h3 style="color: #92400E; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">
                  ${emailContent.whatYouWillLearn}
                </h3>
                <ul style="color: #92400E; font-size: 15px; line-height: 1.6; padding-left: 0; list-style: none; margin: 0;">
                  ${emailContent.skills.map(skill => `
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
                  ${emailContent.nextStepsTitle}
                </h3>
                <ul style="color: #374151; font-size: 16px; line-height: 1.6; padding-left: 0; list-style: none; margin: 0;">
                  ${emailContent.nextSteps.map((step, index) => `
                    <li style="margin-bottom: 15px; display: flex; align-items: flex-start;">
                      <span style="background: linear-gradient(135deg, #0EA5E9, #38BDF8); color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; margin-right: 15px; flex-shrink: 0; margin-top: 2px;">
                        ${index + 1}
                      </span>
                      <span>${step}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
              
              <!-- Test Info -->
              <div style="background-color: #FEF3C7; padding: 25px; border-radius: 12px; border-left: 5px solid #F59E0B; margin-bottom: 30px;">
                <h3 style="color: #92400E; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">
                  🧪 Informations de Test
                </h3>
                <p style="color: #92400E; margin: 0; font-size: 14px;">
                  Cet email a été envoyé pour tester la configuration SMTP. Si vous recevez cet email, cela signifie que le système d'envoi d'emails fonctionne correctement.
                </p>
                <p style="color: #92400E; margin: 10px 0 0 0; font-size: 14px;">
                  <strong>Email de test envoyé à:</strong> ${testRegistrationData.email}<br>
                  <strong>Date/Heure:</strong> ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}
                </p>
              </div>
              
              <!-- Contact Info -->
              <div style="background-color: #EBF8FF; padding: 25px; border-radius: 12px; border-left: 5px solid #0EA5E9; margin-bottom: 30px;">
                <p style="color: #1E40AF; margin: 0; font-size: 16px; font-weight: 500;">
                  💬 ${emailContent.contact}
                </p>
              </div>
              
              <!-- Footer Message -->
              <div style="text-align: center; padding: 30px; background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%); border-radius: 12px; margin-bottom: 20px;">
                <p style="color: #0EA5E9; font-size: 18px; font-weight: 700; margin: 0 0 10px 0;">
                  ${emailContent.footer}
                </p>
                <p style="color: #6B7280; font-size: 14px; margin: 0; font-style: italic;">
                  ${emailContent.ps}
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #1F2937; padding: 30px; text-align: center;">
              <p style="color: #9CA3AF; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
                ${emailContent.signature}
              </p>
              <p style="color: #6B7280; margin: 0; font-size: 13px;">
                Artist Lab Studio - Formation professionnelle en cinéma et IA
              </p>
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #374151;">
                <p style="color: #6B7280; margin: 0; font-size: 12px;">
                  Cet email de test a été envoyé automatiquement pour vérifier la configuration SMTP.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    console.log('Sending test email...');
    console.log('From:', mailOptions.from);
    console.log('To:', mailOptions.to);
    console.log('Subject:', mailOptions.subject);
    
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ TEST EMAIL SENT SUCCESSFULLY!');
    console.log('Message ID:', result.messageId);
    console.log('Response:', result.response);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Test email sent successfully to laurent.bellandi@me.com',
      messageId: result.messageId,
      timestamp: new Date().toISOString(),
      recipient: testRegistrationData.email,
      smtpUser: smtpUser
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('❌ TEST EMAIL FAILED:');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to send test email. Check SMTP configuration.',
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});