"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const slides = [
  { title: "The Quiet Luxury Edit", copy: "Tailoring, silk, linen, and sculptural knits selected for wardrobes that travel well.", image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1800&q=85", href: "/shop?sort=new" },
  { title: "Summer Layers, Softly Cut", copy: "Breathable neutrals and considered silhouettes for days that move from campus to dinner.", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1800&q=85", href: "/shop?category=women" },
  { title: "Modern Menswear Codes", copy: "Crisp shirts, fluid trousers, and outerwear with a calm architectural line.", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=85", href: "/shop?category=men" }
];

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setActive((index) => (index + 1) % slides.length), 5200);
    return () => window.clearInterval(timer);
  }, []);
  const slide = slides[active];

  return (
    <section className="relative min-h-[78vh] overflow-hidden bg-ink text-bone">
      {slides.map((item, index) => (
        <Image key={item.title} src={item.image} alt="" fill priority={index === 0} sizes="100vw" className={`object-cover transition-opacity duration-1000 ${active === index ? "opacity-70" : "opacity-0"}`} />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/25 to-transparent" />
      <div className="container-padded relative flex min-h-[78vh] items-end pb-16 pt-28">
        <div className="max-w-2xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-bone/75">Curated Clothing Store</p>
          <h1 className="font-serif text-5xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">{slide.title}</h1>
          <p className="mt-6 max-w-lg text-base leading-8 text-bone/80">{slide.copy}</p>
          <Link href={slide.href} className="editorial-link mt-9 text-bone"><span>Shop the edit</span><ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
      <div className="absolute bottom-6 right-6 flex gap-2">
        {slides.map((item, index) => (
          <button key={item.title} type="button" onClick={() => setActive(index)} className={`h-1.5 transition-all ${active === index ? "w-10 bg-bone" : "w-4 bg-bone/45"}`} aria-label={`View slide ${index + 1}`} />
        ))}
      </div>
    </section>
  );
}
