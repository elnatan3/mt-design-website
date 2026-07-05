"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabaseClient";

const MT_EMAIL = "mtsupport@mtethiodesign.com";

const standardSizes = ["XS", "S", "M", "L", "XL", "Custom"];
const styles = [
  "As in picture",
  "Custom",
  "V-Neck",
  "Low Back",
  "Tube Dress",
  "Round Neck",
  "Cape",
  "Modern",
  "Traditional",
];
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
  height: string;
  sleeve: string;
  neck: string;
  details: string;
  inquiry: string;
};

export default function CustomOrderPage() {
  const [size, setSize] = useState("M");
  const [style, setStyle] = useState("As in picture");
  const [tibeb, setTibeb] = useState("Hand Tibeb");
  const [color, setColor] = useState("Gold");
  const [groupOrder, setGroupOrder] = useState(false);
  const [consultation, setConsultation] = useState(false);

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
    height: "",
    sleeve: "",
    neck: "",
    details: "",
    inquiry: "",
  });

  useEffect(() => {
    async function loadDefaults() {
      const saved = localStorage.getItem("mt-custom-order-draft");

      if (saved) {
        const draft = JSON.parse(saved);
        setSize(draft.size || "M");
        setStyle(draft.style || "As in picture");
        setTibeb(draft.tibeb || "Hand Tibeb");
        setColor(draft.color || "Gold");
        setGroupOrder(draft.groupOrder || false);
        setConsultation(draft.consultation || false);
        setForm(draft.form);
        setInspiration(draft.inspiration);
      }

      const { data: userData } = await supabase.auth.getUser();

      if (userData.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userData.user.id)
          .single();

        if (profile) {
          setSize(profile.default_size || "M");
          setStyle(profile.default_style || "As in picture");
          setTibeb(profile.default_tibeb || "Hand Tibeb");
          setColor(profile.default_color || "Gold");

          setForm((prev) => ({
            ...prev,
            name: profile.full_name || prev.name,
            phone: profile.phone || prev.phone,
            email: profile.email || userData.user?.email || prev.email,
            location: profile.location || prev.location,
            bust: profile.measurements?.bust || prev.bust,
            waist: profile.measurements?.waist || prev.waist,
            hip: profile.measurements?.hip || prev.hip,
            shoulder: profile.measurements?.shoulder || prev.shoulder,
            dressLength: profile.measurements?.dressLength || prev.dressLength,
            height: profile.measurements?.height || prev.height,
            sleeve: profile.measurements?.sleeve || prev.sleeve,
            neck: profile.measurements?.neck || prev.neck,
            details: profile.preferences || prev.details,
          }));
        }
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

        setForm((prev) => ({
          ...prev,
          details: `I want to customize a design inspired by: ${title}.`,
          inquiry: `Gallery inspiration: ${title}`,
        }));
      }
    }

    loadDefaults();
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
      JSON.stringify({
        size,
        style,
        tibeb,
        color,
        groupOrder,
        consultation,
        form,
        inspiration,
      })
    );

    showNotice("Draft saved successfully.");
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
CUSTOMER INFORMATION
━━━━━━━━━━━━━━━━━━━━
Name: ${form.name}
Phone: ${form.phone}
Email: ${form.email}
Location: ${form.location}

━━━━━━━━━━━━━━━━━━━━
DESIGN SELECTION
━━━━━━━━━━━━━━━━━━━━
Size: ${size}
Style: ${style}
Tibeb Type: ${tibeb}
Color: ${color}
Group Order: ${groupOrder ? "Yes" : "No"}
Consultation Requested: ${consultation ? "Yes" : "No"}

━━━━━━━━━━━━━━━━━━━━
CUSTOM MEASUREMENTS — OPTIONAL, IN CM
━━━━━━━━━━━━━━━━━━━━
Bust: ${form.bust || "Not provided"}
Waist: ${form.waist || "Not provided"}
Hip: ${form.hip || "Not provided"}
Shoulder: ${form.shoulder || "Not provided"}
Dress Length: ${form.dressLength || "Not provided"}
Height: ${form.height || "Not provided"}
Sleeve: ${form.sleeve || "Not provided"}
Neck: ${form.neck || "Not provided"}

━━━━━━━━━━━━━━━━━━━━
DESIGN DETAILS
━━━━━━━━━━━━━━━━━━━━
${form.details || "No extra design details provided."}

━━━━━━━━━━━━━━━━━━━━
CUSTOMER INQUIRY
━━━━━━━━━━━━━━━━━━━━
${form.inquiry || "No inquiry provided."}

━━━━━━━━━━━━━━━━━━━━
INSPIRATION IMAGE
━━━━━━━━━━━━━━━━━━━━
${inspirationUrl || "No inspiration image provided."}

Gallery Inspiration:
${inspiration.title || "None"}

Thank you,
MT Design Website`;
  }

  function openGmail(inspirationUrl: string) {
    const subject = `New MT Design Custom Order - ${form.name || "Customer"}`;
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

    const { data: authData } = await supabase.auth.getUser();

    let inspirationUrl = inspiration.imageUrl;

    if (file) {
      const path = `orders/${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("mt-images")
        .upload(path, file);

      if (error) {
        alert(error.message);
        setSubmitting(false);
        return;
      }

      const { data } = supabase.storage.from("mt-images").getPublicUrl(path);
      inspirationUrl = data.publicUrl;
    }

    const { error } = await supabase.from("custom_orders").insert({
      user_id: authData.user?.id || null,
      name: form.name,
      phone: form.phone,
      email: form.email,
      location: form.location,
      size,
      style,
      tibeb,
      color,
      group_order: groupOrder,
      consultation_requested: consultation,
      measurements: {
        bust: form.bust || "",
        waist: form.waist || "",
        hip: form.hip || "",
        shoulder: form.shoulder || "",
        dressLength: form.dressLength || "",
        height: form.height || "",
        sleeve: form.sleeve || "",
        neck: form.neck || "",
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
            Choose a gallery design or upload your own inspiration image. If you
            are logged in, your saved profile details will automatically prefill.
          </p>

          {notice && (
            <div className="mt-6 rounded-2xl border border-green-400/40 bg-green-500/10 p-4 text-sm font-bold text-green-300">
              ✅ {notice}
            </div>
          )}

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <a
              href="/gallery"
              className="rounded-3xl border border-[#f5c542]/40 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-[#f5c542]"
            >
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f5c542]">
                Browse Gallery
              </p>
              <h2 className="mt-3 text-2xl font-black">
                Choose MT Design Inspiration
              </h2>
              <p className="mt-3 text-blue-100">
                Pick from our gallery and return with the selected design.
              </p>
            </a>

            <div className="rounded-3xl border border-[#f5c542]/40 bg-white/5 p-6">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f5c542]">
                Use Your Own Image
              </p>
              <h2 className="mt-3 text-2xl font-black">Upload Inspiration</h2>

              <input
                type="file"
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const selected = e.target.files?.[0] || null;
                  setFile(selected);
                  setFilePreview(selected ? URL.createObjectURL(selected) : "");
                }}
                className="mt-5 w-full rounded-2xl border border-white/20 bg-white/10 p-4 text-sm"
              />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-3xl border border-[#f5c542]/40 bg-white/5 p-5 sm:p-6">
              <h2 className="text-2xl font-bold text-[#f5c542]">
                Design Preview
              </h2>

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
              <h2 className="text-2xl font-bold text-[#f5c542]">
                Order Details
              </h2>

              <OptionGroup title="Choose Size" items={standardSizes} value={size} setValue={setSize} />

              <p className="mt-3 text-sm text-blue-100 underline">
                Size Guide Coming Soon
              </p>

              <OptionGroup title="Choose Style" items={styles} value={style} setValue={setStyle} />
              <OptionGroup title="Tibeb Type" items={tibebTypes} value={tibeb} setValue={setTibeb} />
              <OptionGroup title="Color" items={colors} value={color} setValue={setColor} />

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Name" value={form.name} onChange={(v: string) => updateField("name", v)} />
                <Input label="Phone Number" value={form.phone} onChange={(v: string) => updateField("phone", v)} />
                <Input label="Location" value={form.location} onChange={(v: string) => updateField("location", v)} />
                <Input label="Email" value={form.email} onChange={(v: string) => updateField("email", v)} />
              </div>

              <div className="mt-8">
                <h3 className="mb-2 font-bold uppercase tracking-wider text-[#f5c542]">
                  Custom Measurements{" "}
                  <span className="text-blue-100">(Optional, cm)</span>
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Bust (cm) - Optional" value={form.bust} onChange={(v: string) => updateField("bust", v)} />
                  <Input label="Waist (cm) - Optional" value={form.waist} onChange={(v: string) => updateField("waist", v)} />
                  <Input label="Hip (cm) - Optional" value={form.hip} onChange={(v: string) => updateField("hip", v)} />
                  <Input label="Shoulder (cm) - Optional" value={form.shoulder} onChange={(v: string) => updateField("shoulder", v)} />
                  <Input label="Dress Length (cm) - Optional" value={form.dressLength} onChange={(v: string) => updateField("dressLength", v)} />
                  <Input label="Height (cm) - Optional" value={form.height} onChange={(v: string) => updateField("height", v)} />
                  <Input label="Sleeve (cm) - Optional" value={form.sleeve} onChange={(v: string) => updateField("sleeve", v)} />
                  <Input label="Neck (cm) - Optional" value={form.neck} onChange={(v: string) => updateField("neck", v)} />
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <label className="rounded-2xl bg-white/5 p-4 font-bold text-blue-100">
                  <input
                    type="checkbox"
                    checked={groupOrder}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setGroupOrder(e.target.checked)
                    }
                    className="mr-2"
                  />
                  Group Order
                </label>

                <label className="rounded-2xl bg-white/5 p-4 font-bold text-blue-100">
                  <input
                    type="checkbox"
                    checked={consultation}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setConsultation(e.target.checked)
                    }
                    className="mr-2"
                  />
                  Request Consultation
                </label>
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
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
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        rows={5}
        className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-[#04142c] outline-none"
      />
    </label>
  );
}