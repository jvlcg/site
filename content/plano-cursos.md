# Cursos — o que já está pronto e o que falta

Este documento é o ponto de retomada. Se a sessão do Claude Code acabar, abra
este arquivo e continue de onde parou.

---

## Estado atual

**Pronto e funcionando:**

| Peça | Onde | Estado |
|---|---|---|
| Catálogo de cursos | `/cursos` | ✅ no ar (vazio até o primeiro curso) |
| Página do curso | `/cursos/<slug>` | ✅ |
| Player da aula | `/cursos/<slug>/<aula>` | ✅ |
| Liberação gradual (drip) | `liberaApos` em cada aula | ✅ |
| Entrada do aluno | conta do Google | ✅ |
| Matrículas | painel na área restrita, aba **Cursos** | ✅ |
| Doação PIX com QR | aulas e cursos gratuitos | ✅ |
| Vídeo gratuito | YouTube não listado | ✅ |
| Vídeo protegido (pago) | — | ⏳ falta escolher o serviço |
| Pagamento automático | — | ⏳ manual por PIX funciona hoje |

**O que falta você fazer, na ordem:** veja "Próximos passos", no fim.

---

## Como publicar uma aula

Tudo passa por **um arquivo só**: `content/cursos.ts`. Não há banco de dados
no meio, não há painel para o conteúdo — publicar é acrescentar um bloco e
pedir o commit.

### 1. Suba o vídeo

**Curso gratuito → YouTube, como "não listado".**

1. `youtube.com` → **Criar** → **Enviar vídeo**
2. Em **Visibilidade**, escolha **Não listado**
3. Publique e copie o link
4. O identificador é o que vem depois de `v=`:
   `youtube.com/watch?v=**ABC123xyz**` → o identificador é `ABC123xyz`

> **Não listado não é privado.** Quem tiver o endereço assiste, e o endereço
> aparece no código da página. Para curso gratuito isso é irrelevante — é
> gratuito. Para curso pago, é o problema todo. Veja a próxima seção.

**Curso pago → serviço com endereço assinado.** Ainda não escolhido; veja
"Decisão 1" abaixo.

### 2. Me mande a mensagem

Pelo Claude Code, algo como:

> Publica uma aula nova no curso `dor-cronica`, módulo 1: título "O que é dor
> crônica", 12 min, YouTube `ABC123xyz`, libera no dia 0. Resumo: a diferença
> entre dor aguda e crônica e por que o tratamento não é o mesmo.

Eu acrescento o bloco, confiro o build e faço o commit. Você não precisa
escrever código.

### 3. Se preferir fazer sozinho

Abra `content/cursos.ts`. Tem um modelo comentado no fim do arquivo, é só
copiar, colar acima e trocar o conteúdo. As instruções estão no cabeçalho do
próprio arquivo.

---

## Os três níveis de acesso

Definidos no campo `acesso` de cada curso.

| Valor | Quem assiste | Serve para |
|---|---|---|
| `livre` | qualquer pessoa, sem entrar em nada | conteúdo aberto. **É o único que aparece no Google** |
| `cadastro` | de graça, mas precisa entrar com a conta | quando você quer saber quem assiste, ou liberar aos poucos |
| `pago` | precisa entrar **e** ter a matrícula liberada | curso vendido |

**Liberação gradual só funciona em `cadastro` e `pago`.** O relógio começa na
data da matrícula, e curso `livre` não tem matrícula — não existe data de
início por pessoa. Se você quer conteúdo gratuito liberado aos poucos, use
`cadastro`.

---

## Como vender hoje, sem contratar nada

O caminho manual já funciona por inteiro, e para os primeiros alunos ele é
melhor que qualquer integração: zero taxa, zero contrato, zero espera.

1. A pessoa clica em **"Quero este curso"** na página do curso
2. Cai no seu WhatsApp com o nome do curso já na mensagem
3. Você manda a chave PIX e o valor
4. Ela paga e manda o comprovante
5. Você entra em **`/area-restrita` → aba Cursos → Liberar acesso**, com o
   e-mail dela
6. Ela entra no site com a conta do Google **do mesmo e-mail** e assiste

> **O erro que vai acontecer:** liberar para um e-mail e a pessoa entrar com
> outro. O painel avisa isso na tela. Sempre pergunte qual e-mail ela vai usar
> para entrar, não qual ela usa para falar com você.

### Sobre o direito de arrependimento

A página do curso já informa: **7 dias**, art. 49 do Código de Defesa do
Consumidor. É obrigatório em compra pela internet, não é negociável, e vale
mesmo que a pessoa já tenha assistido. Devolva o valor e cancele o acesso no
painel.

---

## Decisões que dependem de você

### Decisão 1 — Onde hospedar o vídeo pago

Só precisa decidir quando for lançar um curso **pago**. Para o gratuito, o
YouTube resolve.

| Serviço | Preço aproximado | A favor | Contra |
|---|---|---|---|
| **Panda Video** | ~R$ 100/mês | brasileiro, suporte em português, feito para quem vende curso, marca d'água com o CPF do aluno | mais caro |
| **Bunny Stream** | ~US$ 5/mês no começo | muito barato, rápido, endereço assinado | painel em inglês, você configura mais coisa |
| **Cloudflare Stream** | US$ 5 por 1.000 min guardados | infraestrutura sólida, preço previsível | painel técnico |
| **Vimeo** | ~US$ 20/mês | conhecido, simples | proteção mais fraca que as outras |

**Minha sugestão: Bunny Stream**, se você topar um painel em inglês — é a
melhor relação entre proteção e custo, e a diferença de preço para o Panda paga
vários meses de outras coisas. **Panda Video**, se você preferir tudo em
português e com suporte que atende por WhatsApp.

Quando escolher, me diga qual — eu ligo o tipo `protegido` do player, que já
está previsto no código.

### Decisão 2 — Pagamento automático, ou continuar no manual

O manual funciona bem até uns 20 ou 30 alunos. Depois disso, liberar à mão vira
trabalho e vira erro.

| Caminho | Taxa | O que muda |
|---|---|---|
| **Manual por PIX** (hoje) | 0% | você libera no painel |
| **Mercado Pago** | ~0,99% no PIX | link de pagamento; libero sozinho por webhook |
| **Asaas** | ~R$ 1,99 fixo no PIX | idem, com nota fiscal automática |
| **Hotmart / Kiwify** | 9% a 10% | eles cuidam de tudo — inclusive hospedar o vídeo e emitir nota — mas o aluno sai do seu site |

**Minha sugestão: fique no manual até o primeiro curso vender.** Integrar
pagamento antes de existir venda é construir esteira para uma fábrica que ainda
não abriu. Quando vender, **Asaas** — porque a nota fiscal automática resolve o
problema que mais dá dor de cabeça depois.

### Decisão 3 — Nota fiscal e enquadramento

Isto não é código, é contabilidade, e é o ponto que mais costuma ser deixado
para depois com prejuízo.

**Vender curso é atividade de ensino, não de medicina.** Não entra no seu CNPJ
médico nem no seu CRM. Converse com o seu contador antes do primeiro lançamento
sobre:

- se abre CNPJ separado com CNAE de ensino (8599-6/04, "treinamento em
  desenvolvimento profissional") ou acrescenta a atividade ao existente
- emissão de nota fiscal de serviço para cada venda
- ISS do município de Goiânia sobre o valor

Deixar para depois significa recolher retroativo com multa.

---

## Regras que o site já aplica sozinho

Coisas que você não precisa lembrar de fazer — o código já garante:

- **Curso não publicado não existe.** `publicado: false` some do catálogo *e*
  do endereço direto. Não há como alguém achar por acidente.
- **Aula que exige conta não vai para o Google.** Nem no sitemap, nem no
  índice. Evita que alguém clique num resultado e encontre porta fechada.
- **A conta de aluno não alcança dado de paciente.** São chaves diferentes no
  banco e cookies diferentes. Uma sessão de aluno vazada não chega perto de
  CPF nenhum.
- **Rematricular não reinicia o relógio.** Quem está no curso há duas semanas
  não volta ao primeiro dia porque alguém clicou duas vezes.
- **Todo aviso legal já está nas páginas:** conteúdo educativo, não substitui
  consulta, não estabelece relação médico-paciente, 192 em emergência, e o seu
  CRM.

---

## Próximos passos, na ordem

**Agora (não depende de ninguém):**

1. Crie a variável **`SESSAO_CHAVE`** na Vercel — sem ela ninguém consegue
   entrar como aluno. Gere no seu navegador (F12 → Console):

   ```js
   crypto.getRandomValues(new Uint8Array(32)).reduce((s,b)=>s+b.toString(16).padStart(2,'0'),'')
   ```

   Vercel → **Settings → Environment Variables → Add New**:
   nome `SESSAO_CHAVE`, o valor gerado, **só Production**. Depois **Redeploy**.

   > Trocar essa chave depois derruba todo mundo que estiver logado. Não é
   > grave — é só entrar de novo — mas não troque à toa.

2. Confira as **origens autorizadas** do cliente OAuth:
   `console.cloud.google.com` → **APIs e serviços → Credenciais** → clique no
   cliente → em **Origens JavaScript autorizadas** precisa constar
   `https://drjosevictor.com`. Sem isso o botão de entrar não funciona em
   produção.

**Quando tiver o primeiro vídeo:**

3. Suba no YouTube como não listado e me mande o identificador. Eu monto o
   primeiro curso gratuito, com a doação PIX já na página.

**Quando decidir vender:**

4. Me diga a Decisão 1 (onde hospedar o vídeo pago) — eu ligo o player
   protegido.
5. Fale com o contador sobre a Decisão 3 **antes** de anunciar preço.
6. Lance com pagamento manual. Quando passar de ~20 alunos, me diga e eu ligo o
   webhook da Decisão 2.

---

## Onde está cada coisa, no código

| O quê | Arquivo |
|---|---|
| O catálogo inteiro (cursos, módulos, aulas) | `content/cursos.ts` |
| Regras de quem vê o quê | `lib/cursos.ts` |
| Sessão do aluno e matrículas | `lib/aluno.ts` |
| Entrada e saída do aluno | `app/api/aluno/route.ts` |
| Liberar/cancelar matrícula | `app/api/matriculas/route.ts` |
| Painel de matrículas | `components/ui/PainelCursos.tsx` |
| QR e "copia e cola" do PIX | `lib/pix.ts`, `components/cursos/DoacaoPix.tsx` |
| O quadro do vídeo | `components/cursos/Player.tsx` |
