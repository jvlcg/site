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

### Quanto custa

Modelo padrão: **Claude Haiku 4.5** (`claude-haiku-4-5-20251001`), o mais barato
da linha — US$ 1,00 por milhão de tokens de entrada e US$ 5,00 por milhão de
saída. Para trocar, defina `ANTHROPIC_MODEL`.

O que cada mensagem consome, medido na base real deste site:

| Item | Tokens |
| --- | ---: |
| Instruções de segurança (system prompt) | ~600 |
| Base de conhecimento (conteúdo do site) | ~1.150 |
| Histórico da conversa (média) | ~500 |
| Resposta gerada (teto de 400) | ~200 |

Dá cerca de **US$ 0,003 por mensagem** — uma conversa de 6 mensagens sai por
volta de **US$ 0,02**. Mil conversas por mês ficariam em torno de US$ 20.

E isso é o teto: as 26 perguntas clicáveis do FAQ são respondidas na hora, do
próprio código, **sem chamar a IA**. Só a pergunta digitada em texto livre gera
custo.

> **Nota técnica:** o `cache_control` da rota está inativo hoje. O prefixo
> (instruções + base) soma ~1.750 tokens e o Haiku 4.5 só cacheia a partir de
> 4.096 — abaixo disso a API ignora o marcador em silêncio, sem erro. Não é um
> problema: nesse tamanho o cache economizaria frações de centavo. O marcador
> fica no lugar porque passa a valer sozinho quando a base crescer.

### Teto de gasto (recomendado)

O jeito mais seguro de limitar o custo é **não ligar a recarga automática**. A
API funciona com créditos pré-pagos: você compra US$ 20, e quando acabam a IA
simplesmente para — o chat volta para o modo reserva por palavras-chave e o
visitante continua atendido. Com a recarga automática ligada, esse limite
natural deixa de existir.

Em **Billing → Usage limits** também dá para definir um teto mensal explícito.

### Como conferir se a IA ligou

O diagnóstico é protegido por senha, para não ficar exposto. Crie na Vercel a
variável **`DIAG_TOKEN`** com uma senha longa qualquer (ex.: `k7Qm2xR9vL4pB8n`) e
abra:

```
https://drjvlcg.com.br/api/chat?token=SUA_SENHA
```

- `{"ia":true,...}` → IA ativa e respondendo.
- `{"ia":false,"motivo":"..."}` → o campo `motivo` diz o que falta (chave ausente,
  chave inválida, sem créditos). A rota nunca mostra a chave.
- **404** → token errado ou `DIAG_TOKEN` não configurada. A rota responde 404 de
  propósito: assim nem revela que existe um diagnóstico ali.

Se a IA estiver fora, o chat **não quebra**: ele volta sozinho para o modo reserva
por palavras-chave, e o visitante continua atendido normalmente.

## Segurança

O risco real de um site como este não é alguém "hackear a página" — ela é
estática. É alguém **descobrir a URL do chat e usá-la como IA gratuita**,
gerando custo na sua conta da Anthropic. As defesas abaixo miram nisso.

### O que já está no código

| Barreira | O que faz |
| --- | --- |
| **Mesma origem** | `/api/chat` só responde a chamadas vindas do próprio site. `curl` avulso ou script de outro domínio recebe **404**. |
| **Limite por visitante** | 10 mensagens/minuto e 60/hora, em janela deslizante. |
| **Teto global** | 600 chamadas/hora no total — limita o gasto mesmo sob ataque de muitos IPs. |
| **Corpo limitado** | Payload acima de 8 KB é recusado antes de ser processado. |
| **Diagnóstico fechado** | `GET /api/chat` exige `DIAG_TOKEN`; sem ele responde 404. |
| **Sem cache, sem índice** | Respostas de API com `no-store` e `noindex`; `/api/` bloqueado no `robots.txt`. |
| **Cabeçalhos** | CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`, `Permissions-Policy` (câmera/microfone/localização desligados), COOP. O `X-Powered-By` foi removido. |

> **Limite honesto:** o contador de requisições vive na memória da instância. Em
> serverless cada instância tem o seu e eles reiniciam — isso segura abuso
> casual e scripts simples, mas **não é uma tranca**. A tranca de verdade é a
> da borda, abaixo.

### O que só você pode ligar (Vercel) — recomendado

Tudo isso é de graça no plano Hobby/Pro e leva poucos minutos:

1. **Firewall → Rate Limiting**: crie uma regra para o caminho `/api/*`, algo como
   20 requisições/minuto por IP, ação *Deny*. Essa contagem é feita na borda,
   compartilhada entre todas as instâncias — é o limite que realmente vale.
2. **Firewall → Bot Protection / Attack Challenge Mode**: liga um desafio
   automático quando o tráfego fica anormal. Deixe pronto para acionar se algum
   dia o site for alvo.
3. **Deployment Protection**: mantenha os *previews* protegidos por senha, para
   que versões de teste não fiquem públicas.
4. **Alerta de gasto na Anthropic**: em *Billing → Usage limits*, defina um teto
   mensal. É a rede de proteção final: mesmo que tudo acima falhe, o custo para.

### Variáveis de ambiente ligadas à segurança

- `DIAG_TOKEN` — senha do diagnóstico da IA (sem ela o diagnóstico fica desligado).
- `ALLOWED_ORIGINS` — domínios extras autorizados a chamar a API, separados por
  vírgula. Só é necessário se o site atender por mais de um domínio (ex.: o `www`).
  O domínio principal e os previews da Vercel já funcionam sozinhos.

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

### Publicando pela Soro (automático)

Você pode escrever na Soro e o texto chega ao blog sozinho. A cada 6 horas uma rotina
do GitHub (`.github/workflows/sync-soro.yml`) roda `scripts/sync-soro.mjs`, que:

1. busca os artigos publicados na Soro;
2. converte o HTML em Markdown;
3. baixa a imagem de destaque para `public/images/blog/` — assim a página não depende
   de servidor de terceiro e a foto sobrevive se a Soro apagar o arquivo;
4. grava o `.mdx` em `content/artigos/`;
5. confere que o site ainda compila e envia o commit para a `main`, o que dispara o
   deploy na Vercel.

Para rodar na hora, sem esperar o horário: aba **Actions** do GitHub → *Sincronizar
artigos da Soro* → **Run workflow**. Localmente, `node scripts/sync-soro.mjs`.

**Os artigos escritos à mão nunca são tocados.** Só arquivos com `origem: soro` no
frontmatter podem ser sobrescritos. Se um texto da Soro tiver o mesmo nome de arquivo
de um artigo seu, o seu é preservado e a sincronização avisa no log.

**Editar um texto vindo da Soro:** edite na Soro, não no `.mdx` — a próxima
sincronização sobrescreve o arquivo. Se quiser assumir o texto no repositório e parar
de sincronizá-lo, apague as linhas `origem: soro` e `soroId` do frontmatter; ele passa
a contar como escrito à mão.

**Campos que ficam vazios:** `tags` e `faq` saem em branco, porque a Soro não tem esses
campos. Vale preencher à mão nos textos importantes — o `faq` vira dados estruturados de
perguntas e respostas no Google. Ao preencher, lembre de remover a marca `origem: soro`,
senão a próxima sincronização apaga o que você escreveu.

> A página `/novidades` mostra o mesmo conteúdo direto da Soro e está **fora do índice**
> de propósito: o texto sincronizado em `/blog` é a versão com Schema, imagem de
> compartilhamento e URL própria. Deixar os dois indexados criaria conteúdo duplicado no
> mesmo domínio.

### Artigos científicos — como atualizar

Editar `lib/publications.ts`. Os dados atuais foram extraídos do **Currículo Lattes
(atualizado em 31/01/2026)**: 6 artigos em periódicos, 1 livro organizado, 1 capítulo,
7 trabalhos completos em anais e 13 apresentações em congressos. As estatísticas da
home e da página vêm dessas contagens.

## Marca (logo)

> **Provisória** — será substituída por uma versão definitiva.

A marca é a **silhueta real do perfil do Dr. José Victor**, vetorizada da foto em
contraluz, cortada logo abaixo do pescoço e centralizada no anel com folga
(ocupa de 21,4 a 78,6 na horizontal e de 19 a 81 na vertical, num recorte que
vai de 5 a 95).

Dentro dela fica o monograma **"JV"** em Space Grotesk Bold — a mesma fonte de
display do site — vazado em espaço negativo, mostrando o fundo da página através
da silhueta. É esse recorte que faz a marca funcionar nos dois temas com **um
único arquivo**: no escuro o "JV" aparece escuro sobre o verde, no claro aparece
claro sobre o verde, sempre com contraste — sem precisar manter duas versões de
cor.

**Toda a geometria vive em `lib/brand-geometry.ts`** (caminhos, transforms e a
linha de corte do busto). O componente React, o favicon e as mídias importam esse
mesmo arquivo — o Node consegue importar o `.ts` direto, então não existe cópia
de números para sair do lugar.

Depois de mexer na geometria, rode:

```bash
node scripts/gen-brand.mjs
```

Ele regera `public/brand/`, os ícones do PWA e o `app/icon.svg` de uma vez.

`public/brand/` traz: SVG vetorial (escuro, claro, mono para carimbo/impressão em
uma cor, e sem anel) e PNG 1024/512/192 — prontos para redes sociais, papelaria
e WhatsApp Business.

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
