'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Playfair_Display } from 'next/font/google';
import confetti from 'canvas-confetti';

const playfair = Playfair_Display({ subsets: ['latin'] });

// 👇 EDIT YOUR SUBTITLE HERE
const PAGE_SUBTITLE = "SPIN TO DECIDE OUR DATE";

const generateRandomColor = () => {
  const hue = Math.floor(Math.random() * 360); 
  const saturation = Math.floor(Math.random() * 20) + 80; 
  const lightness = Math.floor(Math.random() * 20) + 40; 
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const DEFAULT_MOVIES = [
  { name: "The Holiday", color: "#ef4444" },     
  { name: "Step Up", color: "#8b5cf6" },         
  { name: "The Lake House", color: "#3b82f6" },  
  { name: "She's the Man", color: "#eab308" },   
  { name: "Cars", color: "#ef4444" },            
  { name: "Casino Royale", color: "#10b981" },   
];

export default function MovieSpinner() {
  const router = useRouter();
  const [movies, setMovies] = useState(DEFAULT_MOVIES);
  const [newMovieName, setNewMovieName] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null); 
  const [rotation, setRotation] = useState(0);
  
  const getWheelGradient = () => {
    if (movies.length === 0) return 'conic-gradient(#334155 0% 100%)';
    const percent = 100 / movies.length;
    return `conic-gradient(
      ${movies.map((movie, i) => `${movie.color} ${i * percent}% ${(i + 1) * percent}%`).join(', ')}
    )`;
  };

  const handleSpin = () => {
    if (isSpinning || movies.length < 2) return;
    
    setWinner(null);
    setIsSpinning(true);

    const sliceSize = 360 / movies.length;
    const randomSliceIndex = Math.floor(Math.random() * movies.length);
    const extraSpins = 360 * 5; 
    
    const targetRotation = rotation + extraSpins + (360 - (randomSliceIndex * sliceSize) - (sliceSize / 2));
    
    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWinner(movies[randomSliceIndex]);
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: [movies[randomSliceIndex].color, '#ffffff'] 
      });
    }, 3000);
  };

  const addMovie = (e) => {
    e.preventDefault();
    if (newMovieName.trim()) {
      setMovies([...movies, { name: newMovieName.trim(), color: generateRandomColor() }]);
      setNewMovieName('');
    }
  };

  const removeMovie = (indexToDelete) => {
    setMovies(movies.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className={`min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#2e1065] to-black text-white flex flex-col items-center py-12 ${playfair.className} overflow-x-hidden`}>
      
      <button onClick={() => router.back()} className="absolute top-6 left-6 text-rose-300 hover:text-white transition-colors z-20">
        ← Back to Plan
      </button>
      
      <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-violet-200">
        Movie Roulette
      </h1>
      {/* 👇 Using the variable here */}
      <p className="text-purple-200/60 text-sm tracking-widest mb-10">{PAGE_SUBTITLE}</p>

      {/* The Wheel Container */}
      <div className="relative w-80 h-80 md:w-96 md:h-96 mb-12 group font-sans">
        
        {/* Pointer */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 text-5xl text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
          ▼
        </div>

        {/* Spinning Wheel */}
        <div 
          className="w-full h-full rounded-full border-[6px] border-white/10 shadow-[0_0_60px_rgba(167,139,250,0.2)] relative overflow-hidden"
          style={{ 
            background: getWheelGradient(),
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none'
          }}
        >
          {/* 👇 UPDATED TEXT LABELS SECTION */}
          {movies.map((movie, i) => {
            const sliceAngle = 360 / movies.length;
            const rotateAngle = (sliceAngle * i) + (sliceAngle / 2);
            return (
              // This invisible arm rotates from the center to point to the middle of a slice
              <div
                key={i}
                className="absolute top-1/2 left-1/2 h-0 origin-left pointer-events-none"
                style={{
                  transform: `rotate(${rotateAngle - 90}deg)`, // Adjust so 0deg is top
                  width: '50%' // Length is the radius
                }}
              >
                {/* Position the text container near the end of the arm */}
                <div
                  className="absolute right-[12%] top-1/2 -translate-y-1/2 w-32 flex justify-center items-center"
                  // Rotate text 90deg so it runs along the circumference
                  style={{ transform: 'rotate(90deg)' }} 
                >
                  <span className="text-white font-bold text-[10px] md:text-xs uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,1)] whitespace-nowrap truncate px-2">
                    {movie.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Spin Button */}
        <button 
          onClick={handleSpin}
          disabled={isSpinning || movies.length < 2}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white text-slate-900 rounded-full font-black text-sm shadow-[0_0_30px_rgba(255,255,255,0.3)] border-4 border-purple-50 flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 z-10 tracking-widest"
        >
          {isSpinning ? '...' : 'SPIN'}
        </button>
      </div>

      <div className="h-20 mb-4 flex items-center justify-center">
        {winner && !isSpinning && (
          <div className="animate-drop-in text-center">
            <p className="text-xs text-purple-300 tracking-widest mb-1">THE WINNER IS:</p>
            <h2 className="text-4xl font-bold drop-shadow-sm" style={{ color: winner.color }}>{winner.name}</h2>
          </div>
        )}
      </div>

      <div className="w-full max-w-md px-6 z-10 relative">
        <form onSubmit={addMovie} className="flex gap-3 mb-8">
          <input 
            type="text" 
            value={newMovieName}
            onChange={(e) => setNewMovieName(e.target.value)}
            placeholder="Add another movie..."
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white placeholder-white/30 focus:outline-none focus:border-rose-400/50 focus:bg-white/10 transition-all font-sans"
          />
          <button type="submit" className="bg-gradient-to-r from-rose-500 to-purple-600 px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity shadow-lg tracking-wide text-sm">
            ADD
          </button>
        </form>

        <div className="bg-slate-800/50 rounded-2xl p-2 backdrop-blur-md border border-white/5 max-h-72 overflow-y-auto custom-scrollbar">
          <div className="px-4 py-2">
            <h3 className="text-xs font-sans text-gray-400 uppercase tracking-wider">Contenders ({movies.length})</h3>
          </div>
          <div className="space-y-1 p-2">
            {movies.map((movie, idx) => (
              <div key={idx} className="flex items-center justify-between group bg-white/5 hover:bg-white/10 rounded-xl p-3 transition-colors border border-transparent hover:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: movie.color }}></div>
                  <span className="text-gray-100 font-medium">{movie.name}</span>
                </div>
                <button onClick={() => removeMovie(idx)} className="text-white/20 hover:text-rose-400 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-all">
                  ×
                </button>
              </div>
            ))}
            {movies.length < 2 && (
              <p className="text-center text-gray-400 text-sm py-6 font-sans italic">
                Add at least {2 - movies.length} more to spin!
              </p>
            )}
          </div>
        </div>
      </div>
       <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }
      `}</style>
    </div>
  );
}