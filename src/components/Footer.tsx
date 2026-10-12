import React from 'react';
import { useStore } from '../context/StoreContext';
import { BookOpen, Shield, Phone, Mail, MapPin, CreditCard, Feather } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView } = useStore();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-serif text-lg font-bold text-white">
                دار رمـيـسـاء للنشر والترجمة
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              مؤسسة نشر جزائرية رائدة تعنى بالإنتاج الفكري، الروايات الخالدة، الدراسات الأكاديمية والترجمات الكبرى، مع منصة رقمية آمنة للمطالعة المشفرة.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px]">
              <Shield className="w-3.5 h-3.5" />
              <span>مصادق من الديوان الوطني لحقوق المؤلف ONDA</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-bold text-xs uppercase tracking-wider">
              أقسام المنصة
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button onClick={() => setCurrentView('store')} className="hover:text-amber-400 transition-colors">
                  فهرس الكتب الورقية والإلكترونية
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('library')} className="hover:text-amber-400 transition-colors">
                  مكتبتي الرقمية والقارئ الآمن
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('articles')} className="hover:text-amber-400 transition-colors">
                  مجلة الدراسات والنقد الأدبي
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('forum')} className="hover:text-amber-400 transition-colors">
                  منتدى القراء والنقاشات
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('submit_manuscript')} className="hover:text-amber-400 transition-colors">
                  إرسال مخطوطة جديدة للنشر
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Payment & Logistics */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-bold text-xs uppercase tracking-wider">
              بوابات الدفع والتوزيع
            </h4>
            <p className="text-[11px] leading-relaxed">
              الدفع الإلكتروني الآمن بالدينار الجزائري عبر بوابة <strong>Chargily Pay</strong>:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="bg-slate-900 border border-slate-800 text-amber-400 px-2 py-0.5 rounded text-[10px] font-mono">
                البطاقة الذهبية
              </span>
              <span className="bg-slate-900 border border-slate-800 text-blue-400 px-2 py-0.5 rounded text-[10px] font-mono">
                CIB SATIM
              </span>
              <span className="bg-slate-900 border border-slate-800 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-mono">
                بريدي موب BaridiMob
              </span>
              <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                الدفع عند الاستلام
              </span>
            </div>
            <p className="text-[10px] text-slate-500 pt-1">
              توصيل مضمون لـ 58 ولاية خلال 24 - 48 ساعة عبر الشركات المعتمدة.
            </p>
          </div>

          {/* Col 4: Contact & Location */}
          <div className="space-y-2 text-[11px]">
            <h4 className="text-slate-200 font-bold text-xs uppercase tracking-wider">
              التواصل والمقر
            </h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>شارع ديدوش مراد، الجزائر العاصمة، الجزائر</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span dir="ltr">+213 (0) 23 88 14 00</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>roumaissaeditionettraduction@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-500">
          <div>
            © 2026 دار رميساء للنشر والترجمة. جميع الحقوق الفكرية والتجارية محفوظة ومسجلة.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('dashboard')} className="hover:text-amber-400 text-slate-400">
              دخول لوحة تحكم الإدارة
            </button>
            <span>·</span>
            <span>سياسة الخصوصية وحماية المحتوى</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
