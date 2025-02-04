"use client";

import { motion } from "framer-motion";
import { Breadcrumbs } from "./navbar/breadcrumbs";
import { Search } from "./navbar/search";
import { Notifications } from "./navbar/notifications";
import { ThemeToggle } from "./navbar/theme-toggle";
import { UserNav } from "./navbar/user-nav";

export default function Navbar({ children }) {
  return (
    <motion.div
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-10 border-b bg-background shadow-sm"
    >
      <div className="flex h-16 items-center gap-4 px-4">
        {children}
        <Breadcrumbs />
        <div className="ml-auto flex items-center gap-2">
          <Search />
          <Notifications />
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </motion.div>
  );
}
