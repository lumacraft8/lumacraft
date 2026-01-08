import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Colores para el texto "LUMA" (Amarillos/Dorados)
        luma: {
          light: '#FFF066',   // Brillos superiores
          DEFAULT: '#FFD500', // El color principal de la cara de la letra
          dark: '#E08E00',    // El color 3D/Sombra anaranjada
        },
        // Colores para el texto "CRAFT" (Azules/Violetas)
        craft: {
          light: '#8FA4FF',   // Brillos suaves
          DEFAULT: '#6A85FA', // El color principal de la cara de la letra
          dark: '#343696',    // El color 3D/Sombra profunda
        },
        // Colores de Acento (Objetos del juego)
        game: {
          diamond: '#00D9F6', // El cian brillante del diamante
          tnt: '#CC5230',     // El rojo/naranja del bloque TNT
          grass: '#6BC928',   // El verde lima de la isla
          dirt: '#8B5E3C',    // El marrón de la tierra
        },
        // Fondo (Cielo nocturno)
        night: {
          DEFAULT: '#1A1829', // El color oscuro de fondo
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config;
