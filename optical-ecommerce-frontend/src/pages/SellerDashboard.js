import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import ShopperProducts from './ShopperProducts';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalRevenue: 0, pendingOrders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const mockProducts = [
        { _id: '1', name: 'Ray-Ban Aviator', price: 150, stock: 25, category: 'sunglasses', enabled: true },
        { _id: '2', name: 'Blue Light Glasses', price: 45, stock: 5, category: 'frames', enabled: true },
        { _id: '3', name: 'Contact Lenses', price: 30, stock: 0, category: 'lenses', enabled: false }
      ];
      const mockOrders = [
        { _id: '1', customerName: 'John Doe', total: 150, status: 'processing', items: 2, address: '123 Main St', date: '2024-01-15' },
        { _id: '2', customerName: 'Jane Smith', total: 75, status: 'shipped', items: 1, address: '456 Oak Ave', date: '2024-01-16' },
        { _id: '3', customerName: 'Mike Johnson', total: 200, status: 'delivered', items: 3, address: '789 Pine St', date: '2024-01-17' }
      ];
      
      setProducts(mockProducts);
      setOrders(mockOrders);
      setStats({
        totalProducts: mockProducts.length,
        totalOrders: mockOrders.length,
        totalRevenue: mockOrders.reduce((sum, order) => sum + order.total, 0),
        pendingOrders: mockOrders.filter(o => o.status === 'processing').length
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    toast.success(`Order status updated to ${newStatus}!`);
  };

  const lowStockProducts = products.filter(p => p.stock <= 5 && p.stock > 0);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue',
      data: [12000, 19000, 15000, 25000, 22000, 30000],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true
    }]
  };

  const categoryData = {
    labels: ['Frames', 'Sunglasses', 'Lenses'],
    datasets: [{
      data: [45, 30, 25],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
      borderWidth: 0
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#1f2937', padding: 12, cornerRadius: 8 }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
      x: { grid: { display: false } }
    }
  };

  const sidebarItems = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'products', label: 'Products', icon: '📦' },
    { key: 'orders', label: 'Orders', icon: '🛒' },
    { key: 'inventory', label: 'Inventory', icon: '📋' },
    { key: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b bg-blue-600">
          <h1 className="text-xl font-bold text-white">Shopper Admin</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">✕</button>
        </div>
        
        <nav className="p-4 space-y-2">
          {sidebarItems.map(item => (
            <button
              key={item.key}
              onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === item.key ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-4 text-gray-600">☰</button>
            <h2 className="text-xl font-semibold text-gray-800">{sidebarItems.find(item => item.key === activeTab)?.label}</h2>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <span className="text-xl">🔔</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">S</div>
              <span className="text-sm font-medium text-gray-700">Shopper</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">₹{stats.totalRevenue}</p>
                      <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders}</p>
                      <p className="text-xs text-green-600 mt-1">↑ 8% from last month</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🛒</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalProducts}</p>
                      <p className="text-xs text-gray-500 mt-1">{products.filter(p => p.enabled).length} active</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pending Orders</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingOrders}</p>
                      <p className="text-xs text-orange-600 mt-1">Needs attention</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">⏳</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
                  <div className="h-64">
                    <Line data={salesData} options={chartOptions} />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
                  <div className="h-64 flex items-center justify-center">
                    <Doughnut data={categoryData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.slice(0, 5).map(order => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order._id}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{order.customerName}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{order.total}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products */}
          {activeTab === 'products' && <ShopperProducts />}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">Order #{order._id}</h3>
                      <p className="text-sm text-gray-600 mt-1">{order.customerName} • {order.address}</p>
                      <p className="text-sm text-gray-500 mt-1">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">₹{order.total}</p>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="mt-2 px-3 py-1 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Inventory */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              {lowStockProducts.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-orange-600 mb-4">⚠️ Low Stock Alert</h3>
                  <div className="space-y-3">
                    {lowStockProducts.map(product => (
                      <div key={product._id} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                        <span className="font-medium text-gray-900">{product.name}</span>
                        <span className="text-orange-600 font-semibold">{product.stock} left</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {outOfStockProducts.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-red-600 mb-4">❌ Out of Stock</h3>
                  <div className="space-y-3">
                    {outOfStockProducts.map(product => (
                      <div key={product._id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="font-medium text-gray-900">{product.name}</span>
                        <span className="text-red-600 font-semibold">Out of stock</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {lowStockProducts.length === 0 && outOfStockProducts.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <span className="text-6xl">✅</span>
                  <h3 className="text-xl font-semibold text-gray-900 mt-4">All Good!</h3>
                  <p className="text-gray-600 mt-2">All products are well stocked</p>
                </div>
              )}
            </div>
          )}

          {/* Analytics */}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
                <div className="h-64">
                  <Line data={salesData} options={chartOptions} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
                <div className="h-64">
                  <Bar data={{
                    labels: ['Frames', 'Lenses', 'Sunglasses'],
                    datasets: [{
                      label: 'Sales',
                      data: [15000, 8000, 12000],
                      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b']
                    }]
                  }} options={chartOptions} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SellerDashboard;