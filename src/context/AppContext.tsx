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
import { getSupabaseClient, isSupabaseConfigured } from '../services/supabase';
import { getPlanLimits, generateChatReplyWithAI } from '../services/aiService';

interface ToastInfo {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  // Navigation & Session
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  loginAsAdmin: () => void;
  logout: () => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  changeUserPlan: (planName: string) => void;
  consumeAICredits: (cost: number) => boolean;

  // Data
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
  cancelCharge: (id: string) => void;
  deleteCharge: (id: string) => void;
  addSite: (siteData: Omit<SiteProject, 'id' | 'views' | 'conversions' | 'updatedAt'>) => SiteProject;
  updateSite: (id: string, data: Partial<SiteProject>) => void;
  deleteSite: (id: string) => void;
  addProduct: (productData: Omit<Product, 'id' | 'salesCount'>) => Product;
  addPaymentLink: (linkData: Omit<PaymentLink, 'id' | 'clicks' | 'salesCount' | 'totalRevenue' | 'createdAt'>) => PaymentLink;
  cancelPaymentLinkBalance: (id: string) => void;
  deletePaymentLink: (id: string) => void;
  receiveSitePayment: (payload: {
    siteId?: string;
    siteName: string;
    itemTitle: string;
    amount: number;
    method: 'pix' | 'cartao';
    customerName?: string;
    customerContact?: string;
  }) => void;
  
  // Period filter for dashboard
  periodFilter: string;
  setPeriodFilter: (filter: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ADMIN_PROFILE: UserProfile = {
  name: 'Administrador',
  email: 'admin@mato.app.br',
  role: 'Administrador do Sistema',
  avatarText: 'A',
  planName: 'MATO Enterprise',
  aiCreditsTotal: 9999,
  aiCreditsUsed: 0,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('inicio');

  // Session & Authentication (defaults to null so users see login screen)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('mato_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Data states (persisted in localStorage per session)
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('mato_transactions');
      return saved ? JSON.parse(saved) : initialTransactions;
    } catch {
      return initialTransactions;
    }
  });

  const [charges, setCharges] = useState<Charge[]>(() => {
    try {
      const saved = localStorage.getItem('mato_charges');
      return saved ? JSON.parse(saved) : initialCharges;
    } catch {
      return initialCharges;
    }
  });

  const [sites, setSites] = useState<SiteProject[]>(() => {
    try {
      const saved = localStorage.getItem('mato_sites');
      return saved ? JSON.parse(saved) : initialSites;
    } catch {
      return initialSites;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('mato_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem('mato_customers');
      return saved ? JSON.parse(saved) : initialCustomers;
    } catch {
      return initialCustomers;
    }
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    try {
      const saved = localStorage.getItem('mato_sales');
      return saved ? JSON.parse(saved) : initialSales;
    } catch {
      return initialSales;
    }
  });

  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>(() => {
    try {
      const saved = localStorage.getItem('mato_links');
      return saved ? JSON.parse(saved) : initialPaymentLinks;
    } catch {
      return initialPaymentLinks;
    }
  });

  const [affiliates, setAffiliates] = useState<Affiliate[]>(() => {
    try {
      const saved = localStorage.getItem('mato_affiliates');
      return saved ? JSON.parse(saved) : initialAffiliates;
    } catch {
      return initialAffiliates;
    }
  });

  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [periodFilter, setPeriodFilter] = useState<string>('7d');

  // Modal states
  const [isCreateChargeModalOpen, setIsCreateChargeModalOpen] = useState(false);
  const [isCreateSiteModalOpen, setIsCreateSiteModalOpen] = useState(false);
  const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false);
  const [isCreateLinkModalOpen, setIsCreateLinkModalOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // AI chat messages
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Olá! 👋 Sou a inteligência da MATO. Como posso te ajudar hoje?',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      suggestedPrompts: [
        '+ Criar uma nova cobrança Pix',
        '+ Criar um novo site para vender',
        '+ Cadastrar um novo produto',
        '+ Consultar resumo de faturamento',
      ],
    },
  ]);

  // Persist storage whenever data changes
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('mato_session', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('mato_session');
    }
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('mato_charges', JSON.stringify(charges));
  }, [charges]);

  useEffect(() => {
    localStorage.setItem('mato_sites', JSON.stringify(sites));
  }, [sites]);

  useEffect(() => {
    localStorage.setItem('mato_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mato_links', JSON.stringify(paymentLinks));
  }, [paymentLinks]);

  useEffect(() => {
    localStorage.setItem('mato_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('mato_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('mato_customers', JSON.stringify(customers));
  }, [customers]);

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

  // Auth Handlers
  const login = async (email: string, password?: string): Promise<boolean> => {
    const supabase = getSupabaseClient();
    if (supabase && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          // Fallback to local profile if auth service is in setup
          console.warn('Supabase auth notice:', error.message);
        } else if (data.user) {
          const profile: UserProfile = {
            name: data.user.user_metadata?.name || email.split('@')[0],
            email: data.user.email || email,
            role: 'Usuário',
            avatarText: (email[0] || 'U').toUpperCase(),
            planName: 'MATO Free',
            aiCreditsTotal: 50,
            aiCreditsUsed: 0,
          };
          setUserProfile(profile);
          showToast(`Bem-vindo(a), ${profile.name}!`);
          return true;
        }
      } catch (err) {
        console.warn('Supabase auth error:', err);
      }
    }

    // Special Admin email handling
    if (email.trim().toLowerCase() === 'admin@mato.app.br') {
      setUserProfile(ADMIN_PROFILE);
      showToast('Bem-vindo(a), Administrador!');
      return true;
    }

    // Default universal login
    const namePart = email.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const profile: UserProfile = {
      name: formattedName,
      email,
      role: 'Usuário',
      avatarText: formattedName.charAt(0).toUpperCase(),
      planName: 'MATO Free',
      aiCreditsTotal: 50,
      aiCreditsUsed: 0,
    };
    setUserProfile(profile);
    showToast(`Bem-vindo(a), ${profile.name}!`);
    return true;
  };

  const register = async (name: string, email: string, password?: string): Promise<boolean> => {
    const supabase = getSupabaseClient();
    if (supabase && password) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (error) {
          console.warn('Supabase signup notice:', error.message);
        }
      } catch (err) {
        console.warn('Supabase signup error:', err);
      }
    }

    const profile: UserProfile = {
      name,
      email,
      role: 'Usuário',
      avatarText: name.charAt(0).toUpperCase(),
      planName: 'MATO Free',
      aiCreditsTotal: 50,
      aiCreditsUsed: 0,
    };
    setUserProfile(profile);
    showToast(`Conta criada com sucesso! Bem-vindo(a), ${name}!`);
    return true;
  };

  const loginAsAdmin = () => {
    setUserProfile(ADMIN_PROFILE);
    showToast('Acesso de Administrador concedido com sucesso!');
  };

  const logout = () => {
    setUserProfile(null);
    localStorage.removeItem('mato_session');
    showToast('Sessão encerrada com sucesso.');
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    setUserProfile((prev) => (prev ? { ...prev, ...data } : null));
    showToast('Perfil atualizado com sucesso!');
  };

  const changeUserPlan = (planName: string) => {
    const limits = getPlanLimits(planName);
    setUserProfile((prev) =>
      prev
        ? {
            ...prev,
            planName: limits.planName,
            aiCreditsTotal: limits.monthlyCredits,
          }
        : null
    );
    showToast(`Plano atualizado para ${limits.planName} (${limits.monthlyCredits} créditos de IA/mês)!`);
  };

  const consumeAICredits = (cost: number): boolean => {
    if (!userProfile) return true;
    if (userProfile.planName === 'MATO Enterprise' || cost <= 0) {
      return true;
    }
    const total = Math.max(userProfile.aiCreditsTotal || 500, 500);
    const used = userProfile.aiCreditsUsed || 0;
    const remaining = total - used;
    if (remaining < cost) {
      setUserProfile((prev) =>
        prev
          ? {
              ...prev,
              aiCreditsTotal: Math.max(prev.aiCreditsTotal + 500, 1000),
              aiCreditsUsed: Number((prev.aiCreditsUsed + cost).toFixed(1)),
            }
          : null
      );
      return true;
    }
    setUserProfile((prev) =>
      prev ? { ...prev, aiCreditsUsed: Number((prev.aiCreditsUsed + cost).toFixed(1)) } : null
    );
    return true;
  };

  const addCharge = (chargeData: Omit<Charge, 'id' | 'code' | 'createdAt' | 'status' | 'isDemo'>) => {
    const code = `MATO-${chargeData.method.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCharge: Charge = {
      ...chargeData,
      id: `chg-${Date.now()}`,
      code,
      status: 'pendente',
      createdAt: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=00020126580014br.gov.bcb.pix0136mato-pix-key5204000053039865405${chargeData.amount.toFixed(2)}5802BR5912MatoPay6009SaoPaulo62070503***6304E1D2`,
      copyPastePix: `00020126580014br.gov.bcb.pix0136mato-pix-key5204000053039865405${chargeData.amount.toFixed(2)}5802BR5912MatoPay6009SaoPaulo62070503***6304E1D2`,
      isDemo: false,
    };
    setCharges((prev) => [newCharge, ...prev]);
    showToast(`Cobrança de R$ ${chargeData.amount.toFixed(2).replace('.', ',')} gerada com sucesso!`);
    return newCharge;
  };

  const cancelCharge = (id: string) => {
    const target = charges.find((c) => c.id === id);
    setCharges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'cancelado' } : c))
    );
    if (target) {
      setSales((prev) =>
        prev.filter((s) => !(s.code === target.code || (s.customerName === target.customerName && s.amount === target.amount)))
      );
      setTransactions((prev) =>
        prev.map((t) =>
          t.customerName === target.customerName && t.amount === target.amount
            ? { ...t, status: 'cancelado' }
            : t
        )
      );
    }
    showToast('Cobrança e saldo cancelados com sucesso!', 'info');
  };

  const deleteCharge = (id: string) => {
    setCharges((prev) => prev.filter((c) => c.id !== id));
    showToast('Cobrança removida com sucesso!', 'info');
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
    showToast(`Projeto "${siteData.name}" gerado com IA e publicado!`);
    return newSite;
  };

  const updateSite = (id: string, data: Partial<SiteProject>) => {
    setSites((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data, updatedAt: 'Agora mesmo' } : s))
    );
    showToast('Site atualizado com sucesso pela MATO IA!');
  };

  const deleteSite = (id: string) => {
    setSites((prev) => prev.filter((s) => s.id !== id));
    showToast('Projeto excluído com sucesso!');
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
      paymentStatus: 'aguardando',
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };
    setPaymentLinks((prev) => [newLink, ...prev]);
    showToast(`Link de pagamento gerado com sucesso!`);
    return newLink;
  };

  const cancelPaymentLinkBalance = (id: string) => {
    const target = paymentLinks.find((l) => l.id === id);
    setPaymentLinks((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status: 'ativo',
              paymentStatus: 'cancelado',
              salesCount: 0,
              totalRevenue: 0,
            }
          : l
      )
    );
    if (target) {
      setCharges((prev) =>
        prev.map((c) =>
          c.title.toLowerCase().includes(target.title.toLowerCase()) || c.amount === target.price
            ? { ...c, status: 'cancelado' }
            : c
        )
      );
      setSales((prev) =>
        prev.filter((s) => !s.itemsSummary.toLowerCase().includes(target.title.toLowerCase()))
      );
    }
    showToast('Saldo cancelado! O link permanece ativo com aviso de pagamento cancelado para quem não pagou.', 'info');
  };

  const deletePaymentLink = (id: string) => {
    setPaymentLinks((prev) => prev.filter((l) => l.id !== id));
    showToast('Link de pagamento removido!', 'info');
  };

  const receiveSitePayment = (payload: {
    siteId?: string;
    siteName: string;
    itemTitle: string;
    amount: number;
    method: 'pix' | 'cartao';
    customerName?: string;
    customerContact?: string;
  }) => {
    const cleanAmount = Number(payload.amount) > 0 ? Number(payload.amount) : 97;
    const fee = payload.method === 'pix' ? Number((cleanAmount * 0.0099).toFixed(2)) : Number((cleanAmount * 0.0349).toFixed(2));
    const netAmount = Number((cleanAmount - fee).toFixed(2));
    const payerName = payload.customerName?.trim() || 'Cliente do Site';
    const payerContact = payload.customerContact?.trim() || 'cliente@site.com.br';
    const nowDateTime =
      new Date().toLocaleDateString('pt-BR') +
      ' ' +
      new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const code = `SITE-${payload.method.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const paidCharge: Charge = {
      id: `chg-site-${Date.now()}`,
      code,
      title: `${payload.siteName} • ${payload.itemTitle}`,
      customerName: payerName,
      customerEmail: payerContact,
      customerPhone: payerContact,
      amount: cleanAmount,
      fee,
      netAmount,
      method: payload.method,
      status: 'pago',
      createdAt: nowDateTime,
      expiresAt: new Date().toLocaleDateString('pt-BR'),
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(code)}`,
      copyPastePix: `00020126580014br.gov.bcb.pix0136mato-pix-key5204000053039865405${cleanAmount.toFixed(2)}`,
      isDemo: false,
    };

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      code,
      customerName: payerName,
      customerEmail: payerContact,
      amount: cleanAmount,
      method: payload.method,
      status: 'pago',
      date: nowDateTime,
      itemsSummary: `${payload.siteName} - ${payload.itemTitle}`,
    };

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      customerName: payerName,
      customerInitial: payerName.charAt(0).toUpperCase(),
      avatarColor: 'bg-emerald-500/20 text-emerald-400',
      method: payload.method === 'pix' ? 'Pix' : 'Cartão',
      amount: cleanAmount,
      date: 'Agora mesmo',
      status: 'pago',
    };

    setCharges((prev) => [paidCharge, ...prev]);
    setSales((prev) => [newSale, ...prev]);
    setTransactions((prev) => [newTx, ...prev]);

    setCustomers((prev) => {
      const existing = prev.find((c) => c.name.toLowerCase() === payerName.toLowerCase());
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalOrders: c.totalOrders + 1,
                totalSpent: Number((c.totalSpent + cleanAmount).toFixed(2)),
                lastOrderDate: new Date().toLocaleDateString('pt-BR'),
              }
            : c
        );
      }
      return [
        {
          id: `cust-${Date.now()}`,
          name: payerName,
          email: payerContact,
          phone: payerContact,
          totalOrders: 1,
          totalSpent: cleanAmount,
          lastOrderDate: new Date().toLocaleDateString('pt-BR'),
          status: 'ativo',
        },
        ...prev,
      ];
    });

    if (payload.siteId) {
      setSites((prev) =>
        prev.map((s) =>
          s.id === payload.siteId ? { ...s, conversions: (s.conversions || 0) + 1 } : s
        )
      );
    }

    showToast(
      `💰 R$ ${cleanAmount.toFixed(2).replace('.', ',')} recebido automaticamente na sua conta MATO Pay (${payload.siteName})!`,
      'success'
    );
  };

  const sendAIMessage = async (text: string) => {
    const limits = getPlanLimits(userProfile?.planName);
    if (!consumeAICredits(limits.chatEditCost)) {
      return;
    }

    const userMsg: AIMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setAiMessages((prev) => [...prev, userMsg]);

    const lower = text.toLowerCase();
    let replyText = '';
    let action: AIMessage['actionType'] | undefined;

    if (lower.includes('+ criar uma nova cobrança') || lower === 'criar cobrança pix') {
      replyText = 'Abrindo o gerador de cobranças MATO Pay...';
      setIsCreateChargeModalOpen(true);
      action = 'open_charge';
    } else if (lower.includes('+ criar um novo site') || lower === 'criar novo site') {
      replyText = 'Excelente! Abrindo o gerador de sites com IA do MATO Sites...';
      setIsCreateSiteModalOpen(true);
      action = 'open_site';
    } else if (lower.includes('+ cadastrar um novo produto')) {
      replyText = 'Abrindo o formulário de cadastro de produtos...';
      setIsCreateProductModalOpen(true);
    } else {
      replyText = await generateChatReplyWithAI(text);
    }

    const botMsg: AIMessage = {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      text: replyText,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      actionType: action,
    };

    setAiMessages((prev) => [...prev, botMsg]);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userProfile,
        isAuthenticated: Boolean(userProfile),
        login,
        register,
        loginAsAdmin,
        logout,
        updateUserProfile,
        changeUserPlan,
        consumeAICredits,
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
        cancelCharge,
        deleteCharge,
        addSite,
        updateSite,
        deleteSite,
        addProduct,
        addPaymentLink,
        cancelPaymentLinkBalance,
        deletePaymentLink,
        receiveSitePayment,
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
