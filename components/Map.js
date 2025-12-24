'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import { useRouter } from 'next/navigation'; 
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { memories } from './memoriesData'; 

// ==============================================================================
// 🎵 MUSIC PLAYLIST CONFIGURATION
// ==============================================================================
const SONG_PLAYLIST = [
  "/music/m-nyar-tot-buu.mp3", 
  "/music/perfect-cover.mp3", 
  "/music/like-im-gonna-lose-you.mp3", 
  "/music/you-are-the-reason.mp3"  
];

// --- ICON CONFIG ---
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// --- MUSIC PLAYER COMPONENT ---
const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4; 
    }

    const startAudio = async () => {
      try {
        if (audioRef.current) {
          await audioRef.current.play();
          setIsPlaying(true);
          document.removeEventListener('click', startAudio);
          document.removeEventListener('touchstart', startAudio);
        }
      } catch (err) {
        console.log("Autoplay blocked by browser. Waiting for interaction...");
        setIsPlaying(false);
      }
    };

    startAudio();
    document.addEventListener('click', startAudio, { once: true });
    document.addEventListener('touchstart', startAudio, { once: true });

    return () => {
      document.removeEventListener('click', startAudio);
      document.removeEventListener('touchstart', startAudio);
    };
  }, [currentSongIndex]); 

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleSongEnd = () => {
    setCurrentSongIndex((prev) => (prev + 1) % SONG_PLAYLIST.length);
  };

  return (
    <div className="absolute top-5 left-16 z-[1000]">
      <audio 
        ref={audioRef} 
        src={SONG_PLAYLIST[currentSongIndex]} 
        onEnded={handleSongEnd} 
      />

      <button 
        onClick={togglePlay}
        className={`backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${isPlaying ? "bg-rose-500/80 text-white animate-pulse" : "bg-black/60 text-gray-300 hover:bg-white/20"}`}
      >
        <span>{isPlaying ? `🎵 Playing Track ${currentSongIndex + 1}` : "🔇 Play Music"}</span>
      </button>
    </div>
  );
};

// --- TYPEWRITER COMPONENT (FIXED SCROLLING) ---
const Typewriter = ({ text, speed = 30 }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText(''); 
    let i = 0;
    const timer = setInterval(() => {
      i++;
      if (i <= text.length) {
        setDisplayedText(text.slice(0, i));
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  // ⚠️ FIXED: Added scrollable container here
  return (
    <div className="max-h-[160px] md:max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
       <p className="text-gray-300 text-sm leading-relaxed min-h-[60px] whitespace-pre-line">
         {displayedText}
       </p>
    </div>
  );
};

// --- MAP CONTROLLER ---
function MapController({ activeMemory }) {
  const map = useMap();
  useEffect(() => {
    if (activeMemory) {
      const targetLat = activeMemory.location[0] - 0.002;
      const targetLng = activeMemory.location[1];
      
      map.flyTo([targetLat, targetLng], 14, { 
        duration: 2.5,
        easeLinearity: 0.25
      });
    }
  }, [activeMemory, map]);
  return null;
}

export default function MemoryMap() {
  const [activeIndex, setActiveIndex] = useState(0); 
  
  // STATES
  const [isFading, setIsFading] = useState(false); 
  const [isShuffling, setIsShuffling] = useState(false); 
  const [expandedImage, setExpandedImage] = useState(null);
  const [isSatellite, setIsSatellite] = useState(false);
  const [imageOrder, setImageOrder] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);

  const activeMemory = memories[activeIndex];
  const router = useRouter(); 

  useEffect(() => {
    if (activeMemory && activeMemory.images) {
      setImageOrder(activeMemory.images);
    } else {
      setImageOrder([]);
    }
    setIsMinimized(false);
  }, [activeMemory]);

  const performShuffle = useCallback(() => {
    setIsShuffling(true); 
    setTimeout(() => {
      setImageOrder((prevOrder) => {
        if (prevOrder.length === 0) return prevOrder;
        const newOrder = [...prevOrder];
        const first = newOrder.shift(); 
        newOrder.push(first);           
        return newOrder;
      });
      setIsShuffling(false); 
    }, 300); 
  }, []);

  useEffect(() => {
    if (!activeMemory?.images || imageOrder.length <= 1) return;
    const timer = setTimeout(() => {
      performShuffle();
    }, 5000); 
    return () => clearTimeout(timer);
  }, [imageOrder, activeMemory, performShuffle]);

  const changeMemory = (newIndex) => {
    setIsFading(true);
    setTimeout(() => {
      setActiveIndex(newIndex);
      setIsFading(false);
    }, 500); 
  };

  const handleNext = useCallback(() => {
    if (activeIndex < memories.length - 1) {
      changeMemory(activeIndex + 1);
    }
  }, [activeIndex]);

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) {
      changeMemory(activeIndex - 1);
    }
  }, [activeIndex]);

  const handleFinalChapter = () => {
    router.push('/unlock');
  };

  const handleShuffleClick = (e) => {
    e.stopPropagation(); 
    performShuffle();
  };

  const openLightbox = () => {
    if (imageOrder.length > 0) {
      setExpandedImage(imageOrder[0]);
    } else if (activeMemory.image) {
      setExpandedImage(activeMemory.image);
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setExpandedImage(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="relative h-screen w-full bg-black">
      
      {/* ADDED STYLE FOR SCROLLBAR */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(225, 29, 72, 0.6); 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(225, 29, 72, 1); 
        }
      `}</style>

      <MusicPlayer />

      <button 
        onClick={() => setIsSatellite(!isSatellite)}
        className="absolute top-5 right-5 z-[1000] bg-black/60 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-white/20 transition-all flex items-center gap-2"
      >
        <span>{isSatellite ? "🌍 Satellite On" : "🌑 Dark Mode"}</span>
      </button>

      {/* LIGHTBOX */}
      {expandedImage && (
        <div 
          className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setExpandedImage(null)}
        >
          <img 
            src={expandedImage} 
            alt="Expanded memory" 
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

      <MapContainer center={memories[0].location} zoom={13} className="h-full w-full z-0">
        {isSatellite ? (
          <TileLayer url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" attribution="Google Maps Satellite" />
        ) : (
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; OpenStreetMap' />
        )}
        <MapController activeMemory={activeMemory} />
        <Polyline 
          positions={memories.map(m => m.location)} 
          pathOptions={{ color: isSatellite ? '#ff3366' : 'pink', dashArray: '10, 10', weight: 3, opacity: 0.8 }} 
        />
        {memories.map((mem, index) => (
          <Marker key={mem.id} position={mem.location} icon={icon} opacity={index === activeIndex ? 1 : 0.4} />
        ))}
      </MapContainer>

      {/* --- UI OVERLAY --- */}
      <div className={`absolute bottom-5 left-1/2 transform -translate-x-1/2 z-[1000] w-11/12 max-w-md transition-all duration-300 ${expandedImage ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        
        {/* CARD CONTAINER */}
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 text-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ease-in-out">
          
          {/* HEADER BAR */}
          <div 
            className="flex justify-between items-center p-4 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-widest text-rose-400 font-bold">
                Memory {activeIndex + 1}/{memories.length}
              </span>
              {isMinimized && (
                <span className="text-sm font-bold truncate max-w-[150px]">{activeMemory.title}</span>
              )}
            </div>
            
            <button className="text-white/70 hover:text-white transition-colors">
              {isMinimized ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
              )}
            </button>
          </div>

          {/* MAIN CONTENT (Added Max Height for Mobile Safety) */}
          <div className={`transition-all duration-500 ease-in-out ${isMinimized ? 'max-h-0 opacity-0' : 'max-h-[85vh] opacity-100'}`}>
            <div className="p-5 pt-0">
              
              <div className={`transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold tracking-tight">{activeMemory.title}</h2>
                  <span className="text-[10px] text-gray-400">{activeMemory.date}</span>
                </div>

                {/* PHOTOS */}
                {activeMemory.images && imageOrder.length > 0 ? (
                  <div className={`transition-opacity duration-300 ease-in-out ${isShuffling ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="relative h-64 w-full mb-6 group select-none">
                        {imageOrder[2] && (
                          <img src={imageOrder[2]} className="absolute top-0 left-0 w-full h-full object-cover rounded-xl border border-white/20 transform translate-x-6 rotate-6 scale-90 opacity-60 z-0 transition-all duration-700 ease-in-out group-hover:translate-x-10 group-hover:rotate-12 group-hover:opacity-80" />
                        )}
                        {imageOrder[1] && (
                          <img src={imageOrder[1]} className="absolute top-0 left-0 w-full h-full object-cover rounded-xl border border-white/20 transform -translate-x-6 -rotate-6 scale-95 opacity-80 z-10 transition-all duration-700 ease-in-out group-hover:-translate-x-10 group-hover:-rotate-12 group-hover:opacity-90" />
                        )}
                        <img src={imageOrder[0]} onClick={handleShuffleClick} className="absolute top-0 left-0 w-full h-full object-cover rounded-xl border-2 border-white shadow-2xl transform translate-x-0 rotate-0 scale-100 z-20 cursor-pointer transition-all duration-700 ease-in-out hover:scale-105" />
                        
                        <div className="absolute bottom-2 right-2 flex gap-2 z-30">
                          <button onClick={handleShuffleClick} className="bg-black/60 text-white p-2 rounded-full backdrop-blur-sm hover:bg-rose-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                          </button>
                          <button onClick={openLightbox} className="bg-black/60 text-white p-2 rounded-full backdrop-blur-sm hover:bg-rose-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0 4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
                          </button>
                        </div>
                    </div>
                  </div>
                ) : activeMemory.image ? (
                  <button onClick={openLightbox} className="mb-5 w-full h-64 block rounded-2xl overflow-hidden border border-white/10 relative group cursor-zoom-in outline-none focus:ring-2 focus:ring-rose-500">
                    <img src={activeMemory.image} alt={activeMemory.title} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-white drop-shadow-lg"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" /></svg>
                    </div>
                  </button>
                ) : null}

                {/* TYPEWRITER TEXT */}
                <Typewriter text={activeMemory.description} speed={30} />
              
              </div> 

              {/* FOOTER BUTTONS */}
              <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-2">
                <button 
                  onClick={handlePrev}
                  disabled={activeIndex === 0}
                  className={`text-xs font-medium transition-colors px-3 py-2 ${activeIndex === 0 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:text-white'}`}
                >
                  ← PREV
                </button>
                
                <button 
                  onClick={activeIndex === memories.length - 1 ? handleFinalChapter : handleNext}
                  className="px-6 py-3 rounded-full text-xs font-bold bg-rose-600 hover:bg-rose-700 transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {activeIndex === memories.length - 1 ? "VIEW OUR PLANS 📅" : "NEXT CHAPTER →"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}