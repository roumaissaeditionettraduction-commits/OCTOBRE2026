import React from 'react';
import { useStore } from '../context/StoreContext';
import { BookOpen, ShieldCheck, ShoppingBag, ArrowLeft, Key } from 'lucide-react';

export const MyLibraryView: React.FC = () => {
  const { books, myLibraryBookIds, openReader, setCurrentView, currentUser, orders } = useStore();

  const ownedBooks = books.filter(b => myLibraryBookIds.includes(b.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-600 font-bold mb-1">
            <Key className="w-4 h-4" />
            <span>التراخيص الرقمية الموثقة للحساب</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
            مكتبتي الرقمية الآمنة
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            الكتب الإلكترونية المقتناة بحساب: <strong>{currentUser.name}</strong> ({currentUser.email})
          </p>
        </div>

        <button
          onClick={() => setCurrentView('store')}
          className="self-start sm:self-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          <ShoppingBag className="w-4 h-4 text-amber-600" />
          <span>تصفح المزيد من الكتب في المتجر</span>
        </button>
      </div>

      {ownedBooks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto p-6 space-y-4">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">مكتبتك الرقمية فارغة حالياً</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            عند اقتناء أي كتاب إلكتروني عبر المتجر، سيتم تفعيل رخصتك الرقمية فوراً وإضافته إلى هذه الخزانة لتستمتع بقراءته عبر القارئ الآمن المشفر.
          </p>
          <button
            onClick={() => setCurrentView('store')}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md"
          >
            اكتشف إصدارات دار رميساء الآن
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ownedBooks.map(book => {
            const relatedOrder = orders.find(o => o.bookId === book.id && o.bookType === 'ebook');
            const invoice = relatedOrder ? relatedOrder.invoiceNumber : 'ROUM-LIC-7741';

            return (
              <div
                key={book.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5 flex gap-4">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-24 h-36 object-cover rounded-lg shadow border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-mono block">
                      رقم الترخيص: {invoice}
                    </span>
                    <h3 className="font-bold font-serif text-base text-slate-900 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-600">المؤلف: {book.author}</p>
                    <div className="text-[11px] text-slate-500 pt-1">
                      {book.pages} صفحة · {book.chapters?.length || 1} فصول كاملة
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg text-emerald-800 text-[11px] font-medium border border-emerald-200/60">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>رخصة رقمية نشطة مع علامة مائية شخصية</span>
                  </div>

                  <button
                    onClick={() => openReader(book, invoice)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>متابعة القراءة في القارئ الآمن</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
