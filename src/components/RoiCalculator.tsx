import React, { useState } from 'react';
import { 
  Calculator, 
  Coins, 
  TrendingUp, 
  ArrowUpRight, 
  PiggyBank, 
  Wifi, 
  ShieldCheck,
  Percent,
  CheckCircle2
} from 'lucide-react';

export const RoiCalculator: React.FC = () => {
  // Input parameters
  const [dailyUsers, setDailyUsers] = useState<number>(35);
  const [avgVoucherPrice, setAvgVoucherPrice] = useState<number>(4500); // Rata-rata Rp 4.500
  const [ispMonthlyCost, setIspMonthlyCost] = useState<number>(350000); // Biaya langganan Indihome / Biznet dll
  const [waGatewayCost, setWaGatewayCost] = useState<number>(45000); // Biaya Fonnte / Bln
  const [qrisMdrRate, setQrisMdrRate] = useState<number>(0.7); // 0.7% MDR QRIS Standar BI

  // Calculations
  const monthlyTransactions = dailyUsers * 30;
  const grossMonthlyRevenue = monthlyTransactions * avgVoucherPrice;
  const qrisFeeMonthly = (grossMonthlyRevenue * qrisMdrRate) / 100;
  const totalOperatingExpense = ispMonthlyCost + waGatewayCost + qrisFeeMonthly;
  const netMonthlyProfit = grossMonthlyRevenue - totalOperatingExpense;
  const annualNetProfit = netMonthlyProfit * 12;
  const profitMargin = grossMonthlyRevenue > 0 ? (netMonthlyProfit / grossMonthlyRevenue) * 100 : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full mb-1 border border-indigo-500/30">
          <Calculator className="w-3.5 h-3.5" />
          <span>Financial Feasibility & Profit Simulator</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Kalkulator Omset & Keuntungan Bersih (RT/RW Net & Warkop)
        </h2>
        <p className="text-xs text-slate-400">
          Hitung estimasi pendapatan kotor, potongan QRIS (0.7%), biaya internet, dan profit bersih bulanan bisnis hotspot Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Coins className="w-4 h-4 text-emerald-400" />
            Parameter Operasional
          </h3>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-300 font-medium">Target Pembeli Voucher per Hari</label>
                <span className="font-bold text-emerald-400 font-mono">{dailyUsers} orang/hari</span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                step="5"
                value={dailyUsers}
                onChange={(e) => setDailyUsers(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>5 (Warkop kecil)</span>
                <span>100 (RT/RW padat)</span>
                <span>250 (Pusat keramaian)</span>
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Rata-rata Harga Voucher yang Terjual</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">Rp</span>
                <input
                  type="number"
                  step="500"
                  value={avgVoucherPrice}
                  onChange={(e) => setAvgVoucherPrice(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white font-mono"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Biasanya kombinasi antara paket Rp 2.000, Rp 5.000, dan Rp 20.000
              </span>
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Biaya Langganan Internet (ISP Bulanan)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">Rp</span>
                <input
                  type="number"
                  step="50000"
                  value={ispMonthlyCost}
                  onChange={(e) => setIspMonthlyCost(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white font-mono"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Biaya IndiHome / Biznet / MyRepublic 50-100 Mbps
              </span>
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Langganan WhatsApp Gateway Bulanan</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">Rp</span>
                <input
                  type="number"
                  step="5000"
                  value={waGatewayCost}
                  onChange={(e) => setWaGatewayCost(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white font-mono"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Biaya paket bulanan Fonnte / Wablas (Rp 35.000 - Rp 50.000)
              </span>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-300 font-medium">MDR Fee QRIS Nasional</label>
                <span className="font-bold text-amber-400 font-mono">{qrisMdrRate}%</span>
              </div>
              <span className="text-[10px] text-slate-400">
                Sesuai ketetapan Bank Indonesia kategori Usaha Mikro (0.7%).
              </span>
            </div>
          </div>
        </div>

        {/* Financial Results (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Profit Card */}
          <div className="bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-2xl p-6 relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <PiggyBank className="w-4 h-4" />
                Estimasi Laba Bersih Bulanan (Net Profit)
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                Margin: {profitMargin.toFixed(1)}%
              </span>
            </div>

            <div className="mt-3">
              <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                Rp {netMonthlyProfit.toLocaleString('id-ID')}
              </span>
              <span className="text-xs text-slate-400 block mt-1">
                Atau sekitar <strong>Rp {annualNetProfit.toLocaleString('id-ID')}</strong> per tahun (passive income 24/7)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-emerald-500/20 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Total Transaksi / Bulan:</span>
                <span className="text-base font-bold text-slate-200 font-mono">{monthlyTransactions} transaksi</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Pendapatan Kotor (Gross):</span>
                <span className="text-base font-bold text-cyan-400 font-mono">Rp {grossMonthlyRevenue.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Cost Breakdown Details */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Rincian Biaya & Pengeluaran Operasional (OPEX)
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Biaya Internet ISP Bulanan</span>
                <span className="font-mono font-bold text-rose-400">- Rp {ispMonthlyCost.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300">WhatsApp Gateway (Notif & Bot)</span>
                <span className="font-mono font-bold text-rose-400">- Rp {waGatewayCost.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300">MDR Fee QRIS Bank (0.7%)</span>
                <span className="font-mono font-bold text-amber-400">- Rp {Math.round(qrisFeeMonthly).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Biaya Server & Database Google</span>
                <span className="font-mono font-bold text-emerald-400">Rp 0 (GRATIS)</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Biaya Operasional:</span>
              <span className="font-mono font-bold text-white text-sm">
                Rp {Math.round(totalOperatingExpense).toLocaleString('id-ID')} / bulan
              </span>
            </div>
          </div>

          {/* Investment Insight */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-cyan-300 block mb-1">💡 Tips Maksimalisasi Omset:</span>
            Dengan sistem otomatis WhatsApp + QRIS ini, Anda menghemat gaji 1 karyawan kasir (sekitar Rp 1.500.000 - Rp 2.500.000/bln) dan tidak pernah kehilangan pelanggan yang ingin membeli voucher di tengah malam atau subuh.
          </div>
        </div>
      </div>
    </div>
  );
};
