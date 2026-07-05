"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabaseClient";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function redirectByRole(userId: string) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    window.location.href = profile?.role === "admin" ? "/admin" : "/dashboard";
  }

  async function loginWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) await redirectByRole(data.user.id);
  }

  async function signUpWithEmail() {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email,
        role: "customer",
      });
    }

    alert("Account created. Please verify your email before logging in.");
  }

  async function loginWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <main className="min-h-screen bg-[#04142c] text-white">
      <Navbar />

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f5c542]">
              Customer Account
            </p>

            <h1 className="mt-4 text-5xl font-black">
              Save your size, preferences, and custom orders.
            </h1>

            <p className="mt-6 leading-8 text-blue-100">
              Create an account to save your personal details, measurements,
              design preferences, consultation bookings, and order history.
            </p>
          </div>

          <div className="rounded-3xl border border-[#f5c542]/40 bg-white/5 p-6 shadow-2xl">
            <div className="mb-6 flex rounded-full bg-[#08254f] p-1">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 rounded-full py-3 font-bold ${
                  mode === "login" ? "bg-[#f5c542] text-[#04142c]" : "text-blue-100"
                }`}
              >
                Login
              </button>

              <button
                onClick={() => setMode("signup")}
                className={`flex-1 rounded-full py-3 font-bold ${
                  mode === "signup" ? "bg-[#f5c542] text-[#04142c]" : "text-blue-100"
                }`}
              >
                Sign Up
              </button>
            </div>

            <button
              onClick={loginWithGoogle}
              className="w-full rounded-full bg-white px-6 py-4 font-bold text-[#04142c]"
            >
              Continue with Google
            </button>

            <div className="my-6 text-center text-blue-100">or</div>

            <input
              type="email"
              placeholder="Email"
              className="mb-4 w-full rounded-xl bg-white px-4 py-3 text-[#04142c]"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="mb-5 w-full rounded-xl bg-white px-4 py-3 text-[#04142c]"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={mode === "login" ? loginWithEmail : signUpWithEmail}
              className="w-full rounded-full bg-[#f5c542] px-6 py-4 font-bold text-[#04142c]"
            >
              {mode === "login" ? "Login" : "Create Account"}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}