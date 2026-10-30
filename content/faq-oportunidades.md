# Oportunidades para o FAQ — 2026-10-30

Relatório gerado automaticamente por `scripts/faq-oportunidades.mjs`. **Nada aqui está no ar.**
Para publicar uma pergunta, copie o bloco correspondente para `lib/chat-faq.ts`.
Perguntas com `soPagina: true` aparecem só na página do FAQ; sem esse campo, aparecem também no chat.

Situação atual: **39 perguntas** no site (26 também no chat), **85 artigos** publicados.

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
- **Canabidiol para fibromialgia pode ajudar?** (`canabidiol-para-fibromialgia`) — sem cobertura para: fibromialgia
- **Caso clínico de dor lombar e decisão clínica** (`caso-clinico-de-dor-lombar`) — sem cobertura para: lesão
- **Causas de cansaço constante e quando investigar** (`causas-de-cansaco-constante`) — sem cobertura para: sonolência, dormir
- **Check-up médico: o que avaliar além dos exames** (`check-up-medico-o-que-avaliar`) — sem cobertura para: exercício
- **Check-up para quem treina: o que avaliar** (`check-up-para-quem-treina`) — sem cobertura para: exercício
- **Colesterol alto: o que fazer com segurança** (`colesterol-alto-o-que-fazer`) — sem cobertura para: exercício
- **Como investigar dor persistente com segurança** (`como-investigar-dor-persistente`) — sem cobertura para: dor persistente
- **Como melhorar performance no treino com segurança** (`como-melhorar-performance-no-treino`) — sem cobertura para: performance
- **Como retomar exercícios após dor com segurança** (`como-retomar-exercicios-apos-dor`) — sem cobertura para: exercício
- **Como voltar a treinar após lesão com segurança** (`como-voltar-a-treinar-apos-lesao`) — sem cobertura para: lesão, exercício
- **Creatina faz mal ao rim? O que diz a ciência** (`creatina-faz-mal-ao-rim`) — sem cobertura para: lesão
- **Dor após treino é normal? Saiba diferenciar** (`dor-apos-treino-e-normal`) — sem cobertura para: exercício, lesão
- **Dor lombar em quem treina: é hora de investigar?** (`dor-lombar-em-quem-treina`) — sem cobertura para: exercício, lesão
- **Dor muscular após treino: quando se preocupar?** (`dor-muscular-apos-treino-quando-se-preocupar`) — sem cobertura para: lesão, exercício
- **Dor muscular versus lesão esportiva: sinais de alerta** (`dor-muscular-versus-lesao-esportiva`) — sem cobertura para: lesão, exercício
- **Dor no joelho ao correr: quando investigar?** (`dor-no-joelho-ao-correr`) — sem cobertura para: exercício, lesão
- **Dor no treino: quando é normal e quando você precisa investigar** (`dor-no-treino-quando-investigar`) — sem cobertura para: lesão, performance
- **Emagrecimento com acompanhamento médico seguro** (`emagrecimento-com-acompanhamento-medico-seguro`) — sem cobertura para: exercício
- **Quando pedir exames hormonais masculinos?** (`exames-hormonais-masculinos`) — sem cobertura para: performance
- **Guia para dor no treino sem ignorar sinais** (`guia-para-dor-no-treino`) — sem cobertura para: exercício
- **Hábitos para sono reparador que funcionam** (`habitos-para-sono-reparador`) — sem cobertura para: dormir, sonolência
- **Insônia crônica: tratamento sem remédio** (`insonia-cronica-tratamento-sem-remedio`) — sem cobertura para: dormir, sonolência
- **Medicina esportiva para treinar com segurança** (`medicina-esportiva-treinar-seguranca`) — sem cobertura para: exercício
- **Quando procurar médico do esporte em Goiânia?** (`medico-do-esporte-goiania`) — sem cobertura para: exercício, lesão
- **Quando procurar médico para dor crônica?** (`medico-para-dor-cronica`) — sem cobertura para: exercício
- **Melhores estratégias para dor crônica na prática** (`melhores-estrategias-para-dor-cronica`) — sem cobertura para: dormir
- **Melhores exames para check-up com critério** (`melhores-exames-para-check-up`) — sem cobertura para: exercício
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

### Como saber se canabidiol pode interagir com os medicamentos que já tomo? Preciso parar algo antes de começar?
_Por que agora:_ Blog trata interações entre CBD e drogas, mas FAQ não pergunta isto — dúvida comum que antecede agendamento

```ts
{
  categoria: "Tratamentos",
  q: "Canabidiol interage com meus remédios atuais?",
  full: "Como saber se canabidiol pode interagir com os medicamentos que já tomo? Preciso parar algo antes de começar?",
  a: "Canabidiol pode interagir com alguns medicamentos, especialmente aqueles metabolizados pelo fígado (como anticoagulantes, antiarrítmicos e alguns antidepressivos). Por isso, é essencial levar a lista completa dos seus remédios atuais na consulta — incluindo suplementos e fitoterápicos.\n\nA avaliação médica individualizada considera cada medicamento, sua dose e seu histórico para identificar possíveis interações e ajustar a conduta de forma segura. Nunca interrompa seus medicamentos sem orientação médica antes da consulta.",
  cta: true,
},
```

### Sofro com dor crônica há anos e já fiz vários tratamentos. Como uma consulta de clínica médica pode ajudar a identificar o que realmente funciona para mim?
_Por que agora:_ Blog trata estratégias para dor crônica mas FAQ não pergunta isto — barreira importante antes do agendamento

```ts
{
  categoria: "Tratamentos",
  q: "Tenho dor crônica e já tentei de tudo. Por onde começo?",
  full: "Sofro com dor crônica há anos e já fiz vários tratamentos. Como uma consulta de clínica médica pode ajudar a identificar o que realmente funciona para mim?",
  a: "Dor crônica exige investigação cuidadosa — nem sempre a causa é óbvia nos exames, e o que funcionou para um paciente pode não funcionar para outro. A avaliação médica revisa seu histórico completo, identifica sinais que possam ter passado despercebidos e organiza uma estratégia individualizada.\n\nIsso pode incluir ajustes nos hábitos (sono, movimento, postura), revisão de medicamentos atuais, investigação de causas raiz e, quando indicado, consideração de outras abordagens. O objetivo é entender sua dor de verdade e construir um plano que faça sentido para sua rotina e seus objetivos.",
  cta: true,
},
```

### Vou começar a frequentar academia em breve. Preciso de uma consulta médica antes de iniciar o treino? Quem deveria fazer isso?
_Por que agora:_ Blog dedica artigo a isto, mas FAQ não pergunta — dúvida comum de quem quer começar exercício com segurança

```ts
{
  categoria: "Tratamentos",
  q: "Preciso de avaliação médica antes de começar a treinar na academia?",
  full: "Vou começar a frequentar academia em breve. Preciso de uma consulta médica antes de iniciar o treino? Quem deveria fazer isso?",
  a: "Uma avaliação médica antes de começar a treinar ajuda a identificar riscos silenciosos (como alterações de pressão, frequência cardíaca irregular ou problemas articulares), revisar seu histórico e orientar o treino com segurança real. Pessoas com histórico de lesões, sobrepeso, sedentarismo prolongado, ou qualquer fator de risco cardiovascular se beneficiam especialmente.\n\nEssa consulta também permite que você chegue à academia com um plano claro: quais movimentos priorizar, quais evitar, e como progredir sem se machucar. O médico pode colaborar com seu personal trainer ou educador físico para garantir consistência nas recomendações.",
  cta: true,
},
```

### Tenho insônia há muito tempo e remédios ajudam pouco. Existe tratamento de verdade? Como funciona sem ficar dependente de medicação?
_Por que agora:_ Blog trata insônia crônica sem remédio, mas FAQ não pergunta isto — pacientes com insônia prolongada hesitam antes de agendar

```ts
{
  categoria: "Tratamentos",
  q: "Insônia crônica: por onde começo se remédio não resolve?",
  full: "Tenho insônia há muito tempo e remédios ajudam pouco. Existe tratamento de verdade? Como funciona sem ficar dependente de medicação?",
  a: "Insônia crônica pode ter múltiplas causas — desde hábitos noturnos ruins até problemas de saúde subjacentes — e a investigação médica ajuda a identificar qual é a sua. Além disso, existem abordagens comprovadas (como terapia cognitivo-comportamental para insônia) que trabalham as causas reais, não apenas os sintomas.\n\nA avaliação clínica revisa seu sono atual, seu histórico, sua rotina e seus sintomas para estruturar um plano que combine hábitos, ajustes ambientais e, quando necessário, suporte médico seguro. Muitos pacientes conseguem melhorias significativas sem criar dependência quando o tratamento é bem individualizado e acompanhado.",
  cta: true,
},
```

### Posso fazer minha primeira consulta por telemedicina ou precisa ser presencial? Em que casos a teleconsulta funciona?
_Por que agora:_ FAQ trata telemedicina genericamente, mas não responde se primeira consulta pode ser online — dúvida que bloqueia o agendamento

```ts
{
  categoria: "Agendamento",
  q: "Minha consulta vai ser presencial ou posso fazer online?",
  full: "Posso fazer minha primeira consulta por telemedicina ou precisa ser presencial? Em que casos a teleconsulta funciona?",
  a: "A primeira consulta pode ser presencial ou online dependendo do seu caso. Avaliações iniciais de insônia, ansiedade, medicina endocanabinoide e muitas outras situações funcionam bem por telemedicina. Já situações que exigem exame físico detalhado (como check-up, investigação de dor específica ou avaliação esportiva) são melhor feitas presencialmente.\n\nNo agendamento, você conversa com a equipe sobre sua situação e a melhor modalidade é definida juntos. Se começar online e depois precisar de avaliação presencial, o acompanhamento é contínuo. A receita digital de teleconsulta vale na farmácia normalmente e o sigilo é garantido.",
  cta: true,
},
```

---

Toda resposta publicada precisa continuar respeitando as regras de publicidade médica:
sem promessa de resultado, sem diagnóstico ou conduta, sem preço, sem superlativo, e
medicina endocanabinoide sempre como **área de atuação** — nunca como especialidade.
