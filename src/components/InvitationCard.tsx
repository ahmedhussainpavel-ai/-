import React from 'react';
import { Calendar, MapPin, Clock, Heart, Sparkles } from 'lucide-react';
import { InvitationData, LanguageMode, CardTheme } from '../types';

interface InvitationCardProps {
  data: InvitationData;
  lang: LanguageMode;
  theme: CardTheme;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export default function InvitationCard({ data, lang, theme, cardRef }: InvitationCardProps) {
  // Theme styling configurations using pure standard HEX and RGBA values
  // This guarantees html2canvas parses color computedStyles perfectly, bypassing modern browser oklch/oklab conversions.
  const getThemeHexStyles = () => {
    switch (theme) {
      case 'royal-dark':
        return {
          textColor: '#F5F5F5', // neutral light gray
          goldColor: '#F59E0B', // amber-500 equivalent
          matteColor: '#D97706', // amber-600 equivalent
          brightColor: '#FBBF24', // amber-400 equivalent
          velvet: 'radial-gradient(circle at 50% 50%, #171717 0%, #0a0a0a 100%)',
          borderColor: 'rgba(217, 119, 6, 0.4)', // amber-600 with opacity
          innerBorderColor: 'rgba(217, 119, 6, 0.15)',
          cardBg: 'rgba(23, 23, 23, 0.85)',
          badgeBg: 'rgba(217, 119, 6, 0.2)',
          slate300: '#D4D4D4',
          slate400: '#A3A3A3',
          glow: 'rgba(245, 158, 11, 0.15)',
        };
      case 'ivory-gold':
        return {
          textColor: '#1E293B', // slate dark gray
          goldColor: '#B45309', // amber-700 equivalent
          matteColor: '#92400E', // amber-800 equivalent
          brightColor: '#D97706', // amber-600 equivalent
          velvet: 'radial-gradient(circle at 50% 50%, #fdfbf7 0%, #f5f0e6 100%)',
          borderColor: 'rgba(180, 120, 40, 0.4)', // amber gold with opacity
          innerBorderColor: 'rgba(180, 120, 40, 0.15)',
          cardBg: 'rgba(255, 255, 255, 0.9)',
          badgeBg: 'rgba(180, 120, 40, 0.15)',
          slate300: '#475569',
          slate400: '#64748B',
          glow: 'rgba(180, 120, 40, 0.08)',
        };
      case 'crimson-gold':
        return {
          textColor: '#FFF1F2', // rose-50 equivalent
          goldColor: '#FBBF24', // amber-400 equivalent
          matteColor: '#C5A059', // gold-matte
          brightColor: '#F4D068', // gold-bright
          velvet: 'radial-gradient(circle at 50% 50%, #5c061d 0%, #2a020b 100%)',
          borderColor: 'rgba(212, 175, 55, 0.4)', // gold royal equivalent
          innerBorderColor: 'rgba(212, 175, 55, 0.15)',
          cardBg: 'rgba(92, 6, 29, 0.85)',
          badgeBg: 'rgba(212, 175, 55, 0.2)',
          slate300: '#FECDD3', // rose-200 equivalent
          slate400: '#FDA4AF', // rose-300 equivalent
          glow: 'rgba(244, 63, 94, 0.15)',
        };
      case 'emerald-gold':
      default:
        return {
          textColor: '#FFFDF5', // custom off-white
          goldColor: '#D4AF37', // gold-royal
          matteColor: '#C5A059', // gold-matte
          brightColor: '#F4D068', // gold-bright
          velvet: 'radial-gradient(circle at 50% 50%, #08382d 0%, #031410 100%)',
          borderColor: 'rgba(212, 175, 55, 0.4)', // gold royal equivalent
          innerBorderColor: 'rgba(212, 175, 55, 0.15)',
          cardBg: 'rgba(6, 47, 37, 0.85)',
          badgeBg: 'rgba(212, 175, 55, 0.2)',
          slate300: '#E2E8F0', // slate-200 equivalent
          slate400: '#94A3B8', // slate-400 equivalent
          glow: 'rgba(212, 175, 55, 0.2)',
        };
    }
  };

  const hex = getThemeHexStyles();

  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false,
  });

  React.useEffect(() => {
    // 2026-06-19T11:30:00+06:00 is Bangladesh local wedding date
    const targetDate = new Date('2026-06-19T11:30:00+06:00').getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isCompleted: false });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  const getLabel = (unit: 'days' | 'hours' | 'minutes' | 'seconds') => {
    if (lang === 'bn') {
      switch (unit) {
        case 'days': return 'দিন';
        case 'hours': return 'ঘণ্টা';
        case 'minutes': return 'মি.';
        case 'seconds': return 'সে.';
      }
    } else if (lang === 'bilingual') {
      switch (unit) {
        case 'days': return 'd/দিন';
        case 'hours': return 'h/ঘণ্টা';
        case 'minutes': return 'm/মি.';
        case 'seconds': return 's/সে.';
      }
    } else {
      switch (unit) {
        case 'days': return 'd';
        case 'hours': return 'h';
        case 'minutes': return 'm';
        case 'seconds': return 's';
      }
    }
  };

  // Helper for conditional rendering based on language mode
  const renderEn = (node: React.ReactNode) => (lang === 'en' || lang === 'bilingual' ? node : null);
  const renderBn = (node: React.ReactNode) => (lang === 'bn' || lang === 'bilingual' ? node : null);

  return (
    <div
      id="invitation-card-container"
      ref={cardRef}
      className="relative w-full max-w-[550px] aspect-[4/5] overflow-hidden rounded-xl border-4 p-4 sm:p-6 md:p-8 flex flex-col justify-between select-none animate-fade-slide-up"
      style={{ 
        background: hex.velvet,
        borderColor: hex.goldColor,
        boxShadow: `0 0 25px ${hex.glow}, inset 0 0 25px ${hex.glow}`,
        color: hex.textColor 
      }}
    >
      {/* Decorative Corner Borders - Ultra Premium Vector SVGs */}
      <svg className="absolute top-0 left-0 w-16 h-16 pointer-events-none" style={{ color: hex.goldColor }} viewBox="0 0 100 100">
        <path d="M 10,10 L 10,40 L 15,40 L 15,15 L 40,15 L 40,10 Z" fill="currentColor" />
        <path d="M 22,22 L 22,35 L 25,35 L 25,25 L 35,25 L 35,22 Z" fill="currentColor" opacity="0.6" />
        <circle cx="10" cy="10" r="3" fill="currentColor" />
      </svg>
      <svg className="absolute top-0 right-0 w-16 h-16 pointer-events-none transform rotate-90" style={{ color: hex.goldColor }} viewBox="0 0 100 100">
        <path d="M 10,10 L 10,40 L 15,40 L 15,15 L 40,15 L 40,10 Z" fill="currentColor" />
        <circle cx="10" cy="10" r="3" fill="currentColor" />
      </svg>
      <svg className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none transform -rotate-90" style={{ color: hex.goldColor }} viewBox="0 0 100 100">
        <path d="M 10,10 L 10,40 L 15,40 L 15,15 L 40,15 L 40,10 Z" fill="currentColor" />
        <circle cx="10" cy="10" r="3" fill="currentColor" />
      </svg>
      <svg className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none transform rotate-180" style={{ color: hex.goldColor }} viewBox="0 0 100 100">
        <path d="M 10,10 L 10,40 L 15,40 L 15,15 L 40,15 L 40,10 Z" fill="currentColor" />
        <circle cx="10" cy="10" r="3" fill="currentColor" />
      </svg>

      {/* Decorative Arch Backdrop Silhouette */}
      <div className="absolute inset-x-6 inset-y-6 rounded-full opacity-60 pointer-events-none scale-[1.03] transform rotate-45 border" style={{ borderColor: hex.innerBorderColor }} />
      <div className="absolute inset-x-8 inset-y-12 rounded-lg pointer-events-none border" style={{ borderColor: hex.innerBorderColor }} />
      
      {/* Decorative Mandala Silhouette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 rounded-full pointer-events-none animate-slow-spin flex items-center justify-center" style={{ borderColor: hex.innerBorderColor }}>
        <div className="w-72 h-72 border border-dashed rounded-full" style={{ borderColor: hex.innerBorderColor }} />
        <div className="w-64 h-64 border rounded-full transform rotate-45" style={{ borderColor: hex.innerBorderColor }} />
      </div>

      {/* Top Header Section */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Calligraphy Star / Crescent Symbol */}
        <div className="mb-2">
          <svg className="w-8 h-8 animate-pulse-gold" style={{ color: hex.goldColor }} viewBox="0 0 100 100">
            <path d="M 50,15 Q 60,35 60,50 Q 60,65 50,85 Q 40,65 40,50 Q 40,35 50,15 Z" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M 15,50 Q 35,60 50,60 Q 65,60 85,50 Q 65,40 50,40 Q 35,40 15,50 Z" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="50" r="8" fill="currentColor" />
          </svg>
        </div>

        {/* Bismillah Calligraphy */}
        <div className="w-full flex justify-center py-1">
          <span 
            className="font-serif font-semibold italic tracking-wide select-none text-xl sm:text-2xl cursor-default"
            style={{ color: hex.brightColor }}
            title="Bismillahir Rahmanir Rahim"
          >
            {data.quranArabic && "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ"}
          </span>
        </div>
        
        {/* Bilingual Bismillah Subtitle */}
        {renderEn(
          <p className="text-[9px] tracking-wider uppercase" style={{ color: hex.matteColor }}>
            {data.bismillahEn}
          </p>
        )}
        {renderBn(
          <p className="text-[10px] font-serif mt-0.5" style={{ color: hex.matteColor }}>
            {data.bismillahBn}
          </p>
        )}

        {/* Royal Countdown Timer */}
        <div className="mt-2.5 flex items-center justify-center">
          {timeLeft.isCompleted ? (
            <div className="px-3 py-1.5 rounded-full border text-[9px] uppercase tracking-wider font-semibold animate-pulse-gold" 
                 style={{ backgroundColor: hex.badgeBg, borderColor: hex.borderColor, color: hex.brightColor }}>
              ✨ {lang === 'bn' ? 'শুভ বিবাহের পবিত্র সময় উপস্থিত!' : lang === 'bilingual' ? 'Wedding Day Arrived / বিবাহের শুভ ক্ষণ!' : 'The Auspicious Wedding Day has Arrived!'} ✨
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-[#031410]/45 px-3 py-1 rounded-full border text-[9px] font-sans" 
                 style={{ borderColor: hex.innerBorderColor }}>
              <span className="text-[8px] uppercase tracking-wider font-semibold mr-1" style={{ color: hex.slate400 }}>
                {lang === 'bn' ? 'বাকি:' : lang === 'bilingual' ? 'Countdown / বাকি:' : 'Countdown:'}
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-[10px] sm:text-xs">
                <span className="font-mono font-bold text-gold-bright" style={{ color: hex.brightColor }}>
                  {timeLeft.days.toString().padStart(2, '0')}
                </span>
                <span className="text-[8px] text-slate-400 font-medium" style={{ color: hex.slate400 }}>
                  {getLabel('days')}
                </span>
                
                <span style={{ color: hex.innerBorderColor }} className="text-[10px] sm:text-xs">:</span>
                
                <span className="font-mono font-bold text-gold-bright" style={{ color: hex.brightColor }}>
                  {timeLeft.hours.toString().padStart(2, '0')}
                </span>
                <span className="text-[8px] text-slate-400 font-medium" style={{ color: hex.slate400 }}>
                  {getLabel('hours')}
                </span>
                
                <span style={{ color: hex.innerBorderColor }} className="text-[10px] sm:text-xs">:</span>
                
                <span className="font-mono font-bold text-gold-bright" style={{ color: hex.brightColor }}>
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </span>
                <span className="text-[8px] text-slate-400 font-medium" style={{ color: hex.slate400 }}>
                  {getLabel('minutes')}
                </span>

                <span style={{ color: hex.innerBorderColor }} className="text-[10px] sm:text-xs">:</span>

                <span className="font-mono font-bold text-gold-royal animate-pulse" style={{ color: hex.goldColor }}>
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </span>
                <span className="text-[8px] text-slate-400 font-medium animate-pulse" style={{ color: hex.slate400 }}>
                  {getLabel('seconds')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modern Center Arch Overlay (Details Box) */}
      <div className="relative z-10 flex-grow my-3 flex flex-col justify-center items-center px-1">
        
        {/* Quran Verse Module */}
        <div className="text-center max-w-md p-2 sm:p-3 rounded-lg backdrop-blur-[2px] mb-3 border font-serif" style={{ backgroundColor: hex.cardBg, borderColor: hex.innerBorderColor }}>
          <p className="text-[10px] sm:text-xs leading-relaxed tracking-wide italic leading-normal mb-1" style={{ color: hex.brightColor }}>
            " {data.quranArabic} "
          </p>
          {renderEn(
            <p className="font-sans text-[8px] sm:text-[10px] italic px-1" style={{ color: hex.slate300 }}>
              "{data.quranEn}" <span style={{ color: hex.matteColor }} className="font-serif text-[8px] sm:text-[9px]">(Quran 30:21)</span>
            </p>
          )}
          {renderBn(
            <p className="font-serif text-[9px] sm:text-[11px] px-1 mt-0.5 leading-relaxed" style={{ color: hex.slate300 }}>
              "{data.quranBn}" <span style={{ color: hex.matteColor }} className="text-[9px] sm:text-[10px]">(সূরা আর-রূম ৩০:২১)</span>
            </p>
          )}
        </div>

        {/* Invitation Greet Label */}
        <div className="text-center mb-2">
          {renderEn(
            <p className="font-display text-[9px] tracking-widest uppercase font-medium" style={{ color: hex.goldColor }}>
              ✨ Wedding Invitation ✨
            </p>
          )}
          {renderBn(
            <p className="font-serif text-[12px] font-semibold mt-0.5" style={{ color: hex.goldColor }}>
              🕌 বিবাহের বরযাত্রা ও ওয়ালিমা আসর 🕌
            </p>
          )}
        </div>

        {/* Bride & Groom Block */}
        <div className="w-full flex items-center justify-center gap-1 sm:gap-3 py-1 my-1 border-y" style={{ borderColor: hex.borderColor }}>
          {/* Groom Container */}
          <div className="flex-1 text-center pr-1 sm:pr-2 border-r" style={{ borderColor: hex.innerBorderColor }}>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-sans block" style={{ color: hex.slate300 }}>
              {lang === 'bn' ? 'বর' : 'Groom'}
            </span>
            <h3 className="font-display font-bold text-sm sm:text-lg mt-0.5 tracking-tight" style={{ color: hex.brightColor }}>
              {lang === 'bn' ? data.groom.nameBn : data.groom.nameEn}
            </h3>
            
            {/* Parents Bio */}
            <div className="mt-1 text-[8px] sm:text-[9px] leading-tight" style={{ color: hex.slate400 }}>
              <p>
                {lang === 'bn' ? 'পিতা: ' : 'Father: '}
                <span style={{ color: hex.slate300 }}>{lang === 'bn' ? data.groom.fatherBn : data.groom.fatherEn}</span>
              </p>
              <p className="mt-0.5">
                {lang === 'bn' ? 'মাতা: ' : 'Mother: '}
                <span style={{ color: hex.slate300 }}>{lang === 'bn' ? data.groom.motherBn : data.groom.motherEn}</span>
              </p>
              <p className="text-[7px] sm:text-[8px] mt-1 uppercase italic" style={{ color: hex.matteColor }}>
                {lang === 'bn' ? `ঠিকানা: শাহপরান, ধনকান্দি, সিলেট` : `${data.groom.villEn}, Sylhet`}
              </p>
            </div>
          </div>

          {/* Interlocking Symbol */}
          <div className="flex flex-col items-center justify-center min-w-[24px]">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full shadow-inner border" style={{ backgroundColor: hex.badgeBg, borderColor: hex.borderColor }}>
              <Heart className="h-4 w-4 animate-pulse" style={{ color: hex.goldColor }} />
            </span>
            <span className="text-[8px] uppercase tracking-widest mt-1 font-semibold" style={{ color: hex.matteColor }}>
              {lang === 'bn' ? 'সঙ্গিনী' : 'Weds'}
            </span>
          </div>

          {/* Bride Container */}
          <div className="flex-1 text-center pl-1 sm:pl-2">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-sans block" style={{ color: hex.slate300 }}>
              {lang === 'bn' ? 'কনে' : 'Bride'}
            </span>
            <h3 className="font-display font-bold text-sm sm:text-lg mt-0.5 tracking-tight" style={{ color: hex.brightColor }}>
              {lang === 'bn' ? data.bride.nameBn : data.bride.nameEn}
            </h3>
            
            {/* Parents Bio */}
            <div className="mt-1 text-[8px] sm:text-[9px] leading-tight" style={{ color: hex.slate400 }}>
              <p>
                {lang === 'bn' ? 'পিতা: ' : 'Father: '}
                <span style={{ color: hex.slate300 }}>{lang === 'bn' ? data.bride.fatherBn : data.bride.fatherEn}</span>
              </p>
              <p className="mt-0.5">
                {lang === 'bn' ? 'মাতা: ' : 'Mother: '}
                <span style={{ color: hex.slate300 }}>{lang === 'bn' ? data.bride.motherBn : data.bride.motherEn}</span>
              </p>
              <p className="text-[7px] sm:text-[8px] mt-1 uppercase italic" style={{ color: hex.matteColor }}>
                {lang === 'bn' ? `ঠিকানা: ছত্রপুর, কানাইঘাট, সিলেট` : `${data.bride.villEn}, Sylhet`}
              </p>
            </div>
          </div>
        </div>

        {/* Ceremony Schedules */}
        <div className="w-full grid grid-cols-2 gap-2 mt-2 gap-x-3">
          {/* Nikah / Borjatra Card */}
          <div className="rounded-lg p-2 flex flex-col justify-between backdrop-blur-[2px] border" style={{ backgroundColor: hex.cardBg, borderColor: hex.borderColor }}>
            <div>
              <span className="inline-block px-1.5 py-0.5 border rounded text-[7px] sm:text-[8px] font-sans uppercase font-medium mb-1" style={{ backgroundColor: hex.badgeBg, borderColor: hex.borderColor, color: hex.brightColor }}>
                📅 {lang === 'bn' ? '১ম দিন - বরযাত্রা ও আকদ' : 'Day 1 - Nikah'}
              </span>
              <h4 className="font-sans font-bold text-[9px] sm:text-[11px] text-white">
                {lang === 'bn' ? data.nikah.venueBn : data.nikah.venueEn}
              </h4>
              <p className="text-[8px] sm:text-[9px] font-medium mt-0.5" style={{ color: hex.matteColor }}>
                {lang === 'bn' ? data.nikah.dateBn : data.nikah.dateEn}
              </p>
              <p className="text-[8px] flex items-center gap-1 mt-1 font-mono" style={{ color: hex.slate300 }}>
                <Clock className="w-2.5 h-2.5 text-gold-royal" style={{ color: hex.goldColor }} />
                {lang === 'bn' ? 'বেলা ১১:৩০ মি: হইতে' : 'From 11:30 AM'}
              </p>
            </div>
            <p className="text-[7px] mt-1 italic leading-tight border-t pt-1" style={{ borderColor: hex.innerBorderColor, color: hex.slate400 }}>
              {lang === 'bn' ? 'রহমান কমিউনিটি সেন্টার, গাছবাড়ি বাজার' : data.nikah.addressEn}
            </p>
          </div>

          {/* Walima Recp Card */}
          <div className="rounded-lg p-2 flex flex-col justify-between backdrop-blur-[2px] border" style={{ backgroundColor: hex.cardBg, borderColor: hex.borderColor }}>
            <div>
              <span className="inline-block px-1.5 py-0.5 border rounded text-[7px] sm:text-[8px] font-sans uppercase font-medium mb-1" style={{ backgroundColor: hex.badgeBg, borderColor: hex.borderColor, color: hex.brightColor }}>
                🤝 {lang === 'bn' ? '২য় দিন - ওয়ালিমা' : 'Day 2 - Walima'}
              </span>
              <h4 className="font-sans font-bold text-[9px] sm:text-[11px] text-white">
                {lang === 'bn' ? data.walima.venueBn : data.walima.venueEn}
              </h4>
              <p className="text-[8px] sm:text-[9px] font-medium mt-0.5" style={{ color: hex.matteColor }}>
                {lang === 'bn' ? data.walima.dateBn : data.walima.dateEn}
              </p>
              <p className="text-[8px] flex items-center gap-1 mt-1 font-mono" style={{ color: hex.slate300 }}>
                <Clock className="w-2.5 h-2.5 text-gold-royal" style={{ color: hex.goldColor }} />
                {lang === 'bn' ? 'সময়: দুপুর ১:৩০ মি:' : 'Time: 01:30 PM'}
              </p>
            </div>
            <p className="text-[7px] mt-1 italic leading-tight border-t pt-1" style={{ borderColor: hex.innerBorderColor, color: hex.slate400 }}>
              {lang === 'bn' ? 'সূচনা কমিউনিটি সেন্টার, খাদিমপাড়া' : data.walima.addressEn}
            </p>
          </div>
        </div>

      </div>

      {/* Decorative Bottom Arabic Calligraphy Banner & Prayers */}
      <div className="relative z-10 flex flex-col items-center text-center mt-1 border-t pt-2" style={{ borderColor: hex.innerBorderColor }}>
        <p className="font-serif italic text-[11px] sm:text-xs font-medium select-none" style={{ color: hex.matteColor }}>
          بَارَكَ اللهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
        </p>
        {renderEn(
          <p className="font-sans text-[8px] tracking-wider italic mt-0.5" style={{ color: hex.slate300 }}>
            "May Allah bless you both, and drop blessings upon you, and bring you together in goodness"
          </p>
        )}
        {renderBn(
          <p className="font-serif text-[10px] mt-0.5" style={{ color: hex.slate300 }}>
            "আল্লাহ আপনাদের দাম্পত্য জীবনকে ধন্য করুন এবং কল্যাণের সাথে আপনাদের জীবন বাঁধুন"
          </p>
        )}
        
        {/* Humble Creator & Tag Line */}
        <div className="flex gap-2 items-center justify-center mt-1.5 opacity-60 text-[7px] sm:text-[8px] uppercase tracking-widest" style={{ color: hex.matteColor }}>
          <span>{lang === 'bn' ? 'সাগ্রহে আমন্ত্রণ' : 'Sincere Invitation'}</span>
          <span>•</span>
          <span>{lang === 'bn' ? 'পারিবারিক শুভাকাঙ্ক্ষীবৃন্দ' : 'The Family and Loved Ones'}</span>
        </div>
      </div>
    </div>
  );
}

