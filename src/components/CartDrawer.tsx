import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingBag, Minus, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/shopify";

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode ?? "BRL";

  useEffect(() => { if (isOpen) syncCart(); }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (url) { window.open(url, "_blank"); setIsOpen(false); }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Abrir sacola">
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Sua sacola</SheetTitle>
          <SheetDescription>{totalItems === 0 ? "Sua sacola está vazia" : `${totalItems} ${totalItems === 1 ? "item" : "itens"}`}</SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col pt-6">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground">
              <ShoppingBag className="mb-4 h-12 w-12" />
              <p>Nenhum item ainda</p>
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-4 border-b border-border pb-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      {item.product.node.images.edges[0]?.node && (
                        <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.title} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-medium">{item.product.node.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.selectedOptions.map((o) => o.value).filter((v) => v !== "Default Title").join(" • ")}</p>
                      <p className="mt-1 font-semibold">{formatPrice(item.price.amount, item.price.currencyCode)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeItem(item.variantId)} aria-label="Remover"><Trash2 className="h-3.5 w-3.5" /></Button>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.variantId, item.quantity - 1)} aria-label="Diminuir"><Minus className="h-3 w-3" /></Button>
                        <span className="w-7 text-center text-sm">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.variantId, item.quantity + 1)} aria-label="Aumentar"><Plus className="h-3 w-3" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4 border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg">Total</span>
                  <span className="text-xl font-semibold">{formatPrice(String(totalPrice), currency)}</span>
                </div>
                <Button onClick={handleCheckout} className="w-full" size="lg" disabled={isLoading || isSyncing}>
                  {isLoading || isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ExternalLink className="mr-2 h-4 w-4" />Finalizar compra</>}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
