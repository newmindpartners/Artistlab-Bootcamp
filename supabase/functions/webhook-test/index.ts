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
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    const envStatus = {
      STRIPE_SECRET_KEY: stripeSecret ? '✅ Set' : '❌ Missing',
      STRIPE_WEBHOOK_SECRET: stripeWebhookSecret ? '✅ Set' : '❌ Missing',
      RESEND_API_KEY: resendApiKey ? '✅ Set' : '❌ Missing',
      SUPABASE_URL: supabaseUrl ? '✅ Set' : '❌ Missing',
      SUPABASE_SERVICE_ROLE_KEY: supabaseServiceKey ? '✅ Set' : '❌ Missing'
    };
    
    console.log('Environment variables status:', envStatus);
    
    // Test Resend API if key is available
    let emailTestResult = null;
    if (resendApiKey) {
      try {
        console.log('Testing Resend API...');
        const testEmailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Artist Lab CAMPUS <onboarding@resend.dev>',
            to: ['test@example.com'], // This will fail but we can see the error
            subject: 'Test Email from Webhook',
            html: '<h1>Test Email</h1><p>This is a test email from the webhook function.</p>',
          }),
        });
        
        const responseText = await testEmailResponse.text();
        emailTestResult = {
          status: testEmailResponse.status,
          response: responseText
        };
        
        console.log('Resend API test result:', emailTestResult);
      } catch (error) {
        emailTestResult = {
          error: error.message
        };
        console.error('Resend API test failed:', error);
      }
    }
    
    const result = {
      timestamp: new Date().toISOString(),
      environment: envStatus,
      emailTest: emailTestResult,
      message: 'Webhook test completed'
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