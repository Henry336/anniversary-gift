'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Playfair_Display } from 'next/font/google';
import confetti from 'canvas-confetti';

const playfair = Playfair_Display({ subsets: ['latin'] });

// 1. Helper function to generate pleasing random colors
// We use HSL to ensure colors are vibrant (high saturation) and bright (med-high lightness)
// so they don't get lost against the dark background.
const generateRandomColor = () => {
  const hue = Math.floor(Math.random() * 360); // Full spectrum range
  const saturation = Math.floor(Math.random() * 20) + 80; // 80% - 100% (Very vibrant)
  const lightness = Math.floor(Math.random() * 20) + 60; // 60% - 80% (Bright, pastel-ish)
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const DEFAULT_MOVIE_NAMES = [
  "Cars",
  "Casino Royale", 
  "The Devil Wears Prada",
  "Happy Feet",
  "The Pursuit of Happyness"
];

// 2. Initialize state with objects containing name AND color
const INITIAL_STATE = DEFAULT_MOVIE_NAMES.map(name => ({
    name: name,
    color: generateRandomColor()
}));


export default function MovieSpinner() {
  const router = useRouter();
  // movies state is now an array of objects: { name: "Cars", color: "hsl(...)" }
  const [movies, setMovies] = useState(INITIAL_STATE);
  const [newMovieName, setNewMovieName] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null); // Winner will be a movie object
  const [rotation, setRotation] = useState(0);
  
  // Calculate the gradient dynamically using the stored colors
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
    
    // Add significant extra rotation for drama (5 full spins)
    const extraSpins = 360 * 5; 
    
    // Calculate target angle to land in the middle of the random slice
    const targetRotation = rotation + extraSpins + (360 - (randomSliceIndex * sliceSize) - (sliceSize / 2));
    
    setRotation(targetRotation);

    // Wait for animation to finish (3 seconds)
    setTimeout(() => {
      setIsSpinning(false);
      setWinner(movies[randomSliceIndex]);
      // Use the winner's specific color for the confetti
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
      // 3. When adding, create a new object with a fresh random color
      setMovies([...movies, { name: newMovieName.trim(), color: generateRandomColor() }]);
      setNewMovieName('');
    }
  };

  const removeMovie = (indexToDelete) => {
    setMovies(movies.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className={`min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#2e1065] to-black text-white flex flex-col items-center py-12 ${playfair.className} overflow-x-hidden`}>
      
      {/* Header */}
      <button onClick={() => router.back()} className="absolute top-6 left-6 text-rose-300 hover:text-white transition-colors z-20">
        ← Back to Plan
      </button>
      
      <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-violet-200">
        Movie Roulette
      </h1>
      <p className="text-purple-200/60 text-sm tracking-widest mb-10">SPIN TO DECIDE OUR DATE</p>

      {/* The Wheel Container */}
      <div className="relative w-80 h-80 md:w-96 md:h-96 mb-12 group">
        
        {/* Pointer */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 text-5xl text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
          ▼
        </div>

        {/* Spinning Wheel */}
        <div 
          className="w-full h-full rounded-full border-[6px] border-white/10 shadow-[0_0_60px_rgba(167,139,250,0.2)]"
          style={{ 
            background: getWheelGradient(),
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none'
          }}
        />

        {/* The Spin Button */}
        <button 
          onClick={handleSpin}
          disabled={isSpinning || movies.length < 2}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white text-slate-900 rounded-full font-black text-lg shadow-[0_0_30px_rgba(255,255,255,0.3)] border-4 border-purple-50 flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 z-10 tracking-widest"
        >
          {isSpinning ? '...' : 'SPIN'}
        </button>
      </div>

      {/* Winner Display */}
      <div className="h-20 mb-4 flex items-center justify-center">
        {winner && !isSpinning && (
          <div className="animate-drop-in text-center">
            <p className="text-xs text-purple-300 tracking-widest mb-1">THE WINNER IS:</p>
            {/* Use the winner's specific color for the text */}
            <h2 className="text-4xl font-bold drop-shadow-sm" style={{ color: winner.color }}>{winner.name}</h2>
          </div>
        )}
      </div>

      {/* Movie List Management */}
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
                  {/* Use the stored color for the dot */}
                  <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: movie.color }}></div>
                  {/* Use movie.name to display text */}
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
       {/* Add custom scrollbar styling */}
       <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}