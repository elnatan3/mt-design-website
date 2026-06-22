"use client";

import { useState } from "react";
import type { Product } from "../data/products";

const sizeGuide = [
  { size: "XS", bust: "32", waist: "24", hip: "34" },
  { size: "S", bust: "34", waist: "26", hip: "36" },
  { size: "M", bust: "36", waist: "28", hip: "38" },
  { size: "L", bust: "39", waist: "31", hip: "41" },
  { size: "XL", bust: "42", waist: "34", hip: "44" },
];

export default function ProductCard({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [showGuide, setShowGuide] = useState(false);

  const message = encodeURIComponent(
    `Hello MT Design, I am interested in this ready-made dress:

Product: ${product.name}
Product ID: ${product.id}
Price: $${product.price}
Size: ${selectedSize}
Color: ${selectedColor.name}
Availability: ${product.availability}`
  );

  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-2 hover:border-[#f5c542]/70">
      <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[#d9d0bf] text-[#04142c] sm:h-72">
        <div className="absolute left-4 top-4 rounded-full bg-[#04142c] px-3 py-1 text-xs font-bold text-[#f5c542]">
          {product.availability}
        </div>

        <div className="text-center transition duration-500 group-hover:scale-110">
          <svg viewBox="0 0 220 300" className="mx-auto h-48 w-36 sm:h-52 sm:w-40">
            <path
              d="M75 50 H145 L180 260 Q110 290 40 260 Z"
              fill="white"
              stroke="#cbd5e1"
              strokeWidth="3"
            />
            <path
              d="M88 50 L110 95 L132 50"
              fill="none"
              stroke={selectedColor.value}
              strokeWidth="7"
            />
            <rect x="104" y="90" width="12" height="130" rx="6" fill={selectedColor.value} />
            <rect x="65" y="145" width="90" height="12" rx="6" fill={selectedColor.value} />
          </svg>
          <p className="mt-2 font-bold">{selectedColor.name} Tibeb</p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase text-[#f5c542] sm:text-sm">
            {product.category}
          </p>
          <p className="text-xs text-blue-100 sm:text-sm">
            ⭐ {product.rating} ({product.reviews})
          </p>
        </div>

        <h3 className="mt-2 text-xl font-black text-white sm:text-2xl">
          {product.name}
        </h3>

        <p className="mt-3 text-sm leading-6 text-blue-100">
          {product.description}
        </p>

        <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xl font-black text-[#f5c542]">${product.price}</p>
          <p className="text-xs text-blue-100">{product.delivery}</p>
        </div>

        <p className="mt-2 text-xs text-green-300">
          Only {product.stock} left ready-made
        </p>

        <div className="mt-5">
          <p className="mb-2 text-sm font-bold text-[#f5c542]">Choose Color</p>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => (
              <button
                key={color.name}
                type="button"
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
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold text-[#f5c542]">Choose Size</p>
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="text-sm text-blue-100 underline"
            >
              Size Guide
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
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

        {showGuide && (
          <div className="mt-5 rounded-2xl bg-[#04142c] p-4">
            <p className="mb-3 font-bold text-[#f5c542]">Size Guide</p>
            <div className="overflow-x-auto">
              <table className="min-w-[420px] w-full text-sm text-blue-100">
                <thead>
                  <tr className="text-[#f5c542]">
                    <th className="py-2 text-left">Size</th>
                    <th className="text-left">Bust</th>
                    <th className="text-left">Waist</th>
                    <th className="text-left">Hip</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeGuide.map((row) => (
                    <tr key={row.size} className="border-t border-white/10">
                      <td className="py-2">{row.size}</td>
                      <td>{row.bust}"</td>
                      <td>{row.waist}"</td>
                      <td>{row.hip}"</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <a
              href="/custom-order"
              className="mt-4 block rounded-full border border-[#f5c542] px-4 py-2 text-center text-sm font-bold text-[#f5c542]"
            >
              Need custom measurements?
            </a>
          </div>
        )}

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