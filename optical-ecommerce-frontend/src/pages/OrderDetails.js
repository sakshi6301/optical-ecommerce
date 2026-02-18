import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../services/api';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await apiService.getUserOrder(id);
      setOrder(response.order);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing': return '#ffc107';
      case 'shipped': return '#17a2b8';
      case 'delivered': return '#28a745';
      default: return '#6c757d';
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading order details...</div>;
  if (!order) return <div style={{ textAlign: 'center', padding: '2rem' }}>Order not found</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <Link to="/orders" style={linkStyle}>← Back to Orders</Link>
      
      <div style={{ marginTop: '1rem' }}>
        <h1>Order #{order._id?.slice(-8)}</h1>
        <p style={{ color: '#666' }}>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
      </div>

      <div style={{ display: 'grid', gap: '2rem', marginTop: '2rem' }}>
        {/* Order Status */}
        <div style={cardStyle}>
          <h2>Order Status</h2>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <span style={{
              ...statusBadgeStyle,
              backgroundColor: getStatusColor(order.status)
            }}>
              {order.status || 'Processing'}
            </span>
            <span style={{
              ...statusBadgeStyle,
              backgroundColor: order.paymentStatus === 'paid' ? '#28a745' : '#dc3545'
            }}>
              Payment: {order.paymentStatus || 'Pending'}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div style={cardStyle}>
          <h2>Order Items</h2>
          {order.items?.map((item, index) => (
            <div key={index} style={itemStyle}>
              <div>
                <h4>{item.name || `Product ${item.productId}`}</h4>
                <p style={{ color: '#666' }}>Quantity: {item.quantity}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 'bold' }}>₹{(item.price * item.quantity).toFixed(2)}</p>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>₹{item.price} each</p>
              </div>
            </div>
          ))}
          <div style={{ borderTop: '2px solid #333', paddingTop: '1rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
              <span>Total: ₹{order.totalAmount?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div style={cardStyle}>
          <h2>Shipping Address</h2>
          {order.shippingAddress ? (
            <div>
              <p><strong>{order.shippingAddress.fullName}</strong></p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
          ) : (
            <p>No shipping address available</p>
          )}
        </div>

        {/* Payment Information */}
        {order.paymentId && (
          <div style={cardStyle}>
            <h2>Payment Information</h2>
            <p><strong>Payment ID:</strong> {order.paymentId}</p>
            <p><strong>Amount:</strong> ₹{order.totalAmount?.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const cardStyle = {
  backgroundColor: '#fff',
  padding: '1.5rem',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  border: '1px solid #ddd'
};

const itemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 0',
  borderBottom: '1px solid #eee'
};

const statusBadgeStyle = {
  padding: '0.5rem 1rem',
  borderRadius: '20px',
  color: 'white',
  fontSize: '0.9rem',
  fontWeight: 'bold'
};

const linkStyle = {
  color: '#007bff',
  textDecoration: 'none',
  fontSize: '1rem'
};

export default OrderDetails;