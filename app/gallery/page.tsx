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

  useEffect(() => {
    loadGallery();
  }, []);

  async function loadGallery() {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setGallery(data || []);
  }

  const categories = ["All", ...Array.from(new Set(gallery.map((g) => g.category)))];

  const filtered = useMemo(() => {
    return gallery.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesSearch =
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.category?.toLowerCase().includes(search.toLowerCase()) ||
        item.color?.toLowerCase().includes(search.toLowerCase());

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
            Search and filter MT Design photos uploaded from the admin dashboard.
          </p>

          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search wedding, gold, blue..."
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

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 ${
                  i % 3 === 0 ? "h-96" : "h-72"
                }`}
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#04142c]/80 to-transparent" />

                <div className="absolute bottom-5 left-5 text-left">
                  <h2 className="font-black">{item.title}</h2>
                  <p className="text-sm text-blue-100">
                    {item.category} • {item.color}
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
        </div>
      </section>

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-4xl rounded-3xl bg-[#d9d0bf] p-4 text-[#04142c]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute right-5 top-5 rounded-full bg-[#04142c] px-4 py-2 font-bold text-white"
            >
              ✕
            </button>

            <img
              src={selected.image_url}
              alt={selected.title}
              className="max-h-[75vh] w-full rounded-2xl object-contain"
            />

            <h2 className="mt-4 text-2xl font-black">{selected.title}</h2>
            <p>{selected.category} • {selected.color}</p>

            <a
              href="/custom-order"
              className="mt-6 inline-block rounded-full bg-[#04142c] px-8 py-4 font-bold text-[#f5c542]"
            >
              Request Similar Design
            </a>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}