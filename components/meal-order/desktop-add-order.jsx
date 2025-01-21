"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  Building2,
  Calendar,
  Check,
  ForkKnife,
  ForkKnifeCrossed,
  MapPin,
  Phone,
  User,
  X,
} from "lucide-react";
import { getSubBidangEmployees } from "@/lib/api/employees";
import { getMenuItems } from "@/lib/api/menu";
import { createOrder } from "@/lib/api/order";
import { useToast } from "@/hooks/use-toast";

// This array defines the meal time slots available for ordering in GMT+7 (WIB)
// Each object contains:
// - name: The Indonesian name for the meal time
// - time: The UTC time for that meal in ISO format (7 hours behind WIB)
const zonaWaktuOrder = [
  { name: "Sarapan", time: "23:00:00.000Z" }, // Breakfast at 6 AM WIB (11 PM UTC previous day)
  { name: "Makan Siang", time: "05:00:00.000Z" }, // Lunch at 12 PM WIB (5 AM UTC)
  { name: "Makan Sore", time: "09:00:00.000Z" }, // Afternoon meal at 4 PM WIB (9 AM UTC)
  { name: "Makan Malam", time: "12:00:00.000Z" }, // Dinner at 7 PM WIB (12 PM UTC)
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

  // State for dynamic data
  const [plnipNames, setPlnipNames] = useState({});
  const [bidangOptions, setBidangOptions] = useState([]);
  const [menuOptions, setMenuOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // New state for asman
  const [asman, setAsman] = useState({
    name: "",
    subBidang: "",
    nomorHp: "",
  });

  // Fetch dynamic data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch sub bidang employees
        const subBidangResponse = await getSubBidangEmployees();
        setPlnipNames(subBidangResponse.data);
        setBidangOptions(Object.keys(subBidangResponse.data));

        // Fetch menu items - store full menu item objects
        const menuResponse = await getMenuItems();
        setMenuOptions(menuResponse.data.filter((item) => item.isAvailable));
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      updatedEmployees[type][index] = {
        ...updatedEmployees[type][index],
        menu: menuItem, // Store the full menu item object
      };
    } else {
      updatedEmployees[type][index] = {
        ...updatedEmployees[type][index],
        [field]: value,
      };
    }
    setEmployees(updatedEmployees);
  };

  // Update the renderEmployeeInputs function to handle menu selection with IDs
  const renderEmployeeInputs = (type, count) => (
    <div key={type} className="space-y-4">
      <div className="flex items-center space-x-2">
        <h3 className="text-lg font-semibold">{type}</h3>
        {counts[type] > 0 &&
          (employees[type].length === counts[type] &&
          employees[type].every((emp) => emp.name && emp.menu) ? (
            <Check className="text-green-500" />
          ) : (
            <X className="text-red-500" />
          ))}
      </div>
      {Array(count)
        .fill()
        .map((_, index) => (
          <div
            key={`${type}-${index}`}
            className="grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            <div>
              <Label htmlFor={`${type}Name${index}`}>Name</Label>
              {type === "PLNIP" ? (
                <Select
                  value={employees[type][index]?.name || ""}
                  onValueChange={(value) =>
                    handleEmployeeChange(type, index, "name", value)
                  }
                >
                  <SelectTrigger id={`${type}Name${index}`}>
                    <SelectValue placeholder="Select name" />
                  </SelectTrigger>
                  <SelectContent>
                    {plnipNames[subBidang]?.map((emp) => (
                      <SelectItem key={emp.id} value={emp.name}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={`${type}Name${index}`}
                  value={employees[type][index]?.name || ""}
                  onChange={(e) =>
                    handleEmployeeChange(type, index, "name", e.target.value)
                  }
                  placeholder={`Enter ${type} name`}
                />
              )}
            </div>
            <div>
              <Label htmlFor={`${type}Menu${index}`}>Menu</Label>
              <Select
                value={employees[type][index]?.menu?.id || ""}
                onValueChange={(value) =>
                  handleEmployeeChange(type, index, "menu", value)
                }
              >
                <SelectTrigger id={`${type}Menu${index}`}>
                  <SelectValue placeholder="Select menu" />
                </SelectTrigger>
                <SelectContent>
                  {menuOptions.map((menuItem) => (
                    <SelectItem key={menuItem.id} value={menuItem.id}>
                      {menuItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor={`${type}Note${index}`}>Note</Label>
              <Input
                id={`${type}Note${index}`}
                value={employees[type][index]?.note || ""}
                onChange={(e) =>
                  handleEmployeeChange(type, index, "note", e.target.value)
                }
                placeholder="Enter note"
              />
            </div>
          </div>
        ))}
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      setSubmitting(true);
      try {
        const submittedData = {
          judulPekerjaan,
          type: "MEAL",
          requestDate: new Date().toISOString(),
          requiredDate: (() => {
            const today = new Date();
            const selectedTime = zonaWaktuOrder.find(
              (z) => z.name === zonaWaktu
            )?.time;
            if (selectedTime) {
              const [hours, minutes] = selectedTime.split(":");
              today.setUTCHours(parseInt(hours), parseInt(minutes), 0, 0);
            }
            return today.toISOString();
          })(),
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Buat Pesanan</h1>
        <Button onClick={() => router.back()} variant="outline">
          Back to Order List
        </Button>
      </div>
      <div className="grid grid-cols-6 items-start gap-6">
        {/* Input Section */}
        <Card className="col-span-4">
          <CardHeader className="border-b bg-slate-100 p-5">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Detail Pesanan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="subBidang">Sub Bidang</Label>
                    <Select value={subBidang} onValueChange={setSubBidang}>
                      <SelectTrigger id="subBidang">
                        <SelectValue placeholder="Select Sub Bidang" />
                      </SelectTrigger>
                      <SelectContent>
                        {bidangOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="judulPekerjaan">Judul Pekerjaan</Label>
                    <Input
                      id="judulPekerjaan"
                      value={judulPekerjaan}
                      onChange={(e) => setJudulPekerjaan(e.target.value)}
                      placeholder="Enter judul pekerjaan"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="zonaWaktu">Waktu</Label>
                    <Select
                      value={zonaWaktu.name}
                      onValueChange={(value) => {
                        const selectedOption = zonaWaktuOrder.find(
                          (opt) => opt.name === value
                        );
                        if (selectedOption) {
                          setZonaWaktu(value); // Store just the name
                        }
                      }}
                    >
                      <SelectTrigger id="zonaWaktu">
                        <SelectValue placeholder="Select Waktu" />
                      </SelectTrigger>
                      <SelectContent>
                        {zonaWaktuOrder
                          .filter((option) => {
                            const now = new Date();
                            const optionTime = new Date();
                            const [hours, minutes] = option.time.split(":");
                            optionTime.setUTCHours(
                              parseInt(hours),
                              parseInt(minutes)
                            );
                            return optionTime > now;
                          })
                          .map((option) => (
                            <SelectItem key={option.name} value={option.name}>
                              {option.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dropPoint">Drop Point</Label>
                    <Input
                      id="dropPoint"
                      value={dropPoint}
                      onChange={(e) => setDropPoint(e.target.value)}
                      placeholder="Enter Droppoint"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="picName">PIC Name</Label>
                    <Input
                      id="picName"
                      value={picName}
                      onChange={(e) => setPicName(e.target.value)}
                      placeholder="Enter PIC name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="picPhone">PIC Phone Number</Label>
                    <Input
                      id="picPhone"
                      value={picPhone}
                      onChange={(e) => setPicPhone(e.target.value)}
                      placeholder="Enter PIC phone number"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                {Object.entries(counts).map(([type, count]) => (
                  <div key={type}>
                    <Label htmlFor={`jumlah${type}`}>{`Jumlah ${type}`}</Label>
                    <Input
                      id={`jumlah${type}`}
                      type="number"
                      min="0"
                      value={count}
                      onChange={(e) => handleCountChange(type, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {Object.entries(counts).map(([type, count], index) => (
                      <div key={type}>
                        {renderEmployeeInputs(type, count)}
                        {index < Object.entries(counts).length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Button
                type="submit"
                className="w-full"
                disabled={!isFormValid || submitting}
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  "Submit Pesanan"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Summary Section */}
        <div className="col-span-2">
          <Card className="sticky top-6 bg-white">
            <CardHeader className="border-b bg-slate-100 p-5 text-center">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Ringkasan Pesanan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-4">
                    <Building2 className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
                    <div className="flex-1">
                      <div className="mb-1 text-sm text-gray-500">
                        Sub Bidang
                      </div>
                      <div className="font-medium">
                        {subBidang || "Not selected"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Briefcase className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
                    <div className="flex-1">
                      <div className="mb-1 text-sm text-gray-500">
                        Judul Pekerjaan
                      </div>
                      <div className="font-medium">
                        {judulPekerjaan || "Not entered"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Calendar className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
                    <div className="flex-1">
                      <div className="mb-1 text-sm text-gray-500">Waktu</div>
                      <div className="font-medium">
                        {zonaWaktu || "Not selected"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
                    <div className="flex-1">
                      <div className="mb-1 text-sm text-gray-500">
                        Drop Point
                      </div>
                      <div className="font-medium">
                        {dropPoint || "Not selected"}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* PIC Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-4">
                    <User className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
                    <div className="flex-1">
                      <div className="mb-1 text-sm text-gray-500">PIC Name</div>
                      <div className="font-medium">
                        {picName || "Not entered"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
                    <div className="flex-1">
                      <div className="mb-1 text-sm text-gray-500">
                        PIC Phone
                      </div>
                      <div className="font-medium">
                        {picPhone || "Not entered"}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Employee Counts */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700">
                    Employee Counts
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(counts).map(
                      ([type, count]) =>
                        count !== 0 && (
                          <div
                            key={type}
                            className={`rounded-lg p-3 ${
                              type === "PLNIP"
                                ? "bg-blue-50"
                                : type === "IPS"
                                ? "bg-orange-50"
                                : type === "KOP"
                                ? "bg-green-50"
                                : "bg-gray-50"
                            }`}
                          >
                            <div className="mb-1 text-sm text-gray-500">
                              {type}
                            </div>
                            <div className="text-lg font-semibold">{count}</div>
                          </div>
                        )
                    )}
                  </div>
                </div>

                <Separator />

                {/* Employees List */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-700">Employees</h3>
                  {Object.entries(employees).map(
                    ([type, empList]) =>
                      empList.length > 0 && (
                        <div key={type} className="space-y-3">
                          <h4 className="text-sm font-medium text-gray-600">
                            {type === "PLNIP"
                              ? "PLN INDONESIA POWER"
                              : type === "IPS"
                              ? "INDONESIA POWER SERVICES"
                              : type === "KOP"
                              ? "KOPERASI"
                              : type === "RSU"
                              ? "RUSAMAS SARANA USAHA"
                              : type}
                          </h4>
                          <div
                            className={`divide-y rounded-lg ${
                              type === "PLNIP"
                                ? "bg-blue-50"
                                : type === "IPS"
                                ? "bg-orange-50"
                                : type === "KOP"
                                ? "bg-green-50"
                                : "bg-gray-50"
                            }`}
                          >
                            {empList.map((emp, index) => (
                              <div
                                key={index}
                                className="p-3 first:rounded-t-lg last:rounded-b-lg"
                              >
                                <div className="font-medium">{emp.name}</div>
                                {(emp.menu?.name || emp.note) && (
                                  <div className="mt-1 flex text-sm text-gray-500">
                                    <div className="flex items-center">
                                      <ForkKnife className="mr-1 h-3 w-3 flex-shrink-0 text-gray-500" />
                                      <span>{emp.menu?.name}</span>
                                      {emp.note && (
                                        <span className="ml-1 text-gray-400">
                                          • {emp.note}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
