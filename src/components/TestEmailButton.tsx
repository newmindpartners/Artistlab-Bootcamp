import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const TestEmailButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const sendTestEmail = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/test-email-send`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: `Test email sent successfully! Message ID: ${data.messageId}`
        });
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to send test email'
        });
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: `Network error: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
        <h3 className="text-white font-semibold mb-3 flex items-center">
          <Mail className="h-4 w-4 mr-2" />
          Test Email
        </h3>
        
        <button
          onClick={sendTestEmail}
          disabled={loading}
          className={`w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all ${
            loading
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4 mr-2" />
              Send Test to Laurent
            </>
          )}
        </button>

        {result && (
          <div className={`mt-3 p-3 rounded-lg flex items-start ${
            result.success 
              ? 'bg-green-500/20 border border-green-500/30' 
              : 'bg-red-500/20 border border-red-500/30'
          }`}>
            {result.success ? (
              <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            )}
            <p className={`text-sm ${result.success ? 'text-green-300' : 'text-red-300'}`}>
              {result.message}
            </p>
          </div>
        )}

        <p className="text-xs text-white/60 mt-2">
          This will send a test confirmation email to laurent.bellandi@me.com
        </p>
      </div>
    </div>
  );
};

export default TestEmailButton;