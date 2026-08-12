import { getAllArticles } from "./articles";
import type { ItemBusca } from "./busca-comum";
import { POEMAS_COM_ANALISE } from "@/content/poemas";

import { aulasDo, cursosPublicados } from "./cursos";
import { PAGINAS_FIXAS } from "@/content/paginas";

/**
 * O índice da busca do site.
 *
 * ## Por que existe
 *
 * São setenta e sete endereços publicados e, até aqui, nenhuma forma de
 * procurar um. Quem chegava por um artigo sobre insônia e queria saber se o
 * médico atende por vídeo só tinha o menu — que lista as áreas, não os
 * assuntos. O mapa do site ajuda, mas é uma lista para ler inteira, não para
 * consultar.
 *
 * ## Por que no cliente, e não num serviço
 *
 * O índice inteiro cabe em poucos quilobytes: são títulos e resumos que já
 * estão no site. Mandá-lo junto com a página custa menos do que uma ida ao
 * servidor por tecla digitada, funciona sem depender de nada externo e não
 * conta nenhuma busca a ninguém — num site de médico, o que a pessoa procura
 * é assunto dela.
 *
 * ## O que entra
 *
 * Tudo que tem endereço próprio e conteúdo para ler. Ficam de fora as páginas
 * de conta e de fluxo (`/agendar`, `/minha-conta`, `/cancelar-avisos`): quem
 * as procura chega por um botão, não por palavra-chave, e elas poluiriam o
 * resultado de quem busca assunto.
 *
 * As funções de busca em si moram em `lib/busca-comum.ts`: este arquivo lê
 * o disco, e importá-lo de um componente de cliente levaria `node:fs` para o
 * navegador.
 */
export function indiceDeBusca(): ItemBusca[] {
  const itens: ItemBusca[] = [];

  for (const p of PAGINAS_FIXAS) {
    itens.push({
      titulo: p.label,
      url: p.href,
      resumo: p.desc,
      tipo: p.grupo,
      termos: `${p.label} ${p.desc} ${p.grupo} ${p.busca ?? ""}`,
    });
  }

  for (const a of getAllArticles()) {
    itens.push({
      titulo: a.title,
      url: `/blog/${a.slug}`,
      resumo: a.description,
      tipo: a.category,
      /*
        As perguntas do FAQ entram nos termos porque é assim que a pessoa
        escreve: ela não busca "canabidiol regulamentação", busca "quem pode
        prescrever". O texto da pergunta é a busca dela, já escrita.
      */
      termos: [a.title, a.description, a.category, ...a.tags, ...a.faq.map((f) => f.question)].join(" "),
    });
  }

  for (const p of POEMAS_COM_ANALISE) {
    /*
      O poema não tem resumo, e não faria sentido escrever um. O primeiro
      verso serve melhor: é o que a pessoa reconhece, e é como quem procura
      um poema se lembra dele.
    */
    const primeiroVerso = p.texto.split("\n").map((l) => l.trim()).find(Boolean) ?? "";

    itens.push({
      titulo: p.titulo,
      url: `/poemas/${p.slug}`,
      resumo: primeiroVerso,
      tipo: "Poema",
      termos: `${p.titulo} poema`,
      /* o texto inteiro entra na busca com peso menor — ver `corpo` */
      corpo: p.texto,
    });
  }

  for (const curso of cursosPublicados()) {
    itens.push({
      titulo: curso.titulo,
      url: `/cursos/${curso.slug}`,
      resumo: curso.resumo,
      tipo: "Curso",
      termos: `${curso.titulo} ${curso.resumo} curso aulas vídeo`,
    });

    for (const aula of aulasDo(curso)) {
      itens.push({
        titulo: aula.titulo,
        url: `/cursos/${curso.slug}/${aula.slug}`,
        resumo: aula.resumo ?? curso.titulo,
        tipo: "Aula",
        termos: `${aula.titulo} ${aula.resumo ?? ""} ${curso.titulo} aula vídeo`,
      });
    }
  }

  return itens;
}
