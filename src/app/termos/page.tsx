import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/marketing/LegalPageLayout";

export const metadata: Metadata = {
  title: "Termos de Uso | Akaiito",
  description: "Termos de uso do Akaiito, plataforma de presentes digitais para casais.",
};

const UPDATED_AT = "7 de junho de 2026";

export default function TermosPage() {
  return (
    <LegalPageLayout eyebrow="Legal" title="Termos de Uso" updatedAt={UPDATED_AT}>
      <section>
        <h2>1. Sobre o serviço</h2>
        <p>
          O Akaiito é uma plataforma que permite criar e compartilhar presentes digitais
          personalizados, como páginas com fotos, música, carta, contador e experiências
          interativas. Ao usar o site, você concorda com estes termos.
        </p>
      </section>

      <section>
        <h2>2. Quem pode usar</h2>
        <p>
          O serviço é destinado a pessoas com 18 anos ou mais, ou com autorização de um
          responsável legal. Você declara ter capacidade para contratar e fornecer informações
          verdadeiras no momento da compra.
        </p>
      </section>

      <section>
        <h2>3. Como funciona a compra</h2>
        <ul>
          <li>Você monta o presente no builder, revisa o preview e informa um e-mail válido.</li>
          <li>O pagamento é processado pelo Mercado Pago, com aprovação via Pix.</li>
          <li>Após a confirmação do pagamento, o link do presente é liberado para compartilhamento.</li>
          <li>Não é necessário criar conta para comprar ou acessar o presente.</li>
        </ul>
      </section>

      <section>
        <h2>4. Conteúdo enviado por você</h2>
        <p>
          Você é responsável por todo o conteúdo que enviar: fotos, textos, músicas, nomes e
          demais materiais. Ao publicar, você declara que:
        </p>
        <ul>
          <li>Tem direito de usar esse conteúdo ou possui autorização de quem aparece nele.</li>
          <li>O material não viola direitos de terceiros, leis ou normas aplicáveis.</li>
          <li>Não inclui conteúdo ilegal, ofensivo, discriminatório ou que viole a privacidade de outras pessoas.</li>
        </ul>
        <p>
          O Akaiito pode remover conteúdo ou suspender links que violem estes termos ou recebam
          denúncia fundamentada.
        </p>
      </section>

      <section>
        <h2>5. Entrega e disponibilidade do link</h2>
        <p>
          O link do presente é entregue digitalmente após a confirmação do pagamento. Salvo
          indicação em contrário na página de compra, o link permanece disponível para acesso
          enquanto o serviço estiver ativo.
        </p>
        <p>
          Por enquanto, alterações no presente após o pagamento não estão disponíveis. Revise
          tudo com atenção antes de finalizar a compra.
        </p>
      </section>

      <section>
        <h2>6. Preço e reembolso</h2>
        <p>
          O valor exibido no checkout é único e inclui as seções selecionadas no momento da
          compra. Em caso de falha de pagamento, o presente não é gerado e nenhum valor é
          cobrado.
        </p>
        <p>
          Solicitações de reembolso devem ser feitas em até 7 dias após a compra, desde que o
          presente ainda não tenha sido compartilhado com o destinatário ou que haja falha
          comprovada do serviço. Entre em contato pelo canal indicado na página de Contato.
        </p>
      </section>

      <section>
        <h2>7. Propriedade intelectual</h2>
        <p>
          A marca, layout, código, ilustrações e experiências interativas do Akaiito pertencem
          à plataforma ou aos seus licenciadores. O conteúdo enviado por você continua sendo seu,
          mas você nos concede licença para hospedar, processar e exibir esse conteúdo apenas
          para entregar o presente contratado.
        </p>
      </section>

      <section>
        <h2>8. Limitação de responsabilidade</h2>
        <p>
          O Akaiito é fornecido &quot;no estado em que se encontra&quot;. Fazemos o possível para manter
          o serviço estável, mas não garantimos funcionamento ininterrupto em todos os
          dispositivos, navegadores ou conexões.
        </p>
        <p>
          Não nos responsabilizamos por danos indiretos decorrentes do uso indevido do serviço,
          do compartilhamento do link por terceiros ou de conteúdo criado pelo próprio usuário.
        </p>
      </section>

      <section>
        <h2>9. Alterações destes termos</h2>
        <p>
          Podemos atualizar estes termos a qualquer momento. A data da última versão aparece no
          topo desta página. O uso continuado do site após alterações significa aceitação da nova
          versão.
        </p>
      </section>

      <section>
        <h2>10. Contato</h2>
        <p>
          Dúvidas sobre estes termos podem ser enviadas pela{" "}
          <a href="/contato">página de Contato</a>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
