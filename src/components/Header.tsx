import React from 'react';
import { 
  Wifi, 
  Layers, 
  PlayCircle, 
  Table, 
  Code2, 
  BookOpen, 
  Calculator,
  Sparkles,
  QrCode,
  MessageSquare
} from 'lucide-react';
import { TabType } from '../types/blueprint';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  availableVoucherCount: number;
  totalTransactionsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  availableVoucherCount,
  totalTransactionsCount,
}) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'blueprint', label: 'Arsitektur & Alur', icon: <Layers className="w-4 h-4" /> },
    { id: 'simulator', label: 'Simulasi Transaksi Live', icon: <PlayCircle className="w-4 h-4 text-emerald-400" />, badge: 'Interaktif' },
    { id: 'googlesheet', label: 'Google Sheets DB', icon: <Table className="w-4 h-4 text-green-400" />, badge: `${availableVoucherCount} Ready` },
    { id: 'code_gas', label: 'Script Siap Pakai (GAS)', icon: <Code2 className="w-4 h-4 text-cyan-400" /> },
    { id: 'deployment', label: 'Panduan Deployment', icon: <BookOpen className="w-4 h-4 text-amber-400" /> },
    { id: 'calculator', label: 'Kalkulator Omset RT/RW', icon: <Calculator className="w-4 h-4 text-indigo-400" /> },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      {/* Top Banner with Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/40">
            <Wifi className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/40 tracking-wide">
                Anuwani
              </span>
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                WiFi Voucher Automation <span className="text-emerald-400">Blueprint</span>
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" /> Production-Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 text-slate-300">
                <MessageSquare className="w-3 h-3 text-emerald-400" /> WhatsApp
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <QrCode className="w-3 h-3 text-cyan-400" /> QRIS Dynamic
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Table className="w-3 h-3 text-green-400" /> Google Sheets
              </span>
              <span>•</span>
              <span className="text-emerald-300 font-medium">Anuwani</span>
              <span>•</span>
              <span className="text-slate-400">Mikrotik & Ruijie Reyee</span>
            </p>
          </div>
        </div>

        {/* Live system indicators */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center space-x-2 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400">Stok Voucher:</span>
            <span className="font-semibold text-emerald-300">{availableVoucherCount} Siap Pakai</span>
          </div>

          <div className="hidden sm:flex bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 items-center space-x-2 shadow-inner">
            <span className="text-slate-400">Total Trx:</span>
            <span className="font-semibold text-slate-200">{totalTransactionsCount} Selesai</span>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
