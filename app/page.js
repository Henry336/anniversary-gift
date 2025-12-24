'use client';

import { useRouter } from 'next/navigation';
import { Playfair_Display } from 'next/font/google';

// ==============================================================================
// ⚙️ CONFIGURATION: EDIT THIS SECTION ONLY
// ==============================================================================
const CONFIG = {
  // Where does the secret button take you?
  redirectRoute: '/starry-login', 

  // The Big Title (Use <br/> to force a new line)
  title: "Happy <br/> Anniversary!",

  // The 3 Polaroid Photos
  photo1: {
    path: "/photos/nus-2.png",  // Make sure this file exists in public/photos/
    caption: "me"
  },
  photo2: {
    path: "/photos/date-1-2.png",
    caption: "Our First Date: The Brew ❤️" 
  },
  photo3: {
    path: "/photos/nus-3.png",
    caption: "Today ✨"
  },

  // The Secret Button (Bottom Center)
  secretButtonColor: "bg-pink-200/50", // Makes it blend in slightly
  secretButtonHover: "hover:bg-pink-300"
};
// ==============================================================================
// END OF CONFIGURATION
// ==============================================================================

const playfair = Playfair_Display({ subsets: ['latin'] });

export default function LandingPage() {
  const router = useRouter();

  const handleSecretClick = () => {
    router.push(CONFIG.redirectRoute);
  };

  return (
    <div className={`min-h-screen bg-pink-100 flex flex-col items-center pt-20 pb-4 relative overflow-hidden ${playfair.className}`}>
      
      {/* --- 1. The Very Big Title --- */}
      {/* dangerouslySetInnerHTML allows the <br/> tag in the config to work */}
      <h1 
        className="text-5xl md:text-8xl font-extrabold text-pink-500 drop-shadow-sm text-center animate-bounce mb-12"
        dangerouslySetInnerHTML={{ __html: CONFIG.title }}
      />

      {/* --- 2. The 3 Pictures (Polaroid Style) --- */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center justify-center z-10 px-4">
        
        {/* Picture 1 (Tilted Left) */}
        <div className="w-64 h-80 bg-white p-3 shadow-xl transform -rotate-3 hover:scale-105 transition-transform duration-300">
          <div className="w-full h-64 bg-gray-200 mb-2 overflow-hidden border border-gray-100">
             <img src={CONFIG.photo1.path} alt="Memory 1" className="w-full h-full object-cover" />
          </div>
          <p className="text-center text-gray-500 font-bold text-lg">{CONFIG.photo1.caption}</p>
        </div>

        {/* Picture 2 (Tilted Right) */}
        <div className="w-64 h-80 bg-white p-3 shadow-xl transform rotate-2 relative md:-top-8 hover:scale-105 transition-transform duration-300">
          <div className="w-full h-64 bg-gray-200 mb-2 overflow-hidden border border-gray-100">
             <img src={CONFIG.photo2.path} alt="Memory 2" className="w-full h-full object-cover" />
          </div>
          <p className="text-center text-gray-500 font-bold text-lg">{CONFIG.photo2.caption}</p>
        </div>

        {/* Picture 3 (Tilted Left Again) */}
        <div className="w-64 h-80 bg-white p-3 shadow-xl transform -rotate-2 hover:scale-105 transition-transform duration-300">
          <div className="w-full h-64 bg-gray-200 mb-2 overflow-hidden border border-gray-100">
             <img src={CONFIG.photo3.path} alt="Memory 3" className="w-full h-full object-cover" />
          </div>
          <p className="text-center text-gray-500 font-bold text-lg">{CONFIG.photo3.caption}</p>
        </div>

      </div>

      {/* --- 3. The Secret Button --- */}
      <div className="mt-auto w-full flex justify-center items-end pb-2 opacity-100">
        <button
          onClick={handleSecretClick}
          className={`w-16 h-16 ${CONFIG.secretButtonColor} ${CONFIG.secretButtonHover} rounded-lg transition-colors duration-500 cursor-pointer`}
          aria-label="Secret entry"
        >
        </button>
      </div>

    </div>
  );
}