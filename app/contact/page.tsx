import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ContactPage() {
  const message = encodeURIComponent(
    "Hello MT Design, I would like to ask about your traditional clothing and custom orders."
  );

  return (
    <main className="min-h-screen bg-[#04142c] text-white">
      <Navbar />

      <section className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f5c542]">
            Contact
          </p>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">
            Contact MT Design
          </h1>
          <p className="mt-5 text-blue-100">
            Reach out for ready-made pieces, custom orders, pricing,
            measurements, and diaspora shipping.
          </p>

          <div className="mt-10 rounded-3xl border border-[#f5c542]/40 bg-[#08254f] p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h2 className="text-xl font-bold text-[#f5c542]">WhatsApp</h2>
                <p className="mt-2 text-blue-100">Best for quick orders.</p>
              </div>

              <a
                href={`https://wa.me/YOURNUMBER?text=${message}`}
                className="rounded-full bg-[#f5c542] px-8 py-4 text-center font-bold text-[#04142c]"
              >
                Message on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}