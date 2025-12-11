'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });

// ==============================================================================
// 🛠️ EDIT YOUR LOGIN SCREEN TEXT HERE
// ==============================================================================
const TEXT_CONFIG = {
  title: "The Archive",
  subtitle: "1 Year Anniversary",
  placeholder: "• • • • • •", 
  buttonButton: "Open Vault",
  footer: "HEIN LIN HTET ❤️ EAINT HMUE NGE",  

  // Secrets
  correctCode: "251225", 
  hintCode: "251224",    

  // Popups
  errorTitle: "Locked",
  errorMessage: "That key doesn't fit.",
  hintTitle: "Almost...",
  hintMessage: "That was the beginning. Turn the page by one chapter!",
  tryAgainButton: "Try Again"
};

export default function Home() {
  const [inputCode, setInputCode] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorType, setErrorType] = useState('wrong'); 
  const [stars, setStars] = useState([]); 
  const router = useRouter();

  // Generate stars on client-side
  useEffect(() => {
    // INCREASED COUNT: 150 stars for a denser field
    const generatedStars = Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1, 
      // FASTER ANIMATION: Random speed between 2s and 5s
      animationDuration: `${Math.random() * 3 + 2}s`, 
      animationDelay: `${Math.random() * 5}s`
    }));
    setStars(generatedStars);
  }, []);

  const handleUnlock = (e) => {
    e.preventDefault(); 
    if (inputCode === TEXT_CONFIG.correctCode) {
      router.push('/map'); 
    } 
    else if (inputCode === TEXT_CONFIG.hintCode) {
      setErrorType('hint');
      setShowError(true);
      setInputCode('');
    } 
    else {
      setErrorType('wrong');
      setShowError(true);
      setInputCode(''); 
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#2e1065] to-black text-white relative overflow-hidden ${playfair.className}`}>
      
      {/* --- CUSTOM CSS FOR TWINKLING --- */}
      <style jsx>{`
        @keyframes twinkle {
          /* Start small and dim */
          0%, 100% { 
            transform: scale(0.8); 
            opacity: 0.3; 
            box-shadow: none; 
          }
          /* Grow BIG and GLOWING at 50% */
          50% { 
            transform: scale(2.5); 
            opacity: 1; 
            box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.8); 
          }
        }
        .star-twinkle {
          animation-name: twinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>

      {/* STARS LAYER */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {stars.map((star) => (
          <div 
            key={star.id}
            className="absolute bg-white rounded-full star-twinkle"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDuration: star.animationDuration,
              animationDelay: star.animationDelay
            }}
          />
        ))}
      </div>

      {/* ERROR MODAL */}
      {showError && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-md transition-all duration-500">
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4 text-center border border-white/20">
            {errorType === 'hint' ? (
              <>
                <div className="text-4xl mb-4">⏳</div>
                <h3 className="text-2xl font-bold text-white mb-2 italic">{TEXT_CONFIG.hintTitle}</h3>
                <p className="text-purple-200 mb-6 font-light">{TEXT_CONFIG.hintMessage}</p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-2xl font-bold text-white mb-2 italic">{TEXT_CONFIG.errorTitle}</h3>
                <p className="text-purple-200 mb-6 font-light">{TEXT_CONFIG.errorMessage}</p>
              </>
            )}
            <button 
              onClick={() => setShowError(false)}
              className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/40 font-bold py-3 rounded-xl transition-all"
            >
              {TEXT_CONFIG.tryAgainButton}
            </button>
          </div>
        </div>
      )}

      {/* --- THE DREAMY LOGIN BOX --- */}
      <div className="z-10 w-full max-w-md p-8 mx-4">
        
        {/* Floating Glass Container */}
        <div className="bg-white/5 backdrop-blur-md rounded-[3rem] shadow-[0_0_80px_rgba(139,92,246,0.15)] border border-white/10 p-10 text-center relative group hover:bg-white/10 transition-colors duration-500">
          
          {/* Subtle Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-violet-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-white to-violet-200 drop-shadow-sm tracking-wide">
              {TEXT_CONFIG.title}
            </h1>
            
            <p className="text-purple-200/80 mb-10 text-sm tracking-[0.2em] uppercase font-sans">
              {TEXT_CONFIG.subtitle}
            </p>

            <form onSubmit={handleUnlock} className="flex flex-col gap-6 items-center">
              
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder={TEXT_CONFIG.placeholder}
                  className="w-full bg-transparent border-b-2 border-white/20 py-3 text-center text-3xl tracking-[0.5em] text-white placeholder-white/10 focus:outline-none focus:border-rose-400 transition-colors font-sans"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                />
              </div>
              
              <button 
                type="submit" 
                className="mt-4 px-10 py-3 bg-white text-purple-950 rounded-full font-bold hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                {TEXT_CONFIG.buttonButton}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-8 tracking-widest font-sans">
          {TEXT_CONFIG.footer}
        </p>

      </div>
    </div>
  );
}