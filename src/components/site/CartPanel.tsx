import { X, Minus, Plus, MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";
import { waOrderUrl } from "@/data/menu";

interface CartPanelProps {
  open: boolean;
  onClose: () => void;
}

export function CartPanel({ open, onClose }: CartPanelProps) {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

  function buildWaMessage() {
    const lines = items.map((i) => `${i.quantity}x ${i.name} (${i.price})`);
    const header = "I'd like to order:";
    const total = `\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nTotal: ${totalPrice.toLocaleString()} FRW`;
    return `${header}\n${lines.join("\n")}${total}`;
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-[380px] max-w-[90vw] bg-background border-l border-border/40 z-50 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-border/40">
          <div className="flex items-center gap-2 font-display text-lg">
            <ShoppingBag size={18} /> Cart ({totalItems})
          </div>
          <button onClick={onClose} className="text-foreground/60 hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ height: "calc(100% - 140px)" }}>
          {items.length === 0 ? (
            <p className="text-foreground/50 text-sm text-center pt-10">Your cart is empty</p>
          ) : (
            items.map((item) => (
              <div key={item.name} className="flex items-center gap-3 pb-4 border-b border-border/20">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-foreground/50">{item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.name, -1)}
                    className="p-1 rounded border border-border/40 hover:bg-surface text-foreground/70"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.name, 1)}
                    className="p-1 rounded border border-border/40 hover:bg-surface text-foreground/70"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.name)}
                  className="p-1 text-foreground/30 hover:text-red-400"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-border/40 bg-background">
            <div className="flex justify-between items-center mb-4 text-sm">
              <span className="text-foreground/60">Subtotal</span>
              <span className="font-semibold">{totalPrice.toLocaleString()} FRW</span>
            </div>
            <a
              href={waOrderUrl(buildWaMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold text-sm transition-colors"
            >
              <MessageCircle size={18} /> Order via WhatsApp
            </a>
          </div>
        )}
      </div>
    </>
  );
}
