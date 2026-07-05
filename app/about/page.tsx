import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#04142c] text-white">
      <Navbar />

      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#f5c54233,transparent_35%),radial-gradient(circle_at_bottom_right,#1E5AA833,transparent_35%)]" />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#f5c542] uppercase tracking-[0.35em] text-sm font-semibold mb-4">
              Ethiopian Heritage • Modern Elegance
            </p>

            <h1 className="text-5xl md:text-7xl font-black mb-6">
              About <span className="text-[#f5c542]">MT Design</span>
            </h1>

            <p className="max-w-3xl mx-auto text-lg md:text-xl text-blue-100 leading-relaxed">
              A family-owned Ethiopian fashion house blending nearly 30 years of
              craftsmanship, cultural beauty, and modern design.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative [perspective:1200px]">
              <div className="relative bg-[#f5c542] text-[#04142c] rounded-r-3xl rounded-l-md p-8 md:p-10 shadow-2xl border-l-[14px] border-white/40 transition-all duration-700 hover:scale-[1.02]">
                <div className="absolute inset-y-0 left-4 w-[2px] bg-[#04142c]/20" />
                <div className="absolute -right-5 top-6 bottom-6 w-5 bg-[#d6aa2f] rounded-r-2xl shadow-inner" />

                <p className="text-sm font-bold uppercase tracking-widest text-[#04142c]/70 mb-4">
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
                  Built on a foundation of craftsmanship, trust, and dedication,
                  we have proudly earned the confidence of generations of
                  customers through exceptional quality and personalized service.
                </p>

                <p className="leading-relaxed">
                  Every piece reflects Ethiopian elegance, cultural pride, and
                  the care of a family business committed to making every
                  celebration unforgettable.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                {
                  number: "30+",
                  title: "Years of Experience",
                  text: "From weddings and graduations to church programs and cultural celebrations, MT Design has served generations with quality and care.",
                },
                {
                  number: "🌍",
                  title: "Worldwide Orders",
                  text: "Proudly based in Bole, Addis Ababa, we serve customers across Ethiopia and offer worldwide shipping around the globe.",
                },
                {
                  number: "✦",
                  title: "Modern Custom Fashion",
                  text: "We specialize in fashionable attire for weddings, graduations, church programs, cultural celebrations, special events, and formal gatherings.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-[#f5c542]/30 bg-white/5 p-7 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-[#f5c542]"
                >
                  <div className="text-[#f5c542] text-4xl font-black mb-2">
                    {item.number}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-blue-100 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 rounded-[2rem] bg-[#f5c542] p-8 text-[#04142c] shadow-2xl md:p-12">
            <p className="uppercase tracking-[0.3em] text-sm font-bold mb-4">
              Our Promise
            </p>

            <h2 className="text-3xl md:text-5xl font-black mb-6">
              Timeless Ethiopian craftsmanship, designed for unforgettable
              moments.
            </h2>

            <p className="text-lg leading-relaxed">
              At MT Design, we do not just create garments, we create memories
              that last a lifetime through elegance, culture, quality, and
              personal care.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  ); 
}