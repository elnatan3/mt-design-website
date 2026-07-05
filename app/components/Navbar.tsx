"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const links = [
    ["Collections", "/collections"],
    ["Custom Order", "/custom-order"],
    ["Gallery", "/gallery"],
    ["Shipping", "/shipping"],
    ["About", "/about"],
    ["Contact", "/contact"],
  ];

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      setLoggedIn(!!data.session);
    }

    checkSession();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#04142c]/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <a href="/">
          <div className="text-3xl font-black leading-none text-[#f5c542] sm:text-4xl">
            MT
          </div>
          <div className="text-[10px] font-bold tracking-[0.45em] text-white">
            DESIGN
          </div>
        </a>

        <div className="hidden gap-8 text-sm font-semibold text-blue-100 lg:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="hover:text-[#f5c542]">
              {label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="/custom-order"
            className="rounded-full bg-[#f5c542] px-5 py-3 text-sm font-bold text-[#04142c]"
          >
            Custom Order
          </a>

          <a
            href={loggedIn ? "/dashboard" : "/login"}
            className="rounded-full border border-[#f5c542] px-5 py-3 text-sm font-bold text-[#f5c542]"
          >
            {loggedIn ? "Dashboard" : "Login"}
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-full border border-[#f5c542] px-4 py-2 text-sm font-bold text-[#f5c542] lg:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-[#04142c] px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-xl bg-white/5 px-4 py-3 font-bold text-blue-100"
              >
                {label}
              </a>
            ))}

            <a
              href="/custom-order"
              className="rounded-xl bg-[#f5c542] px-4 py-3 text-center font-bold text-[#04142c]"
            >
              Custom Order
            </a>

            <a
              href={loggedIn ? "/dashboard" : "/login"}
              className="rounded-xl border border-[#f5c542] px-4 py-3 text-center font-bold text-[#f5c542]"
            >
              {loggedIn ? "Dashboard" : "Login"}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}