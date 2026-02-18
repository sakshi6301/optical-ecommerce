import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await apiService.getUserOrders();
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
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

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading orders...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>My Orders</h1>
      
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No orders found</p>
          <Link to="/products" style={linkStyle}>Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {orders.map((order) => (
            <Link key={order._id} to={`/orders/${order._id}`} style={{ textDecoration: 'none' }}>
              <div style={orderCardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3>Order #{order._id?.slice(-8)}</h3>
                    <p style={{ margin: '0.5rem 0', color: '#666' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p style={{ margin: '0.5rem 0' }}>₹{order.totalAmount?.toFixed(2)}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      ...statusBadgeStyle,
                      backgroundColor: getStatusColor(order.status)
                    }}>
                      {order.status || 'Processing'}
                    </span>
                    <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: '#666' }}>
                      {order.items?.length || 0} item(s)
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const orderCardStyle = {
  backgroundColor: '#fff',
  padding: '1.5rem',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  border: '1px solid #ddd',
  transition: 'transform 0.2s',
  cursor: 'pointer'
};

const statusBadgeStyle = {
  padding: '0.25rem 0.75rem',
  borderRadius: '20px',
  color: 'white',
  fontSize: '0.8rem',
  fontWeight: 'bold'
};

const linkStyle = {
  color: '#007bff',
  textDecoration: 'none',
  padding: '0.5rem 1rem',
  border: '1px solid #007bff',
  borderRadius: '4px'
};

export default Orders;