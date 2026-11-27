# Antes de mexer neste repositório

Site de um médico em exercício. Leia isto inteiro antes da primeira alteração —
são poucas páginas, e cada item aqui é uma armadilha que já custou retrabalho ou
que tem consequência fora do código.

O `README.md` explica como rodar e operar. Este arquivo explica o que **não**
fazer, e por quê.

---

## 1. A restrição que manda em tudo: publicidade médica

Este não é um site institucional comum. O que ele publica está sujeito às normas
de publicidade médica do CFM, e o CRM do médico responde por elas.

**Nunca adicione, nem "melhore" o texto para incluir:**

- superlativo ou autopromoção — "o melhor", "referência em", "líder", "exclusivo"
- promessa de resultado, cura ou garantia terapêutica
- preço de consulta, desconto, promoção ou "primeira consulta grátis"
- **depoimento, avaliação, nota ou estrela de paciente** (ver item 2)
- foto de antes e depois
- alegação de especialidade — o médico **não tem RQE**; tudo é "área de atuação"

**Nunca remova:** o nome completo e o `CRM-GO 38508` do rodapé, nem o aviso de
conteúdo educativo no rodapé dos artigos.

Ao escrever conteúdo clínico, assuma que é material educativo que não substitui
consulta, e escreva assim.

## 2. As avaliações do Google foram removidas de propósito

`lib/google-reviews.ts` existe, funciona e **não é usado pelo site público**.
Isso não é código esquecido.

A home já exibiu nota, estrelas, textos de avaliações com nome do autor e
`aggregateRating` no Schema. Foi removido por conformidade. O raciocínio está em
`components/ui/GoogleReviews.tsx` e no `README.md`.

Religar é decisão do médico com o CRM-GO. Não é uma melhoria de SEO a ser feita
por iniciativa própria, por mais que as estrelas no Google sejam tentadoras.

## 3. Arquivos que são de máquina, não seus

`content/artigos/*.mdx` com `origem: soro` no frontmatter pertencem ao
`scripts/sync-soro.mjs`, que roda sozinho e sobrescreve. **Edição à mão ali dura
até a próxima execução.**

Isso já aconteceu duas vezes: tags escritas à mão voltaram a `[]`, e uma
descrição encurtada voltou ao tamanho antigo, ambas na mesma madrugada.

Para mudar o comportamento desses arquivos, mude o **gerador**:
`scripts/sync-soro.mjs` e `scripts/categorias.mjs`. Categoria, tags e tamanho da
descrição já são derivados lá.

Artigos sem `origem: soro` são escritos à mão e o sync nunca os toca.

## 4. Coisas que parecem defeito e não são

| parece | é |
|---|---|
| `alt=""` nas capas de aula (`components/cursos/Capa.tsx`) | **correto.** A imagem fica ao lado do próprio título; com texto alternativo o leitor de tela anunciaria a mesma frase duas vezes |
| ausência de WebGL/Three.js nos heróis | **medido.** Com a cena, o bloqueio da thread principal vai de 163 ms para 12.518 ms. A profundidade vem de `transform` e degradê |
| nenhum `filter: blur()` nas camadas de fundo | **medido.** Três desfoques de tela cheia custaram 16 pontos de Lighthouse (97→81 desktop, 78→63 celular) |
| títulos de artigo acima de 60 caracteres | **tolerado de propósito.** É manchete escrita pelo médico; encurtar piora o site para quem lê. Só os rótulos de página de serviço foram encurtados |
| `/cannabis-medicinal` com menu escrito "Endocanabinoide" | **correto.** O rótulo nomeia a abordagem médica; o endereço ficou por SEO |

## 5. Como medir sem se enganar

Três erros se repetiram nesta base. Evite-os:

**`getComputedStyle` mente sobre animação composta pela GPU.** Devolve a matriz
identidade mesmo com a animação rodando. Use
`elemento.getAnimations({ subtree: true })`, que dá o estado real.

**`textContent` não é o nome acessível.** Um link que envolve
`<img alt="Fachada da clínica">` não tem texto e **tem** nome. Use
`page.accessibility.snapshot()`.

**Conferir o repositório não basta.** O pior problema de conformidade deste site
— depoimentos de pacientes publicados na home — passou por uma revisão que
procurou "depoimento" no código-fonte. Os textos vinham de uma API em tempo de
execução. **Confira o HTML servido.**

## 6. Conferências automáticas

Rode depois de mudanças visuais ou de conteúdo. Cada uma existe por causa de um
defeito que passou:

```
npm run verificar-links            links internos (3.700+)
npm run verificar-fundos           um fundo próprio por página, desktop e 390px
npm run verificar-categorias       classificação dos artigos
npm run verificar-metadados        título, descrição, canonical, h1, JSON-LD
npm run verificar-acessibilidade   teclado, foco visível, leitor de tela
```

Precisam de `npm run build` antes, e do Playwright instalado na máquina (não é
dependência do projeto, de propósito — a Vercel não deve baixar um navegador a
cada build).

## 7. Ações irreversíveis

**`CADASTRO_CHAVE` nunca pode mudar.** Os cadastros de pacientes são cifrados com
ela. Trocar a variável torna todos os registros existentes permanentemente
ilegíveis. Não há recuperação.

**Nunca escreva dados de teste no banco de produção.**

**Segredos de produção são só de Produção.** As URLs de Preview da Vercel são
públicas; um segredo marcado para Preview expõe dado real de paciente.

`VAPID_PRIVATE_KEY` vive só nos GitHub Secrets. `CADASTRO_CHAVE` vive só na Vercel.

## 8. Publicação

`main` faz deploy automático na Vercel para `drjosevictor.com`. Não há etapa de
aprovação: o que entra em `main` vai ao ar.

Branch de trabalho, PR, e só então merge.
