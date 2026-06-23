import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-[#04142c] text-white">
      <Navbar />

      <section className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f5c542]">
            Shipping
          </p>

          <h1 className="mt-4 text-4xl font-black sm:text-5xl">
            Worldwide Shipping from Ethiopia
          </h1>

          <p className="mt-5 max-w-3xl leading-8 text-blue-100">
            MT Design helps customers in Ethiopia and the diaspora order
            traditional clothing for weddings, graduations, cultural events,
            and custom occasions.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Traveler Delivery",
                text: "When available, clothes can be sent with trusted travelers. This is often affordable but depends on travel schedules.",
              },
              {
                title: "Express Shipping",
                text: "For urgent orders, we can discuss DHL, FedEx, or other courier options depending on destination and order size.",
              },
              {
                title: "Diaspora Orders",
                text: "Customers in the USA, Canada, Europe, Middle East, and Australia can contact us through WhatsApp for shipping options.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-[#f5c542]/40 bg-white/5 p-6"
              >
                <h2 className="text-2xl font-bold text-[#f5c542]">
                  {item.title}
                </h2>
                <p className="mt-4 leading-7 text-blue-100">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-3xl bg-[#08254f] p-6 sm:p-8">
            <h2 className="text-3xl font-black text-[#f5c542]">
              Before We Ship
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                "Confirm size and measurements",
                "Confirm dress style and Tibeb color",
                "Confirm delivery country and city",
                "Confirm expected event date",
                "Share final price and shipping cost",
                "Send tracking information when available",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-white/5 p-5">
                  ✦ {item}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <a
              href="/custom-order"
              className="rounded-full bg-[#f5c542] px-8 py-4 font-bold text-[#04142c]"
            >
              Start Custom Order
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}