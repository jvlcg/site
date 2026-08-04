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
            Além dos cookies estritamente necessários ao funcionamento do site — como a
            memória da sua preferência de tema claro ou escuro —, este site utiliza
            <strong> cookies de medição de audiência</strong>, descritos abaixo.
            <strong> Não há cookies de publicidade e nenhum dado seu é usado para
            direcionar anúncios.</strong>
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
            Usamos também o <strong>Google Analytics 4</strong>, da Google. Diferente da
            medição acima, ele <strong>grava um cookie no seu navegador</strong> para
            reconhecer visitas repetidas e entender o caminho percorrido dentro do site.
            São registrados páginas acessadas, origem do acesso, tipo de dispositivo,
            localização aproximada por cidade e duração da visita. O endereço IP é
            truncado antes de ser armazenado, e os dados são tratados pela Google, que
            pode processá-los fora do Brasil. A base legal é o legítimo interesse em
            entender e melhorar o site (art. 7º, IX, da LGPD).
          </p>
          <p>
            <strong>Você pode recusar essa medição</strong> a qualquer momento, sem perder
            nenhuma funcionalidade: instale o{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
            >
              complemento de desativação do Google Analytics
            </a>{" "}
            no seu navegador, ative a opção &ldquo;Não me rastrear&rdquo; nas
            configurações dele, ou bloqueie cookies deste site. Você pode também apagar
            os cookies já gravados a qualquer momento.
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
          <p>
            No formulário há ainda uma caixa <strong>separada e opcional</strong>, que começa
            desmarcada: receber por e-mail um aviso quando sair artigo novo ou comunicado do
            consultório. Marcar essa caixa é um consentimento próprio, distinto do cadastro —
            você pode se cadastrar sem recebê-los, e pode sair da lista sem perder o cadastro.
          </p>
          <p>
            Quem marca entra numa <strong>lista à parte</strong>, guardada separadamente dos
            dados do cadastro e cifrada com uma chave diferente. Nessa lista ficam apenas o
            e-mail e o primeiro nome — nunca CPF, data de nascimento ou telefone. A separação é
            proposital: o sistema que dispara os avisos nunca precisa ter acesso aos seus dados
            clínicos ou de identificação.
          </p>
          <p>
            <strong>Todo e-mail traz um link para sair da lista</strong>, além do botão de
            cancelamento que o próprio Gmail e o Outlook exibem. O cancelamento é imediato e não
            afeta seu cadastro nem seu atendimento. Esses avisos tratam apenas de conteúdo
            publicado: <strong>nunca são propaganda e nunca falam do seu caso</strong>.
          </p>

          <h3>Preencher com a conta do Google</h3>
          <p>
            No topo do formulário existe um botão opcional,{" "}
            <strong>“Continuar com Google”</strong>. Ele preenche apenas{" "}
            <strong>nome e e-mail</strong>, e serve para confirmar que o endereço
            informado realmente existe e é seu. Nenhuma conta é criada neste site, não
            há login de paciente, e o consultório <strong>não recebe acesso nenhum</strong>{" "}
            à sua conta do Google — nem e-mails, nem agenda, nem contatos.
          </p>
          <p>
            <strong>Usar esse botão é uma escolha, e ela tem uma consequência que você
            precisa conhecer antes.</strong> Ao tocar nele, o Google passa a saber que
            você se cadastrou neste site, que é de um consultório médico. Esse é um dado
            que permite inferência sobre saúde, e a LGPD o trata como{" "}
            <strong>dado sensível</strong> (art. 5º, II). Por isso o aviso aparece na
            própria tela, antes do botão, e não em letra miúda depois.
          </p>
          <p>
            Enquanto você não tocar nesse botão,{" "}
            <strong>nada do Google é carregado nesta página</strong>: nenhum script,
            nenhuma requisição, nenhum cookie. Quem preenche os campos à mão não é
            informado ao Google de forma alguma, e o cadastro resultante é exatamente o
            mesmo — nenhuma vantagem de atendimento depende de usar o botão.
          </p>
          <p>
            O que o site guarda dessa verificação é apenas uma marca de que o e-mail foi
            confirmado. <strong>Não guardamos identificador de conta do Google, foto de
            perfil nem qualquer token de acesso.</strong>
          </p>

          <h2>6. Conta de aluno dos cursos</h2>
          <p>
            Para assistir a cursos que exigem conta, o site guarda apenas{" "}
            <strong>nome e e-mail</strong>, mais a data em que o acesso foi
            liberado e a qual curso ele se refere. Não guardamos senha — a
            identificação é feita pela sua conta do Google, e o site nunca vê
            nem armazena a sua senha dela.
          </p>
          <p>
            <strong>
              A conta de aluno é separada do cadastro de paciente, e não dá
              acesso a nenhum dado clínico.
            </strong>{" "}
            São registros diferentes, guardados com chaves diferentes e
            alcançados por sessões diferentes: entrar como aluno não abre, nem
            por engano, a ficha de paciente de ninguém — inclusive a sua. Ter uma
            das duas coisas não implica ter a outra.
          </p>
          <p>
            Também não guardamos o que você assistiu, quanto tempo assistiu nem
            em que ponto parou. A única informação de progresso que existe é a
            data da matrícula, e ela serve para uma coisa só: calcular quando as
            aulas de liberação gradual abrem para você.
          </p>
          <p>
            <strong>Cursos abertos não criam conta nenhuma.</strong> Quem assiste
            ao conteúdo gratuito não é identificado, não entra em lista alguma e
            não deixa registro no site.
          </p>
          <p>
            A base legal é a execução do contrato (art. 7º, V da LGPD): sem
            e-mail não há como liberar o acesso que você contratou. Para apagar
            sua conta de aluno, escreva para {site.email} — a exclusão é
            definitiva e encerra o acesso aos cursos.
          </p>
          <p>
            As condições comerciais — prazo de acesso, reembolso e uso do
            conteúdo — estão nos{" "}
            <a href="/termos-dos-cursos">termos de uso dos cursos</a>.
          </p>

          <h2>7. Doações por PIX</h2>
          <p>
            O código PIX das aulas gratuitas é gerado dentro do próprio site,
            sem intermediário. Isso significa que <strong>o site não registra
            nem recebe informação alguma sobre quem doou</strong>: não há
            gateway, não há conta de pagamento e não há retorno para cá. A
            transação acontece inteiramente entre o seu banco e o do
            destinatário, e o que aparece é o que apareceria em qualquer PIX —
            no extrato bancário, para as duas partes.
          </p>

          <h2>8. Base legal e finalidade</h2>
          <p>
            O tratamento de dados pessoais no contexto assistencial tem como bases legais
            a tutela da saúde (art. 11, II, “f” da LGPD) e o cumprimento de obrigação
            legal ou regulatória, incluindo a guarda de prontuário conforme as normas do
            Conselho Federal de Medicina.
          </p>

          <h2>9. Seus direitos</h2>
          <p>
            Você pode solicitar confirmação de tratamento, acesso, correção e demais
            direitos previstos na LGPD pelo e-mail {site.email}. Solicitações que
            envolvam prontuário médico seguem também as normas específicas de guarda e
            acesso a documentos de saúde.
          </p>

          <h2>10. Segurança</h2>
          <p>
            Adotamos boas práticas de segurança da informação no armazenamento de
            registros clínicos e na comunicação com pacientes, incluindo canais
            criptografados e controle de acesso.
          </p>

          <h2>11. Atualizações</h2>
          <p>
            Esta política pode ser revisada para refletir mudanças legais ou operacionais.
            A versão vigente estará sempre disponível nesta página.
          </p>
        </div>
      </section>
    </>
  );
}
