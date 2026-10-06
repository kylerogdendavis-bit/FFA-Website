# Bourbon FFA Shop

Static storefront for the Bourbon FFA Marketing & Design team: t-shirts, vinyl banners and laser-engraved items. No build step or dependencies.

## Run locally
```
python3 -m http.server 8000   # then open http://localhost:8000
```

## Edit the shop
- `products.js`: products, prices, size/color options, and the order email (`SITE_CONFIG.orderEmail`, currently a placeholder).
- Photos: put images in an `images/` folder and set `image: "images/yourfile.jpg"` on a product (otherwise a placeholder illustration shows).
- Colors: CSS variables at the top of `styles.css`.

## How orders work
The cart is stored in the visitor's browser. "Send order request" and the custom-order form open the visitor's email app with the order pre-filled and addressed to the team. No payment is taken on the site; the team confirms and collects payment at pickup.

To take online payments later, connect a provider (Stripe Payment Links, Square, or Shopify Buy Button) in place of the mailto step in `app.js`.

## Deploy
Host the folder on any static host (GitHub Pages, Netlify, Cloudflare Pages).
