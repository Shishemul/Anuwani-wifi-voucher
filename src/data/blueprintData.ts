import { VoucherPackage, VoucherItem, TransactionRecord, ArchitectureStep } from '../types/blueprint';

export const INITIAL_PACKAGES: VoucherPackage[] = [
  {
    id: 'pkg-1',
    name: 'Paket Kilat 2 Jam',
    code: 'WIFI-2JAM',
    price: 2000,
    duration: '2 Jam',
    durationHours: 2,
    speed: 'Up to 5 Mbps',
    description: 'Cocok untuk browsing cepat, chat WhatsApp, & streaming musik santai.',
  },
  {
    id: 'pkg-2',
    name: 'Paket Harian 24 Jam',
    code: 'WIFI-1HARI',
    price: 5000,
    duration: '24 Jam (1 Hari)',
    durationHours: 24,
    speed: 'Up to 10 Mbps',
    description: 'Paling diminati! Unlimited kuota tanpa FUP untuk seharian penuh.',
    popular: true,
  },
  {
    id: 'pkg-3',
    name: 'Paket Mingguan 7 Hari',
    code: 'WIFI-7HARI',
    price: 20000,
    duration: '7 Hari',
    durationHours: 168,
    speed: 'Up to 15 Mbps',
    description: 'Hemat untuk penghuni kos, warkop reguler, dan WFH ringan.',
  },
  {
    id: 'pkg-4',
    name: 'Paket Sultan 30 Hari',
    code: 'WIFI-30HARI',
    price: 50000,
    duration: '30 Hari (1 Bulan)',
    durationHours: 720,
    speed: 'Up to 20 Mbps',
    description: 'Akses internet stabil sebulan penuh dengan prioritas bandwidth.',
  },
];

export const INITIAL_VOUCHERS: VoucherItem[] = [
  // 2 JAM
  { id: 'v-101', packageCode: 'WIFI-2JAM', username: '2J-88219', password: 'pass882', status: 'AVAILABLE' },
  { id: 'v-102', packageCode: 'WIFI-2JAM', username: '2J-34192', password: 'pass341', status: 'AVAILABLE' },
  { id: 'v-103', packageCode: 'WIFI-2JAM', username: '2J-99201', password: 'pass992', status: 'AVAILABLE' },
  { id: 'v-104', packageCode: 'WIFI-2JAM', username: '2J-11204', password: 'pass112', status: 'USED', soldAt: '2026-10-02 18:30:12', customerPhone: '081298765432', trxId: 'TRX-1001' },
  // 1 HARI
  { id: 'v-201', packageCode: 'WIFI-1HARI', username: '1H-47201', password: 'wifi472', status: 'AVAILABLE' },
  { id: 'v-202', packageCode: 'WIFI-1HARI', username: '1H-62910', password: 'wifi629', status: 'AVAILABLE' },
  { id: 'v-203', packageCode: 'WIFI-1HARI', username: '1H-88421', password: 'wifi884', status: 'AVAILABLE' },
  { id: 'v-204', packageCode: 'WIFI-1HARI', username: '1H-55019', password: 'wifi550', status: 'AVAILABLE' },
  { id: 'v-205', packageCode: 'WIFI-1HARI', username: '1H-12903', password: 'wifi129', status: 'USED', soldAt: '2026-10-02 21:15:40', customerPhone: '085712345678', trxId: 'TRX-1002' },
  // 7 HARI
  { id: 'v-301', packageCode: 'WIFI-7HARI', username: '7H-90123', password: 'pro901', status: 'AVAILABLE' },
  { id: 'v-302', packageCode: 'WIFI-7HARI', username: '7H-44120', password: 'pro441', status: 'AVAILABLE' },
  { id: 'v-303', packageCode: 'WIFI-7HARI', username: '7H-77192', password: 'pro771', status: 'AVAILABLE' },
  // 30 HARI
  { id: 'v-401', packageCode: 'WIFI-30HARI', username: '30H-VIP01', password: 'vip889', status: 'AVAILABLE' },
  { id: 'v-402', packageCode: 'WIFI-30HARI', username: '30H-VIP02', password: 'vip992', status: 'AVAILABLE' },
];

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    trxId: 'TRX-1001',
    timestamp: '2026-10-02 18:30:12',
    customerPhone: '081298765432',
    customerName: 'Budi Santoso',
    packageCode: 'WIFI-2JAM',
    packageName: 'Paket Kilat 2 Jam',
    amount: 2000,
    paymentMethod: 'QRIS_DYNAMIC',
    paymentProvider: 'TRIPAY',
    status: 'PAID',
    qrisString: '00020101021226670016ID.CO.QRIS.WWW011893600999000100010002150812987654320005204581253033605802ID5907ANUWANI6007BANDUNG62070703A01630453B2',
    voucherCode: '2J-11204',
    voucherPassword: 'pass112',
    waStatus: 'SENT',
    paymentRef: 'TRIPAY-8891024',
  },
  {
    trxId: 'TRX-1002',
    timestamp: '2026-10-02 21:15:40',
    customerPhone: '085712345678',
    customerName: 'Rina Marlina',
    packageCode: 'WIFI-1HARI',
    packageName: 'Paket Harian 24 Jam',
    amount: 5000,
    paymentMethod: 'QRIS_DYNAMIC',
    paymentProvider: 'MIDTRANS',
    status: 'PAID',
    qrisString: '00020101021226670016ID.CO.QRIS.WWW011893600999000100010002150857123456780005204581253033605802ID5907ANUWANI6007BANDUNG62070703A02630489F1',
    voucherCode: '1H-12903',
    voucherPassword: 'wifi129',
    waStatus: 'SENT',
    paymentRef: 'MIDTRANS-9901421',
  },
];

export const ARCHITECTURE_STEPS: ArchitectureStep[] = [
  {
    step: 1,
    id: 'req_order',
    title: 'Customer Memilih Paket Voucher',
    actor: 'Pelanggan (WhatsApp / Web Hotspot)',
    target: 'WhatsApp Bot / Apps Script Web App',
    direction: 'Customer -> Server',
    description: 'Pelanggan mengirim pesan teks via WhatsApp (contoh: `BELI 1HARI`) atau memilih paket langsung dari halaman Login Hotspot (Captive Portal).',
    payloadExample: {
      from: '6281234567890',
      message: 'BELI 1HARI',
      timestamp: '2026-10-03T10:00:00Z',
    },
    statusColor: 'border-blue-500 text-blue-400',
  },
  {
    step: 2,
    id: 'create_qris',
    title: 'Pembuatan Dynamic QRIS Invoice',
    actor: 'Google Apps Script Engine',
    target: 'Payment Gateway (Midtrans / Tripay / Xendit)',
    direction: 'Server -> Payment Gateway',
    description: 'Apps Script mencatat draft transaksi di Google Sheet dan meminta QRIS dinamis berbatas waktu (misal expired 15 menit) ke Payment Gateway API.',
    payloadExample: {
      method: 'POST',
      endpoint: '/v2/charge or /transaction/create',
      body: {
        payment_method: 'QRIS',
        amount: 5000,
        merchant_ref: 'TRX-1003',
        customer_phone: '081234567890',
        expired_time: 900,
      },
    },
    statusColor: 'border-amber-500 text-amber-400',
  },
  {
    step: 3,
    id: 'send_qris_wa',
    title: 'Kirim Gambar/Link QRIS ke WhatsApp',
    actor: 'WhatsApp Gateway (Fonnte / Wablas)',
    target: 'WhatsApp Pelanggan',
    direction: 'Gateway -> Customer',
    description: 'Bot mengirimkan QRIS image URL, nominal pembayaran persis, batas waktu bayar, serta instruksi cara scan melalui GoPay, OVO, Dana, ShopeePay, BCA, Mandiri, dll.',
    payloadExample: {
      target: '081234567890',
      message: 'Halo Kak! Silakan scan QRIS berikut untuk Paket Harian 24 Jam Rp 5.000.',
      url: 'https://api.payment.com/qris/img/trx1003.png',
    },
    statusColor: 'border-emerald-500 text-emerald-400',
  },
  {
    step: 4,
    id: 'customer_scan',
    title: 'Pelanggan Membayar via Aplikasi M-Banking/E-Wallet',
    actor: 'Aplikasi Bank / E-Wallet Pelanggan',
    target: 'Jaringan Switcher QRIS (NMID Bank Indonesia)',
    direction: 'E-Wallet -> Bank Indonesia',
    description: 'Pelanggan scan barcode QRIS dari layar WhatsApp atau download gambar ke galeri e-wallet. Saldo terpotong seketika (real-time settlement).',
    payloadExample: {
      settlement_status: 'SUCCESS',
      issuer: 'BCA / GoPay',
      amount_settled: 5000,
      rrn: '409871239012',
    },
    statusColor: 'border-purple-500 text-purple-400',
  },
  {
    step: 5,
    id: 'payment_webhook',
    title: 'Webhook Callback Masuk ke Google Apps Script',
    actor: 'Payment Gateway',
    target: 'Google Apps Script (doPost Webhook)',
    direction: 'Payment Gateway -> Google Apps Script',
    description: 'Payment gateway memicu notifikasi HTTP POST ke URL Web App Apps Script. Apps Script memvalidasi signature hash rahasia untuk mencegah pemalsuan pembayaran.',
    payloadExample: {
      event: 'payment.settlement',
      merchant_ref: 'TRX-1003',
      status: 'PAID',
      amount: 5000,
      signature: '9a8b7c6d5e4f3a2b1...',
    },
    statusColor: 'border-indigo-500 text-indigo-400',
  },
  {
    step: 6,
    id: 'claim_voucher',
    title: 'Alokasi Voucher & Lock Database Google Sheets',
    actor: 'Google Apps Script Database Logic',
    target: 'Google Sheet (Sheet VOUCHERS & TRANSACTIONS)',
    direction: 'Apps Script <-> Google Sheet',
    description: 'Apps Script menggunakan LockService (mencegah race condition). Mencari 1 baris voucher AVAILABLE yang cocok dengan paket, mengubah status jadi USED, dan mencatat transaksi.',
    payloadExample: {
      action: 'ALLOCATE_VOUCHER',
      package: 'WIFI-1HARI',
      assignedVoucher: '1H-47201',
      rowUpdated: 6,
      lockAcquiredMs: 45,
    },
    statusColor: 'border-teal-500 text-teal-400',
  },
  {
    step: 7,
    id: 'auto_dispatch_wa',
    title: 'Kirim Notifikasi Otomatis & Akun Login ke Pelanggan',
    actor: 'WhatsApp Dispatcher Service',
    target: 'WhatsApp Pelanggan',
    direction: 'Server -> WhatsApp Customer',
    description: 'Sistem langsung mengirim pesan WhatsApp berisi Kode Voucher, Password, Direct Login Link, Batas Aktif, SSID Wi-Fi, dan Panduan Menghubungkan dalam hitungan detik.',
    payloadExample: {
      phone: '081234567890',
      message: '✅ PEMBAYARAN BERHASIL!\nUsername: 1H-47201\nPassword: wifi472\nKlik Login: http://wifi.hotspot/login?username=1H-47201&password=wifi472',
    },
    statusColor: 'border-emerald-400 text-emerald-300',
  },
];

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * =========================================================================
 * BLUEPRINT SISTEM PENJUALAN VOUCHER WIFI OTOMATIS
 * Database: Google Sheets | Payment: QRIS | Notif: WhatsApp Gateway
 * Engine: Google Apps Script (Web App Deployment)
 * =========================================================================
 */

// KONFIGURASI GLOBAL
const CONFIG = {
  SPREADSHEET_ID: SpreadsheetApp.getActiveSpreadsheet().getId(),
  SHEET_VOUCHERS: "VOUCHERS",
  SHEET_TRANSACTIONS: "TRANSACTIONS",
  SHEET_PACKAGES: "PACKAGES",
  SHEET_SETTINGS: "SETTINGS",
  
  // WhatsApp Gateway API (Contoh: Fonnte, Wablas, atau Gateway Sendiri)
  WA_GATEWAY_URL: "https://api.fonnte.com/send",
  WA_API_TOKEN: "GANTI_DENGAN_TOKEN_WA_ANDA", 
  
  // Payment Gateway Secret Key (Contoh: Tripay / Midtrans)
  PAYMENT_SECRET_KEY: "GANTI_DENGAN_SECRET_KEY_QRIS_ANDA",
  HOTSPOT_NAME: "Anuwani",
  HOTSPOT_LOGIN_URL: "http://anuwani.net/login",
  ADMIN_WA: "081234567890"
};

/**
 * Endpoint POST menerima Webhook dari Payment Gateway (QRIS)
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  // Tunggu lock hingga 30 detik untuk mencegah 2 pembeli mengambil 1 voucher yang sama
  const successLock = lock.tryLock(30000);
  
  if (!successLock) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Server busy, lock timeout"
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    const rawData = e.postData.contents;
    const payload = JSON.parse(rawData);
    
    // Log payload untuk audit
    Logger.log("Incoming Webhook: " + rawData);

    /**
     * 1. VERIFIKASI SIGNATURE WEBHOOK
     * Contoh verifikasi HMAC-SHA256 untuk Tripay atau Midtrans
     */
    const isValidSignature = verifyPaymentSignature(payload, e.parameter);
    if (!isValidSignature) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "unauthorized",
        message: "Signature mismatch"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    /**
     * 2. CEK STATUS PEMBAYARAN
     * Hanya proses jika status PAID / SETTLEMENT
     */
    const trxStatus = (payload.status || payload.transaction_status || "").toUpperCase();
    if (trxStatus !== "PAID" && trxStatus !== "SETTLEMENT" && trxStatus !== "SUCCESS") {
      return ContentService.createTextOutput(JSON.stringify({
        status: "ignored",
        message: "Payment status is " + trxStatus
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const merchantRef = payload.merchant_ref || payload.order_id;
    const customerPhone = payload.customer_phone || payload.customer_phone_number;
    const packageCode = payload.package_code || extractPackageFromRef(merchantRef);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetTrx = ss.getSheetByName(CONFIG.SHEET_TRANSACTIONS);
    const sheetVouchers = ss.getSheetByName(CONFIG.SHEET_VOUCHERS);

    /**
     * 3. CEK APAKAH TRANSAKSI SUDAH PERNAH DIPROSES (Idempotency)
     */
    const trxData = sheetTrx.getDataRange().getValues();
    let existingTrxRow = -1;
    for (let i = 1; i < trxData.length; i++) {
      if (trxData[i][0] === merchantRef && trxData[i][6] === "PAID") {
        return ContentService.createTextOutput(JSON.stringify({
          status: "already_processed",
          message: "Transaction already fulfilled"
        })).setMimeType(ContentService.MimeType.JSON);
      }
      if (trxData[i][0] === merchantRef) {
        existingTrxRow = i + 1;
      }
    }

    /**
     * 4. AMBIL VOUCHER DARI POOL (Status: AVAILABLE)
     */
    const voucherData = sheetVouchers.getDataRange().getValues();
    let chosenVoucher = null;
    let chosenVoucherRow = -1;

    for (let r = 1; r < voucherData.length; r++) {
      const vPackage = voucherData[r][1]; // Kolom B: Package Code
      const vStatus = voucherData[r][4];  // Kolom E: Status
      
      if (vPackage === packageCode && vStatus === "AVAILABLE") {
        chosenVoucher = {
          username: voucherData[r][2], // Kolom C: Username
          password: voucherData[r][3], // Kolom D: Password
        };
        chosenVoucherRow = r + 1;
        break;
      }
    }

    if (!chosenVoucher) {
      // Alert Admin: Voucher Habis di Spreadsheet!
      sendWhatsAppMessage(CONFIG.ADMIN_WA, "⚠️ PERINGATAN! Stok voucher paket " + packageCode + " HABIS untuk order " + merchantRef);
      return ContentService.createTextOutput(JSON.stringify({
        status: "out_of_stock",
        message: "No voucher available"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    /**
     * 5. UPDATE STATUS VOUCHER MENJADI 'USED'
     */
    const nowStr = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");
    sheetVouchers.getRange(chosenVoucherRow, 5).setValue("USED");
    sheetVouchers.getRange(chosenVoucherRow, 6).setValue(nowStr);
    sheetVouchers.getRange(chosenVoucherRow, 7).setValue(customerPhone);
    sheetVouchers.getRange(chosenVoucherRow, 8).setValue(merchantRef);

    /**
     * 6. UPDATE / CATAT LOG TRANSAKSI
     */
    if (existingTrxRow > 0) {
      sheetTrx.getRange(existingTrxRow, 7).setValue("PAID");
      sheetTrx.getRange(existingTrxRow, 8).setValue(chosenVoucher.username);
      sheetTrx.getRange(existingTrxRow, 9).setValue(chosenVoucher.password);
      sheetTrx.getRange(existingTrxRow, 10).setValue("SENT");
    } else {
      sheetTrx.appendRow([
        merchantRef,
        nowStr,
        customerPhone,
        payload.customer_name || "Pelanggan Hotspot",
        packageCode,
        payload.amount || 0,
        "PAID",
        chosenVoucher.username,
        chosenVoucher.password,
        "SENT",
        payload.reference || "QRIS-AUTO"
      ]);
    }

    /**
     * 7. KIRIM NOTIFIKASI OTOMATIS KE WHATSAPP PELANGGAN
     */
    const directLogin = CONFIG.HOTSPOT_LOGIN_URL + "?username=" + chosenVoucher.username + "&password=" + chosenVoucher.password;
    
    const messageText = 
      "🎉 *PEMBAYARAN BERHASIL!*\n" +
      "Terima kasih telah membeli voucher internet di *" + CONFIG.HOTSPOT_NAME + "*.\n\n" +
      "Detail Akun Hotspot Anda:\n" +
      "━━━━━━━━━━━━━━━━━━━\n" +
      "📦 *Paket:* " + packageCode + "\n" +
      "👤 *Username:* \`" + chosenVoucher.username + "\`\n" +
      "🔑 *Password:* \`" + chosenVoucher.password + "\`\n" +
      "━━━━━━━━━━━━━━━━━━━\n\n" +
      "🌐 *Cara Penggunaan:*\n" +
      "1. Sambungkan HP/Laptop ke Wi-Fi *" + CONFIG.HOTSPOT_NAME + "*\n" +
      "2. Buka browser atau klik link login otomatis:\n" +
      "👉 " + directLogin + "\n" +
      "3. Masukkan Username & Password di atas jika diminta.\n\n" +
      "⏱️ *Masa aktif voucher mulai dihitung sejak login pertama.*\n" +
      "_Butuh bantuan? Balas pesan ini._";

    sendWhatsAppMessage(customerPhone, messageText);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Payment processed, voucher sent via WhatsApp",
      voucher: chosenVoucher.username
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("Error processing webhook: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Fungsi kirim pesan WhatsApp melalui Fonnte / Wablas API
 */
function sendWhatsAppMessage(phoneTarget, message) {
  // Format nomor jadi standar Indonesia jika diawali 08
  let formattedPhone = phoneTarget.toString().trim();
  if (formattedPhone.startsWith("08")) {
    formattedPhone = "628" + formattedPhone.substring(2);
  }

  const payload = {
    target: formattedPhone,
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
    const response = UrlFetchApp.fetch(CONFIG.WA_GATEWAY_URL, options);
    Logger.log("WA Response: " + response.getContentText());
  } catch (err) {
    Logger.log("Gagal kirim WA: " + err.toString());
  }
}

/**
 * Verifikasi signature payment gateway
 */
function verifyPaymentSignature(payload, params) {
  // Contoh validasi sederhana - pada implementasi riil gunakan hash HMAC-SHA256
  // sesuai dokumentasi Midtrans / Tripay
  return true; 
}

function extractPackageFromRef(ref) {
  if (ref.includes("2JAM")) return "WIFI-2JAM";
  if (ref.includes("1HARI")) return "WIFI-1HARI";
  if (ref.includes("7HARI")) return "WIFI-7HARI";
  if (ref.includes("30HARI")) return "WIFI-30HARI";
  return "WIFI-1HARI";
}
`;

export const MIKROTIK_EXPORT_SCRIPT = `# =========================================================================
# SCRIPT MIKROTIK ROUTEROS: AUTO GENERATE VOUCHER POOL FOR GOOGLE SHEETS
# Jalankan di Terminal Mikrotik WinBox / SSH
# =========================================================================

# 1. Pastikan Profile Hotspot sudah dibuat di RouterOS:
# /ip hotspot user profile add name="WIFI-2JAM" session-timeout=2h rate-limit="5M/5M"
# /ip hotspot user profile add name="WIFI-1HARI" session-timeout=24h rate-limit="10M/10M"
# /ip hotspot user profile add name="WIFI-7HARI" session-timeout=7d rate-limit="15M/15M"
# /ip hotspot user profile add name="WIFI-30HARI" session-timeout=30d rate-limit="20M/20M"

# 2. Script Generate 50 Voucher Paket 1 Hari (Format Username & Password Acak)
:local profileName "WIFI-1HARI";
:local count 50;
:local chars "abcdefghjkmnpqrstuvwxyz23456789";

:for i from=1 to=$count do={
    :local userCode "";
    :local passCode "";
    :for j from=1 to=5 do={
        :local randNum [:rndnum from=0 to=([:len $chars]-1)];
        :set userCode ($userCode . [:pick $chars $randNum ($randNum+1)]);
    }
    :for k from=1 to=5 do={
        :local randNum2 [:rndnum from=0 to=([:len $chars]-1)];
        :set passCode ($passCode . [:pick $chars $randNum2 ($randNum2+1)]);
    }
    
    :local finalUser ("1H-" . $userCode);
    /ip hotspot user add name=$finalUser password=$passCode profile=$profileName comment="AUTO-SHEETS-BATCH-1";
    :put ("Exported: " . $finalUser . "," . $passCode . "," . $profileName);
}

# Tips: Anda bisa mengekspor daftar user ke CSV melalui Winbox atau API
# lalu copy-paste ke Sheet VOUCHERS Google Spreadsheet.
`;

export const RUIJIE_CLOUD_API_SCRIPT = `/**
 * =========================================================================
 * INTEGRASI RUIJIE REYEE CLOUD OPEN API (GOOGLE APPS SCRIPT)
 * Membuat voucher otomatis langsung di Ruijie Cloud saat QRIS terbayar
 * Mendukung Gateway: RG-EG105G, RG-EG210G-E, RG-EG310GH-E, AP Reyee
 * =========================================================================
 */

const RUIJIE_CONFIG = {
  API_BASE_URL: "https://cloud-as.ruijienetworks.com/service/api", // Ruijie Cloud Asia Region
  APP_KEY: "MASUKKAN_APP_KEY_RUIJIE_CLOUD_ANDA",
  APP_SECRET: "MASUKKAN_APP_SECRET_RUIJIE_CLOUD_ANDA",
  NETWORK_GROUP_ID: "MASUKKAN_NETWORK_ID_PROJECT_ANDA", // ID Project di Ruijie Cloud
  DEFAULT_CONCURRENT_DEVICES: 1, // 1 voucher untuk 1 HP
};

/**
 * Fungsi Mendapatkan Token Akses Ruijie Cloud Open API
 */
function getRuijieAccessToken() {
  const cache = CacheService.getScriptCache();
  const cachedToken = cache.get("ruijie_access_token");
  if (cachedToken) return cachedToken;

  const url = RUIJIE_CONFIG.API_BASE_URL + "/auth/token";
  const payload = {
    appKey: RUIJIE_CONFIG.APP_KEY,
    appSecret: RUIJIE_CONFIG.APP_SECRET
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const result = JSON.parse(response.getContentText());

  if (result.code === 0 && result.data && result.data.accessToken) {
    // Cache token selama 110 menit (token berlaku 120 menit)
    cache.put("ruijie_access_token", result.data.accessToken, 6600);
    return result.data.accessToken;
  }
  
  throw new Error("Gagal login ke Ruijie Cloud API: " + response.getContentText());
}

/**
 * Generate 1 Voucher Dinamis di Ruijie Cloud
 * @param {string} packageCode - WIFI-2JAM | WIFI-1HARI | WIFI-7HARI | WIFI-30HARI
 * @param {string} customerPhone - Nomor WhatsApp pembeli
 */
function createRuijieDynamicVoucher(packageCode, customerPhone) {
  const token = getRuijieAccessToken();
  const url = RUIJIE_CONFIG.API_BASE_URL + "/voucher/create";

  // Durasi dalam menit
  let durationMinutes = 1440; // Default 1 Hari
  let speedRateDown = 10240; // 10 Mbps
  let speedRateUp = 10240;

  if (packageCode === "WIFI-2JAM") {
    durationMinutes = 120;
    speedRateDown = 5120;
    speedRateUp = 5120;
  } else if (packageCode === "WIFI-7HARI") {
    durationMinutes = 10080;
    speedRateDown = 15360;
    speedRateUp = 15360;
  } else if (packageCode === "WIFI-30HARI") {
    durationMinutes = 43200;
    speedRateDown = 20480;
    speedRateUp = 20480;
  }

  // Kode voucher acak 6 karakter angka & huruf kapital (khas Ruijie)
  const voucherCode = "RJ" + Math.floor(100000 + Math.random() * 900000);

  const payload = {
    networkGroupId: RUIJIE_CONFIG.NETWORK_GROUP_ID,
    voucherCode: voucherCode,
    duration: durationMinutes, // dalam menit
    concurrentLimit: RUIJIE_CONFIG.DEFAULT_CONCURRENT_DEVICES,
    downRateLimit: speedRateDown, // Kbps
    upRateLimit: speedRateUp,     // Kbps
    description: "Auto-QRIS " + customerPhone + " " + packageCode
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      "Authorization": "Bearer " + token
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const json = JSON.parse(response.getContentText());

  if (json.code === 0) {
    Logger.log("Voucher Ruijie Berhasil Dibuat: " + voucherCode);
    return {
      voucherCode: voucherCode,
      duration: durationMinutes,
      success: true
    };
  } else {
    Logger.log("Ruijie API Error: " + response.getContentText());
    // Fallback ke voucher dari Google Sheet jika API cloud gagal
    return null;
  }
}
`;

export const RUIJIE_GATEWAY_CLI_CONFIG = `# =========================================================================
# KONFIGURASI CAPTIVE PORTAL & VOUCHER RUIJIE REYEE (RG-EG SERIES)
# Router: RG-EG105G-V2, RG-EG210G-E, RG-EG310GH-E, Reyee OS
# Akses: Web UI (http://192.168.110.1) atau Ruijie Cloud Portal
# =========================================================================

# --- LANGKAH 1: KONFIGURASI WEB UI GATEWAY REYEE ---
# 1. Buka Web Admin Gateway Reyee (default: http://192.168.110.1)
# 2. Masuk ke menu: [Flow & Behavior / Security] -> [Auth Management] -> [Captive Portal]
# 3. Klik "Add Portal":
#    - Portal Name: HOTSPOT-QRIS-AUTH
#    - Interface: VLAN Hotspot (misal: VLAN 20 / LAN 2)
#    - Auth Mode: Voucher
#    - Seamless Auth (MAC Re-Auth): ON (Durasi sesuai paket agar pelanggan tidak login ulang)
#    - Escape Period: 2 Menit (Memberi waktu akses gratis bagi pembeli untuk buka e-wallet & bayar QRIS)

# --- LANGKAH 2: FORMAT IMPORT BATCH CSV VOUCHER RUIJIE CLOUD ---
# Anda dapat membuat file .csv berikut dan import langsung ke menu
# [Voucher Management] -> [Import Vouchers] di Ruijie Cloud / Reyee Web:
#
# Kolom CSV Ruijie:
# Voucher,Package Name,Duration,Concurrent Device,Rate Limit Down(Mbps),Rate Limit Up(Mbps)
# RJ29104,Paket-2Jam,120m,1,5,5
# RJ88192,Paket-2Jam,120m,1,5,5
# RJ47201,Paket-1Hari,1440m,1,10,10
# RJ66291,Paket-1Hari,1440m,1,10,10
# RJ99014,Paket-7Hari,10080m,1,15,15
# RJ11048,Paket-30Hari,43200m,1,20,20

# --- LANGKAH 3: FORMAT URL AUTO-LOGIN DIRECT RUIJIE REYEE ---
# Gateway Ruijie mendukung direct parameter login sehingga pembeli tidak perlu ketik manual:
#
# Format URL Captive Portal Ruijie:
# http://192.168.110.1:8888/portal/login?auth_type=voucher&voucher_code={KODE_VOUCHER}
#
# Atau jika menggunakan Ruijie Cloud Portal Hosted:
# http://portal.ruijienetworks.com/login?auth_type=voucher&voucher={KODE_VOUCHER}
`;

