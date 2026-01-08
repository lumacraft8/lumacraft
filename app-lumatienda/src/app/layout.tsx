import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header"; // Importar el componente Header
import Footer from "../components/Footer"; // Importar el componente Footer
import { CartProvider } from "../context/CartContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LumaCraft Network",
  description: "La tienda oficial de LumaCraft Network. ¡Consigue rangos, kits y cosméticos exclusivos!",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <Toaster 
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#2a273f',
                color: '#ffffff',
                border: '1px solid #4a4a5a',
              },
            }}
          />
          <div className="flex flex-col min-h-screen bg-night-DEFAULT">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer /> {/* Añadir el Footer aquí */}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
