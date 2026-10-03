import React, { useState } from 'react';
import { 
  Smartphone, 
  MessageSquare, 
  Cpu, 
  CreditCard, 
  Table, 
  Router, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Database,
  RefreshCw,
  Terminal,
  Copy,
  Check
} from 'lucide-react';
import { ARCHITECTURE_STEPS } from '../data/blueprintData';
import { ArchitectureStep } from '../types/blueprint';
import { SecurityHardeningSection } from './SecurityHardeningSection';

export const ArchitectureView: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<ArchitectureStep>(ARCHITECTURE_STEPS[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Overview */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sistem Otomasi 24/7 Tanpa Admin Manual</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Blueprint Arsitektur Penjualan Voucher WiFi
          </h2>
          <p className="text-sm md:text-base text-slate-300 mt-2.5 leading-relaxed">
            Sistem terintegrasi yang memungkinkan pelanggan membeli voucher WiFi secara instan melalui WhatsApp, melakukan pembayaran aman via <strong className="text-emerald-400">QRIS Dinamis</strong>, database terkelola rapi di <strong className="text-green-400">Google Sheets</strong> (gratis & fleksibel), dan voucher otomatis dikirimkan ke WhatsApp pelanggan dalam hitungan detik setelah bayar.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
              <span className="text-[11px] text-slate-400 font-medium block">Biaya Server Pokok</span>
              <span className="text-lg font-bold text-emerald-400">Rp 0 / Bln</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Google Sheets + Apps Script</span>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
              <span className="text-[11px] text-slate-400 font-medium block">Kecepatan Pengiriman</span>
              <span className="text-lg font-bold text-cyan-400">&lt; 3 Detik</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Webhook Real-Time</span>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
              <span className="text-[11px] text-slate-400 font-medium block">Metode Pembayaran</span>
              <span className="text-lg font-bold text-purple-400">Semua QRIS</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">BCA, Mandiri, Dana, GoPay</span>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
              <span className="text-[11px] text-slate-400 font-medium block">Integritas Transaksi</span>
              <span className="text-lg font-bold text-amber-400">100% Anti Dobel</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">LockService Mutex</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual System Topology Map */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-800 gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              Peta Topologi & Komponen Sistem
            </h3>
            <p className="text-xs text-slate-400">
              Interkoneksi 6 node utama dalam pipeline penjualan otomatis voucher hotspot
            </p>
          </div>
          <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-mono">
            Event-Driven Architecture
          </span>
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* Node 1: Customer */}
          <div className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition p-4 rounded-xl relative group">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-3">
              <Smartphone className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-semibold text-white">1. Pelanggan (User)</h4>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">Front-Facing</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pelanggan mengirim WhatsApp atau klik tombol beli di Captive Portal Mikrotik, lalu scan QRIS dengan mobile banking/e-wallet.
            </p>
            <div className="mt-3 text-[11px] font-mono text-slate-400 bg-slate-900/90 p-2 rounded border border-slate-800">
              Channel: WhatsApp / Web Browser
            </div>
          </div>

          {/* Node 2: WhatsApp Gateway */}
          <div className="bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 transition p-4 rounded-xl relative group">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-semibold text-white">2. WhatsApp Gateway</h4>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">Messaging API</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Layanan perantara seperti <strong>Fonnte / Wablas / Baileys</strong> untuk menerima order dan mengirim otomatis kredensial voucher via WhatsApp.
            </p>
            <div className="mt-3 text-[11px] font-mono text-slate-400 bg-slate-900/90 p-2 rounded border border-slate-800">
              Protocol: REST HTTP API / Webhook
            </div>
          </div>

          {/* Node 3: Google Apps Script Engine */}
          <div className="bg-slate-950/70 border border-emerald-500/30 ring-1 ring-emerald-500/20 p-4 rounded-xl relative">
            <div className="absolute top-2 right-2 text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
              KONTROLER UTAMA
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-3">
              <Cpu className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-semibold text-white">3. Google Apps Script</h4>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">Serverless</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Web App URL menerima Webhook QRIS, memvalidasi signature keamanan, mengeksekusi <strong>LockService</strong>, dan mengorkestrasi voucher.
            </p>
            <div className="mt-3 text-[11px] font-mono text-emerald-300 bg-emerald-950/40 p-2 rounded border border-emerald-800/40">
              doPost(e) Webhook Endpoint
            </div>
          </div>

          {/* Node 4: Payment Gateway QRIS */}
          <div className="bg-slate-950/70 border border-slate-800 hover:border-purple-500/40 transition p-4 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-semibold text-white">4. Payment Gateway (QRIS)</h4>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">Settlement</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tripay, Midtrans, atau Xendit meng-generate dynamic QRIS berbatas waktu dan memicu Webhook seketika saat pembayaran berhasil.
            </p>
            <div className="mt-3 text-[11px] font-mono text-slate-400 bg-slate-900/90 p-2 rounded border border-slate-800">
              MDR QRIS: 0.7% (Regulasi BI)
            </div>
          </div>

          {/* Node 5: Google Sheets Database */}
          <div className="bg-slate-950/70 border border-slate-800 hover:border-green-500/40 transition p-4 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-3">
              <Table className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-semibold text-white">5. Google Sheets Database</h4>
              <span className="text-[10px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">Cloud Data</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Menampung pool voucher aktif/terpakai, riwayat transaksi, konfigurasi harga, nomor kontak pelanggan, dan pembukuan omset otomatis.
            </p>
            <div className="mt-3 text-[11px] font-mono text-slate-400 bg-slate-900/90 p-2 rounded border border-slate-800">
              Tables: Vouchers, Transactions, Packages
            </div>
          </div>

          {/* Node 6: Mikrotik RouterOS */}
          <div className="bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition p-4 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3">
              <Router className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-semibold text-white">6. Mikrotik RouterOS</h4>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">Network Gateway</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Router pengatur Hotspot Server, manajemen bandwidth (Simple Queue), session timeout, dan captive portal login pelanggan.
            </p>
            <div className="mt-3 text-[11px] font-mono text-slate-400 bg-slate-900/90 p-2 rounded border border-slate-800">
              Profile: 2 Jam, 1 Hari, 7 Hari, 30 Hari
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Step-by-Step Data Flow */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-cyan-400" />
                Alur Data & Transaksi Langkah demi Langkah (Sequence Flow)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Klik tiap langkah di bawah untuk memeriksa payload request/response, arah data, dan proteksi keamanannya:
              </p>
            </div>
          </div>

          {/* Step Pill Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mt-4">
            {ARCHITECTURE_STEPS.map((step) => {
              const isSelected = selectedStep.step === step.step;
              return (
                <button
                  key={step.step}
                  onClick={() => setSelectedStep(step)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-500 ring-1 ring-emerald-500/50 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      STEP 0{step.step}
                    </span>
                  </div>
                  <div className="mt-1.5 text-xs font-semibold text-slate-200 line-clamp-1">
                    {step.title}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    {step.actor}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Step Detail Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Langkah {selectedStep.step} dari 7
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedStep.direction}
                </span>
              </div>
              <h4 className="text-lg font-bold text-white mt-1">
                {selectedStep.title}
              </h4>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <div className="px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400">Pengirim:</span>{' '}
                <span className="font-semibold text-slate-200">{selectedStep.actor}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 hidden sm:block" />
              <div className="px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400">Penerima:</span>{' '}
                <span className="font-semibold text-emerald-400">{selectedStep.target}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
            <div className="lg:col-span-5 space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Penjelasan Alur Logika:
              </h5>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/60">
                {selectedStep.description}
              </p>

              <div className="space-y-2 pt-2">
                <h6 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Faktor Keamanan & Keandalan:
                </h6>
                {selectedStep.step === 1 && (
                  <div className="text-xs text-slate-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Validasi nomor WhatsApp internasional (+62 standardisasi otomatis).</span>
                  </div>
                )}
                {selectedStep.step === 2 && (
                  <div className="text-xs text-slate-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Expired time 15 menit mencegah floating unpaid transaction di pool.</span>
                  </div>
                )}
                {selectedStep.step === 3 && (
                  <div className="text-xs text-slate-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Kirim QR image direct CDN + Deep Link QRIS (langsung buka BCA/GoPay).</span>
                  </div>
                )}
                {selectedStep.step === 4 && (
                  <div className="text-xs text-slate-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Standar Bank Indonesia (ASPI QRIS Nasional), instan settlement & 100% aman.</span>
                  </div>
                )}
                {selectedStep.step === 5 && (
                  <div className="text-xs text-slate-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Validasi HMAC-SHA256 signature token & IP whitelist payment gateway.</span>
                  </div>
                )}
                {selectedStep.step === 6 && (
                  <div className="text-xs text-slate-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>LockService (Mutex) 30 detik untuk menjamin voucher tidak direbut 2 order sekaligus.</span>
                  </div>
                )}
                {selectedStep.step === 7 && (
                  <div className="text-xs text-slate-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Auto 1-Click Login Link (parameter ?username=..&password=..) memanjakan pelanggan.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payload preview */}
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between bg-slate-900 px-3.5 py-2 rounded-t-lg border-t border-x border-slate-800">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  Payload / Log Data Transaksi
                </span>
                <button
                  onClick={() => handleCopy(JSON.stringify(selectedStep.payloadExample, null, 2))}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Tersalin' : 'Salin JSON'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-b-lg border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto max-h-64 scrollbar-thin">
                <code>{JSON.stringify(selectedStep.payloadExample, null, 2)}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Security Architecture & Anti-Race Condition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Mekanisme Anti Double-Voucher (LockService)</h3>
              <p className="text-xs text-slate-400">Bagaimana jika 5 orang bayar bersamaan di detik yang sama?</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Google Sheets bukan sekadar tabel manual; saat diakses via Google Apps Script, kita menggunakan <code className="text-emerald-400 bg-slate-950 px-1.5 py-0.5 rounded">LockService.getScriptLock()</code>.
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></span>
              <span><strong>Mutex Locking:</strong> Webhook request yang datang akan antre satu per satu di memori Google Cloud.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></span>
              <span><strong>Atomic Assignment:</strong> Voucher baris X diambil, status langsung diubah jadi <code>USED</code>, lalu lock dilepas untuk request berikutnya.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></span>
              <span><strong>Zero Collision:</strong> Tidak akan pernah ada 2 pembeli yang menerima voucher dengan username yang sama.</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Database className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Keuntungan Database Google Sheets</h3>
              <p className="text-xs text-slate-400">Mengapa sangat cocok untuk RT/RW Net & Warkop Hotspot?</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Tidak memerlukan database MySQL / PostgreSQL berbayar yang butuh VPS:
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5"></span>
              <span><strong>Kemudahan Edit:</strong> Pemilik warkop / teknisi bisa memantau dan mengedit data langsung dari aplikasi Google Sheets di HP tanpa laptop.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5"></span>
              <span><strong>Formula Finansial:</strong> Langsung bisa menggunakan formula <code>=SUM()</code>, grafik pivot chart omset harian, dan ekspor laporan ke PDF/Excel.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5"></span>
              <span><strong>Backup Otomatis Google Drive:</strong> Memiliki riwayat revisi (version history) tak terbatas tanpa takut database corrupt.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Security Hardening & Threat Analysis Section */}
      <SecurityHardeningSection />
    </div>
  );
};
