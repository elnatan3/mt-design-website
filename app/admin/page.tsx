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
      window.location.href = "/admin/login";
      return;
    }

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

    setProducts(productsData || []);
    setGallery(galleryData || []);
    setOrders(ordersData || []);
  }

  async function refreshData() {
    setLoading(true);
    await loadData();
    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
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

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-[#04142c] px-4 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <LuxuryLoader text="Loading MT Design admin dashboard..." />
        </div>
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

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Stat title="Products" value={products.length} />
          <Stat title="Gallery Photos" value={gallery.length} />
          <Stat title="Custom Orders" value={orders.length} />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <AddProduct
            onDone={() => {
              showMessage("Product uploaded successfully.");
              refreshData();
            }}
          />

          <AddGallery
            onDone={() => {
              showMessage("Gallery photo uploaded successfully.");
              refreshData();
            }}
          />
        </div>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <h2 className="text-2xl font-bold text-[#f5c542]">
            Products Preview
          </h2>

          <p className="mt-2 text-sm text-blue-100">
            These are the ready-made collection items customers will see.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-[#08254f]"
              >
                <div className="flex h-[380px] items-center justify-center bg-[#d9d0bf] p-3 sm:h-[450px]">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="max-h-full max-w-full rounded-2xl object-contain"
                    />
                  ) : (
                    <div className="text-7xl">👗</div>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-sm font-bold uppercase text-[#f5c542]">
                    {product.category}
                  </p>

                  <h3 className="mt-2 text-2xl font-black">{product.name}</h3>

                  <p className="mt-3 text-sm leading-6 text-blue-100">
                    {product.description}
                  </p>

                  <p className="mt-4 text-3xl font-black text-[#f5c542]">
                    ${product.price}
                  </p>

                  <p className="mt-2 text-sm text-green-300">
                    Stock: {product.stock} • {product.availability}
                  </p>

                  <div className="mt-4 rounded-2xl bg-[#04142c] p-4">
                    <p className="text-sm font-bold text-[#f5c542]">
                      Colors
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(product.colors || []).map((color: any) => (
                        <span
                          key={color.name}
                          className="rounded-full border border-white/15 px-3 py-1 text-sm text-blue-100"
                        >
                          {color.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-[#04142c] p-4">
                    <p className="text-sm font-bold text-[#f5c542]">Sizes</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(product.sizes || []).map((size: string) => (
                        <span
                          key={size}
                          className="rounded-full border border-white/15 px-3 py-1 text-sm text-blue-100"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>

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

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <h2 className="text-2xl font-bold text-[#f5c542]">
            Gallery Preview
          </h2>

          <p className="mt-2 text-sm text-blue-100">
            These photos appear on the public gallery page.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-[#08254f]"
              >
                <div className="flex h-[360px] items-center justify-center bg-[#d9d0bf] p-3 sm:h-[420px]">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="max-h-full max-w-full rounded-2xl object-contain"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold">{item.title}</h3>

                  <p className="mt-2 text-sm text-blue-100">
                    {item.category} • {item.color}
                  </p>

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

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <h2 className="text-2xl font-bold text-[#f5c542]">Custom Orders</h2>

          <div className="mt-6 grid grid-cols-1 gap-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl bg-[#08254f] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{order.name}</h3>

                    <p className="text-blue-100">Phone: {order.phone}</p>
                    <p className="text-blue-100">Location: {order.location}</p>

                    <p className="mt-2 text-blue-100">
                      {order.style} • {order.size} • {order.tibeb} •{" "}
                      {order.color}
                    </p>

                    <div className="mt-4 rounded-2xl bg-[#04142c] p-4">
                      <p className="font-bold text-[#f5c542]">
                        Measurements
                      </p>
                      <p className="mt-2 text-sm text-blue-100">
                        Bust: {order.measurements?.bust || "Not provided"} cm
                      </p>
                      <p className="text-sm text-blue-100">
                        Waist: {order.measurements?.waist || "Not provided"} cm
                      </p>
                      <p className="text-sm text-blue-100">
                        Hip: {order.measurements?.hip || "Not provided"} cm
                      </p>
                      <p className="text-sm text-blue-100">
                        Shoulder:{" "}
                        {order.measurements?.shoulder || "Not provided"} cm
                      </p>
                      <p className="text-sm text-blue-100">
                        Dress Length:{" "}
                        {order.measurements?.dressLength || "Not provided"} cm
                      </p>
                    </div>

                    <p className="mt-4 text-sm text-blue-100">
                      <span className="font-bold text-[#f5c542]">
                        Details:
                      </span>{" "}
                      {order.details || "No details provided"}
                    </p>

                    <p className="mt-2 text-sm text-blue-100">
                      <span className="font-bold text-[#f5c542]">
                        Inquiry:
                      </span>{" "}
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
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      className="w-full rounded-xl bg-white px-4 py-3 text-[#04142c]"
                    >
                      <option>New</option>
                      <option>In Progress</option>
                      <option>Ready</option>
                      <option>Delivered</option>
                    </select>

                    {order.phone && (
                      <div className="mt-4 rounded-2xl bg-[#04142c] p-4">
                        <p className="text-sm font-bold text-[#f5c542]">
                          Customer Contact
                        </p>
                        <p className="mt-2 text-blue-100">{order.phone}</p>
                      </div>
                    )}

                    <a
                      href={`mailto:mtsupport@mtethiodesign.com?subject=${encodeURIComponent(
                        `Follow up: MT Design Order - ${order.name}`
                      )}&body=${encodeURIComponent(
                        `Hello ${order.name},

Thank you for your custom order request with MT Design.

We are reviewing your design details and will contact you shortly.

Order Details:
Style: ${order.style}
Size: ${order.size}
Tibeb: ${order.tibeb}
Color: ${order.color}

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
      </div>
    </main>
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

function AddProduct({ onDone }: { onDone: () => void }) {
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
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    let imageUrl = "";

    if (file) {
      const path = `products/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("mt-images")
        .upload(path, file);

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
    setPreview("");
    onDone();
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-[#f5c542]/40 bg-white/5 p-5 sm:p-6"
    >
      <h2 className="text-2xl font-bold text-[#f5c542]">Add Product</h2>

      <Input
        label="Name"
        helper="Example: Royal Wedding Kemis, Graduation Blue Tibeb Dress"
        value={form.name}
        onChange={(v) => setForm({ ...form, name: v })}
      />

      <Input
        label="Category"
        helper="Choose one: Wedding, Graduation, Modern, Traditional, Kids, Couples"
        value={form.category}
        onChange={(v) => setForm({ ...form, category: v })}
      />

      <Input
        label="Price"
        helper="Enter only the number. Example: 250"
        value={form.price}
        onChange={(v) => setForm({ ...form, price: v })}
      />

      <Input
        label="Stock"
        helper="How many are ready-made? Example: 3"
        value={form.stock}
        onChange={(v) => setForm({ ...form, stock: v })}
      />

      <Input
        label="Availability"
        helper="Options: In Stock, Limited Stock, Sold Out, Custom Only"
        value={form.availability}
        onChange={(v) => setForm({ ...form, availability: v })}
      />

      <Input
        label="Sizes"
        helper="Type sizes separated by commas. Example: S,M,L,XL or XS,S,M"
        value={form.sizes}
        onChange={(v) => setForm({ ...form, sizes: v })}
      />

      <Input
        label="Colors"
        helper="Type color names separated by commas. Example: Gold,Blue,Green"
        value={form.colors}
        onChange={(v) => setForm({ ...form, colors: v })}
      />

      <Input
        label="Description"
        helper="Example: Elegant white Habesha kemis with gold Tibeb for weddings."
        value={form.description}
        onChange={(v) => setForm({ ...form, description: v })}
      />

      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-bold text-[#f5c542]">
          Product Image
        </span>

        <p className="mb-2 text-xs text-blue-100">
          Upload a clear front-facing product photo.
        </p>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const selected = e.target.files?.[0] || null;
            setFile(selected);

            if (selected) setPreview(URL.createObjectURL(selected));
            else setPreview("");
          }}
          className="w-full rounded-xl border border-white/20 bg-white/10 p-3"
        />
      </label>

      {preview && (
        <div className="mt-5 overflow-hidden rounded-3xl border border-[#f5c542]/40 bg-[#08254f]">
          <div className="flex h-[420px] items-center justify-center bg-[#d9d0bf] p-3">
            <img
              src={preview}
              alt="Product preview"
              className="max-h-full max-w-full rounded-2xl object-contain"
            />
          </div>

          <div className="p-4">
            <p className="font-bold text-[#f5c542]">Collection Preview</p>
            <h3 className="mt-2 text-xl font-bold">
              {form.name || "Product Name"}
            </h3>
            <p className="mt-1 text-sm text-blue-100">
              {form.category || "Category"} • ${form.price || "Price"}
            </p>
          </div>
        </div>
      )}

      <button
        disabled={saving}
        className="mt-6 w-full rounded-full bg-[#f5c542] px-6 py-3 font-bold text-[#04142c] disabled:opacity-60"
      >
        {saving ? "Saving Product..." : "Save Product"}
      </button>
    </form>
  );
}

function AddGallery({ onDone }: { onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      alert("Choose an image");
      return;
    }

    setSaving(true);

    const path = `gallery/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("mt-images")
      .upload(path, file);

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
    setPreview("");
    onDone();
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-[#f5c542]/40 bg-white/5 p-5 sm:p-6"
    >
      <h2 className="text-2xl font-bold text-[#f5c542]">
        Upload Gallery Photo
      </h2>

      <Input
        label="Title"
        helper="Example: Blue Graduation Dress, Royal Wedding Kemis"
        value={title}
        onChange={setTitle}
      />

      <Input
        label="Category"
        helper="Choose one: Wedding, Graduation, Modern, Traditional, Couples, Kids"
        value={category}
        onChange={setCategory}
      />

      <Input
        label="Color"
        helper="Example: Gold, Blue, Green, Red, Purple, Black"
        value={color}
        onChange={setColor}
      />

      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-bold text-[#f5c542]">
          Gallery Image
        </span>

        <p className="mb-2 text-xs text-blue-100">
          Upload the photo that should appear in the public gallery.
        </p>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const selected = e.target.files?.[0] || null;
            setFile(selected);

            if (selected) setPreview(URL.createObjectURL(selected));
            else setPreview("");
          }}
          className="w-full rounded-xl border border-white/20 bg-white/10 p-3"
        />
      </label>

      {preview && (
        <div className="mt-5 overflow-hidden rounded-3xl border border-[#f5c542]/40 bg-[#08254f]">
          <div className="flex h-[420px] items-center justify-center bg-[#d9d0bf] p-3">
            <img
              src={preview}
              alt="Gallery preview"
              className="max-h-full max-w-full rounded-2xl object-contain"
            />
          </div>

          <div className="p-4">
            <p className="font-bold text-[#f5c542]">Gallery Preview</p>
            <h3 className="mt-2 text-xl font-bold">{title || "Photo Title"}</h3>
            <p className="mt-1 text-sm text-blue-100">
              {category || "Category"} • {color || "Color"}
            </p>
          </div>
        </div>
      )}

      <button
        disabled={saving}
        className="mt-6 w-full rounded-full bg-[#f5c542] px-6 py-3 font-bold text-[#04142c] disabled:opacity-60"
      >
        {saving ? "Uploading Photo..." : "Upload Photo"}
      </button>
    </form>
  );
}

function Input({
  label,
  helper,
  value,
  onChange,
}: {
  label: string;
  helper?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="mt-4 block">
      <span className="mb-1 block text-sm font-bold text-[#f5c542]">
        {label}
      </span>

      {helper && <p className="mb-2 text-xs text-blue-100">{helper}</p>}

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-white px-4 py-3 text-[#04142c]"
      />
    </label>
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
        Preparing your business dashboard...
      </p>
    </div>
  );
}