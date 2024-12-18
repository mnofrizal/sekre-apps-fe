"use client";

import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  LogOut,
  ChevronRight,
  Settings,
  Bell,
  HelpCircle,
  Lock,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  {
    icon: Settings,
    label: "Account Settings",
    // href: "/dashboard/profile/settings",
  },
  {
    icon: Bell,
    label: "Notifications",
    // href: "/dashboard/notifications",
  },
  {
    icon: Lock,
    label: "Privacy & Security",
    // href: "/dashboard/profile/privacy",
  },
  {
    icon: HelpCircle,
    label: "Help & Support",
    // href: "/dashboard/help",
  },
];

export function MobileProfile() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Profile Header */}
      <Card className="rounded-xl p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/avatar.png" alt={session.user.name} />
            <AvatarFallback>{session.user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{session.user.name}</h1>
            <p className="text-sm text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-4">
            <Mail className="mb-2 h-5 w-5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm font-medium">{session.user.email}</p>
          </div>
          <div className="rounded-lg border p-4">
            <Shield className="mb-2 h-5 w-5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Role</p>
            <p className="text-sm font-medium">{session.user.role}</p>
          </div>
        </div>
      </Card>

      {/* Menu Items */}
      <Card className="overflow-hidden rounded-xl">
        <div className="divide-y">
          {menuItems.map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              className="flex items-center justify-between p-4 hover:bg-muted/50"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <span>{item.label}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </motion.a>
          ))}
        </div>
      </Card>

      {/* Logout Button */}
      <Card className="overflow-hidden rounded-xl">
        <motion.button
          className="flex w-full items-center gap-3 p-4 text-red-600 hover:bg-red-50"
          onClick={handleLogout}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="h-5 w-5" />
          <span>Log out</span>
        </motion.button>
      </Card>
    </div>
  );
}
