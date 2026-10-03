export type VoucherPackage = {
  id: string;
  name: string;
  code: string;
  price: number;
  duration: string;
  durationHours: number;
  speed: string;
  description: string;
  popular?: boolean;
};

export type VoucherItem = {
  id: string;
  packageCode: string;
  username: string;
  password: string;
  status: 'AVAILABLE' | 'RESERVED' | 'USED';
  soldAt?: string;
  customerPhone?: string;
  trxId?: string;
};

export type TransactionRecord = {
  trxId: string;
  timestamp: string;
  customerPhone: string;
  customerName: string;
  packageCode: string;
  packageName: string;
  amount: number;
  paymentMethod: 'QRIS_DYNAMIC' | 'QRIS_STATIS';
  paymentProvider: 'MIDTRANS' | 'TRIPAY' | 'XENDIT';
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
  qrisString: string;
  voucherCode?: string;
  voucherPassword?: string;
  waStatus: 'PENDING' | 'SENT' | 'FAILED';
  paymentRef: string;
};

export type ArchitectureStep = {
  step: number;
  id: string;
  title: string;
  actor: string;
  target: string;
  direction: string;
  description: string;
  payloadExample: Record<string, any>;
  statusColor: string;
};

export type TabType = 
  | 'blueprint'
  | 'simulator'
  | 'googlesheet'
  | 'code_gas'
  | 'deployment'
  | 'calculator';
