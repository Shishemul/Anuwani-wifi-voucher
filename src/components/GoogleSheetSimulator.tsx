import React, { useState } from 'react';
import { 
  Table, 
  Search, 
  Plus, 
  Download, 
  CheckCircle2, 
  Clock, 
  FileSpreadsheet, 
  Settings, 
  Layers, 
  CreditCard,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';
import { VoucherItem, TransactionRecord, VoucherPackage } from '../types/blueprint';

interface GoogleSheetSimulatorProps {
  vouchers: VoucherItem[];
  transactions: TransactionRecord[];
  packages: VoucherPackage[];
  onAddVoucher: (newVoucher: VoucherItem) => void;
  onBatchAddVouchers: (packageCode: string, count: number) => void;
}

export const GoogleSheetSimulator: React.FC<GoogleSheetSimulatorProps> = ({
  vouchers,
  transactions,
  packages,
  onAddVoucher,
  onBatchAddVouchers,
}) => {
  const [activeSheetTab, setActiveSheetTab] = useState<'VOUCHERS' | 'TRANSACTIONS' | 'PACKAGES' | 'SETTINGS'>('VOUCHERS');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'USED'>('ALL');
  
  // Modal State for Adding Vouchers
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPkgCode, setNewPkgCode] = useState('WIFI-1HARI');
  const [newBatchCount, setNewBatchCount] = useState(5);
  const [singleUsername, setSingleUsername] = useState('');
  const [singlePassword, setSinglePassword] = useState('');
  const [addMode, setAddMode] = useState<'batch' | 'single'>('batch');

  // Filtered Vouchers
  const filteredVouchers = vouchers.filter(v => {
    const matchesSearch = 
      v.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.packageCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.customerPhone && v.customerPhone.includes(searchQuery)) ||
      (v.trxId && v.trxId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Export CSV
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (activeSheetTab === 'VOUCHERS') {
      csvContent += "ID,Package Code,Username,Password,Status,Sold At,Customer Phone,Trx ID\n";
      vouchers.forEach(v => {
        csvContent += `${v.id},${v.packageCode},${v.username},${v.password},${v.status},${v.soldAt || ''},${v.customerPhone || ''},${v.trxId || ''}\n`;
      });
    } else if (activeSheetTab === 'TRANSACTIONS') {
      csvContent += "Trx ID,Timestamp,Phone,Customer Name,Package,Amount,Status,Voucher Code,WA Status,Payment Ref\n";
      transactions.forEach(t => {
        csvContent += `${t.trxId},${t.timestamp},${t.customerPhone},${t.customerName},${t.packageCode},${t.amount},${t.status},${t.voucherCode || ''},${t.waStatus},${t.paymentRef}\n`;
      });
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `google_sheet_${activeSheetTab.toLowerCase()}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addMode === 'batch') {
      onBatchAddVouchers(newPkgCode, newBatchCount);
    } else {
      if (!singleUsername.trim()) return;
      onAddVoucher({
        id: `v-${Date.now().toString().slice(-4)}`,
        packageCode: newPkgCode,
        username: singleUsername.trim(),
        password: singlePassword.trim() || '123456',
        status: 'AVAILABLE'
      });
      setSingleUsername('');
      setSinglePassword('');
    }
    setShowAddModal(false);
  };

  const availableTotal = vouchers.filter(v => v.status === 'AVAILABLE').length;
  const usedTotal = vouchers.filter(v => v.status === 'USED').length;
  const totalRevenue = transactions.filter(t => t.status === 'PAID').reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-400 bg-green-500/10 px-2.5 py-0.5 rounded-full mb-1 border border-green-500/30">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Google Spreadsheet Live Replica</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Database Penjualan: Google Sheets
          </h2>
          <p className="text-xs text-slate-400">
            Replika tabel live Google Spreadsheet yang terhubung langsung dengan Google Apps Script & WhatsApp Webhook.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah Stok Voucher</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-400 font-medium block">Total Voucher di Pool</span>
          <span className="text-lg font-bold text-white font-mono">{vouchers.length}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Semua profil paket</span>
        </div>
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-400 font-medium block">Voucher Siap Terjual (Ready)</span>
          <span className="text-lg font-bold text-emerald-400 font-mono">{availableTotal}</span>
          <span className="text-[10px] text-emerald-400/80 block mt-0.5">Status: AVAILABLE</span>
        </div>
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-400 font-medium block">Voucher Terjual (Used)</span>
          <span className="text-lg font-bold text-cyan-400 font-mono">{usedTotal}</span>
          <span className="text-[10px] text-cyan-400/80 block mt-0.5">Status: USED</span>
        </div>
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-400 font-medium block">Total Omset QRIS</span>
          <span className="text-lg font-bold text-green-400 font-mono">Rp {totalRevenue.toLocaleString('id-ID')}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{transactions.length} transaksi</span>
        </div>
      </div>

      {/* Google Sheets Window Container */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Spreadsheet Green Bar */}
        <div className="bg-[#107c41] px-4 py-2.5 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2.5">
            <FileSpreadsheet className="w-5 h-5 text-white" />
            <span className="text-xs font-bold tracking-wide">
              DATABASE_WIFI_VOUCHERS_2026.xlsx
            </span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white/90">
              Sinkronisasi Otomatis Apps Script
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-100 hidden sm:inline">
            Status: Read/Write Active
          </span>
        </div>

        {/* Toolbar & Search Bar */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Sheet Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveSheetTab('VOUCHERS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeSheetTab === 'VOUCHERS'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>VOUCHERS</span>
              <span className="text-[10px] bg-slate-900 px-1.5 py-0.2 rounded text-slate-400">
                {vouchers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSheetTab('TRANSACTIONS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeSheetTab === 'TRANSACTIONS'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
              <span>TRANSACTIONS</span>
              <span className="text-[10px] bg-slate-900 px-1.5 py-0.2 rounded text-slate-400">
                {transactions.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSheetTab('PACKAGES')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeSheetTab === 'PACKAGES'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Table className="w-3.5 h-3.5 text-amber-400" />
              <span>PACKAGES</span>
            </button>

            <button
              onClick={() => setActiveSheetTab('SETTINGS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeSheetTab === 'SETTINGS'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-purple-400" />
              <span>SETTINGS</span>
            </button>
          </div>

          {/* Filter & Search */}
          {activeSheetTab === 'VOUCHERS' && (
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari username / nomor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg pl-8 pr-3 py-1 w-44 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded-lg px-2.5 py-1 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="ALL">Semua Status</option>
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="USED">USED</option>
              </select>
            </div>
          )}
        </div>

        {/* Sheet Content Table */}
        <div className="overflow-x-auto max-h-[500px] scrollbar-thin">
          {activeSheetTab === 'VOUCHERS' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                  <th className="py-2.5 px-3 w-12 text-center border-r border-slate-800">#</th>
                  <th className="py-2.5 px-3 border-r border-slate-800">KOLOM A: ID</th>
                  <th className="py-2.5 px-3 border-r border-slate-800">KOLOM B: PAKET</th>
                  <th className="py-2.5 px-3 border-r border-slate-800">KOLOM C: USERNAME</th>
                  <th className="py-2.5 px-3 border-r border-slate-800">KOLOM D: PASSWORD</th>
                  <th className="py-2.5 px-3 border-r border-slate-800">KOLOM E: STATUS</th>
                  <th className="py-2.5 px-3 border-r border-slate-800">KOLOM F: TANGGAL TERJUAL</th>
                  <th className="py-2.5 px-3 border-r border-slate-800">KOLOM G: NO. WA PEMBELI</th>
                  <th className="py-2.5 px-3">KOLOM H: TRX REF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredVouchers.map((v, index) => {
                  const isAvailable = v.status === 'AVAILABLE';

                  return (
                    <tr 
                      key={v.id} 
                      className={`hover:bg-slate-900/50 transition ${
                        !isAvailable ? 'bg-slate-900/20' : ''
                      }`}
                    >
                      <td className="py-2 px-3 text-center text-slate-400 border-r border-slate-800/80 bg-slate-950/40">
                        {index + 2}
                      </td>
                      <td className="py-2 px-3 text-slate-400 border-r border-slate-800/80">
                        {v.id}
                      </td>
                      <td className="py-2 px-3 font-semibold text-slate-200 border-r border-slate-800/80">
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800 text-[10px]">
                          {v.packageCode}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-bold text-white border-r border-slate-800/80">
                        {v.username}
                      </td>
                      <td className="py-2 px-3 text-slate-400 border-r border-slate-800/80">
                        {v.password}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-800/80">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isAvailable
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {isAvailable ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Clock className="w-3 h-3 text-slate-400" />}
                          {v.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-400 border-r border-slate-800/80">
                        {v.soldAt || '-'}
                      </td>
                      <td className="py-2 px-3 text-emerald-400 border-r border-slate-800/80">
                        {v.customerPhone || '-'}
                      </td>
                      <td className="py-2 px-3 text-slate-400">
                        {v.trxId || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {activeSheetTab === 'TRANSACTIONS' && (
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 text-[11px]">
                  <th className="py-2.5 px-3 border-r border-slate-800">TRX ID</th>
                  <th className="py-2.5 px-3 border-r border-slate-800">TIMESTAMP</th>
                  <th className="py-2.5 px-3 border-r border-slate-800">NO. WHATSAPP</th>
                  <th className="py-2.5 px-3 border-r border-slate-800">NAMA PELANGGAN</th>
                  <th className="py-2.5 px-3 border-r border-slate-800">PAKET</th>
                  <th className="py-2.5 px-3 border-r border-slate-800">NOMINAL</th>
                  <th className="py-2.5 px-3 border-r border-slate-800">STATUS BAYAR</th>
                  <th className="py-2.5 px-3 border-r border-slate-800">VOUCHER USER</th>
                  <th className="py-2.5 px-3 border-r border-slate-800">STATUS WA</th>
                  <th className="py-2.5 px-3">REF GATEWAY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {transactions.map((trx) => (
                  <tr key={trx.trxId} className="hover:bg-slate-900/50">
                    <td className="py-2 px-3 font-bold text-white border-r border-slate-800/80">{trx.trxId}</td>
                    <td className="py-2 px-3 text-slate-400 border-r border-slate-800/80">{trx.timestamp}</td>
                    <td className="py-2 px-3 text-emerald-400 border-r border-slate-800/80">{trx.customerPhone}</td>
                    <td className="py-2 px-3 text-slate-200 border-r border-slate-800/80">{trx.customerName}</td>
                    <td className="py-2 px-3 text-cyan-300 border-r border-slate-800/80">{trx.packageCode}</td>
                    <td className="py-2 px-3 font-bold text-green-400 border-r border-slate-800/80">
                      Rp {trx.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2 px-3 border-r border-slate-800/80">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                        {trx.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono font-bold text-white border-r border-slate-800/80">{trx.voucherCode}</td>
                    <td className="py-2 px-3 border-r border-slate-800/80">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                        {trx.waStatus}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-400">{trx.paymentRef}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheetTab === 'PACKAGES' && (
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 text-[11px]">
                  <th className="py-2.5 px-3 border-r border-slate-800">KODE PAKET</th>
                  <th className="py-2.5 px-3 border-r border-slate-800">NAMA PAKET</th>
                  <th className="py-2.5 px-3 border-r border-slate-800">HARGA</th>
                  <th className="py-2.5 px-3 border-r border-slate-800">DURASI</th>
                  <th className="py-2.5 px-3 border-r border-slate-800">LIMIT SPEED</th>
                  <th className="py-2.5 px-3">STATUS KATALOG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-900/50">
                    <td className="py-2.5 px-3 font-bold text-cyan-400 border-r border-slate-800/80">{pkg.code}</td>
                    <td className="py-2.5 px-3 text-white border-r border-slate-800/80">{pkg.name}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-400 border-r border-slate-800/80">
                      Rp {pkg.price.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 border-r border-slate-800/80">{pkg.duration}</td>
                    <td className="py-2.5 px-3 text-slate-400 border-r border-slate-800/80">{pkg.speed}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        AKTIF DI WA BOT
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheetTab === 'SETTINGS' && (
            <div className="p-4 space-y-3 font-mono text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">CONFIG: WA_GATEWAY_PROVIDER</span>
                  <span className="text-sm font-bold text-white">Fonnte / Wablas API</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Endpoint: https://api.fonnte.com/send</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">CONFIG: PAYMENT_QRIS_PROVIDER</span>
                  <span className="text-sm font-bold text-white">Tripay / Midtrans QRIS Dynamic</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Fee MDR: 0.7% Standar Bank Indonesia</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">CONFIG: HOTSPOT_LOGIN_URL</span>
                  <span className="text-sm font-bold text-emerald-400">http://wifi.hotspot/login</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Format: ?username={'{user}'}&password={'{pass}'}</span>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">CONFIG: LOCKSERVICE_TIMEOUT</span>
                  <span className="text-sm font-bold text-amber-400">30.000 ms (30 Detik)</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Mencegah bentrok race condition antar pembeli</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Add Voucher */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              Tambah Stok Voucher ke Database
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Masukkan stok voucher dari Mikrotik RouterOS ke spreadsheet.
            </p>

            {/* Mode switch */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl mb-4 text-xs font-medium">
              <button
                type="button"
                onClick={() => setAddMode('batch')}
                className={`py-1.5 rounded-lg transition ${
                  addMode === 'batch' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
                }`}
              >
                Auto Generate Batch
              </button>
              <button
                type="button"
                onClick={() => setAddMode('single')}
                className={`py-1.5 rounded-lg transition ${
                  addMode === 'single' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
                }`}
              >
                Input Manual 1 Voucher
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Pilih Profil / Paket</label>
                <select
                  value={newPkgCode}
                  onChange={(e) => setNewPkgCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  {packages.map(p => (
                    <option key={p.id} value={p.code}>{p.name} ({p.code})</option>
                  ))}
                </select>
              </div>

              {addMode === 'batch' ? (
                <div>
                  <label className="text-slate-400 block mb-1">Jumlah Voucher yang Ingin Dibuat</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newBatchCount}
                    onChange={(e) => setNewBatchCount(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Sistem akan membuat kode acak seperti 1H-84721 & password unik.
                  </span>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-slate-400 block mb-1">Username Voucher</label>
                    <input
                      type="text"
                      placeholder="Contoh: 1H-77889"
                      value={singleUsername}
                      onChange={(e) => setSingleUsername(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Password</label>
                    <input
                      type="text"
                      placeholder="Contoh: pass123"
                      value={singlePassword}
                      onChange={(e) => setSinglePassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                      required
                    />
                  </div>
                </>
              )}

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30"
                >
                  Simpan ke Google Sheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
