import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalOrders: 0, totalSales: 0 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsResponse, ordersResponse] = await Promise.all([
        apiService.getAdminStats(),
        apiService.getAllOrders()
      ]);
      setStats(statsResponse.stats || { totalUsers: 0, totalOrders: 0, totalSales: 0 });
      setOrders(ordersResponse.orders || []);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await apiService.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      alert('Failed to update order status: ' + error.message);
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

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading dashboard...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={statCardStyle}>
          <h3>Total Users</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>{stats.totalUsers}</p>
        </div>
        <div style={statCardStyle}>
          <h3>Total Orders</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>{stats.totalOrders}</p>
        </div>
        <div style={statCardStyle}>
          <h3>Total Sales</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc3545' }}>₹{stats.totalSales?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      {/* Orders List */}
      <div style={cardStyle}>
        <h2>All Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {orders.map((order) => (
              <div key={order._id} style={orderCardStyle}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4>Order #{order._id?.slice(-8)}</h4>
                    <span style={{
                      ...statusBadgeStyle,
                      backgroundColor: getStatusColor(order.status)
                    }}>
                      {order.status || 'Processing'}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', fontSize: '0.9rem', color: '#666' }}>
                    <div><strong>Customer:</strong> {order.shippingAddress?.fullName || 'N/A'}</div>
                    <div><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</div>
                    <div><strong>Amount:</strong> ₹{order.totalAmount?.toFixed(2)}</div>
                    <div><strong>Items:</strong> {order.items?.length || 0}</div>
                  </div>
                </div>
                <div style={{ marginLeft: '1rem' }}>
                  <select
                    value={order.status || 'processing'}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    style={selectStyle}
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const statCardStyle = {
  backgroundColor: '#fff',
  padding: '1.5rem',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  border: '1px solid #ddd',
  textAlign: 'center'
};

const cardStyle = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  border: '1px solid #ddd'
};

const orderCardStyle = {
  backgroundColor: '#f8f9fa',
  padding: '1rem',
  borderRadius: '6px',
  border: '1px solid #dee2e6',
  display: 'flex',
  alignItems: 'center'
};

const statusBadgeStyle = {
  padding: '0.25rem 0.75rem',
  borderRadius: '20px',
  color: 'white',
  fontSize: '0.8rem',
  fontWeight: 'bold'
};

const selectStyle = {
  padding: '0.5rem',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '0.9rem'
};

export default AdminDashboard;