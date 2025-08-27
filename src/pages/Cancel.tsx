import React from 'react';
import { Link } from 'react-router-dom';

export default function Cancel() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-gray-800 p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Payment canceled</h2>
        <p className="text-gray-300 mb-8">
          Don't worry—nothing has been charged. You can try again when you're ready.
        </p>
        <Link to="/" className="inline-block bg-[#FFD700] hover:bg-[#E5C100] text-gray-900 font-bold py-3 px-6 rounded-lg transition">
          Back to home page
        </Link>
      </div>
    </div>
  );
}
