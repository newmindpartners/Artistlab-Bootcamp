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
    const mailgunApiKey = Deno.env.get('MAILGUN_API_KEY');
    const mailgunDomain = Deno.env.get('MAILGUN_DOMAIN');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    const envStatus = {
      STRIPE_SECRET_KEY: stripeSecret ? '✅ Set' : '❌ Missing',
      STRIPE_WEBHOOK_SECRET: stripeWebhookSecret ? '✅ Set' : '❌ Missing',
      MAILGUN_API_KEY: mailgunApiKey ? '✅ Set' : '❌ Missing',
      MAILGUN_DOMAIN: mailgunDomain ? '✅ Set' : '❌ Missing',
      SUPABASE_URL: supabaseUrl ? '✅ Set' : '❌ Missing',
      SUPABASE_SERVICE_ROLE_KEY: supabaseServiceKey ? '✅ Set' : '❌ Missing'
    };
    
    console.log('Environment variables status:', envStatus);
    
    // Test Mailgun API if credentials are available
    let emailTestResult = null;
    if (mailgunApiKey && mailgunDomain) {
      try {
        console.log('Testing Mailgun API...');
        
        // Create form data for Mailgun API
        const formData = new FormData();
        formData.append('from', `Artist Lab CAMPUS Test <noreply@${mailgunDomain}>`);
        formData.append('to', 'test@example.com'); // This will fail but we can see the error
        formData.append('subject', 'Test Email from Webhook');
        formData.append('html', '<h1>Test Email</h1><p>This is a test email from the webhook function using Mailgun.</p>');
        formData.append('o:tag', 'webhook_test');
        
        const testEmailResponse = await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`api:${mailgunApiKey}`)}`,
          },
          body: formData,
        });
        
        const responseText = await testEmailResponse.text();
        emailTestResult = {
          status: testEmailResponse.status,
          response: responseText,
          service: 'Mailgun'
        };
        
        console.log('Mailgun API test result:', emailTestResult);
      } catch (error) {
        emailTestResult = {
          error: error.message,
          service: 'Mailgun'
        };
        console.error('Mailgun API test failed:', error);
      }
    } else {
      emailTestResult = {
        error: 'Mailgun credentials not configured',
        service: 'Mailgun'
      };
    }
    
    const result = {
      timestamp: new Date().toISOString(),
      environment: envStatus,
      emailTest: emailTestResult,
      message: 'Webhook test completed with Mailgun configuration'
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