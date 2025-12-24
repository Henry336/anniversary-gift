'use client';

import { useRouter } from 'next/navigation';
import { Playfair_Display } from 'next/font/google';

// ==============================================================================
// ⚙️ CONFIGURATION
// ==============================================================================
const CONFIG = {
  // Where does the secret button go? (To the image/glitch page)
  redirectRoute: '/glitch', 

  // Visuals (Keep these same as your real login to fool her)
  title: "The Archive",
  subtitle: "1 Year Anniversary",
  placeholder: "• • • • • •", 
  buttonText: "Open Vault",
  footer: "HEIN LIN HTET ❤️ EAINT HMUE NGE"
};

const playfair = Playfair_Display({ subsets: ['latin'] });

export default function BrokenHome() {
  const router = useRouter();

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#2e1065] to-black text-white relative overflow-hidden ${playfair.className}`}>
      
      {/* STARS (Static or simple animation to look like it loaded) */}
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="absolute top-1/4 left-1/4 w-1 bg-white h-1 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 left-1/3 w-1 bg-white h-1 rounded-full animate-ping delay-700"></div>
        <div className="absolute top-1/2 left-2/3 w-1 bg-white h-1 rounded-full animate-ping delay-300"></div>
      </div>

      {/* SECRET BUTTON: TOP RIGHT */}
      <button 
        onClick={() => router.push(CONFIG.redirectRoute)}
        className="absolute top-0 right-0 w-24 h-24 z-50 bg-transparent hover:bg-white/5 transition-colors cursor-default"
      ></button>

      {/* --- THE "BROKEN" LOGIN BOX --- */}
      <div className="z-10 w-full max-w-md p-8 mx-4 opacity-80 pointer-events-none select-none">
        <div className="bg-white/5 backdrop-blur-md rounded-[3rem] shadow-[0_0_80px_rgba(139,92,246,0.15)] border border-white/10 p-10 text-center relative">
          
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-white to-violet-200 drop-shadow-sm tracking-wide">
              {CONFIG.title}
            </h1>
            <p className="text-purple-200/80 mb-10 text-sm tracking-[0.2em] uppercase font-sans">
              {CONFIG.subtitle}
            </p>
            
            <div className="flex flex-col gap-6 items-center">
              <div className="relative w-full">
                {/* DISABLED INPUT */}
                <input 
                  type="text" 
                  disabled
                  placeholder={CONFIG.placeholder}
                  className="w-full bg-transparent border-b-2 border-white/20 py-3 text-center text-3xl tracking-[0.5em] text-white/50 placeholder-white/30 cursor-not-allowed font-sans"
                />
              </div>
              {/* DISABLED BUTTON */}
              <button 
                disabled
                className="mt-4 px-10 py-3 bg-white/50 text-purple-950/50 rounded-full font-bold cursor-not-allowed shadow-none"
              >
                {CONFIG.buttonText}
              </button>
            </div>
          </div>
        </div>
        <p className="text-center text-white/30 text-xs mt-8 tracking-widest font-sans">
          {CONFIG.footer}
        </p>
      </div>
    </div>
  );
}