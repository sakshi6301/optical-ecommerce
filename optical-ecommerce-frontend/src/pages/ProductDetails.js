import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { addItem } = useCart();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      // Mock data for UI testing
      const mockProduct = {
        _id: id,
        name: 'Ray-Ban Aviator Classic',
        description: 'The iconic Ray-Ban Aviator sunglasses feature a timeless design with high-quality lenses that provide 100% UV protection. Perfect for any occasion.',
        price: 150,
        originalPrice: 200,
        discountPercentage: 25,
        finalPrice: 150,
        images: [
          { url: 'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=500', alt: 'Front view' },
          { url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500', alt: 'Side view' },
          { url: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500', alt: 'Detail view' }
        ],
        stock: 15,
        averageRating: 4.5,
        reviewCount: 128,
        brand: 'Ray-Ban',
        sku: 'RB-AV-001',
        seller: { name: 'Sujal Optical Store' }
      };
      setProduct(mockProduct);
      // Uncomment when backend is ready:
      // const data = await apiService.getProduct(id);
      // setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await apiService.getReviews(id);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast.success(`${product.name} added to cart!`);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.addReview(id, reviewForm);
      toast.success('Review added successfully!');
      setReviewForm({ rating: 5, comment: '' });
      setShowReviewForm(false);
      fetchReviews();
    } catch (error) {
      toast.error('Failed to add review: ' + error.message);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading product...</div>;
  }

  if (!product) {
    return <div style={styles.error}>Product not found</div>;
  }

  const images = product.images || [{ url: '/placeholder.jpg', alt: product.name }];

  return (
    <div style={styles.container}>
      <div style={styles.productLayout}>
        {/* Image Carousel */}
        <div style={styles.imageSection}>
          <div style={styles.mainImage}>
            <img 
              src={images[currentImage]?.url || '/placeholder.jpg'} 
              alt={product.name}
              style={styles.image}
            />
          </div>
          {images.length > 1 && (
            <div style={styles.thumbnails}>
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt={img.alt || product.name}
                  style={{...styles.thumbnail, ...(index === currentImage ? styles.activeThumbnail : {})}}
                  onClick={() => setCurrentImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={styles.infoSection}>
          <h1 style={styles.title}>{product.name}</h1>
          <div style={styles.rating}>
            {'★'.repeat(Math.floor(product.averageRating || 4))}
            <span style={styles.ratingText}>({product.reviewCount || 0} reviews)</span>
          </div>
          
          <div style={styles.price}>
            {product.originalPrice && (
              <span style={styles.originalPrice}>${product.originalPrice}</span>
            )}
            <span style={styles.currentPrice}>${product.finalPrice || product.price}</span>
            {product.discountPercentage > 0 && (
              <span style={styles.discount}>({product.discountPercentage}% off)</span>
            )}
          </div>

          <p style={styles.description}>{product.description}</p>

          <div style={styles.stock}>
            <span style={{color: product.stock > 0 ? 'green' : 'red'}}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div style={styles.actions}>
            <div style={styles.quantitySection}>
              <label>Quantity:</label>
              <select 
                value={quantity} 
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                style={styles.quantitySelect}
              >
                {Array.from({length: Math.min(product.stock, 10)}, (_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              style={{...styles.addToCartBtn, ...(product.stock === 0 ? styles.disabled : {})}}
            >
              Add to Cart
            </button>
          </div>

          {/* Seller Info */}
          {product.seller && (
            <div style={styles.sellerInfo}>
              <h3>Seller Information</h3>
              <p><strong>Seller:</strong> {product.seller.name || 'Store'}</p>
              <p><strong>Brand:</strong> {product.brand}</p>
              <p><strong>SKU:</strong> {product.sku}</p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          {isAuthenticated && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Write a Review
            </button>
          )}
        </div>

        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="mb-6 p-4 border border-gray-300 rounded-lg">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <select
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[5, 4, 3, 2, 1].map(num => (
                  <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Comment</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Submit Review
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <strong className="text-gray-900">{review.user?.name || 'Anonymous'}</strong>
                    <div className="text-yellow-400">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem'
  },
  error: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: 'red'
  },
  productLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    marginBottom: '3rem'
  },
  imageSection: {
    display: 'flex',
    flexDirection: 'column'
  },
  mainImage: {
    marginBottom: '1rem'
  },
  image: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '8px'
  },
  thumbnails: {
    display: 'flex',
    gap: '0.5rem',
    overflowX: 'auto'
  },
  thumbnail: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '4px',
    cursor: 'pointer',
    border: '2px solid transparent'
  },
  activeThumbnail: {
    border: '2px solid #FF9900'
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  title: {
    fontSize: '2rem',
    margin: 0,
    color: '#333'
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#FFA41C'
  },
  ratingText: {
    color: '#007185'
  },
  price: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  originalPrice: {
    textDecoration: 'line-through',
    color: '#999'
  },
  currentPrice: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#B12704'
  },
  discount: {
    color: '#B12704',
    fontWeight: 'bold'
  },
  description: {
    lineHeight: 1.6,
    color: '#666'
  },
  stock: {
    fontWeight: 'bold'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  quantitySection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  quantitySelect: {
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  addToCartBtn: {
    padding: '1rem 2rem',
    backgroundColor: '#FF9900',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  disabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed'
  },
  sellerInfo: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginTop: '1rem'
  },
  reviewsSection: {
    borderTop: '1px solid #ddd',
    paddingTop: '2rem'
  },
  reviewSummary: {
    marginBottom: '2rem'
  },
  ratingOverview: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  avgRating: {
    fontSize: '2rem',
    fontWeight: 'bold'
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  review: {
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px'
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem'
  },
  reviewRating: {
    color: '#FFA41C'
  }
};

export default ProductDetails;