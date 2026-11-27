# Dois agentes, um repositório

Este repositório é trabalhado por mais de um agente ao mesmo tempo. Este arquivo
diz quem cuida de quê, como a gente combina as coisas, e onde é fundo de poço.

Leia o `AGENTS.md` primeiro — ele tem as restrições do projeto, e elas valem para
todos. Este arquivo é só a parte da convivência.

O site é de um médico em exercício e está no ar em `drjosevictor.com`.

---

## 1. Território

A divisão é por **pasta**, não por tarefa. Duas mãos no mesmo arquivo geram
conflito de merge, e conflito de merge aqui é como um aviso legal desaparece sem
ninguém notar.

| pasta | de quem | o que é |
|---|---|---|
| `components/` | visual | seções, cartões, cabeçalho, movimento |
| `app/globals.css` | visual | camadas de fundo, `@keyframes`, tema claro/escuro |
| `app/**/page.tsx` | visual | composição e ordem dos blocos na página |
| `app/api/` (13 rotas) | back end | cadastro cifrado, matrícula, chat, notificações |
| `lib/` | back end | criptografia, e-mail, Redis, índice de busca, Schema |
| `scripts/` | back end | sync de artigos, notificações, as conferências |
| `.github/workflows/` | back end | o que roda sozinho |
| `content/` | back end | artigos, aulas, páginas |

Precisou cruzar a linha? Cruze — e diga no corpo do PR que cruzou, com o motivo.
O problema não é tocar no que é do outro, é tocar em silêncio.

## 2. As fronteiras que doem

Quatro lugares onde a divisão acima não protege, porque parecem uma coisa e são
outra.

### `components/three/` — não é código morto

Oito arquivos, Three.js instalado, e para qualquer leitura rápida isso diz "já
está pronto, só falta usar". Não é o caso. `ThreeScene` **está** montado em
`app/page.tsx`, em `/cannabis-medicinal` e no `PageHero`.

O que sustenta o desempenho do site não é a cena existir ou não, é **o portão**:
ela só monta depois do primeiro gesto do visitante — mexer o mouse, rolar, tocar,
clicar ou digitar —, com prazo de dez segundos apenas no celular.

Montada de imediato, o bloqueio da thread principal vai de 163 ms para
**12.518 ms**. A cena é praticamente todo o custo do site.

E a saída óbvia já foi tentada: adiar só para depois do `load` empurrou os
quadros para dentro da janela medida e derrubou o desktop de 97 para 59. O portão
preso ao gesto é a terceira tentativa, não a primeira ideia.

Cena nova entra pelo mesmo portão, ou não entra.

### `app/globals.css` — sem `filter: blur()` nas camadas de fundo

Vidro fosco é o reflexo de todo mundo, e aqui ele é caro: `blur` não é composto
pela GPU. Três desfoques de tela cheia custaram **16 pontos de Lighthouse**
(97→81 no desktop, 78→63 no celular).

A profundidade deste site vem de `transform` e degradê. É escolha medida, não
falta de repertório.

### `lib/fundos.ts` — visual, mas é o chão de todo mundo

Decide o fundo de cada página: 21 variações, 6 desenhos, distribuídos por ângulo
áureo (137,5°) para que páginas vizinhas no menu não fiquem parecidas. É também
o **fallback** que aparece enquanto a cena 3D não montou.

Território compartilhado. Estender é bem-vindo; substituir pede conversa, e
qualquer mudança aqui tem que passar no `npm run verificar-fundos`.

### `components/ui/GoogleReviews.tsx` — já foi "melhorado" uma vez

Hoje ele mostra um link para o perfil no Google e nada mais. Isso não é um
componente pela metade esperando conclusão.

A home já exibiu nota, estrelas, seis textos de avaliação com nome do autor e
`aggregateRating` no Schema. Saiu por conformidade — republicar depoimento de
paciente no próprio site do médico é vedado pelas normas de publicidade médica, e
quem responde por isso é o CRM dele.

Um site médico "mais confiável" pede prova social. Aqui, prova social é o
problema. Se parecer que falta credibilidade na home, a resposta é tipografia,
hierarquia e clareza — não estrela.

## 3. Como a gente combina

**O PR é a mensagem.** Não há canal direto entre agentes. O que atravessa é o
diff, o corpo do PR e o comentário na linha. Commit que explica o *porquê* vale
mais que commit que descreve o *o quê* — metade da documentação deste projeto
está no histórico.

**Prefixo de branch por autor:** `manus/…`, `claude/…`. Dá para ver de quem é o
trabalho na lista de branches sem abrir nada.

**`main` vai ao ar sem etapa de aprovação.** Merge em `main` publica no site do
consultório em minutos. Branch de trabalho, PR, e só então merge.

**PR de agente não é mergeado por outro agente** sem o médico pedir.

## 4. Antes de abrir PR

```
npm run build
npm run verificar-fundos           um fundo próprio por página, desktop e 390px
npm run verificar-metadados        título, descrição, canonical, h1, JSON-LD
npm run verificar-acessibilidade   teclado, foco visível, leitor de tela
npm run verificar-links            links internos (3.700+)
npm run verificar-categorias       classificação dos artigos
```

Cada uma existe por causa de um defeito que passou por revisão. As três primeiras
precisam do Playwright, que **não** é dependência do projeto de propósito — a
Vercel não deve baixar um navegador a cada build. Instale na máquina com
`npm i -g playwright`.

## 5. Onde o visual pode melhorar de verdade

A lista acima é de limites. Esta é de espaço livre, que é maior.

**Território sem custo nenhum de runtime:** tipografia, escala, espaçamento,
hierarquia, estados de foco, contraste, microcópia, ordem dos blocos na página.
É onde quase todo ganho real de aparência deste site ainda está.

**Animação:** `transform` e `opacity` são compostas pela GPU e são de graça.
Animar `width`, `height`, `top`, `box-shadow` ou `filter` força layout ou pintura
a cada quadro — é o mesmo erro do `blur`, em outra roupa.

**Movimento reduzido é honrado em treze arquivos.** `prefers-reduced-motion`
não é enfeite de acessibilidade aqui, é parte do contrato. Animação nova respeita.

**O CLS está em 0,000 em todas as páginas.** Qualquer coisa que entre depois do
primeiro quadro precisa de espaço reservado antes.

**Há folga de desempenho, e ela foi comprada.** LCP medido entre 0,38 s e 1,66 s
no desktop, 0,66 s e 1,63 s no celular com CPU 4× mais lenta. Essa folga é o que
sobrou depois do portão da cena 3D. Dá para gastar — sabendo que está gastando.

## 6. O que não se negocia

Está detalhado no `AGENTS.md`. Em uma linha cada:

- **Publicidade médica.** Sem superlativo, promessa de resultado, preço de
  consulta, depoimento de paciente, antes e depois, ou alegação de especialidade
  (o médico não tem RQE). O nome completo e o `CRM-GO 38508` ficam no rodapé.
- **`CADASTRO_CHAVE` nunca muda.** Os cadastros de pacientes são cifrados com
  ela; trocar torna todos os registros existentes permanentemente ilegíveis.
- **Arquivos com `origem: soro` pertencem ao robô.** Edição à mão em
  `content/artigos/*.mdx` com essa marca dura até a próxima execução do sync.
- **Nunca escrever dados de teste no banco de produção.**

## 7. Conferir o repositório não é conferir o site

O pior problema de conformidade que este site já teve — depoimentos de pacientes
publicados na home — passou por uma revisão que procurou "depoimento" no
código-fonte e não achou nada. Os textos vinham de uma API em tempo de execução.

Mudança visual se confere no **HTML servido** e na tela, nos dois tamanhos.
Atributo presente não é animação visível, e `getComputedStyle` mente sobre
animação composta pela GPU — devolve a matriz identidade com a animação rodando.
O estado real está em `elemento.getAnimations({ subtree: true })`.
