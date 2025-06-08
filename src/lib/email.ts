interface FormData {
  nom: string;
  prenom: string;
  email: string;
  date: string;
}

export async function sendConfirmationEmail(to: string, formData: FormData) {
  const token = localStorage.getItem('sb-token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    console.log('Sending confirmation email to:', to);
    
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-confirmation`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(30000)
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Email service error response:', error);
      throw new Error(error.message || 'Failed to send confirmation email');
    }

    const result = await response.json();
    console.log('Confirmation email sent successfully');
    return result;
  } catch (error: any) {
    console.error('Email sending failed:', error);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your internet connection and try again.');
    }
    
    if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
      throw new Error('Unable to connect to the email service. Please check your internet connection and try again.');
    }
    
    throw error;
  }
}