import { getAllArticles } from "@/lib/articles";
import { site } from "@/lib/site-config";

export const dynamic = "force-static";

/**
 * llms.txt — resumo estruturado do site para crawlers de IA / LLMs.
 * Formato inspirado na proposta llmstxt.org.
 */
export function GET() {
  const articles = getAllArticles();

  const body = `# ${site.name}

> ${site.description}

Médico registrado sob ${site.crm}, com atuação em Clínica Médica, Medicina Endocanabinoide e Medicina Esportiva. Atendimento presencial na ${site.address.clinic} (${site.address.street}, ${site.address.city}-${site.address.state}) e por telemedicina para todo o Brasil. Formado em Medicina pela PUC Goiás (Magna Cum Laude), pesquisador com publicações em dor e intervenção guiada por imagem.

Agendamento: exclusivamente pelo WhatsApp do consultório. Contato: ${site.email}.

## Áreas de atuação
- [Medicina Endocanabinoide](${site.url}/medicina-endocanabinoide): avaliação do sistema endocanabinoide, indicação individualizada e prescrição dentro das normas da Anvisa e do CFM.
- [Clínica Médica e Check-up](${site.url}/clinica-medica): consultas aprofundadas, check-up estratégico e acompanhamento longitudinal.
- [Medicina Esportiva e Performance](${site.url}/medicina-esportiva): avaliação de quem treina, manejo de dor e retorno seguro ao esporte.
- [Telemedicina](${site.url}/telemedicina): teleconsulta com prescrição digital válida em todo o Brasil.

## Institucional
- [Sobre o médico](${site.url}/sobre): formação, trajetória de pesquisa e publicações científicas.
- [Consultório em Goiânia](${site.url}/consultorio): fotos da estrutura, localização no mapa e como chegar (${site.address.clinic}, ${site.address.street}).
- [Contato](${site.url}/contato): endereço do consultório e canais de agendamento.

## Artigos
${articles.map((a) => `- [${a.title}](${site.url}/artigos/${a.slug}): ${a.description}`).join("\n")}

## Observações
- Conteúdo educativo; não substitui consulta médica.
- Publicidade em conformidade com a Resolução CFM nº 2.336/2023.
- Perfil científico: Lattes ${site.sameAs[0]} · ORCID ${site.sameAs[1]}.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
