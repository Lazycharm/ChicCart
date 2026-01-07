import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getShippingZones, createShippingZone, updateShippingZone, deleteShippingZone, getShippingRates, createShippingRate, updateShippingRate, deleteShippingRate } from '@/services/shipping';
import { useAuth } from '@/components/ui/AuthContext';
import AdminLayout from '@/Components/admin/AdminLayout';
import { Plus, Edit, Trash2, Loader2, Truck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

const countries = ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE', 'NO', 'DK'];

export default function AdminShipping() {
  const [zoneDialogOpen, setZoneDialogOpen] = useState(false);
  const [rateDialogOpen, setRateDialogOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [editingZone, setEditingZone] = useState(null);
  const [editingRate, setEditingRate] = useState(null);
  const [zoneFormData, setZoneFormData] = useState({
    name: '',
    countries: [],
    is_active: true,
    display_order: 0
  });
  const [rateFormData, setRateFormData] = useState({
    zone_id: '',
    name: '',
    carrier: '',
    method: 'flat',
    rate: 0,
    min_order_value: 0,
    max_order_value: 0,
    estimated_days: 3,
    is_active: true,
    display_order: 0
  });

  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: zones = [], isLoading: zonesLoading } = useQuery({
    queryKey: ['shipping-zones'],
    queryFn: () => getShippingZones('display_order')
  });

  const { data: rates = [], isLoading: ratesLoading } = useQuery({
    queryKey: ['shipping-rates', selectedZone?.id],
    queryFn: () => getShippingRates(selectedZone?.id),
    enabled: !!selectedZone
  });

  const createZoneMutation = useMutation({
    mutationFn: (data) => createShippingZone(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['shipping-zones']);
      toast.success('Shipping zone created!');
      setZoneDialogOpen(false);
      resetZoneForm();
    }
  });

  const updateZoneMutation = useMutation({
    mutationFn: ({ id, data }) => updateShippingZone(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['shipping-zones']);
      toast.success('Shipping zone updated!');
      setZoneDialogOpen(false);
      resetZoneForm();
    }
  });

  const deleteZoneMutation = useMutation({
    mutationFn: (id) => deleteShippingZone(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['shipping-zones']);
      toast.success('Shipping zone deleted!');
    }
  });

  const createRateMutation = useMutation({
    mutationFn: (data) => createShippingRate(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['shipping-rates']);
      toast.success('Shipping rate created!');
      setRateDialogOpen(false);
      resetRateForm();
    }
  });

  const updateRateMutation = useMutation({
    mutationFn: ({ id, data }) => updateShippingRate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['shipping-rates']);
      toast.success('Shipping rate updated!');
      setRateDialogOpen(false);
      resetRateForm();
    }
  });

  const deleteRateMutation = useMutation({
    mutationFn: (id) => deleteShippingRate(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['shipping-rates']);
      toast.success('Shipping rate deleted!');
    }
  });

  const resetZoneForm = () => {
    setZoneFormData({ name: '', countries: [], is_active: true, display_order: 0 });
    setEditingZone(null);
  };

  const resetRateForm = () => {
    setRateFormData({
      zone_id: selectedZone?.id || '',
      name: '',
      carrier: '',
      method: 'flat',
      rate: 0,
      min_order_value: 0,
      max_order_value: 0,
      estimated_days: 3,
      is_active: true,
      display_order: 0
    });
    setEditingRate(null);
  };

  const handleEditZone = (zone) => {
    setEditingZone(zone);
    setZoneFormData({
      name: zone.name || '',
      countries: zone.countries || [],
      is_active: zone.is_active !== false,
      display_order: zone.display_order || 0
    });
    setZoneDialogOpen(true);
  };

  const handleEditRate = (rate) => {
    setEditingRate(rate);
    setRateFormData({
      zone_id: rate.zone_id || selectedZone?.id || '',
      name: rate.name || '',
      carrier: rate.carrier || '',
      method: rate.method || 'flat',
      rate: rate.rate || 0,
      min_order_value: rate.min_order_value || 0,
      max_order_value: rate.max_order_value || 0,
      estimated_days: rate.estimated_days || 3,
      is_active: rate.is_active !== false,
      display_order: rate.display_order || 0
    });
    setRateDialogOpen(true);
  };

  return (
    <AdminLayout
      title="Shipping Settings"
      description="Configure shipping zones and rates"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping Zones */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Zones
            </CardTitle>
            <Button size="sm" onClick={() => { resetZoneForm(); setZoneDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" /> Add Zone
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {zonesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
                </div>
              ) : zones.length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-sm">No shipping zones. Create your first zone.</p>
              ) : (
                zones.map((zone) => (
                  <div
                    key={zone.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedZone?.id === zone.id
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedZone(zone)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm lg:text-base text-gray-900">{zone.name}</p>
                        <p className="text-xs lg:text-sm text-gray-500 mt-1">
                          {zone.countries?.length || 0} countries
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${zone.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {zone.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditZone(zone);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Delete this zone?')) {
                              deleteZoneMutation.mutate(zone.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Rates */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Shipping Rates
              {selectedZone && (
                <Badge variant="outline" className="ml-2">{selectedZone.name}</Badge>
              )}
            </CardTitle>
            <Button
              size="sm"
              onClick={() => {
                if (!selectedZone) {
                  toast.error('Please select a zone first');
                  return;
                }
                resetRateForm();
                setRateFormData(prev => ({ ...prev, zone_id: selectedZone.id }));
                setRateDialogOpen(true);
              }}
              disabled={!selectedZone}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Rate
            </Button>
          </CardHeader>
          <CardContent>
            {!selectedZone ? (
              <p className="text-center text-gray-500 py-8 text-sm">Select a zone to view rates</p>
            ) : ratesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
              </div>
            ) : rates.length === 0 ? (
              <p className="text-center text-gray-500 py-8 text-sm">No rates for this zone. Add your first rate.</p>
            ) : (
              <div className="space-y-3">
                {rates.map((rate) => (
                  <div key={rate.id} className="p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm lg:text-base text-gray-900">{rate.name}</p>
                        <p className="text-xs lg:text-sm text-gray-500 mt-1">
                          {rate.method === 'flat' && `$${rate.rate}`}
                          {rate.method === 'free' && 'Free'}
                          {rate.method === 'weight' && `$${rate.rate} per lb`}
                          {rate.method === 'price' && `${rate.rate}% of order`}
                          {rate.carrier && ` • ${rate.carrier}`}
                          {rate.estimated_days && ` • ${rate.estimated_days} days`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${rate.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {rate.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditRate(rate)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            if (confirm('Delete this rate?')) {
                              deleteRateMutation.mutate(rate.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Zone Dialog */}
      <Dialog open={zoneDialogOpen} onOpenChange={setZoneDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingZone ? 'Edit Shipping Zone' : 'Create Shipping Zone'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const data = { ...zoneFormData, display_order: parseInt(zoneFormData.display_order) || 0 };
            if (editingZone) {
              updateZoneMutation.mutate({ id: editingZone.id, data });
            } else {
              createZoneMutation.mutate(data);
            }
          }} className="space-y-4">
            <div>
              <Label>Zone Name *</Label>
              <Input
                value={zoneFormData.name}
                onChange={e => setZoneFormData({ ...zoneFormData, name: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label>Countries (leave empty for all)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {countries.map(country => (
                  <label key={country} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={zoneFormData.countries.includes(country)}
                      onChange={e => {
                        if (e.target.checked) {
                          setZoneFormData({
                            ...zoneFormData,
                            countries: [...zoneFormData.countries, country]
                          });
                        } else {
                          setZoneFormData({
                            ...zoneFormData,
                            countries: zoneFormData.countries.filter(c => c !== country)
                          });
                        }
                      }}
                    />
                    <span className="text-sm">{country}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={zoneFormData.is_active}
                onCheckedChange={checked => setZoneFormData({ ...zoneFormData, is_active: checked })}
              />
              <Label>Active</Label>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => { setZoneDialogOpen(false); resetZoneForm(); }}>
                Cancel
              </Button>
              <Button type="submit" disabled={createZoneMutation.isPending || updateZoneMutation.isPending}>
                {editingZone ? 'Update' : 'Create'} Zone
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Rate Dialog */}
      <Dialog open={rateDialogOpen} onOpenChange={setRateDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingRate ? 'Edit Shipping Rate' : 'Create Shipping Rate'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const data = { ...rateFormData, display_order: parseInt(rateFormData.display_order) || 0 };
            if (editingRate) {
              updateRateMutation.mutate({ id: editingRate.id, data });
            } else {
              createRateMutation.mutate(data);
            }
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Rate Name *</Label>
                <Input
                  value={rateFormData.name}
                  onChange={e => setRateFormData({ ...rateFormData, name: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Carrier</Label>
                <Input
                  value={rateFormData.carrier}
                  onChange={e => setRateFormData({ ...rateFormData, carrier: e.target.value })}
                  placeholder="UPS, FedEx, etc."
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Method *</Label>
                <Select
                  value={rateFormData.method}
                  onValueChange={value => setRateFormData({ ...rateFormData, method: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat">Flat Rate</SelectItem>
                    <SelectItem value="weight">By Weight</SelectItem>
                    <SelectItem value="price">By Price %</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {rateFormData.method !== 'free' && (
                <div>
                  <Label>Rate *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={rateFormData.rate}
                    onChange={e => setRateFormData({ ...rateFormData, rate: parseFloat(e.target.value) || 0 })}
                    required
                    className="mt-1"
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Min Order Value</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={rateFormData.min_order_value}
                  onChange={e => setRateFormData({ ...rateFormData, min_order_value: parseFloat(e.target.value) || 0 })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Estimated Days</Label>
                <Input
                  type="number"
                  value={rateFormData.estimated_days}
                  onChange={e => setRateFormData({ ...rateFormData, estimated_days: parseInt(e.target.value) || 3 })}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={rateFormData.is_active}
                onCheckedChange={checked => setRateFormData({ ...rateFormData, is_active: checked })}
              />
              <Label>Active</Label>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => { setRateDialogOpen(false); resetRateForm(); }}>
                Cancel
              </Button>
              <Button type="submit" disabled={createRateMutation.isPending || updateRateMutation.isPending}>
                {editingRate ? 'Update' : 'Create'} Rate
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

