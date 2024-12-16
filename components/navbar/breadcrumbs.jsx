"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import React from "react";

export function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  const getBreadcrumbItems = () => {
    return paths.map((path, index) => ({
      href: "/" + paths.slice(0, index + 1).join("/"),
      label: path.charAt(0).toUpperCase() + path.slice(1),
    }));
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <div className="hidden items-center space-x-1 text-sm md:flex">
      <Link href="/" className="text-muted-foreground hover:text-foreground">
        Home
      </Link>
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.href}>
          <span className="text-muted-foreground">
            <ChevronRight className="h-4 w-4" />
          </span>
          {index === breadcrumbItems.length - 1 ? (
            <span>{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="text-muted-foreground hover:text-foreground"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
