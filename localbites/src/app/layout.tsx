import type { Metadata } from "next";
import "./globals.css";
import { UserSessionProvider } from "../context/UserSessionContext";
import { CartProvider } from "../context/CartContext";
import Navbar from '../components/Navbar'
import { Nunito } from 'next/font/google'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-nunito',
  display: 'swap', // optional but recommended
})

export const metadata: Metadata = {
  title: "Localbites",
  description: "Find your favorite food online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="antialiased">
        <UserSessionProvider>
          <CartProvider>
            <Navbar />
            {children}
          </CartProvider>
        </UserSessionProvider>
      </body>
    </html>
  );
}