// src/data/products.js
import img1 from "../assets/t-8.jpg";
import img2 from "../assets/t-9.webp";
import img3 from "../assets/t-3.webp";
import img4 from "../assets/t-4.webp";

// Placeholder images for accessories/other categories
import img5 from "../assets/t-15.avif";
import img6 from "../assets/t-17.jpg";
import img7 from "../assets/t-19.jpg";

const PRODUCTS = [
  {
    id: "ts-001",
    title: "Essential Tee — White",
    price: 200,
    img: img1,
    short: "Classic white tee — soft combed cotton, everyday fit.",
    long:
      "Our Essential Tee in white is the go-to everyday shirt. Lightweight 100% combed cotton, pre-shrunk for a reliable fit. Perfect canvas for prints or wear-as-is.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Off White", hex: "#f4f4f4" }
    ],
    sku: "ET-WHT-001",
    features: ["100% combed cotton", "Pre-shrunk", "Classic unisex fit"],
    category: "men",
    inventory: 120
  },
  {
    id: "ts-002",
    title: "Essential Tee — Black",
    price: 400,
    img: img2,
    short: "Midnight black tee — deep color, soft handfeel.",
    long:
      "Midnight Black Essential Tee has a rich dye and a soft, durable finish. Designed to hold prints and stay comfortable through daily wear.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Black", hex: "#0b0b0b" },
      { name: "Charcoal", hex: "#2b2b2b" }
    ],
    sku: "ET-BLK-002",
    features: [
      "Reactive-dyed for deep color",
      "Treated for reduced pilling",
      "Ideal for high-contrast prints"
    ],
    category: "men",
    inventory: 88
  },
  {
    id: "ts-003",
    title: "Heather Tee — Grey",
    price: 300,
    img: img3,
    short: "Heather grey tee — textured look, vintage-ready.",
    long:
      "Heather Grey Tee offers a soft slub texture and vintage vibe. Great for logos, retro prints and relaxed fits. Mixed fibers for durability and comfort.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Heather Grey", hex: "#cfcfcf" },
      { name: "Light Grey", hex: "#e0e0e0" }
    ],
    sku: "HT-GRY-003",
    features: ["Poly/cotton blend", "Soft vintage wash", "Great print surface"],
    category: "men",
    inventory: 64
  },
  {
    id: "ts-004",
    title: "Premium Tee — Navy",
    price: 350,
    img: img4,
    short: "Premium navy tee — elevated fabric and fit.",
    long:
      "Premium Navy Tee uses a slightly heavier cotton for a refined drape and improved durability. Slightly tapered silhouette for a modern look.",
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Navy", hex: "#0f2b4f" },
      { name: "Deep Blue", hex: "#1e3a6b" }
    ],
    sku: "PT-NVY-004",
    features: ["Heavier knit", "Refined modern fit", "Fade-resistant dye"],
    category: "men",
    inventory: 40
  },
  {
    id: "ac-001",
    title: "Classic Hoodie",
    price: 800,
    img: img5,
    short: "Cozy hoodie for all-day comfort.",
    long: "Made with premium fleece, this hoodie is soft, warm, and perfect for layering.",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Grey", hex: "#888" }],
    sku: "HOOD-001",
    features: ["Warm fleece lining", "Front pocket", "Adjustable hood"],
    category: "women",
    inventory: 50
  },
  {
    id: "ac-002",
    title: "Baseball Cap",
    price: 150,
    img: img6,
    short: "Lightweight cap for sunny days.",
    long: "Adjustable strap, breathable fabric, and durable stitching make this cap your go-to.",
    sizes: ["One Size"],
    colors: [{ name: "Navy", hex: "#1e3a6b" }],
    sku: "CAP-001",
    features: ["Breathable fabric", "Adjustable strap", "Durable bill"],
    category: "women",
    inventory: 90
  },
  {
    id: "wm-001",
    title: "Women’s Crop Top",
    price: 280,
    img: img7,
    short: "Trendy crop top for casual style.",
    long: "Made with soft cotton blend, designed with a modern cropped fit and versatile style.",
    sizes: ["S", "M", "L"],
    colors: [{ name: "Pink", hex: "#ffc0cb" }],
    sku: "CROP-001",
    features: ["Soft cotton blend", "Trendy cropped fit", "Lightweight"],
    category: "women",
    inventory: 70
  }
];

export default PRODUCTS;
