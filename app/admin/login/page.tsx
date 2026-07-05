"use client";

import { supabase } from "../../lib/supabaseClient";

export default function AdminLoginPage() {
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
    <main className="relative min-h-screen overflow-hidden bg-[#04142c] px-4 py-8 text-white">
      <a
        href="/"
        className="relative z-20 inline-flex rounded-full border border-[#f5c542]/50 px-5 py-3 text-sm font-bold text-[#f5c542] transition hover:bg-[#f5c542] hover:text-[#04142c]"
      >
        ← Back Home
      </a>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#164f9d,transparent_28%),radial-gradient(circle_at_80%_10%,#f5c54244,transparent_22%),linear-gradient(135deg,#04142c,#082b5d)]" />

      <section className="relative z-10 flex min-h-[80vh] items-center justify-center">
        <div className="w-full max-w-md rounded-[2rem] border border-[#f5c542]/40 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-[#f5c542]/60 bg-[#04142c] text-3xl font-black text-[#f5c542]">
              MT
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#f5c542]">
              Admin Portal
            </p>

            <h1 className="mt-4 text-4xl font-black">Welcome Back</h1>

            <p className="mt-3 text-sm text-blue-100">
              Sign in with your authorized Google admin account.
            </p>
          </div>

          <button
            onClick={loginWithGoogle}
            className="w-full rounded-full bg-white px-6 py-4 font-black text-[#04142c] transition hover:scale-[1.02]"
          >
            Continue with Google
          </button>
        </div>
      </section>
    </main>
  );
}