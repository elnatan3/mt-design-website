"use client";

import { useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function AuthCallbackPage() {
  useEffect(() => {
    async function finishLogin() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        window.location.href = "/login";
        return;
      }

      const user = data.user;
      const email = user.email?.toLowerCase() || "";

      const adminEmails =
        process.env.NEXT_PUBLIC_ADMIN_EMAILS?.toLowerCase()
          .split(",")
          .map((e) => e.trim()) || [];

      const role = adminEmails.includes(email) ? "admin" : "customer";

      await supabase.from("profiles").upsert(
        {
          id: user.id,
          email,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
          role,
        },
        { onConflict: "id" }
      );

      window.location.href = role === "admin" ? "/admin" : "/dashboard";
    }

    finishLogin();
  }, []);

  return (
    <main className="min-h-screen bg-[#04142c] px-6 py-20 text-center text-white">
      <p className="text-2xl font-black text-[#f5c542]">Signing you in...</p>
    </main>
  );
}