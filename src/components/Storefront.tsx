import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Book } from '../types';
import { CheckoutModal } from './CheckoutModal';
import { 
  Search, BookOpen, Star, Sparkles, 
  Truck, ShieldCheck, CreditCard, Eye, 
  ArrowLeft, Feather, Layers, BookText
} from 'lucide-react';

export const Storefront: React.FC = () => {
  const { books, openReader, setCurrentView } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [formatFilter, setFormatFilter] = useState<'all' | 'ebook' | 'paper'>('all');
  
  // Selected book for details or checkout
  const [inspectingBook, setInspectingBook] = useState<Book | null>(null);
  const [checkoutBook, setCheckoutBook] = useState<{ book: Book; format: 'ebook' | 'paper' } | null>(null);

  const categories = ['الكل', 'روايات وأدب', 'تاريخ وتراث', 'فلسفة وترجمة', 'دراسات أكاديمية'];

  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.includes(searchQuery) || 
                          b.author.includes(searchQuery) || 
                          b.description.includes(searchQuery);
    const matchesCategory = selectedCategory === 'الكل' || b.category === selectedCategory;
    const matchesFormat = formatFilter === 'all' || 
                          (formatFilter === 'ebook' && (b.format === 'ebook' || b.format === 'both')) ||
                          (formatFilter === 'paper' && (b.format === 'paper' || b.format === 'both'));
    return matchesSearch && matchesCategory && matchesFormat;
  });

  const featuredBook = books.find(b => b.isFeatured) || books[0];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_50%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>إصدارات دار رميساء للعام 2026 · طبعات فاخرة وتراخيص رقمية</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif leading-tight">
              بوابتكم الكبرى للفكر الإنساني <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
                والأدب الجزائري الخالد
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              نجمع بين أصالة الطباعة الورقية الفاخرة الموزعة على كافة ولايات الجزائر الـ 58، وتطور الكتاب الإلكتروني المحمي بأحدث تقنيات التشفير والعلامة المائية المانعة للقرصنة، مع الدفع الفوري عبر البطاقة الذهبية و CIB وبريدي موب.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#catalog"
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 transition-all text-sm flex items-center gap-2"
              >
                <span>استكشف فهرس الكتب</span>
                <ArrowLeft className="w-4 h-4" />
              </a>

              <button
                onClick={() => setCurrentView('submit_manuscript')}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition-all text-sm flex items-center gap-2"
              >
                <Feather className="w-4 h-4 text-amber-400" />
                <span>طلب نشر مخطوطة</span>
              </button>
            </div>

            {/* Platform Guarantees Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>توصيل سريع 58 ولاية</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
                <span>دفع آمن بالدينار (Chargily)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>تشفير قارئ E-Book</span>
              </div>
            </div>
          </div>

          {/* Featured Spotlight Card */}
          {featuredBook && (
            <div className="lg:col-span-5 bg-slate-800/80 rounded-2xl p-6 border border-amber-500/30 backdrop-blur-md shadow-2xl relative">
              <div className="flex items-start gap-4">
                <img
                  src={featuredBook.coverImage}
                  alt={featuredBook.title}
                  className="w-28 sm:w-36 h-40 sm:h-52 object-cover rounded-xl shadow-xl shrink-0 border border-slate-700"
                />
                <div className="flex-1 space-y-2">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide">
                    كتاب الأسبوع المميز
                  </span>
                  <h3 className="text-lg font-bold text-white font-serif line-clamp-1">
                    {featuredBook.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-1">{featuredBook.author}</p>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {featuredBook.excerpt}
                  </p>
                  
                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">نسخة إلكترونية مشفرة</span>
                      <span className="font-bold text-amber-400 font-mono text-sm">
                        {featuredBook.ebookPrice.toLocaleString()} دج
                      </span>
                    </div>
                    <button
                      onClick={() => setInspectingBook(featuredBook)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>معاينة وتفاصيل</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Catalog Section */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
              فهرس المنشورات والإصدارات
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              تصفح أحدث الكتب الورقية والإلكترونية المتوفرة للشراء الفوري
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="ابحث بالعنوان، الكاتب، الموضوع..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Filter Controls (Zero-pill compliant tabs) */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Categories Tab Bar */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-950 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Format segmented control */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl">
            <button
              onClick={() => setFormatFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                formatFilter === 'all'
                  ? 'bg-white text-slate-950 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              جميع الصيغ
            </button>
            <button
              onClick={() => setFormatFilter('paper')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                formatFilter === 'paper'
                  ? 'bg-white text-slate-950 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              ورقي فقط
            </button>
            <button
              onClick={() => setFormatFilter('ebook')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                formatFilter === 'ebook'
                  ? 'bg-white text-slate-950 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              إلكتروني (E-Book)
            </button>
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">لم يتم العثور على كتب مطابقة</h3>
            <p className="text-xs text-slate-400 mt-1">جرّب تغيير كلمات البحث أو المرشحات</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map(book => (
              <div 
                key={book.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-amber-400/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Book Cover Container */}
                <div className="relative h-64 overflow-hidden bg-slate-100 flex items-center justify-center p-4">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="max-h-full max-w-full object-cover rounded shadow-md group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Clean unboxed metadata separator on hover */}
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{book.rating}</span>
                    <span className="opacity-40">·</span>
                    <span>{book.pages} صفحة</span>
                  </div>

                  <div className="absolute bottom-3 left-3 flex gap-1">
                    {book.format === 'both' ? (
                      <span className="bg-slate-900/90 text-amber-400 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                        ورقي + E-Book
                      </span>
                    ) : book.format === 'ebook' ? (
                      <span className="bg-blue-900/90 text-blue-200 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                        E-Book فقط
                      </span>
                    ) : (
                      <span className="bg-emerald-900/90 text-emerald-200 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                        ورقي فقط
                      </span>
                    )}
                  </div>
                </div>

                {/* Book Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Unboxed category and publisher */}
                    <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
                      <span>{book.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{book.publisher}</span>
                    </div>

                    <h3 
                      onClick={() => setInspectingBook(book)}
                      className="font-bold font-serif text-lg text-slate-900 group-hover:text-amber-700 transition-colors cursor-pointer line-clamp-1"
                    >
                      {book.title}
                    </h3>
                    
                    <p className="text-xs text-slate-600 mt-0.5">
                      المؤلف: <span className="font-semibold text-slate-800">{book.author}</span>
                    </p>

                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>
                  </div>

                  {/* Pricing and Actions */}
                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">إلكتروني (مشفر)</span>
                        <span className="font-bold text-slate-900 font-mono text-sm">
                          {book.ebookPrice.toLocaleString()} دج
                        </span>
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] text-slate-400 block">ورقي (مخزن: {book.stockCount})</span>
                        <span className="font-bold text-amber-700 font-mono text-sm">
                          {book.paperPrice.toLocaleString()} دج
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setCheckoutBook({ book, format: 'ebook' })}
                        className="py-2 px-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                        <span>شراء E-Book</span>
                      </button>

                      <button
                        onClick={() => setCheckoutBook({ book, format: 'paper' })}
                        className="py-2 px-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-amber-500/10"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>طلب ورقي</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setInspectingBook(book)}
                      className="w-full mt-2 text-[11px] text-slate-500 hover:text-slate-800 text-center py-1 transition-colors"
                    >
                      معاينة الفهرس والمقدمة كاملة ←
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Book Inspection Modal (Quick View & Sample Reader) */}
      {inspectingBook && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookText className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-amber-400 font-serif">
                  بطاقة الكتاب والمحتوى
                </h3>
              </div>
              <button 
                onClick={() => setInspectingBook(null)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  src={inspectingBook.coverImage}
                  alt={inspectingBook.title}
                  className="w-40 h-56 object-cover rounded-xl shadow-md shrink-0 border border-slate-200 self-center sm:self-start"
                />
                <div className="space-y-3 flex-1 text-right">
                  <div className="text-xs text-slate-500">
                    {inspectingBook.category} · صادر عام {inspectingBook.publicationYear}
                  </div>
                  <h2 className="text-2xl font-bold font-serif text-slate-900">
                    {inspectingBook.title}
                  </h2>
                  <p className="text-sm font-semibold text-amber-800">
                    تأليف: {inspectingBook.author}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {inspectingBook.description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-400 block">الترقيم الدولي ISBN</span>
                      <span className="font-mono font-bold text-slate-800">{inspectingBook.isbn}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">عدد الصفحات</span>
                      <span className="font-bold text-slate-800">{inspectingBook.pages} صفحة</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">نسخة ورقية</span>
                      <span className="font-bold text-slate-800 font-mono">{inspectingBook.paperPrice} دج</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">نسخة إلكترونية</span>
                      <span className="font-bold text-amber-700 font-mono">{inspectingBook.ebookPrice} دج</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Excerpt */}
              <div className="bg-amber-50/60 border border-amber-200/70 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  مقتطف مجاني من المقدمة (للقراءة العامة):
                </h4>
                <p className="text-xs font-serif text-slate-800 leading-loose italic whitespace-pre-line text-justify">
                  "{inspectingBook.excerpt}"
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    const b = inspectingBook;
                    setInspectingBook(null);
                    setCheckoutBook({ book: b, format: 'ebook' });
                  }}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>اقتناء النسخة الإلكترونية المشفرة ({inspectingBook.ebookPrice} دج)</span>
                </button>

                <button
                  onClick={() => {
                    const b = inspectingBook;
                    setInspectingBook(null);
                    setCheckoutBook({ book: b, format: 'paper' });
                  }}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
                >
                  <Truck className="w-4 h-4" />
                  <span>طلب النسخة الورقية مع الشحن ({inspectingBook.paperPrice} دج)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutBook && (
        <CheckoutModal
          book={checkoutBook.book}
          format={checkoutBook.format}
          onClose={() => setCheckoutBook(null)}
        />
      )}
    </div>
  );
};
