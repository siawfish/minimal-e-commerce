'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const heroImages = [
  '/hero/1.jpeg',
  '/hero/2.jpeg',
  '/hero/3.jpeg',
  '/hero/4.jpeg',
  '/hero/5.jpeg',
  '/hero/6.jpeg',
  '/hero/7.jpeg',
  '/hero/8.jpeg',
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[70vh] overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-all duration-1500 ease-in-out ${
              index === currentIndex 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={image}
              alt={`Hero image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-[4000ms] ease-out"
              style={{
                transform: index === currentIndex ? 'scale(1.05)' : 'scale(1)',
              }}
            />
          </div>
        ))}
        
        {/* Dynamic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-black/30" />
      </div>

      {/* Animated Floating Image Collage */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating images with staggered animations */}
        {[...Array(6)].map((_, i) => {
          const positions = [
            { top: '10%', left: '8%', rotation: 15, size: 'w-20 h-20 md:w-28 md:h-28', animation: 'animate-float' },
            { top: '15%', right: '12%', rotation: -8, size: 'w-16 h-16 md:w-24 md:h-24', animation: 'animate-float-delayed' },
            { bottom: '25%', left: '15%', rotation: -15, size: 'w-24 h-24 md:w-32 md:h-32', animation: 'animate-float' },
            { bottom: '15%', right: '10%', rotation: 12, size: 'w-18 h-18 md:w-26 md:h-26', animation: 'animate-float-delayed' },
            { top: '45%', left: '5%', rotation: 8, size: 'w-14 h-14 md:w-20 md:h-20', animation: 'animate-pulse-slow' },
            { top: '60%', right: '8%', rotation: -12, size: 'w-22 h-22 md:w-30 md:h-30', animation: 'animate-float' },
          ];
          
          const position = positions[i];
          const imageIndex = (currentIndex + i + 1) % heroImages.length;
          
          return (
            <div
              key={i}
              className={`absolute ${position.size} rounded-xl overflow-hidden shadow-2xl transition-all duration-1000 ease-out ${position.animation} ${
                isLoaded ? 'opacity-80 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                ...position,
                transform: `rotate(${position.rotation}deg) ${isLoaded ? 'translateY(0)' : 'translateY(2rem)'}`,
                transitionDelay: `${i * 200}ms`,
                animationDelay: `${i * 300}ms`,
              }}
            >
              <img
                src={heroImages[imageIndex]}
                alt={`Floating image ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          );
        })}
      </div>

      {/* Content with enhanced animations */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className={`text-center text-white transition-all duration-1000 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 drop-shadow-2xl">
            <span className="inline-block animate-fade-in-up">LUX HAIR & CLOTHING</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto mb-8 drop-shadow-lg leading-relaxed">
            Where quality and style defines your personality
          </p>
          <Link href="/shop">
            <Button 
              size="lg" 
              className="px-10 py-4 text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              SHOP NOW
            </Button>
          </Link>
        </div>
      </div>

      {/* Enhanced Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-3 z-10">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-0.5 md:h-2 rounded-full transition-all duration-500 hover:bg-white/80 ${
              index === currentIndex 
                ? 'bg-white w-6 md:w-8 shadow-lg' 
                : 'bg-white/40 w-2 md:w-2 hover:w-4 md:hover:w-4'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Enhanced Side Navigation Thumbnails */}
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 hidden lg:flex flex-col space-y-3 z-10">
        {heroImages.slice(0, 4).map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-110 ${
              index === currentIndex 
                ? 'border-white scale-110 shadow-xl' 
                : 'border-white/50 hover:border-white/80 shadow-lg'
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Animated corner decorations */}
      <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-white/30 z-10 animate-pulse-slow"></div>
      <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-white/30 z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-white/30 z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-white/30 z-10 animate-pulse-slow"></div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-10">
        <div 
          className="h-full bg-white transition-all duration-[4000ms] ease-linear"
          style={{
            width: `${((currentIndex + 1) / heroImages.length) * 100}%`,
          }}
        />
      </div>
    </section>
  );
} 