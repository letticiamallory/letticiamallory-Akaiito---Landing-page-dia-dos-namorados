"use client";

import dynamic from "next/dynamic";
import { PhoneMockup, MockupPlaceholder } from "./PhoneMockup";
import "./hero-triple-mockup.css";

const LetterMockupPreview = dynamic(
  () => import("./previews/LetterMockupPreview").then((m) => m.LetterMockupPreview),
  { loading: () => <MockupPlaceholder /> }
);

const MuseumPreview = dynamic(
  () => import("./previews/MuseumPreview").then((m) => m.MuseumPreview),
  { loading: () => <MockupPlaceholder /> }
);

const ChocolateBoxPreview = dynamic(
  () => import("./previews/ChocolateBoxPreview").then((m) => m.ChocolateBoxPreview),
  { loading: () => <MockupPlaceholder /> }
);

export function HeroTriplePhoneMockup() {
  return (
    <div className="hero-triple-mockup">
      <div className="hero-triple-mockup__decor" aria-hidden>
        <span className="hero-triple-mockup__heart hero-triple-mockup__heart--1">♥</span>
        <span className="hero-triple-mockup__heart hero-triple-mockup__heart--2">♥</span>
        <span className="hero-triple-mockup__heart hero-triple-mockup__heart--3">♥</span>
        <span className="hero-triple-mockup__heart hero-triple-mockup__heart--4">♥</span>
      </div>

      <div className="hero-triple-mockup__phone hero-triple-mockup__phone--left">
        <PhoneMockup priority size="sm">
          <LetterMockupPreview active />
        </PhoneMockup>
      </div>

      <div className="hero-triple-mockup__phone hero-triple-mockup__phone--center">
        <PhoneMockup priority size="sm">
          <MuseumPreview active />
        </PhoneMockup>
      </div>

      <div className="hero-triple-mockup__phone hero-triple-mockup__phone--right">
        <PhoneMockup priority size="sm">
          <ChocolateBoxPreview active />
        </PhoneMockup>
      </div>
    </div>
  );
}
