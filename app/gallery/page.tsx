"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const gallery = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: `MT Design Look ${i + 1}`,
  category: i % 2 === 0 ? "Wedding" : "Graduation",
}));

export default function GalleryPage() {
  const [selected, setSelected] = useState<(typeof gallery)[0] | null>(null);

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
            Click any design to zoom in. Replace placeholders with real MT
            Design photos later.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item)}
                className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 ${
                  i % 3 === 0 ? "h-96" : "h-72"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#d9d0bf] to-[#f5c542]/40 transition duration-500 group-hover:scale-110" />
                <div className="relative flex h-full items-center justify-center text-[#04142c]">
                  <div className="transition duration-500 group-hover:scale-125">
                    <div className="text-7xl">👗</div>
                    <p className="mt-3 font-black">{item.title}</p>
                    <p>{item.category}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 sm:p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-3xl rounded-3xl bg-[#d9d0bf] p-6 text-center text-[#04142c] sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute right-5 top-5 rounded-full bg-[#04142c] px-4 py-2 font-bold text-white"
            >
              ✕
            </button>
            <div className="text-8xl sm:text-9xl">👗</div>
            <h2 className="mt-6 text-2xl font-black sm:text-3xl">
              {selected.title}
            </h2>
            <p className="mt-2">{selected.category}</p>
            <a
              href="/custom-order"
              className="mt-8 inline-block rounded-full bg-[#04142c] px-8 py-4 font-bold text-[#f5c542]"
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