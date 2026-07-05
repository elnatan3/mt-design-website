"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabaseClient";

const MT_EMAIL = "mtsupport@mtethiodesign.com";

const availableTimes = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

export default function ConsultationPage() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    selected_date: "",
    selected_time: "",
    notes: "",
  });

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      window.location.href = "/login";
      return;
    }

    setUser(data.user);

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profile) {
      setForm((prev) => ({
        ...prev,
        name: profile.full_name || "",
        email: profile.email || data.user.email || "",
        phone: profile.phone || "",
      }));
    }
  }

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function openEmail() {
    const subject = `MT Design Consultation Booking - ${form.name}`;

    const body = `Hello MT Design,

A customer booked a consultation from the website.

Customer:
Name: ${form.name}
Email: ${form.email}
Phone: ${form.phone}

Consultation:
Date: ${form.selected_date}
Time: ${form.selected_time}

Notes:
${form.notes || "No notes provided."}

This meeting is also saved in the admin dashboard.

Thank you,
MT Design Website`;

    window.location.href = `mailto:${MT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  async function bookConsultation(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from("consultations").insert({
      user_id: user.id,
      name: form.name,
      email: form.email,
      phone: form.phone,
      selected_date: form.selected_date,
      selected_time: form.selected_time,
      notes: form.notes,
      status: "Upcoming",
    });

    if (error) {
      alert(error.message);
      return;
    }

    openEmail();
  }

  return (
    <main className="min-h-screen bg-[#04142c] text-white">
      <Navbar />

      <section className="px-4 py-12 sm:px-6">
        <form onSubmit={bookConsultation} className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f5c542]">
            Book Consultation
          </p>

          <h1 className="mt-4 text-4xl font-black sm:text-6xl">
            Schedule a Design Consultation
          </h1>

          <p className="mt-5 max-w-2xl leading-8 text-blue-100">
            Choose a date and available time. Your consultation request will be
            saved in the admin dashboard and emailed to MT Design.
          </p>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <section className="rounded-3xl border border-[#f5c542]/40 bg-white/5 p-6">
              <h2 className="text-2xl font-bold text-[#f5c542]">
                Your Information
              </h2>

              <div className="mt-6 grid gap-4">
                <Input label="Name" value={form.name} onChange={(v: string) => updateField("name", v)} />
                <Input label="Email" value={form.email} onChange={(v: string) => updateField("email", v)} />
                <Input label="Phone" value={form.phone} onChange={(v: string) => updateField("phone", v)} />

                <label>
                  <span className="mb-2 block text-sm font-bold text-[#f5c542]">
                    Select Date
                  </span>
                  <input
                    required
                    type="date"
                    value={form.selected_date}
                    onChange={(e) => updateField("selected_date", e.target.value)}
                    className="w-full rounded-xl bg-white px-4 py-3 text-[#04142c]"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-3xl border border-[#f5c542]/40 bg-white/5 p-6">
              <h2 className="text-2xl font-bold text-[#f5c542]">
                Available Times
              </h2>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => updateField("selected_time", time)}
                    className={`rounded-xl border px-4 py-3 font-bold ${
                      form.selected_time === time
                        ? "border-[#f5c542] bg-[#f5c542] text-[#04142c]"
                        : "border-white/20 bg-white/5 text-white"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>

              <label className="mt-6 block">
                <span className="mb-2 block text-sm font-bold text-[#f5c542]">
                  Notes
                </span>
                <textarea
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  rows={5}
                  className="w-full rounded-xl bg-white px-4 py-3 text-[#04142c]"
                  placeholder="Tell us what you want to discuss..."
                />
              </label>

              <button className="mt-6 w-full rounded-full bg-[#f5c542] px-8 py-4 font-bold text-[#04142c]">
                Book Consultation
              </button>
            </section>
          </div>
        </form>
      </section>

      <Footer />
    </main>
  );
}

function Input({ label, value, onChange }: any) {
  return (
    <label>
      <span className="mb-2 block text-sm font-bold text-[#f5c542]">
        {label}
      </span>
      <input
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-white px-4 py-3 text-[#04142c]"
      />
    </label>
  );
}