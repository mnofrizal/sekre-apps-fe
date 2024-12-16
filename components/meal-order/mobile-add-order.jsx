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

// Sample data for dropdowns
const zonaWaktuOrder = ["Sarapan", "Makan Siang", "Makan Sore", "Makan Malam"];
const bidangOptions = ["IT", "HR", "Finance", "Marketing", "Operations"];
const menuOptions = [
  "Nasi Goreng",
  "Mie Ayam",
  "Soto Ayam",
  "Gado-gado",
  "Rendang",
];
const dropPointOptions = [
  "Lobby",
  "Cafeteria",
  "Meeting Room A",
  "Meeting Room B",
  "Office Floor 2",
];

const employeeTypes = ["PLNIP", "IPS", "KOP", "RSU", "MITRA"];

// Sample data for PLNIP names (you would replace this with actual data)
const plnipNames = {
  IT: ["John Doe", "Jane Smith", "Bob Johnson"],
  HR: ["Alice Brown", "Charlie Davis", "Eva White"],
  Finance: ["Frank Miller", "Grace Lee", "Henry Clark"],
  Marketing: ["Ivy Chen", "Jack Wilson", "Karen Taylor"],
  Operations: ["Liam Harris", "Mia Rodriguez", "Noah Martinez"],
};

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

  const handleSubmit = () => {
    // Create an object with all the form data
    const formData = {
      phone: "6287733760363",
      zonaWaktu,
      subBidang,
      judulPekerjaan,
      employeeCounts: counts,
      employeeDetails: employees,
      dropPoint,
      totalEmployees: Object.values(counts).reduce((a, b) => a + b, 0),
      timestamp: new Date().toISOString(),
    };

    // Log the complete form data
    console.log("Form Submission Data:", formData);

    // Log specific sections for easier debugging
    console.log("Time Zone Selected:", zonaWaktu);
    console.log("Department:", subBidang);
    console.log("Job Title:", judulPekerjaan);
    console.log("Employee Counts by Type:", counts);
    console.log("Employee Details:", employees);
    console.log("Drop Point:", dropPoint);

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

    window.location.href = "/dashboard/meal-order/list/add/success";
  };

  const handleCountChange = (type, value) => {
    setCounts((prev) => ({ ...prev, [type]: value }));
  };

  const handleEmployeeChange = (type, index, field, value) => {
    setEmployees((prev) => ({
      ...prev,
      [type]: prev[type].map((emp, i) =>
        i === index ? { ...emp, [field]: value } : emp
      ),
    }));
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
                    {plnipNames[subBidang]?.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  placeholder="Employee Name"
                  value={emp.name}
                  onChange={(e) =>
                    handleEmployeeChange(type, index, "name", e.target.value)
                  }
                  className="rounded-xl"
                />
              )}
              <Select
                value={emp.menu}
                onValueChange={(value) =>
                  handleEmployeeChange(type, index, "menu", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select menu" />
                </SelectTrigger>
                <SelectContent>
                  {menuOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
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
          <Select value={zonaWaktu} onValueChange={setZonaWaktu}>
            <SelectTrigger
              id="zonaWaktu"
              className="mt-1 h-12 w-full rounded-xl"
            >
              <SelectValue placeholder="Pilih Waktu" />
            </SelectTrigger>
            <SelectContent>
              {zonaWaktuOrder.map((option) => (
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
        <div className="pb-2">
          <Label className="text-xs text-muted-foreground" htmlFor="dropPoint">
            Pilih Drop Point
          </Label>
          <Select value={dropPoint} onValueChange={setDropPoint}>
            <SelectTrigger
              id="dropPoint"
              className="mt-1 h-12 w-full rounded-xl"
            >
              <SelectValue placeholder="Pilih Drop Point" />
            </SelectTrigger>
            <SelectContent>
              {dropPointOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
