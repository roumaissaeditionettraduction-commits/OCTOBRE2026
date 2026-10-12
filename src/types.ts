export type BookFormat = 'both' | 'ebook' | 'paper';

export interface Chapter {
  id: string;
  title: string;
  content: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  excerpt: string;
  coverImage: string;
  paperPrice: number; // in DZD دج
  ebookPrice: number; // in DZD دج
  format: BookFormat;
  pages: number;
  publisher: string;
  isbn: string;
  publicationYear: number;
  stockCount: number;
  salesCount: number;
  rating: number;
  chapters: Chapter[];
  isFeatured?: boolean;
}

export type PaymentMethod = 'chargily_edahabia' | 'chargily_cib' | 'baridimob' | 'cash_on_delivery';
export type PaymentStatus = 'paid' | 'pending' | 'failed';
export type DeliveryStatus = 'instant_digital' | 'processing' | 'shipped' | 'delivered';

export interface Order {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  wilaya: string;
  address?: string;
  bookId: string;
  bookTitle: string;
  bookType: 'ebook' | 'paper';
  amount: number; // in DZD دج
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  date: string;
  timestamp: number;
}

export interface Article {
  id: string;
  title: string;
  author: string;
  authorBio: string;
  category: string;
  publishDate: string;
  readTime: string;
  excerpt: string;
  content: string;
  status: 'published' | 'pending_review' | 'rejected';
  views: number;
  commentsCount: number;
}

export interface DiscussionReply {
  id: string;
  author: string;
  content: string;
  date: string;
}

export interface Discussion {
  id: string;
  title: string;
  author: string;
  bookRef?: string;
  content: string;
  date: string;
  replies: DiscussionReply[];
  isFlaggedSpam: boolean;
  spamReason?: string;
}

export interface ManuscriptSubmission {
  id: string;
  authorName: string;
  authorEmail: string;
  authorPhone: string;
  bookTitle: string;
  genre: string;
  pageCount: number;
  summary: string;
  sampleChapters: string;
  status: 'under_review' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface SecurityConfig {
  blockRightClick: boolean;
  blockTextSelection: boolean;
  blockShortcuts: boolean;
  blockPrintScreen: boolean;
  watermarkOpacity: number;
  enableDynamicWatermark: boolean;
  watermarkPattern: string; // e.g. "اسم المشترك: {name} | البريد: {email} | الفاتورة: {invoice}"
}

export interface ChargilySettings {
  apiKey: string;
  secretKey: string;
  mode: 'test' | 'live';
  webhookUrl: string;
  edahabiaEnabled: boolean;
  cibEnabled: boolean;
  baridiMobEnabled: boolean;
}
