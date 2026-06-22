import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";
import { products } from "./data/products";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#04142c] text-white">
      <Navbar />

      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#164f9d,transparent_28%),radial-gradient(circle_at_80%_10%,#f5c54244,transparent_22%),linear-gradient(135deg,#04142c,#082b5d)]" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#f5c542] sm:text-sm sm:tracking-[0.35em]">
              Ethiopian Tradition • Modern Luxury
            </p>

            <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl md:text-7xl">
              Custom Habesha Fashion for everyone
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg">
              MT Design creates elegant Ethiopian traditional clothing for
              weddings, graduations, cultural celebrations, ready-made pieces,
              and custom diaspora orders.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="/collections"
                className="rounded-full bg-[#f5c542] px-8 py-4 text-center font-bold text-[#04142c]"
              >
                Shop Ready-Made
              </a>

              <a
                href="/custom-order"
                className="rounded-full border border-[#f5c542] px-8 py-4 text-center font-bold text-[#f5c542]"
              >
                Start Custom Order
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#f5c542]/40 bg-white/10 p-4 shadow-2xl sm:p-6">
            <div className="flex aspect-[4/5] items-center justify-center rounded-[1.5rem] bg-[#d9d0bf] text-[#04142c]">
              <MiniDress />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#08254f] px-4 py-6 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-4 text-center sm:grid-cols-2 lg:grid-cols-4">
          {["Ready-Made", "Custom Orders", "Handcrafted", "Diaspora Friendly"].map(
            (item) => (
              <div key={item} className="font-bold text-[#f5c542]">
                ✦ {item}
              </div>
            )
          )}
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f5c542]">
            Ready-Made
          </p>
          <h2 className="mt-4 text-4xl font-black">Featured Pieces</h2>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="/collections"
              className="rounded-full bg-[#f5c542] px-8 py-4 font-bold text-[#04142c]"
            >
              View All Collections
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#08254f] px-4 py-14 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f5c542]">
              Custom Orders
            </p>
            <h2 className="mt-4 text-4xl font-black">
              Create Your Own Habesha Outfit
            </h2>
            <p className="mt-6 leading-8 text-blue-100">
              Choose your size, style, neckline, Tibeb type, inspiration image,
              measurements, and personal details. Send everything directly to MT
              Design through WhatsApp.
            </p>
            <a
              href="/custom-order"
              className="mt-8 inline-block rounded-full bg-[#f5c542] px-8 py-4 font-bold text-[#04142c]"
            >
              Start Custom Order
            </a>
          </div>

          <div className="rounded-3xl border border-[#f5c542]/40 bg-[#04142c] p-6 sm:p-8">
            <h3 className="text-2xl font-bold text-[#f5c542]">
              Custom Order Includes
            </h3>
            <div className="mt-6 grid gap-4">
              {[
                "Standard size or custom measurements",
                "Upload inspiration design image",
                "Choose hand Tibeb or machine Tibeb",
                "Select V-neck, low back, tube dress, cape, or traditional style",
                "Add name, number, WhatsApp, location, and inquiry",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-white/5 p-5">
                  ✦ {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <HistoryReviews />

      <Footer />
    </main>
  );
}

function MiniDress() {
  return (
    <svg viewBox="0 0 220 300" className="h-72 w-52 sm:h-96 sm:w-72">
      <path d="M75 50 H145 L180 260 Q110 290 40 260 Z" fill="white" stroke="#cbd5e1" strokeWidth="3" />
      <path d="M88 50 L110 95 L132 50" fill="none" stroke="#f5c542" strokeWidth="7" />
      <rect x="104" y="90" width="12" height="130" rx="6" fill="#f5c542" />
      <rect x="65" y="145" width="90" height="12" rx="6" fill="#f5c542" />
    </svg>
  );
}

function HistoryReviews() {
  return (
    <>
      <section className="px-4 py-14 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f5c542]">
            MT Design History
          </p>
          <h2 className="mt-4 text-4xl font-black">
            A Family Brand Built on Craftsmanship
          </h2>
          <p className="mx-auto mt-6 max-w-3xl leading-8 text-blue-100">
            MT Design began with a mission to preserve Ethiopian beauty through
            handmade clothing. Every dress carries culture, family pride, and
            careful Tibeb work designed for weddings, graduations, holidays, and
            diaspora celebrations.
          </p>
        </div>
      </section>

      <section className="bg-[#08254f] px-4 py-14 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f5c542]">
              Reviews
            </p>
            <h2 className="mt-4 text-4xl font-black">Loved by Customers</h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <ReviewCard
              stars="★★★★★"
              text="The dress looked even better in person. The Tibeb detail was beautiful."
              name="Customer from USA"
            />

            <ReviewCard
              stars="★★★★★"
              text="ቀሚሱ በጣም ያምራል። የጥለቱ ስራ እጅግ የተዋበ ነው።"
              translation="The dress is very beautiful. The Tibeb work is extremely elegant."
              name="Customer from Ethiopia"
            />

            <ReviewCard
              stars="★★★★★"
              text="The custom sizing was accurate and the design felt premium."
              name="Customer from Canada"
            />
          </div>
        </div>
      </section>
    </>
  );
}

function ReviewCard({
  stars,
  text,
  translation,
  name,
}: {
  stars: string;
  text: string;
  translation?: string;
  name: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-2 hover:bg-white/10">
      <p className="text-[#f5c542]">{stars}</p>
      <p className="mt-4 leading-7 text-blue-100">“{text}”</p>

      {translation && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-bold text-[#f5c542]">
            Translate to English
          </summary>
          <p className="mt-3 rounded-2xl bg-[#04142c] p-4 text-sm leading-6 text-blue-100">
            “{translation}”
          </p>
        </details>
      )}

      <p className="mt-5 font-bold text-[#f5c542]">{name}</p>
    </div>
  );
}