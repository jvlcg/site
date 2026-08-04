# Passo a passo: o que ainda falta configurar

Quatro tarefas, cada uma independente da outra. Nenhuma exige mexer em código.

| # | Tarefa | Urgência | Tempo | O que quebra se não fizer |
|---|---|---|---|---|
| 1 | Rotacionar o token do Redis | **Alta — segurança** | 10 min | Nada quebra hoje; o risco é alguém com o token antigo ler o banco |
| 2 | E-mail dos artigos (Resend) | Média — recurso novo | 20 min + DNS | Os inscritos recebem só notificação no aparelho, nunca e-mail |
| 3 | Apagar a chave do Google | **Alta — segurança** | 3 min | Cobrança na sua conta do Google Cloud se alguém usar a chave |
| 4 | Chave VAPID na Vercel | Baixa — recurso novo | 5 min | O bloco "receber avisos" some do site; ninguém consegue se inscrever |

**Faça a 1 e a 3 primeiro.** As duas são de segurança e não dependem de mais
nada. As outras duas ligam recursos que hoje estão desligados — nenhuma
pressa, e o site funciona sem elas.

---

# 1. Rotacionar o token do Redis (Upstash)

**Por que:** o token foi colado numa conversa. Os dados dos pacientes seguem
ilegíveis, porque a chave que os cifra (`CADASTRO_CHAVE`) nunca saiu da Vercel
— mas o token é a fechadura da porta, e ela precisa ser trocada.

**Tempo:** 10 minutos. **Entre o passo 1.2 e o 1.4 o cadastro fica fora do ar**,
então faça de uma vez só, e de preferência num horário de pouco movimento.

## 1.1 — Descobrir o nome da variável

Antes de mexer em nada, abra na Vercel: **Settings → Environment Variables**.

Procure uma variável cujo nome termine em `_TOKEN` e que tenha ao lado uma
irmã terminada em `_URL` apontando para algo como
`https://xxxxx.upstash.io`.

O prefixo varia conforme o que foi escolhido na instalação. Pode ser:

- `UPSTASH_REDIS_REST_TOKEN` + `UPSTASH_REDIS_REST_URL`
- `KV_REST_API_TOKEN` + `KV_REST_API_URL`
- `STORAGE_…` ou qualquer outro prefixo

**Anote o nome exato.** O código do site acha qualquer um deles — `lib/redis.ts`
procura o par por padrão de nome, não por um nome fixo — mas você precisa saber
qual editar.

## 1.2 — Gerar o token novo

1. Entre em `console.upstash.com`
2. Clique no seu banco Redis
3. Aba **Details**
4. Role até a seção **REST API**
5. Clique em **Reset password** (em algumas versões aparece como *Rotate token*)
6. Confirme

> ⚠️ **O token antigo morre neste instante.** A partir daqui o cadastro do site
> para de funcionar até você terminar o passo 1.4.

Copie o token novo. Ele fica visível na mesma tela, no campo do token — se
sumir, clique no olhinho para revelar.

## 1.3 — Atualizar na Vercel

1. **Settings → Environment Variables**
2. Encontre a variável de token que você anotou no 1.1
3. Três pontinhos → **Edit**
4. Apague o valor antigo, cole o novo
5. **Confira os ambientes marcados**

   Deve estar marcado **apenas Production**. Se **Preview** estiver marcado,
   desmarque.

   O motivo: toda URL de preview da Vercel é pública — qualquer pessoa com o
   link abre, sem senha. Com o token lá, cada deploy de teste vira uma segunda
   porta para o **mesmo banco, com os dados reais dos seus pacientes**.

6. **Save**

## 1.4 — Redeploy (não pule)

Salvar a variável não muda nada sozinho. A Vercel só passa a usar o valor novo
no próximo build.

1. Aba **Deployments**
2. Três pontinhos no deploy mais recente
3. **Redeploy**
4. Se aparecer a opção *Use existing build cache*, **desmarque**
5. Aguarde ficar **Ready** (2 a 4 minutos)

## 1.5 — Atualizar no GitHub

O robô que avisa os inscritos quando a Soro publica também fala com o banco.

1. `github.com/jvlcg/site` → **Settings**
2. Menu lateral: **Secrets and variables → Actions**
3. Se houver um secret com o token do Redis, clique no lápis e cole o novo
4. **Update secret**

Se não houver nenhum, não crie — significa que o robô usa outro caminho.

## 1.6 — Conferir

Abra `drjosevictor.com/area-restrita`, entre com a sua senha e veja se os
cadastros aparecem.

| O que você vê | O que significa |
|---|---|
| Os cadastros na tela | Deu certo, acabou |
| "Banco indisponível" | Faltou o redeploy do 1.4, ou o token foi colado com espaço sobrando |
| Pede senha e recusa | Nada a ver com o Redis — é a senha da área restrita |

---

# 2. E-mail dos artigos para os inscritos

**O que isto liga:** hoje, quando a Soro publica um artigo no blog, quem se
cadastrou recebe **notificação no aparelho**. Não recebe e-mail. Isto liga o
e-mail.

**Tempo:** 20 minutos de trabalho, mais a espera do DNS (15 minutos a algumas
horas).

## 2.1 — Criar a conta na Resend

`resend.com` → **Sign up**. O plano gratuito envia 3.000 e-mails por mês, o que
é bastante folga para começar.

## 2.2 — Verificar o domínio

Esta é a etapa que faz o e-mail chegar na caixa de entrada em vez do spam.
**Não pule.**

1. Na Resend: **Domains → Add Domain**
2. Digite `drjosevictor.com`
3. A tela mostra **três registros DNS**. Deixe essa aba aberta.

Agora, na GoDaddy:

1. Entre em `godaddy.com` → **Meus produtos**
2. Ao lado de `drjosevictor.com`, clique em **DNS**
3. **Adicionar novo registro**, uma vez para cada um dos três

Como preencher cada um:

| Campo da GoDaddy | O que colocar |
|---|---|
| **Tipo** | O que a Resend mostrar (TXT, CNAME ou MX) |
| **Nome** | O que a Resend chama de *Host* ou *Name* |
| **Valor** | O que a Resend chama de *Value* — copie inteiro |
| **TTL** | Deixe o padrão (1 hora) |

> **Cuidado com o campo Nome.** A Resend costuma mostrar algo como
> `resend._domainkey.drjosevictor.com`. Na GoDaddy você digita **só**
> `resend._domainkey` — sem o `.drjosevictor.com`, que a GoDaddy acrescenta
> sozinha. Colar o nome completo cria um registro errado, e a verificação nunca
> passa.

Volte à Resend e clique em **Verify DNS Records**. Se ainda não passar, espere e
tente de novo — a propagação leva de 15 minutos a algumas horas.

## 2.3 — Criar a chave de API

1. Na Resend: **API Keys → Create API Key**
2. Nome: qualquer coisa, por exemplo `site-drjosevictor`
3. Permissão: **Sending access** (não *Full access* — o site só precisa enviar)
4. Domínio: `drjosevictor.com`
5. **Add**

A chave aparece **uma vez só**. Copie agora.

## 2.4 — Gerar a AVISOS_CHAVE

Esta chave assina os links de cancelamento dos e-mails, para que ninguém possa
descadastrar outra pessoa forjando um endereço.

Gere você mesmo, no seu navegador — assim ela nunca passa por conversa nenhuma:

1. Abra qualquer página, aperte **F12**
2. Aba **Console**
3. Cole e aperte Enter:

```js
crypto.getRandomValues(new Uint8Array(32)).reduce((s,b)=>s+b.toString(16).padStart(2,'0'),'')
```

4. Copie o resultado (64 caracteres)

## 2.5 — Variáveis na Vercel

**Settings → Environment Variables → Add New**, três vezes:

| Nome | Valor | Ambientes |
|---|---|---|
| `RESEND_API_KEY` | a chave do 2.3 | **só Production** |
| `EMAIL_REMETENTE` | `Dr. José Victor <avisos@drjosevictor.com>` | Production + Preview |
| `AVISOS_CHAVE` | os 64 caracteres do 2.4 | **só Production** |

O endereço em `EMAIL_REMETENTE` **precisa** ser do domínio verificado no 2.2.
Um `@gmail.com` ali faz a Resend recusar o envio.

## 2.6 — Secrets no GitHub

Aqui está a parte que costuma ser esquecida: **quem envia o e-mail não é o
site, é o robô do GitHub.**

O site coleta os endereços (Vercel). Mas quem percebe que a Soro publicou algo
novo e dispara os avisos é um fluxo do GitHub Actions. Ele precisa das mesmas
credenciais.

`github.com/jvlcg/site` → **Settings → Secrets and variables → Actions →
New repository secret**, quatro vezes:

| Nome | Valor |
|---|---|
| `RESEND_API_KEY` | a mesma chave do 2.3 |
| `EMAIL_REMETENTE` | o mesmo texto do 2.5 |
| `AVISOS_CHAVE` | **exatamente o mesmo valor** do 2.5 |
| `NEXT_PUBLIC_SITE_URL` | `https://drjosevictor.com` |

> A `AVISOS_CHAVE` tem de ser **idêntica** nos dois lugares. Ela assina os links
> de cancelamento: o robô assina ao enviar, o site confere ao receber. Valores
> diferentes fazem todo link de cancelamento ser recusado como inválido — e um
> aviso sem cancelamento funcionando é problema de LGPD, não só de conforto.

## 2.7 — Redeploy

Vercel → **Deployments** → três pontinhos → **Redeploy**.

## 2.8 — Conferir

1. Cadastre-se você mesmo em `drjosevictor.com/cadastro`, com um e-mail seu
2. Espere a Soro publicar, ou dispare o fluxo à mão:
   `github.com/jvlcg/site` → aba **Actions** → fluxo de notificação →
   **Run workflow**
3. O e-mail deve chegar em poucos minutos

Se não chegar:

| Onde olhar | O que procura |
|---|---|
| Aba **Actions** no GitHub | o fluxo ficou vermelho? o log diz o motivo |
| **Logs** na Resend | o envio saiu? foi recusado? |
| Sua caixa de spam | domínio recém-verificado às vezes cai lá nos primeiros envios |

---

# 3. Apagar a chave de API do Google

**Por que:** uma chave do Google Cloud (as que começam com `AIza…`) foi colada
numa conversa. Chave do Google é diferente de senha: ela não protege dado
nenhum, ela **autoriza gasto**. Quem a tiver pode chamar as APIs do Google
cobrando na sua conta, e a fatura chega para você.

**Tempo:** 3 minutos.

> **Apagar, não trocar.** Editar a chave, renomear ou restringir o domínio não
> resolve — o valor antigo continua válido. A única ação que encerra o risco é
> excluir a credencial.

## 3.1 — Abrir a lista de credenciais

1. Entre em `console.cloud.google.com`
2. Confira, no alto da tela, se o **projeto selecionado é o seu** — o Google
   costuma abrir no último usado, e num projeto errado a chave nem aparece
3. Menu **☰** → **APIs e serviços** → **Credenciais**

## 3.2 — Identificar qual apagar

A tela lista as chaves em **Chaves de API**. Cada linha mostra os primeiros
caracteres do valor.

Procure a que começa com `AIzaSyAL32…`. Se houver várias e você não souber
qual é qual, olhe a coluna **Data de criação** e a coluna **Restrições**.

> Se você não reconhece nenhuma delas e nada no seu site usa API do Google
> paga, o mais seguro é apagar todas: o site não depende de nenhuma. As
> ferramentas que você usa — Search Console, Google Analytics, Google Ads,
> Perfil da Empresa — **não usam chave de API**. Elas fazem login com a sua
> conta Google. Apagar chave nenhuma delas afeta.

## 3.3 — Apagar

1. Marque a caixinha à esquerda da chave
2. Botão **Excluir** (ícone de lixeira) no alto da lista
3. Confirme

## 3.4 — Fechar a porta do gasto (recomendado)

Enquanto está aí, vale limitar o estrago de qualquer chave futura:

1. Menu **☰** → **Faturamento** → **Orçamentos e alertas**
2. **Criar orçamento**, valor baixo (R$ 20, por exemplo)
3. Marque os alertas em 50%, 90% e 100%

Isso não bloqueia o gasto sozinho, mas você recebe e-mail antes de virar
problema.

---

# 4. Ligar o bloco de avisos no navegador

**O que isto liga:** o bloco "Quer ser avisado de conteúdo novo?" que aparece
no fim dos artigos e na página de cadastro. Hoje ele **não aparece para
ninguém**.

**Por que não aparece:** o navegador do visitante precisa da metade pública de
um par de chaves (VAPID) para se inscrever. O código foi escrito para não
mostrar botão que não funciona — sem a chave, o bloco inteiro some em vez de
dar erro na cara do paciente.

**Tempo:** 5 minutos.

## 4.1 — Descobrir se você já tem o par

O par pode já existir nos Secrets do GitHub, de quando as notificações foram
montadas.

1. `github.com/jvlcg/site` → **Settings**
2. **Secrets and variables → Actions**
3. Procure na lista por **`VAPID_PUBLIC_KEY`** e **`VAPID_PRIVATE_KEY`**

| O que você vê | Vá para |
|---|---|
| Os dois estão lá | 4.2 |
| Nenhum dos dois | 4.4 (gerar o par do zero) |
| Só um dos dois | 4.4 — um par incompleto não serve, gere os dois de novo |

> O GitHub **não deixa você ver** o valor de um secret depois de salvo, só o
> nome. Isso é proposital. Se os dois existem mas você não guardou o valor da
> pública em lugar nenhum, siga para o 4.4 e gere um par novo — é mais rápido
> que tentar recuperar.

## 4.2 — Copiar a chave pública

Se você guardou o valor quando gerou (num gerenciador de senhas, num arquivo),
pegue de lá. São cerca de 87 caracteres, só letras, números, `-` e `_`.

## 4.3 — Colocar na Vercel

1. Vercel → **Settings → Environment Variables → Add New**
2. **Name:** `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
3. **Value:** a chave pública
4. **Ambientes:** marque **Production e Preview**

   Aqui é o contrário das outras variáveis. Esta chave é **pública por
   natureza** — ela vai dentro do JavaScript que qualquer visitante baixa, e
   está no código-fonte de todo site que usa notificação. Não há o que
   proteger, e ter em Preview deixa você testar antes de publicar.

5. **Save**

> ⚠️ **A privada nunca vai para a Vercel.** `VAPID_PRIVATE_KEY` fica só nos
> Secrets do GitHub, porque quem envia as notificações é o robô do GitHub, não
> o site. Uma chave privada na Vercel seria uma cópia a mais de um segredo em
> um lugar que não precisa dele.

## 4.4 — Gerar um par novo (só se não existir)

Gere no seu próprio computador, para o valor não passar por conversa nenhuma:

1. Abra o **Terminal** (Mac) ou o **Prompt de Comando** (Windows)
2. Cole e aperte Enter:

```
npx web-push generate-vapid-keys
```

3. Ele imprime duas linhas, **Public Key** e **Private Key**
4. Guarde as duas num gerenciador de senhas **antes de fechar a janela**

Depois:

| Chave | Onde vai | Nome exato |
|---|---|---|
| Public | Vercel (Production + Preview) | `NEXT_PUBLIC_VAPID_PUBLIC_KEY` |
| Public | GitHub Secrets | `VAPID_PUBLIC_KEY` |
| Private | GitHub Secrets **e só lá** | `VAPID_PRIVATE_KEY` |
| — | GitHub Secrets | `VAPID_SUBJECT` = `mailto:jvlcg.work@gmail.com` |

> **Trocar o par apaga as inscrições existentes.** Quem já tinha ligado o aviso
> para de receber, sem ser avisado disso. Como hoje ninguém conseguiu se
> inscrever (o bloco não aparece), gerar um par novo agora não custa nada — mas
> depois que houver inscritos, custa.

## 4.5 — Redeploy

Vercel → **Deployments** → três pontinhos → **Redeploy**. Sem isso a variável
salva não entra no site.

## 4.6 — Conferir

Abra qualquer artigo do blog no computador e role até o fim. O bloco **"Quer
ser avisado de conteúdo novo?"** deve estar lá.

| O que você vê | O que significa |
|---|---|
| O bloco aparece | Deu certo |
| Continua sem aparecer | Faltou o redeploy, ou o nome da variável saiu diferente — tem de ser exatamente `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, com o `NEXT_PUBLIC_` na frente |
| Aparece e dá erro ao clicar | A pública da Vercel e a privada do GitHub não são do mesmo par |

**No iPhone é diferente e não é defeito.** A Apple só permite notificação da
web se o site tiver sido adicionado à Tela de Início. O bloco detecta isso e
explica o caminho em vez de mostrar um botão que não funcionaria.

---

# O que muda depois de tudo pronto

A cada artigo que a Soro publicar:

1. O fluxo do GitHub percebe a publicação
2. Envia **notificação no aparelho** de quem autorizou — isso já funciona hoje
3. Envia **e-mail** para quem se cadastrou — isso é o que estes passos ligam
4. Cada e-mail leva um link de cancelamento que funciona em um clique

Nenhuma das duas coisas exige que você faça nada. É automático a partir daí.
