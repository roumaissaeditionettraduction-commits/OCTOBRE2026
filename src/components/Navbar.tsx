import React, { useState } from 'react';
import { useStore, ViewMode } from '../context/StoreContext';
import { 
  BookOpen, Feather, ShoppingBag, MessageSquare, 
  FileText, LayoutDashboard, Menu, X, Shield, 
  UserCheck, BookCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentView, setCurrentView, myLibraryBookIds, 
    currentUser, setCurrentUser 
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleUserRole = () => {
    if (currentUser.role === 'admin') {
      setCurrentUser({
        name: 'عمر بن ناصر',
        email: 'omar.bennasser@gmail.com',
        role: 'reader'
      });
      if (currentView === 'dashboard') {
        setCurrentView('store');
      }
    } else {
      setCurrentUser({
        name: 'المدير العام (رميساء للنشر)',
        email: 'admin@roumaissa-editions.dz',
        role: 'admin'
      });
    }
  };

  const navItems: { label: string; view: ViewMode; icon: any; badge?: number }[] = [
    { label: 'متجر الكتب', view: 'store', icon: ShoppingBag },
    { label: 'مكتبتي الرقمية', view: 'library', icon: BookCheck, badge: myLibraryBookIds.length },
    { label: 'المجلة والمقالات', view: 'articles', icon: FileText },
    { label: 'منتدى القراء', view: 'forum', icon: MessageSquare },
    { label: 'انشر كتابك معنا', view: 'submit_manuscript', icon: Feather }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-xl border-b border-amber-500/20">
      {/* Top micro bar with contact and security guarantee */}
      <div className="bg-slate-950 px-4 py-1 text-[11px] text-slate-400 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-amber-400">
            <Shield className="w-3 h-3" />
            <span>نظام النشر والمطالعة المشفر 2026</span>
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">شحن وتوصيل لكافة الـ 58 ولاية جزائرية</span>
        </div>

        {/* User Role Switcher Simulation */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] hidden md:inline">الوضع الحالي:</span>
          <button
            onClick={toggleUserRole}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors text-[11px] border border-slate-700"
            title="تبديل الحساب لتجربة دور القارئ أو دور المدير العام"
          >
            <UserCheck className="w-3 h-3" />
            <span>{currentUser.role === 'admin' ? 'المدير العام' : 'قارئ مشترك: ' + currentUser.name}</span>
            <span className="text-[9px] text-slate-400">(تبديل)</span>
          </button>
        </div>
      </div>

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentView('store')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  دار رمـيـسـاء
                </span>
                <span className="text-[10px] font-sans bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded font-semibold">
                  للنشر والترجمة
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans tracking-wide">
                المنصة الآمنة للكتب الورقية والرقمية
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => setCurrentView(item.view)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-slate-950 text-amber-400' : 'bg-amber-500 text-slate-950'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Access to Admin Dashboard Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setCurrentView(currentView === 'dashboard' ? 'store' : 'dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                currentView === 'dashboard'
                  ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-lg'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-amber-400 border-amber-500/30 hover:border-amber-400'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{currentView === 'dashboard' ? 'العودة للمتجر العام' : '📊 لوحة تحكم الإدارة'}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setCurrentView(currentView === 'dashboard' ? 'store' : 'dashboard')}
              className="p-2 text-amber-400 bg-slate-800 rounded-lg text-xs flex items-center gap-1"
              title="لوحة الإدارة"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => {
                  setCurrentView(item.view);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-xs bg-slate-800 text-amber-400 px-2 py-0.5 rounded-full font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <button
            onClick={() => {
              setCurrentView('dashboard');
              setMobileMenuOpen(false);
            }}
            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>فتح لوحة تحكم دار النشر</span>
          </button>
        </div>
      )}
    </header>
  );
};
