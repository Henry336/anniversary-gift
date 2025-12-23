// components/HeartRain.js
'use client';

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import confetti from 'canvas-confetti';

export default function HeartRain() {
  const [isSending, setIsSending] = useState(false);

  // Function to actually fire the confetti animation
  const fireHeartConfetti = () => {
    const duration = 3000; // 3 seconds
    const end = Date.now() + duration;

    // Red and various pinks
    const colors = ['#ff0000', '#ff69b4', '#ff1493', '#db7093'];

    (function frame() {
      // Launch hearts from left edge
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        shapes: ['heart'],
        colors: colors,
        zIndex: 9999,
        scalar: 2, // Make hearts bigger
      });
      // Launch hearts from right edge
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        shapes: ['heart'],
        colors: colors,
        zIndex: 9999,
        scalar: 2,
      });

      // Keep firing until time is up
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  // 1. Setup Pusher Listener on Mount
  useEffect(() => {
    // Enable pusher logging during development - don't include this in production
    // Pusher.logToConsole = true;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    // Subscribe to the channel we chose in the API route
    const channel = pusher.subscribe('anniversary-channel');

    // Bind to the specific event
    channel.bind('hearts-triggered', (data) => {
      console.log('Heart signal received!', data);
      fireHeartConfetti();
    });

    // Cleanup on unmount
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  // 2. Function to trigger the event when clicked
  const sendLove = async () => {
    if (isSending) return;
    setIsSending(true);
    
    // Optimistically fire on own screen immediately
    fireHeartConfetti(); 

    try {
      await fetch('/api/trigger-hearts', { method: 'POST' });
    } catch (error) {
      console.error('Failed to send love:', error);
    } finally {
      // prevent spamming click too fast
      setTimeout(() => setIsSending(false), 2000);
    }
  };

  return (
    <button
      onClick={sendLove}
      disabled={isSending}
      className={`fixed bottom-6 left-6 z-[100] bg-rose-500/80 hover:bg-rose-600 backdrop-blur-md p-4 rounded-full shadow-[0_0_20px_rgba(244,63,94,0.6)] border-2 border-rose-300/50 transition-all hover:scale-110 active:scale-90 ${isSending ? 'grayscale animate-pulse' : 'animate-bounce-slow'}`}
    >
      <span className="text-4xl filter drop-shadow-lg">💖</span>
    </button>
  );
}