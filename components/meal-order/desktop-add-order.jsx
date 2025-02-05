"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputSection from "./input-section";
import SummarySection from "./summary-section";
import { createOrder } from "@/lib/api/order";
import { useToast } from "@/hooks/use-toast";
import { useMealOrderStore } from "@/lib/store/meal-order-store";
import { getMealCategory } from "@/lib/constant";

// This array defines the meal time slots available for ordering in GMT+7 (WIB)
// Each object contains:
// - name: The Indonesian name for the meal time
// - time: The UTC time for that meal in ISO format (7 hours behind WIB)
const zonaWaktuOrder = [
  { name: "Sarapan", time: "23:00:00.000Z" }, // Breakfast at 6 AM WIB (11 PM UTC previous day)
  { name: "Makan Siang", time: "05:00:00.000Z" }, // Lunch at 12 PM WIB (5 AM UTC)
  { name: "Makan Sore", time: "09:00:00.000Z" }, // Afternoon meal at 4 PM WIB (9 AM UTC)
  { name: "Makan Malam", time: "16:59:00.000Z" }, // Dinner at 11:59 PM WIB (4:59 PM UTC)
];

export default function AddOrder() {
  const { toast } = useToast();
  const router = useRouter();
  const [zonaWaktu, setZonaWaktu] = useState("");
  const [subBidang, setSubBidang] = useState("");
  const [judulPekerjaan, setJudulPekerjaan] = useState("");
  const [counts, setCounts] = useState({
    PLNIP: 0,
    IPS: 0,
    KOP: 0,
    RSU: 0,
    MITRA: 0,
  });
  const [employees, setEmployees] = useState({
    PLNIP: [],
    IPS: [],
    KOP: [],
    RSU: [],
    MITRA: [],
  });
  const [dropPoint, setDropPoint] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [picName, setPicName] = useState("");
  const [picPhone, setPicPhone] = useState("");

  // State for form submission
  const [submitting, setSubmitting] = useState(false);
  const [syncMenuEnabled, setSyncMenuEnabled] = useState({});
  const [anonymousEnabled, setAnonymousEnabled] = useState({
    IPS: false,
    KOP: false,
    RSU: false,
    MITRA: false,
  });

  // Get data from Zustand store
  const {
    subBidangEmployees: plnipNames,
    bidangOptions,
    menuItems: menuOptions,
    employeesLoading,
    menuLoading,
    employeesError,
    menuError,
    fetchSubBidangEmployees,
    fetchMenuItems,
  } = useMealOrderStore();

  const loading = employeesLoading || menuLoading;
  const error = employeesError || menuError;

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("mealOrderFormData");
    if (savedData) {
      const data = JSON.parse(savedData);
      setZonaWaktu(data.zonaWaktu || "");
      setSubBidang(data.subBidang || "");
      setJudulPekerjaan(data.judulPekerjaan || "");
      setCounts(
        data.counts || {
          PLNIP: 0,
          IPS: 0,
          KOP: 0,
          RSU: 0,
          MITRA: 0,
        }
      );
      setEmployees(
        data.employees || {
          PLNIP: [],
          IPS: [],
          KOP: [],
          RSU: [],
          MITRA: [],
        }
      );
      setDropPoint(data.dropPoint || "");
      setPicName(data.picName || "");
      setPicPhone(data.picPhone || "");
      setSyncMenuEnabled(data.syncMenuEnabled || {});
      setAnonymousEnabled(
        data.anonymousEnabled || {
          IPS: false,
          KOP: false,
          RSU: false,
          MITRA: false,
        }
      );
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const formData = {
      zonaWaktu,
      subBidang,
      judulPekerjaan,
      counts,
      employees,
      dropPoint,
      picName,
      picPhone,
      syncMenuEnabled,
      anonymousEnabled,
    };
    localStorage.setItem("mealOrderFormData", JSON.stringify(formData));
  }, [
    zonaWaktu,
    subBidang,
    judulPekerjaan,
    counts,
    employees,
    dropPoint,
    picName,
    picPhone,
    syncMenuEnabled,
    anonymousEnabled,
  ]);

  // New state for asman
  const [asman, setAsman] = useState({
    name: "",
    subBidang: "",
    nomorHp: "",
  });

  // Fetch data if not already in store
  useEffect(() => {
    if (Object.keys(plnipNames).length === 0) {
      fetchSubBidangEmployees();
    }
    if (menuOptions.length === 0) {
      fetchMenuItems();
    }
  }, [plnipNames, menuOptions, fetchSubBidangEmployees, fetchMenuItems]);

  // Update asman when subBidang changes
  useEffect(() => {
    if (subBidang && plnipNames[subBidang]) {
      const asmanEmployee = plnipNames[subBidang].find((emp) => emp.isAsman);
      if (asmanEmployee) {
        setAsman({
          name: asmanEmployee.name,
          subBidang: subBidang,
          nomorHp: asmanEmployee.nomorHp,
        });
      } else {
        setAsman({ name: "", subBidang: "", nomorHp: "" });
      }
    }
  }, [subBidang, plnipNames]);

  useEffect(() => {
    const newEmployees = { ...employees };
    Object.entries(counts).forEach(([type, count]) => {
      if (newEmployees[type].length < count) {
        newEmployees[type] = [
          ...newEmployees[type],
          ...Array(count - newEmployees[type].length).fill({
            name: "",
            menu: "",
            note: "",
          }),
        ];
      } else if (newEmployees[type].length > count) {
        newEmployees[type] = newEmployees[type].slice(0, count);
      }
    });
    setEmployees(newEmployees);
  }, [counts]);

  useEffect(() => {
    const isValid =
      subBidang !== "" &&
      judulPekerjaan !== "" &&
      dropPoint !== "" &&
      picName !== "" &&
      picPhone !== "" &&
      Object.values(counts).some((count) => count > 0) &&
      Object.entries(counts).every(
        ([type, count]) =>
          count === employees[type].length &&
          employees[type].every((emp) => emp.name !== "" && emp.menu !== "")
      );
    setIsFormValid(isValid);
  }, [
    subBidang,
    judulPekerjaan,
    counts,
    employees,
    dropPoint,
    picName,
    picPhone,
  ]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-6 items-start gap-6">
          <Card className="col-span-4">
            <CardHeader className="border-b bg-slate-100 p-5">
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Skeleton className="mb-2 h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="mb-2 h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Skeleton className="mb-2 h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="mb-2 h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                  {Array(5)
                    .fill()
                    .map((_, i) => (
                      <div key={i}>
                        <Skeleton className="mb-2 h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardHeader className="border-b bg-slate-100 p-5">
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
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

  const handleCountChange = (type, value) => {
    setCounts((prev) => ({ ...prev, [type]: parseInt(value) || 0 }));
  };

  const handleEmployeeChange = (type, index, field, value) => {
    const updatedEmployees = { ...employees };
    if (field === "menu") {
      // Find the full menu item object
      const menuItem = menuOptions.find((item) => item.id === value);

      if (syncMenuEnabled[type]) {
        // Update all menus of this type if sync is enabled
        updatedEmployees[type] = updatedEmployees[type].map((emp) => ({
          ...emp,
          menu: menuItem,
        }));
      } else {
        // Update just this employee's menu
        updatedEmployees[type][index] = {
          ...updatedEmployees[type][index],
          menu: menuItem,
        };
      }
    } else {
      updatedEmployees[type][index] = {
        ...updatedEmployees[type][index],
        [field]: value,
      };
    }
    setEmployees(updatedEmployees);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      setSubmitting(true);
      try {
        const today = new Date();
        const selectedTime = zonaWaktuOrder.find(
          (z) => z.name === zonaWaktu
        )?.time;
        if (selectedTime) {
          const [hours, minutes] = selectedTime.split(":");
          today.setUTCHours(parseInt(hours), parseInt(minutes), 0, 0);
        }
        const requiredDate = today.toISOString();

        const submittedData = {
          judulPekerjaan,
          type: "MEAL",
          requestDate: new Date().toISOString(),
          requiredDate,
          category: getMealCategory(requiredDate),
          dropPoint,
          // subBidang,
          supervisor: {
            name: asman.name,
            subBidang: asman.subBidang,
            nomorHp: asman.nomorHp,
          },
          pic: {
            name: picName,
            nomorHp: picPhone,
          },
          employeeOrders: Object.entries(employees).flatMap(([type, empList]) =>
            empList.map((emp) => ({
              employeeName: emp.name,
              entity: type,
              items: [
                {
                  menuItemId: emp.menu.id,
                  quantity: 1,
                  notes: emp.note || undefined,
                },
              ],
            }))
          ),
        };

        console.log(submittedData);

        try {
          const order = await createOrder(submittedData);
          // Clear localStorage after successful submission
          localStorage.removeItem("mealOrderFormData");
          toast({
            title: "Success",
            description: `Meal Order telah suskses dibuat!`,
            variant: "success",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: `Error creating order, error: ${error}`,
            variant: "destructive",
          });
        }
        router.push("/dashboard/meal-order/list/");
      } catch (error) {
        console.error("Error submitting order:", error);
        // Handle error appropriately
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="hidden lg:block">
      <InputSection
        handleSubmit={handleSubmit}
        subBidang={subBidang}
        setSubBidang={setSubBidang}
        judulPekerjaan={judulPekerjaan}
        setJudulPekerjaan={setJudulPekerjaan}
        zonaWaktu={zonaWaktu}
        setZonaWaktu={setZonaWaktu}
        dropPoint={dropPoint}
        setDropPoint={setDropPoint}
        picName={picName}
        setPicName={setPicName}
        picPhone={picPhone}
        setPicPhone={setPicPhone}
        counts={counts}
        handleCountChange={handleCountChange}
        employees={employees}
        handleEmployeeChange={handleEmployeeChange}
        bidangOptions={bidangOptions}
        zonaWaktuOrder={zonaWaktuOrder}
        plnipNames={plnipNames}
        menuOptions={menuOptions}
        syncMenuEnabled={syncMenuEnabled}
        setSyncMenuEnabled={setSyncMenuEnabled}
        anonymousEnabled={anonymousEnabled}
        setAnonymousEnabled={setAnonymousEnabled}
        isFormValid={isFormValid}
        submitting={submitting}
        setEmployees={setEmployees}
      />

      <SummarySection
        subBidang={subBidang}
        judulPekerjaan={judulPekerjaan}
        zonaWaktu={zonaWaktu}
        dropPoint={dropPoint}
        picName={picName}
        picPhone={picPhone}
        supervisor={asman}
        counts={counts}
        employees={employees}
        isFormValid={isFormValid}
        submitting={submitting}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
