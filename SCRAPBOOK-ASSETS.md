# Assets do tema Scrapbook

Assets Canva organizados em `public/scrapbook/`.

## Estrutura atual

```
public/scrapbook/
├── frames/                          ← molduras (foto e texto por cima)
│   ├── polaroid-tape.svg            ← polaroid com fita (galeria)
│   ├── photo-paperclip.svg          ← foto com clipe (galeria)
│   ├── text-paper-scalloped.svg     ← papel recortado (hero, carta)
│   └── paper-textured.svg           ← papel irregular (contador, timeline)
└── stickers/
    ├── canva/                       ← adesivos Scrapbook Album
    └── diary/                       ← pack Scrapbook Diary Elements (02–35)
        ├── diary-02.svg … diary-35.svg
        └── diary-polaroid-strip.svg
```

### Lote 4 — Scrapbook Diary Elements

35 arquivos numerados (`02`–`35`) + faixa polaroid, em `stickers/diary/`.

Distribuição automática por seção via `src/lib/scrapbook-diary-pool.ts` (somado aos adesivos Canva em `scrapbook-decor.ts`).

| Arquivo Canva | Nome no projeto |
|---------------|-----------------|
| `02.svg`–`35.svg` | `diary-02.svg`–`diary-35.svg` |
| `6490e7eb-… 1.svg` | `diary-polaroid-strip.svg` |
| `35 1.svg` | `diary-35.svg` (substitui export duplicado) |

## Como funciona no código

- **Fotos:** `ScrapbookPhotoFrame` coloca a foto do usuário *dentro* da moldura SVG
- **Textos:** `ScrapbookTextPaper` usa o SVG como fundo; título, carta e marcos ficam por cima
- **Adesivos Canva:** posições em `src/lib/scrapbook-decor.ts`
- **Adesivos Diary:** pool em `src/lib/scrapbook-diary-pool.ts`, mesclados em `ScrapbookDecor`

Catálogo de paths: `src/lib/scrapbook-assets.ts`

| Arquivo original (Canva) | Nome no projeto | Uso |
|--------------------------|-----------------|-----|
| `polaroid frame photo.svg` | `frames/polaroid-tape.svg` | Fotos da galeria (alternado) |
| `photo paper clip.svg` | `frames/photo-paperclip.svg` | Fotos da galeria (alternado) |
| `text paper 16.svg` | `frames/text-paper-scalloped.svg` | Hero, carta de amor |
| `paper 4.svg` | `frames/paper-textured.svg` | Contador, marcos da timeline |
| `stamp.svg` | `stickers/canva/stamp.svg` | Selo decorativo |
| `92.svg` | `stickers/canva/sticker-heart.svg` | Adesivo coração |
| `69.svg` | `stickers/canva/tape-strip.svg` | Fita horizontal |
| `Group 52.svg` | `stickers/canva/deco-flowers.svg` | Flores (hero, música) |
| `2 29.svg` | `stickers/canva/deco-vertical.svg` | Decoração vertical (galeria) |

### Lote 2 (My Scrapbook Album Community 1)

| Arquivo Canva | Nome no projeto | Uso |
|---------------|-----------------|-----|
| `polaroid frame photo.svg` | `frames/polaroid-tape.svg` | Polaroid atualizado (substitui v1) |
| `heart tape.svg` | `stickers/canva/tape-heart.svg` | Fita com corações — hero, carta, galeria |
| `photo 3.svg` | `stickers/canva/tape-photo-top.svg` | Fita extra no topo das polaroids |
| `Group 54.svg` | `stickers/canva/deco-banner.svg` | Faixa decorativa (música, mapa) |
| `93.svg` | `stickers/canva/sticker-square.svg` | Adesivo quadrado / coração |
| `94.svg` | `stickers/canva/deco-vertical-alt.svg` | Faixa vertical (galeria) |
| `95.svg` | `stickers/canva/deco-flowers-wide.svg` | Flores largas (hero) |
| `96.svg` | `stickers/canva/deco-scrap-large.svg` | Colagem grande (reserva) |
| `97.svg` | `stickers/canva/sticker-tilted.svg` | Adesivo inclinado |
| `92.svg` | *(vazio — ignorado)* | Reexportar do Canva se necessário |

### Lote 3 (My Scrapbook Album Community 2)

| Arquivo Canva | Nome no projeto | Uso |
|---------------|-----------------|-----|
| `text paper 16.svg` | `frames/text-paper-scalloped.svg` | Papel recortado (versão detalhada) |
| `polaroid frame photo.svg` | `frames/polaroid-compact.svg` | Polaroid compacto na galeria |
| `Vector.svg` | `stickers/canva/deco-swirl.svg` | Rabisco decorativo |
| `ring.svg` | `stickers/canva/ring.svg` | Aliança — hero, carta, footer |
| `Line 1.svg` | `elements/line-divider.svg` | Divisor fino na timeline |
| `92.svg` | `stickers/canva/deco-banner-wide.svg` | Faixa larga (hero, mapa) |
| `93.svg` | `stickers/canva/deco-strip-93.svg` | Faixa vertical (música) |
| `94.svg` | `stickers/canva/deco-strip-94.svg` | Faixa vertical (galeria) |
| `95.svg` | `stickers/canva/deco-strip-95.svg` | Faixa horizontal pequena |
| `96.svg` | `stickers/canva/sticker-tilted-square.svg` | Adesivo inclinado grande |
| `98.svg` | `stickers/canva/sticker-badge-98.svg` | Selo/badge pequeno |
| `Line 2.svg` | *(igual ao Line 1 — não copiado)* | — |

## Como funciona no código

- **Fotos:** `ScrapbookPhotoFrame` coloca a foto do usuário *dentro* da moldura SVG
- **Textos:** `ScrapbookTextPaper` usa o SVG como fundo; título, carta e marcos ficam por cima
- **Adesivos:** posições em `src/lib/scrapbook-decor.ts`

Catálogo de paths: `src/lib/scrapbook-assets.ts`

## O que cada arquivo faz (lotes 1–3)

1. Salve em `public/scrapbook/stickers/canva/` ou `frames/`
2. Registre em `scrapbook-assets.ts`
3. Use no componente ou adicione entrada em `scrapbook-decor.ts`

## Formato

- SVG do Canva funciona direto (alguns trazem imagem embutida — arquivo maior, mas ok)
- PNG transparente também funciona se preferir exportar assim
