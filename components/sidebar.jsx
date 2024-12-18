"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
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
  Zap,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const getMenuItems = (role) => {
  // Base menu items that everyone sees
  const baseItems = [
    {
      type: "item",
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      type: "item",
      title: "All Orders",
      icon: ClipboardList,
      href: "/dashboard/all-orders",
    },
  ];

  // Menu items for meal orders - modified for role-based access
  const getMealOrderItems = (isAdmin) => ({
    type: "segment",
    title: "Layanan",
    items: [
      {
        title: "Meal Orders",
        icon: UtensilsCrossed,
        items: [
          {
            title: "Order List",
            href: "/dashboard/meal-order/list",
            icon: ClipboardList,
          },
          ...(isAdmin
            ? [
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
              ]
            : []),
        ],
      },
    ],
  });

  // Full service menu items
  const getFullServiceItems = (isAdmin) => ({
    type: "segment",
    title: "Layanan",
    items: [
      {
        title: "Meal Orders",
        icon: UtensilsCrossed,
        items: [
          {
            title: "Order List",
            href: "/dashboard/meal-order/list",
            icon: ClipboardList,
          },
          ...(isAdmin
            ? [
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
              ]
            : []),
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
    ],
  });

  // Admin segment
  const adminSegment = {
    type: "segment",
    title: "Admin",
    items: [
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
    ],
  };

  const isAdmin = role === "ADMIN";

  // Return menu items based on role
  switch (role) {
    case "ADMIN":
      return [...baseItems, getFullServiceItems(true), adminSegment];
    case "KITCHEN":
      return [...baseItems, getMealOrderItems(false)];
    default:
      return [...baseItems, getFullServiceItems(false)];
  }
};

function MenuItem({ item, isActive, level = 0 }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (item.items) {
      const isCurrentPathInSubItems = item.items.some((subItem) =>
        subItem.items
          ? subItem.items.some((grandChild) =>
              pathname.startsWith(grandChild.href)
            )
          : pathname.startsWith(subItem.href)
      );
      setIsOpen(isCurrentPathInSubItems);
    }
  }, [pathname, item.items]);

  // If this is a segment
  if (item.type === "segment") {
    return (
      <div className="space-y-2">
        <div className="py-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {item.title}
          </h2>
        </div>
        <div className="space-y-1">
          {item.items.map((subItem, index) => (
            <MenuItem key={subItem.title} item={subItem} level={level + 1} />
          ))}
        </div>
      </div>
    );
  }

  // If this item has subitems
  if (item.items) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-xl px-3 py-3 font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
          <div className="flex items-center gap-3">
            <item.icon className="h-5 w-5" />
            <span className="text-sm">{item.title}</span>
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

  // Regular menu item with link
  return (
    <Link href={item.href}>
      <motion.div
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "flex items-center gap-3 px-3 py-3 mt-2 rounded-xl transition-colors",
          isActive
            ? "font-medium bg-primary text-primary-foreground"
            : "font-medium hover:bg-accent hover:text-accent-foreground text-muted-foreground"
        )}
      >
        <item.icon className="h-5 w-5" />
        <span className="text-sm">{item.title}</span>
      </motion.div>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session?.user) return null;

  const menuItems = getMenuItems(session.user.role);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-grow overflow-y-auto p-4">
        <div className="mb-6">
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e56c48]">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold">GAS</span>
              <span className="text-xs text-muted-foreground">
                Management Platform
              </span>
            </div>
          </div>
        </div>
        <div className="py-2">
          <nav className="space-y-2 px-2">
            {menuItems.map((item) => (
              <MenuItem
                key={item.title}
                item={item}
                isActive={pathname === item?.href}
              />
            ))}
          </nav>
        </div>
      </div>
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/avatar.png" alt={session.user.name} />
            <AvatarFallback>{session.user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{session.user.name}</div>
            <div className="text-sm text-muted-foreground">
              {session.user.role}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
