import { Link } from "@tanstack/react-router";
import { CartDrawer } from "./CartDrawer";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="font-display text-2xl tracking-wide">Ateliê Caramelo</Link>
        <nav className="hidden gap-8 text-sm uppercase tracking-[0.2em] text-muted-foreground md:flex">
          <a href="/#colecao" className="hover:text-foreground">Coleção</a>
        </nav>
        <CartDrawer />
      </div>
    </header>
  );
}
