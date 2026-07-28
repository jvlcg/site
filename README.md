# Site — Dr. José Victor Lisboa Cardoso Gomes (CRM-GO 38508)

Site institucional de alto padrão para consultório médico, com experiência imersiva
WebGL/3D, SEO técnico avançado e conformidade com a publicidade médica do CFM
(Resolução nº 2.336/2023).

Áreas de atuação: **Clínica Médica & Check-up**, **Medicina Endocanabinoide** e
**Medicina Esportiva & Performance**. Atendimento presencial em Goiânia-GO
(Clínica Fisiogyn) e por telemedicina para todo o Brasil.

## Stack

- **Next.js 15** (App Router) + **TypeScript**, geração estática (SSG) de todas as rotas
- **Tailwind CSS v4** com tokens de tema dual (dark/light) e `next-themes`
- **Three.js + React Three Fiber** para as cenas 3D (partículas fluidas, rede de nós,
  onda) — shaders próprios, carregados sob demanda e desativados quando o usuário
  prefere movimento reduzido
- **Lenis** (smooth scroll) + reveals por IntersectionObserver
- **Blog em MDX** (`content/artigos/*.mdx`) com `gray-matter` + `next-mdx-remote`

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencha o WhatsApp e a URL
npm run dev                  # http://localhost:3000
npm run build && npm run start
```

## Variáveis de ambiente

| Variável | Descrição |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL pública definitiva (canonical, Schema, sitemap, OG). Domínio registrado: `drjvlcg.com.br`. |
| `NEXT_PUBLIC_WHATSAPP` | WhatsApp **particular** (Dr. José Victor) — CTA principal de todo o site. Formato internacional sem `+`. |
| `NEXT_PUBLIC_WHATSAPP_PLANOS` | WhatsApp de **planos de saúde** (secretária) — opção secundária/discreta (rodapé e Contato). |

Os números reais já estão embutidos como padrão em `lib/site-config.ts`
(particular `5562999758034`, planos `5562999961365`); as variáveis de ambiente
apenas permitem sobrescrevê-los sem tocar no código.

## Assistente virtual (chat)

Widget flutuante em todas as páginas (`components/chat/ChatWidget.tsx`), funcional em
desktop e mobile. Responde dúvidas sobre o consultório e conduz ao agendamento pelo
WhatsApp.

**Dois modos:**
- **Com `ANTHROPIC_API_KEY`** — respostas geradas por IA, restritas à base de
  conhecimento em `lib/knowledge.ts` (conteúdo do site + dados do consultório).
- **Sem a chave** — modo reserva por palavras-chave (`lib/chat-fallback.ts`). Nunca
  fica fora do ar.

**Regras de segurança (em ambos os modos):** não dá diagnóstico, não interpreta
sintomas ou exames, não sugere tratamento nem dose, não promete resultado, não inventa
preços/horários. Em relatos de emergência, orienta 192 (SAMU) e 188 (CVV) e **não**
oferece agendamento. O rodapé do chat traz o aviso de que é um assistente automático.

Para ajustar o que o assistente sabe ou como responde, edite `lib/knowledge.ts`.

## Blog — como publicar (menu "Blog" → `/artigos`)

O item **Blog** no menu leva a `/artigos`. Para publicar, crie um arquivo `.mdx` em
`content/artigos/` (modelo na seção "Publicando um novo artigo"). O artigo entra
sozinho na listagem, no menu do blog, no sitemap, no `llms.txt`, no mapa do site e
ganha os dados estruturados de artigo.

> **Atenção:** os artigos do blog são **conteúdo educativo** assinado pelo médico —
> não se confundem com as **publicações científicas** listadas em `/sobre`. Revise e
> aprove cada texto antes de publicar, já que ele sai com sua assinatura e CRM.

## Banco de fotos (`public/images/`)

| Arquivo | Onde é usada |
| --- | --- |
| `dr-retrato-gravata.jpg` | Hero da Home |
| `dr-jaleco-braco.jpg` | Home — seção formação e pesquisa |
| `dr-jaleco-classico.jpg` | Clínica Médica |
| `dr-casual-camisa.jpg` | Medicina Esportiva |
| `dr-terno-punho.jpg` | Telemedicina |
| `dr-poltrona-pensativo.jpg` | Medicina Endocanabinoide |
| `dr-jose-victor-perfil-pb.jpg` | Sobre — faixa editorial |
| `dr-jose-victor-perfil-sorriso.jpg` | Sobre — fechamento humano |
| `dr-jose-victor-jaleco-2.jpg` | Sobre — biografia |
| `dr-jose-victor-jaleco.jpg` | Autor dos artigos |

**Reserva** (processadas e prontas, sem uso no momento): `dr-poltrona-autoridade.jpg`,
`dr-poltrona-perfil.jpg`, `dr-terno-azul.jpg`, `dr-jaleco-classico-2.jpg`,
`dr-jose-victor-terno.jpg`, `dr-jose-victor-perfil.jpg`. Para trocar qualquer retrato,
basta apontar o `src` do componente para outro arquivo desta pasta.

## Avaliações do Google (ao vivo)

O bloco de avaliações (`components/ui/GoogleReviews.tsx` + `lib/google-reviews.ts`) puxa
as avaliações **reais do Google Meu Negócio** pela **Places API (New)**, no servidor, com
cache de 1 hora (ISR). Mostra nota, total, comentários e botões "Deixar minha avaliação"
(abre o formulário do Google) e "Ver todas no Google". A `aggregateRating` entra no Schema
automaticamente quando os dados chegam.

**Como ativar:**
1. No [Google Cloud Console](https://console.cloud.google.com/), crie um projeto, ative a
   **Places API (New)** e habilite o faturamento (o uso aqui cabe na cota gratuita).
2. Gere uma **chave de API** e restrinja a "Places API (New)".
3. Na Vercel, defina `GOOGLE_PLACES_API_KEY` (e, se quiser fixar, `GOOGLE_PLACE_ID`).

Sem a chave, o site mostra o **fallback**: um botão que leva ao perfil do Google
(`components/ui/GoogleRating.tsx`) — nada quebra.

> **Por que não copiamos os comentários no código?** O Google bloqueia leitura automática
> das avaliações, texto fixo envelhece e depoimentos "colados" como publicidade esbarram
> nas normas do CFM. Puxar ao vivo pela API oficial (conteúdo público de terceiros) é a
> forma correta, sempre atualizada. Pacientes avaliam **no próprio Google** — o site só
> exibe e encaminha para o formulário oficial.

## Publicando um novo artigo

Crie um arquivo `.mdx` em `content/artigos/` com o frontmatter:

```mdx
---
title: "Título do artigo"
description: "Resumo para busca e redes (1–2 frases)."
date: "2026-03-10"
category: "Medicina Endocanabinoide"   # ou Clínica Médica / Medicina Esportiva
tags: ["tag1", "tag2"]
faq:
  - question: "Pergunta?"
    answer: "Resposta objetiva."
---

Conteúdo em Markdown/MDX...
```

O artigo entra automaticamente na listagem, no sitemap, no `llms.txt` e ganha
Schema `MedicalScholarlyArticle` + `FAQPage`.

## SEO e IA

- JSON-LD por página: `Physician`, `WebSite`, `BreadcrumbList`, `MedicalWebPage`,
  `FAQPage` e `MedicalScholarlyArticle`
- `sitemap.xml`, `robots.txt`, OG image dinâmica e **`/llms.txt`** (resumo estruturado
  para crawlers de IA)
- HTML semântico e conteúdo renderizado estaticamente (legível sem JavaScript)

## Deploy (Vercel)

1. Importe o repositório na Vercel (framework detectado automaticamente).
2. Configure `NEXT_PUBLIC_SITE_URL` e `NEXT_PUBLIC_WHATSAPP` nas *Environment Variables*.
3. Faça o deploy.

### Domínio

Domínio registrado: **`drjvlcg.com.br`**. Basta apontá-lo na Vercel e definir
`NEXT_PUBLIC_SITE_URL=https://drjvlcg.com.br`.

### Pós-deploy (recomendado)

- Criar/otimizar o **Google Business Profile** (perfil da empresa) para busca local
- Cadastrar o site no **Google Search Console** e enviar o `sitemap.xml`
- Conferir os dados estruturados no **Rich Results Test** do Google

## Conteúdo e ética médica

Todo o texto segue a Resolução CFM nº 2.336/2023: sem superlativos ou autopromoção,
sem promessa de resultado, sem imagens de antes/depois e sem publicidade de produtos.
Nome completo e CRM aparecem no rodapé, na página Sobre e no Schema. Os artigos trazem
aviso de conteúdo educativo. **Revise todos os textos** antes de publicar e ajuste o
que for necessário à sua realidade de atendimento.
