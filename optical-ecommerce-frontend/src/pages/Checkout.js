import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiService from '../services/api';

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    const scriptLoaded = await loadRazorpayScript();
    
    if (!scriptLoaded) {
      toast.error('Payment system failed to load. Please try again.');
      setLoading(false);
      return;
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_1234567890',
      amount: getTotalPrice() * 100, // Amount in paise
      currency: 'INR',
      name: 'Optical Store',
      description: 'Order Payment',
      handler: async (response) => {
        try {
          const orderData = {
            items: items.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price
            })),
            shippingAddress,
            totalAmount: getTotalPrice(),
            paymentId: response.razorpay_payment_id
          };
          
          await apiService.createOrder(orderData);
          clearCart();
          toast.success('Order placed successfully! 🎉');
          navigate('/orders');
        } catch (error) {
          toast.error('Failed to place order: ' + error.message);
        }
      },
      prefill: {
        name: shippingAddress.fullName,
        contact: shippingAddress.phone
      },
      theme: {
        color: '#3399cc'
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setLoading(false);
  };

  const validateForm = () => {
    const required = ['fullName', 'address', 'city', 'state', 'pincode', 'phone'];
    for (let field of required) {
      if (!shippingAddress[field].trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/products')} style={buttonStyle}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1>Checkout</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
        {/* Shipping Address Form */}
        <div style={cardStyle}>
          <h2>Shipping Address</h2>
          <form style={{ display: 'grid', gap: '1rem' }}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={shippingAddress.fullName}
              onChange={handleInputChange}
              style={inputStyle}
              required
            />
            <textarea
              name="address"
              placeholder="Address"
              value={shippingAddress.address}
              onChange={handleInputChange}
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
              required
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={shippingAddress.city}
                onChange={handleInputChange}
                style={inputStyle}
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={shippingAddress.state}
                onChange={handleInputChange}
                style={inputStyle}
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={shippingAddress.pincode}
                onChange={handleInputChange}
                style={inputStyle}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={shippingAddress.phone}
                onChange={handleInputChange}
                style={inputStyle}
                required
              />
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div style={cardStyle}>
          <h2>Order Summary</h2>
          <div style={{ marginBottom: '1rem' }}>
            {items.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>Qty: {item.quantity}</div>
                </div>
                <div style={{ fontWeight: 'bold' }}>₹{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          
          <div style={{ borderTop: '2px solid #333', paddingTop: '1rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
              <span>Total: ₹{getTotalPrice().toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            style={{
              ...buttonStyle,
              width: '100%',
              marginTop: '1rem',
              backgroundColor: loading ? '#ccc' : '#28a745'
            }}
          >
            {loading ? 'Processing...' : 'Pay with Razorpay'}
          </button>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  border: '1px solid #ddd'
};

const inputStyle = {
  padding: '0.75rem',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '1rem'
};

const buttonStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s'
};

export default Checkout;