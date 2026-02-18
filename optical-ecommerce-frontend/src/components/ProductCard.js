import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <motion.div 
        whileHover={{ y: -2, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
        className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 transition-all group"
      >
        <div className="flex">
          <Link to={`/products/${product.id}`} className="flex-shrink-0">
            <div className="relative w-48 h-32 overflow-hidden">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                src={product.image || '/placeholder.jpg'} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.originalPrice && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </div>
              )}
            </div>
          </Link>
          
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <Link to={`/products/${product.id}`}>
                <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">
                  {product.name}
                </h3>
              </Link>
              
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={i < Math.floor(product.rating || 4) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">({product.reviews || 0})</span>
              </div>
              
              <div className="flex items-baseline gap-2">
                {product.originalPrice && (
                  <span className="text-gray-400 line-through text-sm">₹{product.originalPrice}</span>
                )}
                <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart size={16} />
                Add to Cart
              </motion.button>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <Heart size={18} />
              </button>
              <Link to={`/products/${product.id}`} className="p-2 text-gray-400 hover:text-orange-500 transition-colors">
                <Eye size={18} />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
      className="bg-white rounded-2xl overflow-hidden shadow-md transition-all group relative"
    >
      {/* Wishlist Button */}
      <button className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-red-500">
        <Heart size={18} />
      </button>
      
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden aspect-square">
          <motion.img 
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
            src={product.image || '/placeholder.jpg'} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.originalPrice && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </div>
          )}
          
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-gray-800 font-medium flex items-center gap-2"
            >
              <Eye size={16} />
              Quick View
            </motion.div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={16} 
                className={i < Math.floor(product.rating || 4) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">({product.reviews || 0})</span>
          </div>
          
          <div className="flex items-baseline gap-2 mb-4">
            {product.originalPrice && (
              <span className="text-gray-400 line-through text-sm">₹{product.originalPrice}</span>
            )}
            <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
          </div>
        </div>
      </Link>
      
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold flex items-center justify-center gap-2 hover:from-orange-600 hover:to-orange-700 transition-all"
      >
        <ShoppingCart size={20} />
        Add to Cart
      </motion.button>
    </motion.div>
  );
};

export default ProductCard;