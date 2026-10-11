import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  NavigationTab,
  Transaction,
  Charge,
  SiteProject,
  Product,
  Customer,
  Sale,
  PaymentLink,
  Affiliate,
  UserProfile,
  AIMessage,
} from '../types';
import {
  initialUserProfile,
  initialTransactions,
  initialCharges,
  initialSites,
  initialProducts,
  initialCustomers,
  initialSales,
  initialPaymentLinks,
  initialAffiliates,
} from '../data/mockData';

interface ToastInfo {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  userProfile: UserProfile;
  transactions: Transaction[];
  charges: Charge[];
  sites: SiteProject[];
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  paymentLinks: PaymentLink[];
  affiliates: Affiliate[];
  toasts: ToastInfo[];
  showToast: (message: string, type?: ToastInfo['type']) => void;
  dismissToast: (id: string) => void;
  
  // Modals & triggers
  isCreateChargeModalOpen: boolean;
  setIsCreateChargeModalOpen: (open: boolean) => void;
  isCreateSiteModalOpen: boolean;
  setIsCreateSiteModalOpen: (open: boolean) => void;
  isCreateProductModalOpen: boolean;
  setIsCreateProductModalOpen: (open: boolean) => void;
  isCreateLinkModalOpen: boolean;
  setIsCreateLinkModalOpen: (open: boolean) => void;
  
  // Floating AI Chat
  isAIChatOpen: boolean;
  setIsAIChatOpen: (open: boolean) => void;
  aiMessages: AIMessage[];
  sendAIMessage: (text: string) => void;
  
  // Mutations
  addCharge: (chargeData: Omit<Charge, 'id' | 'code' | 'createdAt' | 'status' | 'isDemo'>) => Charge;
  addSite: (siteData: Omit<SiteProject, 'id' | 'views' | 'conversions' | 'updatedAt'>) => SiteProject;
  addProduct: (productData: Omit<Product, 'id' | 'salesCount'>) => Product;
  addPaymentLink: (linkData: Omit<PaymentLink, 'id' | 'clicks' | 'salesCount' | 'totalRevenue' | 'createdAt'>) => PaymentLink;
  
  // Period filter for dashboard
  periodFilter: string;
  setPeriodFilter: (filter: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('inicio');
  const [userProfile] = useState<UserProfile>(initialUserProfile);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [charges, setCharges] = useState<Charge[]>(initialCharges);
  const [sites, setSites] = useState<SiteProject[]>(initialSites);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [customers] = useState<Customer[]>(initialCustomers);
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>(initialPaymentLinks);
  const [affiliates] = useState<Affiliate[]>(initialAffiliates);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [periodFilter, setPeriodFilter] = useState<string>('7d');

  // Modal states
  const [isCreateChargeModalOpen, setIsCreateChargeModalOpen] = useState(false);
  const [isCreateSiteModalOpen, setIsCreateSiteModalOpen] = useState(false);
  const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false);
  const [isCreateLinkModalOpen, setIsCreateLinkModalOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(true);

  // AI chat messages
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Oi, Mateus! 👋 Como posso te ajudar hoje?',
      timestamp: '14:30',
      suggestedPrompts: [
        '+ Criar uma cobrança de R$ 150 para o Carlos',
        '+ Montar um site para minha loja',
        '+ Criar uma campanha de marketing',
        '+ Mostrar minhas vendas desta semana',
      ],
    },
  ]);

  const showToast = (message: string, type: ToastInfo['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addCharge = (chargeData: Omit<Charge, 'id' | 'code' | 'createdAt' | 'status' | 'isDemo'>) => {
    const code = `MATO-${chargeData.method.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCharge: Charge = {
      ...chargeData,
      id: `chg-${Date.now()}`,
      code,
      status: 'pendente',
      createdAt: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=00020126580014br.gov.bcb.pix0136mato-demo-${encodeURIComponent(chargeData.customerName)}-pix-key5204000053039865405${chargeData.amount.toFixed(2)}5802BR5912MatoPayDemo6009SaoPaulo62070503***6304E1D2`,
      copyPastePix: `00020126580014br.gov.bcb.pix0136mato-demo-${encodeURIComponent(chargeData.customerName)}-pix-key5204000053039865405${chargeData.amount.toFixed(2)}5802BR5912MatoPayDemo6009SaoPaulo62070503***6304E1D2`,
      isDemo: true,
    };
    setCharges((prev) => [newCharge, ...prev]);
    showToast(`Cobrança de R$ ${chargeData.amount.toFixed(2)} gerada com sucesso! (Modo Demonstração)`);
    return newCharge;
  };

  const addSite = (siteData: Omit<SiteProject, 'id' | 'views' | 'conversions' | 'updatedAt'>) => {
    const newSite: SiteProject = {
      ...siteData,
      id: `site-${Date.now()}`,
      views: 0,
      conversions: 0,
      updatedAt: 'Agora mesmo',
    };
    setSites((prev) => [newSite, ...prev]);
    showToast(`Projeto "${siteData.name}" criado com sucesso!`);
    return newSite;
  };

  const addProduct = (productData: Omit<Product, 'id' | 'salesCount'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      salesCount: 0,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Produto "${productData.name}" cadastrado com sucesso!`);
    return newProduct;
  };

  const addPaymentLink = (linkData: Omit<PaymentLink, 'id' | 'clicks' | 'salesCount' | 'totalRevenue' | 'createdAt'>) => {
    const newLink: PaymentLink = {
      ...linkData,
      id: `link-${Date.now()}`,
      clicks: 0,
      salesCount: 0,
      totalRevenue: 0,
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };
    setPaymentLinks((prev) => [newLink, ...prev]);
    showToast(`Link de pagamento gerado com sucesso!`);
    return newLink;
  };

  const sendAIMessage = (text: string) => {
    const userMsg: AIMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setAiMessages((prev) => [...prev, userMsg]);

    // Simulated contextual AI assistant response
    setTimeout(() => {
      let replyText = 'Entendido! Estou processando sua solicitação.';
      let action: AIMessage['actionType'] | undefined;

      const lower = text.toLowerCase();
      if (lower.includes('cobrança') || lower.includes('150') || lower.includes('carlos')) {
        replyText = 'Preparei os dados para a cobrança de R$ 150,00 para o Carlos Lima via Pix. Deseja abrir a janela para confirmar os detalhes?';
        setIsCreateChargeModalOpen(true);
        action = 'open_charge';
      } else if (lower.includes('site') || lower.includes('loja')) {
        replyText = 'Excelente ideia! Posso estruturar uma loja virtual completa ou uma landing page de alta conversão para você. Abrindo o gerador do MATO Sites...';
        setIsCreateSiteModalOpen(true);
        action = 'open_site';
      } else if (lower.includes('campanha') || lower.includes('marketing')) {
        replyText = 'Aqui está uma estratégia rápida de marketing para a MATO:\n\n1. Headline: "Receba via Pix em segundos com taxa reduzida"\n2. Oferta: Frete grátis na primeira compra\n3. Canal: Anúncios direcionados para Instagram e WhatsApp com link direto do MATO Pay.';
        action = 'marketing_copy';
      } else if (lower.includes('vendas') || lower.includes('semana')) {
        replyText = 'Nesta semana você acumula R$ 12.487,30 em 48 pedidos aprovados. Seu produto mais vendido é o Tênis MATO Runner Black Neon com 38 unidades.';
        action = 'open_sales';
      } else {
        replyText = `Recebi sua mensagem: "${text}". O assistente MATO IA está operando em Modo Demonstração interativo. Todos os atalhos de pagamentos, sites e métricas estão disponíveis!`;
      }

      const botMsg: AIMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        actionType: action,
      };

      setAiMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userProfile,
        transactions,
        charges,
        sites,
        products,
        customers,
        sales,
        paymentLinks,
        affiliates,
        toasts,
        showToast,
        dismissToast,
        isCreateChargeModalOpen,
        setIsCreateChargeModalOpen,
        isCreateSiteModalOpen,
        setIsCreateSiteModalOpen,
        isCreateProductModalOpen,
        setIsCreateProductModalOpen,
        isCreateLinkModalOpen,
        setIsCreateLinkModalOpen,
        isAIChatOpen,
        setIsAIChatOpen,
        aiMessages,
        sendAIMessage,
        addCharge,
        addSite,
        addProduct,
        addPaymentLink,
        periodFilter,
        setPeriodFilter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
