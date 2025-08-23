import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Success() {
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setError('Invalid session');
      setIsVerifying(false);
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        const { data: payment, error: dbError } = await supabase
          .from('payments')
          .select('payment_status')
          .eq('stripe_session_id', sessionId)
          .single();

        if (dbError || !payment) {
          throw new Error('Payment verification failed');
        }

        if (payment.payment_status !== 'completed') {
          throw new Error('Payment not completed');
        }

        setIsVerifying(false);
      } catch (err) {
        setError(err.message);
        setIsVerifying(false);
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-lg text-center">
          <p className="text-white">Verifying payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Payment Error
          </h2>
          <p className="text-red-400 mb-8">{error}</p>
          <Link
            to="/"
            className="inline-block bg-[#FFD700] hover:bg-[#E5C100] text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-lg text-center">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">
          Благодарим за поръчката!
        </h2>
        
        <p className="text-gray-300 mb-8">
          Вашата поръчка е успешно обработена. Скоро ще получите имейл с повече информация.
        </p>

        <Link
          to="/"
          className="inline-block bg-[#FFD700] hover:bg-[#E5C100] text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Обратно към началната страница
        </Link>
      </div>
    </div>
  );
}