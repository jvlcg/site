import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Termos de uso dos cursos",
  description:
    "Condições de contratação, acesso, reembolso e uso do conteúdo dos cursos em vídeo do Dr. José Victor Lisboa Cardoso Gomes.",
  alternates: { canonical: "/termos-dos-cursos" },
  robots: { index: false, follow: true },
};

/**
 * Termos de uso dos cursos.
 *
 * Página separada da política de privacidade de propósito: são assuntos
 * diferentes e regidos por leis diferentes. A política responde "o que vocês
 * fazem com meus dados" (LGPD); estes termos respondem "o que eu comprei, o
 * que posso fazer com isso e como desisto" (Código de Defesa do Consumidor).
 *
 * Misturar os dois é o que produz aquele documento único que ninguém lê e que
 * não serve de defesa para nenhum dos lados.
 */
export default function TermosDosCursosPage() {
  return (
    <>
      <PageHero
        eyebrow="Cursos"
        title="Termos de uso dos cursos"
        lede="O que você contrata, por quanto tempo tem acesso, como pedir reembolso e o que pode e não pode fazer com o conteúdo."
      />
      <section className="mx-auto max-w-3xl px-5 pb-10 sm:px-8">
        <div className="prose-medical">
          <h2>1. Quem oferece</h2>
          <p>
            Os cursos em vídeo publicados em {site.url}/cursos são oferecidos por{" "}
            {site.name}, médico registrado sob {site.crm}. Contato para qualquer
            assunto tratado nesta página: {site.email}.
          </p>
          <p>
            <strong>
              A venda de curso é atividade educacional, não é ato médico.
            </strong>{" "}
            Contratar um curso não cria relação médico-paciente, não gera
            prontuário e não dá direito a atendimento, orientação individual,
            prescrição, laudo ou segunda opinião. Quem quiser consulta deve
            agendá-la pelos canais do consultório, separadamente.
          </p>

          <h2>2. O conteúdo é educativo</h2>
          <p>
            Todo o material tem finalidade <strong>informativa e educacional</strong>.
            Ele descreve conceitos gerais e não avalia o caso de ninguém em
            particular — porque não há como avaliar um caso sem examinar a
            pessoa.
          </p>
          <p>
            Nenhuma aula substitui consulta médica. Nenhuma aula deve ser usada
            para iniciar, interromper ou alterar tratamento por conta própria.
            Não há promessa de resultado, de cura ou de melhora: se algum trecho
            parecer prometer, prevalece o que está escrito aqui.
          </p>
          <p>
            <strong>Em emergência</strong>, procure atendimento imediato ou ligue
            192 (SAMU). Em sofrimento emocional, o 188 (CVV) atende 24 horas, de
            graça.
          </p>

          <h2>3. Cursos gratuitos e doações</h2>
          <p>
            Os cursos marcados como gratuitos são abertos, e o acesso não depende
            de pagamento, cadastro ou contrapartida de espécie alguma.
          </p>
          <p>
            Junto deles há um código PIX para <strong>doação voluntária</strong>.
            Doar é opcional e não muda nada: não libera conteúdo adicional, não
            gera prioridade de atendimento, não cria vínculo com o consultório e
            não é pagamento por serviço. É apoio à produção de mais material
            aberto. Doações <strong>não são reembolsáveis</strong>, justamente
            porque não compram nada.
          </p>

          <h2>4. Cursos pagos: o que você contrata</h2>
          <p>
            O pagamento dá direito a <strong>assistir</strong> às aulas do curso
            contratado, pela internet, pelo prazo informado na página do curso.
            Não havendo prazo informado, o acesso é por{" "}
            <strong>12 meses</strong> contados da liberação.
          </p>
          <p>
            Alguns cursos liberam as aulas <strong>gradualmente</strong>, em
            intervalos contados a partir da sua matrícula. Quando for o caso, a
            página do curso informa isso antes da compra, aula por aula.
          </p>
          <p>
            O acesso é <strong>pessoal e intransferível</strong>, vinculado ao
            e-mail informado na compra. Você entra no site com a conta Google
            desse mesmo e-mail. Se o e-mail que você usa para pagar for diferente
            do que usa para entrar, avise antes — é a causa mais comum de
            problema de acesso.
          </p>

          <h2>5. Direito de arrependimento — 7 dias</h2>
          <p>
            Compra feita pela internet dá direito a desistir em{" "}
            <strong>7 dias corridos</strong>, contados do pagamento, com
            devolução integral do valor. É o artigo 49 do Código de Defesa do
            Consumidor.
          </p>
          <p>
            <strong>
              O direito vale mesmo que você já tenha assistido às aulas.
            </strong>{" "}
            Não é preciso justificar, não há taxa e não há pergunta. Basta
            escrever para {site.email} dentro do prazo. A devolução é feita pelo
            mesmo meio do pagamento, e o acesso é encerrado.
          </p>

          <h2>6. Uso do conteúdo</h2>
          <p>
            As aulas, materiais e textos são protegidos por direito autoral. Você
            pode assisti-las quantas vezes quiser, para uso próprio.
          </p>
          <p>
            <strong>Não é permitido</strong> gravar, baixar por meios não
            oferecidos, redistribuir, revender, exibir publicamente, publicar em
            outra plataforma nem compartilhar seu acesso com terceiros.
          </p>
          <p>
            Compartilhamento de acesso pode levar ao encerramento da matrícula
            sem reembolso do período restante. Isso não se aplica ao conteúdo
            gratuito, que pode ser divulgado à vontade — é para isso que ele
            existe.
          </p>

          <h2>7. Disponibilidade</h2>
          <p>
            O material fica hospedado em serviços de terceiros, e pode haver
            interrupção por manutenção ou falha fora do nosso controle.
            Interrupção breve não gera reembolso; indisponibilidade prolongada
            que impeça o uso do que você contratou, sim — escreva para{" "}
            {site.email}.
          </p>
          <p>
            Aulas podem ser corrigidas, atualizadas ou substituídas quando a
            evidência científica mudar. Isso é esperado em conteúdo de saúde e
            não reduz o que você contratou.
          </p>

          <h2>8. Seus dados</h2>
          <p>
            Para o curso, guardamos apenas <strong>nome e e-mail</strong>, e nada
            além disso. A conta de aluno é separada do cadastro de paciente:{" "}
            <strong>
              entrar como aluno não dá acesso a nenhum dado clínico
            </strong>
            , e a existência de uma coisa não implica a outra.
          </p>
          <p>
            O detalhamento está na{" "}
            <Link href="/politica-de-privacidade">política de privacidade</Link>.
            Para apagar sua conta de aluno, escreva para {site.email}.
          </p>

          <h2>9. Foro e vigência</h2>
          <p>
            Estes termos são regidos pela lei brasileira. Fica eleito o foro do
            domicílio do consumidor para dirimir qualquer questão, conforme o
            Código de Defesa do Consumidor.
          </p>
          <p>
            Alterações valem apenas para compras feitas depois da publicação —
            quem já contratou continua sob os termos vigentes na data da compra.
          </p>
          <p className="text-faint">
            Última atualização: agosto de 2026.
          </p>
        </div>
      </section>
    </>
  );
}
