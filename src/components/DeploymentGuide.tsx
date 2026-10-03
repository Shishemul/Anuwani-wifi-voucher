import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckSquare, 
  HelpCircle, 
  ShieldAlert, 
  ExternalLink, 
  CheckCircle2, 
  FileSpreadsheet, 
  Globe, 
  QrCode, 
  MessageSquare,
  Router,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export const DeploymentGuide: React.FC = () => {
  // Interactive checklist
  const [checklist, setChecklist] = useState<{ id: string; label: string; checked: boolean }[]>([
    { id: 'c1', label: 'Buat file Google Spreadsheet baru di Google Drive', checked: true },
    { id: 'c2', label: 'Beri nama sheet "VOUCHERS" dan "TRANSACTIONS" sesuai kolom blueprint', checked: true },
    { id: 'c3', label: 'Buka Extensions > Apps Script dan paste kode Code.gs', checked: true },
    { id: 'c4', label: 'Deploy Web App dengan Execute as "Me" dan Who has access "Anyone"', checked: false },
    { id: 'c5', label: 'Daftar akun di Tripay / Midtrans untuk QRIS dinamis berizin BI', checked: false },
    { id: 'c6', label: 'Salin Web App URL Google Apps Script ke kolom Callback Webhook Tripay/Midtrans', checked: false },
    { id: 'c7', label: 'Daftar akun WhatsApp Gateway (Fonnte / Wablas) dan scan QR device WA bisnis', checked: false },
    { id: 'c8', label: 'Generate voucher di Mikrotik RouterOS dan input ke sheet VOUCHERS', checked: false },
    { id: 'c9', label: 'Uji coba beli voucher Rp 2.000 dengan HP pribadi untuk tes kirim pesan WA', checked: false },
  ]);

  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apakah komputer atau laptop harus selalu hidup (standby) 24 jam?',
      a: 'TIDAK PERLU! Inilah keunggulan utama arsitektur Google Sheets + Apps Script + QRIS. Server berjalan sepenuhnya di Cloud Google (Serverless) dan Cloud Payment Gateway. Selama router Mikrotik di lokasi Anda hidup dan terhubung ke internet, transaksi penjualan dan pengiriman voucher berjalan 100% otomatis 24 jam nonstop bahkan saat Anda sedang tidur.'
    },
    {
      q: 'Bagaimana jika ada pembeli yang scan QRIS namun stok voucher di spreadsheet sedang kosong?',
      a: 'Sistem telah dilengkapi fail-safe: script akan menolak alokasi, memicu notifikasi peringatan darurat ke WhatsApp Admin ("Stok voucher habis!"), dan mencatat transaksi sebagai pending/out_of_stock. Anda bisa segera restock voucher di Google Sheet lalu script akan mengantarkan voucher tersebut atau Anda bisa refund saldo via admin panel gateway.'
    },
    {
      q: 'Berapa biaya operasional bulanan untuk sistem ini?',
      a: 'Biaya server: Rp 0 (Google Sheets & Apps Script 100% gratis). Biaya QRIS: HANYA potongan MDR 0.7% saat ada transaksi (contoh: voucher Rp 5.000 terpotong Rp 35 saja). Biaya WhatsApp Gateway: mulai Rp 35.000 - Rp 50.000 per bulan (Fonnte/Wablas) untuk ribuan pesan otomatis.'
    },
    {
      q: 'Apakah pembeli bisa memalsukan bukti pembayaran (struk palsu)?',
      a: 'TIDAK BISA! Sistem ini sama sekali TIDAK menggunakan struk atau screenshot bukti transfer. Sistem hanya mengirim voucher jika ada sinyal Webhook resmi yang ditandatangani secara digital (HMAC-SHA256 signature) langsung dari server bank/payment gateway ke Apps Script.'
    },
    {
      q: 'Bisakah voucher otomatis login tanpa pembeli perlu mengetik username & password?',
      a: 'BISA! Pesan WhatsApp yang dikirimkan ke pelanggan sudah menyertakan Direct Login Link (contoh: http://wifi.hotspot/login?username=xxx&password=yyy). Saat pelanggan klik link tersebut dari HP yang tersambung ke WiFi, browser otomatis login dan internet langsung aktif.'
    }
  ];

  const completedCount = checklist.filter(c => c.checked).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full mb-1 border border-amber-500/30">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Complete Deployment Handbook</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Panduan Langkah Demi Langkah Penerapan (Go-Live)
        </h2>
        <p className="text-xs text-slate-400">
          Ikuti petunjuk konfigurasi dari nol hingga sistem siap melayani pembeli otomatis di hotspot Anda.
        </p>
      </div>

      {/* 5 Step Detailed Guide */}
      <div className="space-y-4">
        {/* Step 1 */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <FileSpreadsheet className="w-4 h-4 text-green-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">
                Langkah 1: Setup Google Spreadsheet Database
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Buka Google Drive (<a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-emerald-400 underline">sheets.new</a>), lalu buat 2 lembar kerja (sheet):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                  <span className="font-bold text-emerald-400 block mb-1">Sheet 1: VOUCHERS</span>
                  <p className="text-[11px] text-slate-400">
                    Header baris 1: <code className="text-slate-200">ID, PACKAGE_CODE, USERNAME, PASSWORD, STATUS, SOLD_AT, CUSTOMER_PHONE, TRX_ID</code>
                  </p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                  <span className="font-bold text-cyan-400 block mb-1">Sheet 2: TRANSACTIONS</span>
                  <p className="text-[11px] text-slate-400">
                    Header baris 1: <code className="text-slate-200">TRX_ID, TIMESTAMP, PHONE, CUSTOMER_NAME, PACKAGE, AMOUNT, STATUS, VOUCHER, WA_STATUS, GATEWAY_REF</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Globe className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">
                Langkah 2: Pasang Google Apps Script & Deploy Web App
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Di Google Spreadsheet Anda, klik menu <strong>Extensions &gt; Apps Script</strong>. Hapus isi bawaan, lalu paste kode <code>Code.gs</code> dari tab "Script Siap Pakai".
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30 text-xs text-slate-300 space-y-1">
                <span className="text-emerald-400 font-bold block">PENTING SAAT DEPLOY:</span>
                <div>1. Klik tombol <strong>Deploy &gt; New deployment</strong></div>
                <div>2. Pilih icon gear &gt; <strong>Web app</strong></div>
                <div>3. Execute as: <strong>Me (email Anda)</strong></div>
                <div>4. Who has access: <strong>Anyone</strong> (Wajib, agar payment gateway bisa mengirim webhook)</div>
                <div>5. Salin <strong>Web App URL</strong> yang dihasilkan (berakhiran <code>/exec</code>).</div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <QrCode className="w-4 h-4 text-purple-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">
                Langkah 3: Integrasikan Payment Gateway QRIS
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Daftar akun merchant di <strong>Tripay</strong> (<a href="https://tripay.co.id" target="_blank" rel="noreferrer" className="text-purple-400 underline">tripay.co.id</a>) atau <strong>Midtrans</strong>.
              </p>
              <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                <li>Buka menu Integrasi / Pengaturan Webhook / Callback.</li>
                <li>Paste <strong>Web App URL</strong> Google Apps Script Anda ke kolom <em>Callback URL</em>.</li>
                <li>Aktifkan event: <code>Payment Settlement</code> / <code>Transaction Status: PAID</code>.</li>
                <li>Salin Private Key / Secret Key ke baris konfigurasi <code>PAYMENT_SECRET</code> di script Apps Script.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">
                Langkah 4: Hubungkan WhatsApp Gateway
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Gunakan penyedia WhatsApp API seperti <strong>Fonnte</strong> (<a href="https://fonnte.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">fonnte.com</a>) atau Wablas:
              </p>
              <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                <li>Scan QR WhatsApp nomor bisnis hotspot Anda di dashboard Fonnte.</li>
                <li>Dapatkan <strong>API Token</strong> dan masukkan ke konstanta <code>WA_API_TOKEN</code> di Apps Script.</li>
                <li>Untuk fitur auto-reply bot order kata kunci (seperti `BELI 1HARI`), atur Auto Responder di dashboard Fonnte mengarah ke Apps Script Anda.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Step 5 */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Router className="w-4 h-4 text-amber-400" />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">
                Langkah 5: Konfigurasi Hotspot Router (Pilih: Mikrotik ATAU Ruijie Reyee)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {/* Opsi A: Mikrotik */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Router className="w-3.5 h-3.5" />
                    Opsi A: Mikrotik RouterOS
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Buka WinBox &gt; Terminal, jalankan script profil & generate 50 voucher batch. Salin username & password ke sheet <code>VOUCHERS</code>.
                  </p>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Format: ?username=xxx&password=yyy
                  </span>
                </div>

                {/* Opsi B: Ruijie Reyee */}
                <div className="bg-slate-950 p-3 rounded-xl border border-blue-500/30 text-xs space-y-1.5">
                  <span className="font-bold text-blue-400 flex items-center gap-1.5">
                    <Router className="w-3.5 h-3.5 text-cyan-400" />
                    Opsi B: Ruijie Reyee (RG-EG / Cloud)
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Masuk Web UI Reyee (192.168.110.1) atau Ruijie Cloud &gt; Captive Portal &gt; Mode Voucher. Gunakan <strong>Ruijie Cloud Open API</strong> untuk pembuatan otomatis atau import file CSV.
                  </p>
                  <span className="text-[10px] text-cyan-400 block font-mono">
                    Format: ?auth_type=voucher&voucher_code=RJxxxxx
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Deployment Checklist */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-400" />
              Checklist Kesiapan Go-Live
            </h3>
            <p className="text-xs text-slate-400">Centang poin-poin yang sudah Anda selesaikan di lapangan</p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 bg-slate-800 text-emerald-400 rounded-lg border border-slate-700">
            {completedCount} / {checklist.length} Selesai
          </span>
        </div>

        <div className="space-y-2.5 mt-4">
          {checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleChecklist(item.id)}
              className={`p-3 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                item.checked 
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200' 
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className={`text-xs ${item.checked ? 'line-through text-slate-400' : ''}`}>
                {item.label}
              </span>
              <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                item.checked ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700'
              }`}>
                {item.checked && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          Pertanyaan Umum (FAQ) & Solusi Teknis
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-slate-200 hover:text-white transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-emerald-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>
                {isExpanded && (
                  <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-900/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
