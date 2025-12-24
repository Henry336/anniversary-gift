'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });

export default function UnlockPage() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const router = useRouter();

  // 👇 SET YOUR SECRET CODE HERE
  const SECRET_CODE = "272006"; // Example: Your anniversary date? Or "2025"?

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (passcode === SECRET_CODE) {
      // Success! Go to the hub
      router.push('/plans');
    } else {
      // Wrong code
      setError("Now's not the time yet! 🤫");
      setIsShaking(true);
      setPasscode('');
      
      // Stop shaking after animation
      setTimeout(() => setIsShaking(false), 500);
      // Clear error message after 3 seconds
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className={`min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center ${playfair.className}`}>
      
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-900/20 via-black to-black -z-10" />

      <div className="max-w-md w-full animate-fade-in-up">
        <div className="mb-8 text-6xl">🔒</div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          One Last Surprise...
        </h1>
        
        <p className="text-rose-200/60 mb-8 text-sm tracking-widest leading-relaxed">
          The journey isn't over yet.<br/>
          But the key to this door arrives tomorrow morning.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text" // 'password' if you want to hide dots, 'text' if you want her to see what she types
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Enter the Passcode"
            className={`bg-white/10 border border-white/20 rounded-full px-6 py-4 text-center text-white text-xl tracking-widest placeholder-white/20 focus:outline-none focus:border-rose-500 transition-all ${isShaking ? 'animate-shake border-red-500 text-red-300' : ''}`}
          />
          
          <button 
            type="submit"
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-full shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-all hover:scale-105 active:scale-95"
          >
            UNLOCK
          </button>
        </form>

        {/* Error Message Area */}
        <div className="h-8 mt-4">
          {error && (
            <p className="text-red-400 text-sm font-medium tracking-wide animate-pulse">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Shake Animation Style */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}