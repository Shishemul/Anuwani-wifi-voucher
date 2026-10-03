import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Key, 
  Fingerprint, 
  AlertTriangle, 
  CheckCircle2, 
  Terminal, 
  FileCode, 
  EyeOff, 
  FileSpreadsheet, 
  Check, 
  Copy,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const SecurityHardeningSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'THREAT_MATRIX' | 'HARDENING_CHECKLIST' | 'CRYPTO_VALIDATION'>('THREAT_MATRIX');
  const [copiedHmac, setCopiedHmac] = useState(false);

  const hmacValidationCode = `/**
 * =========================================================================
 * IMPLEMENTASI SECURITY HARDENING: VERIFIKASI SIGNATURE HMAC-SHA256
 * Menjamin 100% webhook otentik berasal dari Payment Gateway resmi (Tripay/Midtrans)
 * =========================================================================
 */

function verifySecureWebhookSignature(e, rawContent, privateKey) {
  // 1. Ambil Signature dari Request Header
  const incomingSignature = e.parameter['X-Callback-Signature'] || 
                            e.parameter['signature'] || 
                            e.postData.headers['x-callback-signature'];

  if (!incomingSignature) {
    Logger.log("SECURITY ALERT: Webhook ditolak tanpa signature header!");
    return false;
  }

  // 2. Hitung HMAC-SHA256 dari payload mentah menggunakan Private Key Anda
  const calculatedSignatureBytes = Utilities.computeHmacSha256Signature(rawContent, privateKey);
  
  // 3. Konversi byte array ke hex string
  let calculatedSignature = "";
  for (let i = 0; i < calculatedSignatureBytes.length; i++) {
    let byteVal = calculatedSignatureBytes[i];
    if (byteVal < 0) byteVal += 256;
    let byteHex = byteVal.toString(16);
    if (byteHex.length === 1) byteHex = "0" + byteHex;
    calculatedSignature += byteHex;
  }

  // 4. Timing-safe equality check untuk mencegah timing attack
  return timingSafeEqual(incomingSignature.toLowerCase(), calculatedSignature.toLowerCase());
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
`;

  const handleCopyHmac = () => {
    navigator.clipboard.writeText(hmacValidationCode);
    setCopiedHmac(true);
    setTimeout(() => setCopiedHmac(false), 2000);
  };

  const threatItems = [
    {
      id: 'threat-1',
      title: 'Pemalsuan Callback Webhook (Fake Callback Spoofing)',
      severity: 'KRITIS',
      severityColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      vector: 'Penyerang menembak endpoint doPost Apps Script dengan payload palsu status: "PAID" untuk mendapatkan voucher gratis tanpa membayar.',
      impact: 'Kerugian finansial langsung; voucher teralokasi cuma-cuma tanpa uang masuk ke rekening bank / e-wallet.',
      mitigation: 'Validasi Cryptographic HMAC-SHA256 signature rahasia yang dihitung dari merchant_ref + amount + secret_key. Jika hash tidak cocok, sistem langsung mengembalikan HTTP 401 Unauthorized.'
    },
    {
      id: 'threat-2',
      title: 'Serangan Replay Attack (Pengulangan Transaksi Lama)',
      severity: 'TINGGI',
      severityColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      vector: 'Mengirimkan kembali payload webhook transaksi lama yang pernah sukses dibayar untuk meminta voucher kedua secara gratis.',
      impact: 'Eksploitasi duplikasi alokasi voucher dari stok yang tersedia di Google Sheet.',
      mitigation: 'Idempotency Key Check: Sebelum mengalokasikan voucher, script memeriksa kolom TRX_ID di sheet TRANSACTIONS. Jika status sudah "PAID", request kedua otomatis diabaikan.'
    },
    {
      id: 'threat-3',
      title: 'Race Condition / Double-Spend Collision',
      severity: 'KRITIS',
      severityColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      vector: 'Dua pembeli berbeda menyelesaikan pembayaran QRIS di detik yang sama persis (selisih milidetik).',
      impact: 'Tanpa mekanisme lock, script membaca baris voucher yang sama dan mengirimkan username yang sama ke dua pembeli.',
      mitigation: 'LockService.getScriptLock().tryLock(30000) menerapkan Mutex lock atomik di serverless Google Cloud sehingga eksekusi antre satu per satu secara berurutan.'
    },
    {
      id: 'threat-4',
      title: 'Manipulasi Barcode QRIS Statis (Man-in-the-Middle)',
      severity: 'TINGGI',
      severityColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      vector: 'Pihak tidak bertanggung jawab menempelkan stiker QRIS pribadi di atas stiker QRIS hotspot warkop Anda.',
      impact: 'Uang pembayaran pembeli masuk ke rekening penipu, bukan ke rekening pemilik hotspot.',
      mitigation: 'Blueprint ini mewajibkan penggunaan Dynamic QRIS berbatas waktu (15 menit) yang diterbitkan secara live per order di layar HP/WhatsApp pelanggan, bukan stiker statis fisik.'
    },
  ];

  const hardeningChecklist = [
    {
      number: '01',
      title: 'Prinsip Hak Akses Terbatas (Least Privilege)',
      desc: 'Jangan pernah membagikan Google Spreadsheet dengan opsi "Siapa saja yang memiliki link dapat mengedit". Spreadsheet harus berstatus "Restricted" hanya ke akun Google pemilik hotspot.',
      level: 'Wajib'
    },
    {
      number: '02',
      title: 'Isolasi Token via PropertiesService (No Hardcoded Keys)',
      desc: 'Jangan menuliskan Private Key atau Token WhatsApp langsung di file Code.gs. Gunakan menu Project Settings > Script Properties untuk menyimpan secret secara aman.',
      level: 'Wajib'
    },
    {
      number: '03',
      title: 'Protect Range Sheet VOUCHERS & SETTINGS',
      desc: 'Kunci seluruh kolom Password dan Konfigurasi di spreadsheet menggunakan fitur Data > Protect sheets and ranges agar teknisi warkop tidak sengaja mengedit data.',
      level: 'Sangat Dianjurkan'
    },
    {
      number: '04',
      title: 'Konfigurasi Web App Deployment yang Benar',
      desc: 'Saat deploy Apps Script, pilih "Execute as: Me" dan "Who has access: Anyone". Ini memungkinkan webhook payment gateway menembak URL tanpa perlu login akun Google, namun spreadsheet tetap aman.',
      level: 'Wajib'
    },
    {
      number: '05',
      title: 'Standardisasi & Sanitasi Input Nomor Telepon',
      desc: 'Script otomatis membersihkan karakter aneh, spasi, dan menstandarkan awalan nomor 08... menjadi format internasional 628... sebelum memanggil WhatsApp Gateway API.',
      level: 'Wajib'
    },
    {
      number: '06',
      title: 'Peringatan Darurat ke WhatsApp Admin (Failure Alerting)',
      desc: 'Jika ada upaya callback dengan signature salah atau stok voucher habis, sistem langsung mengirim pesan darurat ke nomor WhatsApp pribadi admin secara real-time.',
      level: 'Dianjurkan'
    },
    {
      number: '07',
      title: 'Google Drive Version History Rollback',
      desc: 'Manfaatkan fitur riwayat versi bawaan Google Drive (File > Version history) untuk memulihkan spreadsheet ke kondisi semula jika terjadi kesalahan operasional.',
      level: 'Best Practice'
    },
    {
      number: '08',
      title: 'Rotasi Rutin API Secret Key (Setiap 90 Hari)',
      desc: 'Lakukan penggantian API Token WhatsApp Gateway dan Private Key Payment Gateway secara berkala untuk meminimalkan dampak kebocoran kredensial.',
      level: 'Best Practice'
    },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full mb-1 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Enterprise Security Blueprint</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Analisis Risiko Keamanan QRIS & Hardening Google Sheets
          </h3>
          <p className="text-xs text-slate-400">
            Panduan mitigasi celah keamanan transaksi digital dan penguatan perlindungan database cloud tanpa server.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('THREAT_MATRIX')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'THREAT_MATRIX' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Matriks Ancaman QRIS</span>
          </button>
          <button
            onClick={() => setActiveTab('HARDENING_CHECKLIST')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'HARDENING_CHECKLIST' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Hardening Checklist</span>
          </button>
          <button
            onClick={() => setActiveTab('CRYPTO_VALIDATION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'CRYPTO_VALIDATION' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Kode HMAC Validasi</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Threat Matrix */}
      {activeTab === 'THREAT_MATRIX' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {threatItems.map((threat) => (
              <div
                key={threat.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4.5 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-white leading-snug">
                    {threat.title}
                  </h4>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${threat.severityColor}`}>
                    RISIKO {threat.severity}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Vektor Serangan:
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {threat.vector}
                    </p>
                  </div>

                  <div className="bg-rose-950/20 p-2.5 rounded-lg border border-rose-900/30">
                    <span className="text-[10px] uppercase font-bold text-rose-400 block mb-0.5">
                      Dampak Potensial:
                    </span>
                    <p className="text-rose-200/90 leading-relaxed">
                      {threat.impact}
                    </p>
                  </div>

                  <div className="bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/30">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Mitigasi pada Blueprint Ini:
                    </span>
                    <p className="text-emerald-200/90 leading-relaxed font-medium">
                      {threat.mitigation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Hardening Checklist */}
      {activeTab === 'HARDENING_CHECKLIST' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {hardeningChecklist.map((item) => (
              <div
                key={item.number}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-start space-x-3.5 hover:border-slate-700 transition"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                  {item.number}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-white">{item.title}</h5>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded font-mono ${
                      item.level === 'Wajib' 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {item.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Crypto Validation Code */}
      {activeTab === 'CRYPTO_VALIDATION' && (
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Fingerprint className="w-4 h-4 text-cyan-400" />
                  Mekanisme Validasi Signature Cryptographic HMAC-SHA256
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Fungsi di bawah menjamin bahwa callback webhook hanya diterima apabila dienkripsi dengan Private Key yang sama antara Payment Gateway dan server Apps Script Anda.
                </p>
              </div>

              <button
                onClick={handleCopyHmac}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ml-3"
              >
                {copiedHmac ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHmac ? 'Tersalin!' : 'Salin Fungsi Validasi'}</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
            <pre className="p-4 text-xs font-mono text-cyan-300 bg-slate-950 overflow-x-auto max-h-[450px] scrollbar-thin leading-relaxed">
              <code>{hmacValidationCode}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
