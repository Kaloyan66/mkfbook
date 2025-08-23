import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import { createCheckoutSession } from './lib/stripe';
import { products } from './stripe-config';
import cover from '../assets/image.png';

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Scroll reveal functionality
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Create intersection observer for scroll reveals
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe all scroll-reveal elements
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    scrollElements.forEach((el) => {
      observerRef.current?.observe(el);
    });

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Preload the book cover image
  React.useEffect(() => {
    const img = new Image();
    img.src =
      'https://stackblitz.com/storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCQTZhZ1FFPSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--42a126ba227dcd6c7b9498f0bf38098224e5c2a0/cover.png';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createCheckoutSession(
        products['Mein Kampf'].priceId,
        'payment',
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        }
      );
    } catch (error) {
      console.error('Checkout error:', error);
      setError(
        'Възникна грешка при обработката на плащането. Моля, опитайте отново.'
      );
      setIsLoading(false);
    }
  };

  return (
      <>
        {/* Global background layer (зад всичко) */}
        <div className="fixed inset-0 -z-10 bg-[#0B1120]" />
        {/* Main wrapper без фон */}
        <div className="min-h-screen text-white">    
      {/* Top Headline */}
      {/* Top Headline */}
<div className="container mx-auto px-4 pt-10 pb-4">
  <div className="text-center">
    <h1 className="golden-text text-5xl md:text-6xl font-bold leading-none tracking-wide animate-fade-up">
      MEIN KAMPF
    </h1>
    <div className="mx-auto mt-3 h-[2px] w-24 md:w-28 bg-[#FFD700]/50 rounded mb-8 animate-fade-up"></div>
  </div>
</div>

      {/* Main Content Grid */}
      <div className="container mx-auto px-4 pb-2 md:pb-16">
      <div className="grid md:grid-cols-2 gap-12 items-start lg:items-end max-w-5xl mx-auto mb-3">
          {/* Left Column - Info Block */}
          <div className="bg-gray-800/50 p-6 md:p-8 md:pb-12 rounded-lg ring-2 ring-[#FFD700]/20 shadow-[0_0_15px_rgba(255,215,0,0.1)] flex flex-col animate-fade-up-delay-1">
          <h2 className="text-xl sm:text-2xl font-bold text-center golden-text mb-8 leading-snug tracking-tight">
          <span className="block text-[22px] sm:text-[26px] md:text-[28px]">
              THE REVOLUTION HAS BEGUN —
              </span>
          <span className="block text-[22px] sm:text-[26px] md:text-[28px]">
              AND IT CANNOT BE STOPPED
              </span>
            </h2>
            <div className="flex-1 flex flex-col justify-between space-y-2">
              <div className="space-y-6">
                <p className="text-xl text-center italic leading-relaxed">
                  We are living in a time that will be remembered for
                  generations.
                  <br />
                  The code of the system has cracked, and the truth is finally
                  coming out.
                </p>
                <ul className="space-y-5 text-left max-w-3xl mx-auto mb-10">
                  <li className="flex items-start">
                    <span className="text-[#FFD700] mr-2">•</span>
                    Within half a year, hundreds of millions of people across the globe started to realize what’s truly happening.
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FFD700] mr-2">•</span>
                    <span className="flex-1">
                    Thanks to the ignorance of the elite, the world is about to experience the{' '}
                    <span className="golden-text font-semibold">GREATEST REVOLUTION IN HISTORY</span>.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FFD700] mr-2">•</span>
                    <span className="flex-1">
                    This is not a national revolution. THIS IS A{' '}
                    <span className="golden-text font-semibold">GLOBAL REVOLUTION</span>.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FFD700] mr-2">•</span>
                    A generation is rising that refuses to be silenced, misled, or controlled.
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#FFD700] mr-2">•</span>
                  <span className="flex-1">
                    Let them call us whatever they want.{' '}
                    <span className="golden-text font-semibold">BUT NEVER LIARS!</span>
                    </span>
                  </li>
                </ul>
              </div>
              <p className="text-2xl md:text-2xl font-bold golden-text text-center mt-auto pt-4 mb-2 md:mb-0 tracking-tight">
               THE TIME TO ACT IS NOW
             </p>
            </div>
          </div>

          {/* Right Column - Book Cover */}
          <div className="flex justify-center order-2 md:order-none lg:self-center lg:my-2 animate-fade-up-delay-2">
           <img
            src={cover}
            alt="Book Cover"
            className="w-full h-auto max-w-md rounded-lg shadow-[0_0_15px_rgba(255,215,0,0.1)] hover-image"
            />
          </div>
        </div>
        </div> {/* затваря grid-а */}
        <div className="max-w-5xl mx-auto px-4 md:px-0 mb-10 mt-6 md:mt-0">
          {/* Third Wide Block – single column content */}
          <div className="bg-gray-800/50 p-7 md:p-10 rounded-lg ring-2 ring-[#FFD700]/20 shadow-[0_0_15px_rgba(255,215,0,0.1)] space-y-8 md:space-y-10 scroll-reveal">
  {/* What you’ll learn */}
  <div>
  <h3 className="text-2xl md:text-2xl font-bold golden-text text-center mb-3">
      What you’ll learn
    </h3>
    <p className="text-gray-200 text-lg md:text-xl leading-8 md:leading-9 text-left max-w-3xl md:max-w-3xl mx-auto">
      Step directly into the mind of Adolf Hitler and uncover the true side of the man who changed the course of history. This first-person account reveals his worldview – from his childhood and the First World War, through the beginnings of his political struggle, to his ideas about society and the world. This is your chance to see Hitler as history has <span className="golden-text font-semibold">NEVER</span> shown him before. You will discover the real motives behind his actions, what politics truly mean, and who ultimately defines the rules – without filters, without lies, straight from the source. You will understand why this book was the key to the <span className="golden-text font-semibold">CREATION</span> of the Third Reich.
    </p>
  </div>
  <div className="h-px bg-[#FFD700]/20 my-4 md:my-6"></div>
  {/* How this edition was revived */}
  <div>
  <h3 className="text-2xl md:text-2xl font-bold golden-text text-center mb-3">
      How this edition was revived
    </h3>
    <p className="text-gray-200 text-lg md:text-xl leading-8 md:leading-9 text-left max-w-3xl md:max-w-3xl mx-auto">
      My team and I set out on a mission to bring this book back to life. We spent extensive time searching through a wide range of sources to produce a fully authentic English translation, remaining as true to the original as possible. 
      This is the only official edition supported by verified evidence – including archived manuscripts, personal notes, and historical documents preserved in major international archives. 
      We stand for <span className="golden-text font-semibold">FREEDOM</span> and <span className="golden-text font-semibold">TRUTH</span>, even when these values are inconvenient for some. We overcame great obstacles to make this book a reality.
    </p>
  </div>

</div>

        {/* Form Section - Centered Below */}
        <div className="mt-10 flex justify-center px-4">
          <div className="w-full max-w-lg">
          <div className="w-full max-w-xl mx-auto bg-gray-800/50 p-6 md:p-8 rounded-lg ring-2 ring-[#FFD700]/20 shadow-[0_0_15px_rgba(255,215,0,0.1)] space-y-5 scroll-reveal">
            <div className="text-center">
            <h3 className="text-2xl font-bold golden-text mb-1 md:mb-2">Get Mein Kampf</h3>
            <p className="text-sm opacity-80">E-book (PDF), received by email after purchase</p>
          </div>
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#FFD700] hover:bg-[#E5C100] text-gray-900 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 buy-button"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span>
                      Buy now –{' '}
                      <span className="line-through opacity-75">25$</span> 10$
                    </span>
                  )}
                </button>   
                <p className="text-xs text-center opacity-80">
                🔒 Secure Stripe Checkout • 📩 Email Delivery • 📄 PDF Download
                </p>            
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default App;
