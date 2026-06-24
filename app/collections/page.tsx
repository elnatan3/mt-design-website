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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setProducts(data || []);

    setLoading(false);
  }

  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
  ];

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const colorText = (product.colors || [])
        .map((c) => c.name)
        .join(" ")
        .toLowerCase();

      const sizeText = (product.sizes || []).join(" ").toLowerCase();

      const matchesSearch =
        product.name?.toLowerCase().includes(q) ||
        product.category?.toLowerCase().includes(q) ||
        product.description?.toLowerCase().includes(q) ||
        colorText.includes(q) ||
        sizeText.includes(q);

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
            Browse fixed-price pieces with available sizes, colors, stock, and
            WhatsApp ordering.
          </p>

          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search wedding, gold, graduation..."
              className="w-full rounded-full bg-white px-5 py-4 text-[#04142c] outline-none lg:max-w-md"
            />

            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
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

          {loading ? (
            <LuxuryLoader text="Loading ready-made collection..." />
          ) : (
            <>
              <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <p className="mt-12 text-center text-blue-100">
                  No products found.
                </p>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function ProductCard({ product }: { product: Product }) {
  const colors = product.colors || [];
  const sizes = product.sizes || [];

  const colorNames = colors.map((color) => color.name).join(", ");
  const sizeNames = sizes.join(", ");

  const message = encodeURIComponent(
    `Hello MT Design, I am interested in this ready-made dress:

Product: ${product.name}
Price: $${product.price}
Available Sizes: ${sizeNames}
Available Colors: ${colorNames}
Availability: ${product.availability}`
  );

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-[#f5c542]/60">
      <div className="relative flex h-[380px] items-center justify-center bg-[#d9d0bf] p-3 sm:h-[450px]">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="max-h-full max-w-full rounded-2xl object-contain"
          />
        ) : (
          <div className="text-7xl">👗</div>
        )}

        <div className="absolute left-4 top-4 rounded-full bg-[#04142c] px-3 py-1 text-xs font-bold text-[#f5c542]">
          {product.availability || "In Stock"}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <p className="text-sm font-bold uppercase text-[#f5c542]">
          {product.category}
        </p>

        <h2 className="mt-2 text-2xl font-black">{product.name}</h2>

        <p className="mt-3 text-sm leading-6 text-blue-100">
          {product.description}
        </p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-3xl font-black text-[#f5c542]">
            ${product.price}
          </p>
          <p className="text-sm text-green-300">
            {product.stock ?? 0} ready-made available
          </p>
        </div>

        <div className="mt-6 rounded-2xl bg-[#08254f] p-4">
          <p className="text-sm font-bold text-[#f5c542]">Available Colors</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {colors.length > 0 ? (
              colors.map((color) => (
                <span
                  key={color.name}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-blue-100"
                >
                  {color.name}
                </span>
              ))
            ) : (
              <span className="text-sm text-blue-100">Ask on WhatsApp</span>
            )}
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-[#08254f] p-4">
          <p className="text-sm font-bold text-[#f5c542]">Available Sizes</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {sizes.length > 0 ? (
              sizes.map((size) => (
                <span
                  key={size}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-blue-100"
                >
                  {size}
                </span>
              ))
            ) : (
              <span className="text-sm text-blue-100">Ask on WhatsApp</span>
            )}
          </div>
        </div>

        <a
          href={`https://wa.me/YOURNUMBER?text=${message}`}
          className="mt-6 block rounded-full bg-[#f5c542] px-6 py-3 text-center font-bold text-[#04142c]"
        >
          Ask / Order on WhatsApp
        </a>
      </div>
    </div>
  );
}

function LuxuryLoader({ text }: { text: string }) {
  return (
    <div className="mt-16 flex flex-col items-center justify-center rounded-3xl border border-[#f5c542]/30 bg-white/5 p-12 text-center">
      <div className="relative h-28 w-28">
        <div className="absolute inset-0 rounded-full border-4 border-[#f5c542]/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#f5c542]" />
        <div className="absolute inset-5 flex items-center justify-center rounded-full bg-[#08254f] text-2xl font-black text-[#f5c542] shadow-2xl">
          MT
        </div>
      </div>

      <p className="mt-6 text-lg font-bold text-[#f5c542]">{text}</p>
      <p className="mt-2 text-sm text-blue-100">
        Preparing premium Habesha clothing...
      </p>
    </div>
  );
}