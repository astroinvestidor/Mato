# MATO — Plataforma Digital Completa
> **Crie. Venda. Cresça.**

Plataforma SaaS moderna e fintech integrada de alta performance com três produtos principais:
- **MATO Pay:** Checkout transparente, emissão de cobranças instantâneas via Pix com QR Code e cartões.
- **MATO Sites:** Construtor de sites, lojas virtuais e landing pages com IA e checkout integrado.
- **MATO IA:** Copiloto inteligente para estratégias comerciais, geração de copy e automação de vendas.

---

## 🎨 Identidade Visual e Arquitetura

- **Estilo:** Dark Premium futurista com fundo grafite/preto (`#08090b`), verde neon (`#22c55e`) para pagamentos e destaques, e roxo (`#8b5cf6`) para o criador de sites.
- **Fidelidade Visual:** Baseado rigorosamente na composição visual homologada.
- **Tecnologias:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons.
- **Banco de Dados & Autenticação:** Supabase PostgreSQL com Row Level Security (RLS) habilitado.

---

## 🚀 Como Executar o Projeto

```bash
# 1. Acesse o diretório do projeto
cd C:\Users\T-GAMER\.gemini\antigravity\scratch\mato-platform

# 2. Instale as dependências (já instaladas)
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev

# 4. Para gerar o build de produção
npm run build
```

---

## 📁 Estrutura de Pastas

```
mato-platform/
├── src/
│   ├── components/
│   │   ├── layout/       # Sidebar e Header com saudações e perfil
│   │   ├── dashboard/    # HeroBanner, QuickAccess, Metrics, Revenue SVG Chart, Onboarding, IA Widget
│   │   ├── pay/          # Módulo MATO Pay (Cobranças, QR Code Pix, detalhes)
│   │   ├── sites/        # Módulo MATO Sites (Criação, pré-visualização, templates)
│   │   ├── ai/           # MATO IA Studio (Chat, presets, análise de métricas)
│   │   ├── products/     # Catálogo de produtos, SKU e controle de estoque
│   │   ├── customers/    # Gestão de clientes e LTV
│   │   ├── sales/        # Histórico consolidado de pedidos
│   │   ├── links/        # Links de pagamento com métricas de cliques e conversão
│   │   ├── affiliates/   # Programa de afiliados e cálculo de comissões
│   │   ├── analytics/    # Gráficos de conversão e ticket médio real
│   │   ├── settings/     # Planos, consumo de IA e políticas de segurança
│   │   └── common/       # Banners de sandbox e notificações toast
│   ├── context/          # AppContext reativo para estado global
│   ├── data/             # Dados demonstrativos reais alinhados ao design
│   ├── services/         # Contratos Supabase, Gateways de Pagamento e IA
│   └── types/            # Tipos e interfaces TypeScript
├── supabase/
│   └── schema.sql        # Schema SQL com RLS completo para produção
├── .env.example          # Modelo de configuração de variáveis de ambiente
└── package.json
```

---

## 🔒 Segurança e Práticas Fintech

1. **Modo Demonstração Honesto:** Transações bancárias e cobranças são identificadas como sandbox. Nenhuma simulação finge dinheiro real transferido sem confirmação do servidor.
2. **Proteção de Segredos:** Nenhuma chave de API (LLM, Stripe, Pagar.me, Asaas, etc.) é exposta no frontend.
3. **Isolamento de Dados (RLS):** O arquivo `supabase/schema.sql` contém regras estritas de isolamento por `auth.uid() = user_id`.
