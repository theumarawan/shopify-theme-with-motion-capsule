# Velnaura — Headless Shopify Storefront

Shopify Hydrogen + React Router + TypeScript homepage for Velnaura.

## Local development

```bash
npm install
npm run dev
```

The homepage uses polished local Mugtea data when Shopify credentials are absent. The demo cart persists in the browser and clearly marks checkout as unavailable.

## Connect Shopify later

1. Buy or create the Shopify store and install the Headless sales channel.
2. Copy `.env.example` to `.env`.
3. Add the store domain, Storefront API tokens, storefront ID, customer-account values, checkout domain, and a long random session secret.
4. Keep `FEATURED_PRODUCT_HANDLE=mugtea`, or change it to the published product handle.
5. Restart the storefront. The homepage automatically switches from fallback data to the matching Shopify product and Hydrogen cart mutations.

## Validation

```bash
npm run typecheck
npm run lint
npm test
npm run build
```
