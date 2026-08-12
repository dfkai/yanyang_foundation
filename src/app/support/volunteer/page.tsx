import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "志愿者",
};

export default function Page() {
  return <PageShell path="/support/volunteer" />;
}
