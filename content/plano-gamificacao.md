# Área do aluno, níveis e recompensas — plano de retomada

Este é o ponto de retomada se a sessão do Claude Code acabar. Ele registra o
que foi pedido, o que já existe, o que falta, e as decisões que ainda dependem
do Dr. José Victor.

---

## O que foi pedido (em ordem cronológica)

1. **Botão de login e área do cliente visíveis** — hoje não existe entrada
   visível para a conta de aluno.
2. **Trechos exclusivos em artigos do blog** — partes que só quem tem conta lê,
   marcadas por ele.
3. **Conteúdo desbloqueável por metas** — recomendar o site com link de
   afiliado.
4. **Níveis de conta**, cada um com benefício próprio.
5. **Recompensas** por: divulgação, link de afiliado, curtidas, dados
   preenchidos, fidelidade em consulta.
6. **Prêmios podem chegar a cursos pagos.**
7. **Sem valor no mundo real** — pontos e níveis valem só dentro do site.
8. **Etapas para melhorar o SEO** junto com isso.

---

## O que já existe e funciona

| Peça | Onde | Estado |
|---|---|---|
| Conta de aluno (Google, sem senha) | `lib/aluno.ts` | ✅ |
| Verificação do token do Google | `lib/google-identidade.ts` | ✅ (11 casos de falsificação recusados) |
| Matrícula por curso, cifrada | `lib/aluno.ts` | ✅ |
| Três níveis de acesso a curso | `content/cursos.ts` | ✅ `livre` / `cadastro` / `pago` |
| Liberação gradual por aula | `liberaApos` | ✅ |
| Janela de lançamento gratuito | `gratuitoAte` | ✅ |
| Acesso vitalício ou por prazo | `acessoPor` | ✅ |
| Painel de matrículas | `/area-restrita` → aba Cursos | ✅ |
| Cadastro de pacientes cifrado | `lib/cadastro.ts` | ✅ |

**Já responde ao pedido 5 parcialmente:** "cursos grátis sem login" é
`acesso: "livre"`, e "grátis mediante login" é `acesso: "cadastro"`. Os dois
existem hoje; falta só criar os cursos.

---

## O que falta construir, na ordem que faz sentido

### Etapa 1 — Tornar a conta visível *(nada depende de decisão)*

Hoje a conta só aparece quando alguém tenta abrir uma aula fechada. Falta:

- **Botão "Entrar" no cabeçalho**, virando avatar/nome quando logado.
- **`/minha-conta`** — página do aluno: cursos em que está matriculado,
  progresso, e o botão de sair.
- `GET /api/aluno` devolvendo quem está logado (hoje só há POST e DELETE).

Sem esta etapa nenhuma das seguintes faz sentido: não adianta dar pontos a
quem não tem onde vê-los.

### Etapa 2 — Trechos exclusivos no blog

Um componente `<SoParaAlunos>` usado dentro do MDX:

```mdx
<SoParaAlunos>
Este trecho só aparece para quem entrou com a conta.
</SoParaAlunos>
```

**Cuidado de SEO, e ele é sério.** O Google precisa ver o mesmo conteúdo que a
pessoa vê. Esconder texto do visitante e mostrá-lo ao rastreador é
*cloaking* — penalidade de indexação, não advertência.

O caminho correto é o `paywalledContent` do schema.org: o trecho fica marcado
como restrito nos dados estruturados, e o Google entende que é conteúdo
fechado legítimo. É o mesmo mecanismo que jornais usam.

**Regra que não pode ser quebrada:** nada de conteúdo clínico essencial atrás
da conta. Orientação de saúde que a pessoa precisa não pode custar cadastro —
isso é problema de ética médica, não de produto. O exclusivo deve ser
aprofundamento, material de apoio, exemplos.

### Etapa 3 — Pontos e níveis

**Modelo de dados** (Redis, chave própria, cifrada como o resto):

```
pontos:<hash-do-email> → { total, historico[], nivel }
```

**Como ganhar pontos** — cada uma com sua dificuldade:

| Ação | Verificável pelo site? | Observação |
|---|---|---|
| Completar o cadastro | ✅ sim | uma vez só |
| Assistir a uma aula | ✅ sim | precisa registrar progresso |
| Concluir um curso | ✅ sim | |
| Indicar alguém que se cadastra | ✅ sim | link de afiliado, abaixo |
| Curtir/compartilhar no Instagram | ❌ **não** | ver ressalva |
| Fidelidade em consulta | ❌ não pelo site | só você pode confirmar, no painel |

> **A ressalva das curtidas.** O site não tem como saber se alguém curtiu um
> post no Instagram — a API do Meta não expõe isso. As opções honestas são:
> (a) botão "compartilhei" que dá ponto na confiança, com teto baixo; ou
> (b) você confirma no painel. Prometer verificação que não existe é o tipo de
> coisa que quebra a confiança na primeira vez que alguém percebe.

**Link de afiliado**, que é o pedido central:

- cada aluno ganha um código curto (`/r/AB12CD`);
- quem chega por ele recebe um cookie de 30 dias;
- se essa pessoa se cadastrar, o indicador ganha pontos;
- **anti-fraude é obrigatório**: um cadastro por e-mail, teto diário de
  indicações, e nada de auto-indicação. Sem isso, alguém cria 40 contas numa
  tarde e leva o curso pago de graça.

**Níveis** — sugestão inicial, ajustável:

| Nível | Como chega | Benefício |
|---|---|---|
| Visitante | sem conta | conteúdo livre |
| Cadastrado | cadastro completo | trechos exclusivos, cursos `cadastro` |
| Bronze | 1ª indicação ou 1º curso concluído | material de apoio extra |
| Prata | 3 indicações | um curso pago à escolha |
| Ouro | 10 indicações | acesso a todos os cursos pagos |

### Etapa 4 — Recompensas que são cursos pagos

Tecnicamente já é possível: recompensa = criar uma matrícula com
`origem: "recompensa"`. O campo `origem` já existe em `lib/aluno.ts` e só
precisa do valor novo.

**O ponto de atenção é contábil, não técnico.** Curso dado como prêmio ainda é
receita reconhecida em algumas leituras fiscais, e "sem valor no mundo real"
protege contra ser tratado como moeda — mas não contra ser tratado como
desconto. **Pergunte ao contador antes de ligar isto.**

### Etapa 5 — SEO junto com a gamificação

O risco: área logada e conteúdo fechado tendem a **derrubar** SEO se feitos sem
cuidado. As etapas que somam, em ordem de retorno:

1. `paywalledContent` no schema dos trechos exclusivos — evita a penalidade de
   cloaking e ainda sinaliza conteúdo de valor.
2. `/minha-conta` e `/r/*` com `noindex` — são páginas de sessão, não conteúdo.
3. Uma **página pública por curso**, sempre indexável, mesmo quando o curso é
   pago: é ela que traz gente da busca. Já existe.
4. Conteúdo aberto continua sendo a maior parte. Fechar demais é a forma mais
   rápida de perder tráfego orgânico.
5. `Course` e `VideoObject` já implementados — falta só publicar cursos para
   eles valerem.
6. Depois: FAQ por curso (`FAQPage`), e artigos de cauda longa ligando blog →
   curso.

---

## Decisões que dependem do Dr. José Victor

1. **Curtidas e compartilhamentos**: botão na confiança, ou confirmação sua no
   painel? (Não há terceira opção verificável.)
2. **Fidelidade em consulta**: como registrar? O site não sabe quem consultou —
   teria de ser você marcando no painel.
3. **A tabela de níveis** acima é sugestão. Quantas indicações valem um curso
   pago?
4. **Contador**: curso dado como prêmio, como declarar?

---

## Pendências anteriores, ainda abertas

Do `content/plano-cursos.md` e das conversas:

- [ ] `SESSAO_CHAVE` na Vercel — **sem ela ninguém entra como aluno**
- [ ] Conferir origem `https://drjosevictor.com` no cliente OAuth do Google
- [ ] Primeiro vídeo no YouTube (não listado) → me mandar ID, título, duração e
      **data** (a data é obrigatória para o vídeo aparecer no Google)
- [ ] Escolher hospedagem de vídeo pago (Bunny Stream ou Panda Video)
- [ ] Falar com o contador **antes** de anunciar preço (CNAE de ensino, nota
      fiscal, ISS)
- [ ] Rotacionar o token do Upstash
- [ ] `NEXT_PUBLIC_VAPID_PUBLIC_KEY` na Vercel (bloco de avisos não aparece sem
      ela)
- [ ] Resend: domínio verificado + `RESEND_API_KEY` + `AVISOS_CHAVE`

## Pedido registrado e ainda não construído

- **PDF de dicas de treino e alimentação** na página de medicina esportiva,
  liberado mediante cadastro gratuito. *Ressalva:* o material precisa ser
  educativo e genérico, sem prescrição individual, com os avisos de sempre —
  plano de treino ou dieta personalizada por PDF é conduta sem avaliação.
