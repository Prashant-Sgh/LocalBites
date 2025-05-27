// src/components/Features.tsx
'use client'

import Image from 'next/image'

export default function Features() {
  const features = [
    {
      icon: '/images/bestQuality.png',
      title: 'Quality Products Only',
      description: 'We ensure that every item we offer is made from the highest quality ingredients, with no compromise ever.',
    },
    {
      icon: '/images/fastDelivery.png',
      title: 'Super Fast Delivery',
      description: 'Our local-first approach ensures ultra-fast delivery—your food comes straight from nearby kitchens to your door.',
    },
    {
      icon: '/images/valueForMoney.png',
      title: 'Value For Money',
      description: 'Enjoy delicious meals at fair prices—Localbites connects you with great food without breaking the bank.',
    },
    {
      icon: '/images/onlineStore.png',
      title: 'On Your Phone',
      description: 'Access tasty local meals in seconds—our mobile-friendly site makes ordering easy, anytime, from anywhere.',
    },
  ]

  return (
    <section className="bg-gradient-to-r from-[#fff8f0] to-[#ffffff] py-20 font-nunito">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold text-black mb-16">
          Why Choose Localbites?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center text-center"
            >
              <div className="mb-5 w-24 h-24 relative">
                <Image
                  src={feat.icon}
                  alt={feat.title}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">{feat.title}</h3>
              <p className="text-sm text-gray-600">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
