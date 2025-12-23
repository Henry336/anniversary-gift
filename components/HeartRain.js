'use client';

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import confetti from 'canvas-confetti';

export default function HeartRain() {
  const [isSending, setIsSending] = useState(false);

  // 👇 UPDATED: Function to make hearts rain from the sky
  const fireHeartConfetti = () => {
    const duration = 3000; // Rain for 3 seconds
    const end = Date.now() + duration;

    // Colors: Red, Hot Pink, Deep Pink, Pale Violet Red
    const colors = ['#ff0000', '#ff69b4', '#ff1493', '#db7093'];

    (function frame() {
      // Launch 3 hearts per frame from random spots at the top
      confetti({
        particleCount: 3,
        angle: 270, // 270 degrees = straight down
        spread: 100, // Wide spread so they don't look like a laser beam
        origin: { 
            x: Math.random(), // Random horizontal position (0 to 1)
            y: -0.1           // Start slightly above the top of the screen
        },
        colors: colors,
        shapes: ['heart'], // ❤️ The important part!
        scalar: 4,         // Make them BIG (default is 1)
        gravity: 0.4,      // Low gravity makes them float down slowly
        drift: 0,
        ticks: 400,        // Stay on screen longer
        zIndex: 9999,
      });

      // Keep firing until time is up
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  useEffect(() => {
    // You can comment this out now that it works to keep console clean
    // Pusher.logToConsole = true; 

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe('anniversary-channel');

    channel.bind('hearts-triggered', (data) => {
      console.log('Heart signal received!', data);
      fireHeartConfetti();
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const sendLove = async () => {
    if (isSending) return;
    setIsSending(true);
    
    // Optimistically fire on your screen immediately
    fireHeartConfetti(); 

    try {
      await fetch('/api/trigger-hearts', { method: 'POST' });
    } catch (error) {
      console.error('Failed to send love:', error);
    } finally {
      setTimeout(() => setIsSending(false), 2000);
    }
  };

  return (
    <button
      onClick={sendLove}
      disabled={isSending}
      // Note: Kept it at bottom-left per our previous fix
      className={`fixed bottom-6 left-6 z-[100] bg-rose-500/80 hover:bg-rose-600 backdrop-blur-md p-4 rounded-full shadow-[0_0_20px_rgba(244,63,94,0.6)] border-2 border-rose-300/50 transition-all hover:scale-110 active:scale-90 ${isSending ? 'grayscale animate-pulse' : 'animate-bounce-slow'}`}
    >
      <span className="text-4xl filter drop-shadow-lg">💖</span>
    </button>
  );
}