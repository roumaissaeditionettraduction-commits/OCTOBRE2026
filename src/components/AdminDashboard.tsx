import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Book, Order, BookFormat } from '../types';
import { ALGERIAN_WILAYAS } from '../data/initialData';
import { 
  LayoutDashboard, BookOpen, FileText, MessageSquare, 
  Shield, CreditCard, Plus, Trash2, Edit3, 
  CheckCircle, XCircle, AlertTriangle, Eye, 
  DollarSign, Users, ShoppingBag, Settings, Menu, X, Check, Save
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    books, orders, articles, discussions, manuscripts,
    securityConfig, updateSecurityConfig, chargilySettings, 
    updateChargilySettings, addBook, updateBook, deleteBook, 
    updateOrderStatus, updateArticleStatus, toggleDiscussionSpam, 
    deleteDiscussion, updateManuscriptStatus, openReader,
    triggerSecurityAlert
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'books' | 'articles' | 'discussions' | 'reader' | 'settings'>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Book management modal
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [newBookForm, setNewBookForm] = useState<{
    title: string;
    author: string;
    category: string;
    description: string;
    excerpt: string;
    coverImage: string;
    paperPrice: number;
    ebookPrice: number;
    format: BookFormat;
    pages: number;
    publisher: string;
    isbn: string;
    publicationYear: number;
    stockCount: number;
    chapter1Title: string;
    chapter1Content: string;
  }>({
    title: '',
    author: '',
    category: 'روايات وأدب',
    description: '',
    excerpt: '',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80',
    paperPrice: 2000,
    ebookPrice: 1200,
    format: 'both',
    pages: 320,
    publisher: 'دار رميساء للنشر والترجمة',
    isbn: '978-9931-754-' + Math.floor(10 + Math.random() * 89) + '-0',
    publicationYear: 2026,
    stockCount: 50,
    chapter1Title: 'الفصل الأول: البداية',
    chapter1Content: 'في مستهل هذا العمل الجديد الصادر عن دار رميساء، تتشابك خيوط الرواية...'
  });

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.paymentStatus === 'paid' ? ord.amount : 0), 0);
  const paidOrdersCount = orders.filter(o => o.paymentStatus === 'paid').length;
  const pendingArticlesCount = articles.filter(a => a.status === 'pending_review').length;
  const flaggedDiscussionsCount = discussions.filter(d => d.isFlaggedSpam).length;
  const pendingManuscriptsCount = manuscripts.filter(m => m.status === 'under_review').length;

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook) {
      updateBook({
        ...editingBook,
        title: newBookForm.title,
        author: newBookForm.author,
        category: newBookForm.category,
        description: newBookForm.description,
        excerpt: newBookForm.excerpt,
        coverImage: newBookForm.coverImage,
        paperPrice: Number(newBookForm.paperPrice),
        ebookPrice: Number(newBookForm.ebookPrice),
        format: newBookForm.format,
        pages: Number(newBookForm.pages),
        stockCount: Number(newBookForm.stockCount)
      });
      setEditingBook(null);
    } else {
      addBook({
        title: newBookForm.title,
        author: newBookForm.author,
        category: newBookForm.category,
        description: newBookForm.description,
        excerpt: newBookForm.excerpt,
        coverImage: newBookForm.coverImage,
        paperPrice: Number(newBookForm.paperPrice),
        ebookPrice: Number(newBookForm.ebookPrice),
        format: newBookForm.format,
        pages: Number(newBookForm.pages),
        publisher: newBookForm.publisher,
        isbn: newBookForm.isbn,
        publicationYear: newBookForm.publicationYear,
        stockCount: Number(newBookForm.stockCount),
        salesCount: 0,
        rating: 5.0,
        chapters: [
          {
            id: 'c1',
            title: newBookForm.chapter1Title,
            content: newBookForm.chapter1Content
          }
        ]
      });
    }
    setIsAddBookOpen(false);
  };

  const startEditBook = (book: Book) => {
    setEditingBook(book);
    setNewBookForm({
      title: book.title,
      author: book.author,
      category: book.category,
      description: book.description,
      excerpt: book.excerpt,
      coverImage: book.coverImage,
      paperPrice: book.paperPrice,
      ebookPrice: book.ebookPrice,
      format: book.format,
      pages: book.pages,
      publisher: book.publisher,
      isbn: book.isbn,
      publicationYear: book.publicationYear,
      stockCount: book.stockCount,
      chapter1Title: book.chapters[0]?.title || 'الفصل الأول',
      chapter1Content: book.chapters[0]?.content || ''
    });
    setIsAddBookOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#334155] flex flex-col md:flex-row rtl">
      {/* Sidebar - Matching original HTML style with enhanced interactivity */}
      <aside className={`
        fixed md:sticky top-0 right-0 h-screen w-72 bg-[#0f172a] text-white p-6 z-50 transition-all duration-300
        ${mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between pb-6 border-b border-slate-700 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#d4af37] to-amber-600 flex items-center justify-center text-slate-950 font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[#d4af37] text-lg font-bold font-serif leading-none">
                دار رميساء
              </h2>
              <span className="text-[10px] text-slate-400">لوحة الإدارة والمبيعات</span>
            </div>
          </div>
          <button 
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-1.5 text-xs font-semibold">
          <button
            onClick={() => { setActiveTab('overview'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-right ${
              activeTab === 'overview'
                ? 'bg-[#1e293b] text-white border-r-4 border-[#d4af37] font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-[#d4af37]" />
            <span>📊 لوحة الإدارة العامة</span>
          </button>

          <button
            onClick={() => { setActiveTab('books'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all text-right ${
              activeTab === 'books'
                ? 'bg-[#1e293b] text-white border-r-4 border-[#d4af37] font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4" />
              <span>📚 جرد وتحكم الكتب</span>
            </div>
            <span className="bg-slate-800 text-[10px] px-2 py-0.5 rounded font-mono">{books.length}</span>
          </button>

          <button
            onClick={() => { setActiveTab('articles'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all text-right ${
              activeTab === 'articles'
                ? 'bg-[#1e293b] text-white border-r-4 border-[#d4af37] font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4" />
              <span>📖 مراجعة المقالات والمخطوطات</span>
            </div>
            {pendingArticlesCount + pendingManuscriptsCount > 0 && (
              <span className="bg-red-500/80 text-white text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
                {pendingArticlesCount + pendingManuscriptsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('discussions'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all text-right ${
              activeTab === 'discussions'
                ? 'bg-[#1e293b] text-white border-r-4 border-[#d4af37] font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4" />
              <span>💬 منتدى المناقشات والسبام</span>
            </div>
            {flaggedDiscussionsCount > 0 && (
              <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
                {flaggedDiscussionsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('reader'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-right ${
              activeTab === 'reader'
                ? 'bg-[#1e293b] text-white border-r-4 border-[#d4af37] font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>🛡️ تجربة القارئ الآمن والحماية</span>
          </button>

          <button
            onClick={() => { setActiveTab('settings'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-right ${
              activeTab === 'settings'
                ? 'bg-[#1e293b] text-white border-r-4 border-[#d4af37] font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>⚙️ إعدادات Chargily والشحن</span>
          </button>
        </nav>

        {/* Bottom System Status */}
        <div className="absolute bottom-6 right-6 left-6 p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-[11px] space-y-1">
          <div className="flex items-center justify-between text-slate-300">
            <span>حالة Chargily:</span>
            <span className="text-emerald-400 font-bold font-mono">متصل (V2 Live)</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>درع التشفير:</span>
            <span className="text-amber-400 font-bold">256-bit نشط</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        {/* Top Navbar */}
        <header className="bg-white p-4 sm:px-6 rounded-xl shadow-sm border border-slate-200/80 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-[#0f172a]">
                مرحباً، المدير العام (رميساء للنشر)
              </span>
              <span className="hidden sm:inline text-[11px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">
                صلاحيات كاملة
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingBook(null);
                setNewBookForm({
                  title: '',
                  author: '',
                  category: 'روايات وأدب',
                  description: '',
                  excerpt: '',
                  coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80',
                  paperPrice: 2200,
                  ebookPrice: 1300,
                  format: 'both',
                  pages: 350,
                  publisher: 'دار رميساء للنشر والترجمة',
                  isbn: '978-9931-754-' + Math.floor(10 + Math.random() * 89) + '-0',
                  publicationYear: 2026,
                  stockCount: 40,
                  chapter1Title: 'الفصل الأول',
                  chapter1Content: 'محتوى الفصل الأول للكتاب الجديد...'
                });
                setIsAddBookOpen(true);
              }}
              className="px-3.5 py-1.5 bg-[#d4af37] hover:bg-amber-500 text-[#0f172a] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة كتاب جديد</span>
            </button>
            <div className="w-9 h-9 rounded-full bg-[#d4af37] text-[#0f172a] font-bold flex items-center justify-center text-sm shadow">
              ر
            </div>
          </div>
        </header>

        {/* TAB 1: OVERVIEW & SALES (Exact alignment with prompt snippet) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid - Matching the prompt design */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/80 border-r-4 border-r-[#d4af37]">
                <h3 className="text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">
                  إجمالي مبيعات اليوم (Chargily & CIB)
                </h3>
                <p className="text-2xl sm:text-3xl font-bold font-mono text-[#0f172a]">
                  {totalRevenue.toLocaleString()}.00 دج
                </p>
                <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
                  ↑ {paidOrdersCount} عملية شراء مؤكدة آلياً
                </span>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/80 border-r-4 border-r-slate-400">
                <h3 className="text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">
                  الكتب الإلكترونية المقروءة حالياً
                </h3>
                <p className="text-2xl sm:text-3xl font-bold font-mono text-[#0f172a]">
                  128 كتاب
                </p>
                <span className="text-[11px] text-blue-600 font-medium mt-1 block">
                  عبر القارئ الآمن المشفر لدار رميساء
                </span>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/80 border-r-4 border-r-red-500">
                <h3 className="text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">
                  مقالات ومخطوطات في انتظار المراجعة
                </h3>
                <p className="text-2xl sm:text-3xl font-bold font-mono text-[#0f172a]">
                  {pendingArticlesCount + pendingManuscriptsCount} عناصر
                </p>
                <span className="text-[11px] text-red-600 font-medium mt-1 block">
                  تتطلب تدقيق هيئة التحرير
                </span>
              </div>
            </section>

            {/* Sales Table - The prompt's core data table */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#0f172a] font-serif">
                    📈 أحدث عمليات الشراء والطلبيات عبر البطاقة الذهبية / CIB
                  </h3>
                  <p className="text-xs text-slate-500">
                    جرد فوري لجميع المدفوعات المسجلة عبر بوابة Chargily وتطبيق بريدي موب
                  </p>
                </div>

                <div className="text-xs text-slate-500 font-mono">
                  إجمالي الطلبيات: {orders.length}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                      <th className="p-3 font-semibold">رقم الفاتورة</th>
                      <th className="p-3 font-semibold">الزبون / الحساب</th>
                      <th className="p-3 font-semibold">عنوان الكتاب</th>
                      <th className="p-3 font-semibold">نوع الإصدار</th>
                      <th className="p-3 font-semibold">ثمن البيع</th>
                      <th className="p-3 font-semibold">بوابة الدفع</th>
                      <th className="p-3 font-semibold">حالة الدفع الآلي</th>
                      <th className="p-3 font-semibold">حالة الشحن/التسليم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-mono font-bold text-slate-700">
                          {order.invoiceNumber}
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{order.customerName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{order.customerEmail}</div>
                          <div className="text-[10px] text-slate-500">{order.wilaya}</div>
                        </td>
                        <td className="p-3 font-medium text-slate-800">
                          {order.bookTitle}
                        </td>
                        <td className="p-3">
                          {order.bookType === 'ebook' ? (
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
                              E-Book للقراءة فقط
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                              نسخة ورقية
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-900">
                          {order.amount.toLocaleString()}.00 دج
                        </td>
                        <td className="p-3">
                          <span className="text-[11px] text-slate-600 font-mono">
                            {order.paymentMethod === 'chargily_edahabia' ? 'الذهبية (Chargily)' :
                             order.paymentMethod === 'chargily_cib' ? 'CIB البنكية' :
                             order.paymentMethod === 'baridimob' ? 'بريدي موب' : 'الدفع عند الاستلام'}
                          </span>
                        </td>
                        <td className="p-3">
                          {order.paymentStatus === 'paid' ? (
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                              مقبولة تلقائياً
                            </span>
                          ) : (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'paid')}
                              className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 hover:bg-amber-200"
                            >
                              قيد التأكيد (اضغط للقبول)
                            </button>
                          )}
                        </td>
                        <td className="p-3">
                          <select
                            value={order.deliveryStatus}
                            onChange={e => updateOrderStatus(order.id, undefined, e.target.value as any)}
                            className="text-[11px] border border-slate-300 rounded px-2 py-1 bg-white font-medium"
                          >
                            <option value="instant_digital">ترخيص رقمي فوري</option>
                            <option value="processing">قيد التجهيز</option>
                            <option value="shipped">تم الشحن (مع المندوب)</option>
                            <option value="delivered">تم التسليم للزبون</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: BOOKS INVENTORY & CONTROL */}
        {activeTab === 'books' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/80">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#0f172a] font-serif">
                    📚 جرد وتحكم الكتب والمخزن (ورقي وإلكتروني)
                  </h3>
                  <p className="text-xs text-slate-500">
                    إدارة أسعار الكتب، الكميات المتاحة في المستودع، وتحديث نصوص الفصول المشفرة
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingBook(null);
                    setIsAddBookOpen(true);
                  }}
                  className="px-3 py-1.5 bg-[#d4af37] text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>كتاب جديد</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {books.map(book => (
                  <div key={book.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex gap-4">
                    <img 
                      src={book.coverImage} 
                      alt={book.title} 
                      className="w-20 h-28 object-cover rounded shadow-sm border border-slate-300 shrink-0" 
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-sm text-slate-900 font-serif">{book.title}</h4>
                          <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-mono">
                            {book.pages} ص
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">تأليف: {book.author}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs font-mono">
                          <span className="text-amber-700 font-bold">ورقي: {book.paperPrice} دج</span>
                          <span className="text-blue-700 font-bold">إلكتروني: {book.ebookPrice} دج</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          المخزون الورقي: <strong className="text-slate-800">{book.stockCount} نسخة</strong> · المبيعات: {book.salesCount}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                        <button
                          onClick={() => openReader(book, 'ADMIN-TEST-PREVIEW')}
                          className="px-2 py-1 bg-slate-900 text-amber-400 text-[11px] rounded flex items-center gap-1 hover:bg-slate-800 font-semibold"
                        >
                          <Eye className="w-3 h-3" />
                          <span>معاينة في القارئ</span>
                        </button>
                        <button
                          onClick={() => startEditBook(book)}
                          className="px-2 py-1 bg-slate-200 text-slate-700 hover:bg-slate-300 text-[11px] rounded flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>تعديل</span>
                        </button>
                        <button
                          onClick={() => deleteBook(book.id)}
                          className="px-2 py-1 text-red-600 hover:bg-red-50 text-[11px] rounded flex items-center gap-1 mr-auto"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ARTICLES & MANUSCRIPTS REVIEW */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            {/* Articles section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/80">
              <h3 className="text-base font-bold text-[#0f172a] font-serif mb-3">
                📖 مراجعة مقالات المجلة الثقافية
              </h3>
              <div className="space-y-3">
                {articles.map(art => (
                  <div key={art.id} className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{art.title}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          art.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                          art.status === 'pending_review' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {art.status === 'published' ? 'منشور' : art.status === 'pending_review' ? 'قيد المراجعة' : 'مرفوض'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">الكاتب: {art.author} · {art.category} · {art.readTime}</p>
                      <p className="text-xs text-slate-600 line-clamp-1">{art.excerpt}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {art.status !== 'published' && (
                        <button
                          onClick={() => updateArticleStatus(art.id, 'published')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>الموافقة والنشر</span>
                        </button>
                      )}
                      {art.status !== 'rejected' && (
                        <button
                          onClick={() => updateArticleStatus(art.id, 'rejected')}
                          className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 text-xs font-bold rounded-lg flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>رفض</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Author Manuscripts Submissions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/80">
              <h3 className="text-base font-bold text-[#0f172a] font-serif mb-3">
                🖋️ مخطوطات الكتب الواردة من المؤلفين للنشر والطباعة
              </h3>
              <div className="space-y-3">
                {manuscripts.map(man => (
                  <div key={man.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 font-serif">
                          "{man.bookTitle}"
                        </h4>
                        <p className="text-xs text-slate-500">
                          المؤلف: <strong>{man.authorName}</strong> · هاتف: {man.authorPhone} · بريد: {man.authorEmail}
                        </p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold self-start ${
                        man.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        man.status === 'under_review' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {man.status === 'approved' ? 'مقبول للطباعة والنشر' :
                         man.status === 'under_review' ? 'قيد القراءة والتحكيم' : 'معتذر عنه'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                      <strong>ملخص العمل:</strong> {man.summary}
                      <div className="mt-1 pt-1 border-t border-slate-100 text-slate-500 text-[11px]">
                        <strong>عينة من الفصول:</strong> "{man.sampleChapters}"
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      {man.status !== 'approved' && (
                        <button
                          onClick={() => updateManuscriptStatus(man.id, 'approved')}
                          className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-700"
                        >
                          الموافقة على النشر وإرسال العقد
                        </button>
                      )}
                      {man.status !== 'rejected' && (
                        <button
                          onClick={() => updateManuscriptStatus(man.id, 'rejected')}
                          className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded hover:bg-red-200"
                        >
                          رفض المخطوط
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DISCUSSIONS & SPAM FILTER */}
        {activeTab === 'discussions' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/80">
              <h3 className="text-base font-bold text-[#0f172a] font-serif mb-2">
                💬 منتدى المناقشات ومكافحة السبام (Anti-Spam & Moderation)
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                مراقبة مشاركات الزوار وحظر الإعلانات الاحتيالية والروابط المشبوهة
              </p>

              <div className="space-y-4">
                {discussions.map(disc => (
                  <div 
                    key={disc.id} 
                    className={`p-4 rounded-xl border ${
                      disc.isFlaggedSpam 
                        ? 'border-red-300 bg-red-50/60' 
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {disc.isFlaggedSpam && (
                          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                        )}
                        <h4 className="font-bold text-sm text-slate-900">{disc.title}</h4>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{disc.date}</span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1">الكاتب: {disc.author} {disc.bookRef && `· بخصوص: ${disc.bookRef}`}</p>
                    
                    <p className="text-xs text-slate-700 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {disc.content}
                    </p>

                    {disc.isFlaggedSpam && (
                      <div className="mt-2 text-xs font-semibold text-red-700 flex items-center gap-1">
                        <span>السبب:</span>
                        <span>{disc.spamReason || 'محتوى مخالف للشروط'}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
                      {disc.isFlaggedSpam ? (
                        <button
                          onClick={() => toggleDiscussionSpam(disc.id, false)}
                          className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-700"
                        >
                          فك الحظر والموافقة
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleDiscussionSpam(disc.id, true, 'تم الإبلاغ يدوياً بواسطة الإدارة')}
                          className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded hover:bg-amber-200"
                        >
                          تحديد كـ سبام / إعلان مخالف
                        </button>
                      )}

                      <button
                        onClick={() => deleteDiscussion(disc.id)}
                        className="px-3 py-1 text-red-600 hover:bg-red-50 text-xs font-bold rounded mr-auto"
                      >
                        حذف المنشور نهائياً
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SECURE READER SIMULATION & SECURITY SUITE */}
        {activeTab === 'reader' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/80 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#0f172a] font-serif">
                    🛡️ تجربة القارئ الآمن وضبط أنظمة الحماية الفكرية
                  </h3>
                  <p className="text-xs text-slate-500">
                    محاكاة نظام التشفير ضد القرصنة والنسخ وتصوير الشاشة
                  </p>
                </div>
                <button
                  onClick={() => openReader(books[0], 'CH-DEMO-SIMULATION')}
                  className="px-4 py-2 bg-[#0f172a] hover:bg-slate-800 text-[#d4af37] font-bold text-xs rounded-xl flex items-center gap-2 shadow-md"
                >
                  <Eye className="w-4 h-4" />
                  <span>فتح القارئ التجريبي بكامل الشاشة</span>
                </button>
              </div>

              {/* Security Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase">
                    أدوات الحظر المباشر
                  </h4>

                  <label className="flex items-center justify-between text-xs cursor-pointer">
                    <span>1. حظر زر الماوس الأيمن (Context Menu)</span>
                    <input
                      type="checkbox"
                      checked={securityConfig.blockRightClick}
                      onChange={e => updateSecurityConfig({ blockRightClick: e.target.checked })}
                      className="w-4 h-4 accent-[#d4af37]"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs cursor-pointer">
                    <span>2. حظر تظليل وتحديد النصوص (Anti-Selection)</span>
                    <input
                      type="checkbox"
                      checked={securityConfig.blockTextSelection}
                      onChange={e => updateSecurityConfig({ blockTextSelection: e.target.checked })}
                      className="w-4 h-4 accent-[#d4af37]"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs cursor-pointer">
                    <span>3. حظر اختصارات النسخ (Ctrl+C, Ctrl+U, F12)</span>
                    <input
                      type="checkbox"
                      checked={securityConfig.blockShortcuts}
                      onChange={e => updateSecurityConfig({ blockShortcuts: e.target.checked })}
                      className="w-4 h-4 accent-[#d4af37]"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs cursor-pointer">
                    <span>4. مكافحة تصوير الشاشة (PrintScreen Deterrent)</span>
                    <input
                      type="checkbox"
                      checked={securityConfig.blockPrintScreen}
                      onChange={e => updateSecurityConfig({ blockPrintScreen: e.target.checked })}
                      className="w-4 h-4 accent-[#d4af37]"
                    />
                  </label>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase">
                    العلامة المائية الحية (Dynamic Watermark)
                  </h4>

                  <div>
                    <label className="text-xs text-slate-600 block mb-1">
                      شفافية العلامة المائية: {(securityConfig.watermarkOpacity * 100).toFixed(0)}%
                    </label>
                    <input
                      type="range"
                      min="0.02"
                      max="0.30"
                      step="0.01"
                      value={securityConfig.watermarkOpacity}
                      onChange={e => updateSecurityConfig({ watermarkOpacity: parseFloat(e.target.value) })}
                      className="w-full accent-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 block mb-1">
                      صيغة نص العلامة المائية المتغيرة:
                    </label>
                    <input
                      type="text"
                      value={securityConfig.watermarkPattern}
                      onChange={e => updateSecurityConfig({ watermarkPattern: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none font-mono"
                    />
                    <span className="text-[10px] text-slate-400 block mt-1">
                      يدعم: {'{name}'} و {'{email}'} و {'{invoice}'}
                    </span>
                  </div>

                  <button
                    onClick={() => triggerSecurityAlert('تنبيه تجريبي: تم اختبار محرك الحماية الفكرية بنجاح.')}
                    className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors"
                  >
                    اختبار ظهور نافذة التنبيه الأمني
                  </button>
                </div>
              </div>

              {/* Embedded Interactive Reader Simulator (Matching prompt snippet) */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-xs text-slate-700">
                    معاينة القارئ الآمن المدمج مباشرة داخل لوحة التحكم:
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    الكتاب: {books[0]?.title}
                  </span>
                </div>

                <div className="w-full h-80 relative overflow-hidden bg-white border border-slate-300 rounded-xl flex items-center justify-center p-8 text-center select-none shadow-inner">
                  {/* Dynamic Watermark preview */}
                  <div 
                    className="absolute inset-0 pointer-events-none flex flex-col justify-around items-center select-none"
                    style={{ opacity: securityConfig.watermarkOpacity }}
                  >
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="font-bold tracking-widest text-[#0f172a] transform -rotate-12 whitespace-nowrap text-xs font-mono">
                        اسم المشترك : Roumaissa User | البريد الإلكتروني : user@example.com | رقم الفاتورة : CH-9872
                      </div>
                    ))}
                  </div>

                  <div className="max-w-md relative z-10 space-y-3">
                    <h3 className="text-xl font-bold font-serif text-[#0f172a]">
                      محتوى الكتاب الإلكتروني المشفر لقراء المتصفح فقط - دار رميساء
                    </h3>
                    <p className="text-xs text-slate-500 font-serif leading-relaxed">
                      {books[0]?.excerpt}
                    </p>
                    <span className="inline-block text-[10px] text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-bold border border-emerald-200">
                      محمي ضد النسخ والطباعة الخارجية
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CHARGILY SETTINGS & PAYMENT GATEWAY */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/80 space-y-5">
              <div>
                <h3 className="text-base font-bold text-[#0f172a] font-serif">
                  ⚙️ إعدادات بوابة الدفع الجزائري Chargily Pay & الشحن
                </h3>
                <p className="text-xs text-slate-500">
                  ربط مفاتيح API الخاصة بحساب دار رميساء لدى Chargily للبطاقة الذهبية و CIB وبريدي موب
                </p>
              </div>

              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">وضع التشغيل (Gateway Mode)</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => updateChargilySettings({ mode: 'test' })}
                      className={`px-4 py-2 rounded-lg text-xs font-bold ${
                        chargilySettings.mode === 'test' 
                          ? 'bg-amber-500 text-slate-950' 
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      بيئة الاختبار التجريبية (Sandbox)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateChargilySettings({ mode: 'live' })}
                      className={`px-4 py-2 rounded-lg text-xs font-bold ${
                        chargilySettings.mode === 'live' 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      الوضع الحي الفعلي (Production Live)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1">المفتاح العام (Chargily Public Key)</label>
                  <input
                    type="text"
                    value={chargilySettings.apiKey}
                    onChange={e => updateChargilySettings({ apiKey: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1">المفتاح السري (Chargily Secret Key)</label>
                  <input
                    type="password"
                    value={chargilySettings.secretKey}
                    onChange={e => updateChargilySettings({ secretKey: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1">رابط استقبال الإشعارات (Webhook URL)</label>
                  <input
                    type="text"
                    value={chargilySettings.webhookUrl}
                    onChange={e => updateChargilySettings({ webhookUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg outline-none"
                  />
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <div className="font-bold text-slate-800">طرق الدفع المفعلة:</div>
                  <div className="flex flex-wrap gap-4 text-slate-700">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={chargilySettings.edahabiaEnabled}
                        onChange={e => updateChargilySettings({ edahabiaEnabled: e.target.checked })}
                        className="accent-[#d4af37]"
                      />
                      <span>البطاقة الذهبية (Edahabia)</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={chargilySettings.cibEnabled}
                        onChange={e => updateChargilySettings({ cibEnabled: e.target.checked })}
                        className="accent-[#d4af37]"
                      />
                      <span>بطاقة CIB البنكية</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={chargilySettings.baridiMobEnabled}
                        onChange={e => updateChargilySettings({ baridiMobEnabled: e.target.checked })}
                        className="accent-[#d4af37]"
                      />
                      <span>بريدي موب (BaridiMob)</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold">
                    <Check className="w-4 h-4" />
                    <span>تم حفظ الإعدادات تلقائياً في التخزين المشفر</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add / Edit Book Modal */}
      {isAddBookOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-[#0f172a] text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base text-[#d4af37] font-serif">
                {editingBook ? 'تعديل بيانات الكتاب' : 'إضافة كتاب جديد لمكتبة دار رميساء'}
              </h3>
              <button 
                onClick={() => setIsAddBookOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBook} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">عنوان الكتاب</label>
                  <input
                    type="text"
                    required
                    value={newBookForm.title}
                    onChange={e => setNewBookForm({ ...newBookForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">المؤلف / المترجم</label>
                  <input
                    type="text"
                    required
                    value={newBookForm.author}
                    onChange={e => setNewBookForm({ ...newBookForm, author: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">التصنيف</label>
                  <select
                    value={newBookForm.category}
                    onChange={e => setNewBookForm({ ...newBookForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white"
                  >
                    <option value="روايات وأدب">روايات وأدب</option>
                    <option value="تاريخ وتراث">تاريخ وتراث</option>
                    <option value="فلسفة وترجمة">فلسفة وترجمة</option>
                    <option value="دراسات أكاديمية">دراسات أكاديمية</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">صيغة النشر</label>
                  <select
                    value={newBookForm.format}
                    onChange={e => setNewBookForm({ ...newBookForm, format: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white"
                  >
                    <option value="both">ورقي + إلكتروني (كلاهما)</option>
                    <option value="ebook">إلكتروني فقط (E-Book)</option>
                    <option value="paper">ورقي فقط</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">سعر النسخة الورقية (دج)</label>
                  <input
                    type="number"
                    value={newBookForm.paperPrice}
                    onChange={e => setNewBookForm({ ...newBookForm, paperPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">سعر النسخة الإلكترونية (دج)</label>
                  <input
                    type="number"
                    value={newBookForm.ebookPrice}
                    onChange={e => setNewBookForm({ ...newBookForm, ebookPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">عدد الصفحات</label>
                  <input
                    type="number"
                    value={newBookForm.pages}
                    onChange={e => setNewBookForm({ ...newBookForm, pages: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-semibold">الكمية بالمخزن الورقي</label>
                  <input
                    type="number"
                    value={newBookForm.stockCount}
                    onChange={e => setNewBookForm({ ...newBookForm, stockCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">رابط صورة الغلاف</label>
                <input
                  type="url"
                  value={newBookForm.coverImage}
                  onChange={e => setNewBookForm({ ...newBookForm, coverImage: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">الوصف ونبذة العمل</label>
                <textarea
                  rows={2}
                  value={newBookForm.description}
                  onChange={e => setNewBookForm({ ...newBookForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">مقتطف العينة المجانية</label>
                <textarea
                  rows={2}
                  value={newBookForm.excerpt}
                  onChange={e => setNewBookForm({ ...newBookForm, excerpt: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                />
              </div>

              {!editingBook && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-800">محتوى الفصل الأول للقارئ الرقمي:</div>
                  <input
                    type="text"
                    placeholder="عنوان الفصل الأول"
                    value={newBookForm.chapter1Title}
                    onChange={e => setNewBookForm({ ...newBookForm, chapter1Title: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-none"
                  />
                  <textarea
                    rows={4}
                    placeholder="نص الفصل الأول كاملاً المشفر..."
                    value={newBookForm.chapter1Content}
                    onChange={e => setNewBookForm({ ...newBookForm, chapter1Content: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg outline-none font-serif"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddBookOpen(false)}
                  className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#d4af37] hover:bg-amber-500 text-slate-950 font-bold rounded-xl shadow"
                >
                  حفظ الكتاب ونشره فوراً
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
