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

interface Category {
  id: number;
  name: string;
  description: string;
  productCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Mock data for development
      const mockCategories: Category[] = [
        {
          id: 1,
          name: 'Photo Frames',
          description: 'Traditional photo frames for family pictures',
          productCount: 15,
          status: 'active',
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          name: 'Art Frames',
          description: 'Professional frames for artwork and paintings',
          productCount: 8,
          status: 'active',
          createdAt: '2024-01-10'
        },
        {
          id: 3,
          name: 'Digital Frames',
          description: 'Modern digital photo frames with LED displays',
          productCount: 5,
          status: 'active',
          createdAt: '2024-01-08'
        },
        {
          id: 4,
          name: 'Wall Frames',
          description: 'Large decorative frames for wall mounting',
          productCount: 12,
          status: 'active',
          createdAt: '2024-01-05'
        },
        {
          id: 5,
          name: 'Vintage Frames',
          description: 'Classic vintage-style frames',
          productCount: 3,
          status: 'inactive',
          createdAt: '2024-01-01'
        }
      ];
      
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        // Update existing category
        const updatedCategories = categories.map(cat => 
          cat.id === editingCategory.id 
            ? { ...cat, ...formData, id: editingCategory.id }
            : cat
        );
        setCategories(updatedCategories);
        toast.success('Category updated successfully');
        setEditingCategory(null);
      } else {
        // Add new category
        const newCategory: Category = {
          id: Date.now(),
          ...formData,
          productCount: 0,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setCategories([...categories, newCategory]);
        toast.success('Category added successfully');
        setIsAddDialogOpen(false);
      }
      
      // Reset form
      setFormData({ name: '', description: '', status: 'active' });
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      status: category.status
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      setCategories(updatedCategories);
      toast.success('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const toggleStatus = async (categoryId: number) => {
    try {
      const updatedCategories = categories.map(cat => 
        cat.id === categoryId 
          ? { ...cat, status: cat.status === 'active' ? 'inactive' as const : 'active' as const }
          : cat
      );
      setCategories(updatedCategories);
      toast.success('Category status updated');
    } catch (error) {
      console.error('Error updating category status:', error);
      toast.error('Failed to update category status');
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout title="Categories Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Categories Management">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingCategory(null);
              setFormData({ name: '', description: '', status: 'active' });
            }}>
              <span className="mr-2">➕</span>
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCategory ? 'Update' : 'Add'} Category
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <Badge variant={category.status === 'active' ? 'default' : 'secondary'}>
                  {category.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{category.description}</p>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">
                  {category.productCount} products
                </span>
                <span className="text-sm text-gray-500">
                  Created: {category.createdAt}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(category)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant={category.status === 'active' ? 'secondary' : 'default'}
                  onClick={() => toggleStatus(category.id)}
                >
                  {category.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(category.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No categories found</p>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-sm text-gray-600">Total Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {categories.filter(c => c.status === 'active').length}
            </div>
            <p className="text-sm text-gray-600">Active Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">
              {categories.filter(c => c.status === 'inactive').length}
            </div>
            <p className="text-sm text-gray-600">Inactive Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {categories.reduce((sum, c) => sum + c.productCount, 0)}
            </div>
            <p className="text-sm text-gray-600">Total Products</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
