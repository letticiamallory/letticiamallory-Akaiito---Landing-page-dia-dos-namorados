import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/marketing/LegalPageLayout";

export const metadata: Metadata = {
  title: "Política de Privacidade | Akaiito",
  description: "Como o Akaiito coleta, usa e protege seus dados pessoais.",
};

const UPDATED_AT = "7 de junho de 2026";

export default function PrivacidadePage() {
  return (
    <LegalPageLayout eyebrow="Legal" title="Política de Privacidade" updatedAt={UPDATED_AT}>
      <section>
        <h2>1. Quem somos</h2>
        <p>
          O Akaiito é uma plataforma de presentes digitais. Esta política explica quais dados
          coletamos, por que coletamos e quais são seus direitos, em conformidade com a Lei Geral
          de Proteção de Dados (LGPD).
        </p>
      </section>

      <section>
        <h2>2. Dados que coletamos</h2>
        <h3>Dados fornecidos por você</h3>
        <ul>
          <li>E-mail informado na compra, para envio do link do presente.</li>
          <li>Conteúdo do presente: nomes, fotos, textos, músicas, datas e personalizações.</li>
          <li>Informações de pagamento tratadas pelo Mercado Pago. O Akaiito não armazena dados completos do cartão ou do Pix.</li>
        </ul>

        <h3>Dados coletados automaticamente</h3>
        <ul>
          <li>Endereço IP, tipo de navegador, páginas acessadas e horários de acesso.</li>
          <li>Identificadores técnicos necessários para processar pagamento, entregar o presente e manter a segurança do serviço.</li>
        </ul>
      </section>

      <section>
        <h2>3. Como usamos os dados</h2>
        <ul>
          <li>Processar o pagamento e liberar o link do presente.</li>
          <li>Hospedar e exibir o conteúdo que você criou.</li>
          <li>Enviar comunicações relacionadas à compra, como confirmação ou suporte.</li>
          <li>Prevenir fraudes, abusos e uso indevido da plataforma.</li>
          <li>Melhorar a estabilidade e a experiência do serviço.</li>
        </ul>
      </section>

      <section>
        <h2>4. Compartilhamento com terceiros</h2>
        <p>Podemos compartilhar dados apenas quando necessário para operar o serviço:</p>
        <ul>
          <li>
            <strong>Mercado Pago:</strong> processamento de pagamentos e confirmação de transações.
          </li>
          <li>
            <strong>Provedores de infraestrutura:</strong> hospedagem, banco de dados e armazenamento de arquivos enviados por você.
          </li>
          <li>
            <strong>Serviços de mídia incorporada:</strong> por exemplo, quando você adiciona uma música do YouTube ao presente.
          </li>
        </ul>
        <p>Não vendemos seus dados pessoais.</p>
      </section>

      <section>
        <h2>5. Armazenamento e retenção</h2>
        <p>
          Mantemos os dados pelo tempo necessário para cumprir a finalidade da compra, obrigações
          legais e resolução de disputas. O link do presente pode permanecer ativo enquanto o
          serviço estiver disponível.
        </p>
        <p>
          Fotos e textos enviados ficam associados ao presente criado. Se quiser solicitar
          exclusão, use o canal de contato indicado abaixo.
        </p>
      </section>

      <section>
        <h2>6. Seus direitos</h2>
        <p>De acordo com a LGPD, você pode solicitar:</p>
        <ul>
          <li>Confirmação do tratamento e acesso aos seus dados.</li>
          <li>Correção de dados incompletos ou desatualizados.</li>
          <li>Anonimização, bloqueio ou eliminação de dados desnecessários.</li>
          <li>Portabilidade, quando aplicável.</li>
          <li>Revogação do consentimento, quando o tratamento depender dele.</li>
        </ul>
        <p>
          Para exercer esses direitos, entre em contato pela{" "}
          <a href="/contato">página de Contato</a>.
        </p>
      </section>

      <section>
        <h2>7. Cookies e tecnologias semelhantes</h2>
        <p>
          Podemos usar cookies essenciais para manter sessões, segurança e funcionamento do
          checkout. Não utilizamos cookies de publicidade comportamental nesta versão do
          serviço.
        </p>
      </section>

      <section>
        <h2>8. Segurança</h2>
        <p>
          Adotamos medidas técnicas e organizacionais razoáveis para proteger os dados contra
          acesso não autorizado, perda ou alteração indevida. Nenhum sistema é 100% seguro, mas
          trabalhamos para reduzir riscos.
        </p>
      </section>

      <section>
        <h2>9. Menores de idade</h2>
        <p>
          O serviço não é direcionado a menores de 18 anos sem supervisão de um responsável. Se
          identificarmos coleta indevida de dados de menores, tomaremos medidas para remover as
          informações.
        </p>
      </section>

      <section>
        <h2>10. Alterações desta política</h2>
        <p>
          Esta política pode ser atualizada periodicamente. A data da versão vigente aparece no
          topo da página. Recomendamos revisitar este documento de tempos em tempos.
        </p>
      </section>

      <section>
        <h2>11. Contato do encarregado</h2>
        <p>
          Para assuntos de privacidade e proteção de dados, utilize a{" "}
          <a href="/contato">página de Contato</a>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
