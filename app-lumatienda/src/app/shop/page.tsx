// src/app/shop/page.tsx
import ProductCard from "@/components/ProductCard";
import products from "@/data/products.json"; // Using alias for src/data

export default function ShopPage() {
  return (
    <div className="container mx-auto py-16 px-4 bg-night-DEFAULT text-white min-h-screen">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-luma-light to-luma-dark">Nuestra Tienda</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
