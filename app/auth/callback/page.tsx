"use client";

import { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function AuthCallbackPage() {
  useEffect(() => {
    async function finishLogin() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        window.location.href = "/login";
        return;
      }

      await supabase.from("profiles").upsert({
        id: data.user.id,
        email: data.user.email,
        role: "customer",
      });

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      window.location.href = profile?.role === "admin" ? "/admin" : "/dashboard";
    }

    finishLogin();
  }, []);

  return (
    <main className="min-h-screen bg-[#04142c] px-6 py-20 text-center text-white">
      <p className="text-[#f5c542] text-2xl font-black">Signing you in...</p>
    </main>
  );
}