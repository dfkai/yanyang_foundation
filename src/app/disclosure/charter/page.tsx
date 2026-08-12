import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "章程与内部管理制度",
};

export default function Page() {
  return <PageShell path="/disclosure/charter" />;
}
