"use client";

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import Link from 'next/link';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  registrationDate: string;
  lastOrderDate?: string;
  shippingAddress?: string;
  orders: CustomerOrder[];
}

interface CustomerOrder {
  id: number;
  orderNumber: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      // Mock data for development
      const mockCustomers: Customer[] = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+91 9876543210',
          totalOrders: 5,
          totalSpent: 1299.95,
          status: 'active',
          registrationDate: '2024-01-10',
          lastOrderDate: '2024-01-20',
          shippingAddress: '123 Main St, Mumbai, Maharashtra 400001',
          orders: [
            { id: 1, orderNumber: 'ORD-2024-001', date: '2024-01-20', total: 299.99, status: 'delivered', items: 2 },
            { id: 2, orderNumber: 'ORD-2024-015', date: '2024-01-18', total: 199.99, status: 'delivered', items: 1 },
            { id: 3, orderNumber: 'ORD-2024-008', date: '2024-01-15', total: 399.99, status: 'delivered', items: 3 },
            { id: 4, orderNumber: 'ORD-2024-003', date: '2024-01-12', total: 149.99, status: 'delivered', items: 1 },
            { id: 5, orderNumber: 'ORD-2024-001', date: '2024-01-10', total: 249.99, status: 'delivered', items: 2 }
          ]
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+91 9876543211',
          totalOrders: 3,
          totalSpent: 649.97,
          status: 'active',
          registrationDate: '2024-01-08',
          lastOrderDate: '2024-01-19',
          shippingAddress: '456 Oak Ave, Delhi, Delhi 110001',
          orders: [
            { id: 6, orderNumber: 'ORD-2024-012', date: '2024-01-19', total: 299.99, status: 'shipped', items: 2 },
            { id: 7, orderNumber: 'ORD-2024-007', date: '2024-01-14', total: 199.99, status: 'delivered', items: 1 },
            { id: 8, orderNumber: 'ORD-2024-002', date: '2024-01-08', total: 149.99, status: 'delivered', items: 1 }
          ]
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike@example.com',
          phone: '+91 9876543212',
          totalOrders: 2,
          totalSpent: 449.98,
          status: 'active',
          registrationDate: '2024-01-05',
          lastOrderDate: '2024-01-16',
          shippingAddress: '789 Pine St, Bangalore, Karnataka 560001',
          orders: [
            { id: 9, orderNumber: 'ORD-2024-009', date: '2024-01-16', total: 249.99, status: 'delivered', items: 2 },
            { id: 10, orderNumber: 'ORD-2024-004', date: '2024-01-05', total: 199.99, status: 'delivered', items: 1 }
          ]
        },
        {
          id: 4,
          name: 'Sarah Wilson',
          email: 'sarah@example.com',
          phone: '+91 9876543213',
          totalOrders: 1,
          totalSpent: 199.98,
          status: 'active',
          registrationDate: '2024-01-20',
          lastOrderDate: '2024-01-20',
          shippingAddress: '321 Elm St, Chennai, Tamil Nadu 600001',
          orders: [
            { id: 11, orderNumber: 'ORD-2024-020', date: '2024-01-20', total: 199.98, status: 'processing', items: 2 }
          ]
        },
        {
          id: 5,
          name: 'David Brown',
          email: 'david@example.com',
          phone: '+91 9876543214',
          totalOrders: 1,
          totalSpent: 0,
          status: 'inactive',
          registrationDate: '2024-01-18',
          lastOrderDate: '2024-01-18',
          shippingAddress: '654 Maple Dr, Pune, Maharashtra 411001',
          orders: [
            { id: 12, orderNumber: 'ORD-2024-018', date: '2024-01-18', total: 59.99, status: 'cancelled', items: 1 }
          ]
        },
        {
          id: 6,
          name: 'Emily Davis',
          email: 'emily@example.com',
          phone: '+91 9876543215',
          totalOrders: 4,
          totalSpent: 899.96,
          status: 'active',
          registrationDate: '2024-01-03',
          lastOrderDate: '2024-01-17',
          shippingAddress: '987 Cedar Ln, Hyderabad, Telangana 500001',
          orders: [
            { id: 13, orderNumber: 'ORD-2024-017', date: '2024-01-17', total: 299.99, status: 'delivered', items: 2 },
            { id: 14, orderNumber: 'ORD-2024-013', date: '2024-01-13', total: 199.99, status: 'delivered', items: 1 },
            { id: 15, orderNumber: 'ORD-2024-010', date: '2024-01-10', total: 249.99, status: 'delivered', items: 2 },
            { id: 16, orderNumber: 'ORD-2024-005', date: '2024-01-05', total: 149.99, status: 'delivered', items: 1 }
          ]
        }
      ];
      
      setCustomers(mockCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const toggleCustomerStatus = async (customerId: number) => {
    try {
      const updatedCustomers = customers.map(customer => 
        customer.id === customerId 
          ? { ...customer, status: customer.status === 'active' ? 'inactive' as const : 'active' as const }
          : customer
      );
      setCustomers(updatedCustomers);
      toast.success('Customer status updated successfully');
    } catch (error) {
      console.error('Error updating customer status:', error);
      toast.error('Failed to update customer status');
    }
  };

  const getCustomerTier = (totalSpent: number) => {
    if (totalSpent >= 1000) return { tier: 'Gold', color: 'bg-yellow-100 text-yellow-800' };
    if (totalSpent >= 500) return { tier: 'Silver', color: 'bg-gray-100 text-gray-800' };
    return { tier: 'Bronze', color: 'bg-orange-100 text-orange-800' };
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <AdminLayout title="Customers Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Customers Management">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search customers..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Customer</th>
                  <th className="text-left p-2">Contact</th>
                  <th className="text-left p-2">Orders</th>
                  <th className="text-left p-2">Total Spent</th>
                  <th className="text-left p-2">Tier</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Registered</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => {
                  const tier = getCustomerTier(customer.totalSpent);
                  return (
                    <tr key={customer.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-gray-600">{customer.email}</div>
                        </div>
                      </td>
                      <td className="p-2 text-sm">{customer.phone}</td>
                      <td className="p-2">
                        <div className="text-center">
                          <div className="font-medium">{customer.totalOrders}</div>
                          <div className="text-xs text-gray-600">
                            {customer.lastOrderDate && `Last: ${new Date(customer.lastOrderDate).toLocaleDateString()}`}
                          </div>
                        </div>
                      </td>
                      <td className="p-2 font-medium">₹{customer.totalSpent.toFixed(2)}</td>
                      <td className="p-2">
                        <Badge className={tier.color}>
                          {tier.tier}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                          {customer.status}
                        </Badge>
                      </td>
                      <td className="p-2 text-sm">
                        {new Date(customer.registrationDate).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setIsDetailsDialogOpen(true);
                            }}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant={customer.status === 'active' ? 'secondary' : 'default'}
                            onClick={() => toggleCustomerStatus(customer.id)}
                          >
                            {customer.status === 'active' ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details - {selectedCustomer?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Name:</strong> {selectedCustomer.name}</p>
                      <p><strong>Email:</strong> {selectedCustomer.email}</p>
                      <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                      <p><strong>Address:</strong> {selectedCustomer.shippingAddress}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><strong>Registration Date:</strong> {new Date(selectedCustomer.registrationDate).toLocaleDateString()}</p>
                      <p><strong>Total Orders:</strong> {selectedCustomer.totalOrders}</p>
                      <p><strong>Total Spent:</strong> ₹{selectedCustomer.totalSpent.toFixed(2)}</p>
                      <p><strong>Customer Tier:</strong> 
                        <Badge className={`ml-2 ${getCustomerTier(selectedCustomer.totalSpent).color}`}>
                          {getCustomerTier(selectedCustomer.totalSpent).tier}
                        </Badge>
                      </p>
                      <p><strong>Status:</strong> 
                        <Badge className={`ml-2 ${selectedCustomer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {selectedCustomer.status}
                        </Badge>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order History ({selectedCustomer.orders.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Order #</th>
                          <th className="text-left p-2">Date</th>
                          <th className="text-left p-2">Items</th>
                          <th className="text-left p-2">Total</th>
                          <th className="text-left p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCustomer.orders.map((order) => (
                          <tr key={order.id} className="border-b">
                            <td className="p-2 font-medium">{order.orderNumber}</td>
                            <td className="p-2">{new Date(order.date).toLocaleDateString()}</td>
                            <td className="p-2">{order.items}</td>
                            <td className="p-2">₹{order.total.toFixed(2)}</td>
                            <td className="p-2">
                              <Badge variant={
                                order.status === 'delivered' ? 'default' :
                                order.status === 'processing' ? 'secondary' :
                                order.status === 'cancelled' ? 'destructive' : 'outline'
                              }>
                                {order.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-sm text-gray-600">Total Customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {customers.filter(c => c.status === 'active').length}
            </div>
            <p className="text-sm text-gray-600">Active Customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {customers.filter(c => getCustomerTier(c.totalSpent).tier === 'Gold').length}
            </div>
            <p className="text-sm text-gray-600">Gold Tier</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              ₹{customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(0)}
            </div>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toFixed(0)}
            </div>
            <p className="text-sm text-gray-600">Avg. Spent</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
