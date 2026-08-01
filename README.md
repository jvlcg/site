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
| `NEXT_PUBLIC_SITE_URL` | URL pública definitiva (canonical, Schema, sitemap, OG). Domínio registrado: `drjosevictor.com` (GoDaddy). |
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
3. Vá em **API Keys → Create Key**, dê um nome (ex.: `site-drjosevictor`) e **copie a
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
https://drjosevictor.com/api/chat?token=SUA_SENHA
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

### Análise de oportunidade (automática, toda segunda)

`scripts/faq-oportunidades.mjs` cruza o que o site **responde** com o que o site
**publica** e aponta o que está faltando:

1. **Perguntas que os artigos já respondem** e ainda não estão no FAQ — as mais
   seguras, porque o texto já foi escrito e revisado para o artigo.
2. **Assuntos publicados sem pergunta correspondente** no FAQ.
3. **Cobertura por categoria**, da mais rasa para a mais completa.
4. **Perguntas novas redigidas por IA** — só quando `ANTHROPIC_API_KEY` está
   configurada; as três etapas acima são calculadas do próprio conteúdo e não
   dependem de IA nenhuma.

O fluxo `.github/workflows/faq-oportunidades.yml` roda toda segunda-feira (e
logo depois de cada sincronização com a Soro, que é quando entram assuntos
novos) e **abre um Pull Request** com o relatório em
`content/faq-oportunidades.md`.

> **Por que Pull Request e não publicação direta:** o texto do FAQ vai ao ar com
> o nome e o CRM do Dr. José Victor. Conteúdo médico não se publica sozinho. O
> robô faz o trabalho de garimpo; a decisão de publicar continua sendo dele —
> basta copiar o bloco `ts` do relatório para `lib/chat-faq.ts`, ou fechar o PR
> se nada valer a pena naquela rodada.

Para rodar na mão: `npm run faq:oportunidades`.

**Limite honesto:** a análise enxerga o conteúdo do site, não o volume de busca
real do Google. Ela responde "o que o site deixou de explicar", não "o que as
pessoas mais procuram". Para a segunda pergunta seria preciso ligar a API do
Google Search Console — o que só faz sentido depois que o domínio estiver
apontado e com alguns meses de dados.

## Hiperlinks internos automáticos

Quando um texto do site cita um assunto que tem página própria — "medicina
endocanabinoide", "telemedicina", "check-up" —, a **primeira menção vira link**
para aquela página. Ninguém precisa escrever o link à mão, e artigo novo
(inclusive os que chegam sozinhos da Soro) já nasce com os links no lugar.

| Arquivo | Papel |
| --- | --- |
| `lib/auto-links.ts` | O dicionário de termos → páginas. **É aqui que se mexe.** |
| `lib/rehype-auto-link.ts` | Aplica nos artigos do blog, na hora de renderizar |
| `app/perguntas-frequentes/page.tsx` | Aplica nas respostas do FAQ |

Regras deliberadas, porque excesso de link atrapalha em vez de ajudar:

- **Uma menção por destino, por texto** — a primeira. Repetir o mesmo link cinco
  vezes cansa o leitor e o Google trata como spam.
- **Teto de 6 links por artigo** (`MAX_LINKS`).
- **Nunca linka para a página em que o leitor já está.**
- **Nunca dentro de títulos, código, citações ou de um link que já existe.**

Para adicionar um assunto novo, basta acrescentar uma entrada em `DESTINOS`. Os
termos são comparados sem acento e sem diferenciar maiúsculas, e o mais
específico ganha ("check-up executivo" antes de "check-up").

## Avisos de conteúdo novo (notificações do navegador)

O visitante pode pedir para ser avisado quando sair artigo novo ou um comunicado
do consultório. O aviso chega como notificação do sistema, mesmo com o site
fechado.

**O pedido de permissão nunca aparece sozinho.** Ele só é feito depois que a
pessoa toca em "Quero ser avisado", num bloco que explica antes o que ela vai
receber. Isso não é só educação: o Chrome pune site que pergunta de cara — se
muita gente recusa, ele passa a esconder o pedido para todo mundo.

| Arquivo | Papel |
| --- | --- |
| `components/ui/Notificacoes.tsx` | O bloco que explica e pede a permissão (blog e fim de cada artigo) |
| `public/sw.js` | Service worker: exibe o aviso e abre a página certa no toque |
| `app/api/notificacoes/route.ts` | Inscrição e cancelamento, com as mesmas barreiras da rota do chat |
| `lib/assinaturas.ts` | Onde as inscrições ficam guardadas |
| `scripts/enviar-notificacoes.mjs` | Dispara os avisos |
| `.github/workflows/notificar.yml` | Roda o envio após a sincronização da Soro |

### O que é preciso ligar (uma vez)

**1. Gerar o par de chaves** — na sua máquina ou no Codespaces:

```bash
npm run vapid
```

Sai um `publicKey` e um `privateKey`. A pública pode ser pública (ela vai para o
navegador de qualquer jeito); **a privada é secreta** e nunca deve entrar no
repositório.

**2. Criar o armazenamento** — Vercel → aba **Storage** → **Create Database** →
**Upstash for Redis** (tem plano gratuito). Ao conectar ao projeto, a Vercel
injeta sozinha as variáveis `KV_REST_API_URL` e `KV_REST_API_TOKEN`, que o código
já reconhece.

> Por que precisa disso: a Vercel roda funções sem disco. A lista de aparelhos
> inscritos tem de viver fora do código, senão some a cada deploy.

**3. Na Vercel** (Settings → Environment Variables), em *Production*:

| Variável | Valor |
| --- | --- |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | a chave **pública** |

**4. No GitHub** (Settings → Secrets and variables → Actions):

| Secret | Valor |
| --- | --- |
| `VAPID_PUBLIC_KEY` | a chave pública |
| `VAPID_PRIVATE_KEY` | a chave **privada** |
| `VAPID_SUBJECT` | `mailto:` com seu e-mail, ou a URL do site |
| `KV_REST_API_URL` | copie da Vercel: Storage → o banco → Quickstart → **Show secret** |
| `KV_REST_API_TOKEN` | idem — **não** use o `READ_ONLY_TOKEN`, o robô precisa apagar inscrições mortas |

> Os nomes acima são os que a Vercel cria. Se preferir, `UPSTASH_REDIS_REST_URL`
> e `UPSTASH_REDIS_REST_TOKEN` também funcionam: o fluxo aceita os dois, para
> ninguém ter de renomear na hora de copiar — renomear é erro fácil de cometer e
> difícil de perceber depois.
>
> Ignore `KV_URL` e `REDIS_URL`: começam com `rediss://`, que é conexão direta.
> O site fala com o banco por REST (`https://`).

**Enquanto isso não estiver configurado, o bloco simplesmente não aparece.** O
site não mostra um botão que não funciona.

### Como os avisos saem

- **Artigo novo:** o fluxo roda depois de cada sincronização com a Soro e avisa
  os artigos que ainda não foram avisados.
- **Comunicado avulso:** aba **Actions** → *Avisar sobre conteúdo novo* → **Run
  workflow**, preenchendo título, texto e destino.

Três freios embutidos, porque notificação irrita rápido:

- **Na primeira execução nada é enviado** — os artigos que já existem entram como
  avisados, para ninguém receber seis avisos de uma vez.
- **Teto de 3 avisos por rodada.**
- **Aparelho que não existe mais sai da lista sozinho** (o serviço de push
  responde 404 ou 410 quando a pessoa desinstalou ou limpou o navegador).

O controle do que já foi avisado fica em `content/notificados.json`, versionado
no repositório — assim dois deploys não repetem o mesmo aviso.

### Avisos por e-mail

Quem se cadastra pode marcar, no formulário, uma caixa **separada e desmarcada
por padrão**: receber por e-mail o mesmo aviso de conteúdo novo. Os dois canais
são independentes — o push é anônimo e por aparelho; o e-mail é nominal e por
pessoa.

| Arquivo | Papel |
| --- | --- |
| `lib/avisos-email.ts` | A lista, com chave própria e o link assinado de cancelamento |
| `lib/enviar-email.ts` | Envio pelo Resend e o modelo da mensagem |
| `app/api/avisos/route.ts` | Cancelamento (só cancela — não inscreve) |
| `app/cancelar-avisos/` | Página de confirmação do cancelamento |

**Por que a lista de e-mails é separada do cadastro**, e não um campo dentro
dele: o robô que dispara os avisos roda no GitHub, e para ler e-mails precisa da
chave que decifra a lista. Se os e-mails morassem junto do cadastro, essa chave
teria de ser a `CADASTRO_CHAVE` — a mesma que protege nome completo, CPF e data
de nascimento — e ela deixaria de existir só no painel da Vercel. Com chave
própria (`AVISOS_CHAVE`), o pior caso é o vazamento de uma lista de e-mails e
primeiros nomes, e não de dados de identificação de paciente.

**Cancelamento** em todo e-mail, por dois caminhos: o link no rodapé, que leva a
uma página de confirmação, e o cabeçalho `List-Unsubscribe`, que faz o Gmail e o
Outlook mostrarem o botão "Cancelar inscrição" ao lado do remetente. O link é
assinado — sem isso, bastaria trocar o endereço na URL para descadastrar outra
pessoa. A página pede confirmação em vez de cancelar ao abrir, porque
antivírus e pré-visualizadores de e-mail abrem todos os links da mensagem.

#### Ligar (uma vez)

**1. Conta no Resend** (`resend.com`) — o plano gratuito envia 3.000 e-mails por
mês, folgado para esta finalidade.

**2. Verificar o domínio** no Resend: ele mostra registros DNS (SPF, DKIM e
DMARC) para criar na GoDaddy. **Esse passo não é opcional** — sem ele o e-mail
sai de um remetente não autenticado e vai direto para o spam, ou nem é aceito.

**3. Gerar a chave da lista:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**4. Na Vercel** (Production): `AVISOS_CHAVE` com o valor acima.

**5. Nos Secrets do GitHub:** `AVISOS_CHAVE` (o mesmo valor), `RESEND_API_KEY`,
`EMAIL_REMETENTE` (ex.: `avisos@drjosevictor.com`) e `NEXT_PUBLIC_SITE_URL`.

Sem `RESEND_API_KEY`, o robô manda só pelo navegador e segue funcionando; sem
`AVISOS_CHAVE`, a caixa do formulário não grava ninguém. Um canal nunca derruba
o outro.

### Limitação do iPhone

No iPhone, notificação da web **só funciona com o site adicionado à Tela de
Início** (Safari → botão de compartilhar → "Adicionar à Tela de Início"). É
restrição da Apple, não do site: fora disso o recurso nem existe no Safari. O
bloco detecta esse caso e mostra a instrução em vez de um botão que falharia.

Na prática, boa parte dos pacientes no iPhone não vai completar esse passo — vale
contar com os avisos como um canal a mais, não como o principal.

### O que o site guarda

Só o **endereço de entrega do aparelho** (gerado pelo Google, pela Apple ou pela
Mozilla, conforme o navegador) e as chaves de criptografia. Sem nome, e-mail,
telefone ou IP, e sem ligação com prontuário ou atendimento. Está declarado na
Política de Privacidade, seção 4, com a base legal (consentimento) e a forma de
cancelar. O conteúdo enviado é criptografado ponta a ponta: nem o serviço de push
lê o texto do aviso.

Os avisos tratam apenas de conteúdo publicado. **Nada de publicidade e nada sobre
o atendimento de ninguém** — isso é exigência ética, não preferência de design.

## Cadastro de pacientes e área restrita

A página `/cadastro` recebe nome completo, e-mail, telefone, CPF, data de
nascimento, cidade e como a pessoa conheceu o consultório. Fica **fora do menu
do topo** de propósito: aparece no rodapé e num atalho flutuante acima do
assistente de IA.

| Arquivo | Papel |
| --- | --- |
| `app/cadastro/page.tsx` | A página e o que o cadastro oferece |
| `components/ui/FormularioCadastro.tsx` | O formulário, com máscaras e validação |
| `lib/cadastro.ts` | Validação de verdade, criptografia e gravação |
| `app/api/cadastro/route.ts` | Recebe o envio. **Não tem GET** |
| `app/area-restrita/page.tsx` | Onde o médico vê as fichas |
| `lib/area-restrita.ts` | Senha, bilhete assinado e cookie |
| `components/layout/CadastroFab.tsx` | Atalho flutuante |

### Como os dados são protegidos

- **Nada é gravado em texto claro.** Cada ficha é cifrada com **AES-256-GCM**
  antes de sair do servidor. Quem abrir o banco — inclusive o provedor de
  hospedagem — vê blocos ilegíveis. GCM também autentica: alterar um byte faz a
  decifragem falhar em vez de devolver dado adulterado.
- **A chave mora fora do banco**, em variável de ambiente. Sem ela, nem o site
  lê o que gravou.
- **A rota que recebe o cadastro não tem GET.** Ler as fichas é assunto de outra
  rota, com senha. Manter a leitura em outro arquivo é o que impede que um erro
  futuro nas barreiras exponha a lista inteira.
- **Senha comparada em tempo constante**, porque comparar com `===` vaza o
  tamanho do prefixo certo pelo tempo de resposta.
- **O cookie não é a senha:** é um bilhete assinado com HMAC, válido por 8 h,
  `httpOnly` (invisível para JavaScript) e `SameSite=Strict`.
- **Cinco tentativas de senha por hora**, por IP. É o limite mais apertado do
  site — senha única é alvo óbvio de força bruta.
- `/area-restrita` é `noindex, nofollow` e não tem link apontando para ela.

### Ligar (uma vez)

Na Vercel → Settings → Environment Variables, em *Production*:

| Variável | Como obter |
| --- | --- |
| `CADASTRO_CHAVE` | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `ADMIN_SENHA` | uma senha longa, só sua (mínimo 10 caracteres) |
| `ADMIN_SEGREDO` | opcional; sem ele, trocar a senha derruba as sessões abertas |

O armazenamento é o **mesmo Redis das notificações** — se aquele já estiver
ligado, não há nada a fazer aqui.

> **Atenção:** trocar `CADASTRO_CHAVE` torna **ilegíveis** todos os cadastros já
> gravados. Não há recuperação: é essa a razão de a criptografia funcionar.

Sem as variáveis, a página existe mas o envio responde "cadastro indisponível" —
nada é perdido em silêncio.

### Na área restrita

`https://drjosevictor.com/area-restrita` → senha → lista das fichas, com busca,
link direto para o WhatsApp e o e-mail de cada pessoa, **exportação em CSV**
(abre no Excel com acentos certos) e exclusão definitiva, que atende ao direito
de exclusão da LGPD.

### O que o texto da página pode e não pode dizer

O cadastro é apresentado como **organização do atendimento** — canal digital
direto, acompanhamento entre consultas, prioridade no retorno, avisos de agenda.

**Não** anuncia desconto, promoção, "condição especial" ou qualquer vantagem de
preço. A Resolução CFM nº 2.336/2023 e o art. 58 do Código de Ética Médica vedam
anunciar desconto ou usar vantagem econômica para captar pacientes — e trocar a
palavra "desconto" por "condição especial" não muda a conduta, só a redação.
Conceder uma condição a um paciente específico, dentro da relação médico-paciente,
é outra coisa e continua sendo decisão do médico; o que não pode é virar isca
publicitária no site.

## Som do site

Retorno sonoro dos cliques, ligado pelo alto-falante no cabeçalho. **Não há
música de fundo** — foi retirada a pedido; o site só emite som em resposta a uma
ação do visitante.

| Momento | Som |
| --- | --- |
| Link comum | um toque curto e agudo |
| Botão principal | duas notas, com mais corpo |
| **Qualquer link de agendamento** (`wa.me`) | **arpejo maior ascendente com cauda de reverb** |
| Ligar / desligar o som | duas notas subindo / descendo |

O agendamento é reconhecido pelo endereço do link, não por marcação no botão —
todo botão de agendar que existir no futuro já entra com o som certo.

**Tudo é sintetizado na hora pelo navegador** (`lib/soundscape.ts`) — não existe
nenhum arquivo de áudio no projeto. Três motivos:

- **Direitos autorais.** Efeito de banco de som exige licença comercial, e num
  site que leva o nome e o CRM de um médico o uso indevido é risco jurídico real.
  O que toca aqui é original por construção: são osciladores tocando notas
  calculadas na hora, não uma gravação.
- **Peso.** Nada é baixado e nenhuma requisição é feita.
- **Segurança.** Nenhum domínio novo precisa entrar na Content-Security-Policy.

Cada som é uma nota de sino: além da fundamental, dois harmônicos discretos que
decaem mais rápido, passando por um reverb curto. É esse conjunto que faz o
ouvido reconhecer "sino" em vez de "bipe".

**Começa desligado**, de propósito: som inesperado num site médico incomoda quem
abre o link no trabalho, na sala de espera ou de madrugada. Quem liga uma vez tem
a preferência guardada (`localStorage`) para as próximas visitas. Como todo som
nasce de um clique, não há esbarrão com a trava de autoplay dos navegadores.

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

Você pode escrever na Soro e o texto chega ao blog sozinho. **A cada 15 minutos**
uma rotina do GitHub (`.github/workflows/sync-soro.yml`) roda
`scripts/sync-soro.mjs`, que:

1. busca os artigos publicados na Soro;
2. converte o HTML em Markdown;
3. baixa a imagem de destaque para `public/images/blog/` — assim a página não depende
   de servidor de terceiro e a foto sobrevive se a Soro apagar o arquivo;
4. grava o `.mdx` em `content/artigos/`;
5. confere que o site ainda compila e envia o commit para a `main`, o que dispara o
   deploy na Vercel.

**Quanto tempo até o texto aparecer no site:** cerca de **20 minutos** — até 15
esperando a próxima checagem, mais ~1 minuto do robô e ~2 do deploy na Vercel. O
agendamento do GitHub é "melhor esforço" e em horário de pico pode atrasar uns
minutos a mais.

Por que não é instantâneo: **a Soro não avisa quando algo é publicado.** Não há
webhook no painel dela, então a única forma de saber é perguntar de tempos em
tempos. Se um dia ela passar a oferecer webhook, já existe gancho pronto — o
fluxo aceita `repository_dispatch` com o tipo `soro-publicou`, e basta apontar o
webhook para lá (ou ligar um Zapier/Make gratuito no meio).

**Para publicar na hora, sem esperar:** aba **Actions** do GitHub → *Sincronizar
artigos da Soro* → **Run workflow**. Leva cerca de 3 minutos até estar no ar.
Localmente, `npm run soro:sync`.

> Rodando a cada 15 minutos, quase toda execução não encontra nada. Por isso o
> fluxo só compila o site quando algo mudou de verdade — as execuções vazias
> terminam em segundos.

O artigo que chega por aqui já sai com os **hiperlinks internos automáticos**
(ver seção própria) e, logo depois da sincronização, dispara a **análise de
oportunidade do FAQ** — assunto novo no blog costuma ser exatamente o assunto que
ainda não tem pergunta no FAQ.

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

Domínio definitivo: **`drjosevictor.com`**, registrado na GoDaddy.

**1. Na Vercel** — Settings → Domains → Add: cadastre `drjosevictor.com` **e**
`www.drjosevictor.com`. A Vercel mostra os registros de DNS a criar e sugere qual
dos dois é o principal (o outro passa a redirecionar).

**2. Na GoDaddy** — Meus produtos → o domínio → **DNS** → Gerenciar zonas:

| Tipo | Nome | Valor |
| --- | --- | --- |
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

Confira os valores na tela da Vercel antes de salvar: são eles que valem, e a
Vercel às vezes indica um endereço diferente conforme a região.

Se a GoDaddy já tiver criado registros de "estacionamento" (uma página de venda
ou um redirecionamento), **apague-os** — dois registros `A` no `@` fazem o
domínio cair ora num, ora noutro.

**3. Na Vercel** — Settings → Environment Variables:
`NEXT_PUBLIC_SITE_URL=https://drjosevictor.com` (sem barra no fim), em
*Production*. Depois, **Redeploy**: essa variável entra no `sitemap.xml`, no
`robots.txt`, nos canonicais e no Schema, e só é lida na hora de compilar.

A propagação costuma levar de minutos a algumas horas. O certificado HTTPS a
Vercel emite sozinha assim que o DNS resolve.

#### Redirecionar o domínio antigo (`drjvlcg.com.br`)

`drjvlcg.com.br` nunca chegou a apontar para o site, então **não há nada a
migrar em SEO** — nenhuma página foi indexada sob ele e nenhum link externo
aponta para lá. Redirecioná-lo é opcional e serve para uma coisa só: se alguém
já anotou aquele endereço num cartão, num prontuário ou numa conversa, ele
continua chegando ao lugar certo em vez de ver erro.

Como fazer, agora que ele está pago no registro.br até 2028:

**1. Na Vercel** — Settings → **Domains** → Add: `drjvlcg.com.br`. Ao adicionar,
escolha **Redirect to** → `drjosevictor.com`, com **307/308 (permanent)**.
Repita para `www.drjvlcg.com.br` se quiser cobrir os dois.

**2. No registro.br** — entre com a conta, abra o domínio → **DNS** → *Editar
zona*, e crie os mesmos registros do domínio novo:

| Tipo | Nome | Valor |
| --- | --- | --- |
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

Confirme os valores na tela da Vercel antes de salvar.

> **Atenção com o DNSSEC.** O registro.br costuma vir com DNSSEC ativado e com
> os servidores `a.sec.dns.br` / `b.sec.dns.br`. Enquanto o domínio usar esses
> servidores, a zona é editada no painel do próprio registro.br (é o caminho
> acima). Se em vez disso você apontar os *nameservers* para outro provedor sem
> desligar o DNSSEC antes, **o domínio para de resolver** — e o erro não dá
> sintoma claro, só "site fora do ar" para parte dos usuários.

**O que NÃO fazer:** o "redirecionamento de domínio" oferecido pelo próprio
registro.br ou por painéis de hospedagem geralmente é feito com um frame ou com
uma página intermediária. Isso confunde buscador e quebra o HTTPS. O
redirecionamento tem que ser o da Vercel, que responde um `308` de verdade.

Depois de propagar, dá para conferir assim:

```bash
curl -sI https://drjvlcg.com.br | head -3
# esperado: HTTP/2 308 … location: https://drjosevictor.com/
```

Se preferir não usar o domínio antigo, é só deixá-lo expirar — nada no site
depende dele.

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
