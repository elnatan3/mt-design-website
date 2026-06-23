"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      window.location.href = "/admin/login";
      return;
    }

    setUser(data.user);
    loadData();
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

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  async function deleteProduct(id: string) {
    await supabase.from("products").delete().eq("id", id);
    loadData();
  }

  async function deleteGallery(id: string) {
    await supabase.from("gallery").delete().eq("id", id);
    loadData();
  }

  async function updateOrderStatus(id: string, status: string) {
    await supabase.from("custom_orders").update({ status }).eq("id", id);
    loadData();
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#04142c] p-6 text-white">
        Loading...
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

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Stat title="Products" value={products.length} />
          <Stat title="Gallery Photos" value={gallery.length} />
          <Stat title="Custom Orders" value={orders.length} />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <AddProduct onDone={loadData} />
          <AddGallery onDone={loadData} />
        </div>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <h2 className="text-2xl font-bold text-[#f5c542]">Products</h2>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {products.map((product) => (
              <div key={product.id} className="rounded-2xl bg-[#08254f] p-5">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="mb-4 h-48 w-full rounded-xl object-cover"
                  />
                )}
                <h3 className="text-xl font-bold">{product.name}</h3>
                <p className="text-blue-100">
                  {product.category} • ${product.price}
                </p>
                <p className="mt-2 text-sm text-blue-100">
                  Stock: {product.stock} • {product.availability}
                </p>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="mt-4 rounded-full bg-red-500 px-5 py-2 text-sm font-bold text-white"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <h2 className="text-2xl font-bold text-[#f5c542]">Gallery</h2>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.map((item) => (
              <div key={item.id} className="rounded-2xl bg-[#08254f] p-4">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="h-48 w-full rounded-xl object-cover"
                />
                <h3 className="mt-3 font-bold">{item.title}</h3>
                <p className="text-sm text-blue-100">
                  {item.category} • {item.color}
                </p>
                <button
                  onClick={() => deleteGallery(item.id)}
                  className="mt-4 rounded-full bg-red-500 px-5 py-2 text-sm font-bold text-white"
                >
                  Delete
                </button>
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
                    <p className="text-blue-100">WhatsApp: {order.whatsapp}</p>
                    <p className="text-blue-100">Location: {order.location}</p>
                    <p className="mt-2 text-blue-100">
                      {order.style} • {order.size} • {order.tibeb} •{" "}
                      {order.color}
                    </p>
                    <p className="mt-2 text-sm text-blue-100">
                      {order.details}
                    </p>
                    <p className="mt-2 text-sm text-blue-100">
                      Inquiry: {order.inquiry}
                    </p>

                    {order.inspiration_url && (
                      <img
                        src={order.inspiration_url}
                        alt="Inspiration"
                        className="mt-4 h-48 w-full max-w-sm rounded-xl object-cover"
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

                    {order.whatsapp && (
                      <a
                        href={`https://wa.me/${order.whatsapp}`}
                        className="mt-4 block rounded-full bg-[#f5c542] px-5 py-3 text-center font-bold text-[#04142c]"
                      >
                        Message Customer
                      </a>
                    )}
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
    colors: "Gold:#f5c542,Blue:#0b3d91",
  });

  const [file, setFile] = useState<File | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    let imageUrl = "";

    if (file) {
      const path = `products/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("mt-images")
        .upload(path, file);

      if (error) {
        alert(error.message);
        return;
      }

      const { data } = supabase.storage.from("mt-images").getPublicUrl(path);
      imageUrl = data.publicUrl;
    }

    const colors = form.colors.split(",").map((item) => {
      const [name, value] = item.split(":");
      return { name: name.trim(), value: value.trim() };
    });

    await supabase.from("products").insert({
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

    setForm({
      name: "",
      category: "",
      price: "",
      description: "",
      stock: "",
      availability: "In Stock",
      sizes: "S,M,L,XL",
      colors: "Gold:#f5c542,Blue:#0b3d91",
    });
    setFile(null);
    onDone();
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-[#f5c542]/40 bg-white/5 p-5 sm:p-6"
    >
      <h2 className="text-2xl font-bold text-[#f5c542]">Add Product</h2>

      <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
      <Input label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
      <Input label="Price" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
      <Input label="Stock" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} />
      <Input label="Availability" value={form.availability} onChange={(v) => setForm({ ...form, availability: v })} />
      <Input label="Sizes comma separated" value={form.sizes} onChange={(v) => setForm({ ...form, sizes: v })} />
      <Input label="Colors format Name:#hex,Name:#hex" value={form.colors} onChange={(v) => setForm({ ...form, colors: v })} />
      <Input label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mt-4 w-full rounded-xl border border-white/20 bg-white/10 p-3"
      />

      <button className="mt-6 w-full rounded-full bg-[#f5c542] px-6 py-3 font-bold text-[#04142c]">
        Save Product
      </button>
    </form>
  );
}

function AddGallery({ onDone }: { onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      alert("Choose an image");
      return;
    }

    const path = `gallery/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("mt-images")
      .upload(path, file);

    if (error) {
      alert(error.message);
      return;
    }

    const { data } = supabase.storage.from("mt-images").getPublicUrl(path);

    await supabase.from("gallery").insert({
      title,
      category,
      color,
      image_url: data.publicUrl,
    });

    setTitle("");
    setCategory("");
    setColor("");
    setFile(null);
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

      <Input label="Title" value={title} onChange={setTitle} />
      <Input label="Category" value={category} onChange={setCategory} />
      <Input label="Color" value={color} onChange={setColor} />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mt-4 w-full rounded-xl border border-white/20 bg-white/10 p-3"
      />

      <button className="mt-6 w-full rounded-full bg-[#f5c542] px-6 py-3 font-bold text-[#04142c]">
        Upload Photo
      </button>
    </form>
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
    <label className="mt-4 block">
      <span className="mb-2 block text-sm font-bold text-[#f5c542]">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-white px-4 py-3 text-[#04142c]"
      />
    </label>
  );
}