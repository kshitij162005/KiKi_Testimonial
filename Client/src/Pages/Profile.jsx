import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from '../config/api.js';
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, Shield, Camera, Save, X } from 'lucide-react';
import { Button, EditableField } from '../Components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';
import './Styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('User ID not found in local storage');
        }

        const response = await fetch(API_ENDPOINTS.USER_BY_ID(userId));

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setUser(result);
        setProfileImage(result.profileImage);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveField = async (field, value) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(API_ENDPOINTS.USER_BY_ID(userId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedUser = await response.json();
      setUser(prev => ({ ...prev, [field]: value }));
      return Promise.resolve();
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      throw err;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!profileImage || typeof profileImage === 'string') return;

    try {
      setUploadingImage(true);
      const userId = localStorage.getItem('userId');
      const formData = new FormData();
      formData.append('image', profileImage);

      // First upload to cloudinary
      const uploadResponse = await fetch(API_ENDPOINTS.UPLOAD_IMAGE, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image to cloudinary');
      }

      const uploadResult = await uploadResponse.json();
      const imageUrl = uploadResult.data.secure_url;

      // Then update user profile with the image URL
      const updateResponse = await fetch(API_ENDPOINTS.USER_BY_ID(userId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileImage: imageUrl }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await updateResponse.json();
      setUser(prev => ({ ...prev, profileImage: imageUrl }));
      setProfileImage(imageUrl);
      setImagePreview(null);
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Failed to upload image: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCancelImageUpload = () => {
    setProfileImage(user.profileImage);
    setImagePreview(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-300">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardContent className="pt-6 text-center">
            <div className="text-red-400 mb-4">
              <Shield className="w-12 h-12 mx-auto mb-2" />
              <h2 className="text-lg font-semibold">Error Loading Profile</h2>
            </div>
            <p className="text-gray-300 mb-4">{error}</p>
            <Button onClick={() => navigate('/dashboard')} variant="secondary">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate('/dashboard')} 
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-100">Profile Settings</h1>
              <p className="text-gray-400">Manage your account information and preferences</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Image Section */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Profile Picture
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full bg-gray-800 border-4 border-gray-700 overflow-hidden mx-auto">
                    {imagePreview || profileImage ? (
                      <img
                        src={imagePreview || profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-16 h-16 text-gray-500" />
                      </div>
                    )}
                  </div>
                  
                  <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {imagePreview && (
                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={handleImageUpload}
                      loading={uploadingImage}
                      size="sm"
                      variant="primary"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      onClick={handleCancelImageUpload}
                      size="sm"
                      variant="ghost"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}

                <p className="text-sm text-gray-400 mt-4">
                  Click the camera icon to upload a new profile picture
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EditableField
                    label="First Name"
                    value={user.firstName}
                    onSave={(value) => handleSaveField('firstName', value)}
                    placeholder="Enter your first name"
                    required
                    confirmationMessage="First name updated successfully!"
                  />

                  <EditableField
                    label="Last Name"
                    value={user.lastName}
                    onSave={(value) => handleSaveField('lastName', value)}
                    placeholder="Enter your last name"
                    required
                    confirmationMessage="Last name updated successfully!"
                  />
                </div>

                <EditableField
                  label="Email Address"
                  value={user.email}
                  onSave={(value) => handleSaveField('email', value)}
                  type="email"
                  placeholder="Enter your email address"
                  required
                  validation={(value) => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                      return 'Please enter a valid email address';
                    }
                    return null;
                  }}
                  confirmationMessage="Email address updated successfully!"
                />

                <EditableField
                  label="Phone Number"
                  value={user.phoneNum}
                  onSave={(value) => handleSaveField('phoneNum', value)}
                  placeholder="Enter your phone number"
                  validation={(value) => {
                    if (value && value.length < 10) {
                      return 'Phone number must be at least 10 digits';
                    }
                    return null;
                  }}
                  confirmationMessage="Phone number updated successfully!"
                />
              </CardContent>
            </Card>

            {/* Account Security */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Account Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div>
                      <h3 className="font-medium text-gray-200">Password</h3>
                      <p className="text-sm text-gray-400">Last updated: Never</p>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => navigate('/reset-password')}
                    >
                      Change Password
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div>
                      <h3 className="font-medium text-gray-200">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-400">Add an extra layer of security</p>
                    </div>
                    <Button variant="secondary" size="sm">
                      Enable 2FA
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
