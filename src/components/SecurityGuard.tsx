import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldAlert, X } from 'lucide-react';

export const SecurityGuard: React.FC = () => {
  const { securityConfig, securityAlert, dismissSecurityAlert, triggerSecurityAlert } = useStore();

  useEffect(() => {
    // 1. Context Menu (Right Click) Prevention
    const handleContextMenu = (e: MouseEvent) => {
      if (securityConfig.blockRightClick) {
        e.preventDefault();
        triggerSecurityAlert('تنبيه أمني: النقر بالزر الأيمن محظور لحماية حقوق دار النشر والملكية الفكرية.');
      }
    };

    // 2. Keyboard shortcuts protection (Ctrl+C, Ctrl+X, Ctrl+U, Ctrl+S, F12)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!securityConfig.blockShortcuts) return;

      const isModifier = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (isModifier && (key === 'c' || key === 'x' || key === 'u' || key === 's' || key === 'p')) {
        e.preventDefault();
        triggerSecurityAlert(`تنبيه حماية المحتوى: اختصار لوحة المفاتيح (${e.ctrlKey ? 'Ctrl' : 'Cmd'}+${key.toUpperCase()}) معطل لحماية نصوص ومخطوطات دار رميساء.`);
      }

      if (e.key === 'F12') {
        e.preventDefault();
        triggerSecurityAlert('تنبيه أمني: أدوات فحص المطور (F12) محظورة لحماية التشفير الرقمي للموقع.');
      }
    };

    // 3. PrintScreen protection and psychological deterrent
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!securityConfig.blockPrintScreen) return;

      if (e.key === 'PrintScreen') {
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(''); // Clear clipboard immediately
          }
        } catch {
          // Ignore if clipboard access is denied by browser sandbox
        }
        triggerSecurityAlert('تنبيه أمني صارم: محاولة تصوير الشاشة (PrintScreen) مسجلة ومحظورة. تم تفريغ الحافظة لحماية حقوق المؤلف والناشر.');
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Apply or remove user-select
    if (securityConfig.blockTextSelection) {
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
    } else {
      document.body.style.userSelect = 'auto';
      document.body.style.webkitUserSelect = 'auto';
    }

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.body.style.userSelect = 'auto';
      document.body.style.webkitUserSelect = 'auto';
    };
  }, [securityConfig, triggerSecurityAlert]);

  if (!securityAlert?.show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-short bg-slate-900/95 text-white p-4 rounded-xl shadow-2xl border border-amber-500/40 backdrop-blur-md">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-amber-400 text-sm">نظام حماية دار رميساء (Security Guard)</h4>
            <button 
              onClick={dismissSecurityAlert}
              className="text-slate-400 hover:text-white p-1 transition-colors"
              aria-label="إغلاق التنبيه"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-200 mt-1 leading-relaxed">
            {securityAlert.message}
          </p>
        </div>
      </div>
    </div>
  );
};
