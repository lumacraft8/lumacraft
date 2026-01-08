// src/app/checkout/page.tsx
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

export default function CheckoutPage() {
  return (
    <div className="container mx-auto py-20 px-4 bg-night-DEFAULT text-white min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-luma-light to-luma-dark mb-8">Proceso de Pago</h1>
      <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
        ¡Gracias por tu interés en LumaCraft Network! La funcionalidad de pago está actualmente en <span className="font-bold text-luma-DEFAULT">desarrollo</span>.
        Pronto podrás completar tus compras aquí y disfrutar de tus nuevos productos.
      </p>
      <Link href="/shop" className="group bg-luma-DEFAULT hover:bg-luma-light text-night-DEFAULT font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out flex items-center justify-center space-x-2 transform hover:scale-105 hover:shadow-lg hover:shadow-luma-light/20">
        <span>Continuar Comprando</span>
        <ArrowRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
