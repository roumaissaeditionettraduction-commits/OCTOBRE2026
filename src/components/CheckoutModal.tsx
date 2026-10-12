import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Book, PaymentMethod } from '../types';
import { ALGERIAN_WILAYAS } from '../data/initialData';
import { 
  CreditCard, ShieldCheck, CheckCircle2, 
  MapPin, User, Mail, Phone, Lock, 
  BookOpen, Download, AlertCircle, Loader2, ArrowRight
} from 'lucide-react';

interface CheckoutModalProps {
  book: Book;
  format: 'ebook' | 'paper';
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ book, format, onClose }) => {
  const { createOrder, currentUser, openReader } = useStore();

  const [step, setStep] = useState<'details' | 'payment_gateway' | 'otp' | 'success'>('details');
  const [customerName, setCustomerName] = useState(currentUser.name);
  const [customerEmail, setCustomerEmail] = useState(currentUser.email);
  const [customerPhone, setCustomerPhone] = useState('0550123456');
  const [wilaya, setWilaya] = useState('16 - الجزائر العاصمة');
  const [address, setAddress] = useState('شارع ديدوش مراد، الجزائر');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('chargily_edahabia');

  // Gateway Simulation fields
  const [cardNumber, setCardNumber] = useState('5078 0312 9945 8821');
  const [expiry, setExpiry] = useState('11/28');
  const [cvv, setCvv] = useState('321');
  const [otpCode, setOtpCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedOrder, setGeneratedOrder] = useState<any>(null);

  const bookPrice = format === 'ebook' ? book.ebookPrice : book.paperPrice;
  const shippingFee = format === 'ebook' ? 0 : 500;
  const totalAmount = bookPrice + shippingFee;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'cash_on_delivery') {
      completeOrder();
    } else {
      setStep('payment_gateway');
    }
  };

  const handleSimulatePaymentSubmission = async () => {
    setIsProcessing(true);
    try {
      // استدعاء حقيقي للمسار البرمجي الموحد في الخادم
      await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          bookId: book.id,
          customerEmail: customerEmail,
          customerName: customerName,
          paymentMethod: paymentMethod
        })
      });
    } catch (e) {
      console.warn('API call notice:', e);
    }
    setTimeout(() => {
      setIsProcessing(false);
      setStep('otp');
    }, 1000);
  };

  const handleVerifyOtp = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      completeOrder();
    }, 800);
  };

  const completeOrder = () => {
    const order = createOrder({
      customerName,
      customerEmail,
      customerPhone,
      wilaya,
      address: format === 'paper' ? address : undefined,
      bookId: book.id,
      bookType: format,
      paymentMethod,
      amount: totalAmount
    });
    setGeneratedOrder(order);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-amber-400">
                بوابة الدفع الإلكتروني والطلبيات (Chargily Pay)
              </h3>
              <p className="text-xs text-slate-400">
                دار رميساء للنشر والترجمة · دفع آمن ومشفر 256-bit
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm px-2 py-1"
          >
            ✕
          </button>
        </div>

        {/* STEP 1: Details & Method Selection */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="p-6 space-y-5">
            {/* Order Summary Summary Box */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={book.coverImage} 
                  alt={book.title} 
                  className="w-14 h-18 object-cover rounded shadow-sm border border-slate-300"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{book.title}</h4>
                  <p className="text-xs text-slate-500">{book.author}</p>
                  <span className={`inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                    format === 'ebook' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {format === 'ebook' ? 'نسخة إلكترونية مشفرة (E-Book)' : 'نسخة ورقية مع التوصيل'}
                  </span>
                </div>
              </div>
              <div className="text-left font-mono">
                <span className="text-xs text-slate-400 block">الإجمالي المستحق</span>
                <span className="text-lg font-bold text-slate-900">{totalAmount.toLocaleString()} دج</span>
                {format === 'paper' && (
                  <span className="text-[10px] text-slate-500 block">+500 دج شحن للولاية</span>
                )}
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                بيانات المشتري والترخيص
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">الاسم واللقب</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full pr-9 pl-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1">البريد الإلكتروني (لتفعيل الرخصة)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      className="w-full pr-9 pl-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1">رقم الهاتف</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full pr-9 pl-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>

                {format === 'paper' && (
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">الولاية (58 ولاية)</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                      <select
                        value={wilaya}
                        onChange={e => setWilaya(e.target.value)}
                        className="w-full pr-9 pl-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                      >
                        {ALGERIAN_WILAYAS.map(w => (
                          <option key={w} value={w}>{w}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {format === 'paper' && (
                <div>
                  <label className="text-xs text-slate-600 block mb-1">عنوان التسليم بالتفصيل</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="الحي، رقم العمارة، البلدية..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                طريقة الدفع الآمن
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('chargily_edahabia')}
                  className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between ${
                    paymentMethod === 'chargily_edahabia' 
                      ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border flex items-center justify-center border-amber-600 bg-amber-500"></span>
                    <div>
                      <div className="font-bold text-xs text-slate-900">البطاقة الذهبية (Edahabia)</div>
                      <div className="text-[10px] text-slate-500">بريد الجزائر عبر Chargily</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">الذهبية</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('chargily_cib')}
                  className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between ${
                    paymentMethod === 'chargily_cib' 
                      ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border flex items-center justify-center border-amber-600 bg-amber-500"></span>
                    <div>
                      <div className="font-bold text-xs text-slate-900">بطاقة CIB البنكية</div>
                      <div className="text-[10px] text-slate-500">جميع البنوك الجزائرية (SATIM)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">CIB</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('baridimob')}
                  className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between ${
                    paymentMethod === 'baridimob' 
                      ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border flex items-center justify-center border-amber-600 bg-amber-500"></span>
                    <div>
                      <div className="font-bold text-xs text-slate-900">تطبيق بريدي موب (BaridiMob)</div>
                      <div className="text-[10px] text-slate-500">تحويل فوري عبر RIP</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">RIP</span>
                </button>

                {format === 'paper' && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                    className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between ${
                      paymentMethod === 'cash_on_delivery' 
                        ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full border flex items-center justify-center border-amber-600 bg-amber-500"></span>
                      <div>
                        <div className="font-bold text-xs text-slate-900">الدفع عند الاستلام (COD)</div>
                        <div className="text-[10px] text-slate-500">تسليم يد بيد لعنوانك</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">استلام</span>
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <span>متابعة الدفع الآمن ({totalAmount.toLocaleString()} دج)</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </form>
        )}

        {/* STEP 2: Chargily Pay Simulation Gateway */}
        {step === 'payment_gateway' && (
          <div className="p-6 space-y-5">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-amber-900">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>اتصال آمن ومصادق من SATIM & Chargily Pay</span>
              </div>
              <span className="font-mono font-bold text-amber-900 text-sm">{totalAmount.toLocaleString()} دج</span>
            </div>

            <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl shadow-lg relative overflow-hidden">
              <div className="text-[11px] text-amber-400 font-mono tracking-wider mb-3">
                {paymentMethod === 'chargily_edahabia' ? 'بطاقة الـذهـبـيـة EDAHABIA' : 'بطاقة بنكية CIB - SATIM'}
              </div>
              <div className="font-mono text-base tracking-widest my-2">
                {cardNumber}
              </div>
              <div className="flex justify-between items-end text-xs font-mono pt-2 text-slate-300">
                <div>
                  <span className="text-[9px] text-slate-400 block">حامل البطاقة</span>
                  <span>{customerName}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block">تنتهي في</span>
                  <span>{expiry}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1">رقم البطاقة (16 رقماً)</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 font-mono text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">تاريخ الانتهاء (MM/YY)</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={e => setExpiry(e.target.value)}
                    className="w-full px-3 py-2 font-mono text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">رمز الأمان (CVV2)</label>
                  <input
                    type="password"
                    maxLength={3}
                    value={cvv}
                    onChange={e => setCvv(e.target.value)}
                    className="w-full px-3 py-2 font-mono text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="w-1/3 py-2.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"
              >
                رجوع
              </button>
              <button
                type="button"
                onClick={handleSimulatePaymentSubmission}
                disabled={isProcessing}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جارٍ الاتصال بالبنك...</span>
                  </>
                ) : (
                  <span>تأكيد والدفع الآن</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: OTP 3D-Secure Simulation */}
        {step === 'otp' && (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">مصادقة الدفع عبر SMS (3D Secure)</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                تم إرسال رمز تحقق مؤقت إلى رقم هاتفك المسجل لدى بريد الجزائر / بنكك ({customerPhone.slice(0, 4)}***)
              </p>
            </div>

            <div className="max-w-xs mx-auto">
              <input
                type="text"
                placeholder="أدخل الرمز (مثال: 849201)"
                value={otpCode}
                onChange={e => setOtpCode(e.target.value)}
                className="w-full text-center text-lg font-mono tracking-widest py-2.5 border-2 border-amber-500 rounded-xl focus:outline-none"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                لأغراض التجربة، يمكنك إدخال أي رقم أو الضغط على تأكيد مباشرة
              </span>
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={isProcessing}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جارٍ مصادقة المعاملة...</span>
                </>
              ) : (
                <span>تأكيد العملية وسحب المبلغ</span>
              )}
            </button>
          </div>
        )}

        {/* STEP 4: Order & Payment Completed! */}
        {step === 'success' && generatedOrder && (
          <div className="p-6 text-center space-y-5">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-lg">
                تمت عملية الشراء بنجاح!
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                رقم الفاتورة: <strong className="font-mono text-slate-800">{generatedOrder.invoiceNumber}</strong> · تم إرسال إشعار فوري إلى {generatedOrder.customerEmail}
              </p>
            </div>

            {/* Receipt Details Card */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-right space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">الكتاب المقتنى:</span>
                <span className="font-bold text-slate-800">{book.title}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">طريقة الدفع:</span>
                <span className="font-bold text-slate-800">
                  {paymentMethod === 'chargily_edahabia' ? 'البطاقة الذهبية (Chargily)' : 
                   paymentMethod === 'chargily_cib' ? 'بطاقة CIB البنكية' :
                   paymentMethod === 'baridimob' ? 'بريدي موب (BaridiMob)' : 'الدفع عند الاستلام'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">المبلغ الإجمالي المدفوع:</span>
                <span className="font-bold text-emerald-700 font-mono text-sm">{totalAmount.toLocaleString()} دج</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">الحالة:</span>
                <span className="font-bold text-emerald-600">
                  {format === 'ebook' ? 'ترخيص فوري جاهز للقراءة الآمنة' : 'قيد التجهيز والشحن عبر يالدين / كازي تور'}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              {format === 'ebook' ? (
                <button
                  onClick={() => {
                    onClose();
                    openReader(book, generatedOrder.invoiceNumber);
                  }}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>فتح الكتاب مباشرة في القارئ الآمن المشفر</span>
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
                >
                  العودة للمتجر ومتابعة الطلبية
                </button>
              )}

              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full py-2 text-xs text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>طباعة / حفظ وصل الفاتورة الرسمية</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
