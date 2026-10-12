import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Feather, CheckCircle2, ShieldCheck, FileText, UploadCloud, Info } from 'lucide-react';

export const SubmitManuscriptView: React.FC = () => {
  const { submitManuscript, currentUser } = useStore();

  const [authorName, setAuthorName] = useState(currentUser.name);
  const [authorEmail, setAuthorEmail] = useState(currentUser.email);
  const [authorPhone, setAuthorPhone] = useState('0550123456');
  const [bookTitle, setBookTitle] = useState('');
  const [genre, setGenre] = useState('رواية وأدب');
  const [pageCount, setPageCount] = useState(250);
  const [summary, setSummary] = useState('');
  const [sampleChapters, setSampleChapters] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitManuscript({
      authorName,
      authorEmail,
      authorPhone,
      bookTitle,
      genre,
      pageCount: Number(pageCount),
      summary,
      sampleChapters
    });
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold">
          <Feather className="w-3.5 h-3.5" />
          <span>هيئة تحرير دار رميساء للنشر والترجمة</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900">
          انشر كتابك ومخطوطتك معنا
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          نستقبل الأعمال الروائية، الفلسفية، التاريخية، والترجمات المتميزة من المؤلفين الجزائريين والعرب. نوفر التدقيق اللغوي، التوزيع الوطني لـ 58 ولاية، والحماية الرقمية الكاملة.
        </p>
      </div>

      {isSubmitted ? (
        <div className="bg-white rounded-2xl border border-emerald-200 p-8 sm:p-12 text-center shadow-lg space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-serif">
            تم استلام المخطوطة بنجاح!
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            شكراً لك أستاذ <strong>{authorName}</strong>. تمت إحالة عملك <strong>"{bookTitle}"</strong> إلى هيئة القراءة والتحكيم بدار رميساء، وستصلك إفادة رسمية عبر بريدك الإلكتروني خلال 14 يوماً عمل.
          </p>
          <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 font-mono">
            يمكن لإدارة الدار مراجعة وقبول المخطوطة الآن مباشرة من لوحة التحكم.
          </div>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setBookTitle('');
              setSummary('');
              setSampleChapters('');
            }}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            إرسال مخطوطة أخرى
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-base text-slate-900">بيانات الكاتب / الباحث</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">الاسم واللقب</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={e => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={authorEmail}
                  onChange={e => setAuthorEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">رقم الهاتف (للتواصل السريع)</label>
                <input
                  type="tel"
                  required
                  value={authorPhone}
                  onChange={e => setAuthorPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-base text-slate-900">بيانات المخطوط والعمل الفكري</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">عنوان العمل المقترح</label>
                <input
                  type="text"
                  required
                  value={bookTitle}
                  onChange={e => setBookTitle(e.target.value)}
                  placeholder="مثال: أصداء تلمسان في الشعر المغاربي"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">جنس المصنف / المجال</label>
                <select
                  value={genre}
                  onChange={e => setGenre(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white"
                >
                  <option value="رواية وأدب">رواية وأدب</option>
                  <option value="تاريخ وتراث جزائري">تاريخ وتراث جزائري</option>
                  <option value="دراسات فلسفية ونقدية">دراسات فلسفية ونقدية</option>
                  <option value="ترجمة معتمدة">ترجمة معتمدة</option>
                  <option value="أطروحة أكاديمية">أطروحة أكاديمية</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-semibold">العدد التقديري للصفحات</label>
                <input
                  type="number"
                  required
                  value={pageCount}
                  onChange={e => setPageCount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none font-mono"
                />
              </div>
            </div>

            <div className="mt-4 text-xs space-y-1">
              <label className="text-slate-600 block font-semibold">الملخص العام وإشكالية العمل</label>
              <textarea
                rows={3}
                required
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="قدم فكرة الكتاب، الفئة المستهدفة، والقيمة المضافة التي يقدمها للمكتبة الجزائرية..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
              />
            </div>

            <div className="mt-4 text-xs space-y-1">
              <label className="text-slate-600 block font-semibold">مقدمة العمل أو عينة من الفصل الأول</label>
              <textarea
                rows={6}
                required
                value={sampleChapters}
                onChange={e => setSampleChapters(e.target.value)}
                placeholder="الصق هنا صفحات البداية ليتسنى للجنة التحكيم تقييم الأسلوب ولغة الكتابة..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none font-serif text-sm"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 text-xs text-slate-600">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              تلتزم <strong>دار رميساء للنشر والترجمة</strong> بالحفاظ الصارم على سرية الأفكار والمخطوطات المودعة وعدم استخدامها أو استغلالها إلا في إطار اتفاقية تعاقدية رسمية وموثقة مع المؤلف.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-colors shadow-lg shadow-amber-500/20 text-sm flex items-center justify-center gap-2"
          >
            <Feather className="w-4 h-4" />
            <span>إرسال المخطوطة لهيئة التحكيم والنشر</span>
          </button>
        </form>
      )}
    </div>
  );
};
