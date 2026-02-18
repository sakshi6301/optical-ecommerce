import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Truck, Award, Eye, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    { 
      id: 1, 
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1920&h=700&fit=crop&q=80', 
      title: 'See the World Clearly', 
      subtitle: 'Premium eyewear collection starting at ₹999',
      badge: 'New Arrivals'
    },
    { 
      id: 2, 
      image: 'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=1920&h=700&fit=crop&q=80', 
      title: 'Designer Sunglasses', 
      subtitle: 'UV protection meets style - Up to 40% off',
      badge: 'Best Sellers'
    },
    { 
      id: 3, 
      image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=1920&h=700&fit=crop&q=80', 
      title: 'Crystal Clear Vision', 
      subtitle: 'Advanced lenses with blue light protection',
      badge: 'Trending'
    }
  ];

  const categories = [
    { 
      id: 1, 
      name: 'Frames', 
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=300&h=200&fit=crop', 
      link: '/products?category=frames',
      count: '500+ Products'
    },
    { 
      id: 2, 
      name: 'Sunglasses', 
      image: 'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=300&h=200&fit=crop', 
      link: '/products?category=sunglasses',
      count: '300+ Products'
    },
    { 
      id: 3, 
      name: 'Lenses', 
      image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=300&h=200&fit=crop', 
      link: '/products?category=lenses',
      count: '200+ Products'
    },
    { 
      id: 4, 
      name: 'Contact Lenses', 
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=200&fit=crop', 
      link: '/products?category=contact-lenses',
      count: '150+ Products'
    }
  ];

  const featuredProducts = [
    { id: 1, name: 'Ray-Ban Aviator Classic', price: 150, originalPrice: 200, rating: 4.5, reviews: 128, image: 'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=300&h=300&fit=crop' },
    { id: 2, name: 'Oakley Holbrook', price: 120, rating: 4.3, reviews: 95, image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=300&h=300&fit=crop' },
    { id: 3, name: 'Warby Parker Clark', price: 95, originalPrice: 120, rating: 4.7, reviews: 203, image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=300&h=300&fit=crop' },
    { id: 4, name: 'Tom Ford FT5401', price: 280, rating: 4.8, reviews: 67, image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=300&h=300&fit=crop' }
  ];

  const bestSellers = [
    { id: 5, name: 'Persol PO3019S', price: 180, rating: 4.6, reviews: 156, image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=300&h=300&fit=crop' },
    { id: 6, name: 'Maui Jim Peahi', price: 220, originalPrice: 250, rating: 4.9, reviews: 89, image: 'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=300&h=300&fit=crop' },
    { id: 7, name: 'Gucci GG0061S', price: 320, rating: 4.4, reviews: 134, image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=300&h=300&fit=crop' },
    { id: 8, name: 'Prada PR 17WS', price: 290, rating: 4.5, reviews: 78, image: 'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=300&h=300&fit=crop' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  const features = [
    { icon: Shield, title: '100% Authentic', desc: 'Genuine products' },
    { icon: Truck, title: 'Free Shipping', desc: 'Orders above ₹500' },
    { icon: Award, title: 'Quality Assured', desc: 'Premium eyewear' },
    { icon: Eye, title: 'Free Eye Test', desc: 'At home service' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
        {/* Slides Container */}
        <div 
          className="flex h-full transition-transform duration-700 ease-in-out" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div key={banner.id} className="min-w-full h-full relative">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={banner.image} 
                  alt={banner.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
              </div>
              
              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ 
                      opacity: currentSlide === index ? 1 : 0, 
                      x: currentSlide === index ? 0 : -30 
                    }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="max-w-2xl"
                  >
                    {/* Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ 
                        opacity: currentSlide === index ? 1 : 0, 
                        y: currentSlide === index ? 0 : -10 
                      }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="inline-block mb-4"
                    >
                      <span className="px-4 py-1.5 bg-orange-600 text-white text-xs sm:text-sm font-semibold rounded-full">
                        {banner.badge}
                      </span>
                    </motion.div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-5 leading-tight">
                      {banner.title}
                    </h1>
                    
                    {/* Subtitle */}
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-6 sm:mb-8 font-light">
                      {banner.subtitle}
                    </p>
                    
                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Link 
                        to="/products?category=frames" 
                        className="group px-6 sm:px-8 py-3 sm:py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Shop Eyeglasses 
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link 
                        to="/products?category=sunglasses" 
                        className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center shadow-lg"
                      >
                        Shop Sunglasses
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation Dots */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'w-8 sm:w-10 bg-orange-600' 
                  : 'w-2 sm:w-2.5 bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows - Hidden on mobile */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-all duration-300 group"
        >
          <ChevronRight size={24} className="text-white rotate-180" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-all duration-300 group"
        >
          <ChevronRight size={24} className="text-white" />
        </button>
      </section>

      {/* Features */}
      <section className="border-b bg-gray-50">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl py-8 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="bg-orange-100 p-3 rounded-full mb-3">
                  <feature.icon className="text-orange-600" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1">{feature.title}</h3>
                <p className="text-xs md:text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
            <p className="text-gray-600">Find your perfect style</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link 
                key={category.id}
                to={category.link} 
                className="group block relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-lg md:text-xl font-bold text-white">{category.name}</h3>
                  <p className="text-white/80 text-sm">{category.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-600">Handpicked favorites for you</p>
            </div>
            <Link to="/products" className="text-orange-600 hover:text-orange-700 font-semibold hidden md:flex items-center gap-1">
              View All <ChevronRight size={18} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Best Sellers</h2>
              <p className="text-gray-600">Most loved by customers</p>
            </div>
            <Link to="/products" className="text-orange-600 hover:text-orange-700 font-semibold hidden md:flex items-center gap-1">
              View All <ChevronRight size={18} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Find Your Perfect Eyewear
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Browse our complete collection and discover styles that match your personality
          </p>
          <Link 
            to="/products" 
            className="inline-block px-8 py-3 bg-white text-orange-600 font-semibold rounded-md hover:bg-gray-50 transition-colors"
          >
            Explore All Products
          </Link>
        </div>
      </section>
    </div>
  );
};



export default Home;