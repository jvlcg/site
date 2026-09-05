# Oportunidades para o FAQ — 2026-09-05

Relatório gerado automaticamente por `scripts/faq-oportunidades.mjs`. **Nada aqui está no ar.**
Para publicar uma pergunta, copie o bloco correspondente para `lib/chat-faq.ts`.
Perguntas com `soPagina: true` aparecem só na página do FAQ; sem esse campo, aparecem também no chat.

Situação atual: **39 perguntas** no site (26 também no chat), **41 artigos** publicados.

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

### Por que fazer uma avaliação médica antes de iniciar um programa de exercícios?
_Por que agora:_ Blog trata do tema, mas FAQ não oferece resposta antes do agendamento; pacientes atletas querem saber se precisam de consulta prévia.

```ts
{
  categoria: "Tratamentos",
  q: "Preciso de avaliação antes de começar a treinar?",
  full: "Por que fazer uma avaliação médica antes de iniciar um programa de exercícios?",
  a: "Uma avaliação médica antes de começar a treinar ajuda a identificar riscos à saúde, histórico de lesões, condições cardiovasculares ou articulares que possam influenciar sua segurança durante o exercício. Ela considera seu estado atual, objetivos e hábitos — sono, alimentação, estresse — para orientar um treino personalizado.\n\nDurante a consulta, o médico pode solicitar exames se necessário, revisar medicamentos que você já toma e esclarecer sinais de alerta durante o exercício. Isso protege você e acelera seu progresso com mais clareza sobre seus limites e capacidades reais.",
  cta: true,
},
```

### Como diferenciar dor normal de treino de um sinal que exige avaliação médica?
_Por que agora:_ Blog tem 4 artigos sobre dor e treino, mas FAQ não responde essa dúvida prática e frequente de atletas.

```ts
{
  categoria: "Tratamentos",
  q: "Quando devo investigar dor durante ou após treino?",
  full: "Como diferenciar dor normal de treino de um sinal que exige avaliação médica?",
  a: "Dor muscular leve após treino é esperada, mas dor aguda durante o exercício, inchaço que não passa, limitação de movimento ou dor que piora nos dias seguintes merecem avaliação médica. Também é importante investigar se a dor aparece sempre no mesmo local ou se impede você de continuar a atividade.\n\nUma avaliação clínica ajuda a diferenciar sobrecarga de lesão, orientar repouso ou ajuste do treino e evitar que o problema piore. O médico pode solicitar exames se necessário e definir quando é seguro retomar a atividade.",
  cta: true,
},
```

### Como investigar se o sono ruim pode estar prejudicando meu desempenho e saúde?
_Por que agora:_ Blog conecta sono e treino em vários artigos, mas FAQ não aborda essa preocupação prática de quem treina e dorme mal.

```ts
{
  categoria: "Tratamentos",
  q: "Insônia está afetando meu treino — por onde começo?",
  full: "Como investigar se o sono ruim pode estar prejudicando meu desempenho e saúde?",
  a: "Sono insuficiente ou de má qualidade impacta a recuperação muscular, concentração, imunidade e performance — afetando diretamente seus resultados no treino. Uma avaliação médica investiga causas como hábitos noturnos, stress, condições de saúde ou até uso de suplementos que possam estar interferindo no seu descanso.\n\nO médico pode orientar ajustes de hábito, indicar terapias comportamentais ou, se necessário, investigar condições como apneia ou distúrbios do sono. Cuidar do sono é tão importante quanto o treino para alcançar seus objetivos com segurança.",
  cta: true,
},
```

### Quando uma avaliação com canabinoides faz sentido para quem treina e tem dificuldades de sono?
_Por que agora:_ Blog trata canabinoides e sono, mas FAQ não responde essa dúvida prática de atletas e praticantes de exercício.

```ts
{
  categoria: "Tratamentos",
  q: "Posso usar canabinoides para melhorar sono ou recuperação pós-treino?",
  full: "Quando uma avaliação com canabinoides faz sentido para quem treina e tem dificuldades de sono?",
  a: "Quem pratica exercício regularmente pode apresentar dificuldades de sono ou dor pós-treino que justifiquem uma avaliação cuidadosa. O médico avalia seu histórico clínico, medications, objetivos no treino e evidências disponíveis para orientar se essa abordagem faz sentido no seu caso específico — sem promessas de resultado.\n\nToda decisão nessa área exige acompanhamento médico contínuo, monitoramento de segurança e clareza sobre limitações e riscos. A consulta individualizada é o passo essencial antes de qualquer consideração sobre canabinoides.",
  cta: true,
},
```

### Qual experiência e formação o Dr. José Victor tem em medicina esportiva, sono e canabinoides?
_Por que agora:_ FAQ responde só "quem é"; pacientes querem saber especificamente sobre experiência em esportes, sono e endocanabinoides.

```ts
{
  categoria: "Sobre",
  q: "Qual é a formação do Dr. José Victor em medicina esportiva e sono?",
  full: "Qual experiência e formação o Dr. José Victor tem em medicina esportiva, sono e canabinoides?",
  a: "O Dr. José Victor atua em clínica médica, medicina esportiva, medicina do sono e área de canabinoides com enfoque em avaliação individualizada e baseada em evidências atuais. Sua prática abrange acompanhamento de atletas, investigação de dor crônica, distúrbios do sono e condições que se beneficiam de abordagem integrativa.\n\nPara detalhes completos sobre sua formação, registros profissionais e áreas de atuação, consulte o site ou entre em contato direto. Você pode também verificar seu registro no CRM para confirmar sua qualificação e especialidades.",
},
```

---

Toda resposta publicada precisa continuar respeitando as regras de publicidade médica:
sem promessa de resultado, sem diagnóstico ou conduta, sem preço, sem superlativo, e
medicina endocanabinoide sempre como **área de atuação** — nunca como especialidade.
