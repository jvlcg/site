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
            A navegação pelo site <strong>não exige cadastro e não coleta dados de saúde</strong>.
            Ao clicar em “Agendar pelo WhatsApp”, você é direcionado ao aplicativo
            WhatsApp, regido pela política de privacidade da própria plataforma. Dados
            clínicos compartilhados no atendimento são registrados em prontuário médico,
            protegido por sigilo profissional.
          </p>
          <p>
            Há duas funções opcionais que recebem dados seus, e as duas só funcionam se você
            escolher usá-las: os <strong>avisos de conteúdo novo</strong> (seção 4) e o{" "}
            <strong>cadastro de pacientes</strong> (seção 5).
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

          <h2>4. Avisos de conteúdo novo (notificações)</h2>
          <p>
            Nas páginas do blog existe a opção de <strong>receber um aviso quando sair
            conteúdo novo</strong>. Ela é sempre opcional e só é ativada se você tocar no
            botão e autorizar no seu navegador — o site nunca pede essa permissão sozinho
            ao abrir uma página.
          </p>
          <p>
            Se você ativar, guardamos apenas o <strong>endereço de entrega gerado pelo seu
            navegador</strong> (um identificador do aparelho, criado pelo serviço de push
            do Google, da Apple ou da Mozilla, conforme o navegador que você usa) e as
            chaves criptográficas que permitem entregar a mensagem. <strong>Não guardamos
            nome, e-mail, telefone, endereço IP nem qualquer dado que identifique você
            pessoalmente</strong>, e esse endereço não é ligado a nenhum cadastro,
            prontuário ou atendimento.
          </p>
          <p>
            Os avisos tratam <strong>exclusivamente de conteúdo publicado no site</strong> —
            artigos novos e comunicados do consultório, como mudanças de horário.
            <strong> Nunca enviamos publicidade, oferta, promoção nem qualquer mensagem
            sobre o seu atendimento ou sua saúde.</strong> A base legal aqui é o seu
            consentimento (art. 7º, I da LGPD).
          </p>
          <p>
            Para cancelar, use o botão <em>“Não quero mais receber”</em> no mesmo bloco em
            que você ativou, ou bloqueie as notificações do site nas configurações do
            navegador. O cancelamento apaga o endereço do aparelho da nossa lista. Endereços
            que deixam de existir — quando você troca de aparelho ou limpa o navegador — são
            removidos automaticamente na primeira tentativa de entrega.
          </p>

          <h2>5. Cadastro de pacientes</h2>
          <p>
            A página <strong>Cadastro</strong> é opcional e recebe nome completo, e-mail,
            telefone, CPF, data de nascimento, cidade e como você conheceu o consultório. A
            finalidade é uma só: <strong>permitir que o consultório entre em contato com você e
            mantenha seu cadastro organizado</strong>. A base legal é o seu consentimento (art.
            7º, I da LGPD), dado no momento do envio.
          </p>
          <p>
            <strong>Os dados são gravados criptografados</strong> (AES-256-GCM). Quem tiver acesso
            ao banco — inclusive o provedor de hospedagem — vê apenas blocos ilegíveis; a chave
            fica separada dos dados. O acesso às fichas é feito por uma área protegida por senha,
            usada exclusivamente pelo Dr. José Victor.
          </p>
          <p>
            <strong>O cadastro não é atendimento médico e não substitui consulta.</strong> Não
            descreva sintomas nem envie resultados de exames por ele: dados clínicos pertencem ao
            prontuário, protegido por sigilo profissional. Os dados do cadastro não são vendidos,
            compartilhados com terceiros nem usados para publicidade.
          </p>
          <p>
            Para corrigir ou excluir seu cadastro, basta pedir por {site.email}. A exclusão é
            definitiva e feita na mesma hora.
          </p>

          <h2>6. Base legal e finalidade</h2>
          <p>
            O tratamento de dados pessoais no contexto assistencial tem como bases legais
            a tutela da saúde (art. 11, II, “f” da LGPD) e o cumprimento de obrigação
            legal ou regulatória, incluindo a guarda de prontuário conforme as normas do
            Conselho Federal de Medicina.
          </p>

          <h2>7. Seus direitos</h2>
          <p>
            Você pode solicitar confirmação de tratamento, acesso, correção e demais
            direitos previstos na LGPD pelo e-mail {site.email}. Solicitações que
            envolvam prontuário médico seguem também as normas específicas de guarda e
            acesso a documentos de saúde.
          </p>

          <h2>8. Segurança</h2>
          <p>
            Adotamos boas práticas de segurança da informação no armazenamento de
            registros clínicos e na comunicação com pacientes, incluindo canais
            criptografados e controle de acesso.
          </p>

          <h2>9. Atualizações</h2>
          <p>
            Esta política pode ser revisada para refletir mudanças legais ou operacionais.
            A versão vigente estará sempre disponível nesta página.
          </p>
        </div>
      </section>
    </>
  );
}
