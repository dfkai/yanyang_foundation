import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "企业合作",
};

export default function Page() {
  return <PageShell path="/support/corporate" />;
}
