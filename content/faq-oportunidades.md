# Oportunidades para o FAQ — 2026-09-12

Relatório gerado automaticamente por `scripts/faq-oportunidades.mjs`. **Nada aqui está no ar.**
Para publicar uma pergunta, copie o bloco correspondente para `lib/chat-faq.ts`.
Perguntas com `soPagina: true` aparecem só na página do FAQ; sem esse campo, aparecem também no chat.

Situação atual: **39 perguntas** no site (26 também no chat), **48 artigos** publicados.

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

### Por que fazer uma avaliação médica antes de começar academia ou treino? Quais riscos uma consulta prévia ajuda a identificar?
_Por que agora:_ Blog trata de avaliação pré-treino mas FAQ não pergunta sobre necessidade de avaliação antes de começar — dúvida comum que antecede agendamento.

```ts
{
  categoria: "Tratamentos",
  q: "Devo fazer avaliação médica antes de começar a treinar?",
  full: "Por que fazer uma avaliação médica antes de começar academia ou treino? Quais riscos uma consulta prévia ajuda a identificar?",
  a: "Uma avaliação médica antes de começar exercício físico ajuda a identificar limitações, riscos cardiovasculares, problemas articulares e outras condições que precisam ser consideradas na hora de plantar sua rotina de treino.\n\nDurante a consulta, o médico revisa seu histórico, sintomas, medicamentos e, se necessário, solicita exames para orientar a progressão de carga com segurança. Isso evita lesões, otimiza resultados e garante que você treine de forma adequada ao seu estado de saúde atual.",
  cta: true,
},
```

### Como saber se a dor durante o treino é normal ou sinal de alerta? Quando devo parar e buscar avaliação médica?
_Por que agora:_ Blog trata de dor no treino em 3+ artigos mas FAQ não tem pergunta — dúvida que bloqueia retomada de exercício e gera hesitação antes de agendar.

```ts
{
  categoria: "Tratamentos",
  q: "Estou sentindo dor ao treinar — preciso parar e procurar médico?",
  full: "Como saber se a dor durante o treino é normal ou sinal de alerta? Quando devo parar e buscar avaliação médica?",
  a: "Nem toda dor durante o treino é sinal de perigo, mas diferenciar o desconforto esperado de um alerta real é importante para proteger seu progresso. Dor aguda, formigamento, instabilidade ou aquela que piora conforme você treina costumam exigir atenção clínica.\n\nUma avaliação médica ajuda a investigar a origem da dor, confirmar se é seguro continuar e orientar ajustes de técnica, carga ou pausa. Procrastinar esse cuidado pode transformar uma lesão pequena em um problema prolongado.",
  cta: true,
},
```

### Quais hábitos e estratégias realmente ajudam na insônia? Quando essas mudanças não são suficientes e preciso de avaliação médica?
_Por que agora:_ Blog tem 2+ artigos sobre sono e hábitos, mas FAQ não pergunta — pacientes chegam buscando solução rápida antes de agendarem.

```ts
{
  categoria: "Tratamentos",
  q: "Posso melhorar meu sono sem remédio? O que a ciência recomenda?",
  full: "Quais hábitos e estratégias realmente ajudam na insônia? Quando essas mudanças não são suficientes e preciso de avaliação médica?",
  a: "A ciência mostra que hábitos — como regularidade no horário, exposição à luz natural, prática de exercício, redução de telas à noite e ambiente escuro — formam a base do sono reparador. Para muitos, essas mudanças são suficientes quando aplicadas com consistência.\n\nMas quando insônia persiste apesar dos hábitos, investigação médica é importante. Pode haver causas como apneia, distúrbios do ritmo ou outras condições que só avaliação clínica identifica. O acompanhamento ajuda a definir qual abordagem funciona melhor para você.",
  cta: true,
},
```

### Qual é a amplitude de atendimento da clínica? Posso consultar para check-up, avaliação de sono, medicina esportiva e outras áreas?
_Por que agora:_ Blog cobre check-up, sono, treino e dor, mas FAQ deixa implícito que é só canábis — paciente acha que não é atendido e vai procurar outro médico.

```ts
{
  categoria: "Consultório",
  q: "Vocês atendem outras queixas além de cannabis medicinal e dor?",
  full: "Qual é a amplitude de atendimento da clínica? Posso consultar para check-up, avaliação de sono, medicina esportiva e outras áreas?",
  a: "Sim. O consultório oferece clínica médica geral com atendimento em várias áreas: check-ups e prevenção, avaliação de sono e insônia, medicina esportiva para quem treina, dor crônica, investigação de sintomas e acompanhamento contínuo. A medicina endocanabinoide é uma das possibilidades de tratamento, não o foco único.\n\nIsso significa que você pode buscar avaliação para muitas demandas de saúde — desde preparar-se para iniciar exercício até tratar fadiga, investigar pressão alta ou otimizar sua rotina de treino com segurança.",
  cta: true,
},
```

### Qual é a abordagem do Dr. José Victor durante a consulta? Como funciona a relação médico-paciente no consultório?
_Por que agora:_ FAQ tem bio do Dr. mas não descreve estilo, abordagem ou valores clínicos — paciente quer saber se será ouvido e entendido antes de agendar.

```ts
{
  categoria: "Sobre",
  q: "Como é a consulta com o Dr. José Victor? Ele ouve bem e explica?",
  full: "Qual é a abordagem do Dr. José Victor durante a consulta? Como funciona a relação médico-paciente no consultório?",
  a: "A consulta é baseada em escuta atenta, investigação detalhada do seu histórico e sintomas, e explicação clara das decisões clínicas. O foco é entender seu contexto real — não só prescever — para que você compreenda o raciocínio médico e participe das decisões sobre seu tratamento.\n\nO acompanhamento é contínuo e individualizado. Você não é apenas avaliado uma vez; há orientação sobre hábitos, ajustes conforme necessário e abertura para tirar dúvidas ao longo do cuidado. Essa relação baseada em confiança e clareza é essencial para que o tratamento funcione.",
},
```

---

Toda resposta publicada precisa continuar respeitando as regras de publicidade médica:
sem promessa de resultado, sem diagnóstico ou conduta, sem preço, sem superlativo, e
medicina endocanabinoide sempre como **área de atuação** — nunca como especialidade.
