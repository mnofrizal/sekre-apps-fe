"use client";
import React, { useState, useEffect } from "react";
import {
  getWhatsappGroups,
  getDBWhatsappGroups,
  saveGroupNotif,
} from "@/lib/api/whatsapp";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Users, Utensils, CheckCircle, Save, Bell } from "lucide-react";

import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function WhatsAppNotificationSelection() {
  const [listGroups, setListGroups] = useState([]);
  const [selectedAdminGroup, setSelectedAdminGroup] = useState("");
  const [selectedKitchenGroup, setSelectedKitchenGroup] = useState("");
  const [loading, setLoading] = useState(true);
  const [dbGroups, setDbGroups] = useState({ ADMIN: null, KITCHEN: null });

  const fetchAllGroups = async () => {
    try {
      const [waResponse, dbResponse] = await Promise.all([
        getWhatsappGroups(),
        getDBWhatsappGroups(),
      ]);

      if (waResponse.status && waResponse.data) {
        setListGroups(waResponse.data);
      }

      if (dbResponse.success && dbResponse.data) {
        const adminGroup = dbResponse.data.find(
          (group) => group.type === "ADMIN"
        );
        const kitchenGroup = dbResponse.data.find(
          (group) => group.type === "KITCHEN"
        );
        setDbGroups({
          ADMIN: adminGroup || null,
          KITCHEN: kitchenGroup || null,
        });
      }
    } catch (error) {
      console.error("Failed to fetch WhatsApp groups:", error);
      toast({
        title: "Error",
        description: "Failed to fetch WhatsApp groups",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllGroups();
  }, []);

  const getGroupName = (groups, selectedId) => {
    return (
      groups.find((group) => group.id === selectedId)?.name || "Not selected"
    );
  };

  const handleSave = async (groupType) => {
    const groupId =
      groupType === "ADMIN" ? selectedAdminGroup : selectedKitchenGroup;
    const groupName = getGroupName(listGroups, groupId);

    try {
      await saveGroupNotif(groupType, groupId, groupName);
      toast({
        title: "Settings Saved",
        description: `${
          groupType.charAt(0).toUpperCase() + groupType.slice(1)
        } group settings saved for ${groupName}.`,
      });
      // Fetch groups again to update the summary card
      await fetchAllGroups();
    } catch (error) {
      console.error("Failed to save group settings:", error);
      toast({
        title: "Error",
        description: "Failed to save group settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTestNotification = (groupType) => {
    const groupName =
      groupType === "ADMIN"
        ? getGroupName(listGroups, selectedAdminGroup)
        : getGroupName(listGroups, selectedKitchenGroup);

    toast({
      title: "Test Notification Sent",
      description: `A test notification has been sent to ${groupName}.`,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">
                Loading WhatsApp groups...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto grid gap-6 p-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            WhatsApp Notification Settings
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Select groups to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label
              htmlFor="admin-group"
              className="flex items-center space-x-2 text-sm font-medium"
            >
              <Users className="h-5 w-5" />
              <span>Admin Group</span>
            </Label>
            <Select
              value={selectedAdminGroup}
              onValueChange={setSelectedAdminGroup}
            >
              <SelectTrigger id="admin-group" className="h-10 w-full">
                <SelectValue placeholder="Select admin group" />
              </SelectTrigger>
              <SelectContent>
                {listGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                onClick={() => handleSave("ADMIN")}
                disabled={!selectedAdminGroup}
                size="lg"
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button
                onClick={() => handleTestNotification("ADMIN")}
                variant="outline"
                disabled={!selectedAdminGroup}
                size="lg"
              >
                <Bell className="mr-2 h-4 w-4" />
                Test Notification
              </Button>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="space-y-4">
            <Label
              htmlFor="kitchen-group"
              className="flex items-center space-x-2 text-sm font-medium"
            >
              <Utensils className="h-5 w-5" />
              <span>Kitchen Group</span>
            </Label>
            <Select
              value={selectedKitchenGroup}
              onValueChange={setSelectedKitchenGroup}
            >
              <SelectTrigger id="kitchen-group" className="h-10 w-full">
                <SelectValue placeholder="Select kitchen group" />
              </SelectTrigger>
              <SelectContent>
                {listGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                onClick={() => handleSave("KITCHEN")}
                disabled={!selectedKitchenGroup}
                size="lg"
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button
                onClick={() => handleTestNotification("KITCHEN")}
                variant="outline"
                disabled={!selectedKitchenGroup}
                size="lg"
              >
                <Bell className="mr-2 h-4 w-4" />
                Test Notification
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Group Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <Users className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-medium">Admin Group</h3>
                  <span className="text-lg">
                    {dbGroups.ADMIN?.name || "Not configured"}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <Utensils className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-medium">Kitchen Group</h3>
                  <span className="text-lg">
                    {dbGroups.KITCHEN?.name || "Not configured"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          {dbGroups.ADMIN && dbGroups.KITCHEN && (
            <div className="mt-6 flex items-center justify-center rounded-lg border bg-green-50 p-4 dark:bg-green-950/50">
              <CheckCircle className="mr-3 h-6 w-6 text-green-500" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                All groups configured
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
