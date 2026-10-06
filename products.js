// Edit this file to change what the Marketing & Design team sells.
// type: "shirt" | "banner" | "engraved"  (controls the placeholder artwork and filter tab)
// Replace `image` with a path like "images/tee.jpg" once you have real photos.
window.SITE_CONFIG = {
  orderEmail: "ffa-marketing@example.com", // TODO: set to the team's real email
  chapter: "Bourbon FFA Chapter",
};

window.PRODUCTS = [
  {
    id: "tee-classic",
    type: "shirt",
    name: "Chapter Classic Tee",
    description: "Soft cotton tee with the Bourbon FFA emblem on the chest.",
    price: 18,
    options: { Size: ["YS", "YM", "YL", "S", "M", "L", "XL", "2XL"], Color: ["Corn Gold", "Navy", "Gray"] },
    image: null,
  },
  {
    id: "tee-grown",
    type: "shirt",
    name: "Grown Not Made Tee",
    description: "Bold back-print design created by our design team.",
    price: 20,
    options: { Size: ["YS", "YM", "YL", "S", "M", "L", "XL", "2XL"], Color: ["Navy", "White"] },
    image: null,
  },
  {
    id: "tee-hoodie",
    type: "shirt",
    name: "Blue & Gold Hoodie",
    description: "Heavyweight pullover hoodie, embroidered-look chapter crest.",
    price: 38,
    options: { Size: ["S", "M", "L", "XL", "2XL"], Color: ["Navy"] },
    image: null,
  },
  {
    id: "banner-vinyl",
    type: "banner",
    name: "Vinyl Banner (2' x 4')",
    description: "Weatherproof vinyl with grommets. Great for fundraisers, farms and small businesses.",
    price: 35,
    options: { Text: "custom" },
    image: null,
  },
  {
    id: "banner-large",
    type: "banner",
    name: "Vinyl Banner (3' x 6')",
    description: "Large-format banner for fences, events and storefronts.",
    price: 60,
    options: { Text: "custom" },
    image: null,
  },
  {
    id: "engrave-board",
    type: "engraved",
    name: "Engraved Cutting Board",
    description: "Hardwood board, laser-engraved with your name, brand or design.",
    price: 28,
    options: { Text: "custom" },
    image: null,
  },
  {
    id: "engrave-tumbler",
    type: "engraved",
    name: "Engraved Tumbler",
    description: "Insulated 20 oz tumbler with a permanent laser-engraved design.",
    price: 24,
    options: { Text: "custom" },
    image: null,
  },
  {
    id: "engrave-sign",
    type: "engraved",
    name: "Wood Farm Sign",
    description: "Laser-cut and engraved wooden sign, perfect for gates and barns.",
    price: 45,
    options: { Text: "custom" },
    image: null,
  },
];
