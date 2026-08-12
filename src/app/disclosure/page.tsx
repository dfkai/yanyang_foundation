import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "信息公开",
};

export default function Page() {
  return <PageShell path="/disclosure" />;
}
