# ⚠️ Revisão obrigatória dos dados factuais

Este site publica afirmações sobre formação, produção científica e registros
profissionais. **Todas precisam ser conferidas por você antes de o site ir ao ar.**

O currículo Lattes enviado é um **PDF escaneado (imagem)**, cujo texto não pôde ser
extraído durante o desenvolvimento. Portanto, os dados abaixo **não foram verificados
contra a fonte** — confirme cada um e me avise o que corrigir (ou corrija direto no
arquivo indicado).

## 1. Identificadores externos — `lib/site-config.ts`

| Dado | Valor publicado | Confere? |
| --- | --- | --- |
| Lattes | `lattes.cnpq.br/5293466472803267` | ☐ |
| ORCID | `orcid.org/0000-0003-2242-2469` | ☐ |
| CRM | CRM-GO 38508 | ☐ |
| Instagram | @dr.josevlcg | ☐ |

> Se algum link estiver errado, ele aparece no rodapé, na página Sobre e nos dados
> estruturados enviados ao Google.

## 2. Estatísticas da Home — `app/page.tsx`

| Afirmação | Confere? |
| --- | --- |
| Graduação PUC-GO **Magna Cum Laude** | ☐ |
| **6+** artigos publicados em periódicos | ☐ |
| **20+** trabalhos apresentados em congressos | ☐ |
| Certificação **ACLS** (American Heart Association) | ☐ |

## 3. Publicações listadas — `app/sobre/page.tsx`

Oito publicações são citadas com título e veículo (Revista Eletrônica Acervo em Saúde,
Studies in Health Sciences, Revista Brasileira de Ultrassonografia, Editora Health etc.).
**Confira título, veículo e ano de cada uma.** Publicação atribuída incorretamente é
falha ética grave.

☐ Conferido — todas corretas
☐ Preciso corrigir (me diga quais)

## 4. Linha do tempo — `app/sobre/page.tsx`

| Afirmação | Confere? |
| --- | --- |
| Graduação 2020–2025 na PUC Goiás | ☐ |
| Diretor acadêmico da Liga de Cirurgia do Trauma | ☐ |
| Voluntário na campanha de vacinação contra COVID-19 | ☐ |
| 2º lugar no I Fórum de Extensão de Medicina da PUC-GO | ☐ |
| Internato com estágio no Hospital Estadual Dr. Alberto Rassi (HGG) | ☐ |
| Revisor do periódico *Clinics* / formação em revisão pela Elsevier | ☐ |

## 5. Especialidade e RQE — ⚠️ ponto crítico do CFM

A Resolução CFM nº 2.336/2023 **proíbe anunciar especialidade sem Registro de
Qualificação de Especialista (RQE)**.

O site foi ajustado para tratar clínica médica, medicina endocanabinoide e medicina
esportiva como **áreas de atuação**, não como especialidades:

- removida a declaração `medicalSpecialty` dos dados estruturados;
- incluído aviso no rodapé de todas as páginas.

☐ **Se você possui RQE** em alguma especialidade, me informe o número e a
especialidade — nesse caso podemos (e devemos) exibi-los, o que fortalece o SEO e a
autoridade.

## 6. Estrutura da clínica — `lib/gallery.ts`

As fotos mostram a estrutura da Clínica Fisiogyn (incluindo equipamentos de apoio
diagnóstico). As legendas descrevem o **ambiente da clínica**, sem sugerir que os
exames sejam realizados ou oferecidos por você.

☐ Confere — ou me diga se prefere remover as fotos de equipamentos
☐ Você tem autorização da clínica para divulgar as imagens do espaço

---

Depois de conferir, me diga o que precisa mudar que eu ajusto e republico.
