"use client";

import dynamic from "next/dynamic";
import { MockupSection } from "./MockupSection";
import { PhoneMockup } from "./PhoneMockup";

const AboutMockupPreview = dynamic(() =>
  import("./previews/AboutMockupPreview").then((m) => m.AboutMockupPreview)
);

export function HomeAboutPhoneMockup() {
  return (
    <MockupSection>
      {(active) => (
        <PhoneMockup>
          <AboutMockupPreview active={active} />
        </PhoneMockup>
      )}
    </MockupSection>
  );
}
