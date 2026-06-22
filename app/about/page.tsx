import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#04142c] text-white">
      <Navbar />

      <section className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f5c542]">
              Our Story
            </p>
            <h1 className="mt-4 text-4xl font-black sm:text-5xl">
              Rooted in Ethiopian Heritage
            </h1>
            <p className="mt-6 leading-8 text-blue-100">
              MT Design is a family-owned Ethiopian traditional clothing brand
              built on craftsmanship, culture, and care. Every design carries
              the beauty of Ethiopian identity while serving modern customers
              around the world.
            </p>
          </div>

          <div className="rounded-3xl border border-[#f5c542]/40 bg-[#08254f] p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-[#f5c542]">Our Values</h2>
            <div className="mt-6 grid gap-4">
              {[
                "Handcrafted Ethiopian clothing",
                "Premium Tibeb details",
                "Custom sizing and designs",
                "Diaspora-friendly ordering",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-white/5 p-5">
                  ✦ {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}