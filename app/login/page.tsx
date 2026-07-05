"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabaseClient";

export default function LoginPage() {
    async function loginWithGoogle() {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
      
        if (error) alert(error.message);
      }

  return (
    <main className="min-h-screen bg-[#04142c] text-white">
      <Navbar />

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f5c542]">
              MT Design Account
            </p>

            <h1 className="mt-4 text-5xl font-black">
              Login with Google to continue.
            </h1>

            <p className="mt-6 leading-8 text-blue-100">
              Customers can save measurements, preferences, custom order drafts,
              and consultation bookings. Admin users are automatically sent to
              the admin dashboard.
            </p>
          </div>

          <div className="rounded-3xl border border-[#f5c542]/40 bg-white/5 p-6 shadow-2xl">
            <h2 className="text-3xl font-black text-[#f5c542]">
              Sign in
            </h2>

            <p className="mt-3 text-blue-100">
              Use your Google account to access your MT Design profile.
            </p>

            <button
              onClick={loginWithGoogle}
              className="mt-8 w-full rounded-full bg-white px-6 py-4 font-bold text-[#04142c]"
            >
              Continue with Google
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}