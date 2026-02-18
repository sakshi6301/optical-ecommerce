import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { items, updateItem, removeItem, clearCart, getTotalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.empty}>
          <h1>Your Cart is Empty</h1>
          <p>Add some items to get started</p>
          <Link to="/products" style={styles.shopBtn}>Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Shopping Cart</h1>
      
      <div style={styles.layout}>
        <div style={styles.itemsSection}>
          {items.map(item => (
            <div key={item.id} style={styles.cartItem}>
              <img 
                src={item.image || '/placeholder.jpg'} 
                alt={item.name}
                style={styles.itemImage}
              />
              <div style={styles.itemInfo}>
                <h3 style={styles.itemName}>{item.name}</h3>
                <p style={styles.itemPrice}>${item.price}</p>
              </div>
              <div style={styles.quantitySection}>
                <label>Qty:</label>
                <select 
                  value={item.quantity} 
                  onChange={(e) => updateItem(item.id, parseInt(e.target.value))}
                  style={styles.quantitySelect}
                >
                  {Array.from({length: 10}, (_, i) => (
                    <option key={i+1} value={i+1}>{i+1}</option>
                  ))}
                </select>
              </div>
              <div style={styles.itemTotal}>
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <button 
                onClick={() => removeItem(item.id)}
                style={styles.removeBtn}
              >
                Remove
              </button>
            </div>
          ))}
          
          <div style={styles.cartActions}>
            <button onClick={clearCart} style={styles.clearBtn}>
              Clear Cart
            </button>
            <Link to="/products" style={styles.continueBtn}>
              Continue Shopping
            </Link>
          </div>
        </div>

        <div style={styles.summarySection}>
          <div style={styles.summary}>
            <h3>Order Summary</h3>
            <div style={styles.summaryRow}>
              <span>Subtotal ({items.length} items):</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Shipping:</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            {shipping === 0 && (
              <p style={styles.freeShipping}>🎉 You qualify for free shipping!</p>
            )}
            <div style={{...styles.summaryRow, ...styles.total}}>
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Link to="/checkout" style={styles.checkoutBtn}>
              Proceed to Checkout
            </Link>
          </div>
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
  title: {
    fontSize: '2rem',
    marginBottom: '2rem',
    color: '#333'
  },
  empty: {
    textAlign: 'center',
    padding: '3rem'
  },
  shopBtn: {
    display: 'inline-block',
    padding: '1rem 2rem',
    backgroundColor: '#FF9900',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: 'bold'
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem'
  },
  itemsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  cartItem: {
    display: 'grid',
    gridTemplateColumns: '100px 1fr auto auto auto',
    gap: '1rem',
    alignItems: 'center',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: 'white'
  },
  itemImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '4px'
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  itemName: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: '500'
  },
  itemPrice: {
    margin: 0,
    color: '#666'
  },
  quantitySection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  quantitySelect: {
    padding: '0.25rem',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  itemTotal: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#B12704'
  },
  removeBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  cartActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #ddd'
  },
  clearBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  continueBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#28a745',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: 'bold'
  },
  summarySection: {
    height: 'fit-content'
  },
  summary: {
    padding: '1.5rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: 'white',
    position: 'sticky',
    top: '2rem'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '0.75rem 0',
    fontSize: '1rem'
  },
  total: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    borderTop: '1px solid #ddd',
    paddingTop: '0.75rem',
    marginTop: '1rem'
  },
  freeShipping: {
    color: '#28a745',
    fontSize: '0.9rem',
    margin: '0.5rem 0'
  },
  checkoutBtn: {
    display: 'block',
    width: '100%',
    padding: '1rem',
    backgroundColor: '#FF9900',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    marginTop: '1rem'
  }
};

export default Cart;