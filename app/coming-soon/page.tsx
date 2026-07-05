"use client";

import { useState } from "react";

export default function ComingSoonPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleAccess = async () => {
    const res = await fetch("/api/dev-access", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (res.ok) {
      window.location.href = "/";
    } else {
      setError("Invalid developer code");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f8f1e7] text-[#2b1d12] px-6">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          MT Ethio Design
        </h1>

        <p className="text-lg md:text-xl mb-8">
          Our website is currently in development and will be live soon.
        </p>
      </div>

      <div className="fixed bottom-6 w-full max-w-sm px-6">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 border">
          <p className="text-sm font-medium mb-2">Developer Access</p>

          <input
            type="password"
            placeholder="Enter access code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-2"
          />

          <button
            onClick={handleAccess}
            className="w-full bg-[#2b1d12] text-white rounded-lg py-2 font-medium"
          >
            Enter Website
          </button>

          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
        </div>
      </div>
    </main>
  );
}