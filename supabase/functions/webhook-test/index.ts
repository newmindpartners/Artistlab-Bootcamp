const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log('=== WEBHOOK TEST FUNCTION ===');
    console.log('Testing environment variables...');
    
    // Test environment variables
    const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');
    const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    const mailgunDomain = Deno.env.get('MAILGUN_DOMAIN');
    const mailgunSmtpUser = Deno.env.get('MAILGUN_SMTP_USER');
    const mailgunSmtpPassword = Deno.env.get('MAILGUN_SMTP_PASSWORD');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    const envStatus = {
      STRIPE_SECRET_KEY: stripeSecret ? '✅ Set' : '❌ Missing',
      STRIPE_WEBHOOK_SECRET: stripeWebhookSecret ? '✅ Set' : '❌ Missing',
      MAILGUN_DOMAIN: mailgunDomain ? `✅ Set (${mailgunDomain})` : '❌ Missing',
      MAILGUN_SMTP_USER: mailgunSmtpUser ? `✅ Set (${mailgunSmtpUser})` : '❌ Missing',
      MAILGUN_SMTP_PASSWORD: mailgunSmtpPassword ? '✅ Set' : '❌ Missing',
      SUPABASE_URL: supabaseUrl ? '✅ Set' : '❌ Missing',
      SUPABASE_SERVICE_ROLE_KEY: supabaseServiceKey ? '✅ Set' : '❌ Missing'
    };
    
    console.log('Environment variables status:', envStatus);
    
    // Test Mailgun SMTP if credentials are available
    let emailTestResult = null;
    if (mailgunDomain && mailgunSmtpUser && mailgunSmtpPassword) {
      try {
        console.log('Testing Mailgun SMTP API...');
        
        // Create form data for Mailgun API using SMTP credentials
        const formData = new FormData();
        formData.append('from', `Artist Lab CAMPUS Test <noreply@${mailgunDomain}>`);
        formData.append('to', 'test@example.com'); // This will fail but we can see the error
        formData.append('subject', 'Test Email from Webhook via SMTP');
        formData.append('html', '<h1>Test Email</h1><p>This is a test email from the webhook function using Mailgun SMTP credentials.</p>');
        formData.append('o:tag', 'webhook_test');
        formData.append('o:tag', 'smtp_test');
        
        const testEmailResponse = await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`api:${mailgunSmtpPassword}`)}`, // Use SMTP password as API key
          },
          body: formData,
        });
        
        const responseText = await testEmailResponse.text();
        emailTestResult = {
          status: testEmailResponse.status,
          response: responseText,
          service: 'Mailgun SMTP',
          smtpUser: mailgunSmtpUser,
          domain: mailgunDomain
        };
        
        console.log('Mailgun SMTP API test result:', emailTestResult);
      } catch (error) {
        emailTestResult = {
          error: error.message,
          service: 'Mailgun SMTP',
          smtpUser: mailgunSmtpUser,
          domain: mailgunDomain
        };
        console.error('Mailgun SMTP API test failed:', error);
      }
    } else {
      emailTestResult = {
        error: 'Mailgun SMTP credentials not configured',
        service: 'Mailgun SMTP',
        required: [
          'MAILGUN_DOMAIN',
          'MAILGUN_SMTP_USER (should be postmaster@YOUR_DOMAIN)',
          'MAILGUN_SMTP_PASSWORD (your SMTP password from Mailgun)'
        ]
      };
    }
    
    const result = {
      timestamp: new Date().toISOString(),
      environment: envStatus,
      emailTest: emailTestResult,
      message: 'Webhook test completed with Mailgun SMTP configuration',
      instructions: {
        setup: [
          '1. Get your Mailgun domain from https://app.mailgun.com/app/domains',
          '2. Set MAILGUN_DOMAIN to your domain (e.g., mg.yourdomain.com)',
          '3. Set MAILGUN_SMTP_USER to postmaster@YOUR_DOMAIN',
          '4. Set MAILGUN_SMTP_PASSWORD to your SMTP password from Mailgun dashboard',
          '5. Verify your domain in Mailgun and add DNS records'
        ],
        equivalent_swaks_command: mailgunDomain && mailgunSmtpUser && mailgunSmtpPassword ? 
          `./swaks --auth --server smtp.eu.mailgun.org --au ${mailgunSmtpUser} --ap ${mailgunSmtpPassword} --to recipient@example.com --h-Subject: "Hello" --body 'Testing Mailgun SMTP!'` :
          'Configure environment variables first'
      }
    };

    return new Response(JSON.stringify(result, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Webhook test error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});