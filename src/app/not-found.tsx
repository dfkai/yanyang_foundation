import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { SunField } from "@/components/sun-field";

export default function NotFound() {
  return (
    <section className="relative isolate">
      <SunField />
      <Container>
        <div className="relative flex min-h-[60svh] flex-col items-center justify-center py-24 text-center">
          <p className="text-h2 font-bold text-accent">404</p>
          <h1 className="mt-4 text-h1 text-fg">这个页面不在了</h1>
          <p className="mt-4 max-w-md text-lead text-fg-muted">
            链接可能已经变更，或者页面还没有建好。
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/">返回首页</ButtonLink>
            <ButtonLink href="/disclosure" variant="secondary">
              查看信息公开
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
