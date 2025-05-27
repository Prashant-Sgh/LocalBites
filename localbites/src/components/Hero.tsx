// src/components/Hero.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    // <section className="bg-background py-16 font-nunito">
    <section className="bg-gradient-to-b from-[#ffffff] via-[#ffe6cc] to-[#ffffff] py-16 font-nunito">
      <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-12">
        
        {/* Left: Text */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          {/* <p className="text-sm uppercase text-accent font-semibold tracking-wide">
            No.1 food delivery service
          </p> */}
          <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight">
            The Fastest <span className="text-primary">Food</span> Delivery in Your City
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto md:mx-0">
            Experience lightning-fast food delivery from your favorite local restaurants. Hot, fresh, and on time!
          </p>
          <Link
            href="/cart"
            className="inline-block bg-primary text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-opacity-90 transition"
          >
            Order Now
          </Link>
        </div>

        {/* Right: Image */}
        <div className="flex-1 relative w-full h-64 md:h-[400px]">
          <Image
            src="/images/heroSectionRightImage.png"
            alt="Delicious food"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

    </section>
  )
}
