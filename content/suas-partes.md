# Suas partes

Tudo o que dependia de mim está pronto. Isto é o que só você pode fazer, na
ordem em que faz diferença fazer.

---

## Agora — 15 minutos, e destrava o resto

### 1. `SESSAO_CHAVE` na Vercel *(se ainda não estiver valendo)*

**Sem ela ninguém consegue entrar como aluno.** O botão aparece, a pessoa
toca, e não acontece nada — o servidor não consegue assinar o cookie.

**Como conferir se já está valendo:** abra `drjosevictor.com/area-restrita`,
entre com sua senha e clique na aba **Cursos**. Se não houver aviso amarelo,
está funcionando e você pode pular este item.

**Se o aviso estiver lá:**

1. Abra qualquer página no computador, aperte **F12**, aba **Console**
2. Cole e aperte Enter:
   ```js
   crypto.getRandomValues(new Uint8Array(32)).reduce((s,b)=>s+b.toString(16).padStart(2,'0'),'')
   ```
3. Copie os 64 caracteres, **sem as aspas**
4. Vercel → **Settings → Environment Variables → Add New**
   nome `SESSAO_CHAVE`, o valor, **só Production**
5. **Save** → aba **Deployments** → três pontinhos → **Redeploy**

> O erro mais comum não é a chave errada — é **esquecer o Redeploy**. Variável
> nova só vale em deploy novo.

### 2. Origens do cliente OAuth

`console.cloud.google.com` → **APIs e serviços → Credenciais** → clique no seu
cliente OAuth. Em **Origens JavaScript autorizadas** precisa constar
`https://drjosevictor.com`.

Sem isso, o botão "Entrar com o Google" não funciona em produção — e funciona
em teste, o que torna a falha confusa.

### 3. Trocar o segredo do cliente OAuth (o arquivo que você me mandou)

Você enviou aqui no chat o `client_secret_….json` baixado do Google. Ele traz
o segredo do cliente OAuth em texto puro, e tudo que passa por uma conversa
deve ser tratado como exposto.

**Antes de tudo, o que NÃO fazer: não apague o cliente OAuth.** O `client_id`
dele está dentro do site (`lib/site-config.ts`) e é o que faz o botão
"Continuar com Google" existir. Apagar o cliente derruba o botão. O que sai é
só o segredo.

**O site nunca usou esse segredo.** Ele serve ao fluxo de acesso continuado à
conta da pessoa — ler agenda, mandar e-mail em nome dela —, coisa que este
site não faz. Aqui o Google entrega a identidade já assinada, e conferir
assinatura usa a chave **pública** dele. Está explicado em
`lib/google-identidade.ts`. Ou seja: trocar o segredo não quebra nada, e você
pode fazer sem medo e sem pressa de testar depois.

**Passo a passo:**

1. `console.cloud.google.com/apis/credentials`
2. Confira o **projeto** na barra de cima — se tiver mais de um, é fácil mexer
   no errado
3. Em **IDs do cliente OAuth 2.0**, clique no cliente cujo ID começa com
   `148201884967-0s8mrmv85h0…`
4. Na seção **Secrets do cliente** (ou "Chaves secretas do cliente"):
   - clique em **Adicionar secret**
   - depois apague o antigo no ícone de lixeira
   - se aparecer só o botão **Redefinir secret**, ele já faz as duas coisas

   A ordem importa: o Google costuma não deixar apagar o único segredo
   existente. Criar o novo primeiro contorna isso.
5. O segredo novo **não vai para lugar nenhum.** Nem Vercel, nem GitHub, nem
   este chat. O projeto não tem onde usá-lo.

**Depois, apague o arquivo baixado:**

- **Computador:** pasta **Downloads**, apague o `client_secret_….json` — e
  **esvazie a lixeira**, senão ele continua lá
- **iPhone/Android:** app **Arquivos** → Downloads → apagar → abrir
  **Excluídos recentemente** e apagar de vez
- Confira se a pasta Downloads é sincronizada com **iCloud, Google Drive ou
  OneDrive**. Se for, o arquivo também está na nuvem e some de lá junto — mas
  vale conferir na lixeira do serviço

**O risco que isso fecha:** com `client_id` + segredo, alguém consegue montar
uma tela de consentimento do Google que aparece para a vítima **com o nome do
seu site**. Não dá acesso ao seu banco de pacientes nem à sua conta Google;
o problema é o seu nome servindo de fachada para pedir dados a terceiros.

### 4. Apagar a chave de API antiga do Google

Na mesma tela, seção **Chaves de API**: apague a que começa com `AIzaSy…`.
**Apagar, não editar** — restringir domínio não invalida o valor antigo.

Search Console, Analytics, Ads e Perfil da Empresa **não usam chave de API**.
Você não vai quebrar nada.

### 5. Rotacionar o token do Upstash

`console.upstash.com` → seu banco → **Details** → **REST API** → **Reset
password**. Depois cole o novo na Vercel e faça **Redeploy**.

Passo a passo detalhado em `content/passo-a-passo-operacional.md`.

---

## Para os cursos ficarem completos

Os seis vídeos do canal já estão no ar em `/cursos`. Faltam três coisas que
só você pode dar — e as três eu tentei obter sozinho, sem sucesso.

### Duração de cada aula

Aparece na lista e nos dados que o Google usa para mostrar o vídeo na busca.

Tentei quatro caminhos: a página do canal, a do vídeo, a do embed e o
oEmbed. As duas primeiras estão protegidas por verificação anti-robô; as
outras duas não trazem duração.

O jeito rápido é você me mandar assim, uma linha por vídeo:

```
69NKVX8ALn4  12 min
3JTXmfecV4Y  8 min
```

O jeito automático é criar uma chave da **YouTube Data API v3** no console
do Google (grátis, cota de sobra para isto) e me dizer só o nome da
variável — aí o script busca duração e descrição sozinho, e as próximas
aulas entram completas sem você digitar nada.

### Uma frase por aula

Nenhuma aula tem resumo, e foi decisão consciente: eu não assisti aos
vídeos, e resumo inventado seria informação falsa apresentada como
verdadeira. Uma frase por aula resolve.

### O vídeo chamado 🫆

Está com o emoji como título, que foi o nome que você deu no YouTube. Se
quiser um título escrito, me diga qual.

---

## Quando tiver o primeiro vídeo

Suba no YouTube como **não listado** e me mande:

- o **identificador** (o que vem depois de `v=` no endereço)
- o **título** da aula
- a **duração** ("12 min")
- a **data** de publicação

> A data não é opcional se você quer o vídeo aparecendo no Google — é campo
> obrigatório do dado estruturado, e sem ela o Google descarta o bloco inteiro.

Eu monto o curso, publico e ligo os pontos por conclusão.

---

## Duas decisões que ainda são suas

### Onde hospedar vídeo de curso **pago**

Só precisa decidir quando for vender. Para conteúdo gratuito, o YouTube não
listado resolve.

| Serviço | Custo | A favor | Contra |
|---|---|---|---|
| **Bunny Stream** | ~US$ 5/mês | barato, rápido, endereço assinado | painel em inglês |
| **Panda Video** | ~R$ 100/mês | brasileiro, suporte em português, marca d'água com CPF do aluno | mais caro |

Minha sugestão é **Bunny**, se você topar o painel em inglês. Me diga qual e eu
ligo o player protegido, que já está previsto no código.

> **YouTube "não listado" não serve para curso pago.** Não listado significa
> fora da busca, não privado: qualquer pessoa com o endereço assiste, e o
> endereço aparece no código da página.

### Contador — antes de anunciar qualquer preço

Vender curso é atividade de **ensino**, não de medicina. Não entra no CNPJ
médico nem no CRM. Converse sobre:

- CNAE de ensino (8599-6/04) — CNPJ separado ou atividade acrescentada
- Nota fiscal de serviço a cada venda
- ISS de Goiânia
- **E também:** como declarar curso dado como **prêmio** (nível Prata e Ouro)

Este é o único item da lista que fica **mais caro quanto mais você espera** —
recolhimento retroativo tem multa.

---

## O que já está funcionando e você pode usar hoje

| Recurso | Onde |
|---|---|
| Conta de aluno (Google, sem senha) | botão **Entrar** no cabeçalho |
| Área do aluno com cursos e pontos | `/minha-conta` |
| Pontos, níveis e link de indicação | `/minha-conta` |
| Liberar acesso a curso, à mão | `/area-restrita` → **Cursos** |
| Ver contas e lançar reconhecimento | `/area-restrita` → **Pontos** |
| PDF de treino e alimentação | `/medicina-esportiva` |
| Trecho exclusivo em artigo | `<SoParaAlunos>` no `.mdx` |
| Marcar aula como assistida (+40 ao concluir) | dentro da aula, em curso com conta |
| Vender por PIX, sem contratar nada | botão do curso → seu WhatsApp |
| Doação por PIX no conteúdo aberto | páginas de curso gratuito |

### Como vender hoje, sem integrar nada

1. A pessoa clica em **"Quero este curso"** → cai no seu WhatsApp
2. Você manda a chave PIX e o valor
3. Ela paga e manda o comprovante
4. `/area-restrita` → **Cursos** → **Liberar acesso**, com o e-mail dela
5. Ela entra com a conta Google **do mesmo e-mail** e assiste

> Sempre pergunte **"qual e-mail você vai usar para entrar?"** — não o que ela
> usa para te chamar. Errar isso é a causa de quase todo "paguei e não consigo
> assistir".

### Como lançar reconhecimento

`/area-restrita` → **Pontos** → e-mail da pessoa + motivo → **Lançar**. São
+25 pontos, e o motivo que você escrever aparece no extrato dela.

Use quando alguém compartilhar de verdade, quando um paciente voltar para o
retorno combinado, ou em qualquer gesto que mereça e que o site não tenha como
perceber sozinho.

---

## Ligar o resgate de curso como prêmio

Já está construído e **desligado por padrão**. Depois de falar com o contador,
para ligar:

Vercel → **Settings → Environment Variables → Add New**
nome `RESGATE_ATIVO`, valor `1`, **só Production** → **Redeploy**.

A partir daí, quem estiver no nível Prata vê na conta um seletor para escolher
um curso pago; quem estiver no Ouro pode liberar todos, um a um.

Para desligar de novo, apague a variável e faça Redeploy — quem já resgatou
mantém o acesso, porque a matrícula é real.

---

## O que eu ainda faço, quando você destravar

- **Player protegido** — depende da escolha do serviço de vídeo
- **Webhook de pagamento** — só vale a pena depois de umas 20 vendas; até lá o
  manual é mais barato e mais rápido

---

## Documentos relacionados

- `content/plano-cursos.md` — como publicar aula, vender, e as decisões de vídeo
- `content/plano-gamificacao.md` — o desenho completo de pontos e níveis
- `content/passo-a-passo-operacional.md` — Upstash, Resend, chave do Google, VAPID
