import Link from "next/link";
import { LogoMark } from "./Logo";
import { navLinks, site, whatsappLink } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="relative mt-28 border-t hairline">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark className="h-10 w-10 text-[var(--fg)]" />
              <div className="leading-tight">
                <p className="font-display font-semibold">{site.name}</p>
                <p className="text-sm text-faint">{site.crm} · Médico</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              Clínica médica, medicina endocanabinoide e medicina esportiva com base em
              evidências científicas. Atendimento presencial em Goiânia-GO e por
              telemedicina para todo o Brasil.
            </p>
            <a
              href={whatsappLink("particular")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost mt-6 text-sm"
            >
              Agendar consulta particular
            </a>
            <p className="mt-3 text-xs text-faint">
              Atende por convênio?{" "}
              <a
                href={whatsappLink("planos")}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors hover:text-[var(--accent)]"
              >
                Fale com a secretaria
              </a>
            </p>
          </div>

          <nav aria-label="Mapa do site" className="text-sm">
            <p className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.18em] text-faint">
              Navegação
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-muted transition-colors hover:text-[var(--accent)]">
                  Início
                </Link>
              </li>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted transition-colors hover:text-[var(--accent)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {/* fora de `navLinks` de propósito: o cadastro não entra no menu
                  do topo, só aqui e no atalho flutuante */}
              <li className="pt-1">
                <Link
                  href="/cadastro"
                  className="font-medium text-[var(--accent)] transition-opacity hover:opacity-75"
                >
                  Cadastro de pacientes →
                </Link>
              </li>
              {/* Também fora de `navLinks`: os poemas são escrita pessoal e não
                  disputam espaço com o menu do consultório. Aqui embaixo a
                  página fica alcançável — e uma página que ninguém alcança é
                  meia página. */}
              <li>
                <Link
                  href="/poemas"
                  className="text-faint transition-colors hover:text-[var(--accent)]"
                >
                  Poemas
                </Link>
              </li>
              {/* Mesmo motivo: catálogo pessoal, alcançável sem ocupar o menu. */}
              <li>
                <Link
                  href="/aplicativos"
                  className="text-faint transition-colors hover:text-[var(--accent)]"
                >
                  Aplicativos
                </Link>
              </li>
              {/*
                Faltava, e a falta era grave: a página existia, estava no
                sitemap e no mapa do site, e **não era alcançável navegando**.
                Página que só o Google acha é meia página — foi exatamente o
                que aconteceu antes com os Poemas, e eu repeti.
              */}
              <li>
                <Link
                  href="/voluntariado"
                  className="text-faint transition-colors hover:text-[var(--accent)]"
                >
                  Projetos voluntários
                </Link>
              </li>
            </ul>
          </nav>

          <div className="text-sm">
            <p className="mb-4 font-display text-xs font-semibold uppercase tracking-[0.18em] text-faint">
              Consultório
            </p>
            <address className="space-y-2.5 not-italic text-muted">
              <p>
                {site.address.clinic}
                <br />
                {site.address.street}
                <br />
                {site.address.city} – {site.address.state}, CEP {site.address.zip}
              </p>
              <p>
                <a
                  href={site.address.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[var(--accent)]"
                >
                  Ver no mapa ↗
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-[var(--accent)]"
                >
                  {site.email}
                </a>
              </p>
            </address>
            <p className="mt-5 space-x-3 text-xs text-faint">
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-[var(--accent)]"
              >
                Instagram {site.instagramHandle}
              </a>
              <a
                href={site.sameAs[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-[var(--accent)]"
              >
                Lattes
              </a>
              <a
                href={site.sameAs[1]}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-[var(--accent)]"
              >
                ORCID
              </a>
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t hairline pt-8 text-xs leading-relaxed text-faint md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl space-y-2">
            <p>
              {site.name} — {site.crm}. Graduado em Medicina pela Pontifícia Universidade
              Católica de Goiás.
            </p>
            <p>
              As áreas citadas neste site (clínica médica, medicina endocanabinoide e
              medicina esportiva) referem-se a <strong>campos de atuação clínica</strong>,
              não a títulos de especialista. Atendimento realizado por médico devidamente
              inscrito no Conselho Regional de Medicina do Estado de Goiás.
            </p>
            <p>
              As informações deste site têm caráter educativo e não substituem a consulta
              médica. Nenhum conteúdo constitui promessa de resultado. Publicidade em
              conformidade com a Resolução CFM nº 2.336/2023.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 md:items-end">
            <Link href="/mapa-do-site" className="hover:text-[var(--accent)]">
              Mapa do site
            </Link>
            <Link href="/politica-de-privacidade" className="hover:text-[var(--accent)]">
              Política de Privacidade
            </Link>
            <p>© {new Date().getFullYear()} {site.shortName}. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
