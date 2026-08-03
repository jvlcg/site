# Passo a passo: token do Redis e e-mail dos artigos

Duas tarefas de configuração, cada uma independente da outra. Nenhuma exige
mexer em código.

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

# O que muda depois de tudo pronto

A cada artigo que a Soro publicar:

1. O fluxo do GitHub percebe a publicação
2. Envia **notificação no aparelho** de quem autorizou — isso já funciona hoje
3. Envia **e-mail** para quem se cadastrou — isso é o que estes passos ligam
4. Cada e-mail leva um link de cancelamento que funciona em um clique

Nenhuma das duas coisas exige que você faça nada. É automático a partir daí.
