import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como este site trata dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD) e o sigilo médico.",
  alternates: { canonical: "/politica-de-privacidade" },
  robots: { index: false, follow: true },
};

export default function PrivacidadePage() {
  return (
    <>
      <PageHero
        eyebrow="Transparência"
        title="Política de Privacidade"
        lede="Como este site e o consultório tratam seus dados pessoais, em conformidade com a LGPD (Lei nº 13.709/2018) e com o sigilo médico."
      />
      <section className="mx-auto max-w-3xl px-5 pb-10 sm:px-8">
        <div className="prose-medical">
          <h2>1. Quem somos</h2>
          <p>
            Este site pertence a {site.name} ({site.crm}), com atendimento presencial na{" "}
            {site.address.clinic}, {site.address.street}, {site.address.city}–
            {site.address.state}, e por telemedicina. Dúvidas sobre esta política podem
            ser enviadas para {site.email}.
          </p>

          <h2>2. Quais dados coletamos</h2>
          <p>
            O site em si não possui formulários de cadastro e não coleta dados sensíveis.
            Ao clicar em “Agendar pelo WhatsApp”, você é direcionado ao aplicativo
            WhatsApp, regido pela política de privacidade da própria plataforma. Dados
            clínicos compartilhados no atendimento são registrados em prontuário médico,
            protegido por sigilo profissional.
          </p>

          <h2>3. Cookies e medição</h2>
          <p>
            Este site utiliza apenas cookies estritamente necessários ao seu funcionamento —
            como a memória da sua preferência de tema claro ou escuro. <strong>Não há
            cookies de rastreamento, publicidade ou perfilamento.</strong>
          </p>
          <p>
            Para saber quantas pessoas visitam cada página, e para verificar se o site
            carrega rápido em aparelhos reais, usamos os serviços de medição da Vercel,
            empresa que hospeda o site. Essas medições são <strong>feitas sem cookies</strong> e
            registram apenas dados agregados: página acessada, origem do acesso, tipo de
            dispositivo, país e tempos de carregamento. Elas não identificam você, não
            acompanham sua navegação em outros sites e não constroem perfil individual.
          </p>
          <p>
            A página <strong>Novidades</strong> exibe conteúdo publicado por meio da
            plataforma Soro (<code>app.trysoro.com</code>). Ao abrir essa página específica,
            seu navegador se comunica com esse serviço, que pode registrar dados de acesso
            conforme a política de privacidade dele. Essa é a única página do site que
            carrega conteúdo de terceiros dessa forma — todas as demais funcionam apenas
            com recursos do próprio domínio.
          </p>
          <p>
            Nenhum dado de navegação é vendido ou compartilhado para fins publicitários.
          </p>

          <h2>4. Base legal e finalidade</h2>
          <p>
            O tratamento de dados pessoais no contexto assistencial tem como bases legais
            a tutela da saúde (art. 11, II, “f” da LGPD) e o cumprimento de obrigação
            legal ou regulatória, incluindo a guarda de prontuário conforme as normas do
            Conselho Federal de Medicina.
          </p>

          <h2>5. Seus direitos</h2>
          <p>
            Você pode solicitar confirmação de tratamento, acesso, correção e demais
            direitos previstos na LGPD pelo e-mail {site.email}. Solicitações que
            envolvam prontuário médico seguem também as normas específicas de guarda e
            acesso a documentos de saúde.
          </p>

          <h2>6. Segurança</h2>
          <p>
            Adotamos boas práticas de segurança da informação no armazenamento de
            registros clínicos e na comunicação com pacientes, incluindo canais
            criptografados e controle de acesso.
          </p>

          <h2>7. Atualizações</h2>
          <p>
            Esta política pode ser revisada para refletir mudanças legais ou operacionais.
            A versão vigente estará sempre disponível nesta página.
          </p>
        </div>
      </section>
    </>
  );
}
