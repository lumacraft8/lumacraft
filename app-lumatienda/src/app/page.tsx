// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import ProductCard from "../components/ProductCard";
import products from "../data/products.json";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

export default function Home() {
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-night-DEFAULT text-white">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center text-center bg-night-DEFAULT">
        <div className="absolute inset-0 bg-gradient-to-t from-night-DEFAULT via-[#1A1829]/80 to-transparent"></div>
        <div className="relative z-10 p-8 flex flex-col items-center">
          <Image
            src="/images/lumastore.png"
            alt="LumaCraft Network Logo"
            width={220}
            height={220}
            className="mx-auto mb-5"
            priority // Cargar esta imagen con prioridad
          />
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mt-6 mb-2" style={{ textShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
            Bienvenido a <span className="text-luma-DEFAULT">LumaCraft Network</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            ¡Descubre los mejores rangos, kits y cosméticos para tu aventura en LumaCraft Network!
          </p>
          <Link 
            href="/shop" 
            className="group bg-craft-DEFAULT hover:bg-craft-light text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg hover:shadow-craft-light/20"
          >
            <span>Explorar Tienda</span>
            <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto py-20 px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-luma-light to-luma-dark">
          Productos Destacados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-16">
          <Link href="/shop" className="bg-luma-DEFAULT hover:bg-luma-light text-night-DEFAULT font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 transform hover:scale-105">
            Ver Todos los Productos
          </Link>
        </div>
      </section>
    </div>
  );
}