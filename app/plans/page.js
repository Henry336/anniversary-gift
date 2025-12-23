'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { Playfair_Display } from 'next/font/google';
import confetti from 'canvas-confetti';

// 👇 Your working import path
import MusicPlayer from '../../components/MusicPlayer';

const playfair = Playfair_Display({ subsets: ['latin'] });

// 👇 EDIT YOUR TITLE AND SUBTITLE HERE
const PAGE_TITLE = "Anniversary Date Plan";
const PAGE_SUBTITLE = "အိမ့်မှူးငယ် ❤️ ဟိန်းလင်းထက်";

const PLAN_DATA = [
  { icon: "🍫", title: "Snack Review", description: "ကိုကိုပေးလိုက်တဲ့ မုန့်တွေ သဲသဲတစ်ခုချင်းစားကြည့်ပြီး review ပေးမယ်၊ ကိုကိုလည်း မစားဖူးတဲ့မုန့်တွေဝယ်ထားပြီး review ပေးမယ် 😋🍽️" },
  { icon: "🗺️", title: "Memory Lane", description: "ဒါက သဲသဲအခုလေးပဲကြည့်ပြီးသွားတဲ့ Chapter 10 ခု😙❤️" },
  { icon: "🍜", title: "Dinner: Buldak Noodles!", description: "Carbonara Buldak ခေါက်ဆွဲတူတူစားကြမယ်❤️ (သဲသဲ သောက်စရာတစ်ခုခုယူထားသင့်တယ်၊ နို့ဖြစ်ဖြစ်)" },
  { icon: "🌍", title: "Future Tour", description: "ကိုကို zoom ကနေခေါ်ပြီး screen-share မယ်၊ ပြီးရင် ကိုကိုတို့ လည်ချင်တဲ့နေရာတွေကို လိုက်ကြည့်ကြမယ် အတူတူ🌎" },
  { icon: "🍿", title: "Movie Date", description: "ကိုကိုတို့မွေးတဲ့ 2006 ခုနှစ်က ဇာတ်ကားတစ်ခုကြည့်ကြမယ်📺 သဲသဲရော ကိုကိုရော ဇာတ်ကားကိုရှာပြီး တစ်ပြိုင်တည်း play နှိပ်ရမယ်" },
  { icon: "🎮", title: "Tic-tac-toe", description: "ဒီမှာ tic-tac-toe တူတူဆော့လို့ရပါတယ်ဗျ🧩", link: "/game" },
  { icon: "📹", title: "Video Call...", description: "🤫🤫🤫" },
  { icon: "📝", title: "Our 'Travel' Bucket List", description: "သဲသဲ Singapore ကို လာလည်ရင် ကိုကိုတို့နှစ်ယောက် သွားကိုသွားရမယ့် နေရာ ၃ နေရာ ရေးကြမယ်😋" }
];

export default function Plans() {
  const [stars, setStars] = useState([]);
  const [completed, setCompleted] = useState([]); 
  const router = useRouter(); 

  useEffect(() => {
    const generatedStars = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 5}s`
    }));
    setStars(generatedStars);
  }, []);

  const togglePlan = (index, event) => {
    const isChecking = !completed.includes(index);
    if (isChecking) {
      setCompleted([...completed, index]);
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({ particleCount: 50, spread: 70, origin: { x, y }, colors: ['#fb7185', '#a78bfa', '#ffffff'], zIndex: 9999 });
    } else {
      setCompleted(completed.filter(i => i !== index)); 
    }
  };

  const handleGameClick = (e, link) => {
    e.stopPropagation(); 
    router.push(link);
  };

  return (
    <div className={`min-h-screen w-full bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#2e1065] to-black text-white relative overflow-hidden ${playfair.className}`}>
      
      {/* Background Stars */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {stars.map((star) => (
          <div key={star.id} className="absolute bg-white rounded-full animate-pulse"
            style={{ top: star.top, left: star.left, width: `${star.size}px`, height: `${star.size}px`, animationDuration: star.animationDuration, animationDelay: star.animationDelay }} />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-20">
        <div className="text-center mb-16 animate-fade-in-down">
          {/* 👇 Using the variables here now */}
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-white to-violet-200 drop-shadow-sm">
            {PAGE_TITLE}
          </h1>
          <p className="text-purple-200/80 text-sm tracking-[0.3em] uppercase font-sans">
            {PAGE_SUBTITLE}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {PLAN_DATA.map((plan, index) => {
            const isDone = completed.includes(index);
            return (
              <div key={index} onClick={(e) => togglePlan(index, e)}
                className={`relative border rounded-2xl p-6 flex items-center gap-6 cursor-pointer transition-all duration-300 group opacity-0 animate-drop-in select-none ${isDone ? 'bg-green-500/10 border-green-500/50 scale-[0.98]' : 'bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 hover:scale-105'}`}
                style={{ animationDelay: `${index * 0.2}s`, animationFillMode: 'forwards' }}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-inner transition-colors shrink-0 ${isDone ? 'bg-green-500/20 grayscale-0' : 'bg-white/10 group-hover:bg-white/20'}`}>
                  {isDone ? '✅' : plan.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold mb-1 transition-all ${isDone ? 'text-green-200 line-through decoration-green-500/50' : 'text-rose-100'}`}>{plan.title}</h3>
                  <p className={`text-sm font-sans font-light leading-relaxed transition-all ${isDone ? 'text-green-200/60 line-through' : 'text-gray-300'}`}>{plan.description}</p>
                  {plan.link && (
                    <button onClick={(e) => handleGameClick(e, plan.link)} className="mt-3 px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-full tracking-wider transition-colors shadow-lg">PLAY NOW →</button>
                  )}
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isDone ? 'bg-green-500 border-green-500' : 'border-white/30 group-hover:border-white'}`}>
                  {isDone && <span className="text-black text-xs font-bold">✓</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Music Player Component */}
      <MusicPlayer />
      
      <style jsx>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-drop-in {
          animation: dropIn 0.8s ease-out;
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fadeInDown 1s ease-out;
        }
      `}</style>

    </div>
  );
}