"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabaseClient";

type Measurements = {
  bust: string;
  waist: string;
  hip: string;
  shoulder: string;
  dressLength: string;
  height: string;
  sleeve: string;
  neck: string;
};

type ProfileForm = {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  default_size: string;
  default_style: string;
  default_tibeb: string;
  default_color: string;
  preferences: string;
  measurements: Measurements;
};

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const [profile, setProfile] = useState<ProfileForm>({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    default_size: "M",
    default_style: "As in picture",
    default_tibeb: "Hand Tibeb",
    default_color: "Gold",
    preferences: "",
    measurements: {
      bust: "",
      waist: "",
      hip: "",
      shoulder: "",
      dressLength: "",
      height: "",
      sleeve: "",
      neck: "",
    },
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      window.location.href = "/login";
      return;
    }

    setUser(data.user);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileData) {
      setProfile((prev) => ({
        ...prev,
        ...profileData,
        email: profileData.email || data.user?.email || "",
        measurements: {
          ...prev.measurements,
          ...(profileData.measurements || {}),
        },
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        email: data.user?.email || "",
      }));
    }

    const { data: orderData } = await supabase
      .from("custom_orders")
      .select("*")
      .eq("user_id", data.user.id)
      .order("created_at", { ascending: false });

    setOrders(orderData || []);

    const { data: consultationData } = await supabase
      .from("consultations")
      .select("*")
      .eq("user_id", data.user.id)
      .order("selected_date", { ascending: true });

    setConsultations(consultationData || []);
  }

  function updateProfileField(key: keyof ProfileForm, value: string) {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function updateMeasurement(key: keyof Measurements, value: string) {
    setProfile((prev) => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [key]: value,
      },
    }));
  }

  async function saveProfile() {
    if (!user) return;

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      email: profile.email || user.email,
      full_name: profile.full_name,
      phone: profile.phone,
      location: profile.location,
      default_size: profile.default_size,
      default_style: profile.default_style,
      default_tibeb: profile.default_tibeb,
      default_color: profile.default_color,
      preferences: profile.preferences,
      measurements: profile.measurements,
      role: "customer",
    });

    if (error) {
      alert(error.message);
      return;
    }

    setMessage("Profile saved successfully.");
    setTimeout(() => setMessage(""), 3000);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-[#04142c] text-white">
      <Navbar />

      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f5c542]">
                Customer Dashboard
              </p>
              <h1 className="mt-3 text-4xl font-black">
                My MT Design Profile
              </h1>
            </div>

            <button
              onClick={logout}
              className="rounded-full border border-[#f5c542] px-6 py-3 font-bold text-[#f5c542]"
            >
              Logout
            </button>
          </div>

          {message && (
            <div className="mt-6 rounded-2xl border border-green-400/40 bg-green-500/10 p-4 font-bold text-green-300">
              ✅ {message}
            </div>
          )}

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-3xl border border-[#f5c542]/40 bg-white/5 p-6">
              <h2 className="text-2xl font-bold text-[#f5c542]">
                Personal Information
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Input label="Full Name" value={profile.full_name} onChange={(v: string) => updateProfileField("full_name", v)} />
                <Input label="Email" value={profile.email || user?.email || ""} onChange={(v: string) => updateProfileField("email", v)} />
                <Input label="Phone" value={profile.phone} onChange={(v: string) => updateProfileField("phone", v)} />
                <Input label="Location" value={profile.location} onChange={(v: string) => updateProfileField("location", v)} />
              </div>

              <h2 className="mt-10 text-2xl font-bold text-[#f5c542]">
                Default Custom Order Details
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Select
                  label="Default Size"
                  value={profile.default_size}
                  options={["XS", "S", "M", "L", "XL", "Custom"]}
                  onChange={(v: string) => updateProfileField("default_size", v)}
                />

                <Select
                  label="Default Style"
                  value={profile.default_style}
                  options={[
                    "As in picture",
                    "Custom",
                    "V-Neck",
                    "Low Back",
                    "Tube Dress",
                    "Round Neck",
                    "Cape",
                    "Modern",
                    "Traditional",
                  ]}
                  onChange={(v: string) => updateProfileField("default_style", v)}
                />

                <Select
                  label="Default Tibeb"
                  value={profile.default_tibeb}
                  options={["Hand Tibeb", "Machine Tibeb", "Mixed"]}
                  onChange={(v: string) => updateProfileField("default_tibeb", v)}
                />

                <Select
                  label="Default Color"
                  value={profile.default_color}
                  options={["Gold", "Blue", "Green", "Red", "Purple", "Black", "Custom"]}
                  onChange={(v: string) => updateProfileField("default_color", v)}
                />
              </div>

              <h2 className="mt-10 text-2xl font-bold text-[#f5c542]">
                Saved Measurements
              </h2>

              <p className="mt-2 text-sm text-blue-100">
                All measurements are optional and saved in centimeters.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Input label="Bust (cm)" value={profile.measurements.bust} onChange={(v: string) => updateMeasurement("bust", v)} />
                <Input label="Waist (cm)" value={profile.measurements.waist} onChange={(v: string) => updateMeasurement("waist", v)} />
                <Input label="Hip (cm)" value={profile.measurements.hip} onChange={(v: string) => updateMeasurement("hip", v)} />
                <Input label="Shoulder (cm)" value={profile.measurements.shoulder} onChange={(v: string) => updateMeasurement("shoulder", v)} />
                <Input label="Dress Length (cm)" value={profile.measurements.dressLength} onChange={(v: string) => updateMeasurement("dressLength", v)} />
                <Input label="Height (cm)" value={profile.measurements.height} onChange={(v: string) => updateMeasurement("height", v)} />
                <Input label="Sleeve (cm)" value={profile.measurements.sleeve} onChange={(v: string) => updateMeasurement("sleeve", v)} />
                <Input label="Neck (cm)" value={profile.measurements.neck} onChange={(v: string) => updateMeasurement("neck", v)} />
              </div>

              <label className="mt-6 block">
                <span className="mb-2 block text-sm font-bold text-[#f5c542]">
                  Preferences
                </span>

                <textarea
                  value={profile.preferences}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    updateProfileField("preferences", e.target.value)
                  }
                  rows={5}
                  className="w-full rounded-xl bg-white px-4 py-3 text-[#04142c]"
                  placeholder="Example: I prefer gold Tibeb, modest neckline, long sleeves..."
                />
              </label>

              <button
                onClick={saveProfile}
                className="mt-6 rounded-full bg-[#f5c542] px-8 py-4 font-bold text-[#04142c]"
              >
                Save Profile
              </button>
            </section>

            <section className="space-y-6">
              <div className="rounded-3xl border border-[#f5c542]/40 bg-white/5 p-6">
                <h2 className="text-2xl font-bold text-[#f5c542]">
                  Quick Actions
                </h2>

                <a
                  href="/custom-order"
                  className="mt-5 block rounded-full bg-[#f5c542] px-6 py-4 text-center font-bold text-[#04142c]"
                >
                  Start Custom Order
                </a>

                <a
                  href="/consultation"
                  className="mt-3 block rounded-full border border-[#f5c542] px-6 py-4 text-center font-bold text-[#f5c542]"
                >
                  Book Consultation
                </a>
              </div>

              <div className="rounded-3xl border border-[#f5c542]/40 bg-white/5 p-6">
                <h2 className="text-2xl font-bold text-[#f5c542]">
                  My Orders
                </h2>

                <div className="mt-5 space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="rounded-2xl bg-[#08254f] p-4">
                      <p className="font-bold">{order.style || "Custom Order"}</p>
                      <p className="text-sm text-blue-100">
                        {order.size} • {order.tibeb} • {order.color}
                      </p>
                      <p className="mt-2 text-sm text-[#f5c542]">
                        Status: {order.status || "New"}
                      </p>
                    </div>
                  ))}

                  {orders.length === 0 && (
                    <p className="text-blue-100">No orders yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-[#f5c542]/40 bg-white/5 p-6">
                <h2 className="text-2xl font-bold text-[#f5c542]">
                  My Consultations
                </h2>

                <div className="mt-5 space-y-4">
                  {consultations.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="rounded-2xl bg-[#08254f] p-4"
                    >
                      <p className="font-bold">
                        {meeting.selected_date} at {meeting.selected_time}
                      </p>
                      <p className="text-sm text-blue-100">
                        {meeting.notes || "No notes provided."}
                      </p>
                      <p className="mt-2 text-sm text-[#f5c542]">
                        Status: {meeting.status || "Upcoming"}
                      </p>
                    </div>
                  ))}

                  {consultations.length === 0 && (
                    <p className="text-blue-100">No consultations yet.</p>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
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
        className="w-full rounded-xl bg-white px-4 py-3 text-[#04142c]"
      />
    </label>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#f5c542]">
        {label}
      </span>

      <select
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onChange(e.target.value)
        }
        className="w-full rounded-xl bg-white px-4 py-3 text-[#04142c]"
      >
        {options.map((option: string) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}