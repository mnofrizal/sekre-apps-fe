import { create } from "zustand";
import { getSubBidangEmployees } from "@/lib/api/employees";
import { getMenuItems } from "@/lib/api/menu";
import { getAllOrders, deleteOrder, updateOrderStatus } from "@/lib/api/order";

export const useMealOrderStore = create((set, get) => ({
  // Orders data
  orders: [],
  ordersLoading: true,
  ordersError: null,

  // Employee data
  subBidangEmployees: {},
  bidangOptions: [],
  employeesLoading: true,
  employeesError: null,

  // Menu data
  menuItems: [],
  menuLoading: true,
  menuError: null,

  // Orders functions
  fetchOrders: async () => {
    try {
      set({ ordersLoading: true, ordersError: null });
      const response = await getAllOrders();
      set({
        orders: response.data.requests,
        ordersLoading: false,
      });
      return response.data.requests;
    } catch (error) {
      set({
        ordersError: error.message,
        ordersLoading: false,
      });
      throw error;
    }
  },

  deleteOrder: async (orderId) => {
    try {
      await deleteOrder(orderId);
      const orders = get().orders.filter((order) => order.id !== orderId);
      set({ orders });
      return true;
    } catch (error) {
      throw error;
    }
  },

  updateOrder: async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      const orders = get().orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      );
      set({ orders });
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Fetch functions for existing data
  fetchSubBidangEmployees: async () => {
    try {
      set({ employeesLoading: true, employeesError: null });
      const response = await getSubBidangEmployees();
      set({
        subBidangEmployees: response.data,
        bidangOptions: Object.keys(response.data),
        employeesLoading: false,
      });
    } catch (error) {
      set({
        employeesError: error.message,
        employeesLoading: false,
      });
    }
  },

  fetchMenuItems: async () => {
    try {
      set({ menuLoading: true, menuError: null });
      const response = await getMenuItems();
      set({
        menuItems: response.data.filter((item) => item.isAvailable),
        menuLoading: false,
      });
    } catch (error) {
      set({
        menuError: error.message,
        menuLoading: false,
      });
    }
  },
}));
