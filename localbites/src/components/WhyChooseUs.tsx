'use client'

import Image from 'next/image'

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: '/images/burgerLogo.png',
      title: 'Convenient and Reliable',
      description:
        'Whether you dine in, take out, or order delivery, our service is convenient, fast, and reliable, making mealtime hassle-free.',
    },
    {
      icon: '/images/deliveryLogo.png',
      title: 'Variety of Options',
      description:
        'From hearty meals to light snacks, we offer a wide range of options to suit every taste and craving.',
    },
    {
      icon: '/images/menuLogo.png',
      title: 'Eat Burger',
      description:
        'Our burgers are grilled to perfection, with juicy patties and flavorful toppings that make every bite a delicious experience.',
    },
  ]

  return (
    <section className="bg-gradient-to-r from-[#fff8f0] to-white py-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
        {/* Left: Image */}
        <div className="w-full md:w-1/2">
          <Image
            src="/images/reasonLeft.png"
            alt="Healthy Salad Plate"
            width={500}
            height={326}
            className="rounded-2xl object-cover"
          />
        </div>

        {/* Right: Text and cards */}
        <div className="w-full md:w-1/2 space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 font-nunito">
            Why People Choose us?
          </h2>

          <div className="space-y-4">
            {reasons.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 bg-white shadow-sm rounded-xl p-4 border hover:shadow-md transition"
              >
                <div className="w-20 h-20 relative">
                    
                    <Image
                                      src={item.icon}
                                      alt={item.title}
                                      layout="fill"
                                      objectFit="contain"
                                    />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
