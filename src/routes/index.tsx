import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import hero from "@/assets/hero.jpg";

const FILTERS = [
  { label: "Tudo", query: undefined },
  { label: "Bolsas", query: "product_type:Bolsas OR title:bolsa*" },
  { label: "Sapatos", query: "product_type:Sapatos OR title:sapato* OR title:sandália* OR title:scarpin*" },
];

const productsQuery = (q?: string) => queryOptions({ queryKey: ["products", q ?? "all"], queryFn: () => fetchProducts(24, q) });

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ateliê Caramelo — Bolsas e Sapatos" },
      { name: "description", content: "Bolsas e sapatos femininos com design atemporal e acabamento artesanal." },
      { property: "og:title", content: "Ateliê Caramelo — Bolsas e Sapatos" },
      { property: "og:description", content: "Bolsas e sapatos femininos com design atemporal e acabamento artesanal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [filter, setFilter] = useState(0);
  const { data: products, isLoading, isError } = useQuery(productsQuery(FILTERS[filter].query));

  return (
    <main>
      <section className="relative overflow-hidden">
        <img src={hero} alt="Bolsa de couro caramelo e scarpin de camurça" width={1600} height={1008} className="h-[78vh] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
        <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-center px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Nova coleção</p>
          <h1 className="mt-4 max-w-xl font-display text-5xl leading-[1.05] md:text-7xl">Feito para acompanhar seus passos</h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">Bolsas e sapatos com couro selecionado, linhas limpas e acabamento artesanal.</p>
          <a href="#colecao" className="mt-8 inline-flex w-fit items-center rounded-full bg-primary px-8 py-3 text-sm uppercase tracking-[0.2em] text-primary-foreground transition hover:bg-primary/90">Ver coleção</a>
        </div>
      </section>

      <section id="colecao" className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <h2 className="font-display text-4xl md:text-5xl">A coleção</h2>
          <div className="flex gap-2">
            {FILTERS.map((f, i) => (
              <button key={f.label} onClick={() => setFilter(i)}
                className={`rounded-full border px-5 py-2 text-sm transition ${i === filter ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-foreground"}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-lg bg-muted" />)}
            </div>
          ) : isError ? (
            <p className="text-muted-foreground">Não foi possível carregar os produtos.</p>
          ) : !products?.length ? (
            <div className="rounded-lg border border-dashed border-border py-24 text-center">
              <p className="font-display text-2xl">Nenhum produto encontrado</p>
              <p className="mt-2 text-muted-foreground">Os produtos aparecerão aqui assim que forem cadastrados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => <ProductCard key={p.node.id} product={p} />)}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
