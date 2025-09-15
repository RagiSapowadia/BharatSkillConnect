import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { MapPin, Mail, Phone, Calendar, Edit, Save, X } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { updateUserProfileService } from "@/services";
import { toast } from "@/hooks/use-toast";

const InstructorProfile = () => {
  const { auth, setAuth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
      latitude: null,
      longitude: null,
    },
    isLocationPublic: true,
  });

  useEffect(() => {
    if (auth?.user) {
      setProfileData({
        name: auth.user.name || "",
        email: auth.user.email || "",
        phone: auth.user.phone || "",
        bio: auth.user.bio || "",
        location: {
          address: auth.user.location?.address || "",
          city: auth.user.location?.city || "",
          state: auth.user.location?.state || "",
          country: auth.user.location?.country || "",
          latitude: auth.user.location?.latitude || null,
          longitude: auth.user.location?.longitude || null,
        },
        isLocationPublic: auth.user.isLocationPublic || true,
      });
    }
  }, [auth?.user]);

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setProfileData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              latitude,
              longitude
            }
          }));
          
          // Reverse geocoding to get address
          fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
            .then(response => response.json())
            .then(data => {
              setProfileData(prev => ({
                ...prev,
                location: {
                  ...prev.location,
                  address: data.locality || "",
                  city: data.city || "",
                  state: data.principalSubdivision || "",
                  country: data.countryName || "",
                }
              }));
            })
            .catch(error => console.error("Error getting address:", error));
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Error",
            description: "Could not get your current location",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await updateUserProfileService(auth.user._id, profileData);
      
      if (response.success) {
        setAuth(prev => ({
          ...prev,
          user: { ...prev.user, ...response.data }
        }));
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      name: auth.user.name || "",
      email: auth.user.email || "",
      phone: auth.user.phone || "",
      bio: auth.user.bio || "",
      location: {
        address: auth.user.location?.address || "",
        city: auth.user.location?.city || "",
        state: auth.user.location?.state || "",
        country: auth.user.location?.country || "",
        latitude: auth.user.location?.latitude || null,
        longitude: auth.user.location?.longitude || null,
      },
      isLocationPublic: auth.user.isLocationPublic || true,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button onClick={handleCancel} variant="outline" className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profileData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                disabled={!isEditing}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="locationPublic">Make location public</Label>
              <Switch
                id="locationPublic"
                checked={profileData.isLocationPublic}
                onCheckedChange={(checked) => handleInputChange("isLocationPublic", checked)}
                disabled={!isEditing}
              />
            </div>
            
            {isEditing && (
              <Button onClick={getCurrentLocation} variant="outline" className="w-full">
                <MapPin className="h-4 w-4 mr-2" />
                Use Current Location
              </Button>
            )}

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={profileData.location.address}
                onChange={(e) => handleInputChange("location.address", e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your address"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={profileData.location.city}
                  onChange={(e) => handleInputChange("location.city", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={profileData.location.state}
                  onChange={(e) => handleInputChange("location.state", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={profileData.location.country}
                onChange={(e) => handleInputChange("location.country", e.target.value)}
                disabled={!isEditing}
              />
            </div>

            {profileData.location.latitude && profileData.location.longitude && (
              <div className="text-sm text-gray-600">
                <p>Coordinates: {profileData.location.latitude.toFixed(6)}, {profileData.location.longitude.toFixed(6)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4" />
              <span>{auth?.user?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Joined {new Date(auth?.user?.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{profileData.isLocationPublic ? "Location Public" : "Location Private"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorProfile;
