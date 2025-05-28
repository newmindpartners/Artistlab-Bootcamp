import nodemailer from 'npm:nodemailer@6.9.9';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface FormData {
  nom: string;
  prenom: string;
  date: string;
  email: string;
}

// Location and date mapping
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const formData: FormData = await req.json();
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

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});