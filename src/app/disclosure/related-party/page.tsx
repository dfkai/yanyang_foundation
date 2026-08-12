import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "重要关联方交易",
};

export default function Page() {
  return <PageShell path="/disclosure/related-party" />;
}
