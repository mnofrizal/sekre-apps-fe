import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmployeeCountDrawer } from "./employee-count-drawer";
import Link from "next/link";
import { getSubBidangEmployees } from "@/lib/api/employees";
import { getMenuItems } from "@/lib/api/menu";
import { createOrder } from "@/lib/api/order";

// Sample data for dropdowns
const zonaWaktuOrder = [
  { name: "Sarapan", time: "06:00:00.000Z" },
  { name: "Makan Siang", time: "12:00:00.000Z" },
  { name: "Makan Sore", time: "16:00:00.000Z" },
  { name: "Makan Malam", time: "19:00:00.000Z" },
];

const employeeTypes = ["PLNIP", "IPS", "KOP", "RSU", "MITRA"];

export default function MobileAddOrder({
  onBack,
  setActiveContent,
  setIsFormValid,
}) {
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
  const [picName, setPicName] = useState("");
  const [picPhone, setPicPhone] = useState("");

  // State for dynamic data
  const [plnipNames, setPlnipNames] = useState({});
  const [bidangOptions, setBidangOptions] = useState([]);
  const [menuOptions, setMenuOptions] = useState([]);
  const [loading, setLoading] = useState(true);
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
      Object.values(counts).some((count) => count > 0) &&
      Object.entries(counts).every(
        ([type, count]) =>
          employees[type].length === count &&
          employees[type].every((emp) => emp.name !== "" && emp.menu !== "")
      );
    setIsFormValid(isValid);
  }, [subBidang, judulPekerjaan, counts, employees, dropPoint, setIsFormValid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Create an object with all the form data
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

    // Log the complete form data
    console.log("Form Submission Data:", submittedData);

    try {
      const response = await createOrder(submittedData);
      console.log("Success:", response.data);
      window.location.href = `/dashboard/meal-order/list/add/success/${response.data.id}`;
    } catch (error) {
      console.error("Error:", error);
    }

    // // Log specific sections for easier debugging
    // console.log("Time Zone Selected:", zonaWaktu);
    // console.log("Department:", subBidang);
    // console.log("Job Title:", judulPekerjaan);
    // console.log("Employee Counts by Type:", counts);
    // console.log("Employee Details:", employees);
    // console.log("Drop Point:", dropPoint);

    // Send data to API endpoint
    // fetch("http://localhost:53r300/api/messages/send-meal", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(formData),
    // })
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error("Network response was not ok");
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     console.log("Success:", data);
    //     window.location.href = "/dashboard/meal-order/list/add/success";
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //     // Handle error appropriately
    //   });

    // Proceed with the navigation

    // window.location.href = "/dashboard/meal-order/list/add/success";
  };

  const handleCountChange = (type, value) => {
    setCounts((prev) => ({ ...prev, [type]: value }));
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

  const renderEmployeeInputs = (type) => {
    if (counts[type] === 0) return null;

    return (
      <Card key={type} className="mb-4">
        <CardContent className="p-4">
          <h3 className="mb-2 text-lg font-semibold">
            {type} ({counts[type]})
          </h3>
          {employees[type].map((emp, index) => (
            <div key={`${type}-${index}`} className="mb-4 space-y-2">
              {type === "PLNIP" ? (
                <Select
                  value={emp.name}
                  onValueChange={(value) =>
                    handleEmployeeChange(type, index, "name", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
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
                  className="rounded-xl"
                />
              )}
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
                      {menuItem.name} ({menuItem.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Note (optional)"
                value={emp.note}
                onChange={(e) =>
                  handleEmployeeChange(type, index, "note", e.target.value)
                }
                className="rounded-xl"
              />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="space-y-2 pb-28">
        <div>
          <Label
            className="pl-1 text-xs font-light text-muted-foreground"
            htmlFor="zonaWaktu"
          >
            Pilih Waktu
          </Label>
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
              <SelectValue placeholder="Select Order" />
            </SelectTrigger>
            <SelectContent>
              {zonaWaktuOrder
                .filter((option) => {
                  const now = new Date();
                  const optionTime = new Date();
                  const [hours, minutes] = option.time.split(":");
                  optionTime.setUTCHours(parseInt(hours), parseInt(minutes));
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
          <Label
            className="pl-1 text-xs font-light text-muted-foreground"
            htmlFor="subBidang"
          >
            Pilih Sub Bidang
          </Label>
          <Select value={subBidang} onValueChange={setSubBidang}>
            <SelectTrigger
              id="subBidang"
              className="mt-1 h-12 w-full rounded-xl"
            >
              <SelectValue placeholder="Pilih Sub Bidang" />
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
          <Label
            className="pl-1 text-xs font-light text-muted-foreground"
            htmlFor="judulPekerjaan"
          >
            Judul Pekerjaan
          </Label>
          <Input
            id="judulPekerjaan"
            value={judulPekerjaan}
            onChange={(e) => setJudulPekerjaan(e.target.value)}
            placeholder="Judul Pekerjaan"
            className="mt-1 h-12 w-full rounded-xl"
          />
        </div>

        <div>
          <div className="mt-1">
            <Label
              className="pl-1 text-xs font-light text-muted-foreground"
              htmlFor="subBidang"
            >
              Pilih Pemesan
            </Label>
            <EmployeeCountDrawer
              counts={counts}
              onCountChange={handleCountChange}
            />
          </div>
        </div>
        <div className="">
          <Label className="text-xs text-muted-foreground" htmlFor="dropPoint">
            Pilih Drop Point
          </Label>
          <Input
            id="dropPoint"
            value={dropPoint}
            onChange={(e) => setDropPoint(e.target.value)}
            placeholder="Lokasi Drop Point"
            className="mt-1 h-12 w-full rounded-xl"
          />
        </div>
        <div className="">
          <Label className="text-xs text-muted-foreground" htmlFor="picName">
            Nama PIC
          </Label>
          <Input
            id="picName"
            value={picName}
            onChange={(e) => setPicName(e.target.value)}
            placeholder="Nama PIC"
            className="mt-1 h-12 w-full rounded-xl"
          />
        </div>
        <div className="pb-2">
          <Label className="text-xs text-muted-foreground" htmlFor="picPhone">
            Nomor HP PIC
          </Label>
          <Input
            id="picPhone"
            value={picPhone}
            onChange={(e) => setPicPhone(e.target.value)}
            placeholder="Nomor HP PIC"
            className="mt-1 h-12 w-full rounded-xl"
          />
        </div>

        <Separator />

        <div className="space-y-4 pt-2">
          <h2 className="text-lg font-semibold">Employee Details</h2>
          {employeeTypes.map((type) => renderEmployeeInputs(type))}
        </div>
      </div>

      {/* Updated Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
        <Button
          className="h-12 w-full rounded-xl bg-[#0f172a] text-white hover:bg-[#1e293b]"
          size="lg"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
