// src/components/Navbar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const pathname = usePathname()

    const navLinks = [
        { label: 'Home', href: '/customer' },
        { label: 'Seller dashboard', href: '/seller/dashboard' },
        { label: 'My cart', href: '/cart' },
        // { label: 'About us', href: '/about' },
        // { label: 'Contact us', href: '/contact' },
    ]

    return (
        <header className="bg-white py-5 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between font-nunito">

                {/* Logo and Brand */}
                <div className="flex items-center gap-2">
                    <img src="/images/logo.png" alt="Foodie Logo" className="w-8 h-8 object-contain" />
                    <Link href="/" className="text-2xl font-bold text-primary tracking-wide">
                        {/* Foodie */}
                        <span className="text-red-500 font-sans">Local</span><span className="text-yellow-400">Bites</span>
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="hidden md:flex gap-6 text-sm font-medium">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`transition ${pathname === link.href
                                ? 'text-primary underline underline-offset-4'
                                : 'text-gray-700 hover:text-primary'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Login Button */}
                {/* <div className="hidden md:block">
                    <Link
                        href="/auth"
                        className="px-5 py-2 text-sm font-semibold border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition"
                    >
                        Login
                    </Link>
                </div> */}

                <div className="hidden md:block">
                    <Link
                        href="/auth"
                        className="px-8 py-3 text-lg font-bold text-primary border-4 border-primary rounded-full hover:bg-primary hover:text-white transition-colors duration-200"
                    >
                        Login
                    </Link>
                </div>


            </div>
        </header>
    )
}