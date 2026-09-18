import type { Metadata } from "next";
import { SignalExperience } from "./SignalExperience";
import "./signal.css";

export const metadata: Metadata = {
  title: "Inspectre — Signal Field",
  description:
    "Inspectre Technologies finds the consequential signal, designs the system, and builds the working product.",
  openGraph: {
    title: "Inspectre — Signal Field",
    description: "Inspectre Technologies finds the consequential signal, designs the system, and builds the working product.",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Inspectre — Signal Field",
    description: "Inspectre Technologies finds the consequential signal, designs the system, and builds the working product.",
    images: [],
  },
};

export default function SignalPage() {
  return <SignalExperience />;
}
