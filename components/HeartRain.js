'use client';

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import confetti from 'canvas-confetti';

export default function HeartRain() {
  const [isSending, setIsSending] = useState(false);

  // 👇 1. DEFINE THE CUSTOM HEART SHAPE HERE
  // This tells the library exactly how to draw the curve of a heart
  let heartShape;
  
  // We need to wrap this in a check because 'document' isn't available on the server
  if (typeof window !== 'undefined') {
    heartShape = confetti.shapeFromPath({
      path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z', 
      matrix: [0.03333333333333333, 0, 0, 0.03333333333333333, -5.566666666666666, -5.533333333333333]
    });
  }

  const fireHeartConfetti = () => {
    const duration = 3000; 
    const end = Date.now() + duration;
    const colors = ['#ff0000', '#ff69b4', '#ff1493', '#db7093'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 270, 
        spread: 100, 
        origin: { x: Math.random(), y: -0.1 },
        colors: colors,
        
        // 👇 2. USE THE CUSTOM VARIABLE HERE
        shapes: [heartShape], 
        
        scalar: 4,         
        gravity: 0.4,      
        drift: 0,
        ticks: 400,        
        zIndex: 9999,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  useEffect(() => {
    // Standard Pusher Setup
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
      className={`fixed bottom-6 left-6 z-[100] bg-rose-500/80 hover:bg-rose-600 backdrop-blur-md p-4 rounded-full shadow-[0_0_20px_rgba(244,63,94,0.6)] border-2 border-rose-300/50 transition-all hover:scale-110 active:scale-90 ${isSending ? 'grayscale animate-pulse' : 'animate-bounce-slow'}`}
    >
      <span className="text-4xl filter drop-shadow-lg">💖</span>
    </button>
  );
}