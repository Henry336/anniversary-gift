'use client';
import { useState, useEffect, useRef } from 'react';
import { ref, onValue, set, push, remove } from "firebase/database";
import { db } from '../firebase'; 
// 👇 DELETE the old import ReactPlayer from 'react-player/youtube';

// 👇 ADD THIS DYNAMIC IMPORT
import dynamic from 'next/dynamic';
const ReactPlayer = dynamic(() => import('react-player/youtube'), { ssr: false });to the file we made in Step 2

export default function MusicPlayer() {
  // State
  const [isExpanded, setIsExpanded] = useState(false);
  const [queue, setQueue] = useState([]); // Array of { id, url, title }
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Inputs
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');

  // Refs
  const playerRef = useRef(null);

  // 1. SYNC WITH FIREBASE
  useEffect(() => {
    const queueRef = ref(db, 'music/queue');
    const stateRef = ref(db, 'music/state');

    const unsubQueue = onValue(queueRef, (snap) => {
      const data = snap.val();
      if (data) {
        // Convert Firebase object to array
        const list = Object.entries(data).map(([key, val]) => ({
          id: key,
          ...val
        }));
        setQueue(list);
      } else {
        setQueue([]);
      }
    });

    const unsubState = onValue(stateRef, (snap) => {
      const data = snap.val();
      if (data) {
        setCurrentIndex(data.currentIndex || 0);
        setIsPlaying(data.isPlaying || false);
      }
    });

    return () => {
      unsubQueue();
      unsubState();
    };
  }, []);

  // 2. CONTROLS (Updates Firebase)
  const handlePlayPause = () => {
    const nextState = !isPlaying;
    set(ref(db, 'music/state/isPlaying'), nextState);
  };

  const handleNext = () => {
    if (currentIndex < queue.length - 1) {
      set(ref(db, 'music/state/currentIndex'), currentIndex + 1);
    } else {
      // Loop back to start or stop? Let's loop.
      set(ref(db, 'music/state/currentIndex'), 0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      set(ref(db, 'music/state/currentIndex'), currentIndex - 1);
    }
  };

  const handleAddSong = (e) => {
    e.preventDefault();
    if (!newUrl) return;
    
    // Auto-generate title if missing
    const songTitle = newTitle || `Track ${queue.length + 1}`;
    
    const newSong = {
      url: newUrl,
      title: songTitle,
      addedAt: Date.now()
    };

    push(ref(db, 'music/queue'), newSong);
    setNewUrl('');
    setNewTitle('');
  };

  const handleDelete = (id, index) => {
    remove(ref(db, `music/queue/${id}`));
    // If we deleted the current song or one before it, adjust index
    if (index < currentIndex) {
      set(ref(db, 'music/state/currentIndex'), currentIndex - 1);
    }
  };

  const handleSongEnd = () => {
    // Determine who triggers the next song. 
    // To avoid race conditions, only the active player triggers it.
    // Simpler: Just trigger it. Firebase handles last-write-wins.
    handleNext();
  };

  // Get current song URL
  const currentSong = queue[currentIndex];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* HIDDEN PLAYER (Handles the audio) */}
      <div className="hidden">
        {currentSong && (
          <ReactPlayer
            ref={playerRef}
            url={currentSong.url}
            playing={isPlaying}
            controls={false}
            volume={0.8}
            onEnded={handleSongEnd}
          />
        )}
      </div>

      {/* EXPANDED PLAYLIST UI */}
      {isExpanded && (
        <div className="mb-4 w-80 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
            <h3 className="text-sm font-bold tracking-widest text-rose-200">OUR PLAYLIST</h3>
            <button onClick={() => setIsExpanded(false)} className="text-white/50 hover:text-white">✕</button>
          </div>

          {/* Current Song Display */}
          <div className="bg-white/5 rounded-lg p-3 mb-4 flex flex-col items-center text-center">
            {currentSong ? (
              <>
                <div className={`w-2 h-2 rounded-full mb-2 ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                <span className="text-sm font-bold text-white truncate w-full">{currentSong.title}</span>
                <div className="flex gap-4 mt-3">
                  <button onClick={handlePrev} className="hover:text-rose-400">⏮</button>
                  <button onClick={handlePlayPause} className="hover:text-rose-400 text-xl">
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                  <button onClick={handleNext} className="hover:text-rose-400">⏭</button>
                </div>
              </>
            ) : (
              <span className="text-xs text-white/50">Queue is empty</span>
            )}
          </div>

          {/* Queue List */}
          <div className="max-h-32 overflow-y-auto mb-4 space-y-2 pr-1 custom-scrollbar">
            {queue.map((song, i) => (
              <div key={song.id} className={`flex justify-between items-center text-xs p-2 rounded ${i === currentIndex ? 'bg-rose-500/20 text-rose-200 border border-rose-500/30' : 'bg-white/5 text-white/70'}`}>
                <span className="truncate max-w-[180px]">{i + 1}. {song.title}</span>
                {/* Delete Button (Only allow delete if not current, or generic delete) */}
                <button onClick={() => handleDelete(song.id, i)} className="text-white/20 hover:text-red-400 px-2">×</button>
              </div>
            ))}
          </div>

          {/* Add Song Form */}
          <form onSubmit={handleAddSong} className="flex flex-col gap-2">
            <input 
              type="text" 
              placeholder="Song Name (e.g. Our Song)" 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white placeholder-white/30 focus:outline-none focus:border-rose-500/50"
            />
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="YouTube URL" 
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white placeholder-white/30 focus:outline-none focus:border-rose-500/50 flex-1"
              />
              <button type="submit" disabled={!newUrl} className="bg-white/10 hover:bg-rose-500/20 text-xs px-3 rounded border border-white/10 transition-colors">+</button>
            </div>
          </form>
        </div>
      )}

      {/* VINYL ICON (TOGGLE) */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="group relative flex items-center justify-center"
      >
        {/* The Disc */}
        <div className={`w-14 h-14 rounded-full bg-black border-2 border-slate-700 shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden transition-transform duration-700 ${isPlaying ? 'animate-spin-slow' : ''} ${isExpanded ? 'scale-110' : 'scale-100 hover:scale-105'}`}>
          {/* Groove lines */}
          <div className="absolute inset-0 rounded-full border border-white/10 scale-[0.8]" />
          <div className="absolute inset-0 rounded-full border border-white/10 scale-[0.6]" />
          <div className="absolute inset-0 rounded-full border border-white/10 scale-[0.4]" />
          
          {/* Center Label */}
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-400 to-violet-500 z-10" />
        </div>

        {/* Music Note Floating Animation (If playing) */}
        {isPlaying && !isExpanded && (
          <div className="absolute -top-4 -right-2 text-rose-300 animate-bounce">🎵</div>
        )}
      </button>

      {/* CSS for Spin Animation */}
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        /* Scrollbar hiding for cleaner look */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}