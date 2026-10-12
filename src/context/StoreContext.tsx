import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Book, Order, Article, Discussion, SecurityConfig, 
  ChargilySettings, ManuscriptSubmission, PaymentStatus, DeliveryStatus 
} from '../types';
import { 
  INITIAL_BOOKS, INITIAL_ORDERS, INITIAL_ARTICLES, 
  INITIAL_DISCUSSIONS, INITIAL_MANUSCRIPTS, 
  INITIAL_SECURITY_CONFIG, INITIAL_CHARGILY_SETTINGS 
} from '../data/initialData';

export type ViewMode = 'store' | 'dashboard' | 'reader' | 'articles' | 'forum' | 'library' | 'submit_manuscript';

interface CurrentUser {
  name: string;
  email: string;
  role: 'reader' | 'admin';
}

interface StoreContextType {
  books: Book[];
  orders: Order[];
  articles: Article[];
  discussions: Discussion[];
  manuscripts: ManuscriptSubmission[];
  securityConfig: SecurityConfig;
  chargilySettings: ChargilySettings;
  currentUser: CurrentUser;
  setCurrentUser: (user: CurrentUser) => void;
  myLibraryBookIds: string[];
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  activeReaderBook: Book | null;
  activeInvoice: string;
  securityAlert: { show: boolean; message: string } | null;
  dismissSecurityAlert: () => void;
  triggerSecurityAlert: (msg: string) => void;
  openReader: (book: Book, invoice?: string) => void;
  closeReader: () => void;
  
  // Handlers
  addBook: (book: Omit<Book, 'id'>) => Book;
  updateBook: (book: Book) => void;
  deleteBook: (id: string) => void;
  createOrder: (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    wilaya: string;
    address?: string;
    bookId: string;
    bookType: 'ebook' | 'paper';
    paymentMethod: any;
    amount: number;
  }) => Order;
  updateOrderStatus: (orderId: string, paymentStatus?: PaymentStatus, deliveryStatus?: DeliveryStatus) => void;
  addArticle: (art: Omit<Article, 'id' | 'views' | 'commentsCount'>) => void;
  updateArticleStatus: (id: string, status: 'published' | 'pending_review' | 'rejected') => void;
  addDiscussion: (disc: { title: string; author: string; content: string; bookRef?: string }) => void;
  addDiscussionReply: (discId: string, content: string, author?: string) => void;
  toggleDiscussionSpam: (id: string, isSpam: boolean, reason?: string) => void;
  deleteDiscussion: (id: string) => void;
  submitManuscript: (manuscript: {
    authorName: string;
    authorEmail: string;
    authorPhone: string;
    bookTitle: string;
    genre: string;
    pageCount: number;
    summary: string;
    sampleChapters: string;
  }) => void;
  updateManuscriptStatus: (id: string, status: 'under_review' | 'approved' | 'rejected') => void;
  updateSecurityConfig: (cfg: Partial<SecurityConfig>) => void;
  updateChargilySettings: (cfg: Partial<ChargilySettings>) => void;
  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('roumaissa_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('roumaissa_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('roumaissa_articles');
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
  });

  const [discussions, setDiscussions] = useState<Discussion[]>(() => {
    const saved = localStorage.getItem('roumaissa_discussions');
    return saved ? JSON.parse(saved) : INITIAL_DISCUSSIONS;
  });

  const [manuscripts, setManuscripts] = useState<ManuscriptSubmission[]>(() => {
    const saved = localStorage.getItem('roumaissa_manuscripts');
    return saved ? JSON.parse(saved) : INITIAL_MANUSCRIPTS;
  });

  const [securityConfig, setSecurityConfig] = useState<SecurityConfig>(() => {
    const saved = localStorage.getItem('roumaissa_security');
    return saved ? JSON.parse(saved) : INITIAL_SECURITY_CONFIG;
  });

  const [chargilySettings, setChargilySettings] = useState<ChargilySettings>(() => {
    const saved = localStorage.getItem('roumaissa_chargily');
    return saved ? JSON.parse(saved) : INITIAL_CHARGILY_SETTINGS;
  });

  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    name: 'عمر بن ناصر',
    email: 'omar.bennasser@gmail.com',
    role: 'reader'
  });

  const [myLibraryBookIds, setMyLibraryBookIds] = useState<string[]>(['book-1', 'book-4']);
  const [currentView, setCurrentView] = useState<ViewMode>('store');
  const [activeReaderBook, setActiveReaderBook] = useState<Book | null>(null);
  const [activeInvoice, setActiveInvoice] = useState<string>('CH-9872');
  const [securityAlert, setSecurityAlert] = useState<{ show: boolean; message: string } | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('roumaissa_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('roumaissa_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('roumaissa_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('roumaissa_discussions', JSON.stringify(discussions));
  }, [discussions]);

  useEffect(() => {
    localStorage.setItem('roumaissa_manuscripts', JSON.stringify(manuscripts));
  }, [manuscripts]);

  useEffect(() => {
    localStorage.setItem('roumaissa_security', JSON.stringify(securityConfig));
  }, [securityConfig]);

  useEffect(() => {
    localStorage.setItem('roumaissa_chargily', JSON.stringify(chargilySettings));
  }, [chargilySettings]);

  const triggerSecurityAlert = (message: string) => {
    setSecurityAlert({ show: true, message });
  };

  const dismissSecurityAlert = () => {
    setSecurityAlert(null);
  };

  const openReader = (book: Book, invoice?: string) => {
    setActiveReaderBook(book);
    setActiveInvoice(invoice || `CH-${Math.floor(1000 + Math.random() * 9000)}`);
    setCurrentView('reader');
  };

  const closeReader = () => {
    setActiveReaderBook(null);
    setCurrentView('store');
  };

  const addBook = (bookData: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...bookData,
      id: `book-${Date.now()}`
    };
    setBooks(prev => [newBook, ...prev]);
    return newBook;
  };

  const updateBook = (updated: Book) => {
    setBooks(prev => prev.map(b => b.id === updated.id ? updated : b));
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  const createOrder = (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    wilaya: string;
    address?: string;
    bookId: string;
    bookType: 'ebook' | 'paper';
    paymentMethod: any;
    amount: number;
  }): Order => {
    const book = books.find(b => b.id === orderData.bookId);
    const invoicePrefix = orderData.paymentMethod === 'baridimob' ? 'BM' : 
                          orderData.paymentMethod === 'cash_on_delivery' ? 'COD' : 'CH';
    const invoiceNum = `${invoicePrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      invoiceNumber: invoiceNum,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      wilaya: orderData.wilaya,
      address: orderData.address,
      bookId: orderData.bookId,
      bookTitle: book ? book.title : 'كتاب غير محدد',
      bookType: orderData.bookType,
      amount: orderData.amount,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
      deliveryStatus: orderData.bookType === 'ebook' ? 'instant_digital' : 'processing',
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      timestamp: Date.now()
    };

    setOrders(prev => [newOrder, ...prev]);

    // If ebook, automatically add to library
    if (orderData.bookType === 'ebook' && !myLibraryBookIds.includes(orderData.bookId)) {
      setMyLibraryBookIds(prev => [...prev, orderData.bookId]);
    }

    // Increment sales count for book
    if (book) {
      setBooks(prev => prev.map(b => {
        if (b.id === book.id) {
          return {
            ...b,
            salesCount: b.salesCount + 1,
            stockCount: orderData.bookType === 'paper' ? Math.max(0, b.stockCount - 1) : b.stockCount
          };
        }
        return b;
      }));
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, paymentStatus?: PaymentStatus, deliveryStatus?: DeliveryStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          ...(paymentStatus && { paymentStatus }),
          ...(deliveryStatus && { deliveryStatus })
        };
      }
      return o;
    }));
  };

  const addArticle = (artData: Omit<Article, 'id' | 'views' | 'commentsCount'>) => {
    const newArt: Article = {
      ...artData,
      id: `art-${Date.now()}`,
      views: 0,
      commentsCount: 0
    };
    setArticles(prev => [newArt, ...prev]);
  };

  const updateArticleStatus = (id: string, status: 'published' | 'pending_review' | 'rejected') => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const addDiscussion = (disc: { title: string; author: string; content: string; bookRef?: string }) => {
    // Check for spam keywords
    const spamKeywords = ['ربح سريع', 'مجان', 'دولار مجانا', 'http://', 'https://', 'bit.ly', 'اضغط الرابط'];
    const isSpam = spamKeywords.some(keyword => disc.title.includes(keyword) || disc.content.includes(keyword));

    const newDisc: Discussion = {
      id: `disc-${Date.now()}`,
      title: disc.title,
      author: disc.author,
      content: disc.content,
      bookRef: disc.bookRef,
      date: 'الآن',
      replies: [],
      isFlaggedSpam: isSpam,
      spamReason: isSpam ? 'تم رصد روابط أو كلمات إعلانية مشبوهة' : undefined
    };
    setDiscussions(prev => [newDisc, ...prev]);
  };

  const addDiscussionReply = (discId: string, content: string, author?: string) => {
    setDiscussions(prev => prev.map(d => {
      if (d.id === discId) {
        return {
          ...d,
          replies: [
            ...d.replies,
            {
              id: `rep-${Date.now()}`,
              author: author || currentUser.name,
              content,
              date: 'الآن'
            }
          ]
        };
      }
      return d;
    }));
  };

  const toggleDiscussionSpam = (id: string, isSpam: boolean, reason?: string) => {
    setDiscussions(prev => prev.map(d => d.id === id ? { ...d, isFlaggedSpam: isSpam, spamReason: reason } : d));
  };

  const deleteDiscussion = (id: string) => {
    setDiscussions(prev => prev.filter(d => d.id !== id));
  };

  const submitManuscript = (manuscript: {
    authorName: string;
    authorEmail: string;
    authorPhone: string;
    bookTitle: string;
    genre: string;
    pageCount: number;
    summary: string;
    sampleChapters: string;
  }) => {
    const newSubmission: ManuscriptSubmission = {
      id: `man-${Date.now()}`,
      ...manuscript,
      status: 'under_review',
      submittedAt: new Date().toISOString().slice(0, 10)
    };
    setManuscripts(prev => [newSubmission, ...prev]);
  };

  const updateManuscriptStatus = (id: string, status: 'under_review' | 'approved' | 'rejected') => {
    setManuscripts(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  };

  const updateSecurityConfig = (cfg: Partial<SecurityConfig>) => {
    setSecurityConfig(prev => ({ ...prev, ...cfg }));
  };

  const updateChargilySettings = (cfg: Partial<ChargilySettings>) => {
    setChargilySettings(prev => ({ ...prev, ...cfg }));
  };

  const resetToDefaults = () => {
    setBooks(INITIAL_BOOKS);
    setOrders(INITIAL_ORDERS);
    setArticles(INITIAL_ARTICLES);
    setDiscussions(INITIAL_DISCUSSIONS);
    setManuscripts(INITIAL_MANUSCRIPTS);
    setSecurityConfig(INITIAL_SECURITY_CONFIG);
    setChargilySettings(INITIAL_CHARGILY_SETTINGS);
    setMyLibraryBookIds(['book-1', 'book-4']);
    localStorage.clear();
  };

  return (
    <StoreContext.Provider value={{
      books,
      orders,
      articles,
      discussions,
      manuscripts,
      securityConfig,
      chargilySettings,
      currentUser,
      setCurrentUser,
      myLibraryBookIds,
      currentView,
      setCurrentView,
      activeReaderBook,
      activeInvoice,
      securityAlert,
      dismissSecurityAlert,
      triggerSecurityAlert,
      openReader,
      closeReader,
      addBook,
      updateBook,
      deleteBook,
      createOrder,
      updateOrderStatus,
      addArticle,
      updateArticleStatus,
      addDiscussion,
      addDiscussionReply,
      toggleDiscussionSpam,
      deleteDiscussion,
      submitManuscript,
      updateManuscriptStatus,
      updateSecurityConfig,
      updateChargilySettings,
      resetToDefaults
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
