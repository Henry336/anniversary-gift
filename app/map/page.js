'use client';
import dynamic from 'next/dynamic';

// NOTICE: We use '../../components/Map' to go up two levels to find components
const MemoryMap = dynamic(() => import('../../components/Map'), { 
  ssr: false, 
  loading: () => (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-white">
      <h1 className="text-2xl font-bold animate-pulse">Loading Map...</h1>
    </div>
  )
});

export default function MapPage() {
  return (
    <main className="h-screen w-screen relative">
      <MemoryMap />
    </main>
  );
}