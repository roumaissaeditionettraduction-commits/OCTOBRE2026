import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  BookOpen, ArrowRight, ShieldCheck, Sun, Moon, 
  Coffee, Type, Maximize2, Minimize2, ChevronRight, ChevronLeft,
  Lock, Bookmark, Info
} from 'lucide-react';

export const SecureEbookReader: React.FC = () => {
  const { 
    activeReaderBook, activeInvoice, currentUser, 
    securityConfig, closeReader, setCurrentView 
  } = useStore();

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [theme, setTheme] = useState<'sepia' | 'dark' | 'light'>('sepia');
  const [fontSize, setFontSize] = useState<number>(18);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);

  if (!activeReaderBook) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-slate-900 text-white">
        <Lock className="w-16 h-16 text-amber-400 mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold mb-2">لا يوجد كتاب مفتوح حالياً في القارئ الآمن</h2>
        <p className="text-slate-400 max-w-md mb-6">
          يرجى فتح كتاب من قسم "مكتبتي الرقمية" أو اختيار كتاب إلكتروني من المتجر أو معاينته من لوحة التحكم.
        </p>
        <button
          onClick={() => setCurrentView('store')}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors"
        >
          العودة للمتجر
        </button>
      </div>
    );
  }

  const chapters = activeReaderBook.chapters || [];
  const currentChapter = chapters[activeChapterIndex] || {
    id: 'c1',
    title: 'المقدمة',
    content: activeReaderBook.excerpt
  };

  const watermarkText = securityConfig.watermarkPattern
    .replace('{name}', currentUser.name)
    .replace('{email}', currentUser.email)
    .replace('{invoice}', activeInvoice);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const themeClasses = {
    sepia: 'bg-[#fbf7ee] text-[#3c2f21] border-[#e7dec8]',
    dark: 'bg-[#0f172a] text-[#e2e8f0] border-[#1e293b]',
    light: 'bg-white text-slate-900 border-slate-200'
  };

  const containerTheme = {
    sepia: 'bg-[#f4ede0]',
    dark: 'bg-[#080d1a]',
    light: 'bg-slate-100'
  };

  return (
    <div className={`min-h-screen flex flex-col ${containerTheme[theme]} transition-colors duration-200 select-none`}>
      {/* Top Reader Controls Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white px-4 py-3 shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={closeReader}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors"
            title="الخروج من القارئ"
          >
            <ArrowRight className="w-4 h-4" />
            <span>خروج للمكتبة</span>
          </button>

          <div className="h-5 w-px bg-slate-700 hidden sm:block" />

          <div>
            <h1 className="text-sm sm:text-base font-bold text-amber-400 line-clamp-1">
              {activeReaderBook.title}
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              {activeReaderBook.author} · ترخيص مشفر: {activeInvoice}
            </p>
          </div>
        </div>

        {/* Reader Preferences */}
        <div className="flex items-center gap-2">
          {/* Security Badge */}
          <button
            onClick={() => setShowSecurityInfo(!showSecurityInfo)}
            className="hidden md:flex items-center gap-1 px-2.5 py-1 text-xs bg-emerald-950/80 text-emerald-400 border border-emerald-800 rounded-md hover:bg-emerald-900 transition-colors"
            title="حالة الحماية والتشفير"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>نظام الحماية نشط</span>
          </button>

          {/* Table of Contents Toggle */}
          <button
            onClick={() => setShowToc(!showToc)}
            className={`px-3 py-1.5 text-xs rounded-lg flex items-center gap-1.5 transition-colors ${
              showToc ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">الفصول ({chapters.length})</span>
          </button>

          {/* Font Size Adjusters */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
              className="p-1.5 hover:text-amber-400 text-slate-300 transition-colors"
              title="تصغير الخط"
            >
              <Type className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs px-1.5 font-mono text-slate-400">{fontSize}px</span>
            <button
              onClick={() => setFontSize(prev => Math.min(26, prev + 2))}
              className="p-1.5 hover:text-amber-400 text-slate-300 transition-colors"
              title="تكبير الخط"
            >
              <Type className="w-4 h-4 font-bold" />
            </button>
          </div>

          {/* Color Themes */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setTheme('sepia')}
              className={`p-1.5 rounded transition-colors ${theme === 'sepia' ? 'bg-amber-600/30 text-amber-400' : 'text-slate-400 hover:text-white'}`}
              title="نمط الورق الدافئ (Sepia)"
            >
              <Coffee className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded transition-colors ${theme === 'light' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
              title="نمط نهاري أبيض"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded transition-colors ${theme === 'dark' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
              title="نمط ليلي داكن"
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            title="ملء الشاشة"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Security Info Popup */}
      {showSecurityInfo && (
        <div className="bg-slate-800 border-b border-amber-500/30 text-slate-200 px-6 py-3 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>رخصة القراءة الشخصية:</strong> هذا المحتوى محمي بحقوق الملكية الفكرية لـ <strong>دار رميساء للنشر</strong> ومخصص حصرياً للحساب 
              ({currentUser.name} - {currentUser.email}). النسخ وتصوير الشاشة محظوران بموجب المادة القانونية لحماية المصنفات الرقمية.
            </span>
          </div>
          <button 
            onClick={() => setShowSecurityInfo(false)}
            className="text-amber-400 hover:underline shrink-0"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Main Reading Container */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex gap-6 relative">
        {/* Table of Contents Drawer */}
        {showToc && (
          <aside className="w-72 shrink-0 bg-white dark:bg-slate-900 rounded-xl p-4 shadow-xl border border-slate-200 dark:border-slate-800 self-start sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-500" />
                فهرس الفصول
              </h3>
              <button 
                onClick={() => setShowToc(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                إخفاء
              </button>
            </div>
            <div className="space-y-1.5 max-h-[60vh] overflow-y-auto">
              {chapters.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    setActiveChapterIndex(idx);
                    setShowToc(false);
                  }}
                  className={`w-full text-right px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between ${
                    idx === activeChapterIndex
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold border-r-2 border-amber-500'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="line-clamp-1">{ch.title}</span>
                  <span className="font-mono text-[10px] opacity-60">#{idx + 1}</span>
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* The Secured Reading Book Page */}
        <main className={`flex-1 rounded-2xl p-6 sm:p-12 shadow-2xl relative overflow-hidden transition-all border ${themeClasses[theme]}`}>
          {/* DYNAMIC WATERMARK OVERLAY (Security & Anti-Piracy layer) */}
          {securityConfig.enableDynamicWatermark && (
            <div 
              className="absolute inset-0 pointer-events-none z-30 overflow-hidden flex flex-col justify-around items-center select-none"
              style={{ opacity: securityConfig.watermarkOpacity }}
            >
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className="font-bold tracking-widest text-slate-900 dark:text-white transform -rotate-12 whitespace-nowrap text-xs sm:text-sm"
                  style={{
                    transform: `rotate(-18deg) translateY(${i * 10}px)`
                  }}
                >
                  {watermarkText} · {watermarkText}
                </div>
              ))}
            </div>
          )}

          {/* Book Header within page */}
          <div className="pb-6 border-b border-current/15 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold tracking-wider opacity-70 uppercase">
                {activeReaderBook.category} · {activeReaderBook.publisher}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif mt-1">
                {currentChapter.title}
              </h2>
            </div>
            <div className="text-xs opacity-60 font-mono">
              فصل {activeChapterIndex + 1} من {chapters.length}
            </div>
          </div>

          {/* Book Chapter Content */}
          <article 
            className="font-serif leading-loose tracking-wide whitespace-pre-line text-justify min-h-[50vh] relative z-10"
            style={{ fontSize: `${fontSize}px`, lineHeight: 2.2 }}
          >
            {currentChapter.content}
          </article>

          {/* Chapter Navigation Buttons */}
          <footer className="mt-12 pt-6 border-t border-current/15 flex items-center justify-between text-xs">
            <button
              onClick={() => setActiveChapterIndex(prev => Math.max(0, prev - 1))}
              disabled={activeChapterIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
              <span>الفصل السابق</span>
            </button>

            <span className="opacity-60 font-mono">
              صفحة رقمية مشفرة · دار رميساء
            </span>

            <button
              onClick={() => setActiveChapterIndex(prev => Math.min(chapters.length - 1, prev + 1))}
              disabled={activeChapterIndex === chapters.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <span>الفصل التالي</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
};
