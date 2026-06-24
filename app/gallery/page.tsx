"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";

type GalleryItem = {
  id: string;
  title: string;
  category: string;
  color: string;
  image_url: string;
};

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGallery();
  }, []);

  async function loadGallery() {
    setLoading(true);

    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setGallery(data || []);

    setLoading(false);
  }

  const categories = [
    "All",
    ...Array.from(new Set(gallery.map((g) => g.category).filter(Boolean))),
  ];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return gallery.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;

      const matchesSearch =
        item.title?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.color?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [gallery, category, search]);

  return (
    <main className="min-h-screen bg-[#04142c] text-white">
      <Navbar />

      <section className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f5c542]">
            Gallery
          </p>

          <h1 className="mt-4 text-4xl font-black sm:text-5xl">
            MT Design Showcase
          </h1>

          <p className="mt-5 max-w-2xl text-blue-100">
            Browse real MT Design photos. Click any image to view it larger
            without cropping.
          </p>

          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search wedding, gold, blue..."
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
            <LuxuryLoader text="Loading MT Design gallery..." />
          ) : (
            <>
              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelected(item)}
                    className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left transition hover:-translate-y-1 hover:border-[#f5c542]/60"
                  >
                    <div className="flex h-[360px] items-center justify-center bg-[#d9d0bf] p-3 sm:h-[420px]">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="max-h-full max-w-full rounded-2xl object-contain transition duration-500 group-hover:scale-[1.03]"
                      />
                    </div>

                    <div className="p-5">
                      <h2 className="text-xl font-black text-white">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm text-blue-100">
                        {item.category} • {item.color}
                      </p>
                      <p className="mt-4 text-sm font-bold text-[#f5c542]">
                        Click to zoom →
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {filtered.length === 0 && (
                <p className="mt-12 text-center text-blue-100">
                  No gallery photos found.
                </p>
              )}
            </>
          )}
        </div>
      </section>

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-5xl rounded-3xl bg-[#d9d0bf] p-4 text-[#04142c] sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute right-5 top-5 z-10 rounded-full bg-[#04142c] px-4 py-2 font-bold text-white"
            >
              ✕
            </button>

            <div className="flex max-h-[78vh] items-center justify-center">
              <img
                src={selected.image_url}
                alt={selected.title}
                className="max-h-[78vh] max-w-full rounded-2xl object-contain"
              />
            </div>

            <div className="mt-4 rounded-2xl bg-white/60 p-4">
              <h2 className="text-2xl font-black">{selected.title}</h2>
              <p>
                {selected.category} • {selected.color}
              </p>

              <a
                href="/custom-order"
                className="mt-5 inline-block rounded-full bg-[#04142c] px-8 py-4 font-bold text-[#f5c542]"
              >
                Request Similar Design
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
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
        Preparing handcrafted Ethiopian designs...
      </p>
    </div>
  );
}