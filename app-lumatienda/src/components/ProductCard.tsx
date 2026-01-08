// src/components/ProductCard.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { ShoppingCartIcon } from '@heroicons/react/24/solid'; // Icono para el botón

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    image: string;
    category: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    // Podríamos cambiar el alert por un toast/snackbar más elegante en el futuro
    alert(`${product.name} añadido al carrito!`);
  };

  return (
    <div className="group relative bg-[#2a273f]/50 rounded-xl border border-gray-800/50 shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:border-craft-DEFAULT hover:shadow-craft-dark/40 hover:-translate-y-2 flex flex-col">
      <Link href={`/shop/${product.id}`} className="block flex-grow">
        <div className="relative w-full h-52 bg-black/20">
          <Image
            src={product.image}
            alt={product.name}
            layout="fill"
            objectFit="contain"
            className="p-4 transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-luma-light mb-2">{product.name}</h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">{product.description}</p>
          <div className="flex justify-between items-center mt-auto">
            <span className="text-2xl font-bold text-luma-DEFAULT">{product.currency} {product.price.toFixed(2)}</span>
          </div>
        </div>
      </Link>
      <div className="p-4 pt-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={handleAddToCart}
          className="bg-craft-DEFAULT text-white px-4 py-2 rounded-lg hover:bg-craft-light transition-all duration-300 w-full flex items-center justify-center space-x-2 font-semibold hover:shadow-lg hover:shadow-craft-light/20"
        >
          <ShoppingCartIcon className="h-5 w-5" />
          <span>Añadir al Carrito</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;