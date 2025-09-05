"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockItems: number;
  recentOrders: any[];
  topProducts: any[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 8,
    totalOrders: 24,
    totalRevenue: 2847,
    lowStockItems: 3,
    recentOrders: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // For demo, we'll use mock data
      setStats({
        totalProducts: 8,
        totalOrders: 24,
        totalRevenue: 2847,
        lowStockItems: 3,
        recentOrders: [
          { id: 1, order_number: 'ORD-001', total_amount: 299, status: 'delivered' },
          { id: 2, order_number: 'ORD-002', total_amount: 199, status: 'processing' },
          { id: 3, order_number: 'ORD-003', total_amount: 449, status: 'pending' },
        ],
        topProducts: [
          { id: 1, title: 'Classic Wooden Frame', price: 29.99, total_sold: 15 },
          { id: 2, title: 'Modern Metal Frame', price: 39.99, total_sold: 12 },
          { id: 3, title: 'Vintage Ornate Frame', price: 49.99, total_sold: 8 },
        ]
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <AdminLayout title="Dashboard Overview">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <span className="text-2xl">📦</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active products in store</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <span className="text-2xl">🛒</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Orders received</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <span className="text-2xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total revenue generated</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            <span className="text-2xl">⚠️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Items need restocking</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => router.push('/admin/products/new')}
            >
              <span className="mr-2">➕</span>
              Add New Product
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => router.push('/admin/bulk-upload')}
            >
              <span className="mr-2">📤</span>
              Bulk Upload Products
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => router.push('/admin/orders')}
            >
              <span className="mr-2">📋</span>
              View All Orders
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length > 0 ? (
              <div className="space-y-3">
                {stats.recentOrders.slice(0, 5).map((order: any) => (
                  <div key={order.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">#{order.order_number}</p>
                      <p className="text-sm text-gray-600">₹{order.total_amount}</p>
                    </div>
                    <Badge variant={
                      order.status === 'delivered' ? 'default' :
                      order.status === 'processing' ? 'secondary' :
                      order.status === 'cancelled' ? 'destructive' : 'outline'
                    }>
                      {order.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent orders</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topProducts.length > 0 ? (
              <div className="space-y-3">
                {stats.topProducts.slice(0, 5).map((product: any) => (
                  <div key={product.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-gray-600">₹{product.price}</p>
                    </div>
                    <Badge variant="outline">
                      {product.total_sold || 0} sold
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No sales data</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Database Connected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Payment Gateway Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Google Drive Connected</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
