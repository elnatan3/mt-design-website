"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#04142c] px-4 py-8 text-white">
      <a
        href="/"
        className="relative z-20 inline-flex rounded-full border border-[#f5c542]/50 px-5 py-3 text-sm font-bold text-[#f5c542] transition hover:bg-[#f5c542] hover:text-[#04142c]"
      >
        ← Back Home
      </a>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#164f9d,transparent_28%),radial-gradient(circle_at_80%_10%,#f5c54244,transparent_22%),linear-gradient(135deg,#04142c,#082b5d)]" />

      <div className="absolute left-[8%] top-[18%] text-[160px] font-black text-[#f5c542]/10 blur-[1px] animate-pulse">
        M
      </div>
      <div className="absolute right-[10%] bottom-[12%] text-[170px] font-black text-[#f5c542]/10 blur-[1px] animate-pulse">
        T
      </div>

      <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f5c542]/20" />
      <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-300/10" />

      <div className="absolute left-[25%] top-[30%] h-3 w-3 rounded-full bg-[#f5c542] shadow-[0_0_30px_#f5c542]" />
      <div className="absolute right-[28%] top-[35%] h-3 w-3 rounded-full bg-blue-300 shadow-[0_0_30px_#93c5fd]" />
      <div className="absolute bottom-[28%] left-[45%] h-3 w-3 rounded-full bg-[#f5c542] shadow-[0_0_30px_#f5c542]" />

      <svg
        className="absolute inset-0 h-full w-full opacity-30"
        viewBox="0 0 1000 700"
        preserveAspectRatio="none"
      >
        <path
          d="M250 210 C420 120 520 580 750 260"
          fill="none"
          stroke="#f5c542"
          strokeWidth="2"
          strokeDasharray="8 12"
        />
        <path
          d="M170 500 C360 300 650 420 830 180"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="2"
          strokeDasharray="8 12"
        />
      </svg>

      <section className="relative z-10 flex min-h-[80vh] items-center justify-center">
        <form
          onSubmit={login}
          className="w-full max-w-md rounded-[2rem] border border-[#f5c542]/40 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-[#f5c542]/60 bg-[#04142c] text-3xl font-black text-[#f5c542] shadow-[0_0_40px_rgba(245,197,66,0.25)]">
              MT
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#f5c542]">
              Admin Portal
            </p>

            <h1 className="mt-4 text-4xl font-black">Welcome Back</h1>

            <p className="mt-3 text-sm text-blue-100">
              Login to manage products, gallery images, and custom orders.
            </p>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#f5c542]">
              Email
            </span>
            <input
              placeholder="admin@mtethiodesign.com"
              className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-[#04142c] outline-none focus:ring-4 focus:ring-[#f5c542]/30"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-bold text-[#f5c542]">
              Password
            </span>
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-[#04142c] outline-none focus:ring-4 focus:ring-[#f5c542]/30"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button className="mt-6 w-full rounded-full bg-[#f5c542] px-6 py-4 font-black text-[#04142c] transition hover:scale-[1.02]">
            Login
          </button>
        </form>
      </section>
    </main>
  );
}