import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageLayout } from "@/components/marketing/LegalPageLayout";

export const metadata: Metadata = {
  title: "Contato | Akaiito",
  description: "Fale com o Akaiito para suporte, privacidade e dúvidas sobre presentes digitais.",
};

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contato@dailyailab.online";
const UPDATED_AT = "7 de junho de 2026";

const TOPICS = [
  {
    title: "Suporte com a compra",
    desc: "Problemas no pagamento, link que não chegou ou dúvidas antes de finalizar o presente.",
  },
  {
    title: "Privacidade e dados",
    desc: "Solicitações de acesso, correção ou exclusão de dados conforme a LGPD.",
  },
  {
    title: "Conteúdo do presente",
    desc: "Denúncias de uso indevido de imagem, texto ou material que viole direitos de terceiros.",
  },
] as const;

export default function ContatoPage() {
  return (
    <LegalPageLayout eyebrow="Ajuda" title="Contato" updatedAt={UPDATED_AT}>
      <section>
        <p>
          Estamos aqui para ajudar com compras, entrega do link, privacidade e qualquer dúvida
          sobre o Akaiito. Resposta em até 2 dias úteis.
        </p>
      </section>

      <section className="legal-contact-card">
        <p className="legal-contact-card__label">E-mail</p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="legal-contact-card__email">
          {CONTACT_EMAIL}
        </a>
        <p className="legal-contact-card__hint">
          Inclua o e-mail usado na compra e, se possível, o link ou identificador do presente.
        </p>
      </section>

      <section>
        <h2>Como podemos ajudar</h2>
        <ul className="legal-contact-topics">
          {TOPICS.map((topic) => (
            <li key={topic.title}>
              <strong>{topic.title}</strong>
              <span>{topic.desc}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Antes de escrever</h2>
        <p>
          Muitas dúvidas já estão respondidas na{" "}
          <Link href="/#faq">seção de perguntas frequentes</Link> da home. Se o assunto for
          pagamento pendente, verifique também se o Pix foi confirmado na página de pagamento.
        </p>
      </section>

      <section>
        <h2>Documentos legais</h2>
        <p>
          Consulte também os <Link href="/termos">Termos de Uso</Link> e a{" "}
          <Link href="/privacidade">Política de Privacidade</Link>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
