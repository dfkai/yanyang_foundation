import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "理事会与监事",
};

export default function Page() {
  return <PageShell path="/about/council" />;
}
