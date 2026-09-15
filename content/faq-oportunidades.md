# Oportunidades para o FAQ — 2026-09-15

Relatório gerado automaticamente por `scripts/faq-oportunidades.mjs`. **Nada aqui está no ar.**
Para publicar uma pergunta, copie o bloco correspondente para `lib/chat-faq.ts`.
Perguntas com `soPagina: true` aparecem só na página do FAQ; sem esse campo, aparecem também no chat.

Situação atual: **39 perguntas** no site (26 também no chat), **51 artigos** publicados.

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

- **Avaliação médica antes de começar academia** (`avaliacao-medica-antes-de-comecar-academia`) — sem cobertura para: exercício
- **Causas de cansaço constante e quando investigar** (`causas-de-cansaco-constante`) — sem cobertura para: sonolência, dormir
- **Check-up para quem treina: o que avaliar** (`check-up-para-quem-treina`) — sem cobertura para: exercício
- **Colesterol alto: o que fazer com segurança** (`colesterol-alto-o-que-fazer`) — sem cobertura para: exercício
- **Como melhorar performance no treino com segurança** (`como-melhorar-performance-no-treino`) — sem cobertura para: performance
- **Como voltar a treinar após lesão com segurança** (`como-voltar-a-treinar-apos-lesao`) — sem cobertura para: lesão, exercício
- **Creatina faz mal ao rim? O que diz a ciência** (`creatina-faz-mal-ao-rim`) — sem cobertura para: lesão
- **Dor lombar em quem treina: é hora de investigar?** (`dor-lombar-em-quem-treina`) — sem cobertura para: exercício, lesão
- **Dor muscular após treino: quando se preocupar?** (`dor-muscular-apos-treino-quando-se-preocupar`) — sem cobertura para: lesão, exercício
- **Dor no joelho ao correr: quando investigar?** (`dor-no-joelho-ao-correr`) — sem cobertura para: exercício, lesão
- **Dor no treino: quando é normal e quando você precisa investigar** (`dor-no-treino-quando-investigar`) — sem cobertura para: lesão, performance
- **Emagrecimento com acompanhamento médico seguro** (`emagrecimento-com-acompanhamento-medico-seguro`) — sem cobertura para: exercício
- **Quando pedir exames hormonais masculinos?** (`exames-hormonais-masculinos`) — sem cobertura para: performance
- **Hábitos para sono reparador que funcionam** (`habitos-para-sono-reparador`) — sem cobertura para: dormir, sonolência
- **Insônia crônica: tratamento sem remédio** (`insonia-cronica-tratamento-sem-remedio`) — sem cobertura para: dormir, sonolência
- **Medicina esportiva para treinar com segurança** (`medicina-esportiva-treinar-seguranca`) — sem cobertura para: exercício
- **Quando procurar médico para dor crônica?** (`medico-para-dor-cronica`) — sem cobertura para: exercício
- **Quando procurar médico por insônia persistente?** (`quando-procurar-medico-por-insonia`) — sem cobertura para: dormir, sonolência
- **Sintomas de overtraining que pedem atenção** (`sintomas-de-overtraining`) — sem cobertura para: exercício, performance

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

### Por que é importante fazer uma avaliação médica antes de começar ou intensificar a prática de exercícios?
_Por que agora:_ Muitos pacientes começam academia sem avaliação e o blog trata disso, mas o FAQ não oferece a resposta ao paciente indeciso que procura segurança antes de agendar.

```ts
{
  categoria: "Tratamentos",
  q: "Preciso de avaliação médica antes de começar a treinar?",
  full: "Por que é importante fazer uma avaliação médica antes de começar ou intensificar a prática de exercícios?",
  a: "Uma avaliação médica antes de iniciar atividades físicas identifica fatores de risco individuais — histórico familiar, sintomas silenciosos, medicações em uso — que podem interferir no treino seguro.\n\nEsta consulta permite que o médico conheça seu contexto clínico completo, revise exames anteriores se necessário e oriente ajustes de intensidade, frequência e tipo de exercício de forma personalizada, reduzindo risco de lesões e complicações.",
  cta: true,
},
```

### Como diferenciar a dor muscular normal do exercício de um sinal de alerta que exige avaliação médica?
_Por que agora:_ O blog tem vários artigos sobre dor em diferentes contextos (joelho, costas, muscular geral), mas o FAQ não oferece critério claro para o paciente ativo decidir quando parar e agendar.

```ts
{
  categoria: "Tratamentos",
  q: "Dor ao treinar: quando devo parar e procurar o médico?",
  full: "Como diferenciar a dor muscular normal do exercício de um sinal de alerta que exige avaliação médica?",
  a: "Dor muscular esperada após exercício é geralmente leve, simétrica e melhora com repouso e movimento moderado nos dias seguintes. Sinais de alerta incluem dor aguda durante o movimento, dor que piora progressivamente, inchaço, instabilidade articular, formigamento ou dor que persiste após dias de repouso.\n\nQuando esses sinais aparecem, é importante pausar o treino e procurar avaliação médica antes de retomar, pois continuar exercitando sobre uma lesão pode agravá-la e prolongar a recuperação.",
  cta: true,
},
```

### Qual é a diferença entre noites mal dormidas ocasionais e insônia que precisa de investigação médica?
_Por que agora:_ O blog trata insônia crônica em profundidade, mas o FAQ não responde a dúvida do paciente que dorme mal há semanas e não sabe se isso justifica uma consulta.

```ts
{
  categoria: "Tratamentos",
  q: "O que é insônia crônica e quando ela deixa de ser estresse passageiro?",
  full: "Qual é a diferença entre noites mal dormidas ocasionais e insônia que precisa de investigação médica?",
  a: "Noites mal dormidas ocasionais relacionadas a estresse, viagens ou eventos são normais e tendem a melhorar naturalmente. Insônia crônica é quando dificuldade para dormir, despertar noturno ou sono não restaurador ocorre **pelo menos 3 noites por semana durante 3 meses ou mais**, impactando funcionamento diário como humor, concentração, produtividade ou saúde física.\n\nQuando a insônia persiste além de semanas, afeta sua rotina ou qualidade de vida, uma avaliação médica ajuda a investigar causas — problemas de sono, hábitos, condições de saúde — e orientar tratamento seguro e individualizado.",
  cta: true,
},
```

### O cansaço que não passa com repouso pode indicar algo que precisa de avaliação e exames?
_Por que agora:_ O blog menciona causas de cansaço, mas o FAQ não responde a pergunta prática do paciente cansado que quer saber se precisa de exames ou consulta.

```ts
{
  categoria: "Tratamentos",
  q: "Cansaço constante: quando investigar com exames?",
  full: "O cansaço que não passa com repouso pode indicar algo que precisa de avaliação e exames?",
  a: "Cansaço ocasional após noites mal dormidas ou esforço físico é esperado. Cansaço constante que persiste apesar de repouso, sono adequado ou sem motivo evidente pode indicar condições que exigem investigação — anemia, problemas na tireoide, inflamação, deficiências nutricionais ou desequilíbrios do sono.\n\nUma avaliação médica detalhada considera seu histórico, sintomas associados, hábitos e contexto clínico para decidir quais exames fazem sentido, evitando tanto investigação excessiva quanto atrasos diagnósticos.",
  cta: true,
},
```

### Por que procurar um médico clínico geral em vez de ir direto a um especialista?
_Por que agora:_ Paciente em Goiânia escolhendo entre clínica médica e especialistas não encontra resposta no FAQ que explique o valor do acompanhamento clínico contínuo.

```ts
{
  categoria: "Sobre",
  q: "Qual é a diferença entre clínica médica e especialidades como cardiologia ou ortopedia?",
  full: "Por que procurar um médico clínico geral em vez de ir direto a um especialista?",
  a: "Clínica médica é a especialidade que avalia o paciente de forma **integral e contínua**, considerando todo o histórico, múltiplos órgãos e sistemas de uma vez. O clínico identifica problemas, investiga causas raiz, coordena cuidados e, quando necessário, encaminha para especialistas com contexto clínico já estabelecido.\n\nEspecialistas como cardiologista ou ortopedista aprofundam-se em sua área, mas avaliam o paciente de forma mais focal. Começar com clínica médica é mais seguro porque evita investigações fragmentadas, reduz risco de tratamentos desnecessários e constrói uma relação contínua de cuidado que beneficia sua saúde a longo prazo.",
},
```

---

Toda resposta publicada precisa continuar respeitando as regras de publicidade médica:
sem promessa de resultado, sem diagnóstico ou conduta, sem preço, sem superlativo, e
medicina endocanabinoide sempre como **área de atuação** — nunca como especialidade.
