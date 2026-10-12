import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MessageSquare, AlertTriangle, Send, Plus, BookOpen, User, CheckCircle2 } from 'lucide-react';

export const ForumView: React.FC = () => {
  const { 
    discussions, addDiscussion, addDiscussionReply, 
    toggleDiscussionSpam, currentUser, books 
  } = useStore();

  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false);
  const [topicTitle, setTopicTitle] = useState('');
  const [topicContent, setTopicContent] = useState('');
  const [selectedBookRef, setSelectedBookRef] = useState('');

  // Only show non-spam discussions to regular readers (admin can view all in dashboard)
  const visibleDiscussions = discussions.filter(d => !d.isFlaggedSpam || currentUser.role === 'admin');

  const handlePostReply = (discussionId: string) => {
    if (!replyText.trim()) return;
    addDiscussionReply(discussionId, replyText, currentUser.name);
    setReplyText('');
    setActiveReplyId(null);
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicTitle.trim() || !topicContent.trim()) return;

    addDiscussion({
      title: topicTitle,
      author: currentUser.name,
      content: topicContent,
      bookRef: selectedBookRef || undefined
    });

    setTopicTitle('');
    setTopicContent('');
    setSelectedBookRef('');
    setIsNewTopicOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
            نادي القراء وحلقات النقاش
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
            منتدى المناقشات الأدبية
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            شارك انطباعاتك حول الروايات والكتب الفلسفية، وناقش المؤلفين والقراء في بيئة محمية
          </p>
        </div>

        <button
          onClick={() => setIsNewTopicOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>فتح حلقة نقاش جديدة</span>
        </button>
      </div>

      {/* New Topic Drawer/Modal */}
      {isNewTopicOpen && (
        <div className="bg-white p-6 rounded-2xl border-2 border-amber-400/40 shadow-xl space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">إنشاء موضوع نقاش أدبي</h3>
            <button 
              onClick={() => setIsNewTopicOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              إلغاء
            </button>
          </div>

          <form onSubmit={handleCreateTopic} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-600 block mb-1 font-semibold">عنوان الموضوع</label>
              <input
                type="text"
                required
                value={topicTitle}
                onChange={e => setTopicTitle(e.target.value)}
                placeholder="مثال: دلالة الرمز في رواية فلسفة العصور..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-semibold">الكتاب المرتبط (اختياري)</label>
              <select
                value={selectedBookRef}
                onChange={e => setSelectedBookRef(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white"
              >
                <option value="">نقاش عام دون ارتباط بكتاب محدد</option>
                {books.map(b => (
                  <option key={b.id} value={b.title}>{b.title} ({b.author})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-semibold">محتوى المداخلة</label>
              <textarea
                rows={4}
                required
                value={topicContent}
                onChange={e => setTopicContent(e.target.value)}
                placeholder="اكتب أفكارك وتساؤلاتك للقراء..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
              />
            </div>

            <div className="text-[11px] text-slate-400">
              * تخضع جميع المشاركات تلقائياً لمرشح مكافحة السبام والإعلانات المشبوهة.
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-colors"
            >
              نشر الموضوع في المنتدى
            </button>
          </form>
        </div>
      )}

      {/* Discussions Feed */}
      <div className="space-y-4">
        {visibleDiscussions.map(disc => (
          <div
            key={disc.id}
            className={`bg-white rounded-2xl border p-6 shadow-sm transition-all ${
              disc.isFlaggedSpam 
                ? 'border-red-300 bg-red-50/50' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold font-serif text-lg text-slate-900">
                    {disc.title}
                  </h3>
                  {disc.isFlaggedSpam && (
                    <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">
                      تم رصده كـ سبام (مرئي للإدارة فقط)
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <span>الكاتب: <strong>{disc.author}</strong></span>
                  <span>·</span>
                  <span>{disc.date}</span>
                  {disc.bookRef && (
                    <>
                      <span>·</span>
                      <span className="text-amber-700 font-semibold flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {disc.bookRef}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Spam Report button */}
              {!disc.isFlaggedSpam && (
                <button
                  onClick={() => toggleDiscussionSpam(disc.id, true, 'تم الإبلاغ عنه بواسطة أحد القراء كـ سبام')}
                  className="text-[11px] text-slate-400 hover:text-red-600 flex items-center gap-1 transition-colors self-start"
                  title="إبلاغ الإدارة عن محتوى غير لائق أو إعلان مزعج"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>إبلاغ كـ سبام</span>
                </button>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-700 mt-3 leading-relaxed bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
              {disc.content}
            </p>

            {/* Replies section */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                  <span>الردود والمشاركات ({disc.replies.length})</span>
                </span>

                <button
                  onClick={() => setActiveReplyId(activeReplyId === disc.id ? null : disc.id)}
                  className="text-xs font-bold text-amber-700 hover:underline"
                >
                  {activeReplyId === disc.id ? 'إلغاء الرد' : '+ إضافة رد'}
                </button>
              </div>

              {/* Replies list */}
              {disc.replies.map(rep => (
                <div key={rep.id} className="mr-4 pr-3 border-r-2 border-amber-300 space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-800">{rep.author}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{rep.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rep.content}</p>
                </div>
              ))}

              {/* Inline Reply input */}
              {activeReplyId === disc.id && (
                <div className="pt-2 flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="اكتب ردك وملاحظتك..."
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                    onKeyDown={e => {
                      if (e.key === 'Enter') handlePostReply(disc.id);
                    }}
                  />
                  <button
                    onClick={() => handlePostReply(disc.id)}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5 rotate-180" />
                    <span>إرسال</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
