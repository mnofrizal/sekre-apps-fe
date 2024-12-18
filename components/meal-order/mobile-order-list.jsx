"use client";

import { useState, useEffect } from "react";
import { OrderTabs } from "./mobile/order-tabs";
import { SearchBar } from "./mobile/search-bar";
import { OrderList } from "./mobile/order-list";
import { MenuList } from "./mobile/menu-list";
import { AddButton } from "./mobile/add-button";
import { getAllOrders } from "@/lib/api/order";
import { getMenuItems } from "@/lib/api/menu";

export function MobileOrderList() {
  const [activeTab, setActiveTab] = useState("order");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersResponse, menuResponse] = await Promise.all([
          getAllOrders(),
          getMenuItems(),
        ]);

        setOrders(ordersResponse.data);
        setMenuItems(menuResponse.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSaveMenuItem = (menuItem) => {
    if (menuItem.id) {
      setMenuItems((current) =>
        current.map((item) =>
          item.id === menuItem.id ? { ...item, ...menuItem } : item
        )
      );
    } else {
      setMenuItems((current) => [...current, { ...menuItem, id: Date.now() }]);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[200px] items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  const filteredItems =
    activeTab === "order"
      ? orders.filter(
          (order) =>
            order.judulPekerjaan
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            order.supervisor.subBidang
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
      : menuItems.filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
        );

  return (
    <div className="space-y-4 pb-14">
      <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <SearchBar value={searchQuery} onChange={handleSearch} />

      {activeTab === "order" ? (
        <OrderList orders={filteredItems} />
      ) : (
        <MenuList
          menuItems={filteredItems}
          onSaveMenuItem={handleSaveMenuItem}
        />
      )}

      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
        <AddButton activeTab={activeTab} onSaveMenuItem={handleSaveMenuItem} />
      </div>
    </div>
  );
}
