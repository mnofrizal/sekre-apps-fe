"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, BellOff, Send, User, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { getUsers, updateUserNotifyStatus } from "@/lib/api/users";

const WhatsAppSettings = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [isAdminNotify, setisAdminNotify] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isTestingSent, setIsTestingSent] = useState(false);
  const [phone, setPhone] = useState("");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      const adminUsers = response.data.filter((user) => user.role === "ADMIN");
      setUsers(adminUsers);

      // Set first admin user as default selected
      const notifyAdmins = adminUsers.filter((user) => user.isAdminNotify);
      if (notifyAdmins.length > 0) {
        setSelectedUser(notifyAdmins[0].id);
        setPhone(notifyAdmins[0].phone || "");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update phone number when user is selected
  useEffect(() => {
    const user = users.find((user) => user.id === selectedUser);
    if (user) {
      setPhone(user.phone || "");
    } else {
      setPhone("");
    }
  }, [selectedUser, users]);

  const selectedUserData = users.find((user) => user.id === selectedUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = { isAdminNotify: true, phone };
      console.log(selectedUser, userData);
      await updateUserNotifyStatus(selectedUser, userData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const handleTestNotification = async () => {
    setIsTestingSent(true);
    // Here you would make an API call to send a test notification
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsTestingSent(false);

    if (selectedUserData) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="flex p-4">
      <div className="w-full space-y-4">
        {/* Summary Card */}
        {selectedUserData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedUserData.avatar} />
                    <AvatarFallback>
                      {selectedUserData.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {selectedUserData.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedUserData.email}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-500">Username</Label>
                    <p className="text-lg font-medium">
                      {selectedUserData.username}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Role</Label>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-500" />
                      <p className="text-lg font-medium">
                        {selectedUserData.role}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-500">Status</Label>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          selectedUserData.isActive
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      />
                      <p className="text-lg font-medium">
                        {selectedUserData.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">
                      Phone Number
                    </Label>
                    <p className="text-lg font-medium">
                      {phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              WhatsApp Notifications
            </CardTitle>
            <CardDescription>
              Configure WhatsApp notifications for users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="user">Select User</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem
                        key={user.id}
                        value={user.id}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span>{user.name}</span>
                          <span className="text-gray-500">({user.email})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Save Settings
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTestNotification}
                  disabled={!selectedUser || isTestingSent || !phone.trim()}
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  {isTestingSent ? "Sending..." : "Test Notification"}
                </Button>
              </div>

              {showSuccess && (
                <Alert className="bg-green-50 text-green-900">
                  <AlertDescription>
                    {isTestingSent
                      ? "Test notification sent successfully!"
                      : "Settings saved successfully!"}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WhatsAppSettings;
