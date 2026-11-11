import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { type ShopifyProduct, formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const p = product.node;
  const variant = p.variants.edges[0]?.node;
  const img = p.images.edges[0]?.node;

  const add = async () => {
    if (!variant) return;
    await addItem({ product, variantId: variant.id, variantTitle: variant.title, price: variant.price, quantity: 1, selectedOptions: variant.selectedOptions });
    toast.success("Adicionado à sacola", { description: p.title, position: "top-center" });
  };

  return (
    <div className="group flex flex-col">
      <Link to="/product/$handle" params={{ handle: p.handle }} className="block overflow-hidden rounded-lg bg-muted">
        {img ? (
          <img src={img.url} alt={img.altText ?? p.title} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="aspect-[4/5] w-full" />
        )}
      </Link>
      <div className="mt-4 flex flex-1 flex-col">
        <Link to="/product/$handle" params={{ handle: p.handle }} className="font-display text-xl hover:text-primary">{p.title}</Link>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
        <p className="mt-2 font-medium">{formatPrice(p.priceRange.minVariantPrice.amount, p.priceRange.minVariantPrice.currencyCode)}</p>
        <Button variant="outline" className="mt-4" onClick={add} disabled={isLoading || !variant?.availableForSale}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : variant?.availableForSale === false ? "Esgotado" : "Adicionar à sacola"}
        </Button>
      </div>
    </div>
  );
}
