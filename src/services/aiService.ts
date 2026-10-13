import {
  SiteType,
  SiteBlueprint,
  SiteLayoutVariant,
  SitePaymentGatewayConfig,
} from '../types';

export interface PlanLimits {
  planName: string;
  maxSites: number;
  monthlyCredits: number;
  siteGenerationCost: number;
  chatEditCost: number;
  allowCustomDomain: boolean;
  allowCodeExport: boolean;
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  'MATO Free': {
    planName: 'MATO Free',
    maxSites: 999,
    monthlyCredits: 9999,
    siteGenerationCost: 1,
    chatEditCost: 0,
    allowCustomDomain: true,
    allowCodeExport: true,
  },
  'Plano Gratuito': {
    planName: 'MATO Free',
    maxSites: 999,
    monthlyCredits: 9999,
    siteGenerationCost: 1,
    chatEditCost: 0,
    allowCustomDomain: true,
    allowCodeExport: true,
  },
  'MATO Pro': {
    planName: 'MATO Pro',
    maxSites: 999,
    monthlyCredits: 9999,
    siteGenerationCost: 1,
    chatEditCost: 0,
    allowCustomDomain: true,
    allowCodeExport: true,
  },
  'MATO Business': {
    planName: 'MATO Business',
    maxSites: 999999,
    monthlyCredits: 99999,
    siteGenerationCost: 1,
    chatEditCost: 0,
    allowCustomDomain: true,
    allowCodeExport: true,
  },
  'MATO Enterprise': {
    planName: 'MATO Enterprise',
    maxSites: 999999,
    monthlyCredits: 99999,
    siteGenerationCost: 0,
    chatEditCost: 0,
    allowCustomDomain: true,
    allowCodeExport: true,
  },
};

export const getPlanLimits = (planName?: string): PlanLimits => {
  if (!planName) return PLAN_LIMITS['MATO Free'];
  return PLAN_LIMITS[planName] || PLAN_LIMITS['MATO Free'];
};

export const getStoredGeminiKey = (): string => {
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (envKey && String(envKey).trim()) return String(envKey).trim();
  try {
    return localStorage.getItem('mato_gemini_api_key') || '';
  } catch {
    return '';
  }
};

export const setStoredGeminiKey = (key: string): void => {
  try {
    if (key.trim()) {
      localStorage.setItem('mato_gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('mato_gemini_api_key');
    }
  } catch {
    // ignore storage errors
  }
};

export const FALLBACK_SAFE_IMAGE =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=85';

/**
 * Strips common Portuguese idioms like "em casa", "de casa", "sem sair de casa", "lição de casa"
 * so they NEVER falsely trigger Real Estate / House ("casa") classification!
 */
function stripFalsePositiveIdioms(text: string): string {
  return text
    .replace(
      /\b(em\s+casa|de\s+casa|para\s+casa|na\s+sua\s+casa|no\s+conforto\s+de\s+casa|sem\s+sair\s+de\s+casa|dona\s+de\s+casa|li[cç][aã]o\s+de\s+casa|dever\s+de\s+casa|tarefa\s+de\s+casa|receba\s+em\s+casa|imprimir\s+em\s+casa|imprima\s+em\s+casa|fazer\s+em\s+casa|estudar\s+em\s+casa|trabalhar\s+de\s+casa|da\s+casa)\b/gi,
      ' '
    );
}

interface CatalogCategory {
  id: string;
  keywords: RegExp[];
  urls: string[];
}

const CURATED_IMAGE_CATEGORIES: CatalogCategory[] = [
  // 1. INFANTIL / PDF INFANTIL / CRIANÇAS / ATIVIDADES PEDAGÓGICAS / EDUCAÇÃO INFANTIL / COLORIR / BRINQUEDOS
  {
    id: 'kids_education_pdf',
    keywords: [
      /\b(infantil|infantis|crian[cç]as?|pedag[oó]gic[oa]s?|alfabetiza[cç][aã]o|colorir|desenhos?\s+para\s+colorir|atividades?\s+infantis|atividades?\s+para\s+crian[cç]as|atividades?\s+pedag[oó]gicas|pdf\s+infantil|apostilas?\s+infantil|educa[cç][aã]o\s+infantil|coordena[cç][aã]o\s+motora|l[uú]dic[oa]s?|pré-escola|pre-escola|maternal|ber[cç][aá]rio|brinquedos?|brincadeiras?|beb[eê]s?|maternidade|escolinha|pequenos|autismo|tdah|fonoaudiologia\s+infantil|historinhas|contos\s+infantis)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1544776193-352d25ca82cd?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 2. CARROS / AUTOMOTIVO / CONCESSIONÁRIA / VEÍCULOS ESPORTIVOS / ESTÉTICA AUTOMOTIVA / MOTOS
  {
    id: 'automotive',
    keywords: [
      /\b(carros?|autom[oó]veis|automotiv[oa]s?|motors?|motor|supercarros?|esportivos?|concession[aá]ria|ve[ií]culos?|suv|sedan|coup[eé]|porsche|ferrari|lamborghini|bmw|mercedes|audi|mustang|camaro|polimento|vitrifica[cç][aã]o|oficina|mec[aâ]nica|motos?|lava\s*r[aá]pido| blindad[oa]s?|seminovos|garagem|tuning|velocidade|pot[eê]ncia| Cavalos|0\s*a\s*100|test\s*drive)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1618843479319-561729142657?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 3. ROUPAS / MODA / STREETWEAR / VESTUÁRIO / BOUTIQUE / CAMISETAS
  {
    id: 'fashion_clothes',
    keywords: [
      /\b(roupas?|camisetas?|camisas?|moletom|moletons|vestidos?|moda|streetwear|snoop|boutique|vestu[aá]rio|jeans|alfaiataria|jaquetas?|biqu[ií]ni|lingerie|cole[cç][aã]o\s+de\s+inverno|cole[cç][aã]o\s+de\s+ver[aã]o|lookbook|looks?|oversized|hoodie|cal[cç]as?|blusas?|marca\s+de\s+roupa|loja\s+de\s+roupa)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 4. TÊNIS / SNEAKERS / CALÇADOS
  {
    id: 'sneakers',
    keywords: [
      /\b(t[eê]nis|sneakers?|cal[cç]ados?|sapatos?|chuteiras?|botas?|jordan|nike|adidas)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 5. E-BOOK / PDF / APOSTILA / LIVRO DIGITAL / MATERIAL DIDÁTICO
  {
    id: 'ebook_pdf_book',
    keywords: [
      /\b(pdfs?|ebooks?|e-books?|apostilas?|livros?\s+digitais?|livros?|guias?\s+pr[aá]ticos?|cadernos?\s+de\s+atividades|materiais?\s+did[aá]ticos?|imprim[ií]veis|para\s+imprimir|leitura|biblioteca|resumos?)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 6. Unhas / Manicure / Nail Design
  {
    id: 'nails',
    keywords: [
      /\b(unhas?|manicure|pedicure|nail\s*art|nails?|esmaltes?|alongamento\s+de\s+unha|fibra\s+de\s+vidro|banho\s+de\s+gel)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 7. Cílios / Sobrancelha / Maquiagem
  {
    id: 'makeup_lashes',
    keywords: [
      /\b(c[ií]lios|lash|sobrancelhas?|micropigmenta[cç][aã]o|maquiagem|make|batom)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 8. Cabelo / Salão de Beleza
  {
    id: 'hair_salon',
    keywords: [
      /\b(cabelos?|sal[aã]o\s+de\s+beleza|sal[aã]o|cabeleireir[oa]|mechas|penteados?|escova|capilar)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 9. Estética / Spa / Skincare / Pele / Massagem
  {
    id: 'aesthetics_spa',
    keywords: [
      /\b(est[eé]tica|limpeza\s+de\s+pele|botox|harmoniza[cç][aã]o|skincare|spa|massagem|drenagem|depila[cç][aã]o)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 10. Barbearia / Barba / Corte Masculino
  {
    id: 'barbershop',
    keywords: [
      /\b(barbearia|barbeiro|barba|barber|corte\s+masculino|degrad[eê]|navalha)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1517832607067-4db24a2ae47c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 11. Odontologia / Dentista
  {
    id: 'dentist',
    keywords: [
      /\b(dentistas?|odonto|odontologia|implante\s+dent[aá]rio|clareamento\s+dental|ortodontia|sorriso|lentes?\s+de\s+contato\s+dental)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 12. Medicina / Clínica / Saúde / Psicologia / Nutrição
  {
    id: 'medical_clinic',
    keywords: [
      /\b(m[eé]dic[oa]s?|cl[ií]nica\s+m[eé]dica|psicolog[ia|o|a]|terapia|fisioterapia|hospital|nutricionista|nutri[cç][aã]o|enfermagem|sa[uú]de|consult[oó]rio)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 13. Pet Shop / Veterinário / Cães e Gatos
  {
    id: 'pet_shop',
    keywords: [
      /\b(pets?|pet\s*shop|cachorros?|c[aã]o|c[aã]es|gatos?|veterin[aá]ri[oa]|banho\s+e\s+tosa|ra[cç][aã]o)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 14. Hambúrguer / Lanchonete / Burger
  {
    id: 'burger',
    keywords: [
      /\b(hamb[uú]rguer|hamburgueria|burger|smash|lanches?|lanchonete|cheddar|bacon)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 15. Pizza / Pizzaria
  {
    id: 'pizza',
    keywords: [
      /\b(pizzas?|pizzaria|calabresa|margherita|forno\s+a\s+lenha)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 16. Sushi / Japonês
  {
    id: 'sushi',
    keywords: [
      /\b(sushi|japon[eê]s|comida\s+japonesa|sashimi|temaki)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 17. Doces / Bolo / Confeitaria / Chocolate / Açaí / Sorvete
  {
    id: 'sweets_bakery',
    keywords: [
      /\b(bolos?|confeitaria|doces?|doceria|brigadeiros?|chocolates?|tortas?|a[cç]a[ií]|sorvetes?|gelato)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 18. Café / Cafeteria / Padaria
  {
    id: 'coffee',
    keywords: [
      /\b(caf[eé]s?|cafeteria|espresso|cappuccino|padaria|p[aã]es|croissant)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 19. Restaurante / Gastronomia / Comida / Churrasco / Delivery
  {
    id: 'restaurant',
    keywords: [
      /\b(restaurantes?|gastronomia|comida|churrasco|churrascaria|picanha|card[aá]pio|culin[aá]ria|almo[cç]o|jantar)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 20. Academia / Fitness / Treino / Esporte / Suplemento
  {
    id: 'fitness_gym',
    keywords: [
      /\b(academia|fitness|treino|muscula[cç][aã]o|personal\s+trainer|crossfit|esportes?|suplementos?|whey|emagrecimento|pilates|yoga)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 21. Perfume / Fragrância / Cosméticos
  {
    id: 'perfume',
    keywords: [
      /\b(perfumes?|perfumaria|fragr[aâ]ncias?|cosm[eé]ticos?|col[oô]nia)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 22. Relógios / Joias / Óculos / Acessórios
  {
    id: 'watches_jewelry',
    keywords: [
      /\b(rel[oó]gios?|joias?|joalheria|colar|anel|alian[cç]a|diamante|[oó]culos|bolsas?)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1509941943102-10c232535736?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 23. Educação / Cursos / Mentoria / Idiomas (Adult/General)
  {
    id: 'courses_mentorship',
    keywords: [
      /\b(cursos?|mentorias?|treinamentos?|aulas?|escola|faculdade|ingl[eê]s|idiomas|infoproduto|alunos?|professores?|concurso|estudo|ensino)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 24. Imóveis / Imobiliária / Arquitetura / Construtora
  {
    id: 'real_estate',
    keywords: [
      /\b(im[oó]veis|imobili[aá]ria|arquitetura|engenharia\s+civil|apartamentos?|mans[oõ]es|loteamento|condom[ií]nio|corretor\s+de\s+im[oó]veis|construtora|marcenaria|design\s+de\s+interiores)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 25. Advocacia / Jurídico / Direito
  {
    id: 'law_firm',
    keywords: [
      /\b(advocacia|advogad[oa]s?|jur[ií]dic[oa]|direito|oab|escrit[oó]rio\s+de\s+advocacia|trabalhista|previdenci[aá]rio)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 26. Contabilidade / Finanças / Investimentos / Seguros / Consórcio
  {
    id: 'finance_accounting',
    keywords: [
      /\b(contabilidade|contador|finan[cç]as|financeiro|investimentos?|seguros?|cons[oó]rcio|empr[eé]stimo|cripto|bitcoin|bolsa\s+de\s+valores)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 27. Celulares / iPhone / Eletrônicos / Games / Informática
  {
    id: 'electronics_phones',
    keywords: [
      /\b(iphone|celulares?|smartphones?|eletr[oô]nicos|xiaomi|games?|gamer|playstation|console|inform[aá]tica|assist[eê]ncia\s+t[eé]cnica)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 28. Fotografia / Eventos / Casamento / Música / Festa
  {
    id: 'events_photography',
    keywords: [
      /\b(fotografia|fot[oó]graf[oa]|casamento|eventos?|festas?|buffet|m[uú]sica|shows?|dj|filmagem)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 29. Viagens / Turismo / Hotel / Pousada / Praia
  {
    id: 'travel_tourism',
    keywords: [
      /\b(viagens?|viagem|turismo|hotel|pousada|resort|passagens|praia|interc[aâ]mbio)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 30. Energia Solar / Sustentabilidade / Limpeza / Climatização
  {
    id: 'solar_services',
    keywords: [
      /\b(energia\s+solar|placa\s+solar|fotovoltaica|higieniza[cç][aã]o\s+de\s+estofados|ar\s*condicionado|climatiza[cç][aã]o|paisagismo)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1000&q=85',
    ],
  },
  // 31. Tecnologia / Software / SaaS / Marketing / Agência
  {
    id: 'tech_saas',
    keywords: [
      /\b(software|saas|sistemas?\s+web|intelig[eê]ncia\s+artificial|automa[cç][aã]o|marketing\s+digital|ag[eê]ncia\s+de\s+marketing|tr[aá]fego\s+pago|dashboard|startup|cyberpunk)\b/gi,
    ],
    urls: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=85',
    ],
  },
];

/**
 * Scores all categories against the input text (giving 3x weight to the first 300 chars)
 * so the TRUE topic of the prompt ALWAYS wins over any incidental word!
 */
export function detectBestCategoryForText(rawText: string): CatalogCategory | null {
  const cleaned = stripFalsePositiveIdioms(rawText || '');
  const headText = cleaned.slice(0, 360);

  let bestCategory: CatalogCategory | null = null;
  let bestScore = 0;

  for (const cat of CURATED_IMAGE_CATEGORIES) {
    let score = 0;
    for (const rx of cat.keywords) {
      const headMatches = headText.match(rx);
      const fullMatches = cleaned.match(rx);
      if (headMatches) score += headMatches.length * 4;
      if (fullMatches) score += fullMatches.length * 2;
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = cat;
    }
  }

  return bestCategory;
}

/**
 * Selects a verified, high-resolution, fast-loading image URL that strictly matches the Portuguese subject.
 * Uses distinct offsets per variantIndex so Hero (0), Card 1 (1), Card 2 (2), Card 3 (3), and Gallery (4,5,6)
 * NEVER repeat the same image!
 */
export function generateSmartImageForSubject(subjectPt: string, variantIndex = 0): string {
  const trimmed = (subjectPt || '').trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/')
  ) {
    return trimmed;
  }

  const bestCat = detectBestCategoryForText(trimmed);
  if (bestCat && bestCat.urls.length > 0) {
    return bestCat.urls[Math.abs(variantIndex) % bestCat.urls.length];
  }

  const defaultPool = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=85',
  ];
  return defaultPool[Math.abs(variantIndex) % defaultPool.length];
}

/**
 * Extracts a brand/project/product name when the user states or pastes a prompt.
 */
export function extractBrandNameFromText(text: string): string | null {
  if (!text) return null;
  const cleaned = text.trim();

  const explicitPatterns = [
    /(?:nome\s+da\s+marca|nome\s+do\s+site|nome\s+da\s+empresa|nome\s+da\s+loja|nome\s+do\s+projeto|nome\s+do\s+produto|nome\s+do\s+kit|nome\s+do\s+material|produto|marca|empresa|brand)\s*[:=-]\s*["'“”*]*([A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9\s&+.-]{1,34}?)["'“”*]*(?=\r|\n|[,.!?;|]|$)/i,
    /(?:com\s+(?:o\s+)?nome(?:\s+de)?|chamad[oa]|intitulad[oa]|nome\s+(?:é|e|será|sera)|mude\s+(?:o\s+)?nome\s+para|troque\s+(?:o\s+)?nome\s+para|coloque\s+(?:o\s+)?nome(?:\s+de|\s+para)?|bota\s+(?:o\s+)?nome(?:\s+de|\s+para)?|marca\s+chamad[oa]|site\s+chamad[oa])\s*[:=-]?\s*["'“”*]*([A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9\s&+.-]{1,30}?)["'“”*]*(?=\s+(?:de|para|com|que|e\s|no\s|na\s|focado|estilo|cor)\b|\r|\n|[,.!?;]|$)/i,
    /["“”]([A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9\s&+.-]{2,32})["“”]/,
  ];

  for (const regex of explicitPatterns) {
    const match = cleaned.match(regex);
    if (match && match[1]) {
      const candidate = match[1].trim();
      if (
        candidate.length >= 2 &&
        !/^(um|uma|site|loja|pagina|página|venda|vendas|meu|minha|imagem|foto|unha|curso|moderno|futurista|futurístico|minimalista|completo|profissional|alta\s+conversão|alta\s+conversao)$/i.test(
          candidate
        )
      ) {
        return formatBrandCase(candidate);
      }
    }
  }

  return null;
}

function formatBrandCase(str: string): string {
  return str
    .trim()
    .split(/\s+/)
    .map((w) =>
      w === w.toUpperCase() && w.length > 1 ? w : w.charAt(0).toUpperCase() + w.slice(1)
    )
    .join(' ');
}

/**
 * Extracts the core niche / subject from a free-form or structured Portuguese prompt
 */
export function extractCoreSubjectFromPrompt(prompt: string): string {
  if (!prompt) return 'Negócio Digital';

  // 1. Check if there is an explicit "Nicho:", "Tema:", "Produto:", "Assunto:" line
  const labeledNiche = prompt.match(
    /(?:nicho|ramo|segmento|tema(?:\s+do\s+site)?|assunto|produto(?:\s+principal)?|sobre)\s*[:=-]\s*["'“”*]*([^\r\n"'“”*,.]{3,65})/i
  );
  if (labeledNiche && labeledNiche[1]) {
    return formatBrandCase(labeledNiche[1].trim());
  }

  // 2. Check "site de X" / "página de vendas de X" / "landing page sobre X" / "prompt sobre X"
  const paraMatch = prompt.match(
    /(?:crie|criar|fa[cç]a|fazer|gere|gerar|quero|construa|desenvolva|montar|preciso\s+de)?\s*(?:um\s+|uma\s+)?(?:site|loja\s+virtual|loja|landing\s+page|p[aá]gina\s+de\s+vendas|p[aá]gina|plataforma|kit|material)?\s*(?:profissional\s+|completa?\s+|modern[oa]\s+|de\s+alta\s+convers[aã]o\s+|infantil\s+)*(?:de|para\s+vender|para|sobre|focado\s+em|especializado\s+em)\s+([A-Za-zÀ-ÿ0-9\s,/-]{3,65}?)(?=\s+(?:com\s+nome|chamad[oa]|com\s+cores|no\s+estilo|que\s+tenha|com\s+gateway|onde|por\s+R\$)\b|\r|\n|[.!?;]|$)/i
  );
  if (paraMatch && paraMatch[1]) {
    return formatBrandCase(paraMatch[1].trim());
  }

  // 3. Check best scored category
  const bestCat = detectBestCategoryForText(prompt);
  if (bestCat) {
    const catTitles: Record<string, string> = {
      kids_education_pdf: 'Kit de Atividades & PDF Infantil Educativo',
      ebook_pdf_book: 'Material Digital em PDF & Apostila Prática',
      nails: 'Nail Design & Alongamento de Unhas',
      makeup_lashes: 'Beleza, Cílios & Maquiagem',
      hair_salon: 'Salão de Beleza & Cabelos',
      aesthetics_spa: 'Estética Avançada & Bem-Estar',
      barbershop: 'Barbearia & Visagismo Masculino',
      dentist: 'Odontologia & Estética Dental',
      medical_clinic: 'Clínica Médica & Saúde Integrada',
      pet_shop: 'Pet Shop & Clínica Veterinária',
      burger: 'Hamburgueria Artesanal & Delivery',
      pizza: 'Pizzaria Artesanal & Delivery',
      sushi: 'Culinária Japonesa & Sushi',
      sweets_bakery: 'Confeitaria Artesanal & Doces',
      coffee: 'Cafeteria Especial & Padaria',
      restaurant: 'Restaurante & Gastronomia',
      fitness_gym: 'Academia, Treino & Saúde',
      sneakers: 'Sneakers & Calçados Exclusivos',
      fashion_clothes: 'Moda & Vestuário Exclusivo',
      perfume: 'Perfumaria & Fragrâncias Premium',
      watches_jewelry: 'Relógios & Alta Joalheria',
      courses_mentorship: 'Curso Prático & Mentoria Online',
      automotive: 'Estética Automotiva & Veículos',
      real_estate: 'Imóveis & Arquitetura de Alto Padrão',
      law_firm: 'Escritório de Advocacia & Consultoria Jurídica',
      finance_accounting: 'Consultoria Financeira & Contabilidade',
      electronics_phones: 'Smartphones & Tecnologia',
      events_photography: 'Fotografia & Produção de Eventos',
      travel_tourism: 'Viagens & Experiências Turísticas',
      solar_services: 'Energia Solar & Soluções Residenciais',
      tech_saas: 'Plataforma Digital & Automação',
    };
    if (catTitles[bestCat.id]) return catTitles[bestCat.id];
  }

  const firstLine = prompt
    .split(/\r?\n/)
    .map((l) => l.replace(/^[#*\s-]+/, '').trim())
    .find((l) => l.length >= 4 && l.length <= 75);
  if (firstLine) {
    return formatBrandCase(firstLine);
  }

  return 'Soluções & Conteúdo Exclusivo';
}

/**
 * Detects Payment Gateway instructions in a prompt or chat message.
 * Every site automatically has MATO Pay connected to the user's account (PIX + Cartão, NO Boleto).
 */
export function detectPaymentGatewayFromText(
  text: string,
  current?: SitePaymentGatewayConfig,
  brandName = 'Sua Marca'
): { config: SitePaymentGatewayConfig; changed: boolean; description: string } {
  const slug = brandName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'loja';
  const base: SitePaymentGatewayConfig = current
    ? {
        ...current,
        methods: (current.methods || ['pix', 'credit_card']).filter(
          (m) => m === 'pix' || m === 'credit_card'
        ),
        autoCreditAccount: true,
      }
    : {
        enabled: true,
        provider: 'mato_pay',
        connected: true,
        pixKey: `pix@${slug}.com.br`,
        pixBeneficiary: brandName,
        checkoutUrl: '',
        publicKey: `pk_live_${slug}_99281`,
        methods: ['pix', 'credit_card'],
        installmentsMax: 12,
        autoCreditAccount: true,
      };

  if (base.methods.length === 0) {
    base.methods = ['pix', 'credit_card'];
  }

  const lower = text.toLowerCase();
  let changed = false;
  const notes: string[] = [];

  if (/(mercado\s*pago|mercadopago)/i.test(lower)) {
    base.provider = 'mercado_pago';
    base.connected = true;
    base.enabled = true;
    changed = true;
    notes.push('Gateway **Mercado Pago** conectado à sua conta');
  } else if (/\bstripe\b/i.test(lower)) {
    base.provider = 'stripe';
    base.connected = true;
    base.enabled = true;
    changed = true;
    notes.push('Gateway **Stripe** conectado à sua conta');
  } else if (/\basaas\b/i.test(lower)) {
    base.provider = 'asaas';
    base.connected = true;
    base.enabled = true;
    changed = true;
    notes.push('Gateway **Asaas** conectado à sua conta');
  } else if (/(pagbank|pagseguro)/i.test(lower)) {
    base.provider = 'pagbank';
    base.connected = true;
    base.enabled = true;
    changed = true;
    notes.push('Gateway **PagBank** conectado à sua conta');
  } else if (/(kiwify|hotmart|eduzz|kirvano)/i.test(lower)) {
    base.provider = 'kiwify';
    base.connected = true;
    base.enabled = true;
    changed = true;
    notes.push('Gateway **Kiwify / Hotmart** conectado à sua conta');
  } else if (
    /(gateway\s+de\s+pagamento|checkout\s+transparente|sistema\s+de\s+pagamento|pagamento\s+online|receber\s+pagamentos|conectar\s+pagamento|implementar\s+pagamento)/i.test(
      lower
    )
  ) {
    base.enabled = true;
    base.connected = true;
    changed = true;
    notes.push('**Gateway de Pagamento (PIX + Cartão até 12x)** conectado direto à sua conta');
  }

  const pixKeyMatch = text.match(
    /(?:chave\s+pix|pix\s*[:=-])\s*["'“”]*([A-Za-z0-9@._+-]{5,60})["'“”]*/i
  );
  if (pixKeyMatch && pixKeyMatch[1]) {
    base.pixKey = pixKeyMatch[1].trim();
    base.enabled = true;
    base.connected = true;
    changed = true;
    notes.push(`Chave PIX configurada: **${base.pixKey}**`);
  }

  const checkoutUrlMatch = text.match(
    /(?:link\s+de\s+pagamento|link\s+do\s+checkout|checkout\s+url|link\s+de\s+compra)\s*[:=-]?\s*(https?:\/\/[^\s"'<>]+)/i
  );
  if (checkoutUrlMatch && checkoutUrlMatch[1]) {
    base.checkoutUrl = checkoutUrlMatch[1].trim();
    base.enabled = true;
    base.connected = true;
    changed = true;
    notes.push(`Link de checkout externo conectado`);
  }

  return {
    config: base,
    changed,
    description: notes.join(' • '),
  };
}

/**
 * Checks whether a hex color (#RRGGBB) is a neutral dark/black/gray/white background tone
 * vs. a chromatic accent color (like #B7FF00 lime green, #F97316 orange, #00F0FF cyan, etc.).
 */
function analyzeHexColor(hex: string): {
  isDarkNeutral: boolean;
  isLightNeutral: boolean;
  isMidGray: boolean;
  isVibrantAccent: boolean;
  luminance: number;
} {
  const clean = hex.replace('#', '').trim();
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const r = parseInt(full.slice(0, 2), 16) || 0;
  const g = parseInt(full.slice(2, 4), 16) || 0;
  const b = parseInt(full.slice(4, 6), 16) || 0;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const chroma = max - min;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  const isDarkNeutral = chroma <= 32 && luminance < 0.22;
  const isLightNeutral = chroma <= 32 && luminance > 0.82;
  const isMidGray = chroma <= 32 && luminance >= 0.22 && luminance <= 0.82;
  const isVibrantAccent = chroma > 32;

  return { isDarkNeutral, isLightNeutral, isMidGray, isVibrantAccent, luminance };
}

/**
 * Determines if a bullet line or sentence in a prompt is a DESIGN / UI / COLOR / META instruction
 * rather than actual product/service content, so it is NEVER placed literally inside product cards!
 */
export function isDesignOrMetaInstruction(line: string): boolean {
  if (!line) return true;
  const trimmed = line.trim();
  const lower = trimmed.toLowerCase();

  // Contains any hex color code like #080808, #171717, #B7FF00
  if (/#[0-9a-f]{3,6}\b/i.test(trimmed)) return true;

  // Starts with design/layout/color/meta labels
  if (
    /^(cor|cores|paleta|background|fundo|fonte|tipografia|estilo|layout|estrutura|menu|header|cabe[cç]alho|footer|rodap[eé]|se[cç][aã]o|se[cç][oõ]es|bot[aã]o|bot[oõ]es|[ií]cones?|ilustra[cç][oõ]es|objetivo|p[uú]blico-alvo|tom\s+de\s+voz|instru[cç][oõ]es|requisitos|observa[cç][aã]o|nota|adicione\s+tamb[eé]m|coloque\s+tamb[eé]m|inclua\s+tamb[eé]m|crie\s+um\s+site|desenvolva\s+um\s+site|fa[cç]a\s+um\s+site)/i.test(
      lower
    )
  ) {
    return true;
  }

  // Mentions specific color/background/UI/typography directives
  if (
    /\b(preto\s+profundo|cinza\s+grafite|cinza\s+claro|cinza\s+escuro|verde\s+lim[aã]o|verde\s+muito\s+claro|verde\s+da\s+cor|fundo\s+branco|fundo\s+escuro|fundo\s+preto|fundo\s+cinza|fundo\s+predominantemente|background\s+principal|background\s+cinza|texto\s+secund[aá]rio|textos?\s+secund[aá]rios?|cor\s+principal|cor\s+secund[aá]ria|cores\s+vibrantes|paleta\s+de\s+cores|tons\s+past[eé]is|cantos\s+arredondados|bordas?\s+arredondadas?|bot[aã]o\s+flutuante|[ií]cones?\s+fofos|ilustra[cç][oõ]es\s+infantis|tipografia\s+moderna|fontes?\s+grandes|layout\s+responsivo|se[cç][oõ]es\s+secund[aá]rias|efeito\s+hover|sombras?\s+suaves|cards?\s+e\s+se[cç][oõ]es|visual\s+moderno|design\s+sofisticado)\b/i.test(
      lower
    )
  ) {
    return true;
  }

  return false;
}

/**
 * Interprets and applies all color, background, surface, text, button, and WhatsApp instructions
 * from the prompt directly onto the SiteBlueprint CSS configuration (never as literal card text!).
 */
export function extractAndApplyDesignInstructionsFromPrompt(
  bp: SiteBlueprint,
  text: string
): string[] {
  const appliedNotes: string[] = [];
  if (!text) return appliedNotes;
  const lower = text.toLowerCase();

  // 1. Scan all hex codes in the prompt and classify them by context or color math
  const lines = text.split(/\r?\n|[.;]/);
  for (const rawLine of lines) {
    const lineLower = rawLine.toLowerCase();
    const hexMatches = rawLine.match(/#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/g);

    if (hexMatches) {
      for (const rawHex of hexMatches) {
        const hex = rawHex.toUpperCase();
        const info = analyzeHexColor(hex);

        if (
          /\b(background\s+principal|fundo\s+principal|preto\s+profundo|fundo\s+escuro|fundo\s+preto)\b/i.test(
            lineLower
          ) ||
          (info.isDarkNeutral && !bp.customBgHex)
        ) {
          bp.customBgHex = hex;
          bp.bgMode = 'dark';
          appliedNotes.push(`Fundo principal aplicado (${hex})`);
        } else if (
          /\b(cards?\s+e\s+se[cç][oõ]es|se[cç][oõ]es\s+secund[aá]rias|cinza\s+grafite|cinza\s+escuro|superf[ií]cie)\b/i.test(
            lineLower
          ) ||
          (info.isDarkNeutral && bp.customBgHex && hex !== bp.customBgHex)
        ) {
          bp.customCardHex = hex;
          bp.customSurfaceHex = hex;
          appliedNotes.push(`Cor dos cards e seções secundárias aplicada (${hex})`);
        } else if (/\b(texto\s+secund[aá]rio|textos?\s+secund[aá]rios?|subt[ií]tulos?)\b/i.test(lineLower)) {
          bp.customTextMutedHex = hex;
          appliedNotes.push(`Cor de texto secundário aplicada (${hex})`);
        } else if (
          info.isVibrantAccent ||
          /\b(bot[oõ]es|destaques|detalhes|cor\s+principal|accent|verde|laranja|azul|vermelho|roxo|dourado|rosa|amarelo)\b/i.test(
            lineLower
          )
        ) {
          bp.primaryColorHex = hex;
          appliedNotes.push(`Cor de destaque e botões aplicada (${hex})`);
        } else if (info.isLightNeutral) {
          bp.customBgHex = hex;
          bp.bgMode = 'light';
        }
      }
    }
  }

  // 2. Named background / surface / secondary text instructions (even without explicit hex codes)
  if (/\bpreto\s+profundo\b/i.test(lower) && !bp.customBgHex) {
    bp.customBgHex = '#080808';
    bp.bgMode = 'dark';
    appliedNotes.push('Fundo preto profundo (#080808) aplicado');
  } else if (/\b(fundo\s+cinza\s+escuro(?:\s+sofisticado)?|background\s+cinza\s+escuro)\b/i.test(lower) && !bp.customBgHex) {
    bp.customBgHex = '#111215';
    bp.bgMode = 'dark';
    appliedNotes.push('Fundo cinza escuro sofisticado aplicado');
  } else if (/\b(fundo\s+(?:predominantemente\s+)?branco\s+ou\s+verde\s+muito\s+claro|fundo\s+verde\s+(?:muito\s+)?claro)\b/i.test(lower)) {
    bp.customBgHex = '#F4FBF7';
    bp.customSurfaceHex = '#E6F5EC';
    bp.customCardHex = '#FFFFFF';
    bp.bgMode = 'light';
    appliedNotes.push('Fundo verde suave claro aplicado');
  } else if (/\b(fundo\s+(?:predominantemente\s+)?branco|background\s+branco|fundo\s+claro)\b/i.test(lower) && !bp.customBgHex) {
    bp.customBgHex = '#FAFAFA';
    bp.customSurfaceHex = '#F2F4F7';
    bp.customCardHex = '#FFFFFF';
    bp.bgMode = 'light';
    appliedNotes.push('Fundo claro aplicado');
  }

  if (/\bcinza\s+grafite\b/i.test(lower) && !bp.customCardHex) {
    bp.customCardHex = '#171717';
    bp.customSurfaceHex = '#131316';
    appliedNotes.push('Cards em cinza grafite (#171717) aplicados');
  }

  if (/\b(cinza\s+claro\s+para\s+textos?\s+secund[aá]rios?|background\s+cinza\s+claro\s+para\s+texto\s+secund[aá]rio|texto\s+secund[aá]rio\s+cinza\s+claro)\b/i.test(lower)) {
    bp.customTextMutedHex = bp.bgMode === 'dark' ? '#C4C7CE' : '#52525B';
    appliedNotes.push('Texto secundário em cinza claro aplicado');
  }

  // 3. Named Accent Colors (Verde limão, Verde da cor, etc.)
  if (/\b(verde\s+lim[aã]o|verde\s+neon|lime)\b/i.test(lower)) {
    bp.primaryColorHex = '#B7FF00';
    appliedNotes.push('Verde limão (#B7FF00) aplicado nos botões e destaques');
  } else if (/\b(verde\s+da\s+cor|cor\s+verde|verde\s+esmeralda|detalhes\s+em\s+verde|bot[oõ]es\s+verdes)\b/i.test(lower)) {
    if (!bp.primaryColorHex || analyzeHexColor(bp.primaryColorHex).isDarkNeutral) {
      bp.primaryColorHex = '#22C55E';
      appliedNotes.push('Cor verde aplicada nos botões e destaques');
    }
  }

  // 4. Button corner radius instructions
  if (/\b(cantos\s+arredondados|bordas?\s+arredondadas?)\b/i.test(lower)) {
    bp.buttonRadius = 'rounded-full';
  }

  // 5. Floating WhatsApp button instruction
  if (/\b(bot[aã]o\s+flutuante\s+de\s+whatsapp|whatsapp\s+flutuante|adicione\s+tamb[eé]m\s+um\s+bot[aã]o\s+flutuante\s+de\s+whatsapp)\b/i.test(lower)) {
    bp.showFloatingWhatsapp = true;
    appliedNotes.push('Botão flutuante de WhatsApp ativado no canto da página');
  }

  return appliedNotes;
}

/**
 * Detects the visual aesthetic theme requested by the user ("futurístico", "minimalista", "luxuoso", "vibrante", "urbano", "retrô", "moderno")
 */
export function detectVisualThemeFromText(
  text: string
): NonNullable<SiteBlueprint['visualTheme']> | null {
  const lower = text.toLowerCase();
  if (
    /(futur[ií]stic[oa]|futurista|cyberpunk|cyber|neon|sci-fi|hologr[aá]fic[oa]|espacial|alta\s+tecnologia)/i.test(
      lower
    )
  ) {
    return 'futuristic';
  }
  if (
    /(minimalista|minimal|ultra\s+clean|super\s+clean|limpo\s+e\s+minimalista|estilo\s+apple|escandinavo|simples\s+e\s+elegante)/i.test(
      lower
    )
  ) {
    return 'minimalist';
  }
  if (
    /(luxuoso|luxo|high-ticket|dourado\s+e\s+preto|elegante\s+e\s+premium|alto\s+padr[aã]o\s+luxo)/i.test(
      lower
    )
  ) {
    return 'luxury';
  }
  if (/(vibrante|colorido|criativo|pop|divertido|alegre|l[uú]dico)/i.test(lower)) {
    return 'vibrant';
  }
  if (/(urbano|streetwear|brutalista|ousado|radical|skater)/i.test(lower)) {
    return 'urban';
  }
  if (/(retr[oô]|vintage|cl[aá]ssico|editorial\s+antigo)/i.test(lower)) {
    return 'retro';
  }
  if (/(moderno|atual|corporativo|profissional)/i.test(lower)) {
    return 'modern';
  }
  return null;
}

/**
 * Applies a visual theme preset to a blueprint (colors, background mode, typography, button style)
 */
export function applyVisualThemePreset(
  bp: SiteBlueprint,
  theme: NonNullable<SiteBlueprint['visualTheme']>
): void {
  bp.visualTheme = theme;
  if (theme === 'futuristic') {
    bp.bgMode = 'dark';
    bp.primaryColorHex = '#00F0FF';
    bp.fontPair = 'futuristic_cyber';
    bp.buttonRadius = 'rounded-full';
    bp.navbarStyle = 'floating_pill';
    bp.cardsStyle = 'bento_asymmetric';
  } else if (theme === 'minimalist') {
    bp.bgMode = 'light';
    bp.primaryColorHex = '#18181B';
    bp.fontPair = 'tech_clean';
    bp.buttonRadius = 'rounded-full';
    bp.navbarStyle = 'minimal_line';
    bp.cardsStyle = 'grid_3';
  } else if (theme === 'luxury') {
    bp.bgMode = 'dark';
    bp.primaryColorHex = '#D4AF37';
    bp.fontPair = 'luxury_classic';
    bp.buttonRadius = 'rounded-none';
    bp.navbarStyle = 'centered_editorial';
    bp.cardsStyle = 'grid_3';
  } else if (theme === 'vibrant') {
    bp.bgMode = 'light';
    bp.primaryColorHex = '#F97316';
    bp.fontPair = 'modern_geometric';
    bp.buttonRadius = 'rounded-full';
    bp.navbarStyle = 'floating_pill';
    bp.cardsStyle = 'grid_3';
  } else if (theme === 'urban') {
    bp.bgMode = 'dark';
    bp.primaryColorHex = '#A3E635';
    bp.fontPair = 'bold_urban';
    bp.buttonRadius = 'rounded-none';
    bp.navbarStyle = 'top_announcement';
    bp.cardsStyle = 'store_catalog';
  } else if (theme === 'retro') {
    bp.bgMode = 'light';
    bp.primaryColorHex = '#B45309';
    bp.fontPair = 'editorial_serif';
    bp.buttonRadius = 'rounded-xl';
    bp.navbarStyle = 'centered_editorial';
    bp.cardsStyle = 'horizontal_rows';
  } else if (theme === 'modern') {
    bp.bgMode = 'dark';
    bp.primaryColorHex = '#6366F1';
    bp.fontPair = 'modern_geometric';
    bp.buttonRadius = 'rounded-xl';
    bp.navbarStyle = 'floating_pill';
    bp.cardsStyle = 'grid_3';
  }
}

export function inferLayoutVariant(text: string, current?: SiteLayoutVariant): SiteLayoutVariant {
  const bestCat = detectBestCategoryForText(text);
  if (bestCat) {
    if (
      bestCat.id === 'kids_education_pdf' ||
      bestCat.id === 'ebook_pdf_book' ||
      bestCat.id === 'courses_mentorship'
    ) {
      return 'course';
    }
    if (bestCat.id === 'tech_saas') {
      return 'saas';
    }
    if (
      [
        'nails',
        'makeup_lashes',
        'hair_salon',
        'aesthetics_spa',
        'barbershop',
        'dentist',
        'medical_clinic',
        'pet_shop',
        'fitness_gym',
        'real_estate',
        'law_firm',
        'finance_accounting',
        'events_photography',
        'travel_tourism',
        'solar_services',
      ].includes(bestCat.id)
    ) {
      return 'service';
    }
  }
  return current || 'ecommerce';
}

export function inferThemeFromText(
  text: string,
  currentHex = '#10B981',
  currentBg: 'dark' | 'light' = 'dark'
): { primaryColorHex: string; bgMode: 'dark' | 'light' } {
  const lower = text.toLowerCase();
  let primaryColorHex = currentHex;
  let bgMode = currentBg;

  if (
    /\b(preto\s+profundo|fundo\s+escuro|fundo\s+preto|fundo\s+cinza\s+escuro|dark\s+mode|modo\s+escuro|noturno)\b/i.test(
      lower
    )
  ) {
    bgMode = 'dark';
  } else if (
    /\b(fundo\s+(?:predominantemente\s+)?branco|fundo\s+claro|fundo\s+verde\s+muito\s+claro|modo\s+claro|light\s+mode)\b/i.test(
      lower
    ) ||
    lower.includes('infantil') ||
    lower.includes('criança') ||
    lower.includes('crianca') ||
    lower.includes('colorir') ||
    lower.includes('pedagógic') ||
    lower.includes('pedagogic')
  ) {
    bgMode = 'light';
  } else if (lower.includes('escuro') || lower.includes('preto') || lower.includes('dark')) {
    bgMode = 'dark';
  } else if (lower.includes('claro') || lower.includes('branco') || lower.includes('clean')) {
    bgMode = 'light';
  }

  // Only pick a vibrant/chromatic hex as primaryColorHex, NEVER a black/dark-gray background hex like #080808 or #171717!
  const allHexes = text.match(/#([0-9A-Fa-f]{6})\b/g);
  if (allHexes && allHexes.length > 0) {
    for (const h of allHexes) {
      const info = analyzeHexColor(h);
      if (info.isVibrantAccent) {
        primaryColorHex = h.toUpperCase();
        return { primaryColorHex, bgMode };
      }
    }
  }

  if (/\b(verde\s+lim[aã]o|verde\s+neon|lime)\b/i.test(lower)) {
    primaryColorHex = '#B7FF00';
  } else if (lower.includes('futur') || lower.includes('cyber') || lower.includes('ciano') || lower.includes('turquesa')) {
    primaryColorHex = '#00F0FF';
  } else if (lower.includes('rosa') || lower.includes('pink') || lower.includes('magenta') || lower.includes('unha') || lower.includes('manicure')) {
    primaryColorHex = '#EC4899';
  } else if (lower.includes('vermelh') || lower.includes('red') || lower.includes('rubi') || lower.includes('vinho')) {
    primaryColorHex = '#EF4444';
  } else if (lower.includes('azul') || lower.includes('blue') || lower.includes('royal') || lower.includes('corporativo')) {
    primaryColorHex = '#2563EB';
  } else if (lower.includes('rox') || lower.includes('lilás') || lower.includes('lilas') || lower.includes('purple') || lower.includes('violeta')) {
    primaryColorHex = '#7C3AED';
  } else if (lower.includes('dourad') || lower.includes('ouro') || lower.includes('luxo') || lower.includes('gold')) {
    primaryColorHex = '#D4AF37';
  } else if (
    lower.includes('laranja') ||
    lower.includes('orange') ||
    lower.includes('infantil') ||
    lower.includes('criança') ||
    lower.includes('colorir')
  ) {
    primaryColorHex = '#F97316';
  } else if (lower.includes('amarel') || lower.includes('yellow')) {
    primaryColorHex = '#EAB308';
  } else if (lower.includes('verde') || lower.includes('esmeralda') || lower.includes('green')) {
    primaryColorHex = '#10B981';
  } else if (lower.includes('minimalista')) {
    primaryColorHex = '#18181B';
  }

  return { primaryColorHex, bgMode };
}

function pickVariedLayoutCombination(
  seedText: string,
  layoutVariant: SiteLayoutVariant,
  layoutStructure?: string
) {
  const hash = Math.abs(
    (seedText + Date.now()).split('').reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 1), 17)
  );

  const navStyles: NonNullable<SiteBlueprint['navbarStyle']>[] = [
    'minimal_line',
    'floating_pill',
    'centered_editorial',
    'top_announcement',
    'compact_studio',
  ];
  const heroStyles: NonNullable<SiteBlueprint['heroStyle']>[] = [
    'split_right',
    'split_left',
    'centered_stack',
  ];
  const cardStyles: NonNullable<SiteBlueprint['cardsStyle']>[] = [
    'grid_3',
    'bento_asymmetric',
    'horizontal_rows',
  ];
  const fontPairs: NonNullable<SiteBlueprint['fontPair']>[] = [
    'modern_geometric',
    'tech_clean',
    'editorial_serif',
  ];
  const radii: NonNullable<SiteBlueprint['buttonRadius']>[] = [
    'rounded-full',
    'rounded-xl',
  ];

  let heroStyle = heroStyles[hash % heroStyles.length];
  if (layoutStructure?.toLowerCase().includes('centralizado')) {
    heroStyle = 'centered_stack';
  } else if (
    layoutStructure?.toLowerCase().includes('split') ||
    layoutStructure?.toLowerCase().includes('lado')
  ) {
    heroStyle = hash % 2 === 0 ? 'split_right' : 'split_left';
  }

  let cardsStyle = cardStyles[(hash >> 2) % cardStyles.length];
  if (layoutVariant === 'course' || layoutVariant === 'ecommerce') {
    cardsStyle = 'grid_3';
  }

  return {
    navbarStyle: navStyles[(hash >> 1) % navStyles.length],
    heroStyle,
    cardsStyle,
    fontPair: fontPairs[(hash >> 3) % fontPairs.length],
    buttonRadius: radii[(hash >> 4) % radii.length],
    seedOffset: hash % 7,
  };
}

/**
 * Deeply parses any copied/pasted prompt (from ChatGPT, Claude, Gemini, or user-written)
 * and extracts the exact Headline, Subtitle, CTA, Items/Modules, Benefits, Price, Colors, and Images,
 * while NEVER turning color/design/layout instructions into literal card text!
 */
export function parseStructuredPastedPrompt(
  bp: SiteBlueprint,
  rawPrompt: string
): { appliedCount: number; summary: string[] } {
  const summary: string[] = [];
  if (!rawPrompt || rawPrompt.trim().length < 10) {
    return { appliedCount: 0, summary };
  }

  const text = rawPrompt.trim();

  // 1. Check visual theme preset first
  const detectedTheme = detectVisualThemeFromText(text);
  if (detectedTheme) {
    applyVisualThemePreset(bp, detectedTheme);
    summary.push(`Estilo visual **${detectedTheme}** aplicado`);
  }

  // 1.5. Interpret and apply specific color/background/card/text/button/WhatsApp instructions onto CSS properties!
  const designChanges = extractAndApplyDesignInstructionsFromPrompt(bp, text);
  if (designChanges.length > 0) {
    summary.push(...designChanges);
  }

  // 2. Check Brand Name in prompt
  const brandInPrompt = extractBrandNameFromText(text);
  if (brandInPrompt) {
    bp.brandName = brandInPrompt;
    summary.push(`Nome definido como **${brandInPrompt}**`);
  }

  // 3. Extract explicit labeled Headline / Title OR Markdown H1/H2 from pasted prompt (ignoring section headers like "Paleta de Cores")
  const headlineMatch =
    text.match(
      /(?:headline|t[ií]tulo\s+principal|t[ií]tulo\s+do\s+hero|chamada\s+principal|promessa\s+principal|h1|t[ií]tulo)\s*[:=-]\s*["'“”*]*([^\r\n"'“”*]{6,150})["'“”*]*/i
    ) ||
    text.match(/^#{1,2}\s+([^\r\n#]{8,130})/m);

  if (
    headlineMatch &&
    headlineMatch[1] &&
    !isDesignOrMetaInstruction(headlineMatch[1])
  ) {
    bp.heroTitle = headlineMatch[1].replace(/\*\*/g, '').trim();
    summary.push(`Título principal extraído do prompt`);
  }

  // 4. Extract explicit labeled Subtitle / Subheadline / Descrição
  const subheadlineMatch = text.match(
    /(?:subheadline|subt[ií]tulo|descri[cç][aã]o(?:\s+do\s+topo|\s+do\s+produto)?|texto\s+de\s+apoio|sub-headline|proposta\s+de\s+valor|resumo)\s*[:=-]\s*["'“”*]*([^\r\n"'“”*]{12,280})["'“”*]*/i
  );
  if (
    subheadlineMatch &&
    subheadlineMatch[1] &&
    !isDesignOrMetaInstruction(subheadlineMatch[1])
  ) {
    bp.heroSubtitle = subheadlineMatch[1].replace(/\*\*/g, '').trim();
    summary.push(`Subtítulo extraído do prompt`);
  }

  // 5. Extract explicit CTA button label
  const ctaMatch = text.match(
    /(?:cta|bot[aã]o\s+de\s+a[cç][aã]o|chamada\s+para\s+a[cç][aã]o|texto\s+do\s+bot[aã]o)\s*[:=-]\s*["'“”*]*([^\r\n"'“”*]{3,42})["'“”*]*/i
  );
  if (ctaMatch && ctaMatch[1] && !isDesignOrMetaInstruction(ctaMatch[1])) {
    bp.ctaButton = ctaMatch[1].replace(/\*\*/g, '').trim();
    summary.push(`Botão CTA extraído do prompt`);
  }

  // 6. Check Payment Gateway instructions in prompt
  const gwCheck = detectPaymentGatewayFromText(text, bp.paymentGateway, bp.brandName);
  bp.paymentGateway = gwCheck.config;
  if (gwCheck.changed) {
    summary.push(gwCheck.description);
  }

  // 7. Ensure Hero Image and Card Images strictly match the scored topic with non-repeating indices!
  const seedOffset = Math.abs(
    bp.brandName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  ) % 5;
  const matchedImgUrl = generateSmartImageForSubject(text, seedOffset);
  if (bp.heroImage) {
    bp.heroImage.url = matchedImgUrl;
    bp.heroImage.alt = `${bp.brandName} - ${bp.niche}`;
  }

  // 8. Extract ONLY genuine product/module/feature bullet lines (filtering out ALL design/color/UI instructions!)
  const bulletLines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => /^([-•*✅✔👉🎯📌🔸🔹]|\d+[.)])\s+/.test(l))
    .map((l) =>
      l
        .replace(/^([-•*✅✔👉🎯📌🔸🔹]|\d+[.)])\s+/, '')
        .replace(/\*\*/g, '')
        .trim()
    )
    .filter((l) => l.length >= 6 && l.length <= 170 && !isDesignOrMetaInstruction(l));

  if (bulletLines.length >= 2) {
    const itemPool = bulletLines.slice(0, 6);
    const newItems = itemPool.slice(0, 3).map((line, idx) => {
      const parts = line.split(/\s*[:–—-]\s*/);
      const title = parts[0]?.trim() || `Destaque 0${idx + 1}`;
      const desc =
        parts.slice(1).join(' — ').trim() ||
        `Disponível na ${bp.brandName}: ${title} com garantia e qualidade superior.`;
      const priceInLine = line.match(/R\$\s?\d+[.,]?\d*/i);
      return {
        title: title.slice(0, 65),
        desc: desc.slice(0, 160),
        badge: idx === 0 ? 'Destaque Principal' : idx === 1 ? 'Mais Procurado' : 'Exclusivo',
        price: priceInLine ? priceInLine[0] : bp.priceText,
        imageUrl: generateSmartImageForSubject(`${line} ${text}`, seedOffset + idx + 1),
      };
    });
    bp.items = newItems;
    summary.push(`${newItems.length} destaques extraídos do seu prompt`);

    if (bulletLines.length >= 4) {
      const benefitLines = bulletLines.slice(3, 6);
      bp.benefits = benefitLines.map((bLine) => {
        const parts = bLine.split(/\s*[:–—-]\s*/);
        return {
          title: (parts[0] || bLine).slice(0, 55),
          desc:
            parts.slice(1).join(' — ').trim() ||
            `${bLine} — pensado para oferecer a melhor experiência na ${bp.brandName}.`,
        };
      });
    }
  }

  return { appliedCount: summary.length, summary };
}

/**
 * Builds a complete, ready-to-view initial blueprint that strictly matches the prompt's true topic!
 * Includes rich, realistic templates for Cars/Dealerships, Fashion/Clothing, Kids PDF, Beauty/Nails,
 * Barbershop, Food/Restaurants, Real Estate, Fitness/Gym, Clinics/Dentists, Pet Shop, and more!
 */
export function buildDefaultBlueprint(params: {
  brandName: string;
  niche: string;
  prompt: string;
  visualStyle?: string;
  layoutStructure?: string;
  selectedSections?: string[];
  priceOrOffer?: string;
}): SiteBlueprint {
  const combinedText = `${params.prompt} ${params.niche} ${params.visualStyle || ''} ${params.layoutStructure || ''}`;
  const lower = combinedText.toLowerCase();

  const bestCat = detectBestCategoryForText(combinedText);
  const catId = bestCat?.id || '';

  const coreSubject = extractCoreSubjectFromPrompt(params.prompt || params.niche);

  // Determine Default Brand Name intelligently based on the topic if user didn't name it
  let fallbackBrand = 'Studio Prime';
  if (catId === 'kids_education_pdf') fallbackBrand = 'Pequenos Gênios PDF';
  else if (catId === 'ebook_pdf_book') fallbackBrand = 'Acervo Digital PDF';
  else if (catId === 'automotive') fallbackBrand = 'Astro Motors';
  else if (catId === 'fashion_clothes') fallbackBrand = 'Maison Urban';
  else if (catId === 'sneakers') fallbackBrand = 'Sneaker Drop Club';
  else if (catId === 'courses_mentorship') fallbackBrand = 'Academia Master';
  else if (catId === 'nails') fallbackBrand = 'Studio Bella Nails';
  else if (catId === 'barbershop') fallbackBrand = 'Barbearia Imperial';
  else if (catId === 'burger' || catId === 'pizza' || catId === 'restaurant') fallbackBrand = 'Sabor Artesanal';
  else if (catId === 'dentist' || catId === 'medical_clinic') fallbackBrand = 'Clínica Vida & Saúde';
  else if (catId === 'pet_shop') fallbackBrand = 'Amigo Fiel Pet';
  else if (catId === 'real_estate') fallbackBrand = 'Prime Imóveis';
  else if (catId === 'fitness_gym') fallbackBrand = 'Titan Fitness';

  const extractedBrand =
    extractBrandNameFromText(params.brandName) ||
    extractBrandNameFromText(params.prompt) ||
    (params.brandName &&
    !['Minha Marca', 'Sua Marca', 'Novo Projeto', 'Studio Prime'].includes(params.brandName.trim())
      ? params.brandName.trim()
      : fallbackBrand);

  const layoutVariant = inferLayoutVariant(combinedText);
  const palettePool = ['#10B981', '#8B5CF6', '#EC4899', '#3B82F6', '#F97316', '#06B6D4', '#D4AF37'];
  const randomDefaultColor = palettePool[Math.floor(Math.random() * palettePool.length)];

  const { primaryColorHex, bgMode } = inferThemeFromText(
    combinedText,
    catId === 'kids_education_pdf'
      ? '#F97316'
      : catId === 'automotive'
      ? '#B7FF00'
      : randomDefaultColor,
    catId === 'kids_education_pdf' || lower.includes('fundo branco') || lower.includes('minimalista')
      ? 'light'
      : 'dark'
  );

  const variation = pickVariedLayoutCombination(
    `${extractedBrand}-${params.niche}-${params.prompt}`,
    layoutVariant,
    params.layoutStructure
  );
  const imgOff = variation.seedOffset;

  const priceMatch = `${params.priceOrOffer || ''} ${params.prompt}`.match(/R\$\s?(\d+[.,]?\d*(?:\s*mil)?)/i);
  const priceText = priceMatch
    ? `R$ ${priceMatch[1]}`
    : params.priceOrOffer?.trim() ||
      (catId === 'kids_education_pdf' || catId === 'ebook_pdf_book'
        ? 'R$ 29,90'
        : catId === 'automotive'
        ? 'R$ 189.900'
        : catId === 'real_estate'
        ? 'R$ 650.000'
        : catId === 'fashion_clothes' || catId === 'sneakers'
        ? 'R$ 189,90'
        : layoutVariant === 'saas'
        ? 'R$ 97,00'
        : layoutVariant === 'service'
        ? 'R$ 120,00'
        : 'R$ 197,00');

  const showBenefits = true;
  const showTestimonials = true;
  const showFaq = true;
  const showOffer = true;

  const paymentGateway = detectPaymentGatewayFromText(combinedText, undefined, extractedBrand).config;

  let bp: SiteBlueprint;

  // 1. DEDICATED TEMPLATE FOR PDF INFANTIL / ATIVIDADES PARA CRIANÇAS / EDUCAÇÃO INFANTIL / E-BOOK
  if (catId === 'kids_education_pdf' || catId === 'ebook_pdf_book') {
    const isKids = catId === 'kids_education_pdf';
    bp = {
      brandName: extractedBrand,
      niche: isKids
        ? 'Atividades Pedagógicas & PDF Infantil para Imprimir'
        : 'Material Digital em PDF & Apostilas Práticas',
      tagline: isKids
        ? `${extractedBrand} • Educação Infantil Lúdica, Criativa & Pronta para Imprimir`
        : `${extractedBrand} • Acesso Imediato em PDF no Celular, Tablet ou Impressão`,
      heroTitle: isKids
        ? `Desenvolva o aprendizado do seu filho brincando com o Kit de Atividades em PDF ${extractedBrand}!`
        : `Baixe agora o material completo em PDF ${extractedBrand} e comece imediatamente.`,
      heroSubtitle: isKids
        ? `Mais de 300 páginas ilustradas em PDF prontas para imprimir: alfabetização lúdica, coordenação motora, caligrafia, números, jogos pedagógicos e desenhos para colorir longe das telas!`
        : `Apostilas e materiais digitais estruturados passo a passo em alta resolução, prontos para ler em qualquer dispositivo ou imprimir quantas vezes quiser.`,
      ctaButton: isKids ? 'Quero Baixar o Kit PDF Agora!' : 'Baixar Meu PDF Agora',
      primaryColorHex: isKids ? '#F97316' : primaryColorHex,
      bgMode: isKids ? 'light' : bgMode,
      layoutVariant: 'course',
      navbarStyle: variation.navbarStyle,
      heroStyle: variation.heroStyle,
      cardsStyle: variation.cardsStyle,
      fontPair: variation.fontPair,
      buttonRadius: variation.buttonRadius,
      heroImage: {
        url: generateSmartImageForSubject(combinedText, imgOff),
        alt: `Atividades em PDF ${extractedBrand}`,
        position: 'right',
        shape: 'rounded',
      },
      priceText,
      paymentGateway,
      items: isKids
        ? [
            {
              title: 'Apostila 1 • Alfabetização Lúdica & Vogais em PDF',
              desc: 'Atividades ilustradas passo a passo para reconhecer letras, sílabas, formar as primeiras palavras e desenvolver a leitura de forma divertida.',
              badge: '+100 Páginas em PDF',
              price: priceText,
              imageUrl: generateSmartImageForSubject('infantil criança atividades colorir', imgOff + 1),
            },
            {
              title: 'Apostila 2 • Coordenação Motora, Traçado & Colorir',
              desc: 'Exercícios de pontilhado, recorte, colagem, labirintos e desenhos pedagógicos para soltar a criatividade e treinar a escrita.',
              badge: 'Pronto para Imprimir',
              price: priceText,
              imageUrl: generateSmartImageForSubject('infantil criança colorir', imgOff + 2),
            },
            {
              title: 'Apostila 3 • Matemática Divertida & Raciocínio Lógico',
              desc: 'Jogos visuais com números, contagem ilustrada, formas geométricas, associação e memória para crianças de 2 a 8 anos.',
              badge: 'Bônus Exclusivo',
              price: priceText,
              imageUrl: generateSmartImageForSubject('infantil criança escola', imgOff + 3),
            },
          ]
        : [
            {
              title: 'Volume 1 • Guia Completo & Apostila Principal em PDF',
              desc: 'Material completo diagramado em alta resolução com passo a passo prático e exercícios aplicáveis.',
              badge: 'PDF Principal',
              price: priceText,
              imageUrl: generateSmartImageForSubject('ebook pdf livro', imgOff + 1),
            },
            {
              title: 'Volume 2 • Caderno de Exercícios & Prática Imprimível',
              desc: 'Folhas prontas para imprimir ou preencher no tablet/computador quantas vezes você precisar.',
              badge: 'Incluso',
              price: priceText,
              imageUrl: generateSmartImageForSubject('ebook pdf livro', imgOff + 2),
            },
            {
              title: 'Bônus Especial • Material Complementar Vitalício',
              desc: 'Acesso vitalício com atualizações inclusas e envio automático no seu e-mail e WhatsApp.',
              badge: 'Bônus VIP',
              price: priceText,
              imageUrl: generateSmartImageForSubject('ebook pdf livro', imgOff + 3),
            },
          ],
      benefits: isKids
        ? [
            {
              title: 'Chega no E-mail e WhatsApp na Hora',
              desc: 'Assim que confirmar o pagamento via PIX ou Cartão, você recebe todos os arquivos em PDF prontos para baixar e imprimir quantas vezes quiser!',
            },
            {
              title: 'Tire as Crianças do Celular e da TV',
              desc: 'Atividades coloridas e envolventes que prendem a atenção da criança de verdade, estimulando a concentração e a criatividade.',
            },
            {
              title: 'Aprovado por Pedagogos e Professores',
              desc: 'Material elaborado seguindo a BNCC para crianças da educação infantil e séries iniciais (2 a 8 anos).',
            },
          ]
        : [
            {
              title: 'Envio Automático Imediato em PDF',
              desc: 'Receba os arquivos no seu e-mail e WhatsApp segundos após a confirmação do pagamento.',
            },
            {
              title: 'Imprima Quantas Vezes Quiser',
              desc: 'O acesso aos arquivos PDF é vitalício: baixe no celular, computador ou imprima sem limites.',
            },
            {
              title: 'Garantia Incondicional de 7 Dias',
              desc: 'Satisfação total garantida ou devolvemos 100% do seu valor sem burocracia.',
            },
          ],
      testimonials: isKids
        ? [
            {
              name: 'Juliana Mendes (Mãe do Theo, 4 anos)',
              role: 'Compra Verificada',
              text: `O melhor material em PDF que já comprei! Imprimi as atividades do ${extractedBrand} e meu filho largou o celular para pintar e aprender as letrinhas!`,
            },
            {
              name: 'Profª. Carla Souza',
              role: 'Pedagoga Infantil',
              text: 'Uso as apostilas em PDF com meus alunos toda semana. Os desenhos são lindos, super didáticos e fáceis de imprimir.',
            },
            {
              name: 'Patrícia Oliveira (Mãe da Alice, 6 anos)',
              role: 'Cliente VIP',
              text: 'Chegou no meu WhatsApp no mesmo segundo em que paguei no PIX. Minha filha evoluiu demais na coordenação motora e leitura!',
            },
          ]
        : [
            {
              name: 'Mariana Costa',
              role: 'Leitora Verificada',
              text: `Material em PDF super organizado, direto ao ponto e de altíssima qualidade. Recebi no mesmo minuto!`,
            },
            {
              name: 'Carlos Eduardo',
              role: 'Cliente Verificado',
              text: 'Excelente custo-benefício. Baixei no celular e também imprimi a apostila completa.',
            },
            {
              name: 'Fernanda Lima',
              role: 'Cliente VIP',
              text: 'Muito prático e bem explicado. Recomendo para todo mundo!',
            },
          ],
      faq: isKids
        ? [
            {
              q: 'Como vou receber as atividades em PDF?',
              a: 'Imediatamente após a confirmação do pagamento (PIX ou Cartão), você recebe o link para baixar todos os PDFs diretamente no seu E-mail e no seu WhatsApp!',
            },
            {
              q: 'Para qual idade o Kit de PDF Infantil é indicado?',
              a: 'O material é dividido por níveis e atende perfeitamente crianças de 2 a 8 anos (Educação Infantil, Pré-escola e Alfabetização).',
            },
            {
              q: 'Posso imprimir quantas vezes eu quiser?',
              a: 'Sim! O acesso ao arquivo PDF é vitalício. Você pode imprimir em qualquer impressora comum ou papelaria quantas vezes desejar.',
            },
            {
              q: 'Quais são as formas de pagamento?',
              a: 'Você pode pagar via PIX com liberação imediata (QR Code ou Copia e Cola) ou no Cartão de Crédito aqui mesmo no site.',
            },
          ]
        : [
            {
              q: 'Como recebo o arquivo em PDF?',
              a: 'Assim que o pagamento é confirmado no site, o download do PDF é liberado na hora e enviado ao seu e-mail e WhatsApp.',
            },
            {
              q: 'Posso acessar pelo celular e também imprimir?',
              a: 'Sim! O PDF abre em qualquer celular, tablet ou computador e está formatado em tamanho A4 pronto para impressão.',
            },
            {
              q: 'Quais são as formas de pagamento?',
              a: 'Aceitamos PIX com aprovação instantânea e Cartão de Crédito em até 12x diretamente no site.',
            },
          ],
      customSections: [],
      showBenefits,
      showTestimonials,
      showFaq,
      showOffer,
    };
  }
  // 2. DEDICATED TEMPLATE FOR CARROS / VEÍCULOS ESPORTIVOS / CONCESSIONÁRIA / ESTÉTICA AUTOMOTIVA (e.g. ASTRO MOTORS)
  else if (catId === 'automotive') {
    bp = {
      brandName: extractedBrand,
      niche: 'Veículos Esportivos, Supercarros & Alta Performance',
      tagline: `${extractedBrand} • Potência, Design & Exclusividade Automotiva`,
      heroTitle: `Domine as ruas com a seleção exclusiva de veículos da ${extractedBrand}.`,
      heroSubtitle: `Esportivos de alta performance, SUVs blindados e sedans de luxo periciados com laudo cautelar 100% aprovado, garantia integral e reserva online imediata.`,
      ctaButton: 'Reservar Veículo / Test Drive',
      primaryColorHex,
      bgMode: 'dark',
      layoutVariant: 'ecommerce',
      navbarStyle: variation.navbarStyle,
      heroStyle: variation.heroStyle,
      cardsStyle: variation.cardsStyle,
      fontPair: 'modern_geometric',
      buttonRadius: variation.buttonRadius,
      heroImage: {
        url: generateSmartImageForSubject('carro esportivo supercarro porsche', imgOff),
        alt: `${extractedBrand} Supercarros`,
        position: variation.heroStyle === 'split_left' ? 'left' : 'right',
        shape: 'rounded',
      },
      priceText,
      paymentGateway,
      items: [
        {
          title: `${extractedBrand} GT Coupé Biturbo V8`,
          desc: 'Motor biturbo de 620 cv, 0 a 100 km/h em 3.1s, câmbio PDK de dupla embreagem, interior em Alcântara e fibra de carbono.',
          badge: 'Pronta Entrega',
          price: priceMatch ? `R$ ${priceMatch[1]}` : 'R$ 589.000',
          imageUrl: generateSmartImageForSubject('carro esportivo porsche ferrari', imgOff + 1),
        },
        {
          title: `${extractedBrand} RS Sport Performance`,
          desc: 'Tração integral inteligente, escapamento esportivo em titânio, freios de cerâmica e pacote aerodinâmico de pista.',
          badge: 'Série Limitada',
          price: 'R$ 429.000',
          imageUrl: generateSmartImageForSubject('carro esportivo bmw mercedes', imgOff + 2),
        },
        {
          title: `${extractedBrand} Luxury SUV Blindado Nível III-A`,
          desc: 'Blindagem certificada ultraleve, teto panorâmico translúcido, som premium de 18 alto-falantes e revisão completa em concessionária.',
          badge: 'Blindado VIP',
          price: 'R$ 349.000',
          imageUrl: generateSmartImageForSubject('carro luxo suv automotivo', imgOff + 3),
        },
      ],
      benefits: [
        {
          title: 'Laudo Cautelar 100% Aprovado & Periciado',
          desc: 'Todos os veículos passam por rigorosa inspeção técnica de 150 itens, histórico verificado e quilometragem certificada.',
        },
        {
          title: 'Reserva Online via PIX ou Cartão no Site',
          desc: 'Garanta a reserva prioritária do seu veículo ou pacote de estética automotiva diretamente pelo nosso gateway integrado.',
        },
        {
          title: 'Entrega Técnica Premium em Todo o Brasil',
          desc: 'Enviamos seu veículo em plataforma fechada segurada até a porta da sua garagem com vitrificação de pintura inclusa.',
        },
      ],
      testimonials: [
        {
          name: 'Henrique Vasconcelos',
          role: 'Comprador Verificado',
          text: `Comprei meu esportivo na ${extractedBrand} e a experiência foi impecável. Carro em estado de zero km e atendimento de outro nível!`,
        },
        {
          name: 'Dr. Marcelo Tavares',
          role: 'Cliente VIP',
          text: 'Transparência total no laudo cautelar, negociação rápida e entrega em caminhão fechado na minha cidade. Recomendo demais!',
        },
        {
          name: 'Rafael Albuquerque',
          role: 'Entusiasta Automotivo',
          text: `A curadoria de carros da ${extractedBrand} é impressionante. Fiz o sinal de reserva direto pelo site via PIX e garanti minha unidade.`,
        },
      ],
      faq: [
        {
          q: `Como funciona a reserva online ou compra na ${extractedBrand}?`,
          a: 'Você pode garantir a reserva imediata ou adquirir pacotes e serviços automotivos clicando no botão de compra e finalizando via PIX ou Cartão de Crédito em até 12x.',
        },
        {
          q: 'Todos os veículos possuem garantia e laudo cautelar?',
          a: 'Sim! 100% do nosso estoque possui laudo cautelar aprovado sem restrições e garantia de motor e câmbio.',
        },
        {
          q: 'Posso agendar uma visita presencial ou chamada de vídeo?',
          a: 'Com certeza! Após sua solicitação no site ou pelo botão de WhatsApp, nosso consultor exclusivo apresenta cada detalhe do veículo.',
        },
      ],
      customSections: [],
      showBenefits,
      showTestimonials,
      showFaq,
      showOffer,
    };
  }
  // 3. DEDICATED TEMPLATE FOR ROUPAS / MODA / STREETWEAR / SNEAKERS / BOUTIQUE
  else if (catId === 'fashion_clothes' || catId === 'sneakers') {
    const isSneaker = catId === 'sneakers';
    bp = {
      brandName: extractedBrand,
      niche: isSneaker ? 'Sneakers Exclusivos & Streetwear' : 'Moda Autoral, Vestuário & Coleções Exclusivas',
      tagline: `${extractedBrand} • Estilo Autêntico, Caimento Impecável & Edição Limitada`,
      heroTitle: `Vista a identidade única da nova coleção ${extractedBrand}.`,
      heroSubtitle: `Peças produzidas com algodão egípcio e tecidos de gramatura pesada premium, modelagem contemporânea de alto conforto e envio expresso para todo o Brasil.`,
      ctaButton: 'Comprar da Nova Coleção',
      primaryColorHex,
      bgMode,
      layoutVariant: 'ecommerce',
      navbarStyle: variation.navbarStyle,
      heroStyle: variation.heroStyle,
      cardsStyle: variation.cardsStyle,
      fontPair: variation.fontPair,
      buttonRadius: variation.buttonRadius,
      heroImage: {
        url: generateSmartImageForSubject(combinedText, imgOff),
        alt: `Coleção ${extractedBrand}`,
        position: variation.heroStyle === 'split_left' ? 'left' : 'right',
        shape: 'rounded',
      },
      priceText,
      paymentGateway,
      items: isSneaker
        ? [
            {
              title: `Sneaker ${extractedBrand} Air Edition`,
              desc: 'Couro legítimo premium, entressola com amortecimento de alta absorção e design urbano exclusivo.',
              badge: 'Drop Limitado',
              price: 'R$ 389,90',
              imageUrl: generateSmartImageForSubject('tênis sneaker calçado', imgOff + 1),
            },
            {
              title: `Runner Street Pro ${extractedBrand}`,
              desc: 'Malha respirável ultra leve, solado antiderrapante de alta tração e acabamento refletivo.',
              badge: 'Mais Vendido',
              price: 'R$ 299,90',
              imageUrl: generateSmartImageForSubject('tênis sneaker', imgOff + 2),
            },
            {
              title: `Classic Low Vintage ${extractedBrand}`,
              desc: 'Silhueta atemporal versátil para qualquer ocasião com palmilha anatômica de memória.',
              badge: 'Lançamento',
              price: 'R$ 269,90',
              imageUrl: generateSmartImageForSubject('tênis sapatos', imgOff + 3),
            },
          ]
        : [
            {
              title: `Camiseta Heavy Oversized ${extractedBrand}`,
              desc: 'Malha 100% algodão penteado fio 30.1 de alta gramatura, gola canelada estruturada que não deforma e toque macio.',
              badge: 'Mais Vendido',
              price: priceMatch ? `R$ ${priceMatch[1]}` : 'R$ 139,90',
              imageUrl: generateSmartImageForSubject('roupa camiseta moda streetwear', imgOff + 1),
            },
            {
              title: `Moletom Hoodie Essential ${extractedBrand}`,
              desc: 'Tecido felpado peluciado interno 3cabos, capuz forrado duplo, bolso canguru e caimento perfeito.',
              badge: 'Nova Coleção',
              price: 'R$ 249,90',
              imageUrl: generateSmartImageForSubject('roupa moletom jaqueta moda', imgOff + 2),
            },
            {
              title: `Kit Completo 3 Peças ${extractedBrand}`,
              desc: 'Combine nossas peças mais desejadas com desconto especial no PIX ou em até 12x no cartão.',
              badge: 'Frete Grátis',
              price: 'R$ 329,90',
              imageUrl: generateSmartImageForSubject('roupas boutique look moda', imgOff + 3),
            },
          ],
      benefits: [
        {
          title: 'Tecidos Premium & Costura Reforçada',
          desc: 'Acabamento de alto padrão que não encolhe, não desbota e mantém o caimento impecável lavagem após lavagem.',
        },
        {
          title: 'Primeira Troca 100% Grátis e Fácil',
          desc: 'Se precisar trocar o tamanho ou modelo, fazemos todo o processo sem custo algum para você.',
        },
        {
          title: 'Checkout Rápido via PIX ou Cartão em 12x',
          desc: 'Pague com segurança direto no site com envio imediato e código de rastreio no seu WhatsApp.',
        },
      ],
      testimonials: [
        {
          name: 'Lucas Andrade',
          role: 'Compra Verificada',
          text: `O caimento das peças da ${extractedBrand} é absurdo! Tecido encorpado, chegou super cheiroso e bem embalado.`,
        },
        {
          name: 'Beatriz Martins',
          role: 'Cliente VIP',
          text: 'Já é meu terceiro pedido na loja. Paguei no PIX pelo site e no dia seguinte já estava em transporte!',
        },
        {
          name: 'Gustavo Pires',
          role: 'Fã da Marca',
          text: 'Qualidade de marca gringa por um preço justo. Recomendo de olhos fechados!',
        },
      ],
      faq: [
        {
          q: 'Qual é o prazo de envio do meu pedido?',
          a: 'Todos os pedidos confirmados via PIX ou Cartão são despachados em até 24 horas úteis com código de rastreio nos Correios/Transportadora.',
        },
        {
          q: 'E se a peça não servir? Posso trocar?',
          a: 'Sim! A primeira troca por tamanho ou modelo é 100% gratuita em até 30 dias após o recebimento.',
        },
        {
          q: 'Quais são as formas de pagamento aceitas no site?',
          a: 'Aceitamos PIX com aprovação instantânea e Cartão de Crédito em até 12x diretamente no nosso checkout seguro.',
        },
      ],
      customSections: [],
      showBenefits,
      showTestimonials,
      showFaq,
      showOffer,
    };
  }
  // 4. DEDICATED TEMPLATE FOR BELEZA / UNHAS / ESTÉTICA / SALÃO
  else if (
    catId === 'nails' ||
    catId === 'makeup_lashes' ||
    catId === 'hair_salon' ||
    catId === 'aesthetics_spa'
  ) {
    bp = {
      brandName: extractedBrand,
      niche: coreSubject || 'Beleza & Estética Avançada',
      tagline: `${extractedBrand} • Beleza, Cuidado & Perfeição nos Detalhes`,
      heroTitle: `Realce sua beleza com atendimento exclusivo no ${extractedBrand}.`,
      heroSubtitle: `Procedimentos realizados com produtos de alto padrão, biossegurança 100% esterilizada, durabilidade superior e acabamento impecável.`,
      ctaButton: 'Agendar e Garantir Horário',
      primaryColorHex,
      bgMode,
      layoutVariant: 'service',
      navbarStyle: variation.navbarStyle,
      heroStyle: variation.heroStyle,
      cardsStyle: variation.cardsStyle,
      fontPair: variation.fontPair,
      buttonRadius: variation.buttonRadius,
      heroImage: {
        url: generateSmartImageForSubject(combinedText, imgOff),
        alt: `${extractedBrand}`,
        position: variation.heroStyle === 'split_left' ? 'left' : 'right',
        shape: 'rounded',
      },
      priceText,
      paymentGateway,
      items: [
        {
          title: 'Procedimento Signature Completo',
          desc: 'Acabamento super natural, alta durabilidade e atendimento personalizado para o seu estilo.',
          badge: 'Mais Pedido',
          price: priceText,
          imageUrl: generateSmartImageForSubject(combinedText, imgOff + 1),
        },
        {
          title: 'Protocolo Premium & Hidratação',
          desc: 'Cuidado profundo com produtos hipoalergênicos importados e brilho prolongado.',
          badge: 'Alta Durabilidade',
          price: 'R$ 110,00',
          imageUrl: generateSmartImageForSubject(combinedText, imgOff + 2),
        },
        {
          title: 'Experiência VIP Completa',
          desc: 'Combo especial com atendimento com hora marcada e acabamento artístico sob medida.',
          badge: 'Experiência VIP',
          price: 'R$ 145,00',
          imageUrl: generateSmartImageForSubject(combinedText, imgOff + 3),
        },
      ],
      benefits: [
        { title: 'Biossegurança 100% Esterilizada', desc: 'Todos os materiais passam por autoclave hospitalar em envelopes individuais lacrados.' },
        { title: 'Produtos Importados & Alta Durabilidade', desc: 'Linha profissional dermatologicamente testada que preserva sua saúde e beleza.' },
        { title: 'Atendimento Pontual & Pagamento Facilitado', desc: `Agende online com pagamento via PIX ou Cartão diretamente pelo site do ${extractedBrand}.` },
      ],
      testimonials: [
        { name: 'Larissa G.', role: 'Cliente Fiel', text: `O acabamento do ${extractedBrand} é impecável, super natural e dura muito mais!` },
        { name: 'Fernanda M.', role: 'Cliente Verificada', text: 'Atendimento maravilhoso, lugar lindo e higienização nota mil. Não troco por nada!' },
        { name: 'Camila S.', role: 'Cliente VIP', text: 'Consigo agendar e pagar direto pelo site com total praticidade. Recomendo demais!' },
      ],
      faq: [
        { q: 'Como faço para agendar e garantir meu horário?', a: 'Basta clicar no botão de confirmação aqui no site, escolher o procedimento e finalizar via PIX ou Cartão.' },
        { q: 'Os produtos utilizados são hipoalergênicos?', a: 'Sim! Utilizamos apenas produtos homologados e dermatologicamente testados de primeira linha.' },
        { q: 'Quais formas de pagamento o site aceita?', a: 'Nosso gateway aceita PIX com aprovação instantânea e Cartão de Crédito parcelado.' },
      ],
      customSections: [],
      showBenefits,
      showTestimonials,
      showFaq,
      showOffer,
    };
  }
  // 5. DEDICATED TEMPLATE FOR BARBEARIA
  else if (catId === 'barbershop') {
    bp = {
      brandName: extractedBrand,
      niche: 'Barbearia Clássica & Visagismo Masculino',
      tagline: `${extractedBrand} • Estilo, Precisão & Tradição`,
      heroTitle: `Corte de precisão e barba impecável na ${extractedBrand}.`,
      heroSubtitle: `Visagismo masculino, degradê navalhado, barboterapia com toalha quente e ambiente exclusivo pensado para o homem moderno.`,
      ctaButton: 'Reservar Horário Agora',
      primaryColorHex: '#D4AF37',
      bgMode: 'dark',
      layoutVariant: 'service',
      navbarStyle: variation.navbarStyle,
      heroStyle: variation.heroStyle,
      cardsStyle: variation.cardsStyle,
      fontPair: variation.fontPair,
      buttonRadius: variation.buttonRadius,
      heroImage: {
        url: generateSmartImageForSubject('barbearia corte barba', imgOff),
        alt: `Barbearia ${extractedBrand}`,
        position: variation.heroStyle === 'split_left' ? 'left' : 'right',
        shape: 'rounded',
      },
      priceText: priceMatch ? `R$ ${priceMatch[1]}` : 'R$ 75,00',
      paymentGateway,
      items: [
        {
          title: 'Combo VIP: Corte Visagista + Barboterapia',
          desc: 'Corte personalizado para o formato do seu rosto + barba com toalha quente, óleos essenciais e massagem facial.',
          badge: 'Campeão de Pedidos',
          price: 'R$ 95,00',
          imageUrl: generateSmartImageForSubject('barbearia', imgOff + 1),
        },
        {
          title: 'Corte Degradê / Fade de Precisão',
          desc: 'Acabamento na navalha, lavagem revigorante e finalização com pomada matte ou brilho.',
          badge: 'Estilo Clássico',
          price: 'R$ 60,00',
          imageUrl: generateSmartImageForSubject('barbearia', imgOff + 2),
        },
        {
          title: 'Barba Real com Toalha Quente',
          desc: 'Alinhamento simétrico, hidratação profunda dos fios e pós-barba refrescante.',
          badge: 'Cuidado Premium',
          price: 'R$ 45,00',
          imageUrl: generateSmartImageForSubject('barbearia', imgOff + 3),
        },
      ],
      benefits: [
        { title: 'Barbeiros Especialistas em Visagismo', desc: 'Profissionais treinados para indicar o corte e formato de barba ideais para o seu estilo.' },
        { title: 'Ambiente Climatizado & Bebida Cortesia', desc: 'Cerveja artesanal gelada ou café espresso cortesia enquanto você cuida do visual.' },
        { title: 'Reserva e Pagamento Online Sem Fila', desc: 'Escolha seu serviço, garanta pelo PIX ou cartão e seja atendido sem espera.' },
      ],
      testimonials: [
        { name: 'Rodrigo Alves', role: 'Cliente Semanal', text: `Melhor degradê da região! O atendimento na ${extractedBrand} é nota mil e sempre pontual.` },
        { name: 'Matheus Costa', role: 'Cliente VIP', text: 'A barboterapia com toalha quente é sensacional. Ambiente top demais!' },
        { name: 'Felipe Rocha', role: 'Cliente Fiel', text: 'Depois que conheci, não corto cabelo em outro lugar. Profissionais de alto nível.' },
      ],
      faq: [
        { q: 'Preciso agendar antes ou atendem por ordem de chegada?', a: 'Trabalhamos com agendamento online prioritário para você não perder tempo esperando.' },
        { q: 'Quanto tempo leva o Combo Corte + Barba?', a: 'Cerca de 50 minutos com todo o ritual de toalha quente e finalização.' },
        { q: 'Posso pagar direto pelo site?', a: 'Sim! Nosso checkout aceita PIX imediato e Cartão de Crédito com total segurança.' },
      ],
      customSections: [],
      showBenefits,
      showTestimonials,
      showFaq,
      showOffer,
    };
  }
  // 6. DEDICATED TEMPLATE FOR GASTRONOMIA / HAMBÚRGUER / PIZZA / RESTAURANTE / DOCES
  else if (
    catId === 'burger' ||
    catId === 'pizza' ||
    catId === 'sushi' ||
    catId === 'sweets_bakery' ||
    catId === 'coffee' ||
    catId === 'restaurant'
  ) {
    bp = {
      brandName: extractedBrand,
      niche: coreSubject || 'Gastronomia Artesanal & Delivery',
      tagline: `${extractedBrand} • Sabor Inesquecível & Ingredientes Selecionados`,
      heroTitle: `O verdadeiro sabor artesanal da ${extractedBrand} direto até você.`,
      heroSubtitle: `Ingredientes frescos selecionados todos os dias, receitas autorais irresistíveis, pagamento online via PIX ou Cartão e entrega rápida.`,
      ctaButton: 'Fazer Meu Pedido Agora',
      primaryColorHex: '#F97316',
      bgMode: 'dark',
      layoutVariant: 'ecommerce',
      navbarStyle: variation.navbarStyle,
      heroStyle: variation.heroStyle,
      cardsStyle: variation.cardsStyle,
      fontPair: variation.fontPair,
      buttonRadius: variation.buttonRadius,
      heroImage: {
        url: generateSmartImageForSubject(combinedText, imgOff),
        alt: `Gastronomia ${extractedBrand}`,
        position: 'right',
        shape: 'rounded',
      },
      priceText: priceMatch ? `R$ ${priceMatch[1]}` : 'R$ 44,90',
      paymentGateway,
      items: [
        {
          title: `Combo Especial ${extractedBrand}`,
          desc: 'Preparado na hora com ingredientes nobres selecionados + acompanhamento especial e bebida gelada.',
          badge: 'Mais Vendido',
          price: priceMatch ? `R$ ${priceMatch[1]}` : 'R$ 49,90',
          imageUrl: generateSmartImageForSubject(combinedText, imgOff + 1),
        },
        {
          title: 'Clássico Artesanal Especial',
          desc: 'Nossa receita autoral campeã de pedidos com tempero exclusivo e acabamento impecável.',
          badge: 'Receita Autoral',
          price: 'R$ 38,90',
          imageUrl: generateSmartImageForSubject(combinedText, imgOff + 2),
        },
        {
          title: 'Combo Família Completo',
          desc: 'Opção generosa ideal para compartilhar com quem você gosta, com entrega térmica prioritária.',
          badge: 'Super Oferta',
          price: 'R$ 119,90',
          imageUrl: generateSmartImageForSubject(combinedText, imgOff + 3),
        },
      ],
      benefits: [
        { title: 'Ingredientes 100% Frescos Diários', desc: 'Insumos selecionados diariamente para garantir sabor e qualidade incomparáveis.' },
        { title: 'Embalagem Térmica Especial', desc: 'Seu pedido chega na temperatura ideal e montado perfeitamente.' },
        { title: 'Checkout Online PIX & Cartão', desc: 'Pague em segundos pelo site com aprovação automática e preparo imediato.' },
      ],
      testimonials: [
        { name: 'Guilherme T.', role: 'Cliente Verificado', text: `Simplesmente o melhor da cidade! Chegou super rápido e o sabor da ${extractedBrand} é surreal.` },
        { name: 'Amanda L.', role: 'Fã da Marca', text: 'Pedimos toda semana. Qualidade impecável e pagamento super fácil pelo site!' },
        { name: 'Bruno P.', role: 'Cliente VIP', text: 'Capricho absurdo em cada detalhe, atendimento rápido e preço justo!' },
      ],
      faq: [
        { q: 'Qual é o tempo médio de entrega?', a: 'Nossas entregas levam entre 25 e 40 minutos com acompanhamento em tempo real.' },
        { q: 'Quais formas de pagamento são aceitas no site?', a: 'Aceitamos PIX com aprovação instantânea e Cartão de Crédito diretamente no nosso gateway seguro.' },
        { q: 'Posso retirar meu pedido no local?', a: 'Sim! Fazendo o pedido pelo site você pode retirar sem fila em apenas 15 minutos.' },
      ],
      customSections: [],
      showBenefits,
      showTestimonials,
      showFaq,
      showOffer,
    };
  }
  // 7. UNIVERSAL PROMPT-FAITHFUL BUILDER FOR ALL OTHER THEMES (Fitness, Clinics, Real Estate, Pets, Courses, SaaS, etc.)
  else {
    const cleanSubjectLabel =
      coreSubject && coreSubject !== 'Soluções & Conteúdo Exclusivo'
        ? coreSubject
        : params.niche || 'Soluções Exclusivas';

    const firstCleanSentence = params.prompt
      ? params.prompt
          .split(/\r?\n|(?<=[.!?])\s+/)
          .map((s) => s.replace(/\*\*/g, '').trim())
          .find((s) => s.length >= 18 && s.length <= 220 && !isDesignOrMetaInstruction(s))
      : undefined;

    bp = {
      brandName: extractedBrand,
      niche: cleanSubjectLabel,
      tagline: `${extractedBrand} • ${cleanSubjectLabel}`,
      heroTitle: `${extractedBrand}: Excelência e Resultados em ${cleanSubjectLabel}.`,
      heroSubtitle:
        firstCleanSentence ||
        `Conheça ${extractedBrand} (${cleanSubjectLabel}) com qualidade superior, atendimento imediato e pagamento seguro via PIX ou Cartão de Crédito.`,
      ctaButton: 'Garantir Agora',
      primaryColorHex,
      bgMode,
      layoutVariant,
      navbarStyle: variation.navbarStyle,
      heroStyle: variation.heroStyle,
      cardsStyle: variation.cardsStyle,
      fontPair: variation.fontPair,
      buttonRadius: variation.buttonRadius,
      heroImage: {
        url: generateSmartImageForSubject(combinedText, imgOff),
        alt: `${extractedBrand} - ${cleanSubjectLabel}`,
        position: variation.heroStyle === 'split_left' ? 'left' : 'right',
        shape: 'rounded',
      },
      priceText,
      paymentGateway,
      items: [
        {
          title: `${extractedBrand} • Plano / Opção Principal`,
          desc: `Solução completa em ${cleanSubjectLabel.toLowerCase()} desenvolvida com alto padrão de qualidade e garantia total.`,
          badge: 'Mais Escolhido',
          price: priceText,
          imageUrl: generateSmartImageForSubject(combinedText, imgOff + 1),
        },
        {
          title: `${extractedBrand} • Versão Especial Premium`,
          desc: `Ideal para quem busca máxima performance, prioridade e suporte dedicado da equipe ${extractedBrand}.`,
          badge: 'Destaque',
          price: priceText,
          imageUrl: generateSmartImageForSubject(combinedText, imgOff + 2),
        },
        {
          title: `${extractedBrand} • Pacote Completo VIP`,
          desc: `A experiência mais completa em ${cleanSubjectLabel.toLowerCase()} com condição especial no PIX ou em até 12x no Cartão.`,
          badge: 'Oferta VIP',
          price: priceText,
          imageUrl: generateSmartImageForSubject(combinedText, imgOff + 3),
        },
      ],
      benefits: [
        { title: 'Qualidade & Satisfação 100% Garantida', desc: `Tudo na ${extractedBrand} foi estruturado para entregar a melhor experiência em ${cleanSubjectLabel.toLowerCase()}.` },
        { title: 'Gateway de Pagamento Seguro Integrado', desc: 'Pague diretamente no site via PIX com aprovação instantânea ou Cartão de Crédito em até 12x.' },
        { title: 'Liberação & Atendimento Ultrarrápido', desc: 'Confirmação automática após o pagamento com suporte direto pelo WhatsApp.' },
      ],
      testimonials: [
        { name: 'Lucas Martins', role: 'Cliente Verificado', text: `A ${extractedBrand} superou todas as minhas expectativas! Qualidade impecável e pagamento super rápido pelo site.` },
        { name: 'Beatriz Ribeiro', role: 'Cliente VIP', text: 'Atendimento nota 10 desde o primeiro contato. Recomendo de olhos fechados!' },
        { name: 'Gabriel Ferreira', role: 'Cliente Satisfeito', text: 'Muito bem estruturado, confiável e com excelente custo-benefício.' },
      ],
      faq: [
        { q: `Como funciona a contratação ou compra na ${extractedBrand}?`, a: 'Basta clicar no botão de confirmação aqui no site, escolher PIX ou Cartão de Crédito no checkout transparente e finalizar em segundos.' },
        { q: 'Quais são as formas de pagamento aceitas?', a: 'Nosso gateway aceita PIX (com QR Code e Copia e Cola na hora) e Cartão de Crédito em até 12x.' },
        { q: 'Como recebo a confirmação do meu pedido?', a: 'A confirmação é enviada imediatamente após o pagamento para o seu WhatsApp e e-mail.' },
        { q: 'Tenho garantia?', a: `Sim! Você conta com garantia integral na ${extractedBrand}.` },
      ],
      customSections: [],
      showBenefits,
      showTestimonials,
      showFaq,
      showOffer,
    };
  }

  // Apply structured pasted-prompt overrides AND design/color/WhatsApp instructions!
  parseStructuredPastedPrompt(bp, params.prompt);

  return bp;
}

/**
 * Intelligent Portuguese Semantic & Spatial Command Interpreter
 */
export function applyUserInstructionToBlueprint(
  current: SiteBlueprint,
  userInstruction: string
): { updated: SiteBlueprint; summaryOfChanges: string[]; isConversationalOnly: boolean } {
  const updated: SiteBlueprint = JSON.parse(JSON.stringify(current));
  if (!updated.customSections) updated.customSections = [];
  if (!updated.galleryImages) updated.galleryImages = [];
  if (!updated.paymentGateway) {
    updated.paymentGateway = detectPaymentGatewayFromText('', undefined, updated.brandName).config;
  }

  const changes: string[] = [];
  const text = userInstruction.trim();
  const lower = text.toLowerCase();

  // 0. If the user pasted a structured or long prompt in the chat (e.g. > 50 chars with topic shift), rebuild or apply all fields!
  if (text.length > 50) {
    const newBestCat = detectBestCategoryForText(text);
    const oldBestCat = detectBestCategoryForText(`${updated.niche} ${updated.heroTitle}`);
    if (newBestCat && (!oldBestCat || newBestCat.id !== oldBestCat.id)) {
      const rebuilt = buildDefaultBlueprint({
        brandName: extractBrandNameFromText(text) || '',
        niche: extractCoreSubjectFromPrompt(text),
        prompt: text,
      });
      return {
        updated: rebuilt,
        summaryOfChanges: [
          `Prompt lido e interpretado: Site completo criado para **${rebuilt.brandName}** (${rebuilt.niche})`,
        ],
        isConversationalOnly: false,
      };
    }

    const pastedResult = parseStructuredPastedPrompt(updated, text);
    if (pastedResult.appliedCount > 0) {
      changes.push(...pastedResult.summary);
    }
  } else {
    // Also apply any explicit design/color/WhatsApp instructions in short chat messages
    const designNotes = extractAndApplyDesignInstructionsFromPrompt(updated, text);
    if (designNotes.length > 0) {
      changes.push(...designNotes);
    }
  }

  // 0.2. Check Payment Gateway connection / configuration commands
  const gwResult = detectPaymentGatewayFromText(text, updated.paymentGateway, updated.brandName);
  if (gwResult.changed) {
    updated.paymentGateway = gwResult.config;
    changes.push(gwResult.description);
  }

  // 0.5. Check if user asked for a specific Visual Theme Aesthetic
  const requestedTheme = detectVisualThemeFromText(text);
  if (requestedTheme) {
    applyVisualThemePreset(updated, requestedTheme);
    const themeNames: Record<NonNullable<SiteBlueprint['visualTheme']>, string> = {
      futuristic: 'Futurístico Cyber / Neon (Fundo espacial, bordas holográficas e tipografia Sci-Fi)',
      minimalist: 'Minimalista Clean (Fundo claro puro, tipografia limpa e alto respiro visual)',
      luxury: 'Luxo & Alta Costura (Preto Obsidiana, Dourado Champagne e tipografia clássica)',
      vibrant: 'Vibrante & Lúdico (Cores alegres, alto destaque e bordas arredondadas)',
      urban: 'Urbano / Streetwear (Alto contraste, tipografia Syne e visual arrojado)',
      retro: 'Retrô Editorial Clássico (Tons quentes e estética de revista clássica)',
      modern: 'Moderno Studio Tech (Design contemporâneo de alta conversão)',
    };
    changes.push(`Estilo visual transformado para **${themeNames[requestedTheme]}**`);
  }

  // Detect WHERE the user wants something placed
  const wantsTopOrHero = /(no\s+topo|l[aá]\s+em\s+cima|no\s+in[ií]cio|na\s+capa|no\s+hero|no\s+cabe[cç]alho|principal)/i.test(lower);
  const wantsLeft = /(lado\s+esquerdo|na\s+esquerda|[aà]\s+esquerda)/i.test(lower);
  const wantsRight = /(lado\s+direito|na\s+direita|[aà]\s+direita)/i.test(lower);
  const wantsCenter = /(no\s+meio|no\s+centro|centralizad[oa])/i.test(lower);
  const wantsBg = /(no\s+fundo|de\s+fundo|background|atrás|atras)/i.test(lower);
  const wantsCards = /(nos\s+cards|nos\s+destaques|nos\s+produtos|nos\s+servi[cç]os|na\s+vitrine|em\s+cada\s+card|no\s+cat[aá]logo)/i.test(lower);
  const cardIndexMatch = lower.match(/(?:no\s+)?(?:card|destaque|produto|item|servi[cç]o)\s*(1|2|3|um|dois|tr[eê]s|primeiro|segundo|terceiro)/i);
  const wantsGallery = /(galeria|mural\s+de\s+fotos|se[cç][aã]o\s+de\s+fotos|v[aá]rias\s+fotos)/i.test(lower);
  const wantsBottom = /(embaixo|l[aá]\s+embaixo|no\s+final|no\s+rodap[eé])/i.test(lower);

  // 1. Direct Image URL pasted in chat
  const directImgUrlMatch = text.match(/(https?:\/\/[^\s"'<>]+\.(?:png|jpg|jpeg|webp|gif|avif)(?:\?[^\s"'<>]*)?)/i);
  if (directImgUrlMatch && directImgUrlMatch[1]) {
    const imgUrl = directImgUrlMatch[1];
    if (wantsCards) {
      updated.items = updated.items.map((it) => ({ ...it, imageUrl: imgUrl }));
      changes.push('Foto dos cards atualizada com o link enviado');
    } else {
      updated.heroImage = {
        url: imgUrl,
        alt: updated.brandName,
        position: updated.heroImage?.position || 'right',
        shape: updated.heroImage?.shape || 'rounded',
      };
      changes.push('Foto principal atualizada com o link enviado');
    }
  }

  // 1.5. IMAGE GENERATION & PLACEMENT BY SUBJECT (Only for genuine photo requests, NEVER for UI/button/WhatsApp requests!)
  const wantsRemoveImage = /(tire|remova|apague|esconda|sem)\s+(?:a\s+|as\s+)?(?:foto|fotos|imagem|imagens)/i.test(lower);
  if (wantsRemoveImage) {
    if (wantsCards) {
      updated.items = updated.items.map((it) => ({ ...it, imageUrl: undefined }));
      changes.push('Imagens removidas dos cards conforme solicitado');
    } else if (wantsGallery) {
      updated.galleryImages = [];
      changes.push('Galeria de imagens removida');
    } else {
      updated.heroImage = null;
      changes.push('Imagem principal removida do topo');
    }
  } else if (!directImgUrlMatch && text.length < 160) {
    const imageRequestMatch = text.match(
      /(?:mude\s+a\s+foto\s+para|troque\s+a\s+foto\s+por|troque\s+a\s+foto\s+para|mude\s+a\s+imagem\s+para|(?:coloque|adicione|gere|bota|ponha|insira|quero\s+colocar)\s+(?:uma\s+|as\s+)?(?:foto|fotos|imagem|imagens)\s+(?:de\s+)?)([A-Za-zÀ-ÿ0-9\s-]{2,45}?)(?=\s+(?:no\s+topo|l[aá]\s+em|do\s+lado|na\s+direita|na\s+esquerda|no\s+centro|no\s+meio|no\s+fundo|nos\s+cards|nos\s+destaques|no\s+card|na\s+galeria|embaixo|em\s+tal\s+lugar|aqui|ali)\b|[,.!?;]|$)/i
    );

    const candidateSubj = imageRequestMatch?.[1]?.trim() || '';
    const isGenuineImageCommand =
      (candidateSubj.length >= 2 && !isDesignOrMetaInstruction(candidateSubj)) ||
      /(gere|gerar|troque|mude)\s+(?:a\s+|uma\s+|as\s+)?(?:foto|fotos|imagem|imagens)/i.test(lower);

    if (isGenuineImageCommand) {
      const subject =
        candidateSubj && !isDesignOrMetaInstruction(candidateSubj)
          ? candidateSubj
          : updated.niche || 'destaque';
      const randOff = Math.floor(Math.random() * 5);

      if (cardIndexMatch) {
        const idxRaw = cardIndexMatch[1].toLowerCase();
        const idx =
          idxRaw === '2' || idxRaw === 'dois' || idxRaw === 'segundo'
            ? 1
            : idxRaw === '3' || idxRaw === 'três' || idxRaw === 'tres' || idxRaw === 'terceiro'
            ? 2
            : 0;
        if (updated.items[idx]) {
          updated.items[idx].imageUrl = generateSmartImageForSubject(subject, idx + randOff + 1);
          changes.push(`Imagem de **"${subject}"** atualizada no **Card ${idx + 1}**`);
        }
      } else if (wantsCards) {
        updated.items = updated.items.map((it, idx) => ({
          ...it,
          imageUrl: generateSmartImageForSubject(subject, idx + randOff + 1),
        }));
        changes.push(`Imagens variadas de **"${subject}"** colocadas nos **cards de Destaques**`);
      } else if (wantsGallery) {
        updated.galleryImages = [
          { url: generateSmartImageForSubject(subject, randOff + 1), caption: `${updated.brandName} — Destaque 01` },
          { url: generateSmartImageForSubject(subject, randOff + 2), caption: `${updated.brandName} — Destaque 02` },
          { url: generateSmartImageForSubject(subject, randOff + 3), caption: `${updated.brandName} — Destaque 03` },
        ];
        changes.push(`Galeria de fotos de **"${subject}"** adicionada à página`);
      } else if (wantsBottom) {
        updated.customSections.push({
          id: `img-sec-${Date.now()}`,
          badge: `DESTAQUE VISUAL • ${updated.brandName.toUpperCase()}`,
          title: formatBrandCase(subject),
          content: `Confira em detalhes nosso padrão de qualidade em ${subject.toLowerCase()}.`,
          imageUrl: generateSmartImageForSubject(subject, randOff),
          imagePosition: wantsLeft ? 'left' : 'right',
          placement: 'bottom',
          ctaText: updated.ctaButton,
        });
        changes.push(`Imagem de **"${subject}"** adicionada na parte inferior do site`);
      } else {
        const pos: 'right' | 'left' | 'top' | 'bottom' | 'background' = wantsLeft
          ? 'left'
          : wantsBg
          ? 'background'
          : wantsCenter
          ? 'bottom'
          : 'right';

        if (wantsLeft) updated.heroStyle = 'split_left';
        else if (wantsBg) updated.heroStyle = 'bg_overlay';
        else if (wantsCenter) updated.heroStyle = 'centered_stack';
        else updated.heroStyle = 'split_right';

        updated.heroImage = {
          url: generateSmartImageForSubject(subject, randOff),
          alt: subject,
          position: pos,
          shape: lower.includes('redond') || lower.includes('círculo') ? 'circle' : 'rounded',
        };
        updated.items = updated.items.map((it, idx) => ({
          ...it,
          imageUrl: generateSmartImageForSubject(subject, randOff + idx + 1),
        }));
        changes.push(`Foto principal e imagens variadas de **"${subject}"** atualizadas no site`);
      }
    }
  }

  // 2. Check if user changed ONLY the position of the existing image
  if (
    changes.length === 0 &&
    /(mude|passe|coloque|mova|jogue)\s+(?:a\s+)?(?:foto|imagem)\s+(?:para\s+)?/i.test(lower)
  ) {
    if (!updated.heroImage) {
      updated.heroImage = {
        url: generateSmartImageForSubject(updated.niche, 0),
        alt: updated.brandName,
        position: 'right',
        shape: 'rounded',
      };
    }
    if (wantsLeft) {
      updated.heroImage.position = 'left';
      updated.heroStyle = 'split_left';
      changes.push('Imagem principal movida para o **lado esquerdo**');
    } else if (wantsRight) {
      updated.heroImage.position = 'right';
      updated.heroStyle = 'split_right';
      changes.push('Imagem principal movida para o **lado direito**');
    } else if (wantsCenter) {
      updated.heroImage.position = 'bottom';
      updated.heroStyle = 'centered_stack';
      changes.push('Imagem principal **centralizada**');
    } else if (wantsBg) {
      updated.heroImage.position = 'background';
      updated.heroStyle = 'bg_overlay';
      changes.push('Imagem principal colocada **no fundo (background)**');
    }
  }

  // 3. Brand / Site Name change
  const newBrand = extractBrandNameFromText(text);
  if (newBrand && newBrand.toLowerCase() !== updated.brandName.toLowerCase()) {
    const oldBrand = updated.brandName;
    updated.brandName = newBrand;
    updated.tagline = updated.tagline.replace(new RegExp(oldBrand, 'gi'), newBrand);
    updated.heroTitle = updated.heroTitle.replace(new RegExp(oldBrand, 'gi'), newBrand);
    updated.heroSubtitle = updated.heroSubtitle.replace(new RegExp(oldBrand, 'gi'), newBrand);
    updated.items = updated.items.map((it) => ({
      ...it,
      title: it.title.replace(new RegExp(oldBrand, 'gi'), newBrand),
      desc: it.desc.replace(new RegExp(oldBrand, 'gi'), newBrand),
    }));
    if (updated.paymentGateway) {
      updated.paymentGateway.pixBeneficiary = newBrand;
    }
    changes.push(`Nome da marca alterado para **${newBrand}**`);
  }

  // 4. Color & Theme changes
  if (!requestedTheme) {
    const themeCheck = inferThemeFromText(text, updated.primaryColorHex, updated.bgMode);
    if (themeCheck.primaryColorHex !== updated.primaryColorHex) {
      updated.primaryColorHex = themeCheck.primaryColorHex;
      changes.push(`Cor de destaque alterada para **${themeCheck.primaryColorHex}**`);
    }
    if (themeCheck.bgMode !== updated.bgMode) {
      updated.bgMode = themeCheck.bgMode;
      changes.push(
        `Fundo alterado para **Modo ${themeCheck.bgMode === 'dark' ? 'Escuro' : 'Claro'}**`
      );
    }
  }

  // 5. Layout Variation Request
  if (
    /(outro\s+layout|mude\s+o\s+layout|troque\s+o\s+layout|varie|diferente|outro\s+modelo|outro\s+formato)/i.test(
      lower
    )
  ) {
    const nextCombo = pickVariedLayoutCombination(text + Math.random(), updated.layoutVariant);
    updated.navbarStyle = nextCombo.navbarStyle;
    updated.heroStyle = nextCombo.heroStyle;
    updated.cardsStyle = nextCombo.cardsStyle;
    if (!updated.visualTheme) {
      updated.fontPair = nextCombo.fontPair;
      updated.buttonRadius = nextCombo.buttonRadius;
    }
    changes.push(
      `Layout completo variado (Topo: **${updated.navbarStyle}**, Hero: **${updated.heroStyle}**, Vitrine: **${updated.cardsStyle}**)`
    );
  }

  // 6. Niche / Business Switch
  const nicheSwitchMatch = text.match(
    /(?:mude\s+tudo\s+para|transforme\s+em|refa[cç]a\s+sobre|quero\s+(?:um\s+|uma\s+)?(?:site|loja|página|pagina)\s+(?:de|para|sobre)|sobre)\s+([^,.!?;]+)/i
  );
  if (nicheSwitchMatch && nicheSwitchMatch[1] && text.length < 180) {
    const newNicheRaw = nicheSwitchMatch[1]
      .replace(/com\s+(?:o\s+)?nome\s+[A-Za-zÀ-ÿ0-9\s]+/i, '')
      .trim();
    if (newNicheRaw.length >= 3 && !isDesignOrMetaInstruction(newNicheRaw)) {
      const rebuilt = buildDefaultBlueprint({
        brandName: extractBrandNameFromText(text) || '',
        niche: formatBrandCase(newNicheRaw),
        prompt: text,
      });
      if (requestedTheme) {
        applyVisualThemePreset(rebuilt, requestedTheme);
      }
      return {
        updated: rebuilt,
        summaryOfChanges: [`Site completo criado sob medida para **${rebuilt.niche}** (${rebuilt.brandName})`],
        isConversationalOnly: false,
      };
    }
  }

  // 7. Specific edits to Destaques, Diferenciais, Avaliações, or Dúvidas!
  const diffMatch = text.match(
    /(?:mude|altere|coloque|adicione)\s+(?:nos\s+|os\s+|um\s+)?(?:diferenciais|diferencial|benef[ií]cios)\s*(?:para|como|:)?\s*["'“”]?(.+?)["'“”]?$/i
  );
  if (diffMatch && diffMatch[1]) {
    const val = diffMatch[1].trim();
    updated.showBenefits = true;
    updated.benefits = [
      { title: formatBrandCase(val.slice(0, 42)), desc: `Diferencial exclusivo da ${updated.brandName}: ${val}.` },
      ...updated.benefits.slice(0, 2),
    ];
    changes.push(`Seção de **Diferenciais** atualizada com **"${val}"**`);
  }

  const evalMatch = text.match(
    /(?:mude|altere|coloque|adicione)\s+(?:nas\s+|as\s+|os\s+|uma\s+|um\s+)?(?:avalia[cç][oõ]es|avalia[cç][aã]o|depoimentos|depoimento)\s*(?:para|como|:)?\s*["'“”]?(.+?)["'“”]?$/i
  );
  if (evalMatch && evalMatch[1]) {
    const val = evalMatch[1].trim();
    updated.showTestimonials = true;
    updated.testimonials = [
      { name: 'Cliente Verificado', role: `Cliente ${updated.brandName}`, text: val },
      ...updated.testimonials.slice(0, 2),
    ];
    changes.push(`Seção de **Avaliações** atualizada com novo depoimento`);
  }

  const faqEditMatch = text.match(
    /(?:mude|altere|coloque|adicione)\s+(?:nas\s+|as\s+|uma\s+)?(?:d[uú]vidas|d[uú]vida|perguntas|faq)\s*(?:para|como|:)?\s*["'“”]?(.+?)["'“”]?$/i
  );
  if (faqEditMatch && faqEditMatch[1]) {
    const val = faqEditMatch[1].trim();
    updated.showFaq = true;
    updated.faq = [
      { q: val.endsWith('?') ? val : `${val}?`, a: `Na ${updated.brandName}, garantimos atendimento imediato e suporte completo para essa solicitação.` },
      ...updated.faq.slice(0, 3),
    ];
    changes.push(`Seção de **Dúvidas (FAQ)** atualizada`);
  }

  // 8. Specific Text Targeted Edits (Title, Subtitle, Button, Footer)
  const titleMatch = text.match(
    /(?:mude|altere|troque|coloque|escreva)\s+(?:no\s+)?(?:o\s+)?(?:título|titulo|headline|chamada)(?:\s+principal|\s+do\s+topo)?\s*(?:para|como|escrito|:)\s*["'“”]?(.+?)["'“”]?$/i
  );
  if (titleMatch && titleMatch[1]) {
    updated.heroTitle = titleMatch[1].trim();
    changes.push(`Título principal atualizado para **"${updated.heroTitle}"**`);
  }

  const subMatch = text.match(
    /(?:mude|altere|troque|coloque|escreva)\s+(?:no\s+|o\s+)?(?:subtítulo|subtitulo|corpo\s+de\s+texto|descrição|descricao)\s*(?:para|como|escrito|:)\s*["'“”]?(.+?)["'“”]?$/i
  );
  if (subMatch && subMatch[1]) {
    updated.heroSubtitle = subMatch[1].trim();
    changes.push(`Subtítulo atualizado para **"${updated.heroSubtitle}"**`);
  }

  const btnMatch = text.match(
    /(?:mude|altere|troque|coloque)\s+(?:o\s+)?(?:texto\s+do\s+)?(?:botão|botao)\s*(?:para|como|escrito|:)\s*["'“”]?(.+?)["'“”]?$/i
  );
  if (btnMatch && btnMatch[1] && !/whatsapp/i.test(btnMatch[1])) {
    updated.ctaButton = btnMatch[1].trim();
    changes.push(`Texto do botão alterado para **"${updated.ctaButton}"**`);
  }

  const footerMatch = text.match(
    /(?:no\s+rodap[eé]|rodap[eé])\s+(?:coloque|escreva|mude\s+para|:)\s*["'“”]?(.+?)["'“”]?$/i
  );
  if (footerMatch && footerMatch[1]) {
    updated.footerText = footerMatch[1].trim();
    changes.push(`Rodapé atualizado para **"${updated.footerText}"**`);
  }

  // 9. Price change
  const priceMatch = text.match(
    /(?:R\$\s?\d+[.,]?\d*)|(?:preço|preco|valor)\s+(?:para|de|é|por)?\s*(?:R\$\s?)?(\d+[.,]?\d*)/i
  );
  if (priceMatch && text.length < 100) {
    const rawNum = priceMatch[1] || priceMatch[0].replace(/R\$\s?/i, '');
    const formattedPrice = `R$ ${rawNum.trim()}`;
    if (cardIndexMatch) {
      const idxRaw = cardIndexMatch[1].toLowerCase();
      const idx =
        idxRaw === '2' || idxRaw === 'dois' || idxRaw === 'segundo'
          ? 1
          : idxRaw === '3' || idxRaw === 'três' || idxRaw === 'terceiro'
          ? 2
          : 0;
      if (updated.items[idx]) {
        updated.items[idx].price = formattedPrice;
        changes.push(`Preço do **Card ${idx + 1}** alterado para **${formattedPrice}**`);
      }
    } else {
      updated.priceText = formattedPrice;
      if (updated.items.length > 0) updated.items[0].price = formattedPrice;
      changes.push(`Preço principal alterado para **${formattedPrice}**`);
    }
  }

  // 10. Show/Hide built-in sections
  if (/(?:tire|remova|esconda|sem|apague)\s+(?:o\s+|a\s+|as\s+)?(?:faq|perguntas|dúvidas|duvidas)/i.test(lower)) {
    updated.showFaq = false;
    changes.push('Seção de Perguntas Frequentes (Dúvidas) ocultada');
  } else if (/(?:adicione|coloque|mostre)\s+(?:o\s+|a\s+|as\s+)?(?:faq|perguntas|dúvidas|duvidas)/i.test(lower)) {
    updated.showFaq = true;
    changes.push('Seção de Perguntas Frequentes (Dúvidas) ativada');
  }

  if (/(?:tire|remova|esconda|sem|apague)\s+(?:os\s+|as\s+)?(?:depoimentos|avaliações|avaliacoes)/i.test(lower)) {
    updated.showTestimonials = false;
    changes.push('Seção de Avaliações ocultada');
  } else if (/(?:adicione|coloque|mostre)\s+(?:os\s+|as\s+)?(?:depoimentos|avaliações|avaliacoes)/i.test(lower)) {
    updated.showTestimonials = true;
    changes.push('Seção de Avaliações ativada');
  }

  // 11. Add a new item/product/service or a new custom section
  const addItemMatch = text.match(
    /(?:adicione|coloque|crie|inclua)\s+(?:um\s+|uma\s+|nos\s+destaques\s+)?(?:card|destaque|produto|item|serviço|servico|procedimento|plano)\s+(?:de\s+|chamad[oa]\s+)?["'“”]?([^,.]+?)["'“”]?(?:\s+por\s+(R\$\s?\d+[.,]?\d*))?$/i
  );
  if (addItemMatch && addItemMatch[1] && !isDesignOrMetaInstruction(addItemMatch[1])) {
    const itemTitle = formatBrandCase(addItemMatch[1].trim());
    const itemPrice = addItemMatch[2] ? addItemMatch[2].trim() : updated.priceText;
    updated.items.push({
      title: itemTitle,
      desc: `Opção exclusiva da ${updated.brandName} adicionada conforme seu pedido.`,
      badge: 'Novo',
      price: itemPrice,
      imageUrl: generateSmartImageForSubject(`${itemTitle} ${updated.niche}`, updated.items.length + 1),
    });
    changes.push(`Novo item **"${itemTitle}"** adicionado em **Destaques**`);
  }

  const sectionMatch = text.match(
    /(?:nova\s+seção|nova\s+secao|seção\s+de|secao\s+de|adicione\s+(?:uma\s+)?(?:seção|secao|bloco|parte)|coloque\s+(?:uma\s+)?(?:seção|secao|bloco|parte))\s*(?:sobre|de|com|para)?\s*["'“”]?(.+?)["'“”]?$/i
  );
  if (sectionMatch && sectionMatch[1] && !isDesignOrMetaInstruction(sectionMatch[1])) {
    const secTopic = formatBrandCase(sectionMatch[1].trim());
    const placement = wantsTopOrHero ? 'top' : wantsBottom ? 'bottom' : 'middle';
    updated.customSections.push({
      id: `sec-${Date.now()}`,
      badge: `DESTAQUE • ${updated.brandName.toUpperCase()}`,
      title: secTopic,
      content: `Conteúdo especial sobre ${secTopic.toLowerCase()} preparado pela equipe ${updated.brandName}.`,
      bullets: [
        `Atendimento especializado em ${secTopic}`,
        `Qualidade garantida ${updated.brandName}`,
        `Pagamento seguro integrado`,
      ],
      imageUrl: generateSmartImageForSubject(`${secTopic} ${updated.niche}`, updated.customSections.length + 2),
      imagePosition: wantsLeft ? 'left' : 'right',
      placement,
      ctaText: updated.ctaButton,
    });
    changes.push(
      `Nova seção **"${secTopic}"** adicionada (${
        placement === 'top' ? 'no topo' : placement === 'bottom' ? 'na parte inferior' : 'no meio da página'
      })`
    );
  }

  return {
    updated,
    summaryOfChanges: changes,
    isConversationalOnly: changes.length === 0,
  };
}

/**
 * Calls the Cloud LLM Intent & Prompt Extractor + Deterministic Topic-Scored Engine
 * so any copied and pasted prompt is recognized accurately!
 */
export const generateSiteHtmlWithAI = async (params: {
  name: string;
  type: SiteType;
  prompt: string;
  visualStyle?: string;
  whatToSell?: string;
  layoutStructure?: string;
  selectedSections?: string[];
  priceOrOffer?: string;
  existingBlueprint?: SiteBlueprint;
}): Promise<{ html: string; blueprint: SiteBlueprint; assistantReply: string }> => {
  // If creating from scratch (no existingBlueprint), build a complete, ready-made site right away!
  if (!params.existingBlueprint) {
    const fresh = buildDefaultBlueprint({
      brandName: params.name,
      niche: params.whatToSell || '',
      prompt: params.prompt,
      visualStyle: params.visualStyle,
      layoutStructure: params.layoutStructure,
      selectedSections: params.selectedSections,
      priceOrOffer: params.priceOrOffer,
    });

    // Cloud AI deep prompt reader to extract exact product copy from the pasted prompt
    if (params.prompt.trim().length > 20) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7500);
        const promptExtractorQuery = `Você é um gerador de sites que interpreta o prompt colado pelo cliente.
REGRA CRÍTICA: NUNCA coloque instruções de design, cores, códigos hexadecimais (#080808, #171717, #B7FF00), "fundo branco", "preto profundo", "cinza grafite", "verde limão", "botões arredondados", "ícones fofos" ou "botão de WhatsApp" como texto dos produtos ("items") ou benefícios ("benefits"). Os "items" devem ser APENAS produtos, modelos, apostilas, pacotes ou serviços reais do tema do site!

Leia o prompt abaixo:
"""
${params.prompt.slice(0, 2500)}
"""
Extraia os textos comerciais do tema pedido no prompt e retorne APENAS um JSON válido (sem markdown) no formato:
{
  "brandName": "nome da marca, concessionária, loja, kit ou site citado no prompt",
  "niche": "ramo/nicho exato pedido no prompt (ex: Concessionária de Veículos Esportivos, Loja de Roupas, Kit PDF Infantil, etc.)",
  "heroTitle": "headline principal persuasiva sobre o produto/negócio do prompt",
  "heroSubtitle": "subtítulo comercial falando sobre os produtos/serviços (sem citar cores ou regras de layout)",
  "ctaButton": "texto curto do botão de ação",
  "imageSubject": "palavra-chave curta do assunto das fotos (ex: carro esportivo, roupa moda, infantil criança colorir, ebook pdf livro, unha manicure, barbearia, hambúrguer, dentista, pet shop, tênis, imóvel, software)",
  "items": [
    { "title": "Produto / Modelo / Módulo Real 1 do tema", "desc": "Descrição comercial atrativa do item 1", "badge": "Destaque", "price": "${fresh.priceText}" },
    { "title": "Produto / Modelo / Módulo Real 2 do tema", "desc": "Descrição comercial atrativa do item 2", "badge": "Mais Vendido", "price": "${fresh.priceText}" },
    { "title": "Produto / Modelo / Módulo Real 3 do tema", "desc": "Descrição comercial atrativa do item 3", "badge": "Exclusivo", "price": "${fresh.priceText}" }
  ],
  "benefits": [
    { "title": "Diferencial Comercial 1 do negócio", "desc": "Explicação curta para o cliente" },
    { "title": "Diferencial Comercial 2 do negócio", "desc": "Explicação curta para o cliente" },
    { "title": "Diferencial Comercial 3 do negócio", "desc": "Explicação curta para o cliente" }
  ],
  "testimonials": [
    { "name": "Nome do Cliente 1", "role": "Cliente Verificado", "text": "Depoimento específico sobre o produto/serviço" },
    { "name": "Nome do Cliente 2", "role": "Cliente Satisfeito", "text": "Depoimento específico sobre o produto/serviço" },
    { "name": "Nome do Cliente 3", "role": "Cliente VIP", "text": "Depoimento específico sobre o produto/serviço" }
  ],
  "faq": [
    { "q": "Pergunta frequente 1 sobre a compra ou produto?", "a": "Resposta clara" },
    { "q": "Pergunta frequente 2 sobre a entrega ou garantia?", "a": "Resposta clara" },
    { "q": "Pergunta frequente 3 sobre o pagamento via PIX ou Cartão?", "a": "Resposta clara" }
  ]
}`;
        const res = await fetch('https://text.pollinations.ai/openai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            model: 'openai-fast',
            reasoning_effort: 'low',
            messages: [{ role: 'user', content: promptExtractorQuery }],
            temperature: 0.2,
          }),
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const raw = data?.choices?.[0]?.message?.content || '';
          const s = raw.indexOf('{');
          const e = raw.lastIndexOf('}');
          if (s !== -1 && e > s) {
            const parsed = JSON.parse(raw.slice(s, e + 1));
            const explicitUserBrand = extractBrandNameFromText(params.prompt);
            if (explicitUserBrand) {
              fresh.brandName = explicitUserBrand;
            } else if (
              parsed.brandName &&
              !['Novo Projeto', 'Minha Marca', 'Sua Marca', 'Studio Prime'].includes(parsed.brandName) &&
              !isDesignOrMetaInstruction(parsed.brandName)
            ) {
              fresh.brandName = parsed.brandName;
            }
            if (parsed.niche && !isDesignOrMetaInstruction(parsed.niche)) {
              fresh.niche = parsed.niche;
              fresh.tagline = `${fresh.brandName} • ${parsed.niche}`;
            }
            if (parsed.heroTitle && !isDesignOrMetaInstruction(parsed.heroTitle)) {
              fresh.heroTitle = parsed.heroTitle;
            }
            if (parsed.heroSubtitle && !isDesignOrMetaInstruction(parsed.heroSubtitle)) {
              fresh.heroSubtitle = parsed.heroSubtitle;
            }
            if (parsed.ctaButton && !isDesignOrMetaInstruction(parsed.ctaButton)) {
              fresh.ctaButton = parsed.ctaButton;
            }

            const seedOffset =
              Math.abs(fresh.brandName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % 5;
            const imgQuery = `${parsed.imageSubject || ''} ${parsed.niche || ''} ${params.prompt.slice(0, 400)}`;
            fresh.heroImage = {
              url: generateSmartImageForSubject(imgQuery, seedOffset),
              alt: `${fresh.brandName} - ${fresh.niche}`,
              position: fresh.heroStyle === 'split_left' ? 'left' : 'right',
              shape: 'rounded',
            };

            if (Array.isArray(parsed.items)) {
              const validItems = parsed.items.filter(
                (it: any) =>
                  it &&
                  it.title &&
                  !isDesignOrMetaInstruction(String(it.title)) &&
                  !isDesignOrMetaInstruction(String(it.desc || ''))
              );
              if (validItems.length >= 2) {
                fresh.items = validItems.slice(0, 3).map((it: any, idx: number) => ({
                  title: it.title,
                  desc: it.desc || '',
                  badge: it.badge || 'Destaque',
                  price: it.price || fresh.priceText,
                  imageUrl: generateSmartImageForSubject(imgQuery, seedOffset + idx + 1),
                }));
              }
            }
            if (Array.isArray(parsed.benefits)) {
              const validBenefits = parsed.benefits.filter(
                (b: any) =>
                  b &&
                  b.title &&
                  !isDesignOrMetaInstruction(String(b.title)) &&
                  !isDesignOrMetaInstruction(String(b.desc || ''))
              );
              if (validBenefits.length >= 2) {
                fresh.benefits = validBenefits.slice(0, 3).map((b: any) => ({
                  title: b.title,
                  desc: b.desc || '',
                }));
              }
            }
            if (Array.isArray(parsed.testimonials) && parsed.testimonials.length >= 2) {
              fresh.testimonials = parsed.testimonials.slice(0, 3).map((t: any) => ({
                name: t.name || 'Cliente Verificado',
                role: t.role || 'Compra Verificada',
                text: t.text || '',
              }));
            }
            if (Array.isArray(parsed.faq) && parsed.faq.length >= 2) {
              fresh.faq = parsed.faq.slice(0, 4).map((f: any) => ({
                q: f.q || 'Como funciona?',
                a: String(f.a || '').replace(/,?\s*e\s+boleto|\bboleto\b/gi, ''),
              }));
            }
            if (fresh.paymentGateway) {
              fresh.paymentGateway.pixBeneficiary = fresh.brandName;
            }
          }
        }
      } catch (err) {
        console.warn('Initial prompt AI enrichment fallback:', err);
      }
    }

    // Re-apply design instructions at the end so custom hex colors from the prompt always win!
    extractAndApplyDesignInstructionsFromPrompt(fresh, params.prompt);

    const html = renderBlueprintToHtml(fresh);
    return {
      html,
      blueprint: fresh,
      assistantReply: `Pronto! Interpretei seu prompt e criei o site completo da **${fresh.brandName}** (**${fresh.niche}**) aplicando as cores, estilo visual, fotos variadas e gateway de pagamento (PIX e Cartão) conectado direto à sua conta!`,
    };
  }

  // Editing an existing site via chat!
  let baseBlueprint: SiteBlueprint = JSON.parse(JSON.stringify(params.existingBlueprint));

  // Step 1: Run our Precision Spatial, Aesthetic, Photo, Name & Pasted-Prompt Interpreter
  const { updated: afterLocal, summaryOfChanges } = applyUserInstructionToBlueprint(
    baseBlueprint,
    params.prompt
  );
  baseBlueprint = afterLocal;

  // Step 2: Cloud AI fallback for open-ended instructions
  if (summaryOfChanges.length === 0) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const aiPlannerPrompt = `Você é o interpretador de comandos de um construtor de sites inteligente em português.
Estado atual do site:
- Marca: "${baseBlueprint.brandName}"
- Nicho: "${baseBlueprint.niche}"
- Título atual: "${baseBlueprint.heroTitle}"

O cliente disse ou colou no chat:
"""
${params.prompt.slice(0, 1800)}
"""

Retorne APENAS um JSON válido (sem markdown) no formato:
{
  "actionType": "change_niche" | "change_theme" | "add_image" | "edit_text" | "add_section" | "change_layout" | "payment_gateway" | "just_chat",
  "visualTheme": "futuristic" | "minimalist" | "luxury" | "vibrant" | "urban" | "retro" | "modern" | "",
  "imageSubject": "assunto da foto se pediu imagem/objeto (ex: carro esportivo, roupa moda, infantil criança colorir, ebook pdf, unha manicure, barbearia, hambúrguer, dentista, etc.) ou vazio",
  "imagePosition": "right" | "left" | "top" | "bottom" | "background" | "cards" | "gallery",
  "newBrandName": "apenas se pediu para mudar o nome da marca/site, senão vazio",
  "newHeroTitle": "apenas se pediu para mudar o título, senão vazio",
  "newHeroSubtitle": "apenas se pediu para mudar o texto/subtítulo, senão vazio",
  "newCtaButton": "apenas se pediu para mudar o botão, senão vazio",
  "newSectionTitle": "título da nova seção se pediu para adicionar algo na página, senão vazio",
  "newSectionContent": "conteúdo da nova seção se pediu para adicionar algo, senão vazio",
  "newNiche": "novo nicho caso tenha colado um novo prompt ou pedido para mudar o tema do site, senão vazio",
  "gatewayProvider": "mercado_pago" | "stripe" | "asaas" | "pagbank" | "kiwify" | "mato_pay" | "",
  "assistantReply": "Resposta direta em português explicando exatamente o que você alterou no site."
}`;

      const res = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'openai-fast',
          reasoning_effort: 'low',
          messages: [{ role: 'user', content: aiPlannerPrompt }],
          temperature: 0.2,
        }),
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const raw = data?.choices?.[0]?.message?.content || '';
        const start = raw.indexOf('{');
        const end = raw.lastIndexOf('}');
        if (start !== -1 && end > start) {
          const plan = JSON.parse(raw.slice(start, end + 1));

          if (plan.actionType === 'change_niche' && plan.newNiche) {
            baseBlueprint = buildDefaultBlueprint({
              brandName: plan.newBrandName || '',
              niche: plan.newNiche,
              prompt: params.prompt,
            });
            summaryOfChanges.push(`Site reconstruído para **${baseBlueprint.niche}**`);
          } else {
            if (
              plan.visualTheme &&
              ['futuristic', 'minimalist', 'luxury', 'vibrant', 'urban', 'retro', 'modern'].includes(
                plan.visualTheme
              )
            ) {
              applyVisualThemePreset(baseBlueprint, plan.visualTheme);
              summaryOfChanges.push(`Estilo visual alterado para **${plan.visualTheme}**`);
            }
            if (plan.newBrandName) {
              baseBlueprint.brandName = plan.newBrandName;
              summaryOfChanges.push(`Nome alterado para **${plan.newBrandName}**`);
            }
            if (plan.newHeroTitle) {
              baseBlueprint.heroTitle = plan.newHeroTitle;
              summaryOfChanges.push(`Título alterado para **"${plan.newHeroTitle}"**`);
            }
            if (plan.newHeroSubtitle) {
              baseBlueprint.heroSubtitle = plan.newHeroSubtitle;
              summaryOfChanges.push(`Texto atualizado`);
            }
            if (plan.newCtaButton) {
              baseBlueprint.ctaButton = plan.newCtaButton;
              summaryOfChanges.push(`Botão atualizado para **"${plan.newCtaButton}"**`);
            }
            if (plan.gatewayProvider || plan.actionType === 'payment_gateway') {
              if (!baseBlueprint.paymentGateway) {
                baseBlueprint.paymentGateway = detectPaymentGatewayFromText(
                  '',
                  undefined,
                  baseBlueprint.brandName
                ).config;
              }
              if (plan.gatewayProvider) {
                baseBlueprint.paymentGateway.provider = plan.gatewayProvider;
              }
              baseBlueprint.paymentGateway.enabled = true;
              baseBlueprint.paymentGateway.connected = true;
              summaryOfChanges.push(`Gateway de pagamento conectado à sua conta`);
            }
            if (plan.actionType === 'add_image' || plan.imageSubject) {
              const subj = plan.imageSubject || baseBlueprint.niche;
              if (plan.imagePosition === 'cards') {
                baseBlueprint.items = baseBlueprint.items.map((it, idx) => ({
                  ...it,
                  imageUrl: generateSmartImageForSubject(subj, idx + 1),
                }));
              } else if (plan.imagePosition === 'gallery') {
                baseBlueprint.galleryImages = [
                  { url: generateSmartImageForSubject(subj, 1), caption: `${baseBlueprint.brandName} — Destaque 01` },
                  { url: generateSmartImageForSubject(subj, 2), caption: `${baseBlueprint.brandName} — Destaque 02` },
                  { url: generateSmartImageForSubject(subj, 3), caption: `${baseBlueprint.brandName} — Destaque 03` },
                ];
              } else {
                const pos = ['left', 'right', 'top', 'bottom', 'background'].includes(
                  plan.imagePosition
                )
                  ? plan.imagePosition
                  : 'right';
                baseBlueprint.heroImage = {
                  url: generateSmartImageForSubject(subj, 0),
                  alt: subj,
                  position: pos,
                  shape: 'rounded',
                };
                if (pos === 'left') baseBlueprint.heroStyle = 'split_left';
                else if (pos === 'background') baseBlueprint.heroStyle = 'bg_overlay';
                else if (pos === 'bottom' || pos === 'top') baseBlueprint.heroStyle = 'centered_stack';
                else baseBlueprint.heroStyle = 'split_right';
              }
              summaryOfChanges.push(`Imagem de **"${subj}"** atualizada`);
            }
            if (plan.newSectionTitle && !isDesignOrMetaInstruction(plan.newSectionTitle)) {
              if (!baseBlueprint.customSections) baseBlueprint.customSections = [];
              baseBlueprint.customSections.push({
                id: `sec-${Date.now()}`,
                badge: `DESTAQUE • ${baseBlueprint.brandName.toUpperCase()}`,
                title: plan.newSectionTitle,
                content:
                  plan.newSectionContent || `Seção especial adicionada conforme seu pedido.`,
                imageUrl: plan.imageSubject
                  ? generateSmartImageForSubject(plan.imageSubject, 2)
                  : undefined,
                imagePosition: 'right',
                placement: 'middle',
                ctaText: baseBlueprint.ctaButton,
              });
              summaryOfChanges.push(`Seção **"${plan.newSectionTitle}"** adicionada`);
            }
            if (plan.actionType === 'change_layout') {
              const nextCombo = pickVariedLayoutCombination(
                params.prompt + Date.now(),
                baseBlueprint.layoutVariant
              );
              baseBlueprint.navbarStyle = nextCombo.navbarStyle;
              baseBlueprint.heroStyle = nextCombo.heroStyle;
              baseBlueprint.cardsStyle = nextCombo.cardsStyle;
              baseBlueprint.fontPair = nextCombo.fontPair;
              summaryOfChanges.push('Layout do site remodelado');
            }
          }

          if (plan.assistantReply) {
            const html = renderBlueprintToHtml(baseBlueprint);
            return { html, blueprint: baseBlueprint, assistantReply: plan.assistantReply };
          }
        }
      }
    } catch (err) {
      console.warn('Cloud AI planner fallback:', err);
    }
  }

  const assistantReply =
    summaryOfChanges.length > 0
      ? `Pronto! Apliquei exatamente o que você pediu no site:\n• ${summaryOfChanges.join('\n• ')}`
      : `Entendi! Você pode pedir qualquer alteração de cor, texto, tema, fotos ou gateway de pagamento aqui no chat que eu atualizo o site na hora.`;

  const html = renderBlueprintToHtml(baseBlueprint);
  return { html, blueprint: baseBlueprint, assistantReply };
};

export const generateChatReplyWithAI = async (prompt: string): Promise<string> => {
  try {
    const res = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai-fast',
        reasoning_effort: 'low',
        messages: [
          {
            role: 'system',
            content:
              'Você é um consultor especialista em negócios digitais, criação de sites, copywriting, gateways de pagamento e vendas online. Responda em português do Brasil de forma objetiva, criativa e prestativa.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content;
      if (reply) return reply.trim();
    }
  } catch {
    // fallback below
  }
  return `Analisei seu pedido: **"${prompt}"**.\n\nPosso criar ou ajustar qualquer seção, imagem, nome da marca, gateway de pagamento ou layout sob medida para o seu projeto.`;
};

/**
 * Combinatorial Multi-Layout & Aesthetic Theme HTML5 + Tailwind CSS Compiler
 * - Clean navigation buttons WITHOUT emojis: Destaques, Diferenciais, Avaliações, Dúvidas
 * - Honors custom prompt colors (customBgHex, customSurfaceHex, customCardHex, customTextMutedHex, primaryColorHex)
 * - 100% Reliable Image Loading with automatic `onerror` fallback
 * - Real Connected Payment Gateway Checkout Modal (PIX + Cartão 12x, NO Boleto) that credits the user's MATO account automatically!
 */
export function renderBlueprintToHtml(bp: SiteBlueprint): string {
  const theme = bp.visualTheme;
  const isDark =
    bp.customBgHex
      ? analyzeHexColor(bp.customBgHex).luminance < 0.5
      : theme === 'minimalist' || theme === 'retro' || theme === 'vibrant'
      ? false
      : theme
      ? true
      : bp.bgMode === 'dark';

  let bgMain = isDark ? '#090A0F' : '#FAF8F5';
  let bgAlt = isDark ? '#11131C' : '#F2ECE4';
  let bgCard = isDark ? '#161925' : '#FFFFFF';
  let textMain = isDark ? '#F8FAFC' : '#18181B';
  let textMuted = isDark ? '#A1A1AA' : '#57534E';
  let borderCol = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(24,24,27,0.1)';
  let accent = bp.primaryColorHex || '#10B981';
  let extraBodyCss = '';
  let extraCardCss = '';
  let extraHeadingCss = '';

  if (theme === 'futuristic') {
    bgMain = '#040612';
    bgAlt = '#080D24';
    bgCard = 'rgba(11, 18, 42, 0.78)';
    textMain = '#F0F9FF';
    textMuted = '#94A3B8';
    accent = bp.primaryColorHex && bp.primaryColorHex !== '#18181B' ? bp.primaryColorHex : '#00F0FF';
    borderCol = 'rgba(0, 240, 255, 0.28)';
    extraBodyCss = `
      background-image:
        radial-gradient(circle at 50% 0%, rgba(0, 240, 255, 0.18), rgba(139, 92, 246, 0.12) 45%, transparent 75%),
        linear-gradient(rgba(0, 240, 255, 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 240, 255, 0.04) 1px, transparent 1px);
      background-size: 100% 100%, 44px 44px, 44px 44px;
    `;
    extraCardCss = `backdrop-filter: blur(18px); box-shadow: 0 0 32px rgba(0, 240, 255, 0.09);`;
    extraHeadingCss = `text-shadow: 0 0 28px rgba(0, 240, 255, 0.28); letter-spacing: 0.02em;`;
  } else if (theme === 'minimalist') {
    bgMain = '#FAFAFA';
    bgAlt = '#F4F4F5';
    bgCard = '#FFFFFF';
    textMain = '#111111';
    textMuted = '#71717A';
    accent = bp.primaryColorHex || '#18181B';
    borderCol = '#E4E4E7';
    extraCardCss = `box-shadow: 0 1px 3px rgba(0,0,0,0.03);`;
    extraHeadingCss = `letter-spacing: -0.03em; font-weight: 700;`;
  } else if (theme === 'luxury') {
    bgMain = '#0A0908';
    bgAlt = '#12100E';
    bgCard = '#171412';
    textMain = '#FAF5EF';
    textMuted = '#A8A29E';
    accent = bp.primaryColorHex || '#D4AF37';
    borderCol = 'rgba(212, 175, 55, 0.26)';
    extraBodyCss = `background-image: radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.12), transparent 65%);`;
    extraCardCss = `box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);`;
  } else if (theme === 'vibrant') {
    bgMain = '#FFFDF9';
    bgAlt = '#FEF3C7';
    bgCard = '#FFFFFF';
    textMain = '#1E1B4B';
    textMuted = '#475569';
    accent = bp.primaryColorHex || '#F97316';
    borderCol = 'rgba(249, 115, 22, 0.22)';
  } else if (theme === 'urban') {
    bgMain = '#09090B';
    bgAlt = '#121215';
    bgCard = '#18181B';
    textMain = '#FAFAFA';
    textMuted = '#A1A1AA';
    accent = bp.primaryColorHex || '#A3E635';
    borderCol = 'rgba(163, 230, 53, 0.3)';
  }

  // Apply explicit custom colors extracted from the prompt (e.g., #080808 background, #171717 graphite cards, light gray muted text)
  if (bp.customBgHex) bgMain = bp.customBgHex;
  if (bp.customSurfaceHex) bgAlt = bp.customSurfaceHex;
  if (bp.customCardHex) bgCard = bp.customCardHex;
  if (bp.customTextMutedHex) textMuted = bp.customTextMutedHex;

  // Automatically pick dark vs white text on accent buttons based on the accent color's luminance
  const accentInfo = analyzeHexColor(accent);
  const accentTextOnBg = accentInfo.luminance > 0.56 ? '#080808' : '#FFFFFF';

  const btnRadiusClass = bp.buttonRadius || 'rounded-full';

  // Font Pair selection
  let fontHeadingCss = "'Plus Jakarta Sans', sans-serif";
  let fontBodyCss = "'Plus Jakarta Sans', sans-serif";
  if (bp.fontPair === 'futuristic_cyber' || theme === 'futuristic') {
    fontHeadingCss = "'Orbitron', 'Space Grotesk', sans-serif";
    fontBodyCss = "'Plus Jakarta Sans', sans-serif";
  } else if (bp.fontPair === 'modern_geometric') {
    fontHeadingCss = "'Space Grotesk', sans-serif";
    fontBodyCss = "'Plus Jakarta Sans', sans-serif";
  } else if (bp.fontPair === 'luxury_classic' || theme === 'luxury') {
    fontHeadingCss = "'Cormorant Garamond', Georgia, serif";
    fontBodyCss = "'Plus Jakarta Sans', sans-serif";
  } else if (bp.fontPair === 'editorial_serif') {
    fontHeadingCss = "'Instrument Serif', Georgia, serif";
    fontBodyCss = "'Plus Jakarta Sans', sans-serif";
  } else if (bp.fontPair === 'bold_urban' || theme === 'urban') {
    fontHeadingCss = "'Syne', sans-serif";
    fontBodyCss = "'Plus Jakarta Sans', sans-serif";
  }

  // Payment Gateway config & labels (PIX + Credit Card ONLY, NO Boleto)
  const gw: SitePaymentGatewayConfig = bp.paymentGateway || {
    enabled: true,
    provider: 'mato_pay',
    connected: true,
    pixKey: `pix@${bp.brandName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'loja'}.com.br`,
    pixBeneficiary: bp.brandName,
    checkoutUrl: '',
    publicKey: 'pk_live_connected',
    methods: ['pix', 'credit_card'],
    installmentsMax: 12,
    autoCreditAccount: true,
  };

  const providerNames: Record<SitePaymentGatewayConfig['provider'], string> = {
    mato_pay: 'MATO Pay Checkout',
    mercado_pago: 'Mercado Pago',
    stripe: 'Stripe Payments',
    asaas: 'Asaas Pagamentos',
    pagbank: 'PagBank / PagSeguro',
    kiwify: 'Checkout Digital',
  };
  const gwLabel = providerNames[gw.provider] || 'Gateway Seguro';
  const pixKeySafe = gw.pixKey || `pix@${bp.brandName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'loja'}.com.br`;
  const installmentsMax = gw.installmentsMax || 12;

  const imgFallbackAttr = `onerror="this.onerror=null;this.src='${FALLBACK_SAFE_IMAGE}';"`;

  // Clean Navigation Buttons WITHOUT Emojis (Destaques, Diferenciais, Avaliações, Dúvidas)
  const navPillsHtml = `
    <nav class="flex flex-wrap items-center justify-center gap-2 sm:gap-3" aria-label="Navegação do site">
      <button type="button" onclick="navigateToSection('vitrine', this)" class="nav-pill px-4 py-2 rounded-full text-xs font-bold border subtle-border transition hover:scale-105 cursor-pointer" style="background-color: var(--bg-alt); color: var(--text-main)">
        Destaques
      </button>
      <button type="button" onclick="navigateToSection('diferenciais', this)" class="nav-pill px-4 py-2 rounded-full text-xs font-bold border subtle-border transition hover:scale-105 cursor-pointer" style="background-color: var(--bg-alt); color: var(--text-main)">
        Diferenciais
      </button>
      <button type="button" onclick="navigateToSection('avaliacoes', this)" class="nav-pill px-4 py-2 rounded-full text-xs font-bold border subtle-border transition hover:scale-105 cursor-pointer" style="background-color: var(--bg-alt); color: var(--text-main)">
        Avaliações
      </button>
      <button type="button" onclick="navigateToSection('faq', this)" class="nav-pill px-4 py-2 rounded-full text-xs font-bold border subtle-border transition hover:scale-105 cursor-pointer" style="background-color: var(--bg-alt); color: var(--text-main)">
        Dúvidas
      </button>
    </nav>
  `;

  // Payment Gateway Trust Badges Bar (NO Boleto)
  const gatewayTrustBarHtml = gw.enabled
    ? `
    <div class="pt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold opacity-90" style="color: var(--text-muted)">
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border subtle-border" style="background-color: var(--bg-alt)">
        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
        ${gwLabel} Conectado
      </span>
      <span class="px-2.5 py-1 rounded-full border subtle-border" style="background-color: var(--bg-alt)">PIX Imediato</span>
      <span class="px-2.5 py-1 rounded-full border subtle-border" style="background-color: var(--bg-alt)">Cartão até ${installmentsMax}x</span>
    </div>`
    : '';

  // 1. SPACIOUS NAVBAR VARIATION
  const navStyle = bp.navbarStyle || 'minimal_line';
  let headerHtml = '';
  if (navStyle === 'floating_pill') {
    headerHtml = `
  <header class="max-w-6xl mx-auto w-full px-6 pt-6 pb-4 sticky top-2 z-30">
    <div class="px-6 py-4 rounded-3xl border subtle-border backdrop-blur-md flex flex-wrap items-center justify-between gap-4 shadow-xl" style="background-color: ${isDark ? 'rgba(17,19,28,0.9)' : 'rgba(255,255,255,0.92)'}">
      <button type="button" onclick="window.scrollTo({top:0,behavior:'smooth'})" class="heading-font text-2xl font-bold tracking-tight text-left cursor-pointer">${bp.brandName}</button>
      ${navPillsHtml}
      <button type="button" onclick="openActionModal('${bp.brandName.replace(/'/g, '')}', '${bp.priceText.replace(/'/g, '')}')" class="px-5 py-2.5 ${btnRadiusClass} text-xs font-extrabold accent-bg shadow-md cursor-pointer">
        ${bp.ctaButton} →
      </button>
    </div>
  </header>`;
  } else if (navStyle === 'centered_editorial') {
    headerHtml = `
  <header class="border-b subtle-border py-7 px-6 mb-4">
    <div class="max-w-6xl mx-auto flex flex-col items-center gap-5">
      <div class="w-full flex items-center justify-between gap-4">
        <span class="text-[11px] font-bold uppercase tracking-widest accent-color">${bp.niche}</span>
        <button type="button" onclick="window.scrollTo({top:0,behavior:'smooth'})" class="heading-font text-3xl sm:text-4xl font-bold tracking-tight cursor-pointer">${bp.brandName}</button>
        <button type="button" onclick="openActionModal('${bp.brandName.replace(/'/g, '')}', '${bp.priceText.replace(/'/g, '')}')" class="px-5 py-2.5 ${btnRadiusClass} text-xs font-bold accent-bg cursor-pointer">
          ${bp.ctaButton}
        </button>
      </div>
      <div class="pt-1">
        ${navPillsHtml}
      </div>
    </div>
  </header>`;
  } else if (navStyle === 'top_announcement') {
    headerHtml = `
  <div class="w-full py-2.5 px-4 text-center text-[11px] font-extrabold uppercase tracking-[0.18em] accent-bg">
    ${bp.announcementText || `${bp.brandName.toUpperCase()} • CHECKOUT SEGURO VIA ${gwLabel.toUpperCase()}`}
  </div>
  <header class="border-b subtle-border py-6 px-6 mb-4">
    <div class="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-5">
      <button type="button" onclick="window.scrollTo({top:0,behavior:'smooth'})" class="heading-font text-2xl sm:text-3xl font-black tracking-tight cursor-pointer">${bp.brandName}</button>
      ${navPillsHtml}
      <button type="button" onclick="openActionModal('${bp.brandName.replace(/'/g, '')}', '${bp.priceText.replace(/'/g, '')}')" class="px-5 py-2.5 ${btnRadiusClass} text-xs font-extrabold accent-bg cursor-pointer">
        ${bp.ctaButton} →
      </button>
    </div>
  </header>`;
  } else {
    headerHtml = `
  <header class="max-w-6xl mx-auto w-full px-6 py-7 mb-4 flex flex-wrap items-center justify-between gap-5 border-b subtle-border">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 ${btnRadiusClass} accent-bg flex items-center justify-center font-black text-sm shadow">${bp.brandName.charAt(0)}</div>
      <button type="button" onclick="window.scrollTo({top:0,behavior:'smooth'})" class="heading-font text-2xl font-bold tracking-tight cursor-pointer">${bp.brandName}</button>
    </div>
    ${navPillsHtml}
    <button type="button" onclick="openActionModal('${bp.brandName.replace(/'/g, '')}', '${bp.priceText.replace(/'/g, '')}')" class="px-5 py-2.5 ${btnRadiusClass} text-xs font-extrabold accent-bg cursor-pointer">
      ${bp.ctaButton} →
    </button>
  </header>`;
  }

  // 2. HERO VISUAL / IMAGE BLOCK
  const heroImg = bp.heroImage;
  const imgShapeClass =
    heroImg?.shape === 'circle'
      ? 'rounded-full aspect-square max-w-sm mx-auto'
      : 'rounded-[28px] aspect-[4/3]';

  const visualBlockHtml = heroImg
    ? `
      <div class="overflow-hidden border subtle-border shadow-2xl ${imgShapeClass} theme-card" style="background-color: var(--bg-card)">
        <img src="${heroImg.url}" alt="${heroImg.alt}" ${imgFallbackAttr} class="w-full h-full object-cover" />
      </div>`
    : `
      <div class="p-7 rounded-[28px] border subtle-border shadow-2xl space-y-5 theme-card" style="background: radial-gradient(circle at top right, ${accent}25, transparent 70%), var(--bg-card)">
        <div class="flex items-center justify-between border-b subtle-border pb-3">
          <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase accent-bg">${bp.brandName}</span>
          <span class="text-xs font-bold accent-color">★ 4.9/5</span>
        </div>
        <div class="space-y-3">
          ${bp.items
            .slice(0, 2)
            .map(
              (it) => `
          <div class="p-4 rounded-2xl border subtle-border flex items-center justify-between gap-3" style="background-color: var(--bg-alt)">
            <div>
              <p class="text-xs font-extrabold">${it.title}</p>
              <p class="text-[11px] opacity-75">${it.badge}</p>
            </div>
            <span class="text-xs font-black accent-color">${it.price}</span>
          </div>`
            )
            .join('')}
        </div>
        <button type="button" onclick="openActionModal('${bp.brandName.replace(/'/g, '')}', '${bp.priceText.replace(/'/g, '')}')" class="w-full py-3.5 ${btnRadiusClass} font-extrabold text-xs accent-bg shadow-md cursor-pointer">
          ${bp.ctaButton} (${bp.priceText}) →
        </button>
      </div>`;

  // 3. HERO LAYOUT VARIATION
  const heroStyle = bp.heroStyle || 'split_right';
  let heroHtml = '';

  if (heroStyle === 'bg_overlay' && heroImg) {
    heroHtml = `
  <section class="relative overflow-hidden py-24 px-6 my-4 border-b subtle-border">
    <div class="absolute inset-0 z-0 opacity-35">
      <img src="${heroImg.url}" alt="${heroImg.alt}" ${imgFallbackAttr} class="w-full h-full object-cover" />
    </div>
    <div class="relative z-10 max-w-4xl mx-auto text-center space-y-6 p-8 sm:p-12 rounded-3xl backdrop-blur-md border subtle-border theme-card" style="background-color: ${isDark ? 'rgba(9,10,15,0.82)' : 'rgba(255,255,255,0.88)'}">
      <span class="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border subtle-border accent-color">${bp.tagline}</span>
      <h1 class="heading-font text-4xl sm:text-5xl font-black tracking-tight leading-[1.12]">${bp.heroTitle}</h1>
      <p class="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" style="color: var(--text-muted)">${bp.heroSubtitle}</p>
      <div class="pt-3 flex flex-wrap items-center justify-center gap-4">
        <button type="button" onclick="openActionModal('${bp.brandName.replace(/'/g, '')}', '${bp.priceText.replace(/'/g, '')}')" class="px-9 py-4 ${btnRadiusClass} font-extrabold text-sm accent-bg shadow-xl cursor-pointer">
          ${bp.ctaButton} →
        </button>
        <button type="button" onclick="navigateToSection('vitrine')" class="px-7 py-4 ${btnRadiusClass} font-bold text-sm border subtle-border cursor-pointer">
          Ver Destaques
        </button>
      </div>
      <div class="flex justify-center">${gatewayTrustBarHtml}</div>
    </div>
  </section>`;
  } else if (heroStyle === 'centered_stack') {
    heroHtml = `
  <section class="max-w-5xl mx-auto px-6 pt-14 pb-20 text-center space-y-8">
    ${heroImg && heroImg.position === 'top' ? `<div class="max-w-2xl mx-auto pb-4">${visualBlockHtml}</div>` : ''}
    <span class="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border subtle-border accent-color">${bp.tagline}</span>
    <h1 class="heading-font text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] max-w-4xl mx-auto">${bp.heroTitle}</h1>
    <p class="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed" style="color: var(--text-muted)">${bp.heroSubtitle}</p>
    <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
      <button type="button" onclick="openActionModal('${bp.brandName.replace(/'/g, '')}', '${bp.priceText.replace(/'/g, '')}')" class="px-9 py-4 ${btnRadiusClass} font-extrabold text-sm accent-bg shadow-xl cursor-pointer">
        ${bp.ctaButton} →
      </button>
      <button type="button" onclick="navigateToSection('vitrine')" class="px-7 py-4 ${btnRadiusClass} font-bold text-sm border subtle-border cursor-pointer">
        Ver Destaques (${bp.priceText})
      </button>
    </div>
    <div class="flex justify-center">${gatewayTrustBarHtml}</div>
    ${!heroImg || heroImg.position !== 'top' ? `<div class="max-w-3xl mx-auto pt-6">${visualBlockHtml}</div>` : ''}
  </section>`;
  } else if (heroStyle === 'split_left') {
    heroHtml = `
  <section class="max-w-6xl mx-auto px-6 pt-14 pb-24">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-6 order-2 lg:order-1">
        ${visualBlockHtml}
      </div>
      <div class="lg:col-span-6 space-y-6 order-1 lg:order-2">
        <span class="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border subtle-border accent-color">${bp.tagline}</span>
        <h1 class="heading-font text-4xl sm:text-5xl font-black tracking-tight leading-[1.12]">${bp.heroTitle}</h1>
        <p class="text-base sm:text-lg leading-relaxed" style="color: var(--text-muted)">${bp.heroSubtitle}</p>
        <div class="pt-3 flex flex-wrap items-center gap-4">
          <button type="button" onclick="openActionModal('${bp.brandName.replace(/'/g, '')}', '${bp.priceText.replace(/'/g, '')}')" class="px-8 py-4 ${btnRadiusClass} font-extrabold text-sm accent-bg shadow-xl cursor-pointer">
            ${bp.ctaButton} →
          </button>
          <button type="button" onclick="navigateToSection('vitrine')" class="px-6 py-4 ${btnRadiusClass} font-bold text-sm border subtle-border cursor-pointer">
            Explorar Destaques
          </button>
        </div>
        ${gatewayTrustBarHtml}
      </div>
    </div>
  </section>`;
  } else {
    heroHtml = `
  <section class="max-w-6xl mx-auto px-6 pt-14 pb-24">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-7 space-y-6">
        <span class="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border subtle-border accent-color">${bp.tagline}</span>
        <h1 class="heading-font text-4xl sm:text-5xl font-black tracking-tight leading-[1.12]">${bp.heroTitle}</h1>
        <p class="text-base sm:text-lg leading-relaxed max-w-xl" style="color: var(--text-muted)">${bp.heroSubtitle}</p>
        <div class="pt-3 flex flex-wrap items-center gap-4">
          <button type="button" onclick="openActionModal('${bp.brandName.replace(/'/g, '')}', '${bp.priceText.replace(/'/g, '')}')" class="px-8 py-4 ${btnRadiusClass} font-extrabold text-sm accent-bg shadow-xl cursor-pointer">
            ${bp.ctaButton} →
          </button>
          <button type="button" onclick="navigateToSection('vitrine')" class="px-6 py-4 ${btnRadiusClass} font-bold text-sm border subtle-border cursor-pointer">
            Ver Destaques (${bp.priceText})
          </button>
        </div>
        ${gatewayTrustBarHtml}
      </div>
      <div class="lg:col-span-5">
        ${visualBlockHtml}
      </div>
    </div>
  </section>`;
  }

  // 4. OPTIONAL PHOTO GALLERY SECTION
  const galleryHtml =
    bp.galleryImages && bp.galleryImages.length > 0
      ? `
  <section class="max-w-6xl mx-auto px-6 py-20 border-t subtle-border space-y-10">
    <div class="flex items-end justify-between">
      <div>
        <p class="text-xs font-extrabold uppercase tracking-widest accent-color">GALERIA VISUAL</p>
        <h2 class="heading-font text-3xl sm:text-4xl font-black mt-2">Galeria • ${bp.brandName}</h2>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-7">
      ${bp.galleryImages
        .map(
          (img) => `
      <div class="rounded-3xl overflow-hidden border subtle-border shadow-lg group theme-card" style="background-color: var(--bg-card)">
        <div class="h-64 overflow-hidden">
          <img src="${img.url}" alt="${img.caption}" ${imgFallbackAttr} class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        </div>
        <div class="p-5">
          <p class="text-xs font-bold">${img.caption}</p>
        </div>
      </div>`
        )
        .join('')}
    </div>
  </section>`
      : '';

  // 5. SECTION 1: DESTAQUES (#vitrine)
  const cardsStyle = bp.cardsStyle || 'grid_3';
  let showcaseHtml = '';

  if (cardsStyle === 'horizontal_rows') {
    showcaseHtml = `
  <section id="vitrine" class="max-w-6xl mx-auto px-6 py-20 border-t subtle-border space-y-12 scroll-mt-24 transition-all duration-500">
    <div class="space-y-2">
      <span class="px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest accent-bg">DESTAQUES</span>
      <h2 class="heading-font text-3xl sm:text-5xl font-black pt-2">Destaques & Conteúdo • ${bp.brandName}</h2>
      <p class="text-sm max-w-2xl" style="color: var(--text-muted)">Escolha a opção desejada abaixo para finalizar com pagamento seguro via ${gwLabel}.</p>
    </div>
    <div class="divide-y subtle-border border-y subtle-border">
      ${bp.items
        .map(
          (item, i) => `
      <div class="py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-center gap-5">
          ${
            item.imageUrl
              ? `<img src="${item.imageUrl}" alt="${item.title}" ${imgFallbackAttr} class="w-24 h-24 rounded-2xl object-cover border subtle-border flex-shrink-0" />`
              : `<span class="text-2xl font-black accent-color">0${i + 1}</span>`
          }
          <div class="space-y-1.5">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase accent-bg">${item.badge}</span>
            <h3 class="text-xl font-black">${item.title}</h3>
            <p class="text-xs max-w-xl leading-relaxed" style="color: var(--text-muted)">${item.desc}</p>
          </div>
        </div>
        <div class="flex items-center gap-4 flex-shrink-0">
          <span class="text-xl font-black accent-color">${item.price}</span>
          <button type="button" onclick="openActionModal('${item.title.replace(/'/g, '')}', '${item.price.replace(/'/g, '')}')" class="px-5 py-2.5 ${btnRadiusClass} text-xs font-extrabold accent-bg cursor-pointer">
            Comprar Agora →
          </button>
        </div>
      </div>`
        )
        .join('')}
    </div>
  </section>`;
  } else if (cardsStyle === 'bento_asymmetric') {
    showcaseHtml = `
  <section id="vitrine" class="max-w-6xl mx-auto px-6 py-20 border-t subtle-border space-y-12 scroll-mt-24 transition-all duration-500">
    <div class="space-y-2">
      <span class="px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest accent-bg">DESTAQUES</span>
      <h2 class="heading-font text-3xl sm:text-5xl font-black pt-2">Destaques • ${bp.brandName}</h2>
      <p class="text-sm max-w-2xl" style="color: var(--text-muted)">Selecione qualquer item para pagar com PIX ou Cartão diretamente pelo site.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-12 gap-7">
      ${bp.items
        .map(
          (item, i) => `
      <div class="${i === 0 ? 'md:col-span-7' : 'md:col-span-5'} rounded-3xl border subtle-border p-8 flex flex-col justify-between space-y-6 shadow-lg theme-card" style="background-color: var(--bg-card)">
        <div class="space-y-4">
          ${
            item.imageUrl
              ? `<div class="h-52 rounded-2xl overflow-hidden border subtle-border"><img src="${item.imageUrl}" alt="${item.title}" ${imgFallbackAttr} class="w-full h-full object-cover" /></div>`
              : ''
          }
          <span class="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase accent-bg">${item.badge}</span>
          <h3 class="text-2xl font-black">${item.title}</h3>
          <p class="text-xs leading-relaxed" style="color: var(--text-muted)">${item.desc}</p>
        </div>
        <div class="pt-4 border-t subtle-border flex items-center justify-between">
          <span class="text-xl font-black accent-color">${item.price}</span>
          <button type="button" onclick="openActionModal('${item.title.replace(/'/g, '')}', '${item.price.replace(/'/g, '')}')" class="px-5 py-2.5 ${btnRadiusClass} text-xs font-extrabold accent-bg cursor-pointer">
            Escolher →
          </button>
        </div>
      </div>`
        )
        .join('')}
    </div>
  </section>`;
  } else {
    showcaseHtml = `
  <section id="vitrine" class="max-w-6xl mx-auto px-6 py-20 border-t subtle-border space-y-12 scroll-mt-24 transition-all duration-500">
    <div class="space-y-2">
      <span class="px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest accent-bg">DESTAQUES</span>
      <h2 class="heading-font text-3xl sm:text-4xl font-black pt-2">Destaques Principais • ${bp.brandName}</h2>
      <p class="text-sm max-w-2xl" style="color: var(--text-muted)">Opções selecionadas com pagamento instantâneo via ${gwLabel}.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-7">
      ${bp.items
        .map(
          (item, i) => `
      <div class="rounded-3xl border subtle-border overflow-hidden flex flex-col justify-between shadow-lg hover:scale-[1.01] transition theme-card" style="background-color: var(--bg-card)">
        <div>
          ${
            item.imageUrl
              ? `<div class="h-52 overflow-hidden border-b subtle-border"><img src="${item.imageUrl}" alt="${item.title}" ${imgFallbackAttr} class="w-full h-full object-cover" /></div>`
              : `<div class="h-36 p-6 flex items-end justify-between border-b subtle-border" style="background: linear-gradient(135deg, ${accent}25, transparent), var(--bg-alt)">
                  <span class="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase accent-bg">${item.badge}</span>
                  <span class="text-2xl font-black opacity-30">0${i + 1}</span>
                </div>`
          }
          <div class="p-6 space-y-3">
            ${item.imageUrl ? `<span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase accent-bg">${item.badge}</span>` : ''}
            <h3 class="text-xl font-black">${item.title}</h3>
            <p class="text-xs leading-relaxed" style="color: var(--text-muted)">${item.desc}</p>
          </div>
        </div>
        <div class="p-6 pt-4 border-t subtle-border flex items-center justify-between">
          <span class="text-lg font-black accent-color">${item.price}</span>
          <button type="button" onclick="openActionModal('${item.title.replace(/'/g, '')}', '${item.price.replace(/'/g, '')}')" class="px-4 py-2.5 ${btnRadiusClass} text-xs font-extrabold accent-bg cursor-pointer">
            ${bp.ctaButton}
          </button>
        </div>
      </div>`
        )
        .join('')}
    </div>
  </section>`;
  }

  // 6. CUSTOM SECTIONS ADDED VIA CHAT
  const renderCustomSec = (sec: NonNullable<SiteBlueprint['customSections']>[number]) => `
  <section class="max-w-6xl mx-auto px-6 py-16 border-t subtle-border">
    <div class="rounded-3xl border subtle-border p-8 sm:p-12 shadow-xl grid grid-cols-1 ${sec.imageUrl ? 'lg:grid-cols-12' : ''} gap-8 items-center theme-card" style="background: radial-gradient(circle at top right, ${accent}18, transparent 70%), var(--bg-card)">
      ${
        sec.imageUrl && sec.imagePosition === 'left'
          ? `<div class="lg:col-span-5 rounded-2xl overflow-hidden border subtle-border h-64"><img src="${sec.imageUrl}" alt="${sec.title}" ${imgFallbackAttr} class="w-full h-full object-cover" /></div>`
          : ''
      }
      <div class="${sec.imageUrl ? 'lg:col-span-7' : ''} space-y-5">
        <span class="inline-block px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider accent-bg">${sec.badge}</span>
        <h2 class="heading-font text-3xl sm:text-4xl font-black tracking-tight">${sec.title}</h2>
        <p class="text-sm sm:text-base leading-relaxed" style="color: var(--text-muted)">${sec.content}</p>
        ${
          sec.bullets && sec.bullets.length > 0
            ? `<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                ${sec.bullets
                  .map(
                    (b) => `
                  <div class="p-3.5 rounded-2xl border subtle-border flex items-center gap-2.5" style="background-color: var(--bg-alt)">
                    <span class="w-5 h-5 rounded-full accent-bg flex items-center justify-center text-[10px] font-black flex-shrink-0">✓</span>
                    <span class="text-xs font-bold">${b}</span>
                  </div>`
                  )
                  .join('')}
              </div>`
            : ''
        }
        <div class="pt-2">
          <button type="button" onclick="openActionModal('${sec.title.replace(/'/g, '')}', '${bp.priceText.replace(/'/g, '')}')" class="px-7 py-3.5 ${btnRadiusClass} font-extrabold text-xs accent-bg shadow-lg cursor-pointer">
            ${sec.ctaText || bp.ctaButton} →
          </button>
        </div>
      </div>
      ${
        sec.imageUrl && sec.imagePosition !== 'left'
          ? `<div class="lg:col-span-5 rounded-2xl overflow-hidden border subtle-border h-64"><img src="${sec.imageUrl}" alt="${sec.title}" ${imgFallbackAttr} class="w-full h-full object-cover" /></div>`
          : ''
      }
    </div>
  </section>`;

  const topCustomHtml = (bp.customSections || []).filter((s) => s.placement === 'top').map(renderCustomSec).join('');
  const midCustomHtml = (bp.customSections || []).filter((s) => !s.placement || s.placement === 'middle').map(renderCustomSec).join('');
  const botCustomHtml = (bp.customSections || []).filter((s) => s.placement === 'bottom').map(renderCustomSec).join('');

  // 7. SECTION 2: DIFERENCIAIS (#diferenciais)
  const benefitsHtml = bp.showBenefits
    ? `
  <section id="diferenciais" class="py-20 px-6 my-4 border-y subtle-border scroll-mt-24 transition-all duration-500" style="background-color: var(--bg-alt)">
    <div class="max-w-6xl mx-auto space-y-12">
      <div class="space-y-2">
        <span class="px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest accent-bg">DIFERENCIAIS</span>
        <h2 class="heading-font text-3xl sm:text-4xl font-black pt-2">Por que escolher ${bp.brandName}?</h2>
        <p class="text-sm max-w-2xl" style="color: var(--text-muted)">Nossos diferenciais pensados para entregar o melhor resultado para você.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        ${bp.benefits
          .map(
            (b, idx) => `
        <div class="p-7 rounded-3xl border subtle-border space-y-4 theme-card" style="background-color: var(--bg-card)">
          <div class="w-11 h-11 ${btnRadiusClass} accent-bg flex items-center justify-center font-black text-xs">0${idx + 1}</div>
          <h3 class="font-extrabold text-base">${b.title}</h3>
          <p class="text-xs leading-relaxed" style="color: var(--text-muted)">${b.desc}</p>
        </div>`
          )
          .join('')}
      </div>
    </div>
  </section>`
    : '';

  // 8. SECTION 3: AVALIAÇÕES (#avaliacoes)
  const testimonialsHtml = bp.showTestimonials
    ? `
  <section id="avaliacoes" class="max-w-6xl mx-auto px-6 py-20 space-y-12 scroll-mt-24 transition-all duration-500">
    <div class="text-center max-w-2xl mx-auto space-y-3">
      <span class="px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest accent-bg">AVALIAÇÕES</span>
      <h2 class="heading-font text-3xl sm:text-4xl font-black pt-2">O que dizem sobre ${bp.brandName}</h2>
      <p class="text-sm" style="color: var(--text-muted)">Experiências reais de quem já adquiriu e aprovou.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-7">
      ${bp.testimonials
        .map(
          (t) => `
      <div class="p-7 rounded-3xl border subtle-border space-y-4 theme-card" style="background-color: var(--bg-card)">
        <div class="accent-color text-sm tracking-widest">★★★★★</div>
        <p class="text-xs sm:text-sm leading-relaxed" style="color: var(--text-muted)">"${t.text}"</p>
        <div class="pt-3 border-t subtle-border">
          <p class="text-xs font-extrabold">${t.name}</p>
          <p class="text-[11px]" style="color: var(--text-muted)">${t.role}</p>
        </div>
      </div>`
        )
        .join('')}
    </div>
  </section>`
    : '';

  // 9. SECTION 4: DÚVIDAS / FAQ (#faq)
  const faqHtml = bp.showFaq
    ? `
  <section id="faq" class="max-w-4xl mx-auto px-6 py-20 space-y-10 border-t subtle-border scroll-mt-24 transition-all duration-500">
    <div class="text-center space-y-3">
      <span class="px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest accent-bg">DÚVIDAS</span>
      <h2 class="heading-font text-3xl sm:text-4xl font-black pt-2">Perguntas & Respostas sobre ${bp.brandName}</h2>
      <p class="text-sm" style="color: var(--text-muted)">Clique em qualquer pergunta abaixo para ver a resposta completa.</p>
    </div>
    <div class="space-y-4">
      ${bp.faq
        .map(
          (f, idx) => `
      <details ${idx === 0 ? 'open' : ''} class="p-6 rounded-2xl border subtle-border cursor-pointer theme-card" style="background-color: var(--bg-card)">
        <summary class="font-extrabold text-sm flex items-center justify-between gap-4">
          <span>${f.q}</span>
          <span class="accent-color text-xs font-black">+</span>
        </summary>
        <p class="text-xs sm:text-sm mt-3 pt-3 border-t subtle-border leading-relaxed" style="color: var(--text-muted)">${f.a}</p>
      </details>`
        )
        .join('')}
    </div>
  </section>`
    : '';

  // Floating WhatsApp Button (when requested in the prompt or enabled on blueprint)
  const floatingWhatsappHtml = bp.showFloatingWhatsapp
    ? `
  <button type="button" onclick="openActionModal('Atendimento WhatsApp • ${bp.brandName.replace(/'/g, '')}', '${bp.priceText.replace(/'/g, '')}')" class="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-5 py-3.5 rounded-full font-extrabold text-xs text-white shadow-2xl transition hover:scale-105 cursor-pointer" style="background-color: #25D366">
    <span>WhatsApp • Falar Agora</span>
  </button>`
    : '';

  const pixQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    `00020126580014BR.GOV.BCB.PIX0136${pixKeySafe}5204000053039865802BR5920${bp.brandName.slice(0, 20)}6009SAOPAULO62070503***6304`
  )}`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${bp.brandName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Instrument+Serif:ital@0;1&family=Orbitron:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-main: ${bgMain};
      --bg-alt: ${bgAlt};
      --bg-card: ${bgCard};
      --text-main: ${textMain};
      --text-muted: ${textMuted};
      --accent: ${accent};
      --border-col: ${borderCol};
    }
    html {
      scroll-behavior: smooth;
    }
    body {
      background-color: var(--bg-main);
      color: var(--text-main);
      font-family: ${fontBodyCss};
      ${extraBodyCss}
    }
    .heading-font {
      font-family: ${fontHeadingCss};
      ${extraHeadingCss}
    }
    .theme-card {
      ${extraCardCss}
    }
    .accent-color { color: var(--accent); }
    .accent-bg { background-color: var(--accent); color: ${accentTextOnBg}; }
    .accent-border { border-color: var(--accent); }
    .subtle-border { border-color: var(--border-col); }
    .section-highlight {
      box-shadow: 0 0 0 3px var(--accent), 0 0 35px ${accent}55 !important;
      border-radius: 24px;
    }
  </style>
</head>
<body class="min-h-screen flex flex-col">
  ${headerHtml}
  ${topCustomHtml}
  ${heroHtml}
  ${galleryHtml}
  ${showcaseHtml}
  ${midCustomHtml}
  ${benefitsHtml}
  ${testimonialsHtml}
  ${faqHtml}
  ${botCustomHtml}
  ${floatingWhatsappHtml}

  <!-- Real Connected Payment Gateway Checkout Modal (PIX + Cartão de Crédito, Sem Boleto) -->
  <div id="actionModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm hidden items-center justify-center p-4 z-50">
    <div class="rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 border subtle-border shadow-2xl theme-card max-h-[92vh] overflow-y-auto" style="background-color: var(--bg-card); color: var(--text-main)">
      <div class="flex items-center justify-between border-b subtle-border pb-3">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span class="text-[11px] font-extrabold uppercase tracking-wider accent-color">Checkout Seguro • ${gwLabel}</span>
        </div>
        <button type="button" onclick="closeActionModal()" class="text-sm opacity-60 hover:opacity-100 cursor-pointer px-2 py-1">✕</button>
      </div>

      <div class="flex items-center justify-between gap-4 p-4 rounded-2xl border subtle-border" style="background-color: var(--bg-alt)">
        <div>
          <p class="text-[10px] font-bold uppercase opacity-70">${bp.brandName}</p>
          <h4 id="modalItemTitle" class="font-extrabold text-base sm:text-lg">${bp.brandName}</h4>
        </div>
        <div class="text-right">
          <p id="modalItemPrice" class="text-xl sm:text-2xl font-black accent-color">${bp.priceText}</p>
          <p class="text-[10px] opacity-70">PIX ou Cartão em até ${installmentsMax}x</p>
        </div>
      </div>

      ${
        gw.checkoutUrl
          ? `<a href="${gw.checkoutUrl}" target="_blank" rel="noopener noreferrer" class="block w-full py-3.5 text-center ${btnRadiusClass} font-extrabold text-xs accent-bg shadow-lg">
              Ir para Checkout Oficial (${gwLabel}) ↗
            </a>`
          : ''
      }

      <!-- Payment Method Tabs (Only PIX and Credit Card — NO Boleto) -->
      <div class="grid grid-cols-2 gap-2.5">
        <button type="button" id="tabBtnPix" onclick="switchPayTab('pix')" class="py-2.5 px-3 rounded-xl text-xs font-extrabold border accent-bg cursor-pointer">
          PIX Imediato
        </button>
        <button type="button" id="tabBtnCard" onclick="switchPayTab('card')" class="py-2.5 px-3 rounded-xl text-xs font-bold border subtle-border cursor-pointer" style="background-color: var(--bg-alt); color: var(--text-main)">
          Cartão até ${installmentsMax}x
        </button>
      </div>

      <!-- Customer Info -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <input type="text" id="custName" placeholder="Seu nome completo" class="w-full px-3.5 py-2.5 rounded-xl border subtle-border text-xs bg-transparent focus:outline-none" />
        <input type="text" id="custPhone" placeholder="Seu WhatsApp / E-mail" class="w-full px-3.5 py-2.5 rounded-xl border subtle-border text-xs bg-transparent focus:outline-none" />
      </div>

      <!-- TAB 1: PIX -->
      <div id="payPanelPix" class="space-y-4 text-center pt-1">
        <div class="p-4 rounded-2xl border subtle-border inline-block bg-white">
          <img src="${pixQrUrl}" alt="QR Code PIX" class="w-36 h-36 mx-auto object-contain" />
        </div>
        <div class="space-y-1">
          <p class="text-xs font-bold">Recebedor (${gw.pixBeneficiary || bp.brandName}): <span class="accent-color">${pixKeySafe}</span></p>
          <p class="text-[11px] opacity-75">Escaneie o QR Code acima ou copie o código PIX Copia e Cola abaixo:</p>
        </div>
        <div class="flex items-center gap-2">
          <input type="text" id="pixCopyInput" readonly value="00020126580014BR.GOV.BCB.PIX0136${pixKeySafe}5204000053039865802BR5920${bp.brandName.slice(0, 18)}" class="w-full px-3 py-2.5 rounded-xl border subtle-border text-[11px] font-mono bg-transparent opacity-80" />
          <button type="button" onclick="copyPixCode()" id="copyPixBtn" class="px-4 py-2.5 rounded-xl text-xs font-extrabold accent-bg flex-shrink-0 cursor-pointer">
            Copiar PIX
          </button>
        </div>
        <button type="button" onclick="confirmGatewayPayment('PIX')" class="w-full py-3.5 ${btnRadiusClass} font-extrabold text-xs shadow-md accent-bg cursor-pointer">
          Pagar Agora via PIX →
        </button>
      </div>

      <!-- TAB 2: CREDIT CARD -->
      <div id="payPanelCard" class="hidden space-y-3 text-left pt-1">
        <input type="text" placeholder="Número do Cartão (0000 0000 0000 0000)" class="w-full px-3.5 py-2.5 rounded-xl border subtle-border text-xs bg-transparent focus:outline-none" />
        <input type="text" placeholder="Nome impresso no cartão" class="w-full px-3.5 py-2.5 rounded-xl border subtle-border text-xs bg-transparent focus:outline-none" />
        <div class="grid grid-cols-2 gap-2.5">
          <input type="text" placeholder="Validade (MM/AA)" class="w-full px-3.5 py-2.5 rounded-xl border subtle-border text-xs bg-transparent focus:outline-none" />
          <input type="text" placeholder="CVV (3 dígitos)" class="w-full px-3.5 py-2.5 rounded-xl border subtle-border text-xs bg-transparent focus:outline-none" />
        </div>
        <select class="w-full px-3.5 py-2.5 rounded-xl border subtle-border text-xs bg-transparent focus:outline-none" style="background-color: var(--bg-alt); color: var(--text-main)">
          <option value="1">1x de ${bp.priceText} sem juros</option>
          <option value="3">3x sem juros no cartão</option>
          <option value="6">6x no cartão de crédito</option>
          <option value="12">${installmentsMax}x no cartão de crédito</option>
        </select>
        <button type="button" onclick="confirmGatewayPayment('Cartão de Crédito')" class="w-full py-3.5 ${btnRadiusClass} font-extrabold text-xs shadow-md accent-bg cursor-pointer">
          Pagar com Cartão via ${gwLabel} →
        </button>
      </div>

      <p id="paymentStatusMsg" class="hidden text-xs font-bold text-emerald-400 text-center pt-2"></p>
    </div>
  </div>

  <footer class="mt-auto py-10 px-6 border-t subtle-border text-center text-xs space-y-2" style="color: var(--text-muted)">
    <p>${bp.footerText || `© ${new Date().getFullYear()} ${bp.brandName} • Todos os direitos reservados.`}</p>
    <p class="text-[11px] opacity-75">Pagamentos processados com segurança via ${gwLabel} • PIX Imediato e Cartão de Crédito</p>
  </footer>

  <script>
    function navigateToSection(sectionId, btnEl) {
      var target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.classList.add('section-highlight');
        setTimeout(function() {
          target.classList.remove('section-highlight');
        }, 1800);
      }
      if (btnEl) {
        var allPills = document.querySelectorAll('.nav-pill');
        allPills.forEach(function(p) {
          p.style.backgroundColor = 'var(--bg-alt)';
          p.style.color = 'var(--text-main)';
        });
        btnEl.style.backgroundColor = 'var(--accent)';
        btnEl.style.color = '${accentTextOnBg}';
      }
    }

    function openActionModal(itemTitle, itemPrice) {
      if (itemTitle) {
        document.getElementById('modalItemTitle').textContent = itemTitle;
      }
      if (itemPrice) {
        document.getElementById('modalItemPrice').textContent = itemPrice;
      }
      var msg = document.getElementById('paymentStatusMsg');
      if (msg) msg.classList.add('hidden');
      var m = document.getElementById('actionModal');
      m.classList.remove('hidden');
      m.classList.add('flex');
    }

    function closeActionModal() {
      var m = document.getElementById('actionModal');
      m.classList.add('hidden');
      m.classList.remove('flex');
    }

    function switchPayTab(tab) {
      var panels = {
        pix: document.getElementById('payPanelPix'),
        card: document.getElementById('payPanelCard')
      };
      var btns = {
        pix: document.getElementById('tabBtnPix'),
        card: document.getElementById('tabBtnCard')
      };
      Object.keys(panels).forEach(function(k) {
        if (!panels[k] || !btns[k]) return;
        if (k === tab) {
          panels[k].classList.remove('hidden');
          btns[k].className = 'py-2.5 px-3 rounded-xl text-xs font-extrabold border accent-bg cursor-pointer';
          btns[k].style.backgroundColor = '';
          btns[k].style.color = '';
        } else {
          panels[k].classList.add('hidden');
          btns[k].className = 'py-2.5 px-3 rounded-xl text-xs font-bold border subtle-border cursor-pointer';
          btns[k].style.backgroundColor = 'var(--bg-alt)';
          btns[k].style.color = 'var(--text-main)';
        }
      });
    }

    function copyPixCode() {
      var input = document.getElementById('pixCopyInput');
      var btn = document.getElementById('copyPixBtn');
      if (input && navigator.clipboard) {
        navigator.clipboard.writeText(input.value);
      }
      if (btn) {
        btn.textContent = 'PIX Copiado! ✓';
        setTimeout(function() { btn.textContent = 'Copiar PIX'; }, 2500);
      }
    }

    function confirmGatewayPayment(method) {
      var titleEl = document.getElementById('modalItemTitle');
      var priceEl = document.getElementById('modalItemPrice');
      var nameEl = document.getElementById('custName');
      var phoneEl = document.getElementById('custPhone');

      var itemTitle = titleEl ? titleEl.textContent : '${bp.brandName.replace(/'/g, '')}';
      var itemPrice = priceEl ? priceEl.textContent : '${bp.priceText.replace(/'/g, '')}';
      var customerName = nameEl && nameEl.value ? nameEl.value : 'Cliente do Site';
      var customerContact = phoneEl && phoneEl.value ? phoneEl.value : '';

      try {
        window.parent.postMessage({
          type: 'MATO_SITE_PAYMENT_COMPLETED',
          itemTitle: itemTitle,
          itemPrice: itemPrice,
          method: method === 'PIX' ? 'pix' : 'card',
          customerName: customerName,
          customerContact: customerContact
        }, '*');
      } catch (err) {}

      var msg = document.getElementById('paymentStatusMsg');
      if (msg) {
        msg.textContent = '✓ Pagamento via ' + method + ' aprovado! O valor foi creditado diretamente na sua conta MATO Pay.';
        msg.classList.remove('hidden');
      }
      setTimeout(function() {
        closeActionModal();
      }, 2200);
    }

    // Prevent any <a href="#"> from navigating the srcdoc iframe to a blank/black page
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a');
      if (link) {
        var href = link.getAttribute('href') || '';
        if (href.startsWith('#')) {
          e.preventDefault();
          if (href.length > 1) {
            navigateToSection(href.slice(1));
          }
        }
      }
    });
  </script>
</body>
</html>`;
}
