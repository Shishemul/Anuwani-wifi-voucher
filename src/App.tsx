/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ArchitectureView } from './components/ArchitectureView';
import { LiveSimulator } from './components/LiveSimulator';
import { GoogleSheetSimulator } from './components/GoogleSheetSimulator';
import { CodeGenerator } from './components/CodeGenerator';
import { DeploymentGuide } from './components/DeploymentGuide';
import { RoiCalculator } from './components/RoiCalculator';
import { 
  TabType, 
  VoucherPackage, 
  VoucherItem, 
  TransactionRecord 
} from './types/blueprint';
import { 
  INITIAL_PACKAGES, 
  INITIAL_VOUCHERS, 
  INITIAL_TRANSACTIONS 
} from './data/blueprintData';
import { 
  CheckCircle2, 
  Wifi, 
  ExternalLink, 
  Layers, 
  PlayCircle, 
  Table, 
  Code2, 
  BookOpen, 
  Calculator 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('blueprint');
  const [packages, setPackages] = useState<VoucherPackage[]>(INITIAL_PACKAGES);
  const [vouchers, setVouchers] = useState<VoucherItem[]>(INITIAL_VOUCHERS);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  
  // Real-time toast state
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  const showToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Callback when a payment succeeds in simulator
  const handleSuccessfulPayment = (newTrx: TransactionRecord, allocatedVoucher: VoucherItem) => {
    // 1. Update Voucher in pool
    setVouchers(prev => prev.map(v => {
      if (v.id === allocatedVoucher.id) {
        return {
          ...v,
          status: 'USED',
          soldAt: newTrx.timestamp,
          customerPhone: newTrx.customerPhone,
          trxId: newTrx.trxId,
        };
      }
      return v;
    }));

    // 2. Prepend Transaction
    setTransactions(prev => [newTrx, ...prev]);

    // 3. Trigger Toast Notification
    showToast(
      'Pembayaran QRIS Diterima!',
      `Voucher ${allocatedVoucher.username} berhasil dikirim ke WhatsApp ${newTrx.customerPhone}. Baris di Google Sheet telah terupdate otomatis.`
    );
  };

  // Add single voucher
  const handleAddVoucher = (newVoucher: VoucherItem) => {
    setVouchers(prev => [newVoucher, ...prev]);
    showToast('Voucher Ditambahkan', `Voucher ${newVoucher.username} (${newVoucher.packageCode}) kini tersedia di pool.`);
  };

  // Batch generate vouchers
  const handleBatchAddVouchers = (packageCode: string, count: number) => {
    const newItems: VoucherItem[] = [];
    const prefix = packageCode.replace('WIFI-', '');
    for (let i = 0; i < count; i++) {
      const rand = Math.floor(10000 + Math.random() * 90000);
      const pass = Math.random().toString(36).substring(2, 8);
      newItems.push({
        id: `v-${Date.now()}-${i}`,
        packageCode: packageCode,
        username: `${prefix}-${rand}`,
        password: pass,
        status: 'AVAILABLE'
      });
    }
    setVouchers(prev => [...newItems, ...prev]);
    showToast('Batch Voucher Dibuat', `${count} voucher paket ${packageCode} berhasil dimasukkan ke Google Sheet.`);
  };

  const handleResetSimulator = () => {
    setVouchers(INITIAL_VOUCHERS);
    setTransactions(INITIAL_TRANSACTIONS);
    showToast('Sistem Direset', 'Data voucher dan log transaksi kembali ke kondisi awal.');
  };

  const availableVoucherCount = vouchers.filter(v => v.status === 'AVAILABLE').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        availableVoucherCount={availableVoucherCount}
        totalTransactionsCount={transactions.length}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'blueprint' && (
          <ArchitectureView />
        )}

        {activeTab === 'simulator' && (
          <LiveSimulator
            packages={packages}
            vouchers={vouchers}
            transactions={transactions}
            onSuccessfulPayment={handleSuccessfulPayment}
            onResetSimulator={handleResetSimulator}
          />
        )}

        {activeTab === 'googlesheet' && (
          <GoogleSheetSimulator
            vouchers={vouchers}
            transactions={transactions}
            packages={packages}
            onAddVoucher={handleAddVoucher}
            onBatchAddVouchers={handleBatchAddVouchers}
          />
        )}

        {activeTab === 'code_gas' && (
          <CodeGenerator />
        )}

        {activeTab === 'deployment' && (
          <DeploymentGuide />
        )}

        {activeTab === 'calculator' && (
          <RoiCalculator />
        )}
      </main>

      {/* Real-time Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 border border-emerald-500/50 rounded-xl p-4 shadow-2xl shadow-emerald-950/50 text-xs flex items-start space-x-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-bold text-white text-xs">{toastMessage.title}</h4>
            <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">{toastMessage.desc}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-slate-300 font-semibold">
              WiFi Voucher Automation Blueprint
            </span>
            <span>•</span>
            <span className="text-slate-400">WhatsApp + QRIS + Google Sheets + Apps Script</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span className="text-slate-400">Arsitektur: Serverless Event-Driven</span>
            <span className="text-slate-400">|</span>
            <span className="text-emerald-400 font-mono">Status: Ready to Deploy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
