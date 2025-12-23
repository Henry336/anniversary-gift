'use client';
import { useState, useEffect, useRef } from 'react';
import { Playfair_Display } from 'next/font/google';
import confetti from 'canvas-confetti'; // <--- Import the confetti library

const playfair = Playfair_Display({ subsets: ['latin'] });

// ==============================================================================
// 🎵 CONFIGURATION
// ==============================================================================
const MUSIC_URL = "/music/perfect-cover.mp3"; 

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

export default function Plans() {
  const [stars, setStars] = useState([]);
  const [completed, setCompleted] = useState([]); 
  const audioRef = useRef(null);

  // --- 1. STAR GENERATION ---
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

  // --- 2. MUSIC AUTO-PLAY ENGINE ---
  useEffect(() => {
    const startAudio = async () => {
      try {
        if (audioRef.current) {
          audioRef.current.volume = 0.5;
          await audioRef.current.play();
        }
      } catch (err) {
        console.log("Autoplay blocked, waiting for click...");
      }
    };
    startAudio();

    // Fallback listener
    const handleInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        startAudio();
      }
    };
    window.addEventListener('click', handleInteraction);
    return () => window.removeEventListener('click', handleInteraction);
  }, []);


  // --- 3. HANDLE CLICKS & CONFETTI ---
  const togglePlan = (index, event) => {
    // Check if we are "checking" (not unchecking) the item
    const isChecking = !completed.includes(index);

    if (isChecking) {
      setCompleted([...completed, index]);
      
      // 🎉 TRIGGER MINI CONFETTI EXPLOSION 🎉
      // We calculate the position of the click to make confetti burst from there
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 40,
        spread: 70,
        origin: { x, y },
        colors: ['#fb7185', '#a78bfa', '#ffffff'], // Rose, Violet, White
        disableForReducedMotion: true,
        zIndex: 9999,
      });

    } else {
      setCompleted(completed.filter(i => i !== index)); // Uncheck
    }
  };

  return (
    <div className={`min-h-screen w-full bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#2e1065] to-black text-white relative overflow-hidden ${playfair.className}`}>
      
      {/* BACKGROUND MUSIC */}
      <audio ref={audioRef} loop src={MUSIC_URL} />

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
          {PLAN_DATA.map((plan, index) => {
            const isDone = completed.includes(index);

            return (
              <div 
                key={index}
                // Pass event 'e' to the toggle function for confetti positioning
                onClick={(e) => togglePlan(index, e)}
                className={`
                  relative border rounded-2xl p-6 flex items-center gap-6 cursor-pointer transition-all duration-300 group opacity-0 animate-drop-in select-none
                  ${isDone 
                    ? 'bg-green-500/10 border-green-500/50 scale-[0.98]' 
                    : 'bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 hover:scale-105'
                  }
                `}
                style={{ 
                  animationDelay: `${index * 0.2}s`, 
                  animationFillMode: 'forwards' 
                }}
              >
                {/* ICON BUBBLE */}
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-inner transition-colors shrink-0
                  ${isDone ? 'bg-green-500/20 grayscale-0' : 'bg-white/10 group-hover:bg-white/20'}
                `}>
                  {isDone ? '✅' : plan.icon}
                </div>

                {/* TEXT */}
                <div className="flex-1">
                  <h3 className={`text-xl font-bold mb-1 transition-all ${isDone ? 'text-green-200 line-through decoration-green-500/50' : 'text-rose-100'}`}>
                    {plan.title}
                  </h3>
                  <p className={`text-sm font-sans font-light leading-relaxed transition-all ${isDone ? 'text-green-200/60 line-through' : 'text-gray-300'}`}>
                    {plan.description}
                  </p>
                </div>

                {/* CHECKBOX VISUAL */}
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                  ${isDone ? 'bg-green-500 border-green-500' : 'border-white/30 group-hover:border-white'}
                `}>
                  {isDone && <span className="text-black text-xs font-bold">✓</span>}
                </div>

              </div>
            );
          })}
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