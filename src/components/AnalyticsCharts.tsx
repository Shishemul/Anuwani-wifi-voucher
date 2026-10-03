import React, { useMemo, useState } from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieIcon, 
  Calendar, 
  Coins, 
  Zap, 
  ShoppingBag,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { TransactionRecord, VoucherPackage } from '../types/blueprint';

interface AnalyticsChartsProps {
  transactions: TransactionRecord[];
  packages: VoucherPackage[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  transactions,
  packages,
}) => {
  const [chartMode, setChartMode] = useState<'both' | 'revenue' | 'packages'>('both');

  // Compute live data for Daily Revenue (past 7 days including today's dynamic transactions)
  const dailyRevenueData = useMemo(() => {
    // Generate dates for the last 7 days
    const days: { [key: string]: { dateStr: string; label: string; revenue: number; orders: number } } = {};
    
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
      
      // Base historical baseline data so chart isn't empty
      const baseRev = i === 6 ? 68000 : i === 5 ? 85000 : i === 4 ? 92000 : i === 3 ? 120000 : i === 2 ? 145000 : i === 1 ? 110000 : 75000;
      const baseOrders = Math.floor(baseRev / 4500);

      days[dateStr] = {
        dateStr,
        label: dayName,
        revenue: baseRev,
        orders: baseOrders,
      };
    }

    // Accumulate real completed transactions into today / respective date
    const todayStr = today.toISOString().split('T')[0];
    transactions.forEach(t => {
      if (t.status === 'PAID') {
        const trxDate = t.timestamp.split(' ')[0] || todayStr;
        if (days[trxDate]) {
          days[trxDate].revenue += t.amount;
          days[trxDate].orders += 1;
        } else if (days[todayStr]) {
          // If transaction has another date, add to today
          days[todayStr].revenue += t.amount;
          days[todayStr].orders += 1;
        }
      }
    });

    return Object.values(days);
  }, [transactions]);

  // Compute Package Sales Breakdown (Count and Total Revenue per Package)
  const packageSalesData = useMemo(() => {
    // Baseline simulated distribution
    const baselineMap: Record<string, { count: number; revenue: number }> = {
      'WIFI-2JAM': { count: 32, revenue: 64000 },
      'WIFI-1HARI': { count: 54, revenue: 270000 },
      'WIFI-7HARI': { count: 18, revenue: 360000 },
      'WIFI-30HARI': { count: 6, revenue: 300000 },
    };

    // Add current session transactions
    transactions.forEach(t => {
      if (t.status === 'PAID') {
        if (!baselineMap[t.packageCode]) {
          baselineMap[t.packageCode] = { count: 0, revenue: 0 };
        }
        baselineMap[t.packageCode].count += 1;
        baselineMap[t.packageCode].revenue += t.amount;
      }
    });

    return packages.map((pkg, idx) => {
      const stats = baselineMap[pkg.code] || { count: 0, revenue: 0 };
      const colors = ['#38bdf8', '#10b981', '#f59e0b', '#8b5cf6'];
      return {
        name: pkg.name,
        code: pkg.code,
        shortName: pkg.name.replace('Paket ', ''),
        count: stats.count,
        revenue: stats.revenue,
        color: colors[idx % colors.length],
      };
    });
  }, [transactions, packages]);

  // Aggregate stats
  const totalRevenue = useMemo(() => {
    return dailyRevenueData.reduce((acc, curr) => acc + curr.revenue, 0);
  }, [dailyRevenueData]);

  const totalOrders = useMemo(() => {
    return dailyRevenueData.reduce((acc, curr) => acc + curr.orders, 0);
  }, [dailyRevenueData]);

  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const topPackage = useMemo(() => {
    return [...packageSalesData].sort((a, b) => b.count - a.count)[0];
  }, [packageSalesData]);

  // Custom Tooltip for Daily Revenue
  const CustomRevenueTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs font-mono">
          <p className="font-bold text-white mb-1.5 flex items-center gap-1.5 font-sans">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            {label}
          </p>
          <div className="space-y-1 text-[11px]">
            <p className="text-emerald-400 font-bold">
              Pendapatan: Rp {payload[0]?.value?.toLocaleString('id-ID')}
            </p>
            {payload[1] && (
              <p className="text-cyan-400">
                Jumlah Transaksi: {payload[1]?.value} voucher
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Package Sales
  const CustomPackageTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs font-mono">
          <p className="font-bold text-white mb-1 font-sans">{data.name}</p>
          <p className="text-emerald-400 font-bold">
            Total Terjual: {data.count} voucher
          </p>
          <p className="text-cyan-400">
            Total Omset: Rp {data.revenue?.toLocaleString('id-ID')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full mb-1 border border-emerald-500/30">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Live Data Analytics Engine</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Visualisasi Data Pendapatan & Tren Penjualan Voucher
          </h3>
          <p className="text-xs text-slate-400">
            Grafik real-time yang terhubung langsung dengan simulasi transaksi QRIS dan alokasi database Google Sheets.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setChartMode('both')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              chartMode === 'both' ? 'bg-slate-800 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Semua Grafik</span>
          </button>
          <button
            onClick={() => setChartMode('revenue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              chartMode === 'revenue' ? 'bg-emerald-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Pendapatan Harian</span>
          </button>
          <button
            onClick={() => setChartMode('packages')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              chartMode === 'packages' ? 'bg-cyan-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Tren Paket</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Omset 7 Hari Terakhir</span>
            <Coins className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-emerald-400 font-mono">
            Rp {totalRevenue.toLocaleString('id-ID')}
          </div>
          <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
            <ArrowUpRight className="w-3 h-3 text-emerald-400 inline" /> +14.2% minggu ini
          </span>
        </div>

        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Total Voucher Terjual</span>
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono">
            {totalOrders} <span className="text-xs font-normal text-slate-400">voucher</span>
          </div>
          <span className="text-[10px] text-cyan-400 mt-0.5 block">
            QRIS otomatis 24 jam
          </span>
        </div>

        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Rata-rata Order (AOV)</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-amber-300 font-mono">
            Rp {avgOrderValue.toLocaleString('id-ID')}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Per transaksi berhasil
          </span>
        </div>

        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Paket Terfavorit</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-sm font-bold text-white truncate mt-1">
            {topPackage?.name || 'Paket 1 Hari'}
          </div>
          <span className="text-[10px] text-purple-400 mt-0.5 block font-mono">
            {topPackage?.count || 0}x dibeli pelanggan
          </span>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Daily Revenue Trend (Area Chart) */}
        {(chartMode === 'both' || chartMode === 'revenue') && (
          <div className={`${chartMode === 'both' ? 'lg:col-span-7' : 'lg:col-span-12'} bg-slate-950/80 border border-slate-800 rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Grafik Pendapatan Harian (Daily Revenue)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Tren akumulasi nominal penjualan voucher QRIS per hari
                </p>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                Live Dynamic Feed
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyRevenueData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                  <XAxis 
                    dataKey="label" 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    tickLine={false} 
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    tickLine={false} 
                    tickFormatter={(val) => `Rp${(val / 1000).toFixed(0)}k`} 
                  />
                  <Tooltip content={<CustomRevenueTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Pendapatan (Rp)" 
                    stroke="#10b981" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#revenueGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 2: Voucher Package Sales Trends & Breakdown (Bar & Donut) */}
        {(chartMode === 'both' || chartMode === 'packages') && (
          <div className={`${chartMode === 'both' ? 'lg:col-span-5' : 'lg:col-span-12'} bg-slate-950/80 border border-slate-800 rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  Tren Penjualan Paket Voucher
                </h4>
                <p className="text-[11px] text-slate-400">
                  Volume penjualan berdasarkan kategori durasi paket
                </p>
              </div>
              <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded">
                Volume & Distribusi
              </span>
            </div>

            {/* Split layout: Bar Chart & Donut Distribution */}
            <div className="grid grid-cols-1 gap-4">
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={packageSalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                    <XAxis 
                      dataKey="shortName" 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      tickLine={false} 
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      tickLine={false} 
                    />
                    <Tooltip content={<CustomPackageTooltip />} />
                    <Bar 
                      dataKey="count" 
                      name="Jumlah Voucher Terjual" 
                      radius={[6, 6, 0, 0]}
                    >
                      {packageSalesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Package Percentage Tags */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                {packageSalesData.map((pkg) => (
                  <div key={pkg.code} className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: pkg.color }}></span>
                      <span className="text-slate-300 font-medium truncate">{pkg.shortName}</span>
                    </div>
                    <span className="font-mono font-bold text-white shrink-0 ml-1">{pkg.count} pcs</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
