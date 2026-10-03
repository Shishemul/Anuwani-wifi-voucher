import React, { useState } from 'react';
import { 
  AlertTriangle, 
  XCircle, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Trash2, 
  Download, 
  Terminal, 
  Activity, 
  MessageSquare, 
  FileSpreadsheet, 
  Cpu, 
  ShieldAlert,
  Radio,
  ChevronDown,
  ChevronRight,
  Filter
} from 'lucide-react';

export interface SystemErrorLog {
  id: string;
  timestamp: string;
  level: 'CRITICAL' | 'ERROR' | 'WARNING' | 'INFO';
  service: 'WHATSAPP_GATEWAY' | 'GOOGLE_SHEETS_SYNC' | 'LOCK_SERVICE' | 'QRIS_WEBHOOK' | 'ROUTER_API';
  serviceName: string;
  message: string;
  details: Record<string, any>;
  resolved: boolean;
  resolutionNote?: string;
}

export const INITIAL_ERROR_LOGS: SystemErrorLog[] = [
  {
    id: 'err-101',
    timestamp: '2026-10-03 01:45:12',
    level: 'ERROR',
    service: 'WHATSAPP_GATEWAY',
    serviceName: 'Fonnte / Wablas API',
    message: 'HTTP 429 Rate Limit Exceeded: Antrean pengiriman pesan WhatsApp terlalu padat.',
    details: {
      http_status: 429,
      endpoint: 'https://api.fonnte.com/send',
      recipient: '081298765432',
      error_code: 'RATE_LIMIT_HIT',
      retry_after_seconds: 5,
      suggested_action: 'Antrean dialihkan ke Exponential Backoff Retry (Percobaan 1/3).'
    },
    resolved: true,
    resolutionNote: 'Auto-retry berhasil dikirimkan setelah jeda 5 detik.'
  },
  {
    id: 'err-102',
    timestamp: '2026-10-03 01:52:40',
    level: 'WARNING',
    service: 'GOOGLE_SHEETS_SYNC',
    serviceName: 'Google Sheets API',
    message: 'Cell Lock Timeout Warning: Antrean penulisan baris ke sheet TRANSACTIONS memakan waktu 4.8 detik.',
    details: {
      action: 'sheet.appendRow()',
      sheet_name: 'TRANSACTIONS',
      latency_ms: 4820,
      concurrent_requests: 3,
      lock_status: 'ACQUIRED_AFTER_DELAY'
    },
    resolved: true,
    resolutionNote: 'Baris berhasil ditulis tanpa kehilangan data.'
  }
];

interface ErrorLogPanelProps {
  logs: SystemErrorLog[];
  onAddLog: (log: SystemErrorLog) => void;
  onClearLogs: () => void;
  onResolveLog: (id: string, note: string) => void;
  simulateFailureMode: 'NONE' | 'WA_FAIL' | 'SHEETS_FAIL' | 'LOCK_FAIL';
  setSimulateFailureMode: (mode: 'NONE' | 'WA_FAIL' | 'SHEETS_FAIL' | 'LOCK_FAIL') => void;
}

export const ErrorLogPanel: React.FC<ErrorLogPanelProps> = ({
  logs,
  onAddLog,
  onClearLogs,
  onResolveLog,
  simulateFailureMode,
  setSimulateFailureMode,
}) => {
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'CRITICAL' | 'ERROR' | 'WARNING'>('ALL');
  const [filterService, setFilterService] = useState<'ALL' | 'WHATSAPP_GATEWAY' | 'GOOGLE_SHEETS_SYNC'>('ALL');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(logs[0]?.id || null);

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesLevel = filterLevel === 'ALL' || log.level === filterLevel;
    const matchesService = filterService === 'ALL' || log.service === filterService;
    return matchesLevel && matchesService;
  });

  // Inject manual simulated failure
  const handleTriggerSimulatedError = (type: 'WA_GATEWAY' | 'SHEETS_SYNC' | 'STOK_HABIS' | 'SIGNATURE_INVALID') => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const id = `err-${Date.now().toString().slice(-4)}`;

    if (type === 'WA_GATEWAY') {
      onAddLog({
        id,
        timestamp: now,
        level: 'ERROR',
        service: 'WHATSAPP_GATEWAY',
        serviceName: 'Fonnte / WhatsApp Service',
        message: 'ERR_WA_DISCONNECTED: Sesi nomor WhatsApp bisnis terputus atau QR Code logout di server.',
        details: {
          error_code: 'WA_SESSION_UNAUTHORIZED',
          status: 'UNAUTHENTICATED',
          http_code: 401,
          payload: { target: '081324567890', package: 'WIFI-1HARI' },
          recommended_fix: 'Buka dashboard Fonnte/Wablas lalu scan ulang QR WhatsApp bisnis Anda.'
        },
        resolved: false
      });
    } else if (type === 'SHEETS_SYNC') {
      onAddLog({
        id,
        timestamp: now,
        level: 'CRITICAL',
        service: 'GOOGLE_SHEETS_SYNC',
        serviceName: 'Google Drive Apps Script',
        message: 'ERR_SHEETS_QUOTA: Limit panggilan eksekusi Google Apps Script per menit terlampaui.',
        details: {
          error_code: 'APPS_SCRIPT_RATE_LIMIT',
          quota_type: 'Read/Write requests per minute',
          current_rate: '62 calls/min (Max: 60/min)',
          fallback: 'Payload webhook disimpan di antrean memori sementara untuk retry otomatis.'
        },
        resolved: false
      });
    } else if (type === 'STOK_HABIS') {
      onAddLog({
        id,
        timestamp: now,
        level: 'ERROR',
        service: 'ROUTER_API',
        serviceName: 'Voucher Pool Allocator',
        message: 'ERR_OUT_OF_STOCK: Tidak ditemukan voucher berstatus AVAILABLE untuk paket WIFI-1HARI.',
        details: {
          package_code: 'WIFI-1HARI',
          available_in_sheet: 0,
          customer_phone: '081324567890',
          auto_action: 'Notifikasi darurat telah dikirimkan ke WhatsApp Admin Hotspot.'
        },
        resolved: false
      });
    } else if (type === 'SIGNATURE_INVALID') {
      onAddLog({
        id,
        timestamp: now,
        level: 'WARNING',
        service: 'QRIS_WEBHOOK',
        serviceName: 'Security Validator',
        message: 'WARN_SIGNATURE_MISMATCH: Callback QRIS ditolak karena token HMAC-SHA256 tidak valid.',
        details: {
          ip_source: '182.253.11.90 (Untrusted IP)',
          header_signature: '7f9a8b1...',
          calculated_signature: '3e1c9d2...',
          action: 'Request diblokir dengan respon HTTP 403 Forbidden.'
        },
        resolved: true,
        resolutionNote: 'Potensi serangan pemalsuan pembayaran berhasil ditangkal.'
      });
    }
  };

  // Export logs to JSON
  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `system_error_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const criticalCount = logs.filter(l => l.level === 'CRITICAL' && !l.resolved).length;
  const errorCount = logs.filter(l => l.level === 'ERROR' && !l.resolved).length;
  const resolvedCount = logs.filter(l => l.resolved).length;

  return (
    <div className="mt-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full mb-1 border border-rose-500/30">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Diagnostics & Error Monitoring</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Panel Log Kesalahan Sistem (Error Log)
          </h3>
          <p className="text-xs text-slate-400">
            Monitor kegagalan webhook QRIS, error WhatsApp Gateway, timeout Google Sheets, serta simulasi penanganan fail-safe.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 self-start md:self-auto">
          <button
            onClick={handleExportLogs}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Log JSON</span>
          </button>
          <button
            onClick={onClearLogs}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/40 text-xs font-medium transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Bersihkan Log</span>
          </button>
        </div>
      </div>

      {/* Service Health Live Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              WhatsApp Gateway
            </span>
            <span className={`w-2 h-2 rounded-full ${
              simulateFailureMode === 'WA_FAIL' ? 'bg-rose-500 animate-ping' : 'bg-emerald-400 animate-pulse'
            }`}></span>
          </div>
          <div className="text-sm font-bold text-white">
            {simulateFailureMode === 'WA_FAIL' ? '🔴 DISCONNECTED' : '🟢 ONLINE (99.8%)'}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
            {simulateFailureMode === 'WA_FAIL' ? 'Simulasi Error Aktif' : 'Fonnte API Terhubung'}
          </span>
        </div>

        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-green-400" />
              Google Sheets DB
            </span>
            <span className={`w-2 h-2 rounded-full ${
              simulateFailureMode === 'SHEETS_FAIL' ? 'bg-amber-500 animate-ping' : 'bg-emerald-400'
            }`}></span>
          </div>
          <div className="text-sm font-bold text-white">
            {simulateFailureMode === 'SHEETS_FAIL' ? '🟡 TIMEOUT (503)' : '🟢 SEHAT (~135ms)'}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
            LockService: 30s Mutex
          </span>
        </div>

        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Webhook Worker
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-sm font-bold text-cyan-400 font-mono">
            HTTP 200 READY
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            HMAC Validated
          </span>
        </div>

        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              Status Insiden
            </span>
            <span className="text-[10px] font-mono text-slate-400">Total: {logs.length}</span>
          </div>
          <div className="text-sm font-bold font-mono">
            {criticalCount + errorCount > 0 ? (
              <span className="text-rose-400">{criticalCount + errorCount} Perlu Ditangani</span>
            ) : (
              <span className="text-emerald-400">Semua Normal</span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
            {resolvedCount} insiden selesai
          </span>
        </div>
      </div>

      {/* Interactive Failure Injection Simulator (Uji Resiliensi) */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-rose-400" />
              Injeksi Simulasi Kegagalan (Uji Keandalan Sistem):
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Klik salah satu skenario di bawah untuk memicu log error realistis dan mengamati cara sistem menangani gangguan:
            </p>
          </div>

          {/* Active Mode indicator */}
          {simulateFailureMode !== 'NONE' && (
            <div className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2.5 py-1 rounded-lg text-xs font-mono">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Simulasi Gangguan Aktif!</span>
              <button
                onClick={() => setSimulateFailureMode('NONE')}
                className="underline font-bold text-white hover:text-rose-200 ml-1 cursor-pointer"
              >
                Reset Normal
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <button
            onClick={() => {
              handleTriggerSimulatedError('WA_GATEWAY');
              setSimulateFailureMode(simulateFailureMode === 'WA_FAIL' ? 'NONE' : 'WA_FAIL');
            }}
            className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
              simulateFailureMode === 'WA_FAIL'
                ? 'bg-rose-950/60 border-rose-500 text-white shadow'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-rose-400">
              <span>1. WhatsApp Disconnect</span>
              <XCircle className="w-3.5 h-3.5" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-snug">
              Simulasi token WA kedaluwarsa / WhatsApp web bisnis terputus.
            </p>
          </button>

          <button
            onClick={() => {
              handleTriggerSimulatedError('SHEETS_SYNC');
              setSimulateFailureMode(simulateFailureMode === 'SHEETS_FAIL' ? 'NONE' : 'SHEETS_FAIL');
            }}
            className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
              simulateFailureMode === 'SHEETS_FAIL'
                ? 'bg-amber-950/60 border-amber-500 text-white shadow'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-amber-400">
              <span>2. Google Sheets Timeout</span>
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-snug">
              Simulasi limit kuota Google Drive API / cell write delay.
            </p>
          </button>

          <button
            onClick={() => handleTriggerSimulatedError('STOK_HABIS')}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-300 text-left transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
              <span>3. Stok Voucher Habis</span>
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-snug">
              Voucher AVAILABLE kosong di sheet saat QRIS sudah terbayar.
            </p>
          </button>

          <button
            onClick={() => handleTriggerSimulatedError('SIGNATURE_INVALID')}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-300 text-left transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs font-bold text-purple-400">
              <span>4. Webhook Palsu (HMAC)</span>
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-snug">
              Mendeteksi & menolak callback dengan signature yang tidak sah.
            </p>
          </button>
        </div>
      </div>

      {/* Filter and Table of Logs */}
      <div className="space-y-3">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Filter Level:</span>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 cursor-pointer"
            >
              <option value="ALL">Semua Level ({logs.length})</option>
              <option value="CRITICAL">Hanya CRITICAL</option>
              <option value="ERROR">Hanya ERROR</option>
              <option value="WARNING">Hanya WARNING</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Filter Layanan:</span>
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 cursor-pointer"
            >
              <option value="ALL">Semua Layanan</option>
              <option value="WHATSAPP_GATEWAY">WhatsApp Gateway</option>
              <option value="GOOGLE_SHEETS_SYNC">Google Sheets Sync</option>
            </select>
          </div>
        </div>

        {/* Logs List Accordion */}
        <div className="space-y-2.5 max-h-[450px] overflow-y-auto scrollbar-thin">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
              Tidak ada log kesalahan pada filter ini. Sistem beroperasi secara normal.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;

              const levelBadge = 
                log.level === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
                log.level === 'ERROR' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                log.level === 'WARNING' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                'bg-blue-500/20 text-blue-300 border-blue-500/30';

              return (
                <div
                  key={log.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden transition"
                >
                  {/* Summary Bar */}
                  <div
                    onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    className="p-3 flex items-start sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-900/60 transition"
                  >
                    <div className="flex items-start sm:items-center space-x-3">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-0.5 sm:mt-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5 sm:mt-0" />
                      )}

                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${levelBadge}`}>
                        {log.level}
                      </span>

                      <div>
                        <div className="text-xs font-semibold text-white flex items-center gap-2">
                          <span>{log.message}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-slate-400">{log.timestamp}</span>
                          <span>•</span>
                          <span className="text-cyan-400">{log.serviceName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center space-x-2">
                      {log.resolved ? (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          Teratasi
                        </span>
                      ) : (
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                          <AlertCircle className="w-3 h-3 text-rose-400" />
                          Aktif
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="p-4 pt-1 border-t border-slate-800/80 bg-slate-900/40 space-y-3 text-xs">
                      {/* JSON Payload Details */}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Stack Trace & Payload Data:
                        </span>
                        <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-48 scrollbar-thin">
                          <code>{JSON.stringify(log.details, null, 2)}</code>
                        </pre>
                      </div>

                      {/* Resolution note or Action button */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800">
                        {log.resolved ? (
                          <div className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span><strong>Catatan Solusi:</strong> {log.resolutionNote || 'Masalah telah diselesaikan otomatis oleh sistem.'}</span>
                          </div>
                        ) : (
                          <div className="text-[11px] text-rose-400 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>Sistem sedang menunggu tindakan perbaikan atau eksekusi antrean ulang (retry).</span>
                          </div>
                        )}

                        {!log.resolved && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onResolveLog(log.id, 'Berhasil di-retry dan dikirimkan ulang.');
                            }}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Tandai Selesai / Retry Berhasil</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
