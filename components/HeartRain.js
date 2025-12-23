'use client';

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

export default function HeartRain() {
  const [isSending, setIsSending] = useState(false);

  // This function creates a single falling heart element
  const createHeart = () => {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.top = '-50px';
    // Random horizontal position (0 to 100vw)
    heart.style.left = Math.random() * 100 + 'vw';
    // Random size (20px to 50px)
    heart.style.fontSize = Math.random() * 30 + 20 + 'px';
    // Random animation duration (2s to 5s) for variation
    heart.style.animationDuration = Math.random() * 3 + 2 + 's';
    heart.style.zIndex = '9999';
    // Add the animation class defined below
    heart.classList.add('heart-fall');
    
    document.body.appendChild(heart);

    // Remove the element after animation ends to keep the site fast
    setTimeout(() => {
      heart.remove();
    }, 5000);
  };

  // Trigger the rain loop
  const startRain = () => {
    const duration = 3000; // Rain for 3 seconds
    const end = Date.now() + duration;

    // Create a new heart every 50 milliseconds
    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
      } else {
        createHeart();
        createHeart(); // Spawn 2 at a time for density
      }
    }, 50);
  };

  useEffect(() => {
    // 1. Pusher Setup
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe('anniversary-channel');

    channel.bind('hearts-triggered', (data) => {
      console.log('Heart signal received!', data);
      startRain();
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const sendLove = async () => {
    if (isSending) return;
    setIsSending(true);
    
    startRain(); // Immediate local feedback

    try {
      await fetch('/api/trigger-hearts', { method: 'POST' });
    } catch (error) {
      console.error('Failed to send love:', error);
    } finally {
      setTimeout(() => setIsSending(false), 2000);
    }
  };

  return (
    <>
      {/* Defines the animation just for this component */}
      <style jsx global>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
        }
        .heart-fall {
          animation-name: fall;
          animation-timing-function: linear;
          pointer-events: none; /* Let clicks pass through */
        }
      `}</style>

      <button
        onClick={sendLove}
        disabled={isSending}
        className={`fixed bottom-6 left-6 z-[100] bg-rose-500/80 hover:bg-rose-600 backdrop-blur-md p-4 rounded-full shadow-[0_0_20px_rgba(244,63,94,0.6)] border-2 border-rose-300/50 transition-all hover:scale-110 active:scale-90 ${isSending ? 'grayscale animate-pulse' : 'animate-bounce-slow'}`}
      >
        <span className="text-4xl filter drop-shadow-lg">💖</span>
      </button>
    </>
  );
}