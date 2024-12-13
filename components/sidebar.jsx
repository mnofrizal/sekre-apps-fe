"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Car,
  Building2,
  FileBox,
  ChevronDown,
  ClipboardList,
  MenuIcon,
  BarChart3,
  Settings,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "All Orders",
    icon: ClipboardList,
    href: "/dashboard/all-orders",
  },
  {
    title: "Meal Orders",
    icon: UtensilsCrossed,
    items: [
      {
        title: "Order List",
        href: "/dashboard/meal-order/list",
        icon: ClipboardList,
      },
      {
        title: "Menu",
        href: "/dashboard/meal-order/menu",
        icon: MenuIcon,
      },
      {
        title: "Reports",
        href: "/dashboard/meal-order/reports",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Transport",
    icon: Car,
    items: [
      {
        title: "Requests",
        href: "/dashboard/transport/requests",
        icon: ClipboardList,
      },
      {
        title: "Reports",
        href: "/dashboard/transport/reports",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Room",
    icon: Building2,
    items: [
      {
        title: "Booking",
        href: "/dashboard/room/booking",
        icon: ClipboardList,
      },
      {
        title: "Room List",
        href: "/dashboard/room/room-lists",
        icon: MenuIcon,
      },
    ],
  },
  {
    title: "Stationary",
    icon: FileBox,
    items: [
      {
        title: "Request",
        href: "/dashboard/stationary/request",
        icon: ClipboardList,
      },
      {
        title: "Inventory",
        href: "/dashboard/stationary/inventory",
        icon: MenuIcon,
      },
    ],
  },
  {
    title: "Manage Menu",
    icon: Settings,
    items: [
      {
        title: "Manage User",
        href: "/dashboard/admin/manage-user",
        icon: Users,
      },
      {
        title: "Manage Employee",
        href: "/dashboard/admin/manage-employee",
        icon: Users,
      },
    ],
  },
];

function MenuItem({ item, isActive, level = 0 }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (item.items) {
      const isCurrentPathInSubItems = item.items.some((subItem) =>
        pathname.startsWith(subItem.href)
      );
      setIsOpen(isCurrentPathInSubItems);
    }
  }, [pathname, item.items]);

  if (item.items) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-3 py-3 transition-colors hover:bg-accent hover:text-accent-foreground">
          <div className="flex items-center gap-3">
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </div>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1 pl-6">
          {item.items.map((subItem) => (
            <MenuItem
              key={subItem.href}
              item={subItem}
              isActive={pathname === subItem.href}
              level={level + 1}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Link href={item.href}>
      <motion.div
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <item.icon className="h-5 w-5" />
        <span>{item.title}</span>
      </motion.div>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-grow overflow-y-auto p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-xl font-bold text-primary"
        >
          General Affairs
        </motion.div>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <MenuItem
              key={item.href || item.title}
              item={item}
              isActive={pathname === item.href}
            />
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/avatar.png" alt="User Avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">John Doe</div>
            <div className="text-sm text-muted-foreground">Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
}
