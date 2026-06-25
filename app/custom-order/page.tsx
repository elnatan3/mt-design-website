"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";

const MT_EMAIL = "mtsupport@mtethiodesign.com";

const standardSizes = ["XS", "S", "M", "L", "XL", "Custom"];
const styles = ["V-Neck", "Low Back", "Tube Dress", "Round Neck", "Cape", "Modern", "Traditional"];
const tibebTypes = ["Hand Tibeb", "Machine Tibeb", "Mixed"];
const colors = ["Gold", "Blue", "Green", "Red", "Purple", "Black", "Custom"];

type Inspiration = {
  id: string;
  title: string;
  category: string;
  color: string;
  imageUrl: string;
};

type OrderForm = {
  name: string;
  phone: string;
  email: string;
  location: string;
  bust: string;
  waist: string;
  hip: string;
  shoulder: string;
  dressLength: string;
  details: string;
  inquiry: string;
};

export default function CustomOrderPage() {
  const [size, setSize] = useState("M");
  const [style, setStyle] = useState("V-Neck");
  const [tibeb, setTibeb] = useState("Hand Tibeb");
  const [color, setColor] = useState("Gold");

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");

  const [inspiration, setInspiration] = useState<Inspiration>({
    id: "",
    title: "",
    category: "",
    color: "",
    imageUrl: "",
  });

  const [form, setForm] = useState<OrderForm>({
    name: "",
    phone: "",
    email: "",
    location: "",
    bust: "",
    waist: "",
    hip: "",
    shoulder: "",
    dressLength: "",
    details: "",
    inquiry: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("mt-custom-order-draft");

    if (saved) {
      const draft = JSON.parse(saved);
      setSize(draft.size || "M");
      setStyle(draft.style || "V-Neck");
      setTibeb(draft.tibeb || "Hand Tibeb");
      setColor(draft.color || "Gold");
      setForm(draft.form);
      setInspiration(draft.inspiration);
    }

    const params = new URLSearchParams(window.location.search);
    const inspirationUrl = params.get("inspirationUrl") || "";

    if (inspirationUrl) {
      const title = params.get("inspirationTitle") || "";
      const category = params.get("inspirationCategory") || "";
      const imageColor = params.get("inspirationColor") || "";

      setInspiration({
        id: params.get("inspirationId") || "",
        title,
        category,
        color: imageColor,
        imageUrl: inspirationUrl,
      });

      if (imageColor) setColor(imageColor);
      if (category) setStyle(category);

      setForm((prev) => ({
        ...prev,
        details: `I want to customize a design inspired by: ${title}.`,
        inquiry: `Gallery inspiration: ${title}`,
      }));
    }
  }, []);

  function updateField(field: keyof OrderForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function showNotice(text: string) {
    setNotice(text);
    setTimeout(() => setNotice(""), 3000);
  }

  function saveDraft() {
    localStorage.setItem(
      "mt-custom-order-draft",
      JSON.stringify({ size, style, tibeb, color, form, inspiration })
    );

    showNotice("Draft saved successfully. You can come back anytime.");
  }

  function clearDraft() {
    localStorage.removeItem("mt-custom-order-draft");
    showNotice("Saved draft cleared.");
  }

  const activePreviewImage = filePreview || inspiration.imageUrl;

  function buildEmailBody(inspirationUrl: string) {
    return `✨ NEW MT DESIGN CUSTOM ORDER ✨

Hello MT Design Team,

A customer submitted a new custom order request from the website.

━━━━━━━━━━━━━━━━━━━━
👤 CUSTOMER INFORMATION
━━━━━━━━━━━━━━━━━━━━
Name: ${form.name}
Phone: ${form.phone}
Email: ${form.email}
Location: ${form.location}

━━━━━━━━━━━━━━━━━━━━
👗 DESIGN SELECTION
━━━━━━━━━━━━━━━━━━━━
Size: ${size}
Style: ${style}
Tibeb Type: ${tibeb}
Color: ${color}

━━━━━━━━━━━━━━━━━━━━
📏 CUSTOM MEASUREMENTS — OPTIONAL, IN CM
━━━━━━━━━━━━━━━━━━━━
Bust: ${form.bust || "Not provided"}
Waist: ${form.waist || "Not provided"}
Hip: ${form.hip || "Not provided"}
Shoulder: ${form.shoulder || "Not provided"}
Dress Length: ${form.dressLength || "Not provided"}

━━━━━━━━━━━━━━━━━━━━
🧵 DESIGN DETAILS
━━━━━━━━━━━━━━━━━━━━
${form.details || "No extra design details provided."}

━━━━━━━━━━━━━━━━━━━━
💬 CUSTOMER INQUIRY
━━━━━━━━━━━━━━━━━━━━
${form.inquiry || "No inquiry provided."}

━━━━━━━━━━━━━━━━━━━━
🖼️ INSPIRATION IMAGE
━━━━━━━━━━━━━━━━━━━━
${inspirationUrl || "No inspiration image provided."}

Gallery Inspiration:
${inspiration.title || "None"}

━━━━━━━━━━━━━━━━━━━━
✅ ADMIN NOTE
━━━━━━━━━━━━━━━━━━━━
This order has also been saved inside the MT Design admin dashboard.

Thank you,
MT Design Website`;
  }

  function openGmail(inspirationUrl: string) {
    const subject = `✨ New MT Design Custom Order - ${form.name || "Customer"}`;
    const body = buildEmailBody(inspirationUrl);

    const gmailUrl =
      `https://mail.google.com/mail/?view=cm&fs=1` +
      `&to=${encodeURIComponent(MT_EMAIL)}` +
      `&su=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.open(gmailUrl, "_blank");
  }

  async function submitOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    let inspirationUrl = inspiration.imageUrl;

    if (file) {
      const path = `orders/${Date.now()}-${file.name}`;

      const { error } = await supabase.storage.from("mt-images").upload(path, file);

      if (error) {
        alert(error.message);
        setSubmitting(false);
        return;
      }

      const { data } = supabase.storage.from("mt-images").getPublicUrl(path);
      inspirationUrl = data.publicUrl;
    }

    const { error } = await supabase.from("custom_orders").insert({
      name: form.name,
      phone: form.phone,
      email: form.email,
      location: form.location,
      size,
      style,
      tibeb,
      color,
      measurements: {
        bust: form.bust || "",
        waist: form.waist || "",
        hip: form.hip || "",
        shoulder: form.shoulder || "",
        dressLength: form.dressLength || "",
        unit: "cm",
      },
      details: form.details,
      inquiry: form.inquiry,
      inspiration_url: inspirationUrl,
      status: "New",
    });

    setSubmitting(false);

    if (error) {
      alert(error.message);
      return;
    }

    localStorage.removeItem("mt-custom-order-draft");
    openGmail(inspirationUrl);
  }

  return (
    <main className="min-h-screen bg-[#04142c] text-white">
      <Navbar />

      <section className="px-4 py-10 sm:px-6 sm:py-16">
        <form onSubmit={submitOrder} className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-black sm:text-6xl">Custom Order</h1>

          <p className="mt-4 max-w-2xl text-blue-100">
            Choose a gallery design or upload your own inspiration image. Your
            order will be saved and opened in Gmail as a professional email to
            MT Design.
          </p>

          {notice && (
            <div className="mt-6 rounded-2xl border border-green-400/40 bg-green-500/10 p-4 text-sm font-bold text-green-300 shadow-lg">
              ✅ {notice}
            </div>
          )}

          <div className="mt-8 rounded-3xl border border-[#f5c542]/40 bg-white/5 p-5">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f5c542]">
              Start With Inspiration
            </p>

            <h2 className="mt-3 text-2xl font-black">
              Choose from gallery or upload your own
            </h2>

            <p className="mt-3 leading-7 text-blue-100">
              If you upload your own image, it will replace the gallery
              inspiration in the preview and final order.
            </p>

            <a
              href="/gallery"
              className="mt-5 inline-block rounded-full bg-[#f5c542] px-6 py-3 font-bold text-[#04142c]"
            >
              Browse Gallery for Inspiration
            </a>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-3xl border border-[#f5c542]/40 bg-white/5 p-5 sm:p-6">
              <h2 className="text-2xl font-bold text-[#f5c542]">Design Preview</h2>

              <div className="mt-6 flex min-h-[360px] items-center justify-center rounded-3xl bg-[#d9d0bf] p-4 text-[#04142c] sm:min-h-[500px]">
                {activePreviewImage ? (
                  <img
                    src={activePreviewImage}
                    alt="Selected inspiration"
                    className="max-h-[460px] max-w-full rounded-2xl object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-6xl">✨</div>
                    <p className="mt-6 text-2xl font-black">
                      No inspiration selected yet
                    </p>
                    <p className="mt-2 max-w-md">
                      Choose a gallery design or upload your own image.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-5 rounded-2xl bg-[#08254f] p-4">
                <p className="font-bold text-[#f5c542]">Selected Details</p>
                <p className="mt-2 text-sm text-blue-100">
                  {style} • {size} • {tibeb} • {color}
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-[#f5c542]/40 bg-white/5 p-5 sm:p-6">
              <h2 className="text-2xl font-bold text-[#f5c542]">Order Details</h2>

              <OptionGroup title="Choose Size" items={standardSizes} value={size} setValue={setSize} />
              <OptionGroup title="Choose Style" items={styles} value={style} setValue={setStyle} />
              <OptionGroup title="Tibeb Type" items={tibebTypes} value={tibeb} setValue={setTibeb} />
              <OptionGroup title="Color" items={colors} value={color} setValue={setColor} />

              <div className="mt-8">
                <h3 className="mb-4 font-bold uppercase tracking-wider text-[#f5c542]">
                  Upload Your Own Inspiration Image
                </h3>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const selected = e.target.files?.[0] || null;
                    setFile(selected);

                    if (selected) {
                      setFilePreview(URL.createObjectURL(selected));
                    } else {
                      setFilePreview("");
                    }
                  }}
                  className="w-full rounded-2xl border border-white/20 bg-white/10 p-4 text-sm"
                />

                {filePreview && (
                  <div className="mt-5 rounded-2xl border border-[#f5c542]/40 bg-[#08254f] p-4">
                    <p className="mb-3 font-bold text-[#f5c542]">
                      Uploaded Inspiration Preview
                    </p>
                    <img
                      src={filePreview}
                      alt="Uploaded inspiration"
                      className="max-h-[420px] w-full rounded-xl object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Name" value={form.name} onChange={(v: string) => updateField("name", v)} />
                <Input label="Phone Number" value={form.phone} onChange={(v: string) => updateField("phone", v)} />
                <Input label="Location" value={form.location} onChange={(v: string) => updateField("location", v)} />
                <Input label="Email" value={form.email} onChange={(v: string) => updateField("email", v)} />
              </div>

              <div className="mt-8">
                <h3 className="mb-2 font-bold uppercase tracking-wider text-[#f5c542]">
                  Custom Measurements <span className="text-blue-100">(Optional)</span>
                </h3>

                <p className="mb-4 text-sm text-blue-100">
                  Measurements are optional. If you know them, enter them in centimeters (cm).
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Bust (cm) - Optional" value={form.bust} onChange={(v: string) => updateField("bust", v)} />
                  <Input label="Waist (cm) - Optional" value={form.waist} onChange={(v: string) => updateField("waist", v)} />
                  <Input label="Hip (cm) - Optional" value={form.hip} onChange={(v: string) => updateField("hip", v)} />
                  <Input label="Shoulder (cm) - Optional" value={form.shoulder} onChange={(v: string) => updateField("shoulder", v)} />
                  <Input label="Dress Length (cm) - Optional" value={form.dressLength} onChange={(v: string) => updateField("dressLength", v)} />
                </div>
              </div>

              <TextArea
                label="Design Details"
                value={form.details}
                onChange={(v: string) => updateField("details", v)}
                placeholder="Example: I want gold Tibeb, long sleeves, low back..."
              />

              <TextArea
                label="Inquiry"
                value={form.inquiry}
                onChange={(v: string) => updateField("inquiry", v)}
                placeholder="Ask about price, shipping, timing, wedding date..."
              />

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={saveDraft}
                  className="rounded-full border border-[#f5c542] px-6 py-4 font-bold text-[#f5c542]"
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  onClick={clearDraft}
                  className="rounded-full border border-white/20 px-6 py-4 font-bold text-blue-100"
                >
                  Clear Saved Draft
                </button>
              </div>

              <button
                disabled={submitting}
                className="mt-5 block w-full rounded-full bg-[#f5c542] px-8 py-4 text-center font-bold text-[#04142c] disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Order in Gmail"}
              </button>
            </section>
          </div>
        </form>
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
        {items.map((item: string) => (
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

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#f5c542]">
        {label}
      </span>
      <input
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
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
      <span className="mb-2 block text-sm font-bold text-[#f5c542]">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-[#04142c] outline-none"
      />
    </label>
  );
}