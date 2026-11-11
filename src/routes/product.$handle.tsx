import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { fetchProductByHandle, formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

export const Route = createFileRoute("/product/$handle")({
  head: () => ({
    meta: [
      { title: "Produto — Ateliê Caramelo" },
      { name: "description", content: "Detalhes do produto na Ateliê Caramelo." },
      { property: "og:title", content: "Produto — Ateliê Caramelo" },
      { property: "og:description", content: "Detalhes do produto na Ateliê Caramelo." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { data: product, isLoading } = useQuery({ queryKey: ["product", handle], queryFn: () => fetchProductByHandle(handle) });
  const addItem = useCartStore((s) => s.addItem);
  const cartLoading = useCartStore((s) => s.isLoading);
  const [variantIdx, setVariantIdx] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);

  const variants = useMemo(() => product?.node.variants.edges.map((e) => e.node) ?? [], [product]);
  const variant = variants[variantIdx];

  if (isLoading) return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  if (!product && handle === "scarpin-nude-elegance") return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Voltar</Link>
      <div className="mt-8 grid gap-12 md:grid-cols-2">
        <div className="overflow-hidden rounded-lg bg-muted"><img src="/scarpin-nude-elegance.jpg" alt="Scarpin nude de bico fino e salto alto" className="aspect-[4/5] w-full object-cover" /></div>
        <div className="md:pt-8">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">Sapatos • Prévia da coleção</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">Scarpin Nude Elegance</h1>
          <p className="mt-4 text-2xl">R$ 300,00</p>
          <p className="mt-8 leading-relaxed text-muted-foreground">Um clássico indispensável para quem valoriza elegância e sofisticação. O Scarpin Nude Elegance combina um design de bico fino com salto alto e acabamento em tom nude, criando um visual delicado e versátil. Ideal para ocasiões especiais, ambientes profissionais e composições modernas.</p>
          <div className="mt-8 rounded-lg border border-border bg-card p-5">
            <p className="font-medium">Produto em prévia</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Este item já está apresentado no catálogo de demonstração. A compra, o estoque e o checkout serão ativados depois do cadastro e da configuração do produto na plataforma da loja.</p>
          </div>
          <Button size="lg" className="mt-6 w-full md:w-auto md:px-12" disabled>Disponível em breve</Button>
        </div>
      </div>
    </main>
  );

  if (!product) return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl">Produto não encontrado</h1>
      <Link to="/" className="mt-6 inline-block text-primary underline">Voltar à loja</Link>
    </div>
  );

  const p = product.node;
  const images = p.images.edges.map((e) => e.node);
  const hasVariants = variants.length > 1;

  const add = async () => {
    if (!variant) return;
    await addItem({ product, variantId: variant.id, variantTitle: variant.title, price: variant.price, quantity: 1, selectedOptions: variant.selectedOptions });
    toast.success("Adicionado à sacola", { description: p.title, position: "top-center" });
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Voltar</Link>
      <div className="mt-8 grid gap-12 md:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-lg bg-muted">
            {images[imgIdx] ? <img src={images[imgIdx].url} alt={images[imgIdx].altText ?? p.title} className="aspect-[4/5] w-full object-cover" /> : <div className="aspect-[4/5]" />}
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((im, i) => (
                <button key={im.url} onClick={() => setImgIdx(i)} className={`h-20 w-16 overflow-hidden rounded border-2 ${i === imgIdx ? "border-primary" : "border-transparent"}`}>
                  <img src={im.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="md:pt-8">
          <h1 className="font-display text-4xl md:text-5xl">{p.title}</h1>
          <p className="mt-4 text-2xl">{variant ? formatPrice(variant.price.amount, variant.price.currencyCode) : ""}</p>
          {hasVariants && (
            <div className="mt-8">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">{p.options.map((o) => o.name).join(" / ")}</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v, i) => (
                  <button key={v.id} onClick={() => setVariantIdx(i)} disabled={!v.availableForSale}
                    className={`min-w-12 rounded-full border px-4 py-2 text-sm transition disabled:opacity-40 ${i === variantIdx ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-foreground"}`}>
                    {v.title}
                  </button>
                ))}
              </div>
            </div>
          )}
          <Button size="lg" className="mt-8 w-full md:w-auto md:px-12" onClick={add} disabled={cartLoading || !variant?.availableForSale}>
            {cartLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : variant?.availableForSale === false ? "Esgotado" : "Adicionar à sacola"}
          </Button>
          <p className="mt-10 whitespace-pre-line leading-relaxed text-muted-foreground">{p.description}</p>
        </div>
      </div>
    </main>
  );
}
