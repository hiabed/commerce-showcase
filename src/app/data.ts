import type { Lang } from "./i18n";

export type Material = "Cotton" | "Canvas" | "Jute" | "Paper" | "Recycled PET" | "Leather";
export type Feature = "Sustainable" | "Fast delivery" | "Bestseller" | "New";

export type Product = {
  id: number;
  name: Record<Lang, string>;
  spec: Record<Lang, string>;
  material: Material;
  features: Feature[];
  basePrice: number;
  discount?: number;
  minQty: number;
  rating: number;
  reviews: number;
  colors: string[];
  stock: number;
  image: string;
};

const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&h=800&q=80`;

export const COLORS: Record<string, string> = {
  Natural: "#e8dcc4",
  Black: "#1d1d22",
  Navy: "#1f2f57",
  Coral: "#ff6b4a",
  Forest: "#2f6b4f",
  Sky: "#8fc1e3",
  Rose: "#e7a6b1",
  Sand: "#c9a77c",
  Grey: "#9a9ca3",
};

export const TIERS = [50, 100, 250, 500, 1000];
export const TIER_FACTOR = [1, 0.88, 0.78, 0.7, 0.62];

export const PRINT_METHODS = [
  { id: "screen", extra: 0.35 },
  { id: "full", extra: 0.6 },
  { id: "embroidery", extra: 1.1 },
];

export const unitPrice = (p: Product, qty: number) => {
  let i = 0;
  TIERS.forEach((t, idx) => qty >= t && (i = idx));
  return p.basePrice * TIER_FACTOR[i] * (1 - (p.discount ?? 0) / 100);
};

export const fromPrice = (p: Product) => unitPrice(p, TIERS[TIERS.length - 1]);

export const products: Product[] = [
  { id: 1, name: { en: "Kraft Jute Shopper", da: "Jute-indkøbsnet Kraft" }, spec: { en: "Natural jute, 340 g/m², 42×38 cm", da: "Naturlig jute, 340 g/m², 42×38 cm" }, material: "Jute", features: ["Sustainable", "Bestseller"], basePrice: 4.9, minQty: 50, rating: 4.9, reviews: 412, colors: ["Natural", "Forest", "Black"], stock: 18400, image: img("1544816155-12df9643f363") },
  { id: 2, name: { en: "Classic Cotton Tote", da: "Klassisk mulepose i bomuld" }, spec: { en: "OEKO-TEX® cotton, 140 g/m², long handles", da: "OEKO-TEX® bomuld, 140 g/m², lange hanke" }, material: "Cotton", features: ["Bestseller", "Fast delivery"], basePrice: 1.95, discount: 10, minQty: 100, rating: 4.8, reviews: 1286, colors: ["Black", "Natural", "Navy", "Coral", "Sky", "Rose"], stock: 64200, image: img("1572196284554-4e321b0e7e0b") },
  { id: 3, name: { en: "Midnight Canvas Tote", da: "Midnight canvas-mulepose" }, spec: { en: "Heavy canvas, 320 g/m², inner pocket", da: "Kraftigt lærred, 320 g/m², inderlomme" }, material: "Canvas", features: ["New"], basePrice: 6.4, minQty: 50, rating: 4.7, reviews: 96, colors: ["Black", "Navy", "Grey"], stock: 7200, image: img("1614179689702-355944cd0918") },
  { id: 4, name: { en: "Recycled Paper Gift Bag", da: "Gavepose i genbrugspapir" }, spec: { en: "100% recycled kraft, twisted handles", da: "100 % genbrugskraftpapir, snoede hanke" }, material: "Paper", features: ["Sustainable", "Fast delivery"], basePrice: 0.95, minQty: 250, rating: 4.6, reviews: 538, colors: ["Black", "Natural", "Coral"], stock: 120000, image: img("1607082348824-0a96f2a4b9da") },
  { id: 5, name: { en: "Urban Daypack", da: "Urban rygsæk" }, spec: { en: "rPET shell, padded 15\" laptop sleeve", da: "rPET-materiale, polstret 15\" computerrum" }, material: "Recycled PET", features: ["Sustainable", "New"], basePrice: 18.5, minQty: 25, rating: 4.8, reviews: 211, colors: ["Rose", "Black", "Grey", "Forest"], stock: 3100, image: img("1622560480605-d83c853bc5c3") },
  { id: 6, name: { en: "Executive Satchel", da: "Executive skuldertaske" }, spec: { en: "Vegan leather, adjustable strap", da: "Vegansk læder, justerbar rem" }, material: "Leather", features: ["Bestseller"], basePrice: 32, discount: 15, minQty: 25, rating: 4.9, reviews: 174, colors: ["Grey", "Black", "Sand"], stock: 980, image: img("1605733513597-a8f8341084e6") },
  { id: 7, name: { en: "Lagoon Conference Bag", da: "Lagoon konferencetaske" }, spec: { en: "Structured PU, document compartment", da: "Formfast PU, dokumentrum" }, material: "Leather", features: ["Fast delivery"], basePrice: 24.9, minQty: 25, rating: 4.7, reviews: 88, colors: ["Sky", "Navy", "Black"], stock: 1650, image: img("1594223274512-ad4803739b7c") },
  { id: 8, name: { en: "Wicker Market Basket", da: "Flettet torvekurv" }, spec: { en: "Hand-woven rattan, leather handles", da: "Håndflettet rattan, læderhanke" }, material: "Jute", features: ["Sustainable", "New"], basePrice: 21, minQty: 25, rating: 4.9, reviews: 57, colors: ["Sand", "Natural"], stock: 640, image: img("1590874103328-eac38a683ce7") },
  { id: 9, name: { en: "Signature Shoulder Bag", da: "Signature skuldertaske" }, spec: { en: "Premium PU, metal clasp, gift box", da: "Premium PU, metallås, gaveæske" }, material: "Leather", features: ["Bestseller"], basePrice: 28.5, minQty: 25, rating: 4.8, reviews: 143, colors: ["Coral", "Black", "Rose"], stock: 2200, image: img("1584917865442-de89df76afd3") },
  { id: 10, name: { en: "Pearl Crossbody", da: "Pearl crossbody-taske" }, spec: { en: "Studded detail, detachable chain", da: "Nittedetaljer, aftagelig kæde" }, material: "Leather", features: ["New", "Fast delivery"], basePrice: 26, discount: 10, minQty: 25, rating: 4.6, reviews: 39, colors: ["Grey", "Rose", "Black"], stock: 870, image: img("1559563458-527698bf5295") },
  { id: 11, name: { en: "Bloom Weekender", da: "Bloom weekendtaske" }, spec: { en: "Printed canvas, 32 L, shoe pocket", da: "Printet lærred, 32 L, skolomme" }, material: "Canvas", features: ["Fast delivery"], basePrice: 22.5, minQty: 25, rating: 4.7, reviews: 72, colors: ["Rose", "Natural"], stock: 1300, image: img("1591561954557-26941169b49e") },
];

export const subcategories = [
  { name: { en: "Tote bags", da: "Muleposer" }, count: 86, image: img("1572196284554-4e321b0e7e0b") },
  { name: { en: "Jute & eco", da: "Jute & øko" }, count: 41, image: img("1544816155-12df9643f363") },
  { name: { en: "Paper bags", da: "Papirposer" }, count: 33, image: img("1607082348824-0a96f2a4b9da") },
  { name: { en: "Backpacks", da: "Rygsække" }, count: 58, image: img("1622560480605-d83c853bc5c3") },
  { name: { en: "Laptop bags", da: "Computertasker" }, count: 27, image: img("1605733513597-a8f8341084e6") },
  { name: { en: "Travel", da: "Rejse" }, count: 44, image: img("1591561954557-26941169b49e") },
];
