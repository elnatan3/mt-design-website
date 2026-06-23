"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  sizes: string[];
  colors: { name: string; value: string }[];
  availability: string;
  stock: number;
  image_url: string;
};

export default function CollectionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setProducts(data || []);
  }

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const matchesSearch =
        product.name?.toLowerCase().includes(search.toLowerCase()) ||
        product.category?.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  return (
    <main className="min-h-screen bg-[#04142c] text-white">
      <Navbar />

      <section className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f5c542]">
            Collections
          </p>

          <h1 className="mt-4 text-4xl font-black sm:text-5xl">
            Ready-Made Collection
          </h1>

          <p className="mt-5 max-w-2xl text-blue-100">
            Browse fixed-price pieces with available sizes, colors, stock, and WhatsApp ordering.
          </p>

          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search wedding, gold, graduation..."
              className="w-full rounded-full bg-white px-5 py-4 text-[#04142c] outline-none md:max-w-md"
            />

            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`rounded-full px-4 py-2 text-sm font-bold ${
                    category === item
                      ? "bg-[#f5c542] text-[#04142c]"
                      : "border border-white/20 text-blue-100"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className="mt-12 text-center text-blue-100">
              No products found.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] || { name: "Gold", value: "#f5c542" }
  );
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "M");

  const message = encodeURIComponent(
    `Hello MT Design, I am interested in this ready-made dress:

Product: ${product.name}
Price: $${product.price}
Size: ${selectedSize}
Color: ${selectedColor.name}
Availability: ${product.availability}`
  );

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="relative h-72 bg-[#d9d0bf]">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-7xl">👗</div>
        )}

        <div className="absolute left-4 top-4 rounded-full bg-[#04142c] px-3 py-1 text-xs font-bold text-[#f5c542]">
          {product.availability || "In Stock"}
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm font-bold uppercase text-[#f5c542]">
          {product.category}
        </p>

        <h2 className="mt-2 text-xl font-black">{product.name}</h2>

        <p className="mt-3 text-sm leading-6 text-blue-100">
          {product.description}
        </p>

        <p className="mt-4 text-2xl font-black text-[#f5c542]">
          ${product.price}
        </p>

        <p className="mt-2 text-xs text-green-300">
          {product.stock ?? 0} ready-made available
        </p>

        <div className="mt-5">
          <p className="mb-2 text-sm font-bold text-[#f5c542]">Color</p>
          <div className="flex flex-wrap gap-3">
            {(product.colors || []).map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                className={`h-9 w-9 rounded-full border-4 ${
                  selectedColor.name === color.name
                    ? "border-[#f5c542]"
                    : "border-white/30"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-sm font-bold text-[#f5c542]">Size</p>
          <div className="flex flex-wrap gap-2">
            {(product.sizes || []).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`rounded-full border px-4 py-2 text-sm font-bold ${
                  selectedSize === size
                    ? "border-[#f5c542] bg-[#f5c542] text-[#04142c]"
                    : "border-white/20 text-blue-100"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <a
          href={`https://wa.me/YOURNUMBER?text=${message}`}
          className="mt-6 block rounded-full bg-[#f5c542] px-6 py-3 text-center font-bold text-[#04142c]"
        >
          Order Ready-Made
        </a>
      </div>
    </div>
  );
}