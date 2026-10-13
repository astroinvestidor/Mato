import {
  Transaction,
  Charge,
  SiteProject,
  Product,
  Customer,
  Sale,
  PaymentLink,
  Affiliate,
  UserProfile,
} from '../types';

export const initialUserProfile: UserProfile = {
  name: 'Administrador',
  email: 'contato@mato.app.br',
  role: 'Administrador',
  avatarText: 'M',
  planName: 'Plano Gratuito',
  aiCreditsTotal: 50,
  aiCreditsUsed: 0,
};

export const initialTransactions: Transaction[] = [];

export const revenueDataPoints = [
  { date: '02/05', value: 0, label: 'R$ 0,00' },
  { date: '03/05', value: 0, label: 'R$ 0,00' },
  { date: '04/05', value: 0, label: 'R$ 0,00' },
  { date: '05/05', value: 0, label: 'R$ 0,00' },
  { date: '06/05', value: 0, label: 'R$ 0,00', isHighlight: true },
  { date: '07/05', value: 0, label: 'R$ 0,00' },
  { date: '08/05', value: 0, label: 'R$ 0,00' },
];

export const initialCharges: Charge[] = [];

export const initialSites: SiteProject[] = [];

export const initialProducts: Product[] = [];

export const initialCustomers: Customer[] = [];

export const initialSales: Sale[] = [];

export const initialPaymentLinks: PaymentLink[] = [];

export const initialAffiliates: Affiliate[] = [];
