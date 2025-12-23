'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Playfair_Display } from 'next/font/google';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";
import confetti from 'canvas-confetti';

const playfair = Playfair_Display({ subsets: ['latin'] });

// ==============================================================================
// FIREBASE CONFIG
// ==============================================================================
const firebaseConfig = {
  apiKey: "AIzaSyAFR8kamGUDFqygpNn7QNq1n0rtAcyf1gg",
  authDomain: "anniversary-game-75787.firebaseapp.com",
  databaseURL: "https://anniversary-game-75787-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "anniversary-game-75787",
  storageBucket: "anniversary-game-75787.firebasestorage.app",
  messagingSenderId: "669196472242",
  appId: "1:669196472242:web:38d52f0db55858f5fb5eab",
  measurementId: "G-68D6YWSG9G"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [stars, setStars] = useState([]);
  const [winner, setWinner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // NEW: Track who the local user is playing as
  const [myPlayer, setMyPlayer] = useState(null); // 'X' or 'O'

  const router = useRouter();

  // 1. SYNC & CONNECTION CHECK
  useEffect(() => {
    const gameRef = ref(db, 'game/board');
    const turnRef = ref(db, 'game/xIsNext');
    const connectedRef = ref(db, ".info/connected");

    const unsubscribeConn = onValue(connectedRef, (snap) => {
      setIsConnected(!!snap.val());
    });

    const unsubscribeBoard = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setBoard(data);
    });

    const unsubscribeTurn = onValue(turnRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) setXIsNext(data);
    });

    return () => {
      unsubscribeBoard();
      unsubscribeTurn();
      unsubscribeConn();
    };
  }, []);

  // 2. CHECK WINNER
  useEffect(() => {
    const calculatedWinner = calculateWinner(board);
    setWinner(calculatedWinner);
    if (calculatedWinner) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fb7185', '#a78bfa', '#ffffff']
      });
    }
  }, [board]);

  // 3. HANDLE MOVE
  const handleClick = (i) => {
    // Stop if: square taken, game over, or user hasn't picked a side
    if (board[i] || winner || !myPlayer) return;

    // Stop if it's not the user's turn
    const isMyTurn = (xIsNext && myPlayer === 'X') || (!xIsNext && myPlayer === 'O');
    if (!isMyTurn) return;

    const newBoard = [...board];
    newBoard[i] = xIsNext ? 'X' : 'O';

    // Optimistic update
    setBoard(newBoard);
    setXIsNext(!xIsNext);

    // Push to Firebase
    set(ref(db, 'game/board'), newBoard).catch(err => console.error("Firebase Write Error:", err));
    set(ref(db, 'game/xIsNext'), !xIsNext);
  };

  // 4. RESET GAME
  const resetGame = () => {
    const emptyBoard = Array(9).fill(null);
    set(ref(db, 'game/board'), emptyBoard);
    set(ref(db, 'game/xIsNext'), true);
    setWinner(null);
  };

  const goBack = () => {
    router.push('/plans');
  };

  // Generate Stars
  useEffect(() => {
    const generatedStars = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      animationDuration: `${Math.random() * 3 + 2}s`
    }));
    setStars(generatedStars);
  }, []);

  // Helper to determine status message
  const getStatusMessage = () => {
    if (winner) return `Winner: ${winner} 🎉`;
    if (!myPlayer) return "Choose a side to start";
    
    const isMyTurn = (xIsNext && myPlayer === 'X') || (!xIsNext && myPlayer === 'O');
    return isMyTurn ? "Your Turn!" : "Waiting for Opponent...";
  };

  return (
    <div className={`min-h-screen w-full bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#2e1065] to-black text-white flex flex-col items-center justify-center relative overflow-hidden ${playfair.className}`}>
      
      {/* BACK BUTTON */}
      <button 
        onClick={goBack}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-white/60 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 text-sm font-bold tracking-widest uppercase"
      >
        ← Back
      </button>

      {/* CONNECTION STATUS */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-2 text-xs font-mono opacity-50">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 shadow-[0_0_8px_#4ade80]' : 'bg-red-500'}`} />
        {isConnected ? "ONLINE" : "OFFLINE"}
      </div>

      {/* STARS BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {stars.map((star) => (
          <div key={star.id} className="absolute bg-white rounded-full animate-pulse" style={{ top: star.top, left: star.left, width: star.size, height: star.size, animationDuration: star.animationDuration }} />
        ))}
      </div>

      <div className="z-10 text-center relative w-full max-w-md px-4">
        <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-violet-200 drop-shadow-sm">
          Tic Tac Toe
        </h1>

        {/* --- SELECT SIDE OVERLAY (Only shows if no player selected) --- */}
        {!myPlayer ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6 mt-8 animate-in fade-in zoom-in duration-300">
            <h2 className="text-xl tracking-widest uppercase">Choose your side</h2>
            <div className="flex gap-4">
              <button 
                onClick={() => setMyPlayer('X')}
                className="w-32 h-32 rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-900/20 border border-rose-500/30 hover:border-rose-400 hover:bg-rose-500/30 transition-all flex flex-col items-center justify-center gap-2 group"
              >
                <span className="text-5xl font-bold text-rose-300 group-hover:scale-110 transition-transform">X</span>
                <span className="text-xs tracking-widest uppercase text-white/50">Play as X</span>
              </button>
              <button 
                onClick={() => setMyPlayer('O')}
                className="w-32 h-32 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-900/20 border border-violet-500/30 hover:border-violet-400 hover:bg-violet-500/30 transition-all flex flex-col items-center justify-center gap-2 group"
              >
                <span className="text-5xl font-bold text-violet-300 group-hover:scale-110 transition-transform">O</span>
                <span className="text-xs tracking-widest uppercase text-white/50">Play as O</span>
              </button>
            </div>
          </div>
        ) : (
          /* --- GAME BOARD (Shows after selection) --- */
          <>
            <div className="mb-6 h-8 flex items-center justify-center gap-3">
               <span className={`px-3 py-1 rounded-full text-xs font-bold border ${myPlayer === 'X' ? 'border-rose-500/50 bg-rose-500/10 text-rose-300' : 'border-violet-500/50 bg-violet-500/10 text-violet-300'}`}>
                 YOU: {myPlayer}
               </span>
               <span className="text-xl tracking-widest text-purple-200">
                 {getStatusMessage()}
               </span>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-white/5 p-6 rounded-2xl backdrop-blur-xl shadow-2xl border border-white/10 mx-auto w-fit">
              {board.map((cell, i) => {
                 // Calculate if this cell should be clickable
                 const isMyTurn = (xIsNext && myPlayer === 'X') || (!xIsNext && myPlayer === 'O');
                 const isInteractable = !cell && !winner && isMyTurn;

                 return (
                  <button
                    key={i}
                    onClick={() => handleClick(i)}
                    disabled={!isInteractable}
                    className={`
                      w-20 h-20 sm:w-24 sm:h-24 text-5xl font-bold flex items-center justify-center rounded-xl transition-all duration-300 shadow-inner
                      ${cell === 'X' ? 'text-rose-400 bg-white/10 shadow-[0_0_15px_rgba(251,113,133,0.3)]' : 
                        cell === 'O' ? 'text-violet-400 bg-white/10 shadow-[0_0_15px_rgba(167,139,250,0.3)]' : 
                        'bg-white/5 border border-white/10'}
                      ${isInteractable ? 'hover:bg-white/20 hover:scale-105 cursor-pointer' : 'cursor-default opacity-80'}
                    `}
                  >
                    {cell ? cell : <span className="invisible">&nbsp;</span>}
                  </button>
                );
              })}
            </div>

            <button
              onClick={resetGame}
              className="mt-10 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-xs font-bold tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              RESET GAME
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Logic Helper
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}