// src/components/Footer.tsx
import Link from 'next/link';
import { FaTwitter, FaDiscord } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-night-DEFAULT text-gray-300 py-10 px-8 border-t border-craft-dark/50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div className="mb-6 md:mb-0">
          <p>&copy; {new Date().getFullYear()} LumaCraft Network. Todos los derechos reservados.</p>
          <p className="text-sm mt-1">Diseñado con <span className="text-red-500">❤️</span> para la comunidad.</p>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 mb-6 md:mb-0">
          <Link href="#" className="hover:text-luma-DEFAULT transition-colors duration-200">
            Política de Privacidad
          </Link>
          <Link href="#" className="hover:text-luma-DEFAULT transition-colors duration-200">
            Términos de Servicio
          </Link>
        </div>
        <div className="flex space-x-6">
          <a href="https://twitter.com/LumaCraft" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-luma-DEFAULT transition-colors duration-200 text-3xl transition-transform hover:scale-110">
            <FaTwitter />
          </a>
          <a href="https://discord.gg/LumaCraft" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-luma-DEFAULT transition-colors duration-200 text-3xl transition-transform hover:scale-110">
            <FaDiscord />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
