import React, { useState } from 'react';
import { Download, Check, Sparkles, Palette, CheckCircle2 } from 'lucide-react';
import { InvitationData, CardTheme } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ControlPanelProps {
  data: InvitationData;
  theme: CardTheme;
  onChangeTheme: (theme: CardTheme) => void;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export default function ControlPanel({
  data,
  theme,
  onChangeTheme,
  cardRef,
}: ControlPanelProps) {
  const [downloading, setDownloading] = useState(false);
  const [exportFormat, setExportFormat] = useState<'png' | 'jpg' | 'pdf'>('png');
  const [exportQuality, setExportQuality] = useState<'high' | 'print'>('high');
  const [themeAppliedNotification, setThemeAppliedNotification] = useState(false);
  const [exportStatusText, setExportStatusText] = useState('Download Premium Card');

  // Friendly, descriptive names for our themes
  const themeNames: Record<CardTheme, string> = {
    'emerald-gold': 'Royal Emerald Gold',
    'royal-dark': 'Obsidian Gold Velvet',
    'ivory-gold': 'Antique Ivory Gold',
    'crimson-gold': 'Royal Velvet Crimson',
  };

  // Quick visual colors for our switcher options
  const themeColors: Record<CardTheme, string> = {
    'emerald-gold': '#D4AF37', // Gold with emerald background
    'royal-dark': '#C5A059',  // Gold indicator
    'ivory-gold': '#B45309',  // Bronze/Amber
    'crimson-gold': '#FBBF24', // Yellow Gold
  };

  // Theme configuration applicator
  const handleApplyTheme = () => {
    localStorage.setItem('applied_wedding_theme', theme);
    setThemeAppliedNotification(true);
    // Dismiss notification automatically after 4 seconds
    setTimeout(() => {
      setThemeAppliedNotification(false);
    }, 4000);
  };

  // Standard high resolution and print layout compiler
  const triggerImageDownload = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    setExportStatusText(`Generating ${exportFormat.toUpperCase()} File...`);

    try {
      // Short delay to let any state redraw complete reliably
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const scale = exportQuality === 'print' ? 4 : 2;
      const label = exportQuality === 'print' ? 'UltraHD-4K' : 'HighRes-2K';

      const canvas = await html2canvas(cardRef.current, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scrollX: 0,
        scrollY: 0,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
      });

      const groomName = data.groom.nameEn.toLowerCase().replace(/\s+/g, '-');
      const brideName = data.bride.nameEn.toLowerCase().replace(/\s+/g, '-');
      const filename = `${groomName}-weds-${brideName}-invitation-${label}`;

      if (exportFormat === 'pdf') {
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        // Create matching orientation PDF and save
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${filename}.pdf`);
      } else {
        const mimeType = exportFormat === 'jpg' ? 'image/jpeg' : 'image/png';
        const image = canvas.toDataURL(mimeType, exportFormat === 'jpg' ? 0.92 : 1.0);
        const link = document.createElement('a');
        link.href = image;
        link.download = `${filename}.${exportFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setExportStatusText('Successful Download! ✨');
      setTimeout(() => setExportStatusText('Download Premium Card'), 3000);
    } catch (err) {
      console.error('Failed to export invitation:', err);
      setExportStatusText('Export Error ❌');
      setTimeout(() => setExportStatusText('Download Premium Card'), 3000);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div id="control-panel-box" className="bg-[#052b21]/60 backdrop-blur-md rounded-xl p-6 border border-gold-royal/30 text-slate-100 flex flex-col gap-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
      
      {/* Section 1: Theme Switcher & Configuration */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-gold-royal/20 pb-2">
          <Palette className="w-5 h-5 text-gold-bright" />
          <h2 className="font-display font-semibold text-gold-bright text-xs sm:text-sm uppercase tracking-wider">
            1. Royal Invitation Theme Selector
          </h2>
        </div>

        {themeAppliedNotification && (
          <div className="bg-emerald-950/80 border border-gold-royal/40 rounded-lg p-3 text-gold-bright text-xs flex items-center gap-2 animate-fade-slide-up shadow-inner">
            <CheckCircle2 className="w-4 h-4 text-gold-bright flex-shrink-0" />
            <span>
              <strong>Success!</strong> The <strong>{themeNames[theme] || theme}</strong> theme has been applied successfully and saved to your device cache.
            </span>
          </div>
        )}

        {/* Theme Buttons List */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Available Custom Themes (Theme Change buttons)</span>
          <div className="grid grid-cols-2 gap-2">
            {(['emerald-gold', 'royal-dark', 'ivory-gold', 'crimson-gold'] as CardTheme[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  onChangeTheme(t);
                  setThemeAppliedNotification(false); // Reset notification to make a fresh click interactive
                }}
                className={`flex items-center gap-2 text-xs py-2 px-3 rounded-lg transition-all border cursor-pointer ${
                  theme === t 
                    ? 'bg-gold-royal/20 text-gold-bright border-gold-royal font-bold shadow-md' 
                    : 'bg-emerald-deep/45 border-gold-royal/10 text-slate-350 hover:bg-gold-royal/10 hover:border-gold-royal/30'
                }`}
                title={`Switch to ${themeNames[t]} theme`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: themeColors[t] }} />
                <span>{themeNames[t]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Theme Apply Button */}
        <div>
          <button
            onClick={handleApplyTheme}
            className="w-full bg-gradient-to-r from-gold-matte to-gold-royal text-emerald-deep font-bold py-2.5 px-4 rounded-lg shadow-md hover:brightness-110 active:scale-[0.98] transition cursor-pointer text-xs flex justify-center items-center gap-1.5"
            title="Saves configuration as device wedding theme preference"
          >
            <Check className="w-4 h-4" /> Apply Theme Preference
          </button>
        </div>
      </section>

      {/* Section 2: Premium Export Center */}
      <section className="flex flex-col gap-5 border-t border-gold-royal/20 pt-5">
        <div className="flex items-center gap-2 border-b border-gold-royal/20 pb-2">
          <Sparkles className="w-5 h-5 text-gold-bright animate-pulse" />
          <h2 className="font-display font-semibold text-gold-bright text-xs sm:text-sm uppercase tracking-wider">
            2. Premium Export Center
          </h2>
        </div>

        {/* Formats Choice */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">File Type Output Format</span>
          <div className="grid grid-cols-3 gap-1 bg-[#031410]/85 p-1 border border-gold-royal/20 rounded-md">
            {[
              { id: 'png', label: 'Export as PNG' },
              { id: 'jpg', label: 'Export as JPG' },
              { id: 'pdf', label: 'Export as PDF' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setExportFormat(f.id as 'png' | 'jpg' | 'pdf')}
                className={`text-[10px] sm:text-xs py-1.5 px-1 rounded font-medium transition cursor-pointer ${
                  exportFormat === f.id
                    ? 'bg-gold-royal text-emerald-deep font-semibold shadow'
                    : 'hover:bg-gold-royal/10 text-slate-350'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quality Presets */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Output Quality Resolution</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setExportQuality('high')}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition cursor-pointer ${
                exportQuality === 'high'
                  ? 'bg-emerald-deep/60 border-gold-royal text-gold-bright'
                  : 'bg-[#031410]/40 border-gold-royal/15 text-slate-400 hover:border-gold-royal/30'
              }`}
            >
              <span className="text-[11px] font-bold">High Resolution Export</span>
              <span className="text-[8px] uppercase tracking-wider mt-0.5 opacity-80">2K Quality (Scale 2x)</span>
            </button>

            <button
              onClick={() => setExportQuality('print')}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition cursor-pointer ${
                exportQuality === 'print'
                  ? 'bg-emerald-deep/60 border-gold-royal text-gold-bright'
                  : 'bg-[#031410]/40 border-gold-royal/15 text-slate-400 hover:border-gold-royal/30'
              }`}
            >
              <span className="text-[11px] font-bold">Print Quality Export</span>
              <span className="text-[8px] uppercase tracking-wider mt-0.5 opacity-80">4K Ultra HD (Scale 4x)</span>
            </button>
          </div>
        </div>

        {/* Master Download Button */}
        <div>
          <button
            onClick={triggerImageDownload}
            disabled={downloading}
            className="w-full bg-emerald-deep border-2 border-gold-royal text-gold-bright font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-emerald-deep/80 disabled:opacity-50 active:scale-[0.98] transition cursor-pointer text-xs sm:text-sm flex justify-center items-center gap-2 tracking-wide"
          >
            <Download className={`w-4 h-4 ${downloading ? 'animate-spin' : ''}`} />
            {exportStatusText}
          </button>
        </div>
      </section>

    </div>
  );
}
