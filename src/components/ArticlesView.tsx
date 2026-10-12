import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Article } from '../types';
import { FileText, Clock, Eye, MessageSquare, Feather, CheckCircle2, ArrowRight } from 'lucide-react';

export const ArticlesView: React.FC = () => {
  const { articles, addArticle, currentUser } = useStore();

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isSubmitArticleOpen, setIsSubmitArticleOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('دراسات ومقالات');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newContent, setNewContent] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const publishedArticles = articles.filter(a => a.status === 'published');

  const handleSubmitArticle = (e: React.FormEvent) => {
    e.preventDefault();
    addArticle({
      title: newTitle,
      author: currentUser.name,
      authorBio: 'كاتب ومساهم في مجلة دار رميساء',
      category: newCategory,
      publishDate: 'اليوم',
      readTime: '5 دقائق',
      excerpt: newExcerpt,
      content: newContent,
      status: 'pending_review'
    });
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsSubmitArticleOpen(false);
      setNewTitle('');
      setNewExcerpt('');
      setNewContent('');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
            مجلة دار رميساء الفكرية
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
            دراسات ومقالات نقدية
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            منصة للنقد الأدبي، أبحاث الترجمة، وإضاءات حول التراث الفكري الجزائري والعالمي
          </p>
        </div>

        <button
          onClick={() => setIsSubmitArticleOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl transition-colors flex items-center gap-2 shadow-sm"
        >
          <Feather className="w-4 h-4" />
          <span>إرسال مقال للنشر في المجلة</span>
        </button>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publishedArticles.map(art => (
          <article
            key={art.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-amber-700">{art.category}</span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {art.readTime}
                </span>
              </div>

              <h3 
                onClick={() => setSelectedArticle(art)}
                className="font-bold font-serif text-lg text-slate-900 hover:text-amber-700 transition-colors cursor-pointer leading-snug"
              >
                {art.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {art.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800 block">{art.author}</span>
                <span className="text-[11px] text-slate-400">{art.publishDate}</span>
              </div>

              <button
                onClick={() => setSelectedArticle(art)}
                className="text-amber-700 font-bold hover:underline flex items-center gap-1"
              >
                <span>قراءة المقال</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="text-xs text-amber-400 font-mono">
                {selectedArticle.category} · {selectedArticle.readTime}
              </div>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto text-right">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 leading-tight">
                  {selectedArticle.title}
                </h2>
                <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 pb-4 border-b border-slate-100">
                  <span>بقلم: <strong>{selectedArticle.author}</strong></span>
                  <span>·</span>
                  <span>{selectedArticle.authorBio}</span>
                  <span>·</span>
                  <span>نُشر في: {selectedArticle.publishDate}</span>
                </div>
              </div>

              <div className="font-serif text-base text-slate-800 leading-loose whitespace-pre-line text-justify">
                {selectedArticle.content}
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                <span>© جميع حقوق النشر محفوظة لدار رميساء والمؤلف.</span>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-amber-700 font-bold hover:underline"
                >
                  إغلاق المقال
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Article Modal */}
      {isSubmitArticleOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-sm text-amber-400">
                إرسال مقال إلى هيئة تحرير دار رميساء
              </h3>
              <button 
                onClick={() => setIsSubmitArticleOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {submittedSuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base text-slate-900">تم إرسال المقال بنجاح!</h4>
                <p className="text-xs text-slate-500">
                  سيتم تدقيق المقال من طرف هيئة التحرير (يمكن معاينته الآن في لوحة الإدارة).
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitArticle} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">عنوان المقال</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="مثال: تحولات السرد في الرواية الجزائرية المعاصرة..."
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">المجال</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white"
                  >
                    <option value="دراسات ومقالات">دراسات ومقالات</option>
                    <option value="نقد أدبي">نقد أدبي</option>
                    <option value="فلسفة وترجمة">فلسفة وترجمة</option>
                    <option value="تحقيق وتراث">تحقيق وتراث</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">الموجز والملخص</label>
                  <textarea
                    rows={2}
                    required
                    value={newExcerpt}
                    onChange={e => setNewExcerpt(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                    placeholder="ملخص قصير لا يتجاوز 3 أسطر..."
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1 font-semibold">النص الكامل للمقال</label>
                  <textarea
                    rows={6}
                    required
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none font-serif"
                    placeholder="اكتب أو الصق نص المقال هنا..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-colors shadow-sm"
                >
                  إرسال المقال للمراجعة
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
