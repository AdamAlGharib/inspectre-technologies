import type { Metadata } from "next";
import { IndexExperience } from "./IndexExperience";
import "./index.css";

export const metadata: Metadata = {
  title: "Inspectre — Open Index",
  description:
    "Inspectre is an independent product studio turning ambiguous ideas into clear, working systems.",
  openGraph: {
    title: "Inspectre — Open Index",
    description: "Inspectre is an independent product studio turning ambiguous ideas into clear, working systems.",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Inspectre — Open Index",
    description: "Inspectre is an independent product studio turning ambiguous ideas into clear, working systems.",
    images: [],
  },
};

export default function IndexPage() {
  return <IndexExperience />;
}
