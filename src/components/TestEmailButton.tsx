import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

const TestEmailButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testEmail = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/test-email-confirmation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prenom: 'Test',
            nom: 'User',
            email: 'test@artistlab.studio', // Change this to your email
            date: 'paris'
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send test email');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
        <button
          onClick={testEmail}
          disabled={loading}
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <Mail className="h-4 w-4" />
          {loading ? 'Sending...' : 'Test Email'}
        </button>

        {result && (
          <div className="mt-3 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle className="h-4 w-4" />
              Email sent successfully!
            </div>
            <div className="text-xs text-green-300 mt-1">
              Email ID: {result.result?.id}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="h-4 w-4" />
              Error: {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestEmailButton;