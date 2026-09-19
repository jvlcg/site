# Oportunidades para o FAQ — 2026-09-19

Relatório gerado automaticamente por `scripts/faq-oportunidades.mjs`. **Nada aqui está no ar.**
Para publicar uma pergunta, copie o bloco correspondente para `lib/chat-faq.ts`.
Perguntas com `soPagina: true` aparecem só na página do FAQ; sem esse campo, aparecem também no chat.

Situação atual: **39 perguntas** no site (26 também no chat), **55 artigos** publicados.

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
- **Canabidiol interage com remédio? Entenda os riscos** (`canabidiol-interage-com-remedio`) — sem cobertura para: sonolência
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
- **Quanto tempo o canabidiol faz efeito no corpo?** (`quanto-tempo-canabidiol-faz-efeito`) — sem cobertura para: sonolência
- **Sintomas de overtraining que pedem atenção** (`sintomas-de-overtraining`) — sem cobertura para: exercício, performance
- **Sintomas de resistência à insulina: o que observar** (`sintomas-de-resistencia-a-insulina`) — sem cobertura para: sonolência, exercício

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

### Canabidiol interfere com meus medicamentos atuais? Como saber se há risco de interação?
_Por que agora:_ Paciente toma medicamentos e tem receio de interações, mas o FAQ não responde especificamente sobre risco real e como o consultório verifica segurança.

```ts
{
  categoria: "Tratamentos",
  q: "Canabidiol interfere com meus medicamentos atuais?",
  full: "Canabidiol interfere com meus medicamentos atuais? Como saber se há risco de interação?",
  a: "O canabidiol pode interagir com diversos medicamentos, principalmente aqueles metabolizados pelo fígado (como anticoagulantes, antiarrítmicos e alguns antidepressivos). A avaliação médica revisa sua lista de medicamentos e identifica possíveis riscos antes de iniciar qualquer tratamento com canabinoides.\n\nPor isso é importante trazer todos os medicamentos que você usa na primeira consulta — prescritos, controlados ou não. Essa informação permite ao médico orientar o acompanhamento seguro e ajustar doses ou timing de administração se necessário.",
  cta: true,
},
```

### Quais exames o médico pode solicitar antes de prescrever canabidiol? Preciso fazer algo antes da primeira consulta?
_Por que agora:_ Blog cita avaliação clínica e segurança, mas FAQ não esclarece quais exames podem ser necessários antes de iniciar tratamento com canabinoides.

```ts
{
  categoria: "Tratamentos",
  q: "Preciso de exames antes de começar a usar canabidiol?",
  full: "Quais exames o médico pode solicitar antes de prescrever canabidiol? Preciso fazer algo antes da primeira consulta?",
  a: "Dependendo do seu histórico clínico, sintomas e medicamentos atuais, o médico pode indicar exames como função hepática (transaminases), função renal e hemograma para estabelecer uma base segura antes do tratamento. Esses exames ajudam a personalizar a prescrição e o acompanhamento.\n\nNa maioria dos casos, você não precisa fazer exames antes de agendar — a avaliação clínica inicial define quais investigações são necessárias. Traga seus últimos resultados de exames se os tiver, pois isso acelera o processo.",
  cta: true,
},
```

### Qual é o horário de funcionamento do consultório? Vocês atendem aos sábados ou feriados?
_Por que agora:_ Pacientes sempre perguntam horários antes de agendar; FAQ menciona agendamento mas não esclarece o funcionamento da clínica.

```ts
{
  categoria: "Consultório",
  q: "Qual é o horário de atendimento e funciona nos fins de semana?",
  full: "Qual é o horário de funcionamento do consultório? Vocês atendem aos sábados ou feriados?",
  a: "Os horários de atendimento e disponibilidade nos fins de semana são informados diretamente no agendamento, quando você entra em contato pelo WhatsApp ou telefone. A equipe confirma os períodos disponíveis e encontra o melhor slot para sua consulta presencial ou telemedicina.\n\nPara agendar, use os canais de contato disponíveis no site ou entre em contato diretamente — eles informarão todos os horários e opções de data.",
  cta: true,
},
```

### Qual é a experiência do Dr. José Victor em telemedicina e medicina esportiva? Há quanto tempo ele trabalha nessas áreas?
_Por que agora:_ Pacientes buscam validar expertise antes de agendar; FAQ cita 'Quem é o Dr. José Victor' mas não detalha trajetória em áreas específicas como telemedicina e medicina esportiva.

```ts
{
  categoria: "Sobre",
  q: "O Dr. José Victor atua há quanto tempo com telemedicina e medicina esportiva?",
  full: "Qual é a experiência do Dr. José Victor em telemedicina e medicina esportiva? Há quanto tempo ele trabalha nessas áreas?",
  a: "A trajetória profissional, formação continuada e experiência clínica do Dr. José Victor em telemedicina, medicina esportiva e outras áreas de atuação estão detalhadas no currículo e biografia disponíveis no site. Esses dados permitem que você conheça a base de experiência que sustenta o atendimento.\n\nPara informações mais específicas sobre tempo de atuação, especialização ou treinamento em uma área de seu interesse, você pode solicitar durante o agendamento ou na primeira consulta.",
  cta: true,
},
```

### Consigo fazer avaliação telemédica se tenho dor no joelho, dor na coluna ou outra lesão muscular? Quando preciso ir presencialmente?
_Por que agora:_ Blog trata extensamente de dor e lesão; telemedicina está no FAQ, mas a intersecção (telemedicina para dor/lesão) não é clara para pacientes que hesitam em agendar online.

```ts
{
  categoria: "Telemedicina",
  q: "A telemedicina funciona para avaliação de lesão ou dor muscular?",
  full: "Consigo fazer avaliação telemédica se tenho dor no joelho, dor na coluna ou outra lesão muscular? Quando preciso ir presencialmente?",
  a: "A telemedicina permite avaliação inicial, histórico clínico detalhado e orientação sobre sinais de alerta em casos de dor e lesão. O médico pode solicitar descrição dos sintomas, movimento, duração e fatores que pioram ou aliviam. Porém, alguns casos exigem palpação, testes de movimento ou exame físico mais completo, e nesses o agendamento presencial é mais seguro.\n\nDurante a teleconsulta, o médico avalia se você precisa de consulta presencial para diagnóstico mais preciso ou encaminhamentos complementares. A decisão é feita conforme o quadro clínico, garantindo que você receba o nível certo de investigação.",
  cta: true,
},
```

---

Toda resposta publicada precisa continuar respeitando as regras de publicidade médica:
sem promessa de resultado, sem diagnóstico ou conduta, sem preço, sem superlativo, e
medicina endocanabinoide sempre como **área de atuação** — nunca como especialidade.
