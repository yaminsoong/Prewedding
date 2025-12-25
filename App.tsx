
import React, { useState, useEffect, useRef } from 'react';
import { 
  Mountain, Compass, Tent, Trees, Calendar, MapPin, Clock, Copy, 
  Check, Music, VolumeX, Send, Home, Gift, BookOpen, ExternalLink, 
  User, ChevronDown, Sparkles, Heart, Camera, MessageSquareQuote
} from 'lucide-react';
import { getWeddingQuote } from './services/geminiService';
import { Wish } from './types';

const WEDDING_DATA = {
  groom: {
    name: "Yamin",
    fullName: "Ahmad Askhabul Yamin",
    father: "Bpk. Moh. Hasan",
    mother: "Ibu Sofiah",
    accountNumber: "3452812212",
    bankName: "BCA",
    phone: "6285156684814" // Nomor WhatsApp Yamin
  },
  bride: {
    name: "Anisa",
    fullName: "Anisah Permata Sari",
    father: "Bpk. Siman",
    mother: "Ibu Titin",
    accountNumber: "108286626",
    bankName: "BCA"
  },
  date: "2025-12-29T09:00:00",
  time: "09:00 WIB - Selesai",
  location: "Wonogiri, Jawa Tengah",
  mapsLink: "https://www.google.com/maps/@-7.8186481,111.2283822,3a,75y,227.1h,90t/data=!3m7!1e1!3m5!1sSSpFLhRnf46o7q6viYllbA!2e0",
  adventurePlace: "Gayatri Citeko Puncak"
};

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [quote, setQuote] = useState<string>("");
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [wishes, setWishes] = useState<Wish[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch AI Quote and Local Wishes
  useEffect(() => {
    if (isOpen) {
      const fetchInitialData = async () => {
        try {
          const q = await getWeddingQuote(WEDDING_DATA.groom.name, WEDDING_DATA.bride.name);
          setQuote(q);
          
          const res = await fetch('/api/wishes');
          if (res.ok) {
            const data = await res.json();
            setWishes(data);
          }
        } catch (e) {
          console.error("Error fetching data:", e);
        }
      };
      fetchInitialData();
    }
  }, [isOpen]);

  // Audio Sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Countdown Logic
  useEffect(() => {
    const timer = setInterval(() => {
      const target = new Date(WEDDING_DATA.date).getTime();
      const now = new Date().getTime();
      const diff = target - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    setIsMuted(false);
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.warn("Autoplay blocked. User interaction required.", err);
      });
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(text);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const handleSubmitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Post to local API
    try {
      const response = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const updatedWishes = await response.json();
        setWishes(updatedWishes);
      }
    } catch (err) {
      console.error("Gagal menyimpan ucapan ke server:", err);
    }

    // 2. Open WhatsApp as primary interaction
    const waMessage = `Halo Yamin & Anisa! Saya ${formData.name}. %0A%0A"${formData.message}" %0A%0ASelamat menempuh perjalanan baru! 🏔️✨`;
    const waUrl = `https://wa.me/${WEDDING_DATA.groom.phone}?text=${waMessage}`;
    window.open(waUrl, '_blank');
    
    setFormData({ name: '', message: '' });
  };

  if (!isOpen) {
    return (
      <div className="fixed inset-0 z-[1000] bg-[#1a2e15] flex flex-col items-center justify-center p-6 text-center text-white overflow-hidden">
        <audio ref={audioRef} src="romantic_journey.mp3" loop />
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center animate-slow-zoom"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e15] via-transparent to-transparent"></div>
        
        <div className="relative z-10 space-y-12 max-w-lg px-4">
           <div className="space-y-4 animate-fade-in-up">
              <div className="flex justify-center gap-4 mb-2">
                 <Mountain className="text-earth" size={20} />
                 <Compass className="text-earth animate-spin-slow" size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.8em] text-earth block">The Final Peak</span>
              <h1 className="text-6xl md:text-8xl font-serif tracking-tighter leading-none">
                {WEDDING_DATA.groom.name} <span className="font-handwriting text-earth text-4xl md:text-6xl block my-2">&</span> {WEDDING_DATA.bride.name}
              </h1>
              <div className="h-[2px] w-24 bg-earth/50 mx-auto"></div>
           </div>
           
           <div className="space-y-10 animate-fade-in delay-500">
              <p className="font-cormorant italic text-xl md:text-2xl text-slate-200 leading-relaxed">
                "Dungo Lelah, Mugo Iso Dadi Lillah."
              </p>
              <button 
                onClick={handleOpenInvitation}
                className="btn-adventure group relative px-12 py-5 rounded-full font-black uppercase tracking-[0.3em] text-[10px] active:scale-95 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">Buka Undangan <ChevronDown size={14} /></span>
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative selection:bg-earth/30 pb-24">
      <audio ref={audioRef} src="romantic_journey.mp3" loop />
      
      {/* Audio UI Control */}
      <div className="fixed top-6 right-6 z-[600]">
        <button 
          onClick={() => setIsMuted(!isMuted)} 
          className={`w-12 h-12 glass rounded-full flex items-center justify-center shadow-xl transition-all ${!isMuted ? 'music-pulse border-forest/30' : 'opacity-80'}`}
        >
          {isMuted ? <VolumeX size={18} className="text-slate-400" /> : <Music size={18} className="text-forest animate-bounce" />}
        </button>
      </div>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-sky opacity-50 section-curve"></div>
        
        <div className="space-y-12 md:space-y-20 z-10 w-full animate-fade-in">
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 text-moss">
              <Trees size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Basecamp Cinta</span>
              <Trees size={16} />
            </div>
            <h2 className="text-7xl md:text-9xl font-serif text-forest tracking-tighter uppercase leading-none">YAMIN</h2>
            <div className="relative inline-block my-2">
               <Heart className="text-earth fill-earth animate-pulse mx-auto" size={32} />
               <span className="font-handwriting text-6xl text-moss absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">&</span>
            </div>
            <h2 className="text-7xl md:text-9xl font-serif text-forest tracking-tighter uppercase leading-none">ANISA</h2>
          </div>

          <div className="space-y-10 max-w-2xl mx-auto">
             <div className="image-frame mx-auto w-64 md:w-80 h-80 md:h-96 overflow-hidden bg-slate-200">
                <img src="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=2070" className="w-full h-full object-cover" alt="Prewedding" />
             </div>
             <p className="font-cormorant italic text-2xl md:text-4xl text-moss px-6 leading-tight">
               "{quote || "Mendaki ribuan langkah, menuju satu rida-Nya."}"
             </p>
             
             <div className="flex gap-4 md:gap-8 justify-center items-center bg-forest/5 p-6 rounded-3xl max-w-md mx-auto">
                <CountUnit val={timeLeft.days} label="Hari" />
                <div className="h-8 w-[1px] bg-forest/20"></div>
                <CountUnit val={timeLeft.hours} label="Jam" />
                <div className="h-8 w-[1px] bg-forest/20"></div>
                <CountUnit val={timeLeft.minutes} label="Menit" />
                <div className="h-8 w-[1px] bg-forest/20"></div>
                <CountUnit val={timeLeft.seconds} label="Detik" />
             </div>
          </div>
        </div>
      </section>

      {/* Couple Section */}
      <section id="couple" className="py-32 px-6 max-w-6xl mx-auto relative">
        <div className="text-center mb-24 space-y-4">
           <p className="text-[10px] uppercase font-black tracking-[1em] text-earth">Our Traveling Team</p>
           <h3 className="text-5xl md:text-6xl font-serif text-forest uppercase">Teman Seperjalanan</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-24 items-start">
          <Profile groom name={WEDDING_DATA.groom.fullName} father={WEDDING_DATA.groom.father} mother={WEDDING_DATA.groom.mother} />
          <Profile name={WEDDING_DATA.bride.fullName} father={WEDDING_DATA.bride.father} mother={WEDDING_DATA.bride.mother} />
        </div>
      </section>

      {/* Itinerary Section */}
      <section id="event" className="py-32 px-4 bg-forest text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10 rotate-12 -translate-y-12">
           <Mountain size={400} />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
           <div className="text-center space-y-16">
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-[1em] text-earth">Adventure Itinerary</span>
                <h3 className="text-6xl font-serif uppercase tracking-tighter">Akad & Syukuran</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-12 border-y border-white/10 py-16">
                 <EventItem icon={Calendar} label="Summit Day" val="Senin, 29 Des 2025" />
                 <EventItem icon={Clock} label="Check-in Time" val={WEDDING_DATA.time} />
                 <EventItem icon={MapPin} label="Basecamp" val={WEDDING_DATA.location} />
              </div>

              <div className="space-y-8">
                 <p className="font-cormorant italic text-2xl text-slate-300 max-w-xl mx-auto">
                   "Puncak bukanlah tujuan utama, rida-Nya adalah yang paling baka."
                 </p>
                 <a href={WEDDING_DATA.mapsLink} target="_blank" className="btn-adventure inline-flex px-12 py-6 rounded-full font-black uppercase tracking-[0.4em] text-[10px] items-center gap-4 transition-all">
                   Navigasi GPS <Compass size={16} />
                 </a>
              </div>
           </div>
        </div>
      </section>

      {/* Gift Section */}
      <section id="gift" className="py-32 px-6 max-w-4xl mx-auto text-center space-y-16">
        <div className="space-y-4">
           <Gift className="mx-auto text-earth" size={32} />
           <h3 className="text-5xl font-handwriting text-forest">Digital Gift</h3>
           <p className="text-[10px] uppercase font-black tracking-widest text-moss">Terima kasih atas tanda cinta Anda</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
           <GiftCard bank="BCA" no={WEDDING_DATA.groom.accountNumber} name={WEDDING_DATA.groom.fullName} onCopy={() => handleCopy(WEDDING_DATA.groom.accountNumber!)} copied={copiedAccount === WEDDING_DATA.groom.accountNumber} />
           <GiftCard bank="BCA" no={WEDDING_DATA.bride.accountNumber} name={WEDDING_DATA.bride.fullName} onCopy={() => handleCopy(WEDDING_DATA.bride.accountNumber!)} copied={copiedAccount === WEDDING_DATA.bride.accountNumber} />
        </div>
      </section>

      {/* Wishes Section */}
      <section id="wishes" className="py-32 px-6 bg-white relative">
        <div className="max-w-4xl mx-auto space-y-20 relative z-10">
          <div className="text-center space-y-4">
             <BookOpen className="mx-auto text-earth" size={40} />
             <h3 className="text-4xl font-serif uppercase text-forest">Pesan & Doa</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 items-start">
             {/* Form */}
             <form onSubmit={handleSubmitWish} className="space-y-8 glass p-10 rounded-[2.5rem] shadow-xl border-earth/20 sticky top-24">
                <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase tracking-widest text-moss ml-4">Nama Sahabat</label>
                   <input type="text" placeholder="Nama anda..." required className="w-full px-6 py-4 bg-transparent border-b border-forest/10 outline-none font-serif text-2xl focus:border-earth transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase tracking-widest text-moss ml-4">Doa & Harapan</label>
                   <textarea placeholder="Tuliskan doa anda..." required rows={3} className="w-full px-6 py-4 bg-transparent border-b border-forest/10 outline-none font-serif text-2xl resize-none focus:border-earth transition-all" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                </div>
                <button className="w-full py-7 btn-adventure rounded-full font-black uppercase tracking-[0.5em] text-[10px] flex items-center justify-center gap-4">
                   Kirim & Doakan <Send size={16} />
                </button>
             </form>

             {/* List Ucapan */}
             <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                {wishes.length > 0 ? wishes.map((w) => (
                   <div key={w.id} className="p-8 bg-sky/50 rounded-3xl space-y-4 border border-white">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center font-black text-xs">
                            {w.name.charAt(0).toUpperCase()}
                         </div>
                         <div>
                            <p className="font-bold text-forest text-sm">{w.name}</p>
                            <p className="text-[9px] text-moss uppercase tracking-widest">{new Date(w.createdAt).toLocaleDateString('id-ID')}</p>
                         </div>
                      </div>
                      <p className="font-cormorant text-lg text-moss italic">"{w.message}"</p>
                   </div>
                )) : (
                   <div className="text-center py-20 opacity-30 italic">Belum ada ucapan...</div>
                )}
             </div>
          </div>
        </div>
      </section>

      {/* Floating Bottom Nav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[500] w-[90%] max-w-sm">
        <div className="glass shadow-2xl rounded-full px-8 py-4 flex justify-between items-center border-forest/10">
          <NavItem icon={Home} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} />
          <NavItem icon={User} onClick={() => document.getElementById('couple')?.scrollIntoView({behavior: 'smooth'})} />
          <NavItem icon={Calendar} onClick={() => document.getElementById('event')?.scrollIntoView({behavior: 'smooth'})} />
          <NavItem icon={Gift} onClick={() => document.getElementById('gift')?.scrollIntoView({behavior: 'smooth'})} />
          <NavItem icon={BookOpen} onClick={() => document.getElementById('wishes')?.scrollIntoView({behavior: 'smooth'})} />
        </div>
      </div>

      <footer className="py-40 text-center bg-sky">
        <div className="space-y-12">
          <div className="flex flex-col items-center gap-4">
            <Compass className="text-earth animate-spin-slow" size={48} />
            <h4 className="text-7xl md:text-8xl font-handwriting text-forest">{WEDDING_DATA.groom.name} & {WEDDING_DATA.bride.name}</h4>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-earth">#TheFinalPeakYaminAnisa</p>
        </div>
      </footer>
    </div>
  );
};

// Sub-Components
const Profile = ({ groom, name, father, mother }: any) => (
  <div className={`flex flex-col items-center text-center group ${!groom ? 'md:mt-32' : ''}`}>
     <div className={`w-full max-w-[300px] mb-12 image-frame ${groom ? 'rotate-1' : '-rotate-1'}`}>
        <div className="aspect-[3/4] bg-slate-100 overflow-hidden">
          <img src={groom ? "https://picsum.photos/seed/groom/600/800" : "https://picsum.photos/seed/bride/600/800"} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={name} />
        </div>
     </div>
     <div className="space-y-4">
        <h4 className="text-4xl font-serif text-forest uppercase leading-none">{name}</h4>
        <div className="h-[1px] w-12 bg-earth mx-auto"></div>
        <p className="font-cormorant text-xl text-moss">Putra/Putri dari<br/><span className="font-bold text-forest">{father} & {mother}</span></p>
     </div>
  </div>
);

const NavItem = ({ icon: Icon, onClick }: any) => (
  <button onClick={onClick} className="text-moss hover:text-earth transition-all transform active:scale-90 p-2">
    <Icon size={20} strokeWidth={2.5} />
  </button>
);

const CountUnit = ({ val, label }: any) => (
  <div className="flex flex-col items-center min-w-[60px]">
    <span className="text-4xl md:text-5xl font-serif text-forest font-bold">{val.toString().padStart(2, '0')}</span>
    <span className="text-[8px] font-black uppercase tracking-widest text-earth mt-1">{label}</span>
  </div>
);

const EventItem = ({ icon: Icon, label, val }: any) => (
  <div className="space-y-4 group">
    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
      <Icon size={24} className="text-earth" />
    </div>
    <div className="space-y-1">
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="font-serif text-xl">{val}</p>
    </div>
  </div>
);

const GiftCard = ({ bank, no, name, onCopy, copied }: any) => (
  <div className="glass p-10 rounded-[2.5rem] text-left space-y-8 shadow-sm group hover:border-earth/40 transition-all cursor-pointer" onClick={onCopy}>
     <div className="flex justify-between items-center">
        <span className="px-5 py-2 bg-forest text-white rounded-xl text-[9px] font-black uppercase tracking-widest">{bank}</span>
        <div className={`p-4 rounded-xl transition-all ${copied ? 'bg-green-600 text-white' : 'bg-slate-100 text-moss group-hover:bg-earth group-hover:text-white'}`}>
           {copied ? <Check size={18} /> : <Copy size={18} />}
        </div>
     </div>
     <div className="space-y-2">
        <p className="text-3xl font-serif font-bold tracking-wider text-forest">{no}</p>
        <p className="text-[9px] font-black text-moss uppercase tracking-widest opacity-60">A.N {name}</p>
     </div>
  </div>
);

export default App;
