'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { Playfair_Display } from 'next/font/google';
import confetti from 'canvas-confetti';

// 👇 This is the only music player we need now
import MusicPlayer from '../components/MusicPlayer'; 

const playfair = Playfair_Display({ subsets: ['latin'] });

const PLAN_DATA = [
  { icon: "🍫", title: "The Snack Sync", description: "We open our care packages together. 3, 2, 1, bite! No cheating." },
  { icon: "🗺️", title: "Memory Lane", description: "You just finished this! A walk through our 10 chapters. (Completed ✅)" },
  { icon: "🍜", title: "Dinner: Buldak Noodles!", description: "Spicy noodle challenge together! Get your milk ready." },
  { icon: "🌍", title: "Future Tour", description: "I'll screen-share and we'll walk through the streets of the cities we want to visit." },
  { icon: "🍿", title: "Film Festival", description: "Cozy time. We hit play on 'Our Movie' at the exact same second." },
  { icon: "🎮", title: "Gaming Session", description: "A quick round of Tic-Tac-Toe? Winner gets a wish.", link: "/game" },
  { icon: "📹", title: "Video Calling", description: "Just talking, laughing, and looking at your pretty face." },
  { icon: "📝", title: "The Bucket List", description: "We write down 3 places we MUST go when I visit you next." }
];

export default function Plans() {
  const [stars, setStars] = useState([]);
  const [completed, setCompleted] = useState([]); 
  const router = useRouter(); 

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

  const togglePlan = (index, event) => {
    const isChecking = !completed.includes(index);
    if (isChecking) {
      setCompleted([...completed, index]);
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({ particleCount: 50, spread: 70, origin: { x, y }, colors: ['#fb7185', '#a78bfa', '#ffffff'], zIndex: 9999 });
    } else {
      setCompleted(completed.filter(i => i !== index)); 
    }
  };

  const handleGameClick = (e, link) => {
    e.stopPropagation(); 
    router.push(link);
  };

  return (
    <div className={`min-h-screen w-full bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#2e1065] to-black text-white relative overflow-hidden ${playfair.className}`}>
      
      {/* Background Stars */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {stars.map((star) => (
          <div key={star.id} className="absolute bg-white rounded-full animate-pulse"
            style={{ top: star.top, left: star.left, width: `${star.size}px`, height: `${star.size}px`, animationDuration: star.animationDuration, animationDelay: star.animationDelay }} />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-20">
        <div className="text-center mb-16 animate-fade-in-down">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-white to-violet-200 drop-shadow-sm">The Grand Plan</h1>
          <p className="text-purple-200/80 text-sm tracking-[0.3em] uppercase font-sans">OUR ANNIVERSARY ITINERARY</p>
        </div>

        <div className="flex flex-col gap-6">
          {PLAN_DATA.map((plan, index) => {
            const isDone = completed.includes(index);
            return (
              <div key={index} onClick={(e) => togglePlan(index, e)}
                className={`relative border rounded-2xl p-6 flex items-center gap-6 cursor-pointer transition-all duration-300 group opacity-0 animate-drop-in select-none ${isDone ? 'bg-green-500/10 border-green-500/50 scale-[0.98]' : 'bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 hover:scale-105'}`}
                style={{ animationDelay: `${index * 0.2}s`, animationFillMode: 'forwards' }}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-inner transition-colors shrink-0 ${isDone ? 'bg-green-500/20 grayscale-0' : 'bg-white/10 group-hover:bg-white/20'}`}>
                  {isDone ? '✅' : plan.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold mb-1 transition-all ${isDone ? 'text-green-200 line-through decoration-green-500/50' : 'text-rose-100'}`}>{plan.title}</h3>
                  <p className={`text-sm font-sans font-light leading-relaxed transition-all ${isDone ? 'text-green-200/60 line-through' : 'text-gray-300'}`}>{plan.description}</p>
                  {plan.link && (
                    <button onClick={(e) => handleGameClick(e, plan.link)} className="mt-3 px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-full tracking-wider transition-colors shadow-lg">PLAY NOW →</button>
                  )}
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isDone ? 'bg-green-500 border-green-500' : 'border-white/30 group-hover:border-white'}`}>
                  {isDone && <span className="text-black text-xs font-bold">✓</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 👇 NEW MUSIC PLAYER COMPONENT */}
      <MusicPlayer />
      
    </div>
  );
}