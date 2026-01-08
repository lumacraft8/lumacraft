// src/app/cart/page.tsx
"use client";

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon, MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  return (
    <div className="container mx-auto py-20 px-4 bg-night-DEFAULT text-white min-h-screen">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-luma-light to-luma-dark">Tu Carrito de Compras</h1>

      {cart.length === 0 ? (
        <div className="text-center text-xl text-gray-300 p-8 rounded-lg border border-gray-700 bg-[#2a273f]/50 shadow-lg max-w-lg mx-auto">
          <p className="mb-6 text-2xl font-semibold">Tu carrito está vacío. ¡Añade algunos productos!</p>
          <Link href="/shop" className="group bg-luma-DEFAULT hover:bg-luma-light text-night-DEFAULT font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out flex items-center justify-center space-x-2 transform hover:scale-105 hover:shadow-lg hover:shadow-luma-light/20 mx-auto max-w-xs">
            <span>Ir a la Tienda</span>
            <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {cart.map(item => (
              <div key={item.id} className="flex items-center bg-[#2a273f]/50 p-5 rounded-xl shadow-lg border border-gray-700">
                <div className="relative w-28 h-28 mr-6 flex-shrink-0 rounded-lg overflow-hidden border border-gray-600">
                  <Image
                    src={item.image}
                    alt={item.name}
                    layout="fill"
                    objectFit="contain"
                    className="p-2"
                  />
                </div>
                <div className="flex-grow flex flex-col justify-center">
                  <h2 className="text-2xl font-bold text-luma-light mb-1">{item.name}</h2>
                  <p className="text-gray-400 text-lg">{item.price.toFixed(2)} USD</p>
                  <div className="flex items-center mt-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-craft-DEFAULT text-white p-2 rounded-l-md hover:bg-craft-light transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={item.quantity <= 1}
                    >
                      <MinusIcon className="h-5 w-5" />
                    </button>
                    <span className="bg-gray-700 text-white px-4 py-2 text-lg font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-craft-DEFAULT text-white p-2 rounded-r-md hover:bg-craft-light transition-all duration-200"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-6 text-red-400 hover:text-red-500 transition-colors duration-200 flex items-center space-x-1 text-lg font-medium"
                    >
                      <TrashIcon className="h-5 w-5" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
                <span className="text-xl font-bold text-luma-DEFAULT ml-4 flex-shrink-0">
                  {(item.price * item.quantity).toFixed(2)} USD
                </span>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1 bg-[#2a273f]/50 p-6 rounded-xl shadow-lg border border-gray-700 h-fit sticky top-6">
            <h2 className="text-3xl font-bold text-luma-DEFAULT mb-5">Resumen del Pedido</h2>
            <div className="flex justify-between text-xl mb-4 py-2 border-b border-gray-700">
              <span>Subtotal:</span>
              <span className="font-semibold text-gray-300">{getTotalPrice().toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between text-2xl mb-6 pt-2">
              <span>Total:</span>
              <span className="font-bold text-luma-light">{getTotalPrice().toFixed(2)} USD</span>
            </div>
            <Link href="/checkout" className="group w-full bg-game-diamond hover:bg-game-diamond/90 text-night-DEFAULT font-bold py-3 rounded-full text-lg transition-all duration-300 ease-in-out flex items-center justify-center space-x-2 transform hover:scale-105 hover:shadow-lg hover:shadow-game-diamond/30">
              <span>Proceder al Pago</span>
              <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}