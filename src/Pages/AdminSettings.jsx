import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSettings, updateSettings } from '@/services/settings';
import { useAuth } from '@/components/ui/AuthContext';
import AdminLayout from '@/Components/admin/AdminLayout';
import { Loader2, Save, Globe, DollarSign, Mail, MapPin, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    store_name: '',
    store_email: '',
    store_phone: '',
    store_address: '',
    store_city: '',
    store_state: '',
    store_zip: '',
    store_country: 'United States',
    currency: 'USD',
    currency_symbol: '$',
    language: 'en',
    timezone: 'America/New_York',
    tax_rate: 0,
    free_shipping_threshold: 50,
    default_shipping_rate: 9.99,
    social_facebook: '',
    social_instagram: '',
    social_twitter: '',
    social_youtube: '',
    meta_title: '',
    meta_description: '',
    logo_url: '',
    favicon_url: '',
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ['store-settings'],
    queryFn: () => getSettings(),
    onSuccess: (data) => {
      if (data) {
        setFormData({
          store_name: data.store_name || '',
          store_email: data.store_email || '',
          store_phone: data.store_phone || '',
          store_address: data.store_address || '',
          store_city: data.store_city || '',
          store_state: data.store_state || '',
          store_zip: data.store_zip || '',
          store_country: data.store_country || 'United States',
          currency: data.currency || 'USD',
          currency_symbol: data.currency_symbol || '$',
          language: data.language || 'en',
          timezone: data.timezone || 'America/New_York',
          tax_rate: data.tax_rate || 0,
          free_shipping_threshold: data.free_shipping_threshold || 50,
          default_shipping_rate: data.default_shipping_rate || 9.99,
          social_facebook: data.social_facebook || '',
          social_instagram: data.social_instagram || '',
          social_twitter: data.social_twitter || '',
          social_youtube: data.social_youtube || '',
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          logo_url: data.logo_url || '',
          favicon_url: data.favicon_url || '',
        });
      }
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['store-settings']);
      toast.success('Settings saved successfully!');
    },
    onError: (error) => {
      toast.error('Failed to save settings: ' + error.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  ];

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
    'France', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark'
  ];

  if (isLoading) {
    return (
      <AdminLayout title="Settings">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Store Settings"
      description="Manage your store configuration and preferences"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Settings */}
          <div>
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  General Information
                </CardTitle>
                <CardDescription>Basic store information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 lg:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <Label className="text-sm font-medium">Store Name *</Label>
                    <Input
                      value={formData.store_name}
                      onChange={e => setFormData({ ...formData, store_name: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Store Email *</Label>
                    <Input
                      type="email"
                      value={formData.store_email}
                      onChange={e => setFormData({ ...formData, store_email: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                  <div>
                    <Label className="text-sm font-medium">Currency *</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => {
                        const currency = currencies.find(c => c.code === value);
                        setFormData({
                          ...formData,
                          currency: value,
                          currency_symbol: currency?.symbol || '$'
                        });
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map(curr => (
                          <SelectItem key={curr.code} value={curr.code}>
                            {curr.name} ({curr.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Currency Symbol</Label>
                    <Input
                      value={formData.currency_symbol}
                      onChange={e => setFormData({ ...formData, currency_symbol: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Language</Label>
                    <Select
                      value={formData.language}
                      onValueChange={value => setFormData({ ...formData, language: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <Label className="text-sm font-medium">Tax Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.tax_rate}
                      onChange={e => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) || 0 })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Timezone</Label>
                    <Select
                      value={formData.timezone}
                      onValueChange={value => setFormData({ ...formData, timezone: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Logo URL</Label>
                  <Input
                    value={formData.logo_url}
                    onChange={e => setFormData({ ...formData, logo_url: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Favicon URL</Label>
                  <Input
                    value={formData.favicon_url}
                    onChange={e => setFormData({ ...formData, favicon_url: e.target.value })}
                    placeholder="https://example.com/favicon.ico"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Meta Title</Label>
                  <Input
                    value={formData.meta_title}
                    onChange={e => setFormData({ ...formData, meta_title: e.target.value })}
                    placeholder="Store SEO title"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Meta Description</Label>
                  <Textarea
                    value={formData.meta_description}
                    onChange={e => setFormData({ ...formData, meta_description: e.target.value })}
                    placeholder="Store SEO description"
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Settings */}
          <div>
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>Store contact details and address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 lg:space-y-6">
                <div>
                  <Label className="text-sm font-medium">Phone Number</Label>
                  <Input
                    value={formData.store_phone}
                    onChange={e => setFormData({ ...formData, store_phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Street Address</Label>
                  <Input
                    value={formData.store_address}
                    onChange={e => setFormData({ ...formData, store_address: e.target.value })}
                    placeholder="123 Fashion Street"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                  <div>
                    <Label className="text-sm font-medium">City</Label>
                    <Input
                      value={formData.store_city}
                      onChange={e => setFormData({ ...formData, store_city: e.target.value })}
                      placeholder="New York"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">State/Province</Label>
                    <Input
                      value={formData.store_state}
                      onChange={e => setFormData({ ...formData, store_state: e.target.value })}
                      placeholder="NY"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">ZIP/Postal Code</Label>
                    <Input
                      value={formData.store_zip}
                      onChange={e => setFormData({ ...formData, store_zip: e.target.value })}
                      placeholder="10001"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Country</Label>
                  <Select
                    value={formData.store_country}
                    onValueChange={value => setFormData({ ...formData, store_country: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shipping Settings */}
          <div>
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Shipping Configuration
                </CardTitle>
                <CardDescription>Default shipping rates and thresholds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 lg:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <Label className="text-sm font-medium">Free Shipping Threshold</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.free_shipping_threshold}
                      onChange={e => setFormData({ ...formData, free_shipping_threshold: parseFloat(e.target.value) || 0 })}
                      placeholder="50"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Orders above this amount get free shipping</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Default Shipping Rate</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.default_shipping_rate}
                      onChange={e => setFormData({ ...formData, default_shipping_rate: parseFloat(e.target.value) || 0 })}
                      placeholder="9.99"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Default shipping cost for orders below threshold</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Social Media */}
          <div>
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>Connect your social media accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 lg:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <Label className="text-sm font-medium">Facebook URL</Label>
                    <Input
                      value={formData.social_facebook}
                      onChange={e => setFormData({ ...formData, social_facebook: e.target.value })}
                      placeholder="https://facebook.com/yourpage"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Instagram URL</Label>
                    <Input
                      value={formData.social_instagram}
                      onChange={e => setFormData({ ...formData, social_instagram: e.target.value })}
                      placeholder="https://instagram.com/yourpage"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Twitter URL</Label>
                    <Input
                      value={formData.social_twitter}
                      onChange={e => setFormData({ ...formData, social_twitter: e.target.value })}
                      placeholder="https://twitter.com/yourpage"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">YouTube URL</Label>
                    <Input
                      value={formData.social_youtube}
                      onChange={e => setFormData({ ...formData, social_youtube: e.target.value })}
                      placeholder="https://youtube.com/yourchannel"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-rose-500 hover:bg-rose-600"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}

