import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "影响力",
};

export default function Page() {
  return <PageShell path="/impact" />;
}
