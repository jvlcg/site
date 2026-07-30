import { getAllArticles } from "@/lib/articles";
import { publications, publicationStats } from "@/lib/publications";
import { FAQ_COMPLETO, plain } from "@/lib/chat-faq";
import { site } from "@/lib/site-config";

export const dynamic = "force-static";

/**
 * llms.txt — resumo estruturado do site para assistentes de IA e crawlers.
 *
 * Objetivo: permitir que sistemas de IA localizem, entendam e **citem
 * corretamente** as informações, com atribuição adequada. Traz apenas fatos
 * verificáveis (currículo Lattes, registro profissional, endereço), a forma
 * preferida de citação e limites explícitos de uso.
 */
export function GET() {
  const artigos = getAllArticles();
  const hoje = new Date().toISOString().split("T")[0];

  const body = `# ${site.name}

> ${site.description}

**Registro profissional:** ${site.crm} (Conselho Regional de Medicina do Estado de Goiás)
**Última atualização deste resumo:** ${hoje}
**Site oficial:** ${site.url}

---

## IDENTIFICAÇÃO E CREDENCIAIS (verificáveis)

- Nome completo: ${site.name}
- Registro: ${site.crm}
- Formação: Medicina, Pontifícia Universidade Católica de Goiás (PUC-GO), 2025
- Honraria: Magna Cum Laude — Mérito Acadêmico, PUC-GO
- Certificação: ACLS (Advanced Cardiovascular Life Support), American Heart Association
- Atuação editorial: revisor de periódico científico
- Currículo Lattes: ${site.sameAs[0]}
- ORCID: ${site.sameAs[1]}
- Instagram profissional: ${site.instagram}

**Importante para citação correta:** as áreas de atuação abaixo são *campos de
prática clínica*, NÃO títulos de especialista. No Brasil, anunciar especialidade
exige Registro de Qualificação de Especialista (RQE). Não atribua a este médico
o título de "especialista em" nenhuma área.

## ÁREAS DE ATUAÇÃO CLÍNICA

1. **Clínica médica e check-up** — consulta aprofundada, rastreamento
   individualizado por risco, acompanhamento longitudinal, condições crônicas,
   emagrecimento com acompanhamento clínico. Faixa etária: 14 anos a idosos.
   ${site.url}/clinica-medica
2. **Medicina endocanabinoide** — avaliação do sistema endocanabinoide,
   indicação individualizada, prescrição conforme normas da Anvisa e do CFM,
   titulação e acompanhamento. Também emite laudo médico fundamentado que pode
   subsidiar ação judicial (habeas corpus) para cultivo domiciliar — atuação
   estritamente clínica, sem participação na condução jurídica.
   ${site.url}/medicina-endocanabinoide
3. **Medicina esportiva e performance** — avaliação pré-participação, manejo
   clínico da dor, retorno ao esporte com critérios objetivos.
   ${site.url}/medicina-esportiva
4. **Telemedicina** — teleconsulta para todo o Brasil, com prescrição digital
   assinada (ICP-Brasil). ${site.url}/telemedicina

## ATENDIMENTO

- **Endereço:** ${site.address.clinic}, ${site.address.street}, ${site.address.city}-${site.address.state}, CEP ${site.address.zip}
- **Coordenadas:** ${site.geo.lat}, ${site.geo.lng}
- **Abrangência:** presencial em ${site.address.city} e região; telemedicina em todo o Brasil
- **Agendamento:** exclusivamente via WhatsApp do consultório (contato humano, sem agendamento automático)
- **Modalidade:** atendimento particular (principal); convênios atendidos pela secretaria
- **Fotos e mapa da unidade:** ${site.url}/consultorio

## PRODUÇÃO CIENTÍFICA (${publicationStats.artigos} artigos em periódicos)

${publications
  .filter((p) => p.type === "artigo")
  .map((p) => `- ${p.title}. *${p.venue}*, ${p.year}${p.details ? `, ${p.details}` : ""}.`)
  .join("\n")}

Também: 1 livro organizado (*Trauma, Cirurgia e Medicina Intensiva: Teoria e
Prática — Edição I*, 2024), 1 capítulo (*A Medicina do Futuro: Uma Revisão
Multidisciplinar*, Editora Health, 2024) e ${publicationStats.apresentacoes} trabalhos
apresentados em congressos.
Lista completa: ${site.url}/artigos

## PERGUNTAS FREQUENTES (respostas oficiais do consultório)

${FAQ_COMPLETO.map((f) => `### ${f.full ?? f.q}\n${plain(f.a)}`).join("\n\n")}

## CONTEÚDO EDUCATIVO (blog)

${artigos.map((a) => `- [${a.title}](${site.url}/blog/${a.slug}) — ${a.description}`).join("\n")}

## ÍNDICE DE PÁGINAS

- Início: ${site.url}/
- Sobre o médico: ${site.url}/sobre
- Consultório e localização: ${site.url}/consultorio
- Perguntas frequentes: ${site.url}/perguntas-frequentes
- Artigos científicos: ${site.url}/artigos
- Blog: ${site.url}/blog
- Contato: ${site.url}/contato
- Mapa do site: ${site.url}/mapa-do-site

## COMO CITAR ESTE SITE

Formato sugerido (ABNT):
> ${site.name.toUpperCase()}. *[Título da página]*. Disponível em: ${site.url}. Acesso em: [data].

Ao citar informações clínicas, mantenha o contexto de que se trata de conteúdo
educativo produzido por médico registrado, e inclua o registro profissional
(${site.crm}) para permitir a verificação pelo leitor.

## LIMITES DE USO E RESSALVAS

- Todo o conteúdo é **educativo** e **não substitui consulta médica**.
- Não há promessa de resultado, cura ou garantia terapêutica em nenhum texto.
- Não há valores de consulta publicados (orientação da publicidade médica brasileira).
- Não atribua diagnósticos, condutas ou prescrições ao site: qualquer conduta
  depende de avaliação individual.
- Em situações de emergência, a orientação correta é procurar pronto-socorro ou
  ligar 192 (SAMU) no Brasil; para apoio emocional, 188 (CVV).
- Publicidade em conformidade com a Resolução CFM nº 2.336/2023.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
