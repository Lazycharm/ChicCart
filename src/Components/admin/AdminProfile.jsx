import React, { useState } from 'react';
import { useAuth } from '@/components/ui/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Edit, Save, X, Lock, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { uploadFile } from '@/services/storage';

export default function AdminProfile({ isMobile = false }) {
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || user?.name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      // Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: data.full_name,
          name: data.full_name,
        }
      });
      if (authError) throw authError;

      // Update user_profiles table
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          full_name: data.full_name,
          name: data.full_name,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;
      return data;
    },
    onSuccess: async () => {
      await refreshUser();
      queryClient.invalidateQueries(['user-profile']);
      toast.success('Profile updated successfully!');
      setIsEditOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to update profile: ' + error.message);
    }
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Password updated successfully!');
      setIsPasswordOpen(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (error) => {
      toast.error('Failed to update password: ' + error.message);
    }
  });

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadFile(file, 'avatars');
      const avatarUrl = result.file_url || result;
      
      // Update user profile with avatar URL
      const { error } = await supabase
        .from('user_profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);

      if (error) throw error;

      await refreshUser();
      toast.success('Avatar updated successfully!');
    } catch (error) {
      toast.error('Failed to upload avatar: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!formData.full_name.trim()) {
      toast.error('Name is required');
      return;
    }
    updateProfileMutation.mutate(formData);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    updatePasswordMutation.mutate(passwordData);
  };

  if (!user) return null;

  const displayName = user.full_name || user.name || user.email?.split('@')[0] || 'Admin';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const ProfileCard = ({ className = '' }) => (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="relative">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={displayName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center text-white font-semibold text-sm">
              {initials}
            </div>
          )}
          <label className="absolute bottom-0 right-0 bg-rose-500 text-white rounded-full p-1 cursor-pointer hover:bg-rose-600 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              disabled={uploading}
            />
            {uploading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Upload className="w-3 h-3" />
            )}
          </label>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm lg:text-base text-gray-900 truncate">
            {displayName}
          </p>
          <p className="text-xs lg:text-sm text-gray-600 truncate">{user.email}</p>
          <p className="text-xs text-rose-600 font-medium mt-1">
            {user.role === 'admin' ? 'Administrator' : 'User'}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFormData({
                full_name: user.full_name || user.name || '',
                email: user.email || '',
              });
              setIsEditOpen(true);
            }}
            className="h-8 text-xs"
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPasswordOpen(true)}
            className="h-8 text-xs"
          >
            <Lock className="w-3 h-3 mr-1" />
            Password
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <div className="p-4 border-b border-gray-200">
          <ProfileCard />
        </div>
      ) : (
        <div className="p-4 border-t border-gray-200">
          <ProfileCard />
        </div>
      )}

      {/* Edit Profile Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Edit Profile
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Full Name *</Label>
              <Input
                value={formData.full_name}
                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <Input
                type="email"
                value={formData.email}
                disabled
                className="mt-1 bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Current Password</Label>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">New Password *</Label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                minLength={6}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Confirm New Password *</Label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsPasswordOpen(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updatePasswordMutation.isPending}
              >
                {updatePasswordMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

