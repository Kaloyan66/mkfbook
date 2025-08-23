import React from 'react';
import { Link } from 'react-router-dom';

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 flex items-center justify-center min-h-screen">
        <div className="max-w-2xl w-full text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Main Message */}
          <div className="bg-gray-800/50 p-8 md:p-12 rounded-lg ring-2 ring-[#FFD700]/20 shadow-[0_0_15px_rgba(255,215,0,0.1)] mb-8">
            <h1 className="text-3xl md:text-4xl font-bold golden-text mb-6 leading-tight">
             Your order was successful!
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
             You’ll receive the e-book by email within 10 minutes.
            </p>
          </div>

          {/* Additional Info */}
          <div className="text-gray-400 mb-8">
            <p className="mb-2">Please check your inbox (including the spam folder)</p>
            <p>If you have any questions, feel free to contact us</p>
          </div>

          {/* Back to Home Button */}
          <Link
            to="/"
            className="inline-block bg-[#FFD700] hover:bg-[#E5C100] text-gray-900 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 buy-button"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}