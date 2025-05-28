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

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-confirmation`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to send confirmation email');
  }

  return response.json();
}