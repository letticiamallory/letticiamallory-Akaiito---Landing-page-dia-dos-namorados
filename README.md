# Akaiito

Plataforma de presentes digitais personalizados para casais. O usuário monta uma página interativa no celular — com música, carta, fotos, contador de dias, câmera polaroid, museu e outros cards — paga via Pix (Mercado Pago) e recebe um link permanente para enviar no WhatsApp.

**Produto atual:** Memórias de Nós · **R$ 4,90** (pagamento único, sem mensalidade)

---

## Índice

- [O que é](#o-que-é)
- [Fluxo do usuário](#fluxo-do-usuário)
- [Seções do presente](#seções-do-presente)
- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Rodar localmente](#rodar-localmente)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Integrações](#integrações)
- [Deploy (Vercel + Supabase)](#deploy-vercel--supabase)
- [Scripts úteis](#scripts-úteis)
- [Limitações conhecidas](#limitações-conhecidas)

---

## O que é

O Akaiito transforma memórias de um casal em uma **experiência digital rolável no celular**, com visual de colagem/scrapbook vermelho, animações e interações (abrir envelope, disparar câmera polaroid, montar museu, morder bombons, etc.).

Não é um app para instalar: é um **link único** (`/presente/[slug]`) que abre direto no navegador do celular.

### Público

- Quem quer criar um presente digital para o Dia dos Namorados, aniversário de namoro ou qualquer data especial
- Foco em simplicidade: montar em minutos, pagar com Pix, mandar o link

### Modelo de negócio

- Preço fixo por presente (hoje R$ 4,90)
- Todas as seções premium estão incluídas no preço base
- Link permanente após o pagamento
- Sem cadastro obrigatório para o comprador

---

## Fluxo do usuário

```
Landing (/)
    ↓
Escolher seções (/criar/secoes)
    ↓
Personalizar cada card (/criar/personalizar/[step])
    ↓
Preview + checkout (/criar/preview)
    ↓
Mercado Pago (Pix)
    ↓
Confirmação (/pagamento/[id] → /obrigado/[slug])
    ↓
Link do presente (/presente/[slug]) → compartilha no WhatsApp
```

### Detalhes de cada etapa

| Etapa | Rota | O que acontece |
|-------|------|----------------|
| **Landing** | `/` | Marketing, mockups, FAQ, CTA para criar |
| **Escolher seções** | `/criar/secoes` | Cards obrigatórios + opcionais; estado salvo no `localStorage` |
| **Personalizar** | `/criar/personalizar/0…N` | Formulário por seção (fotos, textos, buquê, museu, etc.) |
| **Preview** | `/criar/preview` | Página completa com marca d'água + botão de compra |
| **Pagamento** | Checkout MP | Preferência Pix criada via API; preload de assets pesados |
| **Confirmação** | `/pagamento/[id]` | Aguarda webhook ou verificação manual do Pix |
| **Obrigado** | `/obrigado/[slug]` | Link gerado; e-mail enviado via Resend |
| **Presente** | `/presente/[slug]` | Experiência final para quem recebe |

---

## Seções do presente

Cada seção vira um **card** na página rolável. Algumas são obrigatórias.

| Seção | ID | Obrigatória | Descrição |
|-------|-----|-------------|-----------|
| Casal | `hero_couple` | Sim | Foto, nomes, data, buquê personalizado |
| Contador | `counter_together` | Sim | Tempo juntos ao vivo (anos, meses, dias, horas) |
| Nossa Música | `favorite_song` | Sim | Player com capa e polaroids no varal |
| Câmera do Presente | `polaroid_camera` | Não | Caixa animada + câmera polaroid com fotos |
| Memórias | `photo_collage` | Não | Galeria por momentos com lightbox |
| Carta de Amor | `love_letter` | Não | Envelope animado com mensagem |
| Museu de Nós | `museum_of_us` | Não | Museu interativo com quadros e espectadores |
| Caixa de Bombons | `chocolate_box` | Não | Caixa interativa com mordidas |
| Despedida | `custom_message` | Sim | Mensagem final com assinatura |

A ordem dos cards na página segue a ordem definida no builder.

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI | React 19, Tailwind CSS 4, Framer Motion |
| Estado (builder) | Zustand + persist (localStorage) |
| Banco | PostgreSQL via [Drizzle ORM](https://orm.drizzle.team) + `postgres.js` |
| Pagamentos | [Mercado Pago](https://www.mercadopago.com.br) (Pix) |
| E-mail | [Resend](https://resend.com) |
| Fontes | Syne, Instrument Serif, Playfair Display, etc. |
| Dev DB | Docker Compose (Postgres 16) |
| Deploy alvo | Vercel + Supabase |

---

## Arquitetura

### Builder (criação do presente)

O fluxo de criação vive em `src/builder/`:

- **`builder.store.ts`** — estado global das seções, e-mail do comprador e passo atual; persiste no navegador
- **`ChooseSections`** — seleção de cards
- **`CustomizeSection`** — formulários por seção (`SectionForm`, `PresentCardForm`)
- **`PreviewStep`** — preview com watermark + checkout

Os dados do presente são serializados como `ScrapbookPresentData` (JSON) e salvos no banco na tabela `gifts`.

### Presente (experiência final)

Renderizado por `CollagePresentPage` / `ScrapbookPresentPage`:

- Cards no estilo **panda/scrapbook** (`src/components/present/panda/`)
- Seções pesadas: **câmera polaroid** (`ValentineCameraExperience`) e **museu** (`MuseumViewer`)
- Preload de assets em `src/lib/present-preload.ts` (câmera, museu, fotos do usuário)
- Preload antecipado no checkout e na página de pagamento

### API

| Rota | Método | Função |
|------|--------|--------|
| `/api/gifts` | POST | Cria pedido + preferência Mercado Pago |
| `/api/gifts/[id]` | GET | Status do pedido, link, dados para preload |
| `/api/gifts/[id]` | POST | Confirma pagamento (webhook, verificação ou demo) |
| `/api/webhooks/mercadopago` | POST/GET | Notificação de pagamento aprovado |
| `/api/upload` | POST | Upload de imagens (ver limitação abaixo) |
| `/api/music-metadata` | GET | Metadados de música (título, capa) |

### Banco de dados

Tabela `gifts` (criada automaticamente no primeiro acesso via `ensureSchema()`):

```
id, slug, product_id, data (JSON), status, amount_cents,
mp_preference_id, mp_payment_id, buyer_email, created_at, paid_at
```

Status: `pending` → `paid` (gera `slug` único)

### Pagamento

1. `createGift()` insere pedido `pending` e cria preferência MP
2. Usuário paga no checkout Mercado Pago
3. Confirmação via:
   - **Webhook** `POST /api/webhooks/mercadopago` (produção)
   - **Verificação manual** na página `/pagamento/[id]`
   - **Modo demo** se não houver token MP configurado
4. `markGiftPaid()` gera slug e dispara e-mail com o link

---

## Estrutura do projeto

```
src/
├── app/                          # Rotas Next.js
│   ├── page.tsx                  # Landing page
│   ├── criar/                    # Fluxo do builder
│   │   ├── secoes/               # Escolher cards
│   │   ├── personalizar/[step]/  # Personalizar cada seção
│   │   └── preview/              # Preview + checkout
│   ├── presente/[slug]/          # Presente público (link final)
│   ├── pagamento/[id]/           # Aguardando/confirmação Pix
│   ├── obrigado/[slug]/          # Link gerado pós-pagamento
│   ├── contato/ privacidade/ termos/
│   └── api/
│       ├── gifts/                # CRUD de pedidos
│       ├── upload/               # Upload de fotos
│       └── webhooks/mercadopago/ # Webhook de pagamento
│
├── builder/                      # Fluxo de criação
│   ├── store/builder.store.ts    # Estado Zustand
│   ├── steps/                    # Passos do wizard
│   ├── forms/                    # Formulários por seção
│   └── components/               # Shell, progresso, watermark
│
├── components/
│   ├── present/                  # Experiência do presente
│   │   ├── collage/              # Página rolável principal
│   │   ├── panda/                # Cards scrapbook
│   │   ├── camera/               # Câmera polaroid animada
│   │   └── love-landing/         # Telas embutidas (museu, etc.)
│   ├── museum/                   # Editor e viewer do museu
│   ├── letter/                   # Carta com envelope
│   ├── chocolate/                # Caixa de bombons
│   ├── bouquet/                  # Buquê personalizado
│   ├── polaroid/                 # Experiência polaroid
│   └── marketing/                # Landing, mockups, footer
│
├── lib/
│   ├── db/                       # Drizzle + schema + ensureSchema
│   ├── gifts.ts                  # Lógica de negócio (criar, pagar, slug)
│   ├── mercadopago.ts            # Preferência, verificação, sandbox
│   ├── email/                    # Resend + template do link
│   ├── present-preload.ts        # Preload de assets pesados
│   ├── builder/                  # Catálogo, tipos, pricing, utils
│   └── products.ts               # Catálogo de produtos
│
├── data/                         # Assets estáticos, demos, catálogos
└── hooks/                        # Hooks compartilhados

public/
├── assets/                       # Imagens da câmera, demos
├── museum/                       # SVGs do museu (cenário, molduras)
├── polaroid/                     # Frames polaroid
└── uploads/                      # Uploads locais (só dev)
```

---

## Rodar localmente

### Pré-requisitos

- Node.js 20+
- Docker (para Postgres local) ou conta Supabase

### Passo a passo

```bash
# 1. Instalar dependências
npm install

# 2. Configurar ambiente
cp .env.example .env.local
# Edite .env.local com suas chaves

# 3. Subir banco local
npm run db:up

# 4. Rodar o servidor
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Modo demo (sem Mercado Pago)

Se `MERCADOPAGO_ACCESS_TOKEN` não estiver configurado, o site entra em **modo demonstração**: após o preview, o checkout simula o pagamento e gera o link sem Pix real.

### Modo sandbox (conta de teste MP)

Com token configurado e `MERCADOPAGO_USE_SANDBOX=true`:

- Checkout abre no sandbox do Mercado Pago
- Pague com **usuário de teste** do MP
- Webhook **não funciona** em localhost — use "Verificar pagamento" ou "Gerar presente agora (dev)"

---

## Variáveis de ambiente

Copie `.env.example` → `.env.local`.

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `DATABASE_URL` | Sim | Postgres (local: porta `5433`; produção: Supabase pooler) |
| `NEXT_PUBLIC_BASE_URL` | Sim | URL pública do site. Local: `http://localhost:3000`. Produção: `https://akaiito.com.br` |
| `MERCADOPAGO_ACCESS_TOKEN` | Para Pix real | Access Token do Mercado Pago |
| `MERCADOPAGO_PUBLIC_KEY` | Opcional | Chave pública (futuro checkout transparente) |
| `MERCADOPAGO_TEST_ACCESS_TOKEN` | Opcional | Token de teste usado em dev (se vazio, usa o de produção) |
| `MERCADOPAGO_USE_SANDBOX` | Recomendado | `true` = checkout sandbox · `false` = Pix real |
| `RESEND_API_KEY` | Para e-mail | Chave da API Resend |
| `EMAIL_FROM` | Opcional | Remetente (domínio verificado no Resend). Use aspas se tiver espaço. Default: `Akaiito <contato@dailyailab.online>` |
| `VERIFY_TEST_EMAIL` | Opcional | E-mail de destino para teste de envio (`npm run verify-deploy -- --send-email`) |

> **Nunca** commite `.env.local` — já está no `.gitignore`.

---

## Integrações

### Mercado Pago

- Cria preferência de pagamento Pix (`createPreference`)
- Exclui cartão de crédito/débito — só Pix
- `external_reference` = ID do pedido
- `notification_url` = `{BASE_URL}/api/webhooks/mercadopago`
- `auto_return` só ativa com HTTPS (produção)

**Webhook (produção):**

```
URL:    https://akaiito.com.br/api/webhooks/mercadopago
Evento: payment
```

Não funciona com `localhost` — o MP precisa alcançar uma URL pública.

### Resend

Após pagamento confirmado, envia e-mail ao comprador com:

- Link do presente (`/presente/[slug]`)
- Template HTML em `src/lib/email/templates/gift-link.ts`

O domínio do remetente (`EMAIL_FROM`) precisa estar **verificado** no painel Resend (DNS: SPF, DKIM).

### Upload de imagens

`POST /api/upload` salva em `public/uploads/` no disco.

Funciona em desenvolvimento local. **Não persiste na Vercel** (filesystem efêmero). Ver [Limitações](#limitações-conhecidas).

---

## Deploy (Vercel + Supabase)

### 1. Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Copie a connection string do **Session pooler**:
   ```
   postgresql://postgres.[ref]:[senha]@aws-0-[região].pooler.supabase.com:5432/postgres
   ```
3. A tabela `gifts` é criada automaticamente no primeiro pedido

### 2. Vercel

1. Importe o repositório em [vercel.com](https://vercel.com)
2. Framework: Next.js (auto-detectado)
3. Em **Settings → Environment Variables**, configure todas as variáveis da tabela acima
4. `NEXT_PUBLIC_BASE_URL` = `https://akaiito.com.br` (HTTPS obrigatório)
5. Deploy

### 3. Domínio

1. Vercel → **Settings → Domains** → adicione `akaiito.com.br`
2. Configure DNS conforme instruções da Vercel
3. Atualize `NEXT_PUBLIC_BASE_URL` e redeploy

### 4. Mercado Pago (produção)

1. Ative credenciais de **produção** no painel MP
2. Configure webhook (URL HTTPS + evento `payment`)
3. `MERCADOPAGO_USE_SANDBOX=false` na Vercel

### 5. Resend

1. Verifique domínio `akaiito.com.br` no Resend
2. `RESEND_API_KEY` na Vercel

### Checklist pré-deploy (local)

Rode antes de importar na Vercel ou após mudar variáveis de ambiente:

```bash
npm run verify-deploy
```

O script valida:

| Check | O que testa |
|-------|-------------|
| Variáveis de ambiente | `DATABASE_URL`, `NEXT_PUBLIC_BASE_URL`, MP, Resend |
| Banco de dados | Conexão Postgres e tabela `gifts` |
| Mercado Pago | Token válido + criação de preferência Pix (sandbox ou produção) |
| Resend | Domínio do `EMAIL_FROM` verificado no painel |
| Build | `next build` sem erros |

Opções:

```bash
npm run verify-deploy -- --skip-build    # mais rápido, sem build
npm run verify-deploy -- --send-email    # envia e-mail de teste (requer VERIFY_TEST_EMAIL)
npm run test                             # alias de verify-deploy
```

Requisitos locais para o check de banco passar: Docker rodando (`npm run db:up`) **ou** `DATABASE_URL` apontando para Supabase.

Em produção, configure as mesmas variáveis na Vercel — o script lê `.env.local` apenas na sua máquina.

### Checklist pós-deploy

- [ ] Site abre em HTTPS
- [ ] Criar presente → checkout MP abre
- [ ] Pix pago → link gerado em `/obrigado/[slug]`
- [ ] E-mail recebido com o link
- [ ] `/presente/[slug]` renderiza corretamente
- [ ] Webhook confirma sem intervenção manual

---

## Scripts úteis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção (após build)
npm run lint         # ESLint

npm run db:up        # Sobe Postgres local (Docker, porta 5433)
npm run db:down      # Para Postgres local
npm run db:push      # Drizzle push (schema)

npm run record-demo          # Grava vídeo demo (Playwright)
npm run capture-hero-shots   # Screenshots do hero (Playwright)
npm run optimize-svgs        # Extrai imagens de SVGs grandes para WebP (*.assets/)
npm run verify-deploy        # Verificação pré-deploy (env, DB, MP, Resend, build)
npm run test                 # Alias de verify-deploy
```

---

## Limitações conhecidas

### Upload de fotos na Vercel

Fotos enviadas pelo usuário vão para `public/uploads/` no disco local. Na Vercel o filesystem é **efêmero** — uploads não persistem entre deploys nem entre invocações serverless.

**Antes de abrir para clientes reais**, é necessário migrar para armazenamento externo (recomendado: **Supabase Storage**).

### Webhook em localhost

O Mercado Pago não consegue chamar `http://localhost:3000/api/webhooks/mercadopago`. Em dev, confirme pagamentos manualmente na página `/pagamento/[id]`.

### Conta de teste vs produção

O token atual pode ser de **conta de teste** do MP (`TESTUSER...`). Nesse caso:

- Use `MERCADOPAGO_USE_SANDBOX=true`
- Pagamentos são simulados (usuários de teste)
- Para Pix real, ative credenciais de produção no painel MP

### Preload de assets

Câmera polaroid e museu carregam muitos SVGs e fotos. O sistema pré-carrega assets no checkout e na página de pagamento, mas quem abre o link frio (destinatário no WhatsApp) ainda depende do preload na própria página do presente.

### Produtos legados

Rotas `/criar/[productId]` e `/p/[[slug]]` existem para presentes antigos (`joguinho`, `carta`, `museu`, etc.). O produto ativo na loja é apenas **`historia`** (Memórias de Nós).

---

## Licença

Projeto privado. Todos os direitos reservados.
