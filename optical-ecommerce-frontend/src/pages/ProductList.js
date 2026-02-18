import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sortBy: 'name',
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.page > 1) params.set('page', filters.page.toString());
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Mock data for UI testing
      const mockProducts = [
        { _id: 1, name: 'Ray-Ban Aviator', price: 150, originalPrice: 200, image: 'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=300', rating: 4.5, reviews: 128 },
        { _id: 2, name: 'Oakley Holbrook', price: 120, image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=300', rating: 4.3, reviews: 95 },
        { _id: 3, name: 'Warby Parker Clark', price: 95, originalPrice: 120, image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=300', rating: 4.7, reviews: 203 },
        { _id: 4, name: 'Tom Ford FT5401', price: 280, image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=300', rating: 4.8, reviews: 67 },
        { _id: 5, name: 'Persol PO3019S', price: 180, image: 'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=300', rating: 4.6, reviews: 156 },
        { _id: 6, name: 'Maui Jim Peahi', price: 220, originalPrice: 250, image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=300', rating: 4.9, reviews: 89 },
        { _id: 7, name: 'Gucci GG0061S', price: 320, image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=300', rating: 4.4, reviews: 134 },
        { _id: 8, name: 'Prada PR 17WS', price: 290, image: 'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=300', rating: 4.5, reviews: 78 },
      ];
      setProducts(mockProducts);
      setTotalPages(1);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Products</h1>
        <div style={styles.controls}>
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            style={styles.select}
          >
            <option value="">All Categories</option>
            <option value="frames">Frames</option>
            <option value="sunglasses">Sunglasses</option>
            <option value="lenses">Lenses</option>
            <option value="contact-lenses">Contact Lenses</option>
          </select>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            style={styles.select}
          >
            <option value="name">Name</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading products...</div>
      ) : (
        <>
          <div style={styles.results}>
            {products.length} products found
          </div>
          <div style={styles.grid}>
            {products.map(product => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
          {products.length === 0 && (
            <div style={styles.noResults}>No products found</div>
          )}
        </>
      )}

      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1}
            style={{...styles.pageBtn, ...(filters.page === 1 ? styles.disabled : {})}}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              style={{...styles.pageBtn, ...(page === filters.page ? styles.active : {})}}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page === totalPages}
            style={{...styles.pageBtn, ...(filters.page === totalPages ? styles.disabled : {})}}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  header: {
    marginBottom: '2rem'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#333'
  },
  controls: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  searchInput: {
    flex: 1,
    minWidth: '200px',
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  select: {
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    minWidth: '150px'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#666'
  },
  results: {
    marginBottom: '1rem',
    color: '#666',
    fontSize: '0.9rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  noResults: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#666'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '2rem'
  },
  pageBtn: {
    padding: '0.5rem 1rem',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    cursor: 'pointer',
    borderRadius: '4px'
  },
  active: {
    backgroundColor: '#FF9900',
    color: 'white',
    borderColor: '#FF9900'
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  }
};

export default ProductList;
