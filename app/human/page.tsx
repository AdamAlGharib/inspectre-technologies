import type { Metadata } from "next";
import { HumanExperience } from "./HumanExperience";
import "./human.css";

export const metadata: Metadata = {
  title: "Inspectre — Human System",
  description:
    "Inspectre Technologies builds thoughtful software and decision systems with trust designed in.",
  openGraph: {
    title: "Inspectre — Human System",
    description: "Inspectre Technologies builds thoughtful software and decision systems with trust designed in.",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Inspectre — Human System",
    description: "Inspectre Technologies builds thoughtful software and decision systems with trust designed in.",
    images: [],
  },
};

export default function HumanPage() {
  return <HumanExperience />;
}
