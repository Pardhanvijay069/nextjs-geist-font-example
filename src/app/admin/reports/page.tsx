"use client";

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

interface ProductPerformance {
  name: string;
  sales: number;
  revenue: number;
  stock: number;
}

interface OrderStatusData {
  status: string;
  count: number;
  color: string;
}

interface CustomerAnalytics {
  type: string;
  count: number;
  percentage: number;
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days');
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<OrderStatusData[]>([]);
  const [customerAnalytics, setCustomerAnalytics] = useState<CustomerAnalytics[]>([]);

  useEffect(() => {
    fetchReportsData();
  }, [dateRange]);

  const fetchReportsData = async () => {
    try {
      // Mock data for development
      const mockSalesData: SalesData[] = [
        { date: '2024-01-01', revenue: 1200, orders: 8, customers: 6 },
        { date: '2024-01-02', revenue: 1800, orders: 12, customers: 9 },
        { date: '2024-01-03', revenue: 2200, orders: 15, customers: 11 },
        { date: '2024-01-04', revenue: 1600, orders: 10, customers: 8 },
        { date: '2024-01-05', revenue: 2800, orders: 18, customers: 14 },
        { date: '2024-01-06', revenue: 2400, orders: 16, customers: 12 },
        { date: '2024-01-07', revenue: 3200, orders: 22, customers: 16 },
        { date: '2024-01-08', revenue: 2900, orders: 19, customers: 15 },
        { date: '2024-01-09', revenue: 2100, orders: 14, customers: 10 },
        { date: '2024-01-10', revenue: 2600, orders: 17, customers: 13 },
        { date: '2024-01-11', revenue: 3100, orders: 21, customers: 17 },
        { date: '2024-01-12', revenue: 2700, orders: 18, customers: 14 },
        { date: '2024-01-13', revenue: 2300, orders: 15, customers: 11 },
        { date: '2024-01-14', revenue: 2800, orders: 19, customers: 15 },
        { date: '2024-01-15', revenue: 3400, orders: 23, customers: 18 }
      ];

      const mockProductPerformance: ProductPerformance[] = [
        { name: 'Classic Wooden Frame', sales: 45, revenue: 1349.55, stock: 12 },
        { name: 'Modern Metal Frame', sales: 38, revenue: 1519.62, stock: 8 },
        { name: 'Digital LED Frame', sales: 22, revenue: 3299.78, stock: 3 },
        { name: 'Vintage Ornate Frame', sales: 31, revenue: 1549.69, stock: 15 },
        { name: 'Floating Glass Frame', sales: 18, revenue: 1799.82, stock: 6 },
        { name: 'Collage Multi-Photo Frame', sales: 25, revenue: 1499.75, stock: 10 }
      ];

      const mockOrderStatusData: OrderStatusData[] = [
        { status: 'Delivered', count: 45, color: '#10B981' },
        { status: 'Processing', count: 12, color: '#3B82F6' },
        { status: 'Shipped', count: 8, color: '#8B5CF6' },
        { status: 'Pending', count: 6, color: '#F59E0B' },
        { status: 'Cancelled', count: 3, color: '#EF4444' }
      ];

      const mockCustomerAnalytics: CustomerAnalytics[] = [
        { type: 'New Customers', count: 28, percentage: 65 },
        { type: 'Returning Customers', count: 15, percentage: 35 }
      ];

      setSalesData(mockSalesData);
      setProductPerformance(mockProductPerformance);
      setOrderStatusData(mockOrderStatusData);
      setCustomerAnalytics(mockCustomerAnalytics);
    } catch (error) {
      console.error('Error fetching reports data:', error);
      toast.error('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (type: string) => {
    // Simulate export functionality
    toast.success(`${type} report exported successfully!`);
  };

  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
  const totalCustomers = salesData.reduce((sum, day) => sum + day.customers, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  if (loading) {
    return (
      <AdminLayout title="Reports & Analytics">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Reports & Analytics">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => exportReport('Sales')}>
            📊 Export Sales Report
          </Button>
          <Button variant="outline" onClick={() => exportReport('Products')}>
            📦 Export Product Report
          </Button>
          <Button variant="outline" onClick={() => exportReport('Customers')}>
            👥 Export Customer Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <span className="text-2xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <span className="text-2xl">🛒</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <span className="text-2xl">👥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              +15.3% from last period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <span className="text-2xl">📈</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{averageOrderValue.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              +4.1% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [`₹${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders & Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Orders & Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={2} name="Orders" />
                <Line type="monotone" dataKey="customers" stroke="#F59E0B" strokeWidth={2} name="New Customers" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Product Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis />
                <Tooltip formatter={(value: number) => [`${value}`, 'Sales']} />
                <Bar dataKey="sales" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count, percentage }) => `${status}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Product Performance Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Product Name</th>
                  <th className="text-left p-2">Sales</th>
                  <th className="text-left p-2">Revenue</th>
                  <th className="text-left p-2">Stock</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {productPerformance.map((product, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{product.name}</td>
                    <td className="p-2">{product.sales} units</td>
                    <td className="p-2">₹{product.revenue.toFixed(2)}</td>
                    <td className="p-2">{product.stock} units</td>
                    <td className="p-2">
                      <Badge variant={product.stock < 5 ? 'destructive' : product.stock < 10 ? 'secondary' : 'default'}>
                        {product.stock < 5 ? 'Low Stock' : product.stock < 10 ? 'Medium Stock' : 'In Stock'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Customer Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerAnalytics.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium">{item.type}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{item.count} customers</span>
                    <Badge variant="outline">{item.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800">📈 Revenue Growth</h4>
                <p className="text-sm text-green-600">Revenue increased by 12.5% compared to last period</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800">🎯 Best Seller</h4>
                <p className="text-sm text-blue-600">Classic Wooden Frame is your top-selling product</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-800">⚠️ Stock Alert</h4>
                <p className="text-sm text-yellow-600">3 products are running low on stock</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-800">👥 Customer Growth</h4>
                <p className="text-sm text-purple-600">65% of orders are from new customers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
