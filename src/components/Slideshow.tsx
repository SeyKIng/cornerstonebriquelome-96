
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

interface SlideshowProps {
  images: string[];
  slogan?: string;
  autoplayInterval?: number;
}

const Slideshow = ({ 
  images = [], 
  slogan, 
  autoplayInterval = 5000 
}: SlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const isMobile = useIsMobile();
  
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    
    if (isAutoplay) {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, autoplayInterval);
    }

    return () => {
      resetTimeout();
    };
  }, [currentIndex, autoplayInterval, images.length, isAutoplay]);

  const goToNext = () => {
    setIsAutoplay(false); // Pause autoplay when manually navigating
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => {
      setIsAutoplay(true);
    }, 10000);
  };

  const goToPrev = () => {
    setIsAutoplay(false); // Pause autoplay when manually navigating
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => {
      setIsAutoplay(true);
    }, 10000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      goToNext();
    }
    if (touchStart - touchEnd < -75) {
      goToPrev();
    }
  };

  if (images.length === 0) return null;

  return (
    <div 
      className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      
      {/* Left Navigation Button */}
      <button 
        onClick={goToPrev} 
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 p-1 sm:p-2 rounded-full text-white"
        aria-label="Previous slide"
      >
        <ChevronLeft size={isMobile ? 20 : 24} />
      </button>
      
      {/* Right Navigation Button */}
      <button 
        onClick={goToNext} 
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 p-1 sm:p-2 rounded-full text-white"
        aria-label="Next slide"
      >
        <ChevronRight size={isMobile ? 20 : 24} />
      </button>
      
      {images.map((image, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt={`Slide ${idx + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      
      {slogan && (
        <div className="absolute bottom-0 inset-x-0 z-20 p-4 sm:p-6 md:p-10 text-center">
          <div className="bg-black/50 backdrop-blur-md p-3 sm:p-4 md:p-8 rounded-lg inline-block max-w-[90%] mx-auto">
            <p className="text-white text-base sm:text-lg md:text-2xl lg:text-3xl font-semibold">
              {slogan}
            </p>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-2 sm:bottom-4 inset-x-0 flex justify-center gap-1 sm:gap-2 z-20">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              setIsAutoplay(false);
              
              // Resume autoplay after 10 seconds of inactivity
              setTimeout(() => {
                setIsAutoplay(true);
              }, 10000);
            }}
            className={`h-1 sm:h-2 transition-all ${
              idx === currentIndex ? 'bg-white w-3 sm:w-4' : 'bg-white/50 w-1 sm:w-2'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
