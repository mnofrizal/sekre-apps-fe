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
              />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="space-y-6 p-4">
        <div>
          <Select value={zonaWaktu} onValueChange={setZonaWaktu}>
            <SelectTrigger id="zonaWaktu" className="mt-1 w-full">
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
          <Select value={subBidang} onValueChange={setSubBidang}>
            <SelectTrigger id="subBidang" className="mt-1 w-full">
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
          <Input
            id="judulPekerjaan"
            value={judulPekerjaan}
            onChange={(e) => setJudulPekerjaan(e.target.value)}
            placeholder="Judul Pekerjaan"
            className="mt-1 w-full"
          />
        </div>

        <div>
          <div className="mt-1">
            <EmployeeCountDrawer
              counts={counts}
              onCountChange={handleCountChange}
            />
          </div>
        </div>
        <div>
          <Select value={dropPoint} onValueChange={setDropPoint}>
            <SelectTrigger id="dropPoint" className="mt-1 w-full">
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

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Employee Details</h2>
          {employeeTypes.map((type) => renderEmployeeInputs(type))}
        </div>
      </div>

      {/* Fixed Add Order Button */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
        <Button
          className="w-full bg-[#0f172a] text-white hover:bg-[#1e293b]"
          size="lg"
          onClick={() => {
            // Here you would typically handle the form submission
            // For now, we'll just redirect to the success page
            window.location.href = "/dashboard/meal-order/list/add/success";
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
