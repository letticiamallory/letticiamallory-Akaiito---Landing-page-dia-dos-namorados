import type { Metadata } from "next";
import { coreFontClassName } from "@/lib/fonts-core";
import "./globals.css";

export const metadata: Metadata = {
  title: "Akaiito | Scrapbook do Casal | Presente digital para casais",
  description:
    "Monte sua landing page passo a passo: escolha seções, personalize e compartilhe um link único. Pague com Pix, receba o link e mande pro WhatsApp.",
  openGraph: {
    title: "Akaiito | Scrapbook do Casal",
    description:
      "Builder modular em estilo scrapbook: hero, fotos, carta, música e módulos premium interativos.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${coreFontClassName} font-body min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
