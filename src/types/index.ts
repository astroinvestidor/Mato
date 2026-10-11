export type NavigationTab = 
  | 'inicio'
  | 'receber'
  | 'sites'
  | 'produtos'
  | 'clientes'
  | 'vendas'
  | 'links'
  | 'afiliados'
  | 'analytics'
  | 'ia'
  | 'configuracoes';

export type PaymentMethod = 'pix' | 'cartao' | 'boleto';
export type PaymentStatus = 'pago' | 'pendente' | 'expirado' | 'cancelado';

export interface Transaction {
  id: string;
  customerName: string;
  customerInitial: string;
  avatarColor: string;
  method: 'Pix' | 'Cartão' | 'Boleto';
  amount: number;
  date: string;
  status: PaymentStatus;
}

export interface Charge {
  id: string;
  code: string;
  title: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number;
  fee: number;
  netAmount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
  expiresAt: string;
  qrCodeUrl?: string;
  copyPastePix?: string;
  isDemo: boolean;
}

export type SiteType = 'institucional' | 'landing_page' | 'loja_virtual' | 'sistema_web';
export type SiteStatus = 'publicado' | 'rascunho' | 'gerando_ia';

export interface SiteProject {
  id: string;
  name: string;
  type: SiteType;
  description: string;
  status: SiteStatus;
  url?: string;
  views: number;
  conversions: number;
  updatedAt: string;
  template: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: 'ativo' | 'inativo';
  salesCount: number;
  image?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'ativo' | 'inativo';
}

export interface Sale {
  id: string;
  code: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
  itemsSummary: string;
}

export interface PaymentLink {
  id: string;
  title: string;
  slug: string;
  price: number;
  clicks: number;
  salesCount: number;
  totalRevenue: number;
  status: 'ativo' | 'inativo';
  createdAt: string;
}

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  code: string;
  referralsCount: number;
  salesCount: number;
  commissionEarned: number;
  status: 'ativo' | 'pendente';
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedPrompts?: string[];
  actionType?: 'open_charge' | 'open_site' | 'open_sales' | 'marketing_copy';
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatarText: string;
  planName: string;
  aiCreditsTotal: number;
  aiCreditsUsed: number;
}
