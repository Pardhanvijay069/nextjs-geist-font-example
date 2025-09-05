"use client";

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface CompanySettings {
  name: string;
  logo: string;
  description: string;
  email: string;
  phone: string;
  address: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<CompanySettings>({
    name: 'FrameShop',
    logo: 'F',
    description: 'Premium photo frames and art frames',
    email: 'contact@frameshop.com',
    phone: '+91 98765 43210',
    address: '123 Frame Street, Art District, Mumbai 400001'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  useEffect(() => {
    // Load settings from localStorage or API
    loadSettings();
  }, []);

  const loadSettings = () => {
    setIsLoading(true);
    try {
      // Try to load from localStorage first
      const savedSettings = localStorage.getItem('companySettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        if (parsed.logo && parsed.logo.startsWith('data:')) {
          setLogoPreview(parsed.logo);
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CompanySettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setLogoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLogoPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      let updatedSettings = { ...settings };

      // If there's a new logo file, convert it to base64
      if (logoFile && logoPreview) {
        updatedSettings.logo = logoPreview;
      }

      // Save to localStorage (in a real app, this would be an API call)
      localStorage.setItem('companySettings', JSON.stringify(updatedSettings));
      
      // Update the settings state
      setSettings(updatedSettings);
      
      // Clear the file input
      setLogoFile(null);
      
      toast.success('Settings saved successfully!');
      
      // Optionally reload the page to reflect changes in the header
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    const defaultSettings: CompanySettings = {
      name: 'FrameShop',
      logo: 'F',
      description: 'Premium photo frames and art frames',
      email: 'contact@frameshop.com',
      phone: '+91 98765 43210',
      address: '123 Frame Street, Art District, Mumbai 400001'
    };
    
    setSettings(defaultSettings);
    setLogoFile(null);
    setLogoPreview('');
    toast.success('Settings reset to defaults');
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Developer Settings</h1>
            <p className="text-gray-600">Manage website branding and company information</p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={resetToDefaults}
              className="border-gray-300 hover:bg-gray-50"
            >
              Reset to Defaults
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-black hover:bg-gray-800"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <Alert>
          <AlertDescription>
            <strong>Developer Note:</strong> Changes to company name and logo will be reflected across the website. 
            Logo changes require a page refresh to take effect.
          </AlertDescription>
        </Alert>

        {/* Company Branding */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Company Branding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={settings.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter company name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="company-description">Company Description</Label>
                  <Input
                    id="company-description"
                    value={settings.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter company description"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="logo-upload">Company Logo</Label>
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload a square image (recommended: 64x64px, max 2MB)
                  </p>
                </div>

                {/* Logo Preview */}
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium">Current Logo:</div>
                  <div className="w-12 h-12 bg-black rounded-md flex items-center justify-center">
                    {logoPreview || (settings.logo && settings.logo.startsWith('data:')) ? (
                      <img 
                        src={logoPreview || settings.logo} 
                        alt="Logo" 
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">{settings.logo}</span>
                    )}
                  </div>
                  {logoFile && (
                    <div className="text-sm text-green-600">
                      New logo selected: {logoFile.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company-email">Email Address</Label>
                <Input
                  id="company-email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="company-phone">Phone Number</Label>
                <Input
                  id="company-phone"
                  value={settings.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="company-address">Address</Label>
              <Input
                id="company-address"
                value={settings.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter company address"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-black rounded-md flex items-center justify-center">
                  {logoPreview || (settings.logo && settings.logo.startsWith('data:')) ? (
                    <img 
                      src={logoPreview || settings.logo} 
                      alt="Logo Preview" 
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-white font-bold">{settings.logo}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{settings.name}</h3>
                  <p className="text-sm text-gray-600">{settings.description}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2 text-sm">
                <div><strong>Email:</strong> {settings.email}</div>
                <div><strong>Phone:</strong> {settings.phone}</div>
                <div><strong>Address:</strong> {settings.address}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
