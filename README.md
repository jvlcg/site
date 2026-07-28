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

### Como ativar a IA (passo a passo)

1. Acesse **console.anthropic.com** e crie uma conta (ou entre na sua).
2. Em **Billing**, adicione créditos. O modelo padrão é o Haiku, o mais barato da
   linha — o custo de um chat de site institucional é de centavos por conversa.
3. Vá em **API Keys → Create Key**, dê um nome (ex.: `site-drjvlcg`) e **copie a
   chave**. Ela só aparece uma vez.
4. Na Vercel, abra o projeto → **Settings → Environment Variables** e crie:
   - Nome: `ANTHROPIC_API_KEY`
   - Valor: a chave copiada
   - Ambientes: marque *Production*, *Preview* e *Development*
5. Vá em **Deployments** e clique em **Redeploy** no último deploy. Variáveis de
   ambiente só entram em vigor em um novo deploy.

**Nunca** cole a chave em um arquivo do repositório — ela ficaria pública no
GitHub. O lugar dela é só o painel da Vercel.

### Como conferir se a IA ligou

Abra no navegador: **`https://drjvlcg.com.br/api/chat`**

- `{"ia":true,...}` → IA ativa e respondendo.
- `{"ia":false,"motivo":"..."}` → o campo `motivo` diz o que falta (chave ausente,
  chave inválida, sem créditos). A rota nunca mostra a chave.

Se a IA estiver fora, o chat **não quebra**: ele volta sozinho para o modo reserva
por palavras-chave, e o visitante continua atendido normalmente.

## FAQ — uma fonte, três destinos

As perguntas frequentes vivem em **`lib/chat-faq.ts`** e alimentam três lugares ao
mesmo tempo. Editar esse arquivo atualiza todos eles de uma vez:

| Destino | O que consome |
| --- | --- |
| `/perguntas-frequentes` | `FAQ_COMPLETO` — página pública, agrupada por categoria |
| Chat flutuante | `FAQ` — só as perguntas curtas, clicáveis |
| `/llms.txt` | `FAQ_COMPLETO` — respostas em texto puro para IAs |

- `FAQ` — perguntas que aparecem **também** no chat (respostas curtas).
- `FAQ_EXTRA` — perguntas **só da página** (respostas longas demais para o chat).
- `categoria` define em qual seção da página a pergunta cai; as categorias viram
  âncoras (`#agendamento`, `#consultorio`, …).
- `cta: true` adiciona o botão de agendamento pelo WhatsApp abaixo da resposta.

A página gera Schema `FAQPage` automaticamente a partir dessas entradas — cada
pergunta pode virar um *rich result* no Google.

## Duas seções de conteúdo — não confundir

| Menu | Rota | O que é | Fonte |
| --- | --- | --- | --- |
| **Blog** | `/blog` | Textos educativos para pacientes (SEO de cauda longa) | `content/artigos/*.mdx` |
| **Artigos** | `/artigos` | Produção científica real (periódicos, livro, congressos) | `lib/publications.ts` |

### Blog — como publicar

Crie um `.mdx` em `content/artigos/` (modelo na seção "Publicando um novo artigo").
O texto entra sozinho na listagem, no sitemap, no `llms.txt`, no mapa do site e ganha
dados estruturados. URLs antigas `/artigos/<slug>` redirecionam para `/blog/<slug>`.

> Os textos do blog saem **assinados com seu nome e CRM** — revise antes de publicar.

### Artigos científicos — como atualizar

Editar `lib/publications.ts`. Os dados atuais foram extraídos do **Currículo Lattes
(atualizado em 31/01/2026)**: 6 artigos em periódicos, 1 livro organizado, 1 capítulo,
7 trabalhos completos em anais e 13 apresentações em congressos. As estatísticas da
home e da página vêm dessas contagens.

## Marca (logo)

O perfil de cabeça é um **traçado geométrico próprio**, não o contorno bruto da
foto. O contorno da foto trazia ombros e detalhes de cabelo (87 curvas) e virava
um borrão abaixo de 40px — além de ficar descentralizado, porque o centro da
massa caía bem abaixo do centro do círculo.

**Trocar de variante:** edite `LOGO_VARIANT` em `components/layout/Logo.tsx`.
São seis: `retrato` (ativa), `folga`, `livre`, `contorno`, `disco`, `sinapses`.

Depois de trocar, rode `node scripts/gen-brand.mjs` para regerar `public/brand/`
e os ícones do PWA a partir da **mesma geometria** do componente — é o que
impede o site e o favicon de divergirem. O `app/icon.svg` é o favicon e precisa
ser ajustado à mão se a variante mudar (ele é estático por exigência do Next).

`public/brand/` traz, de cada variante: SVG vetorial (escuro, claro e mono para
carimbo/impressão em uma cor) e PNG 512/192 — prontos para redes sociais,
papelaria e WhatsApp Business.

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

- JSON-LD por página: `Physician`, `MedicalClinic`/`LocalBusiness`, `WebSite`,
  `BreadcrumbList`, `MedicalWebPage`, `FAQPage` e `MedicalScholarlyArticle`
- `sitemap.xml`, `robots.txt`, OG image dinâmica e **`/llms.txt`** (resumo estruturado
  para crawlers de IA)
- HTML semântico e conteúdo renderizado estaticamente (legível sem JavaScript)

### Ser citado por IAs — como isso foi construído

O objetivo é que assistentes de IA e outros sites consigam **encontrar, entender e
atribuir corretamente** as informações. Nada disso tenta manipular ranqueamento: o
que aumenta a chance de citação é a informação ser verificável e fácil de atribuir.

- **Autoria explícita no Schema** — `medicalWebPageSchema` declara `author`,
  `publisher`, `dateModified` e `citation`, então a página carrega quem escreveu,
  quando foi revisada e o formato de referência prontos para uso.
- **`/llms.txt` como fonte canônica** — traz só fatos verificáveis (registro
  profissional, formação, endereço, produção científica com veículo e ano), o índice
  de páginas, as respostas oficiais do FAQ e uma seção **"Como citar este site"** em
  formato ABNT.
- **Limites de uso declarados** — o mesmo arquivo diz o que a IA *não* deve fazer:
  atribuir diagnósticos ou condutas ao site, ou apresentar o conteúdo como
  substituto de consulta.
- **Ressalva sobre especialidade** — o `llms.txt` avisa, em texto direto, que as
  áreas listadas são campos de atuação clínica e que **não se deve atribuir o título
  de "especialista em"** nenhuma delas (no Brasil isso exige RQE). Pelo mesmo motivo
  o Schema não declara `medicalSpecialty`.
- **`speakable`** nas páginas médicas, para assistentes de voz lerem o trecho certo.

Ao alterar qualquer conteúdo, lembre de refletir a mudança no `llms.txt`
(`app/llms.txt/route.ts`), no `sitemap.ts` e no mapa do site
(`app/mapa-do-site/page.tsx`) — as três superfícies que as IAs e o Google leem.

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
