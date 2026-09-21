import { ArrowRight, Compass } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100dvh-120px)] items-center justify-center">
      <div className="w-full max-w-md rounded-[2rem] border bg-card p-8 text-center shadow-lift">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/45 text-primary">
          <Compass className="h-8 w-8" />
        </div>
        <p className="mt-6 font-mono-latin text-5xl font-bold text-primary">404</p>
        <h1 className="mt-4 text-xl font-extrabold">هذه الصفحة ضيّعت الطريق</h1>
        <p className="mt-3 text-xs leading-7 text-muted-foreground">لكن دروسك ومجتمعك بانتظارك. ارجع إلى الصفحة الرئيسية ونكمل من هناك.</p>
        <Link href="/" data-testid="link-not-found-home" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold text-primary-foreground">
          العودة للرئيسية <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
