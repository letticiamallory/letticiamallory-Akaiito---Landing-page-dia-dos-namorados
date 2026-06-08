# Nossa História — Pesquisa e Plano de Consolidação

Documento de referência para transformar o Linkamor em **um produto principal de landing page scroll** para casais, com múltiplos temas visuais e módulos interativos opcionais (ex-produtos).

**Status:** em execução por fases (ver §10).

---

## 1. Situação atual (codebase)

### 1.1 Stack

- Next.js 16 App Router, React 19
- SQLite (`better-sqlite3` + Drizzle)
- Mercado Pago
- Zustand (editors Museu + Chocolates)
- Framer Motion (Polaroid)

### 1.2 Rotas principais

| Rota | Função |
|------|--------|
| `/` | Marketing + grid de produtos |
| `/criar/[productId]` | Personalização |
| `/pagamento/[id]` | Pós-checkout |
| `/p/[slug]` | Entrega do presente (viewer) |

### 1.3 Produtos hoje

| ID | Nome | Formato | Preço |
|----|------|---------|-------|
| `historia` | Nossa História | **Scroll landing** | R$ 19,90 |
| `carta` | Carta com Buquê | Cena única (envelope) | R$ 9 |
| `museu` | Museu de Nós | Canvas drag-and-drop | R$ 15 |
| `chocolates` | Caixa de Chocolates | Caixa interativa | R$ 13 |
| `polaroid` | Câmera do Amor | Sequência de telas | R$ 14 |
| `joguinho` | Joguinho do Casal | Quiz | R$ 12 |
| `slot` | Máquina de Surpresas | Slot machine | R$ 12 |
| `kit` | Kit Completo | Hub 4 produtos | R$ 39 |

**Arquivos centrais:**

- Catálogo: `src/lib/products.ts`
- Tipos JSON: `src/lib/gift-types.ts`
- Temas História: `src/lib/historia-themes.ts`
- Viewer scroll: `src/components/historia/HistoriaPage.tsx`
- Builder: `src/components/historia/historia-studio.tsx`
- Router create: `src/components/create-form.tsx`
- Router viewer: `src/app/p/[slug]/page.tsx`

### 1.4 Banco de dados

Tabela `gifts`: um registro por compra; `product_id` + `data` (JSON). Toda personalização vive no JSON — sem tabelas normalizadas por seção.

### 1.5 Conclusão

**Nossa História já é o modelo certo.** Os demais produtos são **módulos interativos** candidatos a **seções** dentro da mesma landing scroll, não apps separados.

---

## 2. Referências de mercado

### LoveTale / Love Wrapped

- Jornada com **~15 estágios** (não só scroll passivo)
- Timeline, galeria, quiz, “motivos que te amo”, carta
- Link privado + QR code
- Criação guiada em ~5 minutos
- **Um produto**, várias apresentações visuais

### Scrollytelling (Apple, Basement Studio, GSAP ScrollTrigger)

- Seções em viewport cheio ou quase
- Animações **sincronizadas ao scroll**
- Indicadores de progresso (dots, barra)
- Reveal: fade, slide, parallax

### Padrão ideal para casais

```
Hero → contador → marcos → fotos → música → carta →
surpresa interativa → encerramento + compartilhar
```

Texto + foto + áudio + **1–2 momentos interativos** no mesmo fluxo.

---

## 3. Visão de produto

### 3.1 Um produto, vários temas

O usuário escolhe **como a história vai parecer**, não “qual app baixar”:

| Tema | Vibe | Paleta / referência |
|------|------|---------------------|
| **Fofinho** | Romântico clássico (`classico`) | Creme, bordô, dourado |
| **Galáxia** | Noturno, estrelas, parallax | Roxo/azul, partículas |
| **Kawaii** | Hello Kitty / Kuromi inspired | Rosa vs roxo/preto — **sem logos Sanrio** |
| **Colagem** | Cottagecore / scrapbook | Papel, washi, polaroids sobrepostas |

Tema altera: cores (`--hp-*`), fontes, texturas, estilo de animação. **Não** altera a estrutura de dados base.

### 3.2 Temas legados (mantidos)

- `moderno` — escuro minimalista
- `natural` — sage / terracota

---

## 4. Arquitetura alvo: landing modular

### 4.1 Núcleo narrativo (seções fixas)

Já implementado em `HistoriaPage`:

1. Hero (foto + nomes + frase)
2. Contador (“juntos há X dias”)
3. Timeline (marcos)
4. Música (embed + história)
5. Galeria (fotos + legendas)
6. Carta (texto + typewriter)
7. Mapa estelar / lugar / fatos
8. Footer + compartilhar

Seções **omitidas** se o usuário não preencheu.

### 4.2 Módulos interativos (ex-produtos)

Opcionais, ligados no builder:

| Módulo | Origem | Seção na landing |
|--------|--------|------------------|
| Carta + buquê | `carta` | Envelope animado full-viewport |
| Museu | `museu` | Canvas ou galeria “nosso museu” |
| Polaroid | `polaroid` | Polaroids / câmera |
| Chocolates | `chocolates` | Caixa interativa |
| Joguinho | `joguinho` | Quiz do casal |
| Slot | `slot` | Máquina de surpresas |

### 4.3 Schema JSON alvo (conceitual)

```typescript
interface HistoriaData {
  theme: ThemeId;
  // núcleo existente (nomes, timeline, fotos, carta, música, etc.)
  modules?: {
    carta?: CartaModule;
    museu?: MuseuModule;
    polaroid?: PolaroidModule;
    chocolates?: ChocolatesModule;
    joguinho?: JoguinhoModule;
    slot?: SlotModule;
  };
  sectionOrder?: string[]; // futuro: reordenar seções
}
```

---

## 5. Linha de produção do usuário (wizard)

| Passo | Conteúdo |
|-------|----------|
| **0 — Tema** | Cards visuais: Fofinho, Galáxia, Kawaii, Colagem (+ legados) |
| **1 — Casal** | Nomes, data, hero, foto |
| **2 — História** | Timeline, fatos, carta |
| **3 — Mídia** | Galeria, música, mapa/estrelas |
| **4 — Surpresas** | Toggles + sub-forms por módulo |
| **5 — Revisão** | Preview scroll, email, pagamento |

Princípios: preview ao vivo, campos opcionais, autosave local antes do pagamento.

---

## 6. Música, texto e animação

| Tipo | Implementação |
|------|-----------------|
| Texto | Inputs + carta longa |
| Typewriter | Flag `letterTypewriter` |
| Música | Embed Spotify/YouTube (+ história) |
| Ambiente (futuro) | MP3 / autoplay opcional |
| Reveal | `RevealSection` + Intersection Observer |
| Scroll-driven (fase 2+) | GSAP / Framer `useScroll` |
| Interação | Click dentro da seção, sem quebrar scroll |

---

## 7. Homepage e negócio (fase final)

- Homepage = **uma proposta**: “Crie a landing da história de vocês”
- Produtos antigos → módulos ou upsell
- Preço: base + add-ons ou tiers (Básico / Completo / Premium)

---

## 8. Decisões pendentes (product)

1. ~~Produtos separados somem da home ou ficam como atalhos temporários?~~ **Resolvido:** removidos; só Nossa História.
2. Ordem das seções fixa ou drag-and-drop no builder?
3. Kawaii: assets Figma licenciados vs “inspired only”?
4. Música ambiente no MVP?
5. Preço único vs base + módulos?
6. Mobile-first confirmado (~90% visualização no celular)?
7. ~~Ordem de integração dos módulos após Carta?~~ **Resolvido:** todos os 6 módulos integrados.

---

## 9. Migração por fases

| Fase | Entrega | Risco |
|------|---------|-------|
| **1** | Novos temas (Galáxia, Colagem, Kawaii) + picker visual | Baixo |
| **2** | Carta+buquê como seção opcional no História | Médio |
| **3** | Polaroid + Joguinho como seções | Médio |
| **4** | Museu + Chocolates | Alto |
| **5** | Homepage unificada + slot + redirects + cleanup | Produto |

---

## 10. Progresso de execução

Marque aqui conforme avançamos:

- [x] Documento de pesquisa (este arquivo)
- [x] **Fase 1a** — Temas Galáxia, Colagem, Kawaii em `historia-themes.ts`
- [x] **Fase 1b** — Picker visual de tema no studio + preview
- [x] **Fase 1c** — Estilos CSS por tema (fontes, texturas, animações leves)
- [x] **Fase 1d** — Homepage: Nossa História como produto principal
- [x] **Fase 2** — Módulo Carta integrado na landing
- [x] **Loja** — Produtos avulsos removidos; só Nossa História
- [x] **Fase 3** — Polaroid + Joguinho
- [x] **Fase 4** — Museu + Chocolates
- [x] **Fase 5** — Consolidação comercial completa

### Fase 5 — entregue

- Módulo **Máquina de Surpresas** (`slot`) integrado — último ex-produto
- Homepage reescrita: proposta única “A história de vocês, em um link”
- Seção de produto com núcleo + grid de 6 surpresas (`historia-modules-catalog.ts`)
- `create-form.tsx` reduzido — só fluxo Historia
- Redirects `/criar/*` avulsos → `/criar/historia` (`next.config.ts` + `/criar/page.tsx`)
- Metadata e depoimentos atualizados

---

## 11. Comandos úteis (assets chocolates — legado)

```powershell
node scripts/import-classico-figma.js "...\Community (4)"
node scripts/normalize-classico-svgs.js
# idem coracao, listrado, especial, redondo, gourmet
```

---

*Última atualização: junho 2026 — gerado a partir da análise do codebase Linkamor.*
