import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "投诉与举报",
};

export default function Page() {
  return <PageShell path="/disclosure/complaints" />;
}
