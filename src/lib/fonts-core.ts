import {
  Instrument_Serif,
  Inter,
  Cormorant_Garamond,
  Playfair_Display,
} from "next/font/google";

export const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const cormorant = Cormorant_Garamond({
  variable: "--font-hero",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  display: "swap",
});

export const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const coreFontClassName = [
  playfair.variable,
  cormorant.variable,
  instrument.variable,
  inter.variable,
].join(" ");
