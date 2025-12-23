'use client';
import { useState, useEffect } from 'react';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });

// ==============================================================================
// 🛠️ CUSTOMIZE YOUR ANNIVERSARY PLANS HERE
// ==============================================================================
const PLAN_DATA = [
  {
    icon: "🍫",
    title: "The Snack Sync",
    description: "We open our care packages together. 3, 2, 1, bite! No cheating."
  },
  {
    icon: "🗺️",
    title: "Memory Lane",
    description: "You just finished this! A walk through our 10 chapters. (Completed ✅)"
  },
  {
    icon: "🍜",
    title: "Dinner: Buldak Noodles!",
    description: "Spicy noodle challenge together! Get your milk ready, let's see who handles the heat better."
  },
  {
    icon: "🌍",
    title: "Future Tour (Google Earth)",
    description: "I'll screen-share and we'll walk through the streets of the cities we want to visit."
  },
  {
    icon: "🍿",
    title: "Film Festival",
    description: "Cozy time. We hit play on 'Our Movie' at the exact same second."
  },
  {
    icon: "📹",
    title: "Video Calling",
    description: "Just talking, laughing, and looking at your pretty face. The best part of my day."
  },
  {
    icon: "📝",
    title: "The Bucket List",
    description: "We write down 3 places we MUST go when I visit you next."
  }
];

// Optional: Background music for this page (Uplifting track)
const MUSIC_URL = "/music/perfect-cover.mp3"; 
// ==============================================================================

export default function Plans() {
  const [stars, setStars] = useState([]);

  // Star generation (Same dreamy background)
  useEffect(() => {
    const generatedStars = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 5}s`
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className={`min-h-screen w-full bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#2e1065] to-black text-white relative overflow-hidden ${playfair.className}`}>
      
      {/* BACKGROUND MUSIC */}
      <audio autoPlay loop src={MUSIC_URL} />

      {/* STARS LAYER */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {stars.map((star) => (
          <div 
            key={star.id}
            className="absolute bg-white rounded-full animate-pulse"
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

      {/* CONTENT CONTAINER */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-20">
        
        {/* HEADER */}
        <div className="text-center mb-16 animate-fade-in-down">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-white to-violet-200 drop-shadow-sm">
            The Grand Plan
          </h1>
          <p className="text-purple-200/80 text-sm tracking-[0.3em] uppercase font-sans">
            OUR ANNIVERSARY ITINERARY
          </p>
        </div>

        {/* TIMELINE LIST */}
        <div className="flex flex-col gap-6">
          {PLAN_DATA.map((plan, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-6 transform hover:scale-105 transition-all duration-300 hover:bg-white/10 group opacity-0 animate-drop-in"
              style={{ 
                animationDelay: `${index * 0.2}s`, // Staggered delay
                animationFillMode: 'forwards'      // Keep opacity 1 after animation
              }}
            >
              {/* ICON BUBBLE */}
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-3xl shadow-inner group-hover:bg-white/20 transition-colors shrink-0">
                {plan.icon}
              </div>

              {/* TEXT */}
              <div>
                <h3 className="text-xl font-bold text-rose-100 mb-1">{plan.title}</h3>
                <p className="text-gray-300 text-sm font-sans font-light leading-relaxed">
                  {plan.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER MESSAGE */}
        <div 
          className="text-center mt-20 opacity-0 animate-fade-in" 
          style={{ animationDelay: `${PLAN_DATA.length * 0.2 + 0.5}s`, animationFillMode: 'forwards' }}
        >
          <p className="text-lg italic text-purple-200">
            "I can't wait to see you."
          </p>
        </div>

      </div>

      {/* ANIMATION STYLES */}
      <style jsx>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-drop-in {
          animation: dropIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}