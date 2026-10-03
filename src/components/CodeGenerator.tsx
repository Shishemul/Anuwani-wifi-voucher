import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Terminal, 
  Sliders, 
  Settings2, 
  Router, 
  CheckCircle2, 
  FileCode,
  Zap,
  Play,
  Cloud,
  FileSpreadsheet,
  Globe,
  Radio
} from 'lucide-react';
import { 
  MIKROTIK_EXPORT_SCRIPT, 
  RUIJIE_CLOUD_API_SCRIPT, 
  RUIJIE_GATEWAY_CLI_CONFIG 
} from '../data/blueprintData';

export const CodeGenerator: React.FC = () => {
  // Customization controls
  const [routerType, setRouterType] = useState<'MIKROTIK' | 'RUIJIE'>('MIKROTIK');
  const [paymentProvider, setPaymentProvider] = useState<'TRIPAY' | 'MIDTRANS' | 'XENDIT'>('TRIPAY');
  const [waProvider, setWaProvider] = useState<'FONNTE' | 'WABLAS' | 'GENERIC'>('FONNTE');
  const [hotspotName, setHotspotName] = useState('Anuwani');
  const [hotspotLoginUrl, setHotspotLoginUrl] = useState('http://anuwani.net/login');
  const [adminPhone, setAdminPhone] = useState('081234567890');
  
  // Tabs & Copy state
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedMikrotik, setCopiedMikrotik] = useState(false);
  const [copiedRuijieApi, setCopiedRuijieApi] = useState(false);
  const [copiedRuijieCli, setCopiedRuijieCli] = useState(false);
  
  const [activeCodeTab, setActiveCodeTab] = useState<'GAS' | 'MIKROTIK' | 'RUIJIE'>('GAS');
  const [ruijieSubTab, setRuijieSubTab] = useState<'API' | 'CLI'>('API');

  // Handle router change to suggest default login URL
  const handleRouterChange = (newRouter: 'MIKROTIK' | 'RUIJIE') => {
    setRouterType(newRouter);
    if (newRouter === 'RUIJIE') {
      setHotspotLoginUrl('http://192.168.110.1:8888/portal/login');
    } else {
      setHotspotLoginUrl('http://anuwani.net/login');
    }
  };

  // Dynamically generate Google Apps Script code based on user inputs
  const generateGasScript = () => {
    const waUrl = waProvider === 'FONNTE' 
      ? 'https://api.fonnte.com/send' 
      : waProvider === 'WABLAS' 
      ? 'https://jakarta.wablas.com/api/send-message' 
      : 'https://your-wa-gateway.com/api/send';

    const directLoginExample = routerType === 'RUIJIE'
      ? `${hotspotLoginUrl}?auth_type=voucher&voucher_code=" + username`
      : `${hotspotLoginUrl}?username=" + username + "&password=" + password`;

    return `/**
 * =========================================================================
 * GOOGLE APPS SCRIPT: AUTO VOUCHER WIFI (WHATSAPP + QRIS + GOOGLE SHEETS)
 * Generated for: ${hotspotName}
 * Router Gateway: ${routerType === 'RUIJIE' ? 'Ruijie Reyee RG-EG Series / Ruijie Cloud' : 'Mikrotik RouterOS'}
 * Payment Gateway: ${paymentProvider} | WA Gateway: ${waProvider}
 * =========================================================================
 */

const CONFIG = {
  SHEET_VOUCHERS: "VOUCHERS",
  SHEET_TRANSACTIONS: "TRANSACTIONS",
  ROUTER_TYPE: "${routerType}", // "MIKROTIK" atau "RUIJIE"
  
  // WhatsApp Gateway Configuration (${waProvider})
  WA_GATEWAY_URL: "${waUrl}",
  WA_API_TOKEN: "PASTE_YOUR_WA_TOKEN_HERE",
  
  // Payment Gateway Verification (${paymentProvider})
  PAYMENT_SECRET: "PASTE_YOUR_${paymentProvider}_PRIVATE_KEY_HERE",
  
  // Hotspot Branding & Router Gateway
  HOTSPOT_NAME: "${hotspotName}",
  HOTSPOT_LOGIN_URL: "${hotspotLoginUrl}",
  ADMIN_WA: "${adminPhone}"
};

/**
 * Webhook Receiver dipanggil otomatis saat QRIS terbayar
 */
function doPost(e) {
  // 1. Dapatkan Lock Mutex untuk mencegah Race Condition (Double Voucher)
  const lock = LockService.getScriptLock();
  const acquired = lock.tryLock(30000); // Tunggu antrian maksimal 30 detik
  
  if (!acquired) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Server sibuk. LockService timeout."
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    const rawData = e.postData.contents;
    const payload = JSON.parse(rawData);
    Logger.log("Incoming Webhook (${paymentProvider}): " + rawData);

    // 2. Filter Status Pembayaran
    ${paymentProvider === 'TRIPAY' ? `
    // Tripay Callback format: status: "PAID"
    if (payload.status !== "PAID") {
      return ContentService.createTextOutput("Ignored non-PAID status").setMimeType(ContentService.MimeType.TEXT);
    }
    const merchantRef = payload.merchant_ref;
    const customerPhone = payload.customer_phone;
    const packageCode = payload.order_items && payload.order_items[0] ? payload.order_items[0].sku : "WIFI-1HARI";
    const amountPaid = payload.total_amount;
    ` : paymentProvider === 'MIDTRANS' ? `
    // Midtrans Callback format: transaction_status: "settlement"
    if (payload.transaction_status !== "settlement" && payload.transaction_status !== "capture") {
      return ContentService.createTextOutput("Ignored non-settled status").setMimeType(ContentService.MimeType.TEXT);
    }
    const merchantRef = payload.order_id;
    const customerPhone = payload.custom_field1 || CONFIG.ADMIN_WA;
    const packageCode = payload.custom_field2 || "WIFI-1HARI";
    const amountPaid = payload.gross_amount;
    ` : `
    // Xendit QRIS Callback: status: "COMPLETED"
    if (payload.status !== "COMPLETED") {
      return ContentService.createTextOutput("Ignored non-completed status").setMimeType(ContentService.MimeType.TEXT);
    }
    const merchantRef = payload.external_id || payload.id;
    const customerPhone = payload.customer_phone || CONFIG.ADMIN_WA;
    const packageCode = "WIFI-1HARI";
    const amountPaid = payload.amount;
    `}

    // 3. Akses Spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetVouchers = ss.getSheetByName(CONFIG.SHEET_VOUCHERS);
    const sheetTrx = ss.getSheetByName(CONFIG.SHEET_TRANSACTIONS);

    // 4. Cek Idempotency: Cegah proses ulang bila webhook terpanggil 2 kali
    const trxValues = sheetTrx.getDataRange().getValues();
    for (let i = 1; i < trxValues.length; i++) {
      if (trxValues[i][0] === merchantRef && trxValues[i][6] === "PAID") {
        return ContentService.createTextOutput(JSON.stringify({
          status: "success",
          message: "Transaction already processed."
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // 5. Cari Voucher 'AVAILABLE' yang sesuai dengan paket
    const voucherValues = sheetVouchers.getDataRange().getValues();
    let chosenRow = -1;
    let username = "";
    let password = "";

    for (let r = 1; r < voucherValues.length; r++) {
      const rowPackage = voucherValues[r][1]; // Kolom B: Package
      const rowStatus = voucherValues[r][4];  // Kolom E: Status
      
      if (rowPackage === packageCode && rowStatus === "AVAILABLE") {
        chosenRow = r + 1; // 1-indexed
        username = voucherValues[r][2]; // Kolom C: Voucher Code
        password = voucherValues[r][3]; // Kolom D: Password
        break;
      }
    }

    // Bila stok voucher di spreadsheet habis
    if (chosenRow === -1) {
      sendWhatsApp(CONFIG.ADMIN_WA, "⚠️ *PERINGATAN STOK HABIS!* Transaksi " + merchantRef + " (" + packageCode + ") tidak mendapat voucher. Segera restock di Google Sheet!");
      return ContentService.createTextOutput(JSON.stringify({
        status: "out_of_stock",
        message: "No voucher available"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 6. Tandai Voucher Menjadi 'USED'
    const nowStr = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");
    sheetVouchers.getRange(chosenRow, 5).setValue("USED");
    sheetVouchers.getRange(chosenRow, 6).setValue(nowStr);
    sheetVouchers.getRange(chosenRow, 7).setValue(customerPhone);
    sheetVouchers.getRange(chosenRow, 8).setValue(merchantRef);

    // 7. Catat Transaksi Baru di sheet TRANSACTIONS
    sheetTrx.appendRow([
      merchantRef,
      nowStr,
      customerPhone,
      "Pelanggan Hotspot",
      packageCode,
      amountPaid,
      "PAID",
      username,
      password,
      "SENT",
      "${paymentProvider}-QRIS"
    ]);

    // 8. Format Notifikasi WhatsApp sesuai Router (${routerType})
    const directLogin = CONFIG.HOTSPOT_LOGIN_URL + "?${directLoginExample};
    
    ${routerType === 'RUIJIE' ? `
    // Format Pesan Khusus Ruijie Reyee (Umumnya menggunakan 1 Kode Passcode / Voucher)
    const waMessage = 
      "🎉 *PEMBAYARAN QRIS BERHASIL!*\\n" +
      "Terima kasih telah membeli voucher WiFi *" + CONFIG.HOTSPOT_NAME + "*.\\n\\n" +
      "Detail Akses Ruijie Hotspot:\\n" +
      "━━━━━━━━━━━━━━━━━━━\\n" +
      "📦 *Paket:* " + packageCode + "\\n" +
      "🎟️ *Kode Voucher Ruijie:* \`" + username + "\`\\n" +
      "━━━━━━━━━━━━━━━━━━━\\n\\n" +
      "🌐 *Cara Penggunaan (Ruijie Reyee):*\\n" +
      "1. Hubungkan HP ke Wi-Fi *" + CONFIG.HOTSPOT_NAME + "*\\n" +
      "2. Buka portal atau klik link login langsung:\\n" +
      "👉 " + directLogin + "\\n" +
      "3. Masukkan Kode Voucher di atas jika diminta.\\n\\n" +
      "⏱️ *Masa aktif dihitung sejak pertama kali terhubung.*\\n" +
      "_Butuh bantuan? Silakan balas pesan ini._";
    ` : `
    // Format Pesan Standar Mikrotik Hotspot (Username & Password)
    const waMessage = 
      "🎉 *PEMBAYARAN QRIS BERHASIL!*\\n" +
      "Terima kasih telah membeli voucher di *" + CONFIG.HOTSPOT_NAME + "*.\\n\\n" +
      "Detail Akun Hotspot Anda:\\n" +
      "━━━━━━━━━━━━━━━━━━━\\n" +
      "📦 *Paket:* " + packageCode + "\\n" +
      "👤 *Username:* \`" + username + "\`\\n" +
      "🔑 *Password:* \`" + password + "\`\\n" +
      "━━━━━━━━━━━━━━━━━━━\\n\\n" +
      "🌐 *Cara Penggunaan:*\\n" +
      "1. Sambungkan ke WiFi *" + CONFIG.HOTSPOT_NAME + "*\\n" +
      "2. Klik link otomatis berikut:\\n" +
      "👉 " + directLogin + "\\n\\n" +
      "⏱️ *Masa aktif dihitung sejak pertama kali login.*\\n" +
      "_Butuh bantuan? Silakan balas pesan ini._";
    `}

    sendWhatsApp(customerPhone, waMessage);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      voucher: username
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log("Error: " + err.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Dispatcher HTTP Request ke WhatsApp Gateway (${waProvider})
 */
function sendWhatsApp(phone, message) {
  let target = phone.toString().trim();
  if (target.startsWith("08")) {
    target = "628" + target.substring(2);
  }

  const payload = {
    target: target,
    message: message,
    countryCode: "62"
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      "Authorization": CONFIG.WA_API_TOKEN
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    UrlFetchApp.fetch(CONFIG.WA_GATEWAY_URL, options);
  } catch (e) {
    Logger.log("Gagal kirim WA: " + e.toString());
  }
}
`;
  };

  const handleCopyCode = (text: string, type: 'gas' | 'mikrotik' | 'ruijie_api' | 'ruijie_cli') => {
    navigator.clipboard.writeText(text);
    if (type === 'gas') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else if (type === 'mikrotik') {
      setCopiedMikrotik(true);
      setTimeout(() => setCopiedMikrotik(false), 2000);
    } else if (type === 'ruijie_api') {
      setCopiedRuijieApi(true);
      setTimeout(() => setCopiedRuijieApi(false), 2000);
    } else if (type === 'ruijie_cli') {
      setCopiedRuijieCli(true);
      setTimeout(() => setCopiedRuijieCli(false), 2000);
    }
  };

  const currentGasCode = generateGasScript();

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full mb-1 border border-cyan-500/30">
            <FileCode className="w-3.5 h-3.5" />
            <span>Ready-to-Deploy Code & Script Generator</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Script & Konfigurasi Siap Pasang
          </h2>
          <p className="text-xs text-slate-400">
            Dukungan lengkap untuk Google Apps Script, <strong>Mikrotik RouterOS</strong>, dan <strong>Ruijie Reyee Networks (Cloud & Gateway RG-EG)</strong>.
          </p>
        </div>

        {/* Code Tab Switcher */}
        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveCodeTab('GAS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeCodeTab === 'GAS' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Google Apps Script</span>
          </button>
          <button
            onClick={() => setActiveCodeTab('MIKROTIK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeCodeTab === 'MIKROTIK' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Router className="w-3.5 h-3.5" />
            <span>Mikrotik Script</span>
          </button>
          <button
            onClick={() => setActiveCodeTab('RUIJIE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeCodeTab === 'RUIJIE' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cloud className="w-3.5 h-3.5 text-cyan-200" />
            <span>Ruijie Reyee Script</span>
            <span className="text-[9px] bg-blue-400/20 text-blue-200 px-1.5 py-0.2 rounded font-mono">NEW</span>
          </button>
        </div>
      </div>

      {activeCodeTab === 'GAS' && (
        <div className="space-y-4">
          {/* Customizer Panel */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Kustomisasi Parameter Script Otomatis
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
              {/* Router Selector */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1 font-semibold text-emerald-300">Target Router / Gateway</label>
                <select
                  value={routerType}
                  onChange={(e) => handleRouterChange(e.target.value as any)}
                  className="w-full bg-slate-950 border border-emerald-500/50 rounded-lg p-2 text-white font-semibold cursor-pointer"
                >
                  <option value="MIKROTIK">Mikrotik RouterOS</option>
                  <option value="RUIJIE">Ruijie Reyee (RG-EG)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Payment Gateway</label>
                <select
                  value={paymentProvider}
                  onChange={(e) => setPaymentProvider(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-semibold cursor-pointer"
                >
                  <option value="TRIPAY">Tripay QRIS Dynamic</option>
                  <option value="MIDTRANS">Midtrans QRIS Snap</option>
                  <option value="XENDIT">Xendit QRIS API</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">WhatsApp Gateway</label>
                <select
                  value={waProvider}
                  onChange={(e) => setWaProvider(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-semibold cursor-pointer"
                >
                  <option value="FONNTE">Fonnte (Rekomendasi)</option>
                  <option value="WABLAS">Wablas</option>
                  <option value="GENERIC">Generic REST API</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Nama Hotspot (SSID)</label>
                <input
                  type="text"
                  value={hotspotName}
                  onChange={(e) => setHotspotName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  placeholder="NET-WIFI HOTSPOT"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Hotspot Login URL</label>
                <input
                  type="text"
                  value={hotspotLoginUrl}
                  onChange={(e) => setHotspotLoginUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono text-[11px]"
                  placeholder={routerType === 'RUIJIE' ? "http://192.168.110.1:8888/portal/login" : "http://wifi.hotspot/login"}
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">No. WA Admin (Alert Stok)</label>
                <input
                  type="text"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  placeholder="081234567890"
                />
              </div>
            </div>
          </div>

          {/* Script Code Viewer */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  Google Apps Script: Code.gs (Deploy sebagai Web App • Mode {routerType})
                </span>
              </div>
              <button
                onClick={() => handleCopyCode(currentGasCode, 'gas')}
                className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Berhasil Disalin!' : 'Salin Kode Script'}</span>
              </button>
            </div>

            <pre className="p-4 text-xs font-mono text-emerald-300 bg-slate-950 overflow-x-auto max-h-[500px] scrollbar-thin leading-relaxed">
              <code>{currentGasCode}</code>
            </pre>
          </div>
        </div>
      )}

      {activeCodeTab === 'MIKROTIK' && (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                  <Router className="w-4 h-4" />
                  Script Mikrotik RouterOS WinBox / SSH
                </h3>
                <p className="text-xs text-slate-300">
                  Jalankan script ini di terminal Mikrotik untuk membuat User Profile (Rate Limit & Timeout) dan generate 50 voucher otomatis.
                </p>
              </div>

              <button
                onClick={() => handleCopyCode(MIKROTIK_EXPORT_SCRIPT, 'mikrotik')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                {copiedMikrotik ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMikrotik ? 'Berhasil Disalin!' : 'Salin Script Mikrotik'}</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
            <pre className="p-4 text-xs font-mono text-amber-300 bg-slate-950 overflow-x-auto max-h-[450px] scrollbar-thin leading-relaxed">
              <code>{MIKROTIK_EXPORT_SCRIPT}</code>
            </pre>
          </div>
        </div>
      )}

      {activeCodeTab === 'RUIJIE' && (
        <div className="space-y-4">
          {/* Header Info */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-cyan-400" />
                  Konfigurasi & Script Ruijie Reyee Networks
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Mendukung Gateway Reyee <strong>RG-EG105G-V2, RG-EG210G-E, RG-EG310GH-E</strong> serta <strong>Ruijie Cloud Open API</strong>.
                </p>
              </div>

              {/* Sub-tab Switcher */}
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setRuijieSubTab('API')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    ruijieSubTab === 'API' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Ruijie Cloud Open API (Otomatis)</span>
                </button>
                <button
                  onClick={() => setRuijieSubTab('CLI')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    ruijieSubTab === 'CLI' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Batch CSV & Captive Portal Config</span>
                </button>
              </div>
            </div>
          </div>

          {ruijieSubTab === 'API' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-300">
                  <span className="font-bold text-cyan-400 block mb-0.5">Metode 1: Ruijie Cloud Open API (Direct Generation)</span>
                  Script Google Apps Script ini memanggil REST API Ruijie Cloud untuk membuat voucher baru secara instan di cloud saat QRIS dibayar.
                </div>
                <button
                  onClick={() => handleCopyCode(RUIJIE_CLOUD_API_SCRIPT, 'ruijie_api')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ml-3"
                >
                  {copiedRuijieApi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRuijieApi ? 'Tersalin!' : 'Salin Script API Ruijie'}</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <pre className="p-4 text-xs font-mono text-cyan-300 bg-slate-950 overflow-x-auto max-h-[500px] scrollbar-thin leading-relaxed">
                  <code>{RUIJIE_CLOUD_API_SCRIPT}</code>
                </pre>
              </div>
            </div>
          )}

          {ruijieSubTab === 'CLI' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-300">
                  <span className="font-bold text-cyan-400 block mb-0.5">Metode 2: Batch CSV Import & Setting Web Portal Reyee</span>
                  Panduan konfigurasi Captive Portal di Web UI Ruijie (192.168.110.1) dan format template file CSV untuk import pool voucher.
                </div>
                <button
                  onClick={() => handleCopyCode(RUIJIE_GATEWAY_CLI_CONFIG, 'ruijie_cli')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ml-3"
                >
                  {copiedRuijieCli ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRuijieCli ? 'Tersalin!' : 'Salin Format Ruijie'}</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <pre className="p-4 text-xs font-mono text-emerald-300 bg-slate-950 overflow-x-auto max-h-[500px] scrollbar-thin leading-relaxed">
                  <code>{RUIJIE_GATEWAY_CLI_CONFIG}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
