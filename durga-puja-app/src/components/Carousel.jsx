import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const images = [
    'https://images.pexels.com/photos/19124084/pexels-photo-19124084/free-photo-of-man-painting-durga-statue.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/15873619/pexels-photo-15873619/free-photo-of-a-colorful-durga-goddess-statue.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/18118229/pexels-photo-18118229/free-photo-of-men-sitting-on-a-street-in-front-of-a-sculpture.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/14088854/pexels-photo-14088854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/28510853/pexels-photo-28510853/free-photo-of-artisan-creating-clay-idols-in-workshop.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/14097679/pexels-photo-14097679.jpeg?auto=compress&cs=tinysrgb&w=600'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="lg:w-[50%] lg:h-[70vh] w-screen h-[60vh] relative overflow-hidden">
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {images.map((img, idx) => (
          <div key={idx} className="flex-shrink-0 w-full h-full">
            <img 
              className="w-full h-full object-cover" 
              src={img} 
              alt={`Durga ${idx + 1}`}
            />
          </div>
        ))}
      </div>
      
      <button 
        className="absolute top-1/2 left-4 w-10 h-10 transform -translate-y-1/2 bg-[#4B2E2E] text-[#FFD700] opacity-70 rounded-full hover:opacity-100 flex items-center justify-center"
        onClick={prevSlide}
      >
        <ChevronLeft />
      </button>
      <button 
        className="absolute top-1/2 right-4 w-10 h-10 transform -translate-y-1/2 bg-[#4B2E2E] text-[#FFD700] opacity-70 rounded-full hover:opacity-100 flex items-center justify-center"
        onClick={nextSlide}
      >
        <ChevronRight />
      </button>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {images.map((_, idx) => (
          <span 
            key={idx}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
              idx === currentSlide ? 'bg-[#FFD700] w-4 h-4' : 'bg-[#FDF5E6] opacity-60'
            }`}
            onClick={() => setCurrentSlide(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;