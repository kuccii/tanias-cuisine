# Menu Cart Design

**Date:** 2026-06-11

## Overview
Add a multi-item cart to the menu page so users can select several dishes and order them all at once via WhatsApp.

## Components

### CartContext (`src/components/site/CartContext.tsx`)
- React context + provider
- State: `CartItem[]` where each item has `{ name: string; price: string; quantity: number }`
- Operations: `addItem(name, price)`, `removeItem(name)`, `updateQuantity(name, delta)`, `clearCart()`
- Derived: `totalItems` (sum of quantities), `totalPrice` (sum of price * qty, parsed as number)

### CartPanel (`src/components/site/CartPanel.tsx`)
- Fixed slide-out drawer from the right edge
- Dark backdrop overlay (click to close)
- Smooth `translate-x` transition with `transition-transform` (Tailwind)
- Lists each cart item with: name, price, qty (+/- buttons), line total
- "Remove" (X) button per item
- Subtotal at bottom
- "Order via WhatsApp" button — builds single message with all items and opens `wa.me/250788500635?text=...`
- Close button (X) in top-right

### Menu page updates (`src/routes/menu.tsx`)
- Replace existing "Order via WhatsApp" link on each ItemCard with "Add to Cart" button
- Add floating cart icon (top-right of menu page) with badge showing `totalItems`
- Wrap page content in `CartProvider`
- Cart icon toggles `CartPanel` open/close

## Data Flow
1. User clicks "Add to Cart" on an item → `addItem(name, price)` (if exists, qty++)
2. Cart icon badge updates reactively
3. Click cart icon → panel slides in
4. User adjusts quantities in panel
5. User clicks WhatsApp button → all items compiled into one message, `wa.me` link opened
6. Cart persists in memory during the session only

## WhatsApp Message Format
```
I'd like to order:
1x Snacks Platter (25,000 FRW)
2x Chicken Brochette (15,000 FRW)
─────────────
Total: 55,000 FRW
```

## Non-goals
- No localStorage persistence (cart resets on refresh)
- No server-side cart
- No checkout flow beyond WhatsApp
