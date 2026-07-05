export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#071A3D] text-white px-6 py-20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#F4C43033,transparent_35%),radial-gradient(circle_at_bottom_right,#1E5AA833,transparent_35%)]" />

      <section className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#F4C430] uppercase tracking-[0.35em] text-sm font-semibold mb-4">
            Ethiopian Heritage • Modern Elegance
          </p>

          <h1 className="text-5xl md:text-7xl font-black mb-6 drop-shadow-2xl">
            About <span className="text-[#F4C430]">MT Design</span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg md:text-xl text-blue-100 leading-relaxed">
            A family-owned Ethiopian fashion house blending nearly 30 years of
            craftsmanship, cultural beauty, and modern design.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative [perspective:1200px]">
            <div className="relative bg-[#F7E7B5] text-[#071A3D] rounded-r-3xl rounded-l-md p-8 md:p-10 shadow-[25px_25px_80px_rgba(0,0,0,0.45)] border-l-[14px] border-[#F4C430] transform rotate-y-[-8deg] hover:rotate-y-0 transition-all duration-700">
              <div className="absolute inset-y-0 left-4 w-[2px] bg-[#071A3D]/20" />
              <div className="absolute -right-5 top-6 bottom-6 w-5 bg-[#d6b24a] rounded-r-2xl shadow-inner" />

              <p className="text-sm font-bold uppercase tracking-widest text-[#1E5AA8] mb-4">
                Since 1997
              </p>

              <h2 className="text-3xl md:text-4xl font-black mb-6">
                A Story Sewn With Heritage
              </h2>

              <p className="mb-5 leading-relaxed">
                Founded in 1997 by Mesfin Tesfa, MT Design is a family-owned
                Ethiopian business with nearly three decades of experience in
                creating elegant, high-quality fashion for life&apos;s most
                meaningful moments.
              </p>

              <p className="mb-5 leading-relaxed">
                Built on a foundation of craftsmanship, trust, and dedication, we
                have proudly earned the confidence of generations of customers
                through exceptional quality and personalized service.
              </p>

              <p className="leading-relaxed">
                Every piece reflects Ethiopian elegance, cultural pride, and the
                care of a family business committed to making every celebration
                unforgettable.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-7 shadow-2xl hover:-translate-y-2 transition-all duration-500">
              <div className="text-[#F4C430] text-4xl font-black mb-2">30+</div>
              <h3 className="text-2xl font-bold mb-3">Years of Experience</h3>
              <p className="text-blue-100 leading-relaxed">
                From weddings and graduations to church programs and cultural
                celebrations, MT Design has served generations with quality and
                care.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-7 shadow-2xl hover:-translate-y-2 transition-all duration-500">
              <div className="text-[#F4C430] text-4xl font-black mb-2">🌍</div>
              <h3 className="text-2xl font-bold mb-3">Worldwide Orders</h3>
              <p className="text-blue-100 leading-relaxed">
                Proudly based in Bole, Addis Ababa, we serve customers across
                Ethiopia and offer worldwide shipping, bringing Ethiopian
                craftsmanship to clients around the globe.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-7 shadow-2xl hover:-translate-y-2 transition-all duration-500">
              <div className="text-[#F4C430] text-4xl font-black mb-2">✦</div>
              <h3 className="text-2xl font-bold mb-3">Modern Custom Fashion</h3>
              <p className="text-blue-100 leading-relaxed">
                We specialize in fashionable attire for weddings, graduations,
                church programs, cultural celebrations, special events, and formal
                gatherings for both men and women.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 bg-[#F4C430] text-[#071A3D] rounded-[2rem] p-8 md:p-12 shadow-[0_30px_90px_rgba(244,196,48,0.35)] relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/20 rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#1E5AA8]/20 rounded-full" />

          <div className="relative max-w-4xl">
            <p className="uppercase tracking-[0.3em] text-sm font-bold mb-4">
              Our Promise
            </p>

            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Timeless Ethiopian craftsmanship, designed for unforgettable
              moments.
            </h2>

            <p className="text-lg leading-relaxed">
              At MT Design, we do not just create garments — we create memories
              that last a lifetime through elegance, culture, quality, and
              personal care.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}