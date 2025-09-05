"use client";

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Link from 'next/link';

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Mock data for development
      const mockOrders: Order[] = [
        {
          id: 1,
          orderNumber: 'ORD-2024-001',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerPhone: '+91 9876543210',
          status: 'processing',
          totalAmount: 299.99,
          items: [
            { id: 1, productName: 'Classic Wooden Frame', quantity: 2, price: 29.99, total: 59.98 },
            { id: 2, productName: 'Modern Metal Frame', quantity: 1, price: 39.99, total: 39.99 }
          ],
          shippingAddress: '123 Main St, Mumbai, Maharashtra 400001',
          paymentMethod: 'Razorpay',
          paymentStatus: 'paid',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T14:20:00Z',
          notes: 'Customer requested express delivery'
        },
        {
          id: 2,
          orderNumber: 'ORD-2024-002',
          customerName: 'Jane Smith',
          customerEmail: 'jane@example.com',
          customerPhone: '+91 9876543211',
          status: 'shipped',
          totalAmount: 149.99,
          items: [
            { id: 3, productName: 'Digital LED Frame', quantity: 1, price: 149.99, total: 149.99 }
          ],
          shippingAddress: '456 Oak Ave, Delhi, Delhi 110001',
          paymentMethod: 'Razorpay',
          paymentStatus: 'paid',
          createdAt: '2024-01-14T09:15:00Z',
          updatedAt: '2024-01-16T11:45:00Z'
        },
        {
          id: 3,
          orderNumber: 'ORD-2024-003',
          customerName: 'Mike Johnson',
          customerEmail: 'mike@example.com',
          customerPhone: '+91 9876543212',
          status: 'delivered',
          totalAmount: 89.97,
          items: [
            { id: 4, productName: 'Vintage Ornate Frame', quantity: 3, price: 29.99, total: 89.97 }
          ],
          shippingAddress: '789 Pine St, Bangalore, Karnataka 560001',
          paymentMethod: 'Razorpay',
          paymentStatus: 'paid',
          createdAt: '2024-01-12T16:20:00Z',
          updatedAt: '2024-01-18T10:30:00Z'
        },
        {
          id: 4,
          orderNumber: 'ORD-2024-004',
          customerName: 'Sarah Wilson',
          customerEmail: 'sarah@example.com',
          customerPhone: '+91 9876543213',
          status: 'pending',
          totalAmount: 199.98,
          items: [
            { id: 5, productName: 'Floating Glass Frame', quantity: 2, price: 99.99, total: 199.98 }
          ],
          shippingAddress: '321 Elm St, Chennai, Tamil Nadu 600001',
          paymentMethod: 'Razorpay',
          paymentStatus: 'pending',
          createdAt: '2024-01-20T08:45:00Z',
          updatedAt: '2024-01-20T08:45:00Z'
        },
        {
          id: 5,
          orderNumber: 'ORD-2024-005',
          customerName: 'David Brown',
          customerEmail: 'david@example.com',
          customerPhone: '+91 9876543214',
          status: 'cancelled',
          totalAmount: 59.99,
          items: [
            { id: 6, productName: 'Collage Multi-Photo Frame', quantity: 1, price: 59.99, total: 59.99 }
          ],
          shippingAddress: '654 Maple Dr, Pune, Maharashtra 411001',
          paymentMethod: 'Razorpay',
          paymentStatus: 'refunded',
          createdAt: '2024-01-18T12:00:00Z',
          updatedAt: '2024-01-19T15:30:00Z',
          notes: 'Customer requested cancellation due to change of mind'
        }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: Order['status']) => {
    try {
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      );
      setOrders(updatedOrders);
      toast.success('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const addOrderNote = async (orderId: number, note: string) => {
    try {
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { ...order, notes: note, updatedAt: new Date().toISOString() }
          : order
      );
      setOrders(updatedOrders);
      setNotes('');
      toast.success('Note added successfully');
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <AdminLayout title="Orders Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Orders Management">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Order #</th>
                  <th className="text-left p-2">Customer</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Payment</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{order.orderNumber}</td>
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-gray-600">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="p-2">₹{order.totalAmount.toFixed(2)}</td>
                    <td className="p-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </td>
                    <td className="p-2 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDetailsDialogOpen(true);
                          }}
                        >
                          View
                        </Button>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                          className="text-sm p-1 border border-gray-300 rounded"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                      <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                      <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                      <p><strong>Address:</strong> {selectedOrder.shippingAddress}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                      <p><strong>Last Updated:</strong> {new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                      <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                      <p><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Product</th>
                          <th className="text-left p-2">Quantity</th>
                          <th className="text-left p-2">Price</th>
                          <th className="text-left p-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="p-2">{item.productName}</td>
                            <td className="p-2">{item.quantity}</td>
                            <td className="p-2">₹{item.price.toFixed(2)}</td>
                            <td className="p-2">₹{item.total.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Notes Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedOrder.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded">
                      <p className="text-sm">{selectedOrder.notes}</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Add Note</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add a note about this order..."
                      rows={3}
                    />
                    <Button
                      onClick={() => addOrderNote(selectedOrder.id, notes)}
                      disabled={!notes.trim()}
                    >
                      Add Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-sm text-gray-600">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'pending').length}
            </div>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'processing').length}
            </div>
            <p className="text-sm text-gray-600">Processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {orders.filter(o => o.status === 'shipped').length}
            </div>
            <p className="text-sm text-gray-600">Shipped</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'delivered').length}
            </div>
            <p className="text-sm text-gray-600">Delivered</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
