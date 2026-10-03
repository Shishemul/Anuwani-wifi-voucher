import React, { useState, useMemo } from 'react';
import { 
  Megaphone, 
  Send, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Copy, 
  Check, 
  AlertCircle,
  Eye,
  Sliders,
  Code2,
  FileSpreadsheet,
  Tag,
  ArrowRight,
  Flame
} from 'lucide-react';
import { TransactionRecord, VoucherPackage } from '../types/blueprint';

interface BroadcastPromoPanelProps {
  transactions: TransactionRecord[];
  packages: VoucherPackage[];
  hotspotName?: string;
  onBroadcastSentToActiveUser?: (messageText: string) => void;
}

export interface CustomerAudience {
  phone: string;
  name: string;
  orderCount: number;
  totalSpent: number;
  lastTrxDate: string;
  favoritePackage: string;
  selected: boolean;
}

export const BroadcastPromoPanel: React.FC<BroadcastPromoPanelProps> = ({
  transactions,
  packages,
  hotspotName = "Anuwani",
  onBroadcastSentToActiveUser,
}) => {
  // Aggregate unique customer audiences from all transactions
  const initialAudiences: CustomerAudience[] = useMemo(() => {
    const map = new Map<string, CustomerAudience>();

    // Baseline seed customers to ensure rich list even with few transactions
    const seedCustomers: CustomerAudience[] = [
      { phone: '081298765432', name: 'Budi Santoso', orderCount: 4, totalSpent: 18000, lastTrxDate: '2026-10-02', favoritePackage: 'WIFI-1HARI', selected: true },
      { phone: '085712345678', name: 'Rina Marlina', orderCount: 2, totalSpent: 10000, lastTrxDate: '2026-10-02', favoritePackage: 'WIFI-1HARI', selected: true },
      { phone: '081399887766', name: 'Doni Pratama', orderCount: 1, totalSpent: 2000, lastTrxDate: '2026-10-01', favoritePackage: 'WIFI-2JAM', selected: true },
      { phone: '087811223344', name: 'Siti Rahma', orderCount: 3, totalSpent: 60000, lastTrxDate: '2026-09-30', favoritePackage: 'WIFI-7HARI', selected: true },
      { phone: '089655443322', name: 'Kevin Wijaya', orderCount: 5, totalSpent: 150000, lastTrxDate: '2026-09-28', favoritePackage: 'WIFI-30HARI', selected: true },
    ];

    seedCustomers.forEach(c => map.set(c.phone, c));

    // Incorporate current session transactions
    transactions.forEach(t => {
      if (t.customerPhone) {
        const existing = map.get(t.customerPhone);
        if (existing) {
          existing.orderCount += 1;
          existing.totalSpent += t.amount;
          existing.lastTrxDate = t.timestamp.split(' ')[0];
          existing.name = t.customerName || existing.name;
        } else {
          map.set(t.customerPhone, {
            phone: t.customerPhone,
            name: t.customerName || 'Pelanggan Hotspot',
            orderCount: 1,
            totalSpent: t.amount,
            lastTrxDate: t.timestamp.split(' ')[0],
            favoritePackage: t.packageCode,
            selected: true,
          });
        }
      }
    });

    return Array.from(map.values());
  }, [transactions]);

  const [audiences, setAudiences] = useState<CustomerAudience[]>(initialAudiences);
  const [selectedPreset, setSelectedPreset] = useState<'WEEKEND' | 'SPEED_BOOST' | 'LOYALTY' | 'CUSTOM'>('WEEKEND');
  const [promoCode, setPromoCode] = useState('WEEKEND50');
  const [discountPercent, setDiscountPercent] = useState('50%');
  const [delaySeconds, setDelaySeconds] = useState(2); // Anti-ban safe delay
  const [copiedScript, setCopiedScript] = useState(false);
  const [showScriptModal, setShowScriptModal] = useState(false);

  // Broadcast Message Template
  const [messageTemplate, setMessageTemplate] = useState<string>(
    `🔥 *PROMO SPESIAL AKHIR PEKAN!* 🔥\n\nHalo Kak *{{nama}}*!\nTerima kasih selalu setia menggunakan internet di *{{hotspot}}*.\n\nKhusus hari ini, nikmati diskon *{{diskon}}* untuk semua pembelian voucher WiFi!\n🎟️ *Klaim Kode Promo:* \`{{kode_promo}}\`\n\n⚡ Akses super cepat tanpa lemot untuk streaming, main game, & nonton bola sepuasnya.\n\n👉 Beli langsung dengan balas pesan ini: *BELI {{paket}}*\n_Promo berlaku sampai besok malam. Jangan sampai kehabisan ya Kak!_`
  );

  // Broadcasting Progress Simulation State
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastProgress, setBroadcastProgress] = useState(0);
  const [broadcastSuccessCount, setBroadcastSuccessCount] = useState(0);
  const [broadcastCurrentTarget, setBroadcastCurrentTarget] = useState<string | null>(null);
  const [broadcastLogs, setBroadcastLogs] = useState<{ phone: string; name: string; time: string; status: 'DELIVERED' | 'FAILED' }[]>([]);

  // Toggle selection
  const handleToggleSelect = (phone: string) => {
    setAudiences(prev => prev.map(a => a.phone === phone ? { ...a, selected: !a.selected } : a));
  };

  const handleSelectAll = (select: boolean) => {
    setAudiences(prev => prev.map(a => ({ ...a, selected: select })));
  };

  // Change preset
  const handlePresetChange = (preset: 'WEEKEND' | 'SPEED_BOOST' | 'LOYALTY' | 'CUSTOM') => {
    setSelectedPreset(preset);
    if (preset === 'WEEKEND') {
      setPromoCode('WEEKEND50');
      setDiscountPercent('50%');
      setMessageTemplate(
        `🔥 *PROMO SPESIAL AKHIR PEKAN!* 🔥\n\nHalo Kak *{{nama}}*!\nTerima kasih selalu setia menggunakan internet di *{{hotspot}}*.\n\nKhusus hari ini, nikmati diskon *{{diskon}}* untuk semua pembelian voucher WiFi!\n🎟️ *Klaim Kode Promo:* \`{{kode_promo}}\`\n\n⚡ Akses super cepat tanpa lemot untuk streaming, main game, & nonton bola sepuasnya.\n\n👉 Beli langsung dengan balas pesan ini: *BELI {{paket}}*\n_Promo berlaku sampai besok malam. Jangan sampai kehabisan ya Kak!_`
      );
    } else if (preset === 'SPEED_BOOST') {
      setPromoCode('BOOST30');
      setDiscountPercent('Bonus Speed');
      setMessageTemplate(
        `🚀 *UPGRADE SPEED BOOSTER GRATIS!* 🚀\n\nHalo Kak *{{nama}}*,\nKabar gembira! Jaringan *{{hotspot}}* baru saja ditingkatkan menjadi lebih kencang.\n\nBeli paket *{{paket}}* hari ini dan dapatkan gratis upgrade kecepatan hingga *20 Mbps* tanpa biaya tambahan!\n\nKetik *BELI 1HARI* atau scan QRIS langsung di hotspot. Internetan makin lancar & stabil!`
      );
    } else if (preset === 'LOYALTY') {
      setPromoCode('SETIA20');
      setDiscountPercent('Cashback Rp 5.000');
      setMessageTemplate(
        `🎁 *HADIAH KHUSUS PELANGGAN SETIA* 🎁\n\nHalo Kak *{{nama}}*,\nSebagai bentuk terima kasih karena telah bertransaksi di *{{hotspot}}*, kami memberikan kupon *{{diskon}}* untuk perpanjangan akses internet Anda.\n\nKode Kupon: \`{{kode_promo}}\`\nBalas pesan ini untuk klaim voucher Anda sekarang juga!`
      );
    }
  };

  const selectedCount = audiences.filter(a => a.selected).length;

  // Compile Preview for first selected customer
  const previewSample = useMemo(() => {
    const sample = audiences.find(a => a.selected) || audiences[0] || {
      name: 'Budi Santoso',
      phone: '081298765432',
      favoritePackage: 'WIFI-1HARI'
    };

    return messageTemplate
      .replace(/{{nama}}/g, sample.name)
      .replace(/{{paket}}/g, sample.favoritePackage)
      .replace(/{{nomor}}/g, sample.phone)
      .replace(/{{hotspot}}/g, hotspotName)
      .replace(/{{kode_promo}}/g, promoCode)
      .replace(/{{diskon}}/g, discountPercent);
  }, [messageTemplate, audiences, hotspotName, promoCode, discountPercent]);

  // Execute Simulated Broadcast Loop
  const handleStartBroadcast = () => {
    const targets = audiences.filter(a => a.selected);
    if (targets.length === 0) return;

    setIsBroadcasting(true);
    setBroadcastProgress(0);
    setBroadcastSuccessCount(0);
    setBroadcastLogs([]);

    let index = 0;
    const interval = setInterval(() => {
      if (index >= targets.length) {
        clearInterval(interval);
        setIsBroadcasting(false);
        setBroadcastCurrentTarget(null);
        return;
      }

      const target = targets[index];
      setBroadcastCurrentTarget(target.phone);
      setBroadcastProgress(Math.round(((index + 1) / targets.length) * 100));
      setBroadcastSuccessCount(prev => prev + 1);

      const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setBroadcastLogs(prev => [
        {
          phone: target.phone,
          name: target.name,
          time: nowTime,
          status: 'DELIVERED',
        },
        ...prev
      ]);

      // If active user in simulator matches, notify
      if (onBroadcastSentToActiveUser && index === 0) {
        onBroadcastSentToActiveUser(previewSample);
      }

      index++;
    }, 700); // 700ms simulated send tick
  };

  const gasBroadcastScript = `/**
 * =========================================================================
 * FUNGSI BROADCAST PROMOSI WHATSAPP DARI DATABASE GOOGLE SHEETS
 * Jalankan dari Google Apps Script Editor atau Buat Tombol Menu di Sheet
 * =========================================================================
 */

function broadcastPromoCampaign() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetTrx = ss.getSheetByName("TRANSACTIONS");
  const data = sheetTrx.getDataRange().getValues();
  
  // 1. Ekstrak Kontak Unik Pelanggan yang Pernah Bayar (Status: PAID)
  const customerMap = new Map();
  for (let i = 1; i < data.length; i++) {
    const phone = data[i][2]; // Kolom C: Phone
    const name = data[i][3];  // Kolom D: Name
    const status = data[i][6];// Kolom G: Status
    
    if (phone && status === "PAID" && !customerMap.has(phone)) {
      customerMap.set(phone, {
        phone: phone,
        name: name || "Pelanggan Hotspot"
      });
    }
  }

  const promoTemplate = 
    "${messageTemplate.replace(/\n/g, '\\n')}";

  Logger.log("Memulai broadcast ke " + customerMap.size + " pelanggan...");

  let sentCount = 0;
  customerMap.forEach(function(cust) {
    const personalizedMessage = promoTemplate
      .replace(/{{nama}}/g, cust.name)
      .replace(/{{hotspot}}/g, "${hotspotName}")
      .replace(/{{kode_promo}}/g, "${promoCode}")
      .replace(/{{diskon}}/g, "${discountPercent}");

    // Panggil fungsi sendWhatsApp yang sudah dibuat di Code.gs
    sendWhatsApp(cust.phone, personalizedMessage);
    sentCount++;

    // Jeda ${delaySeconds} detik untuk proteksi Anti-Ban WhatsApp
    Utilities.sleep(${delaySeconds * 1000});
  });

  SpreadsheetApp.getActiveSpreadsheet().toast("Broadcast selesai dikirim ke " + sentCount + " nomor WhatsApp!", "Sukses");
}
`;

  return (
    <div className="mt-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full mb-1 border border-emerald-500/30">
            <Megaphone className="w-3.5 h-3.5" />
            <span>WhatsApp Marketing & Broadcast Engine</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Broadcast Promosi WhatsApp ke Pelanggan Lama
          </h3>
          <p className="text-xs text-slate-400">
            Kirimkan promo diskon, paket hemat weekend, atau voucher loyalitas ke nomor WhatsApp pembeli yang tercatat di database Google Sheets.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto">
          <button
            onClick={() => setShowScriptModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Lihat Script GAS Broadcast</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Campaign Builder / Right Recipient List & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Template & Message Composer (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Preset Buttons */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Pilih Template Promosi Cepat
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handlePresetChange('WEEKEND')}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                  selectedPreset === 'WEEKEND'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1 text-[11px] font-bold text-white mb-0.5">
                  <Flame className="w-3 h-3 text-rose-400" />
                  Weekend Diskon
                </div>
                <span className="text-[10px] text-slate-400 block">Diskon 50% Akhir Pekan</span>
              </button>

              <button
                type="button"
                onClick={() => handlePresetChange('SPEED_BOOST')}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                  selectedPreset === 'SPEED_BOOST'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-[11px] font-bold text-white mb-0.5">
                  🚀 Speed Booster
                </div>
                <span className="text-[10px] text-slate-400 block">Free 20 Mbps upgrade</span>
              </button>

              <button
                type="button"
                onClick={() => handlePresetChange('LOYALTY')}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                  selectedPreset === 'LOYALTY'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-[11px] font-bold text-white mb-0.5">
                  🎁 Kupon Loyalitas
                </div>
                <span className="text-[10px] text-slate-400 block">Cashback perpanjangan</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPreset('CUSTOM')}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                  selectedPreset === 'CUSTOM'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-[11px] font-bold text-white mb-0.5">
                  ✏️ Pesan Kustom
                </div>
                <span className="text-[10px] text-slate-400 block">Tulis format sendiri</span>
              </button>
            </div>
          </div>

          {/* Parameters: Code & Discount */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              <label className="text-slate-400 block mb-1 text-[11px]">Kode Promo / Voucher</label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono uppercase font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              <label className="text-slate-400 block mb-1 text-[11px]">Besaran Diskon / Bonus</label>
              <input
                type="text"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              <label className="text-slate-400 block mb-1 text-[11px]">Jeda Pengiriman (Anti-Ban)</label>
              <select
                value={delaySeconds}
                onChange={(e) => setDelaySeconds(parseFloat(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white cursor-pointer font-mono"
              >
                <option value={1}>1.0 Detik (Cepat)</option>
                <option value={2}>2.0 Detik (Aman)</option>
                <option value={3}>3.0 Detik (Sangat Aman)</option>
              </select>
            </div>
          </div>

          {/* Message Textarea */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Isi Pesan Promosi WhatsApp
              </label>
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <span>Tag:</span>
                <span className="font-mono text-cyan-300">{'{{nama}}'}</span>
                <span className="font-mono text-cyan-300">{'{{paket}}'}</span>
                <span className="font-mono text-cyan-300">{'{{kode_promo}}'}</span>
              </div>
            </div>

            <textarea
              rows={7}
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white leading-relaxed font-sans focus:outline-none focus:border-emerald-500 scrollbar-thin"
              placeholder="Tulis pesan promosi di sini..."
            />
          </div>

          {/* Broadcast Trigger Button & Progress Bar */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-white block">
                  Siap Dikirim ke <span className="text-emerald-400">{selectedCount} Pelanggan</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  Estimasi waktu broadcast: ~{Math.ceil(selectedCount * delaySeconds)} detik dengan jeda anti-ban.
                </span>
              </div>

              <button
                onClick={handleStartBroadcast}
                disabled={isBroadcasting || selectedCount === 0}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {isBroadcasting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Mengirim... ({broadcastProgress}%)</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim Broadcast Sekarang</span>
                  </>
                )}
              </button>
            </div>

            {/* Progress Bar */}
            {isBroadcasting && (
              <div className="space-y-1.5 pt-1">
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div
                    className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${broadcastProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>Target: {broadcastCurrentTarget}</span>
                  <span className="text-emerald-400 font-bold">{broadcastSuccessCount} / {selectedCount} Terkirim</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Customer Recipient Checkboxes & Live Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Target Audience List */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Target Kontak ({audiences.length})
                </span>
              </div>
              <div className="space-x-2 text-[10px]">
                <button
                  type="button"
                  onClick={() => handleSelectAll(true)}
                  className="text-emerald-400 hover:underline cursor-pointer"
                >
                  Pilih Semua
                </button>
                <span className="text-slate-600">|</span>
                <button
                  type="button"
                  onClick={() => handleSelectAll(false)}
                  className="text-slate-400 hover:underline cursor-pointer"
                >
                  Lepas Semua
                </button>
              </div>
            </div>

            {/* Scrollable list */}
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin pr-1 text-xs">
              {audiences.map((customer) => (
                <div
                  key={customer.phone}
                  onClick={() => handleToggleSelect(customer.phone)}
                  className={`p-2 rounded-lg border transition flex items-center justify-between cursor-pointer ${
                    customer.selected 
                      ? 'bg-slate-900 border-emerald-500/40 text-slate-200'
                      : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <input
                      type="checkbox"
                      checked={customer.selected}
                      onChange={() => {}} // handled by parent div
                      className="accent-emerald-500 rounded cursor-pointer"
                    />
                    <div className="truncate">
                      <span className="font-semibold text-white truncate block text-[11px]">{customer.name}</span>
                      <span className="font-mono text-[10px] text-slate-400 block">{customer.phone}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 font-mono">
                      {customer.favoritePackage}
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">{customer.orderCount}x beli</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Preview on WhatsApp Screen */}
          <div className="bg-[#0b141a] border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400 text-xs">
              <span className="flex items-center gap-1.5 font-bold text-slate-200">
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                Preview Pesan Pelanggan
              </span>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                Tampilan WhatsApp
              </span>
            </div>

            <div className="bg-[#202c33] text-slate-200 rounded-xl rounded-tl-none p-3 shadow text-xs whitespace-pre-line leading-relaxed border border-slate-700/40">
              {previewSample}
              <div className="text-[9px] text-slate-400 text-right mt-1.5 font-mono">
                {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} • Terkirim
              </div>
            </div>
          </div>

          {/* Live Broadcast Dispatch Log */}
          {broadcastLogs.length > 0 && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Log Pengiriman Terakhir ({broadcastLogs.length}):
              </span>
              <div className="space-y-1.5 max-h-32 overflow-y-auto font-mono text-[11px]">
                {broadcastLogs.slice(0, 5).map((log, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 bg-slate-900 rounded border border-slate-800/80">
                    <span className="text-slate-300 truncate">{log.name} ({log.phone})</span>
                    <span className="text-emerald-400 font-bold shrink-0 ml-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      TERKIRIM
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Script Modal */}
      {showScriptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-5 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                Script Google Apps Script: Auto Broadcast dari Google Sheets
              </h4>
              <button
                onClick={() => setShowScriptModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer px-2 py-1 bg-slate-800 rounded"
              >
                Tutup
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Salin fungsi ini ke <code>Code.gs</code> di Apps Script Anda. Fungsi ini membaca sheet <code>TRANSACTIONS</code>, mengambil nomor unik pembeli, lalu mengirimkan pesan promosi dengan jeda aman anti-banned.
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 relative">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(gasBroadcastScript);
                  setCopiedScript(true);
                  setTimeout(() => setCopiedScript(false), 2000);
                }}
                className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold cursor-pointer shadow"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'Tersalin!' : 'Salin Script'}</span>
              </button>
              <pre className="text-xs font-mono text-emerald-300 max-h-72 overflow-y-auto scrollbar-thin pt-2">
                <code>{gasBroadcastScript}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
