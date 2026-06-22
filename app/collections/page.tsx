import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { products } from "../data/products";

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-[#04142c] text-white">
      <Navbar />

      <section className="px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f5c542]">
            Collections
          </p>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">
            Ready-Made Collection
          </h1>
          <p className="mt-5 max-w-2xl text-blue-100">
            Browse fixed-price pieces with available standard sizes, color
            options, availability, and size guides.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}