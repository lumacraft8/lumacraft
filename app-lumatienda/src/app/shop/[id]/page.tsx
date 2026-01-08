// src/app/shop/[id]/page.tsx
"use client"; // This component needs to be a Client Component to use hooks

import Image from 'next/image';
import products from '@/data/products.json';
import { useCart } from '@/context/CartContext'; // Import useCart

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = params;
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();

  if (!product) {
    return (
      <div className="container mx-auto py-16 px-4 text-center bg-night-DEFAULT text-white min-h-screen">
        <h1 className="text-4xl font-bold text-luma-DEFAULT mb-4">Producto no encontrado</h1>
        <p className="text-xl text-gray-300">El producto que buscas no existe.</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    alert(`${product.name} añadido al carrito!`); // Simple feedback
  };

  return (
    <div className="container mx-auto py-16 px-4 bg-night-DEFAULT text-white min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 flex justify-center items-center bg-gray-800 rounded-lg p-8">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            objectFit="contain"
          />
        </div>
        <div className="md:w-1/2">
          <h1 className="text-5xl font-bold text-luma-DEFAULT mb-4">{product.name}</h1>
          <p className="text-gray-300 text-lg mb-6">{product.description}</p>
          <p className="text-luma-light text-3xl font-semibold mb-8">{product.currency} {product.price.toFixed(2)}</p>
          <button
            onClick={handleAddToCart}
            className="bg-craft-DEFAULT hover:bg-craft-light text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300"
          >
            Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}