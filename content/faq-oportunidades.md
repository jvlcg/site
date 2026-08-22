# Oportunidades para o FAQ — 2026-08-22

Relatório gerado automaticamente por `scripts/faq-oportunidades.mjs`. **Nada aqui está no ar.**
Para publicar uma pergunta, copie o bloco correspondente para `lib/chat-faq.ts`.
Perguntas com `soPagina: true` aparecem só na página do FAQ; sem esse campo, aparecem também no chat.

Situação atual: **39 perguntas** no site (26 também no chat), **27 artigos** publicados.

## 1. Perguntas já respondidas nos artigos e ausentes do FAQ

São as candidatas mais seguras: o texto já foi escrito e revisado para o artigo.

### Com que frequência devo fazer check-up?
Origem: `content/artigos/check-up-o-que-realmente-vale.mdx` — Check-up: o que realmente vale a pena fazer (e o que é exagero)

```ts
{
  categoria: "Tratamentos", // confira a categoria
  q: "Com que frequência devo fazer check-up?",
  a: "Não existe um intervalo único para todos. A periodicidade depende da idade, do histórico pessoal e familiar e dos fatores de risco. Para muitos adultos saudáveis, uma avaliação anual é suficiente; para outros, o intervalo pode ser diferente. Isso é definido na consulta.",
  soPagina: true,
},
```

### Fazer mais exames é sempre melhor?
Origem: `content/artigos/check-up-o-que-realmente-vale.mdx` — Check-up: o que realmente vale a pena fazer (e o que é exagero)

```ts
{
  categoria: "Tratamentos", // confira a categoria
  q: "Fazer mais exames é sempre melhor?",
  a: "Não. Exames sem indicação podem gerar resultados falso-positivos, levar a investigações desnecessárias e causar ansiedade. Um bom check-up é direcionado, não uma lista genérica igual para todos.",
  soPagina: true,
},
```

### Dor muscular depois do treino é sempre normal?
Origem: `content/artigos/dor-no-treino-quando-investigar.mdx` — Dor no treino: quando é normal e quando você precisa investigar

```ts
{
  categoria: "Tratamentos", // confira a categoria
  q: "Dor muscular depois do treino é sempre normal?",
  a: "A dor muscular tardia (aquela que aparece 24 a 48 horas após um treino intenso ou novo) costuma ser benigna e passageira. Já a dor que surge durante o movimento, é localizada em uma articulação, ou persiste por vários dias merece avaliação.",
  soPagina: true,
},
```

### Posso continuar treinando com dor?
Origem: `content/artigos/dor-no-treino-quando-investigar.mdx` — Dor no treino: quando é normal e quando você precisa investigar

```ts
{
  categoria: "Tratamentos", // confira a categoria
  q: "Posso continuar treinando com dor?",
  a: "Depende do tipo de dor. Desconforto muscular leve geralmente permite ajuste de carga. Dor articular, com inchaço, travamento ou que piora progressivamente é sinal para parar e procurar avaliação antes de seguir.",
  soPagina: true,
},
```

### Tomar remédio para dormir é a primeira opção?
Origem: `content/artigos/insonia-quando-investigar-e-tratar.mdx` — Insônia: quando é hora de investigar e tratar de verdade

```ts
{
  categoria: "Tratamentos", // confira a categoria
  q: "Tomar remédio para dormir é a primeira opção?",
  a: "Não. A primeira linha de tratamento para a insônia crônica é comportamental (higiene do sono e terapia cognitivo-comportamental para insônia). Medicações têm papel em situações específicas, por tempo definido e sob acompanhamento — nunca como solução automática.",
  soPagina: true,
},
```

### Quantas horas de sono são normais?
Origem: `content/artigos/insonia-quando-investigar-e-tratar.mdx` — Insônia: quando é hora de investigar e tratar de verdade

```ts
{
  categoria: "Tratamentos", // confira a categoria
  q: "Quantas horas de sono são normais?",
  a: "A maioria dos adultos precisa de 7 a 9 horas, mas há variação individual. Mais importante que o número é a qualidade do sono e como você se sente durante o dia.",
  soPagina: true,
},
```

### O sistema endocanabinoide só existe em quem usa cannabis?
Origem: `content/artigos/sistema-endocanabinoide-o-que-e.mdx` — Sistema endocanabinoide: o que é e por que ele importa para a sua saúde

```ts
{
  categoria: "Tratamentos", // confira a categoria
  q: "O sistema endocanabinoide só existe em quem usa cannabis?",
  a: "Não. O sistema endocanabinoide é parte natural do corpo humano e funciona independentemente de qualquer uso de cannabis. Ele produz seus próprios mensageiros químicos, chamados endocanabinoides.",
  soPagina: true,
},
```

### A teleconsulta tem a mesma validade da consulta presencial?
Origem: `content/artigos/telemedicina-como-funciona-consulta-online.mdx` — Telemedicina: como funciona uma consulta médica online de verdade

```ts
{
  categoria: "Tratamentos", // confira a categoria
  q: "A teleconsulta tem a mesma validade da consulta presencial?",
  a: "Sim. A telemedicina é regulamentada no Brasil pelo Conselho Federal de Medicina e segue os mesmos deveres éticos da consulta presencial, incluindo sigilo, registro em prontuário e responsabilidade do médico.",
  soPagina: true,
},
```

### A receita emitida online é aceita na farmácia?
Origem: `content/artigos/telemedicina-como-funciona-consulta-online.mdx` — Telemedicina: como funciona uma consulta médica online de verdade

```ts
{
  categoria: "Tratamentos", // confira a categoria
  q: "A receita emitida online é aceita na farmácia?",
  a: "Sim. As prescrições são emitidas com assinatura digital certificada (padrão ICP-Brasil) e podem ser validadas eletronicamente por qualquer farmácia do país.",
  soPagina: true,
},
```


## 2. Assuntos publicados sem pergunta correspondente

- **Causas de cansaço constante e quando investigar** (`causas-de-cansaco-constante`) — sem cobertura para: sonolência, dormir
- **Check-up para quem treina: o que avaliar** (`check-up-para-quem-treina`) — sem cobertura para: exercício
- **Como melhorar performance no treino com segurança** (`como-melhorar-performance-no-treino`) — sem cobertura para: performance
- **Como voltar a treinar após lesão com segurança** (`como-voltar-a-treinar-apos-lesao`) — sem cobertura para: lesão, exercício
- **Dor muscular após treino: quando se preocupar?** (`dor-muscular-apos-treino-quando-se-preocupar`) — sem cobertura para: lesão, exercício
- **Dor no treino: quando é normal e quando você precisa investigar** (`dor-no-treino-quando-investigar`) — sem cobertura para: lesão, performance
- **Hábitos para sono reparador que funcionam** (`habitos-para-sono-reparador`) — sem cobertura para: dormir, sonolência
- **Medicina esportiva para treinar com segurança** (`medicina-esportiva-treinar-seguranca`) — sem cobertura para: exercício
- **Quando procurar médico para dor crônica?** (`medico-para-dor-cronica`) — sem cobertura para: exercício
- **Quando procurar médico por insônia persistente?** (`quando-procurar-medico-por-insonia`) — sem cobertura para: dormir, sonolência

## 3. Cobertura por categoria

| Categoria | Perguntas | Também no chat |
| --- | ---: | ---: |
| Sobre | 5 | 3 |
| Consultório | 6 | 4 |
| Telemedicina | 6 | 5 |
| Agendamento | 9 | 7 |
| Tratamentos | 13 | 7 |

_Ordenado da menor para a maior cobertura._

## 4. Perguntas sugeridas

Rascunhos gerados por IA a partir das lacunas acima. **Leia e edite antes de usar** —
o texto sai com o nome e o CRM do médico.

### Sinto dor durante ou após o treino. Como saber se é desconforto normal ou sinal de algo que precisa avaliação?
_Por que agora:_ Blog trata dor no treino e lesão, mas FAQ não oferece critério claro para o paciente saber quando procurar antes de agravar — é dúvida de auto-cuidado pré-agendamento.

```ts
{
  categoria: "Tratamentos",
  q: "Treino causa dor — quando devo investigar?",
  full: "Sinto dor durante ou após o treino. Como saber se é desconforto normal ou sinal de algo que precisa avaliação?",
  a: "A dor associada ao exercício pode ser esperada em certas situações — como dor muscular leve após treino novo ou mais intenso — mas alguns sinais exigem atenção. Dor aguda durante o exercício, limitação de movimento, inchaço ou dor que persiste além de alguns dias merece avaliação clínica para descartar lesão e orientar o retorno seguro.\n\nUma avaliação médica na área de medicina esportiva pode identificar se há lesão, orientar ajustes na técnica ou carga, e estruturar um plano para você treinar com segurança e clareza sobre seus limites reais.",
  cta: true,
},
```

### Ando sempre cansado, mesmo dormindo bem. Quando isso exige uma consulta médica?
_Por que agora:_ Blog responde sobre causas de cansaço, mas FAQ carece de orientação sobre quando procurar — deixa o paciente inseguro em decisão de agendar.

```ts
{
  categoria: "Tratamentos",
  q: "Cansaço constante — quando procurar avaliação?",
  full: "Ando sempre cansado, mesmo dormindo bem. Quando isso exige uma consulta médica?",
  a: "Cansaço persistente pode ter múltiplas origens — desde hábitos de sono e treino inadequados até condições que merecem investigação. Se o cansaço interfere em suas atividades diárias, não melhora com descanso, ou aparece junto com outros sinais (mudança de peso, alteração do humor, falta de apetite), uma avaliação médica orientada ajuda a identificar possíveis causas.\n\nEssa investigação é particularmente importante se você treina ou tem rotina exigente, pois o cansaço pode sinalizar desequilíbrio entre carga e recuperação ou outras condições que precisam de cuidado específico.",
  cta: true,
},
```

### Treino regularmente. Preciso fazer um check-up específico para quem pratica exercício? Por quê?
_Por que agora:_ Blog trata check-up para atletas, mas FAQ não oferece pergunta sobre quando/por que é indicado — paciente ativo não sabe se deve buscar essa avaliação específica.

```ts
{
  categoria: "Tratamentos",
  q: "Como saber se preciso de check-up esportivo?",
  full: "Treino regularmente. Preciso fazer um check-up específico para quem pratica exercício? Por quê?",
  a: "Uma avaliação médica orientada para quem treina ajuda a reconhecer riscos individuais — como alterações cardiovasculares, desequilíbrios musculares ou sinais de sobrecarga — que podem não ser evidentes no dia a dia. Essa avaliação é particularmente valiosa antes de aumentar intensidade, mudar de modalidade ou se você apresenta sintomas durante o treino.\n\nAlém de exames direcionados, essa consulta permite ao médico entender sua rotina, objetivos e limitações, orientando ajustes práticos em carga, técnica e recuperação para você treinar com segurança real e clareza sobre seu corpo.",
  cta: true,
},
```

### Me lesionei e fiquei sem treinar. Como saber quando é seguro voltar e como estruturar o retorno?
_Por que agora:_ Blog responde como voltar a treinar, mas FAQ não oferece pergunta sobre retorno pós-lesão — paciente lesionado procura resposta antes de agendar e não encontra.

```ts
{
  categoria: "Tratamentos",
  q: "Voltar a treinar após lesão — por onde começo?",
  full: "Me lesionei e fiquei sem treinar. Como saber quando é seguro voltar e como estruturar o retorno?",
  a: "Retornar ao treino após lesão requer avaliação médica para confirmar que a recuperação permite movimento seguro e orientação sobre progressão de carga — acelerar demais risco recaída, ir muito lento pode descondicionar. Uma avaliação especializada em medicina esportiva ajuda a identificar limitações reais, ajustar técnica e estabelecer passos progressivos.\n\nEssa estrutura protege seu retorno, evita compensações que geram novas lesões e permite que você recupere confiança e desempenho com critério clínico claro em cada etapa.",
  cta: true,
},
```

### Tenho insônia/dificuldade de sono. Como vocês abordam esse problema? Qual é a sequência da avaliação?
_Por que agora:_ Blog trata insônia e sono em profundidade, mas FAQ não explica como o consultório trabalha essa área — paciente com queixa de sono não vê clareza sobre o que esperar.

```ts
{
  categoria: "Consultório",
  q: "Qual sua abordagem em medicina do sono?",
  full: "Tenho insônia/dificuldade de sono. Como vocês abordam esse problema? Qual é a sequência da avaliação?",
  a: "A avaliação do sono começa por escuta detalhada — quando começou a dificuldade, como ela interfere em sua vida, que tentativas já fez. Essa conversa orienta se a causa está em hábitos, ambiente, condições médicas ou psicológicas, ou em combinações que precisam de cuidado integrado.\n\nDe lá, a avaliação médica pode sugerir ajustes práticos em rotina, investigar com exames se necessário, ou considerar opções de tratamento individualizadas — sempre com foco em entender sua situação real e estruturar um plano que faça sentido para você.",
  cta: true,
},
```

---

Toda resposta publicada precisa continuar respeitando as regras de publicidade médica:
sem promessa de resultado, sem diagnóstico ou conduta, sem preço, sem superlativo, e
medicina endocanabinoide sempre como **área de atuação** — nunca como especialidade.
