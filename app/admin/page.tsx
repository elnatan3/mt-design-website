"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const colorMap: Record<string, string> = {
  gold: "#f5c542",
  blue: "#0b3d91",
  green: "#166534",
  red: "#b91c1c",
  purple: "#7e22ce",
  black: "#111827",
  white: "#ffffff",
  cream: "#f5f0dc",
  silver: "#c0c0c0",
};

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkUser();
  }, []);

  function showMessage(text: string) {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  }

  async function checkUser() {
    setLoading(true);
  
    const { data } = await supabase.auth.getUser();
  
    if (!data.user) {
      window.location.href = "/login";
      return;
    }
    
    const email = data.user.email?.toLowerCase().trim() || "";

    const adminEmails =
      process.env.NEXT_PUBLIC_ADMIN_EMAILS?.toLowerCase()
        .split(",")
        .map((e) => e.trim()) || [];
    
    const hardcodedAdmins = ["elnatantesfa21@gmail.com"];
    
    const isAdmin =
      adminEmails.includes(email) || hardcodedAdmins.includes(email);
    
    if (!isAdmin) {
      window.location.href = "/dashboard";
      return;
    }
  
    await supabase.from("profiles").upsert(
      {
        id: data.user.id,
        email,
        full_name:
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          "",
        role: "admin",
      },
      { onConflict: "id" }
    );
  
    setUser(data.user);
    await loadData();
    setLoading(false);
  }

  async function loadData() {
    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: galleryData } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: ordersData } = await supabase
      .from("custom_orders")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: consultationData } = await supabase
      .from("consultations")
      .select("*")
      .order("selected_date", { ascending: true });

    setProducts(productsData || []);
    setGallery(galleryData || []);
    setOrders(ordersData || []);
    setConsultations(consultationData || []);
  }

  async function refreshData() {
    setLoading(true);
    await loadData();
    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    showMessage("Product deleted successfully.");
    refreshData();
  }

  async function deleteGallery(id: string) {
    if (!confirm("Delete this gallery photo?")) return;

    const { error } = await supabase.from("gallery").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    showMessage("Gallery photo deleted successfully.");
    refreshData();
  }

  async function updateOrderStatus(id: string, status: string) {
    const { error } = await supabase
      .from("custom_orders")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    showMessage("Order status updated successfully.");
    refreshData();
  }

  async function updateMeetingStatus(id: string, status: string) {
    const { error } = await supabase
      .from("consultations")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    showMessage("Meeting status updated.");
    refreshData();
  }

  const today = new Date().toISOString().split("T")[0];
  const upcomingMeetings = consultations.filter((m) => m.selected_date >= today);
  const pastMeetings = consultations.filter((m) => m.selected_date < today);

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-[#04142c] px-4 py-10 text-white">
        <LuxuryLoader text="Loading MT Design admin dashboard..." />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#04142c] px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f5c542]">
              Dashboard
            </p>
            <h1 className="mt-3 text-4xl font-black sm:text-5xl">
              MT Design Admin
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
          <div className="mt-6 rounded-2xl border border-green-400/40 bg-green-500/10 p-4 text-sm font-bold text-green-300">
            ✅ {message}
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-4">
          <Stat title="Products" value={products.length} />
          <Stat title="Gallery Photos" value={gallery.length} />
          <Stat title="Custom Orders" value={orders.length} />
          <Stat title="Consultations" value={consultations.length} />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <AddProduct onDone={() => { showMessage("Product uploaded successfully."); refreshData(); }} />
          <AddGallery onDone={() => { showMessage("Gallery photo uploaded successfully."); refreshData(); }} />
        </div>

        <MeetingsSection
          title="Upcoming Meetings"
          meetings={upcomingMeetings}
          updateMeetingStatus={updateMeetingStatus}
        />

        <MeetingsSection
          title="Past Meetings"
          meetings={pastMeetings}
          updateMeetingStatus={updateMeetingStatus}
        />

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <h2 className="text-2xl font-bold text-[#f5c542]">Custom Orders</h2>

          <div className="mt-6 grid grid-cols-1 gap-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl bg-[#08254f] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{order.name}</h3>
                    <p className="text-blue-100">Email: {order.email}</p>
                    <p className="text-blue-100">Phone: {order.phone}</p>
                    <p className="text-blue-100">Location: {order.location}</p>

                    <p className="mt-2 text-blue-100">
                      {order.style} • {order.size} • {order.tibeb} • {order.color}
                    </p>

                    <p className="mt-2 text-sm text-blue-100">
                      Group Order: {order.group_order ? "Yes" : "No"} • Consultation:{" "}
                      {order.consultation_requested ? "Yes" : "No"}
                    </p>

                    <div className="mt-4 rounded-2xl bg-[#04142c] p-4">
                      <p className="font-bold text-[#f5c542]">Measurements</p>
                      <p className="mt-2 text-sm text-blue-100">Bust: {order.measurements?.bust || "Not provided"} cm</p>
                      <p className="text-sm text-blue-100">Waist: {order.measurements?.waist || "Not provided"} cm</p>
                      <p className="text-sm text-blue-100">Hip: {order.measurements?.hip || "Not provided"} cm</p>
                      <p className="text-sm text-blue-100">Shoulder: {order.measurements?.shoulder || "Not provided"} cm</p>
                      <p className="text-sm text-blue-100">Dress Length: {order.measurements?.dressLength || "Not provided"} cm</p>
                      <p className="text-sm text-blue-100">Height: {order.measurements?.height || "Not provided"} cm</p>
                      <p className="text-sm text-blue-100">Sleeve: {order.measurements?.sleeve || "Not provided"} cm</p>
                      <p className="text-sm text-blue-100">Neck: {order.measurements?.neck || "Not provided"} cm</p>
                    </div>

                    <p className="mt-4 text-sm text-blue-100">
                      <span className="font-bold text-[#f5c542]">Details:</span>{" "}
                      {order.details || "No details provided"}
                    </p>

                    <p className="mt-2 text-sm text-blue-100">
                      <span className="font-bold text-[#f5c542]">Inquiry:</span>{" "}
                      {order.inquiry || "No inquiry provided"}
                    </p>

                    {order.inspiration_url && (
                      <img
                        src={order.inspiration_url}
                        alt="Inspiration"
                        className="mt-4 max-h-[520px] w-full max-w-sm rounded-xl bg-[#04142c] object-contain p-2"
                      />
                    )}
                  </div>

                  <div className="min-w-[180px]">
                    <p className="mb-2 font-bold text-[#f5c542]">Status</p>

                    <select
                      value={order.status || "New"}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="w-full rounded-xl bg-white px-4 py-3 text-[#04142c]"
                    >
                      <option>New</option>
                      <option>In Progress</option>
                      <option>Ready</option>
                      <option>Delivered</option>
                    </select>

                    <a
                      href={`mailto:${order.email}?subject=${encodeURIComponent(
                        `Follow up: MT Design Order - ${order.name}`
                      )}&body=${encodeURIComponent(
                        `Hello ${order.name},

Thank you for your custom order request with MT Design.

We are reviewing your design details and will contact you shortly.

Best,
MT Design`
                      )}`}
                      className="mt-4 block rounded-full bg-[#f5c542] px-5 py-3 text-center font-bold text-[#04142c]"
                    >
                      Draft Email Reply
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <ProductsPreview products={products} deleteProduct={deleteProduct} />
        <GalleryPreview gallery={gallery} deleteGallery={deleteGallery} />
      </div>
    </main>
  );
}

function MeetingsSection({ title, meetings, updateMeetingStatus }: any) {
  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
      <h2 className="text-2xl font-bold text-[#f5c542]">{title}</h2>

      <div className="mt-6 grid grid-cols-1 gap-4">
        {meetings.map((meeting: any) => (
          <div key={meeting.id} className="rounded-2xl bg-[#08254f] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="text-xl font-bold">{meeting.name}</h3>
                <p className="text-blue-100">Email: {meeting.email}</p>
                <p className="text-blue-100">Phone: {meeting.phone}</p>
                <p className="mt-2 font-bold text-[#f5c542]">
                  {meeting.selected_date} at {meeting.selected_time}
                </p>
                <p className="mt-3 text-sm text-blue-100">
                  {meeting.notes || "No notes provided."}
                </p>
              </div>

              <select
                value={meeting.status || "Upcoming"}
                onChange={(e) => updateMeetingStatus(meeting.id, e.target.value)}
                className="rounded-xl bg-white px-4 py-3 text-[#04142c]"
              >
                <option>Upcoming</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>
        ))}

        {meetings.length === 0 && (
          <p className="text-blue-100">No meetings found.</p>
        )}
      </div>
    </section>
  );
}

function ProductsPreview({ products, deleteProduct }: any) {
  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
      <h2 className="text-2xl font-bold text-[#f5c542]">Products Preview</h2>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product: any) => (
          <div key={product.id} className="overflow-hidden rounded-3xl border border-white/10 bg-[#08254f]">
            <div className="flex h-[380px] items-center justify-center bg-[#d9d0bf] p-3">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="max-h-full max-w-full rounded-2xl object-contain" />
              ) : (
                <div className="text-7xl">👗</div>
              )}
            </div>

            <div className="p-5">
              <p className="text-sm font-bold uppercase text-[#f5c542]">{product.category}</p>
              <h3 className="mt-2 text-2xl font-black">{product.name}</h3>
              <p className="mt-3 text-sm leading-6 text-blue-100">{product.description}</p>
              <p className="mt-4 text-3xl font-black text-[#f5c542]">${product.price}</p>
              <p className="mt-2 text-sm text-green-300">Stock: {product.stock} • {product.availability}</p>

              <button
                onClick={() => deleteProduct(product.id)}
                className="mt-5 w-full rounded-full bg-red-500 px-5 py-3 text-sm font-bold text-white"
              >
                Delete Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function GalleryPreview({ gallery, deleteGallery }: any) {
  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
      <h2 className="text-2xl font-bold text-[#f5c542]">Gallery Preview</h2>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((item: any) => (
          <div key={item.id} className="overflow-hidden rounded-3xl border border-white/10 bg-[#08254f]">
            <div className="flex h-[360px] items-center justify-center bg-[#d9d0bf] p-3">
              <img src={item.image_url} alt={item.title} className="max-h-full max-w-full rounded-2xl object-contain" />
            </div>

            <div className="p-5">
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-blue-100">{item.category} • {item.color}</p>

              <button
                onClick={() => deleteGallery(item.id)}
                className="mt-5 w-full rounded-full bg-red-500 px-5 py-3 text-sm font-bold text-white"
              >
                Delete Photo
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AddProduct({ onDone }: any) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    stock: "",
    availability: "In Stock",
    sizes: "S,M,L,XL",
    colors: "Gold,Blue",
  });

  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    let imageUrl = "";

    if (file) {
      const path = `products/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("mt-images").upload(path, file);

      if (error) {
        alert(error.message);
        setSaving(false);
        return;
      }

      const { data } = supabase.storage.from("mt-images").getPublicUrl(path);
      imageUrl = data.publicUrl;
    }

    const colors = form.colors.split(",").map((color) => {
      const clean = color.trim();

      return {
        name: clean,
        value: colorMap[clean.toLowerCase()] || "#f5c542",
      };
    });

    const { error } = await supabase.from("products").insert({
      name: form.name,
      category: form.category,
      price: Number(form.price),
      description: form.description,
      stock: Number(form.stock),
      availability: form.availability,
      image_url: imageUrl,
      sizes: form.sizes.split(",").map((s) => s.trim()),
      colors,
    });

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    setForm({
      name: "",
      category: "",
      price: "",
      description: "",
      stock: "",
      availability: "In Stock",
      sizes: "S,M,L,XL",
      colors: "Gold,Blue",
    });

    setFile(null);
    onDone();
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-[#f5c542]/40 bg-white/5 p-5 sm:p-6">
      <h2 className="text-2xl font-bold text-[#f5c542]">Add Product</h2>

      <Input label="Name" value={form.name} onChange={(v: string) => setForm({ ...form, name: v })} />
      <Input label="Category" value={form.category} onChange={(v: string) => setForm({ ...form, category: v })} />
      <Input label="Price" value={form.price} onChange={(v: string) => setForm({ ...form, price: v })} />
      <Input label="Stock" value={form.stock} onChange={(v: string) => setForm({ ...form, stock: v })} />
      <Input label="Availability" value={form.availability} onChange={(v: string) => setForm({ ...form, availability: v })} />
      <Input label="Sizes" value={form.sizes} onChange={(v: string) => setForm({ ...form, sizes: v })} />
      <Input label="Colors" value={form.colors} onChange={(v: string) => setForm({ ...form, colors: v })} />
      <Input label="Description" value={form.description} onChange={(v: string) => setForm({ ...form, description: v })} />

      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-bold text-[#f5c542]">Product Image</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full rounded-xl border border-white/20 bg-white/10 p-3"
        />
      </label>

      <button disabled={saving} className="mt-6 w-full rounded-full bg-[#f5c542] px-6 py-3 font-bold text-[#04142c] disabled:opacity-60">
        {saving ? "Saving Product..." : "Save Product"}
      </button>
    </form>
  );
}

function AddGallery({ onDone }: any) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      alert("Choose an image");
      return;
    }

    setSaving(true);

    const path = `gallery/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage.from("mt-images").upload(path, file);

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    const { data } = supabase.storage.from("mt-images").getPublicUrl(path);

    const { error: insertError } = await supabase.from("gallery").insert({
      title,
      category,
      color,
      image_url: data.publicUrl,
    });

    setSaving(false);

    if (insertError) {
      alert(insertError.message);
      return;
    }

    setTitle("");
    setCategory("");
    setColor("");
    setFile(null);
    onDone();
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-[#f5c542]/40 bg-white/5 p-5 sm:p-6">
      <h2 className="text-2xl font-bold text-[#f5c542]">Upload Gallery Photo</h2>

      <Input label="Title" value={title} onChange={setTitle} />
      <Input label="Category" value={category} onChange={setCategory} />
      <Input label="Color" value={color} onChange={setColor} />

      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-bold text-[#f5c542]">Gallery Image</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full rounded-xl border border-white/20 bg-white/10 p-3"
        />
      </label>

      <button disabled={saving} className="mt-6 w-full rounded-full bg-[#f5c542] px-6 py-3 font-bold text-[#04142c] disabled:opacity-60">
        {saving ? "Uploading Photo..." : "Upload Photo"}
      </button>
    </form>
  );
}

function Input({ label, value, onChange }: any) {
  return (
    <label className="mt-4 block">
      <span className="mb-1 block text-sm font-bold text-[#f5c542]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-white px-4 py-3 text-[#04142c]"
      />
    </label>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <p className="text-blue-100">{title}</p>
      <p className="mt-3 text-4xl font-black text-[#f5c542]">{value}</p>
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
      <p className="mt-6 text-lg font-bold text-blue-100">{text}</p>
    </div>
  );
}