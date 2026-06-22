"use client";

import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const standardSizes = ["XS", "S", "M", "L", "XL", "Custom"];
const styles = ["V-Neck", "Low Back", "Tube Dress", "Round Neck", "Cape", "Modern", "Traditional"];
const tibebTypes = ["Hand Tibeb", "Machine Tibeb", "Mixed"];
const colors = ["Gold", "Blue", "Green", "Red", "Purple", "Black"];

export default function CustomOrderPage() {
  const [size, setSize] = useState("M");
  const [style, setStyle] = useState("V-Neck");
  const [tibeb, setTibeb] = useState("Hand Tibeb");
  const [color, setColor] = useState("Gold");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    location: "",
    bust: "",
    waist: "",
    hip: "",
    shoulder: "",
    dressLength: "",
    details: "",
    inquiry: "",
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const whatsappText = useMemo(() => {
    return encodeURIComponent(
      `Hello MT Design, I want to place a custom order.

Customer Details:
Name: ${form.name}
Phone: ${form.phone}
WhatsApp: ${form.whatsapp}
Location: ${form.location}

Design:
Size: ${size}
Style: ${style}
Tibeb Type: ${tibeb}
Color: ${color}

Measurements:
Bust: ${form.bust}
Waist: ${form.waist}
Hip: ${form.hip}
Shoulder: ${form.shoulder}
Dress Length: ${form.dressLength}

Design Details:
${form.details}

Inquiry:
${form.inquiry}`
    );
  }, [form, size, style, tibeb, color]);

  return (
    <main className="min-h-screen bg-[#04142c] text-white">
      <Navbar />

      <section className="px-4 py-10 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-black sm:text-6xl">Custom Order</h1>
          <p className="mt-4 max-w-2xl text-blue-100">
            Choose your size, style, Tibeb type, color, measurements,
            inspiration image, and personal details.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-3xl border border-[#f5c542]/40 bg-white/5 p-5 sm:p-6">
              <h2 className="text-2xl font-bold text-[#f5c542]">
                Design Preview
              </h2>

              <div className="mt-6 flex min-h-[360px] items-center justify-center rounded-3xl bg-[#d9d0bf] p-4 text-[#04142c] sm:min-h-[500px] sm:p-6">
                <div className="text-center">
                  <div className="text-7xl">👗</div>
                  <p className="mt-6 text-2xl font-black">{style}</p>
                  <p className="mt-2">{size} • {tibeb} • {color}</p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-[#f5c542]/40 bg-white/5 p-5 sm:p-6">
              <h2 className="text-2xl font-bold text-[#f5c542]">
                Order Details
              </h2>

              <OptionGroup title="Choose Size" items={standardSizes} value={size} setValue={setSize} />
              <OptionGroup title="Choose Style" items={styles} value={style} setValue={setStyle} />
              <OptionGroup title="Tibeb Type" items={tibebTypes} value={tibeb} setValue={setTibeb} />
              <OptionGroup title="Color" items={colors} value={color} setValue={setColor} />

              <div className="mt-8">
                <h3 className="mb-4 font-bold uppercase tracking-wider text-[#f5c542]">
                  Upload Inspiration Image
                </h3>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full rounded-2xl border border-white/20 bg-white/10 p-4 text-sm"
                />
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Name" value={form.name} onChange={(v) => updateField("name", v)} />
                <Input label="Phone Number" value={form.phone} onChange={(v) => updateField("phone", v)} />
                <Input label="WhatsApp Number" value={form.whatsapp} onChange={(v) => updateField("whatsapp", v)} />
                <Input label="Location" value={form.location} onChange={(v) => updateField("location", v)} />
              </div>

              <div className="mt-8">
                <h3 className="mb-4 font-bold uppercase tracking-wider text-[#f5c542]">
                  Custom Measurements
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Bust" value={form.bust} onChange={(v) => updateField("bust", v)} />
                  <Input label="Waist" value={form.waist} onChange={(v) => updateField("waist", v)} />
                  <Input label="Hip" value={form.hip} onChange={(v) => updateField("hip", v)} />
                  <Input label="Shoulder" value={form.shoulder} onChange={(v) => updateField("shoulder", v)} />
                  <Input label="Dress Length" value={form.dressLength} onChange={(v) => updateField("dressLength", v)} />
                </div>
              </div>

              <TextArea
                label="Design Details"
                value={form.details}
                onChange={(v) => updateField("details", v)}
                placeholder="Example: I want a V-neck dress, gold Tibeb, long sleeves, low back..."
              />

              <TextArea
                label="Inquiry"
                value={form.inquiry}
                onChange={(v) => updateField("inquiry", v)}
                placeholder="Ask about price, shipping, timing, wedding date, or anything else..."
              />

              <a
                href={`https://wa.me/YOURNUMBER?text=${whatsappText}`}
                className="mt-8 block rounded-full bg-[#f5c542] px-8 py-4 text-center font-bold text-[#04142c]"
              >
                Send Custom Order to WhatsApp
              </a>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function OptionGroup({
  title,
  items,
  value,
  setValue,
}: {
  title: string;
  items: string[];
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <div className="mt-6">
      <h3 className="mb-3 font-bold uppercase tracking-wider text-[#f5c542]">
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setValue(item)}
            className={`rounded-xl border px-4 py-3 text-sm font-bold ${
              value === item
                ? "border-[#f5c542] bg-[#f5c542] text-[#04142c]"
                : "border-white/20 bg-white/5 text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#f5c542]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-[#04142c] outline-none"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="mt-8 block">
      <span className="mb-2 block text-sm font-bold text-[#f5c542]">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-[#04142c] outline-none"
      />
    </label>
  );
}