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

export type PaymentMethod = 'pix' | 'cartao';
export type PaymentStatus = 'pago' | 'pendente' | 'expirado' | 'cancelado';

export interface Transaction {
  id: string;
  customerName: string;
  customerInitial: string;
  avatarColor: string;
  method: 'Pix' | 'Cartão';
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

export type SiteLayoutVariant =
  | 'ecommerce'
  | 'saas'
  | 'course'
  | 'service'
  | 'minimal'
  | 'bold';

export interface SiteBlueprintItem {
  title: string;
  desc: string;
  badge: string;
  price: string;
  imageUrl?: string;
}

export interface SiteCustomSection {
  id: string;
  badge: string;
  title: string;
  content: string;
  bullets?: string[];
  ctaText?: string;
  imageUrl?: string;
  imagePosition?: 'left' | 'right' | 'top' | 'bottom';
  placement?: 'top' | 'middle' | 'bottom';
}

export interface SiteHeroImage {
  url: string;
  alt: string;
  position: 'right' | 'left' | 'top' | 'bottom' | 'background';
  shape?: 'rounded' | 'arch' | 'circle' | 'full';
}

export interface SitePaymentGatewayConfig {
  enabled: boolean;
  provider: 'mato_pay';
  connected: boolean;
  autoCreditAccount?: boolean;
  pixKey: string;
  pixBeneficiary: string;
  checkoutUrl?: string;
  publicKey?: string;
  methods: ('pix' | 'credit_card')[];
  installmentsMax: number;
}


export interface SiteBlueprint {
  brandName: string;
  niche: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaButton: string;
  primaryColorHex: string;
  bgMode: 'dark' | 'light';
  customBgHex?: string;
  customSurfaceHex?: string;
  customCardHex?: string;
  customTextMutedHex?: string;
  showFloatingWhatsapp?: boolean;
  visualTheme?: 'futuristic' | 'minimalist' | 'luxury' | 'modern' | 'vibrant' | 'urban' | 'retro';
  layoutVariant: SiteLayoutVariant;
  navbarStyle?: 'minimal_line' | 'floating_pill' | 'centered_editorial' | 'top_announcement' | 'compact_studio';
  heroStyle?: 'split_right' | 'split_left' | 'centered_stack' | 'editorial_magazine' | 'bg_overlay';
  cardsStyle?: 'grid_3' | 'bento_asymmetric' | 'horizontal_rows' | 'service_booking' | 'store_catalog';
  fontPair?: 'editorial_serif' | 'modern_geometric' | 'luxury_classic' | 'tech_clean' | 'bold_urban' | 'futuristic_cyber';
  buttonRadius?: 'rounded-full' | 'rounded-xl' | 'rounded-none';
  heroImage?: SiteHeroImage | null;
  galleryImages?: { url: string; caption: string }[];
  announcementText?: string;
  footerText?: string;
  priceText: string;
  items: SiteBlueprintItem[];
  benefits: { title: string; desc: string }[];
  testimonials: { name: string; role: string; text: string }[];
  faq: { q: string; a: string }[];
  customSections?: SiteCustomSection[];
  paymentGateway?: SitePaymentGatewayConfig;
  showBenefits: boolean;
  showTestimonials: boolean;
  showFaq: boolean;
  showOffer: boolean;
}

export interface SiteDiscoveryConfig {
  brandName: string;
  whatToSell: string;
  visualStyle: string;
  layoutStructure: string;
  selectedSections: string[];
  priceOrOffer: string;
}

export interface SiteChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  thoughtSeconds?: number;
  activeModelBadge?: string;
  discoveryData?: SiteDiscoveryConfig;
  previewImageUrl?: string;
  milestoneTitle?: string;
  awaitingDiscovery?: boolean;
}

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
  generatedHtml?: string;
  chatHistory?: SiteChatMessage[];
  visualStyle?: string;
  discoveryConfig?: SiteDiscoveryConfig;
  blueprint?: SiteBlueprint;
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
  paymentStatus?: 'aguardando' | 'pago' | 'cancelado';
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
