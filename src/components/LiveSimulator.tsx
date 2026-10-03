import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  QrCode, 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  RefreshCcw, 
  Copy, 
  Check, 
  ExternalLink,
  Wifi,
  AlertCircle,
  Coins,
  ArrowRight
} from 'lucide-react';
import { VoucherPackage, VoucherItem, TransactionRecord } from '../types/blueprint';
import { AnalyticsCharts } from './AnalyticsCharts';
import { ErrorLogPanel, SystemErrorLog, INITIAL_ERROR_LOGS } from './ErrorLogPanel';
import { BroadcastPromoPanel } from './BroadcastPromoPanel';

interface LiveSimulatorProps {
  packages: VoucherPackage[];
  vouchers: VoucherItem[];
  transactions: TransactionRecord[];
  onSuccessfulPayment: (newTrx: TransactionRecord, allocatedVoucher: VoucherItem) => void;
  onResetSimulator: () => void;
}

export const LiveSimulator: React.FC<LiveSimulatorProps> = ({
  packages,
  vouchers,
  transactions,
  onSuccessfulPayment,
  onResetSimulator,
}) => {
  // Simulator State
  const [customerPhone, setCustomerPhone] = useState('081324567890');
  const [customerName, setCustomerName] = useState('Ahmad Fauzi');
  const [selectedPackage, setSelectedPackage] = useState<VoucherPackage>(packages[1]); // Default 1 Hari
  
  // Current Simulation Phase: 'ORDER' | 'QRIS_PAY' | 'WEBHOOK_PROCESSING' | 'NOTIFICATION_DELIVERED'
  const [simPhase, setSimPhase] = useState<'ORDER' | 'QRIS_PAY' | 'WEBHOOK_PROCESSING' | 'NOTIFICATION_DELIVERED'>('ORDER');
  
  // Dynamic QRIS details
  const [currentTrxId, setCurrentTrxId] = useState('');
  const [qrisCountdown, setQrisCountdown] = useState(900); // 15 minutes
  const [allocatedVoucher, setAllocatedVoucher] = useState<VoucherItem | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [hotspotLoggedIn, setHotspotLoggedIn] = useState(false);

  // Error Log State
  const [errorLogs, setErrorLogs] = useState<SystemErrorLog[]>(INITIAL_ERROR_LOGS);
  const [simulateFailureMode, setSimulateFailureMode] = useState<'NONE' | 'WA_FAIL' | 'SHEETS_FAIL' | 'LOCK_FAIL'>('NONE');

  const handleAddLog = (log: SystemErrorLog) => {
    setErrorLogs(prev => [log, ...prev]);
  };

  const handleClearLogs = () => {
    setErrorLogs([]);
  };

  const handleResolveLog = (id: string, note: string) => {
    setErrorLogs(prev => prev.map(l => l.id === id ? { ...l, resolved: true, resolutionNote: note } : l));
  };

  const handleBroadcastSentToActiveUser = (messageText: string) => {
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [
      ...prev,
      {
        id: `broadcast-${Date.now()}`,
        sender: 'bot',
        text: messageText,
        timestamp: timeStr,
      }
    ]);
  };

  // Chat message history in the simulated WhatsApp view
  type ChatMessage = {
    id: string;
    sender: 'customer' | 'bot';
    text: string;
    timestamp: string;
    isQris?: boolean;
    isSuccessNotification?: boolean;
    voucherDetails?: { username: string; password: string };
  };

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: 'Halo! Selamat datang di Layanan Otomatis *Anuwani Hotspot* 📶\n\nKetik *MENU* atau pilih paket voucher internet di bawah ini untuk membeli akses WiFi super cepat:',
      timestamp: '10:02',
    }
  ]);

  const [inputChat, setInputChat] = useState('');

  // Countdown timer for QRIS
  useEffect(() => {
    let timer: any;
    if (simPhase === 'QRIS_PAY' && qrisCountdown > 0) {
      timer = setInterval(() => {
        setQrisCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [simPhase, qrisCountdown]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Available stock check for current package
  const availableCount = vouchers.filter(v => v.packageCode === selectedPackage.code && v.status === 'AVAILABLE').length;

  // Handle Order Creation
  const handleInitiateOrder = (pkg: VoucherPackage) => {
    setSelectedPackage(pkg);
    const newTrx = `TRX-${Math.floor(1000 + Math.random() * 9000)}`;
    setCurrentTrxId(newTrx);
    setQrisCountdown(900);
    setHotspotLoggedIn(false);

    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    // Customer message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'customer',
      text: `Beli ${pkg.name} (${pkg.duration})`,
      timestamp: timeStr,
    };

    // Bot message with QRIS
    const botMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `✅ *INVOICE PEMBAYARAN DITERBITKAN*\n\nNomor Transaksi: *${newTrx}*\nPaket: *${pkg.name}*\nTotal Bayar: *Rp ${pkg.price.toLocaleString('id-ID')}*\n\nSilakan scan kode QRIS di bawah ini melalui aplikasi m-Banking (BCA, Mandiri, BRI, BNI) atau E-Wallet (GoPay, OVO, Dana, ShopeePay).\n\n⏱️ Berlaku 15 menit. Voucher akan dikirimkan otomatis setelah Anda membayar.`,
      timestamp: timeStr,
      isQris: true,
    };

    setChatMessages(prev => [...prev, userMsg, botMsg]);
    setSimPhase('QRIS_PAY');
  };

  // Simulate Payment Action (User scans and pays with m-Banking)
  const handleSimulatePayment = () => {
    setSimPhase('WEBHOOK_PROCESSING');

    // Simulate 1.2s webhook & Google Apps Script processing delay
    setTimeout(() => {
      const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const nowFormatted = new Date().toISOString().replace('T', ' ').substring(0, 19);

      // Check failure simulation for Google Sheets Sync
      if (simulateFailureMode === 'SHEETS_FAIL') {
        const errLog: SystemErrorLog = {
          id: `err-${Date.now().toString().slice(-4)}`,
          timestamp: nowFormatted,
          level: 'CRITICAL',
          service: 'GOOGLE_SHEETS_SYNC',
          serviceName: 'Google Drive Apps Script',
          message: `ERR_SHEETS_API_503: Sinkronisasi gagal saat menulis data order ${currentTrxId}. Server Google Sheets merespon Service Unavailable / Quota Exceeded.`,
          details: {
            http_status: 503,
            error: 'Google Drive API Rate Limit',
            trx_id: currentTrxId,
            customer_phone: customerPhone,
            action: 'Payload disimpan di emergency queue memori Apps Script untuk retry 30s.'
          },
          resolved: false
        };
        setErrorLogs(prev => [errLog, ...prev]);

        setChatMessages(prev => [...prev, {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: `⚠️ *KETERLAMBATAN SISTEM DATABASE (Google Sheets)*\nSistem mendeteksi limit antrean server Google Drive (HTTP 503). Transaksi ${currentTrxId} disimpan di antrean memori darurat untuk diproses ulang otomatis dalam 30 detik. Cek panel Error Log di bawah.`,
          timestamp: timeStr,
        }]);
        setSimPhase('ORDER');
        return;
      }

      // Find an available voucher from pool
      const availableVoucherCandidate = vouchers.find(
        v => v.packageCode === selectedPackage.code && v.status === 'AVAILABLE'
      );

      if (availableVoucherCandidate) {
        setAllocatedVoucher(availableVoucherCandidate);
        const waFailed = simulateFailureMode === 'WA_FAIL';

        const newTrxRecord: TransactionRecord = {
          trxId: currentTrxId,
          timestamp: nowFormatted,
          customerPhone: customerPhone,
          customerName: customerName,
          packageCode: selectedPackage.code,
          packageName: selectedPackage.name,
          amount: selectedPackage.price,
          paymentMethod: 'QRIS_DYNAMIC',
          paymentProvider: 'TRIPAY',
          status: 'PAID',
          qrisString: `00020101021226670016ID.CO.QRIS.WWW01189360099900010001000215${customerPhone}0005204581253033605802ID5907ANUWANI6007BANDUNG62070703A0363047FA9`,
          voucherCode: availableVoucherCandidate.username,
          voucherPassword: availableVoucherCandidate.password,
          waStatus: waFailed ? 'FAILED' : 'SENT',
          paymentRef: `PAY-${Date.now().toString().slice(-6)}`,
        };

        // Notify parent state
        onSuccessfulPayment(newTrxRecord, availableVoucherCandidate);

        if (waFailed) {
          // Log WhatsApp Gateway Failure
          const errLog: SystemErrorLog = {
            id: `err-${Date.now().toString().slice(-4)}`,
            timestamp: nowFormatted,
            level: 'ERROR',
            service: 'WHATSAPP_GATEWAY',
            serviceName: 'Fonnte / Wablas Gateway',
            message: `ERR_WA_GATEWAY_TIMEOUT: Gagal mengirimkan voucher ${availableVoucherCandidate.username} ke nomor WhatsApp ${customerPhone} (Koneksi Gateway Terputus / Rate Limit).`,
            details: {
              target_phone: customerPhone,
              error_code: 'WA_DISPATCH_TIMEOUT_504',
              voucher_assigned: availableVoucherCandidate.username,
              action: 'Voucher telah tersimpan di Google Sheet, namun pengiriman WhatsApp tertunda. Menjadwalkan pengiriman ulang (Retry queue).'
            },
            resolved: false
          };
          setErrorLogs(prev => [errLog, ...prev]);

          const failMsg: ChatMessage = {
            id: `bot-wa-fail-${Date.now()}`,
            sender: 'bot',
            text: `⚠️ *PERINGATAN GANGGUAN PENGIRIMAN WHATSAPP*\nPembayaran QRIS Anda sebesar *Rp ${selectedPackage.price.toLocaleString('id-ID')}* SUKSES dan voucher teralokasi, namun server WhatsApp Gateway sedang mengalami gangguan (HTTP 504 / Disconnected).\n\n📌 *Voucher Anda:* \`${availableVoucherCandidate.username}\`\n🔑 *Password:* \`${availableVoucherCandidate.password}\`\n\n_Sistem otomatis mengantrekan pengiriman ulang. Status kegagalan tercatat di Error Log di bawah._`,
            timestamp: timeStr,
            isSuccessNotification: true,
            voucherDetails: {
              username: availableVoucherCandidate.username,
              password: availableVoucherCandidate.password,
            }
          };
          setChatMessages(prev => [...prev, failMsg]);
          setSimPhase('NOTIFICATION_DELIVERED');
          return;
        }

        // Add Automated Notification to WhatsApp Chat
        const successMsg: ChatMessage = {
          id: `bot-success-${Date.now()}`,
          sender: 'bot',
          text: `🎉 *PEMBAYARAN QRIS BERHASIL!*\nTerima kasih, pembayaran sebesar *Rp ${selectedPackage.price.toLocaleString('id-ID')}* telah kami terima.\n\nBerikut adalah akun internet Wi-Fi Anda:\n━━━━━━━━━━━━━━━━━━━\n📦 *Paket:* ${selectedPackage.name}\n👤 *Username:* \`${availableVoucherCandidate.username}\`\n🔑 *Password:* \`${availableVoucherCandidate.password}\`\n⏱️ *Durasi:* ${selectedPackage.duration}\n━━━━━━━━━━━━━━━━━━━\n\n🌐 *Cara Menghubungkan:*\n1. Sambungkan HP ke Wi-Fi *Anuwani*\n2. Buka browser atau klik link login otomatis:\n👉 http://anuwani.net/login?username=${availableVoucherCandidate.username}&password=${availableVoucherCandidate.password}\n3. Internet Anda langsung aktif!`,
          timestamp: timeStr,
          isSuccessNotification: true,
          voucherDetails: {
            username: availableVoucherCandidate.username,
            password: availableVoucherCandidate.password,
          }
        };

        setChatMessages(prev => [...prev, successMsg]);
        setSimPhase('NOTIFICATION_DELIVERED');
      } else {
        // Stock empty case
        const errLog: SystemErrorLog = {
          id: `err-${Date.now().toString().slice(-4)}`,
          timestamp: nowFormatted,
          level: 'ERROR',
          service: 'ROUTER_API',
          serviceName: 'Voucher Pool Allocator',
          message: `ERR_OUT_OF_STOCK: Stok voucher habis untuk paket ${selectedPackage.name} saat pembayaran diterima.`,
          details: {
            package_code: selectedPackage.code,
            customer_phone: customerPhone,
            action: 'Notifikasi darurat dikirim ke admin untuk restock.'
          },
          resolved: false
        };
        setErrorLogs(prev => [errLog, ...prev]);

        const emptyMsg: ChatMessage = {
          id: `bot-empty-${Date.now()}`,
          sender: 'bot',
          text: `⚠️ Mohon maaf, stok voucher untuk paket ${selectedPackage.name} sedang habis di server. Admin kami telah diberitahu dan uang Anda aman. CS: 081234567890. Insiden tercatat di Error Log.`,
          timestamp: timeStr,
        };
        setChatMessages(prev => [...prev, emptyMsg]);
        setSimPhase('ORDER');
      }
    }, 1200);
  };

  const handleCopyVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCustomChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputChat.trim()) return;

    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const userText = inputChat.trim();
    setInputChat('');

    const newMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'customer',
      text: userText,
      timestamp: timeStr,
    };

    setChatMessages(prev => [...prev, newMsg]);

    // Simple bot reply
    setTimeout(() => {
      let reply = 'Pilih salah satu paket voucher di bawah untuk mendapatkan kode QRIS secara otomatis:';
      if (userText.toLowerCase().includes('bantuan') || userText.toLowerCase().includes('cs')) {
        reply = 'Hubungi CS Hotline: 081234567890 (Admin Hotspot). Kami siap membantu kendala koneksi.';
      }
      setChatMessages(prev => [...prev, {
        id: `bot-reply-${Date.now()}`,
        sender: 'bot',
        text: reply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full mb-1 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Real-Time Sandbox</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Simulasi Transaksi End-to-End: WhatsApp, QRIS & Google Sheets
          </h2>
          <p className="text-xs text-slate-400">
            Uji coba langsung alur dari sudut pandang pembeli: memesan voucher, scan QRIS, hingga menerima notifikasi otomatis.
          </p>
        </div>

        <button
          onClick={() => {
            onResetSimulator();
            setSimPhase('ORDER');
            setAllocatedVoucher(null);
            setHotspotLoggedIn(false);
            setChatMessages([
              {
                id: 'msg-1',
                sender: 'bot',
                text: 'Halo! Selamat datang di Layanan Otomatis *NET-WIFI HOTSPOT* 📶\n\nKetik *MENU* atau pilih paket voucher internet di bawah ini untuk membeli akses WiFi super cepat:',
                timestamp: '10:02',
              }
            ]);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Reset Simulasi</span>
        </button>
      </div>

      {/* Main Grid: Left Controls & Packages / Right Realistic WhatsApp Mobile Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Customer Input & Voucher Package Selector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Customer Profile Box */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              Data Simulasi Pelanggan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Nomor WhatsApp Pelanggan</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                  placeholder="081234567890"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Nama Pelanggan</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Nama Pembeli"
                />
              </div>
            </div>
          </div>

          {/* Package Selection */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-400" />
                Pilih Paket Voucher
              </h3>
              <span className="text-[11px] text-slate-400">
                Stok Paket Ini: <strong className="text-emerald-400">{availableCount} voucher</strong>
              </span>
            </div>

            <div className="space-y-2.5">
              {packages.map((pkg) => {
                const isSelected = selectedPackage.id === pkg.id;
                const stock = vouchers.filter(v => v.packageCode === pkg.code && v.status === 'AVAILABLE').length;

                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-slate-800/90 border-emerald-500 ring-1 ring-emerald-500/50'
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{pkg.name}</span>
                          {pkg.popular && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-500/40">
                              Terlaris
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{pkg.description}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400">
                          <span className="font-mono text-cyan-400">⚡ {pkg.speed}</span>
                          <span>•</span>
                          <span className="text-slate-300">⏳ {pkg.duration}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-extrabold text-emerald-400 block font-mono">
                          Rp {pkg.price.toLocaleString('id-ID')}
                        </span>
                        <span className={`text-[10px] font-mono mt-1 inline-block px-1.5 py-0.2 rounded ${
                          stock > 0 ? 'bg-slate-900 text-slate-400' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {stock > 0 ? `${stock} stok` : 'Habis'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Button: Beli Paket Ini */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <button
                onClick={() => handleInitiateOrder(selectedPackage)}
                disabled={availableCount === 0 || simPhase === 'WEBHOOK_PROCESSING'}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-xs transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Simulasikan Pesan {selectedPackage.name} via WhatsApp</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Interactive Flow Status Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Status Pipeline Otomasi Saat Ini:
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">1. Pesanan Masuk (WA Bot)</span>
                <span className={`font-mono text-[11px] font-bold ${simPhase !== 'ORDER' ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {simPhase !== 'ORDER' ? 'DITERIMA' : 'MENUNGGU'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">2. Generate Dynamic QRIS</span>
                <span className={`font-mono text-[11px] font-bold ${simPhase !== 'ORDER' ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {simPhase !== 'ORDER' ? currentTrxId : '-'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">3. Webhook Settlement</span>
                <span className={`font-mono text-[11px] font-bold ${
                  simPhase === 'WEBHOOK_PROCESSING' ? 'text-amber-400 animate-pulse' :
                  simPhase === 'NOTIFICATION_DELIVERED' ? 'text-emerald-400' : 'text-slate-400'
                }`}>
                  {simPhase === 'WEBHOOK_PROCESSING' ? 'MEMPROSES LOCK...' :
                   simPhase === 'NOTIFICATION_DELIVERED' ? 'SUKSES (HTTP 200)' : 'STANDBY'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">4. Dispatcher WhatsApp</span>
                <span className={`font-mono text-[11px] font-bold ${simPhase === 'NOTIFICATION_DELIVERED' ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {simPhase === 'NOTIFICATION_DELIVERED' ? 'TERKIRIM (DELIVERED)' : 'MENUNGGU'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Realistic WhatsApp Phone Mockup (7 cols) */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-md bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-slate-800 relative">
            {/* Phone Speaker & Camera Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full flex items-center justify-center space-x-2 z-20">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
              <span className="w-10 h-1.5 rounded-full bg-slate-800"></span>
            </div>

            {/* Inner Phone Screen */}
            <div className="w-full bg-[#0b141a] rounded-[2rem] overflow-hidden flex flex-col h-[650px] border border-slate-950">
              
              {/* WhatsApp App Bar Header */}
              <div className="bg-[#1f2c34] text-white px-4 py-3 flex items-center justify-between shadow-md z-10 pt-5">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-sm shadow">
                    <Wifi className="w-5 h-5 text-slate-950" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold flex items-center gap-1 text-slate-100">
                      Anuwani Hotspot
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
                    </h4>
                    <span className="text-[10px] text-emerald-400 block">Bot Otomatis • Online</span>
                  </div>
                </div>

                <div className="text-[10px] bg-slate-800/80 px-2 py-1 rounded text-slate-300 font-mono">
                  {customerPhone}
                </div>
              </div>

              {/* Chat Message Scrollable Container with WhatsApp Doodle Wallpaper */}
              <div 
                className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs scrollbar-thin"
                style={{
                  backgroundImage: `radial-gradient(circle at 10px 10px, rgba(255,255,255,0.03) 2px, transparent 0)`,
                  backgroundSize: '24px 24px'
                }}
              >
                {/* Security encryption notice */}
                <div className="text-center my-1">
                  <span className="bg-[#182229] text-[#ffd279] text-[9px] px-2.5 py-1 rounded-md inline-block shadow-sm">
                    🔒 Pesan dienkripsi secara end-to-end. Penjualan voucher aman & terverifikasi.
                  </span>
                </div>

                {chatMessages.map((msg) => {
                  const isUser = msg.sender === 'customer';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-xl p-3 shadow-md relative ${
                          isUser
                            ? 'bg-[#005c4b] text-white rounded-tr-none'
                            : 'bg-[#202c33] text-slate-200 rounded-tl-none border border-slate-700/40'
                        }`}
                      >
                        {/* Text Content */}
                        <div className="whitespace-pre-line text-[11px] leading-relaxed">
                          {msg.text}
                        </div>

                        {/* QRIS Interactive Card inside Bot Message */}
                        {msg.isQris && simPhase === 'QRIS_PAY' && (
                          <div className="mt-3 p-3 bg-white text-slate-900 rounded-xl shadow-lg border border-slate-200">
                            <div className="flex items-center justify-between border-b pb-1.5 mb-2">
                              <div className="flex items-center gap-1.5">
                                <QrCode className="w-4 h-4 text-emerald-600" />
                                <span className="text-[10px] font-extrabold tracking-wider text-slate-800">QRIS NASIONAL</span>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-rose-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Exp: {formatCountdown(qrisCountdown)}
                              </span>
                            </div>

                            {/* Simulated Real QR Pattern */}
                            <div className="bg-slate-50 p-2 rounded-lg flex flex-col items-center justify-center border border-slate-200">
                              <div className="w-36 h-36 bg-white p-2 rounded shadow-inner flex flex-col items-center justify-center relative">
                                <QrCode className="w-32 h-32 text-slate-950" />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <div className="w-6 h-6 bg-white rounded border border-slate-300 flex items-center justify-center shadow">
                                    <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                                  </div>
                                </div>
                              </div>
                              <span className="text-[9px] text-slate-600 mt-1 font-mono text-center">
                                NMID: ID1020089201923
                              </span>
                            </div>

                            {/* Total Amount */}
                            <div className="mt-2 text-center bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                              <span className="text-[10px] text-slate-600 block">Total Pembayaran:</span>
                              <span className="text-base font-extrabold text-emerald-700 font-mono">
                                Rp {selectedPackage.price.toLocaleString('id-ID')}
                              </span>
                            </div>

                            {/* Simulate Pay Button */}
                            <button
                              onClick={handleSimulatePayment}
                              className="mt-2.5 w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-lg transition shadow flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Simulasikan Bayar via BCA/GoPay</span>
                            </button>
                            <span className="text-[9px] text-slate-400 block text-center mt-1">
                              (Mengirim webhook instan ke Google Apps Script)
                            </span>
                          </div>
                        )}

                        {/* Webhook Processing State */}
                        {msg.isQris && simPhase === 'WEBHOOK_PROCESSING' && (
                          <div className="mt-3 p-3 bg-slate-900 text-white rounded-xl border border-slate-700 flex flex-col items-center justify-center text-center">
                            <div className="w-7 h-7 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mb-2"></div>
                            <span className="text-xs font-semibold text-emerald-400">Webhook Diproses oleh Apps Script</span>
                            <span className="text-[10px] text-slate-400 mt-0.5">
                              Mengalokasikan voucher dari Google Sheet & verifikasi LockService...
                            </span>
                          </div>
                        )}

                        {/* Success Voucher Interactive Action Box */}
                        {msg.isSuccessNotification && msg.voucherDetails && (
                          <div className="mt-3 p-3 bg-[#111b21] rounded-xl border border-emerald-500/40 space-y-2">
                            <div className="flex items-center justify-between bg-[#1f2c34] p-2 rounded-lg border border-slate-700">
                              <div>
                                <span className="text-[10px] text-slate-400 block">Kode Voucher Hotspot:</span>
                                <span className="text-xs font-mono font-bold text-emerald-400">
                                  {msg.voucherDetails.username}
                                </span>
                              </div>
                              <button
                                onClick={() => handleCopyVoucher(msg.voucherDetails!.username)}
                                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] text-slate-200 flex items-center gap-1 transition cursor-pointer"
                              >
                                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedCode ? 'Tersalin' : 'Salin'}</span>
                              </button>
                            </div>

                            {/* Direct Login Simulator Button */}
                            <button
                              onClick={() => setHotspotLoggedIn(true)}
                              className={`w-full py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                                hotspotLoggedIn 
                                  ? 'bg-emerald-500 text-slate-950'
                                  : 'bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40'
                              }`}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>{hotspotLoggedIn ? '✅ Hotspot Terhubung & Internet Aktif!' : 'Simulasikan Klik Link Login Otomatis'}</span>
                            </button>
                          </div>
                        )}

                        {/* Timestamp */}
                        <div className="text-[9px] text-slate-400 text-right mt-1 font-mono">
                          {msg.timestamp}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleCustomChatSubmit} className="bg-[#1f2c34] p-2 flex items-center space-x-2 border-t border-slate-800">
                <input
                  type="text"
                  value={inputChat}
                  onChange={(e) => setInputChat(e.target.value)}
                  placeholder="Ketik pesan atau tanya bot..."
                  className="flex-1 bg-[#2a3942] text-xs text-white placeholder-slate-400 px-3 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="w-8 h-8 rounded-full bg-[#00a884] hover:bg-[#008f6f] text-slate-950 flex items-center justify-center transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>
          </div>
        </div>

      </div>

      {/* Recharts Analytics Panel: Daily Revenue & Package Trends */}
      <AnalyticsCharts 
        transactions={transactions} 
        packages={packages} 
      />

      {/* WhatsApp Promotional Broadcast Engine */}
      <BroadcastPromoPanel
        transactions={transactions}
        packages={packages}
        onBroadcastSentToActiveUser={handleBroadcastSentToActiveUser}
      />

      {/* Error Log & Diagnostics Panel */}
      <ErrorLogPanel
        logs={errorLogs}
        onAddLog={handleAddLog}
        onClearLogs={handleClearLogs}
        onResolveLog={handleResolveLog}
        simulateFailureMode={simulateFailureMode}
        setSimulateFailureMode={setSimulateFailureMode}
      />
    </div>
  );
};
