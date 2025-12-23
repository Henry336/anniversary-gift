'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // <--- Import Router
import { Playfair_Display } from 'next/font/google';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, onDisconnect } from "firebase/database";
import confetti from 'canvas-confetti';

const playfair = Playfair_Display({ subsets: ['latin'] });

// ==============================================================================
// 🔥 YOUR FIREBASE CONFIG
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
  const [isConnected, setIsConnected] = useState(false); // Connection Status
  
  const router = useRouter(); // Initialize Router

  // 1. SYNC & CONNECTION CHECK
  useEffect(() => {
    const gameRef = ref(db, 'game/board');
    const turnRef = ref(db, 'game/xIsNext');
    const connectedRef = ref(db, ".info/connected");

    // Check if we are online
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
    if (board[i] || winner) return;

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

  // 5. NAVIGATION
  const goBack = () => {
    router.push('/plans');
  };

  // Stars background
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

  return (
    <div className={`min-h-screen w-full bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#2e1065] to-black text-white flex flex-col items-center justify-center relative overflow-hidden ${playfair.className}`}>
      
      {/* BACK BUTTON */}
      <button 
        onClick={goBack}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-white/60 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 text-sm font-bold tracking-widest uppercase"
      >
        ← Back
      </button>

      {/* CONNECTION STATUS DOT */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-2 text-xs font-mono opacity-50">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 shadow-[0_0_8px_#4ade80]' : 'bg-red-500'}`} />
        {isConnected ? "ONLINE" : "OFFLINE"}
      </div>

      {/* STARS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {stars.map((star) => (
          <div key={star.id} className="absolute bg-white rounded-full animate-pulse" style={{ top: star.top, left: star.left, width: star.size, height: star.size, animationDuration: star.animationDuration }} />
        ))}
      </div>

      <div className="z-10 text-center relative">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-violet-200 drop-shadow-sm">
          Tic Tac Toe
        </h1>

        {/* STATUS */}
        <div className="mb-6 text-xl tracking-widest text-purple-200 h-8">
          {winner ? (
            <span className="font-bold text-green-400 animate-bounce block">Winner: {winner} 🎉</span>
          ) : (
            <span>Next Player: <span className={`font-bold ${xIsNext ? 'text-rose-300' : 'text-violet-300'}`}>{xIsNext ? 'X' : 'O'}</span></span>
          )}
        </div>

        {/* BOARD */}
        <div className="grid grid-cols-3 gap-3 bg-white/5 p-6 rounded-2xl backdrop-blur-xl shadow-2xl border border-white/10">
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={!!cell || !!winner}
              className={`
                w-20 h-20 sm:w-24 sm:h-24 text-5xl font-bold flex items-center justify-center rounded-xl transition-all duration-300 shadow-inner
                ${cell === 'X' ? 'text-rose-400 bg-white/10 shadow-[0_0_15px_rgba(251,113,133,0.3)]' : 
                  cell === 'O' ? 'text-violet-400 bg-white/10 shadow-[0_0_15px_rgba(167,139,250,0.3)]' : 
                  'bg-white/5 hover:bg-white/10 hover:scale-105'}
              `}
            >
              {cell}
            </button>
          ))}
        </div>

        {/* RESET BUTTON */}
        <button
          onClick={resetGame}
          className="mt-10 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-xs font-bold tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          RESET GAME
        </button>
      </div>
    </div>
  );
}

// Helper logic
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = squares;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}