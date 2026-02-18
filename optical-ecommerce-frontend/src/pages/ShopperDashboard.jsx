import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, Bell, TrendingUp, Package, ShoppingCart, 
  AlertCircle, LayoutDashboard, Box, Truck, 
  BarChart3, X, ChevronRight 
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ShopperDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ revenue: 0, orders: 0, products: 0, pending: 0 });

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
    
    // Count-up animation
    const targets = { revenue: 425, orders: 3, products: 3, pending: 1 };
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCounts({
        revenue: Math.floor((targets.revenue / steps) * step),
        orders: Math.floor((targets.orders / steps) * step),
        products: Math.floor((targets.products / steps) * step),
        pending: Math.floor((targets.pending / steps) * step)
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Products', icon: Box },
    { name: 'Orders', icon: ShoppingCart },
    { name: 'Inventory', icon: Package },
    { name: 'Analytics', icon: BarChart3 }
  ];

  const stats = [
    { 
      title: 'Total Revenue', 
      value: `₹${counts.revenue}`, 
      change: '+12%', 
      icon: TrendingUp, 
      color: 'bg-green-500',
      trend: 'up'
    },
    { 
      title: 'Total Orders', 
      value: counts.orders, 
      change: '+8%', 
      icon: ShoppingCart, 
      color: 'bg-blue-500',
      trend: 'up'
    },
    { 
      title: 'Total Products', 
      value: counts.products, 
      change: '2 active', 
      icon: Package, 
      color: 'bg-purple-500',
      trend: 'neutral'
    },
    { 
      title: 'Pending Orders', 
      value: counts.pending, 
      change: 'Needs attention', 
      icon: AlertCircle, 
      color: 'bg-orange-500',
      trend: 'alert'
    }
  ];

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue',
      data: [65, 120, 180, 250, 320, 425],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const categoryData = {
    labels: ['Frames', 'Lenses', 'Sunglasses'],
    datasets: [{
      data: [45, 30, 25],
      backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b'],
      borderWidth: 0
    }]
  };

  const orders = [
    { id: '#ORD001', customer: 'Rahul Sharma', date: '2024-01-15', total: '₹150', status: 'Processing' },
    { id: '#ORD002', customer: 'Priya Patel', date: '2024-01-14', total: '₹200', status: 'Shipped' },
    { id: '#ORD003', customer: 'Amit Kumar', date: '2024-01-13', total: '₹75', status: 'Delivered' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      Processing: 'bg-yellow-100 text-yellow-800',
      Shipped: 'bg-blue-100 text-blue-800',
      Delivered: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Optical Store Admin</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 pl-4 border-l">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                S
              </div>
              <span className="hidden sm:block font-medium text-gray-700">Shopper</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || window.innerWidth >= 1024) && (
            <>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                />
              )}
              
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25 }}
                className="fixed lg:sticky top-0 left-0 h-screen w-64 bg-white shadow-lg z-50 lg:z-30 pt-16 lg:pt-0"
              >
                <div className="flex items-center justify-between p-4 lg:hidden">
                  <h2 className="font-bold text-lg">Menu</h2>
                  <button onClick={() => setSidebarOpen(false)}>
                    <X size={24} />
                  </button>
                </div>
                
                <nav className="p-4 space-y-2">
                  {navItems.map((item) => (
                    <motion.button
                      key={item.name}
                      onClick={() => {
                        setActiveNav(item.name);
                        setSidebarOpen(false);
                      }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeNav === item.name
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon size={20} />
                      <span>{item.name}</span>
                      {activeNav === item.name && (
                        <ChevronRight size={16} className="ml-auto" />
                      )}
                    </motion.button>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {loading ? (
              Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  className="bg-white rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <stat.icon size={24} className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-gray-500 text-sm mb-1">{stat.title}</h3>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    <span className={`text-xs font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 
                      stat.trend === 'alert' ? 'text-orange-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue Overview</h2>
              {loading ? (
                <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
              ) : (
                <Line 
                  data={revenueData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
                      x: { grid: { display: false } }
                    }
                  }}
                  height={250}
                />
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Sales by Category</h2>
              {loading ? (
                <div className="h-64 bg-gray-100 rounded-full animate-pulse"></div>
              ) : (
                <Doughnut 
                  data={categoryData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom' }
                    }
                  }}
                  height={250}
                />
              )}
            </motion.div>
          </div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
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
                  {orders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      className="transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.total}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ShopperDashboard;
