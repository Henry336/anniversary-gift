'use client';

import { useRouter } from 'next/navigation';

// ==============================================================================
// ⚙️ CONFIGURATION
// ==============================================================================
const CONFIG = {
  // Where does the top-left secret button go? (To the silly apology page)
  redirectRoute: '/silly', 

  // The Image to display in the middle
  // You can use a funny "Server Error" meme or a cute photo here
  imagePath: "/photos/error.png", 

  // Secret Button (Top Left)
  secretButtonColor: "bg-transparent", 
  secretButtonHover: "hover:bg-white/5"
};

export default function GlitchPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      
      {/* THE IMAGE */}
      <div className="relative w-full max-w-lg p-4 animate-pulse">
        <img 
          src={CONFIG.imagePath} 
          alt="System Glitch" 
          className="w-full h-auto rounded-lg shadow-[0_0_50px_rgba(255,255,255,0.1)]"
        />
      </div>

      {/* SECRET BUTTON: TOP LEFT */}
      <button
        onClick={() => router.push(CONFIG.redirectRoute)}
        className={`absolute top-0 left-0 w-20 h-20 ${CONFIG.secretButtonColor} ${CONFIG.secretButtonHover} z-50 cursor-default`}
        aria-label="Secret Path"
      />
    </div>
  );
}