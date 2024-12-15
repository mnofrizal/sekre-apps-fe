"use client";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

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

// Sample data for PLNIP names (you would replace this with actual data)
const plnipNames = {
  IT: ["John Doe", "Jane Smith", "Bob Johnson"],
  HR: ["Alice Brown", "Charlie Davis", "Eva White"],
  Finance: ["Frank Miller", "Grace Lee", "Henry Clark"],
  Marketing: ["Ivy Chen", "Jack Wilson", "Karen Taylor"],
  Operations: ["Liam Harris", "Mia Rodriguez", "Noah Martinez"],
};

export default function AddOrder() {
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

  const handleCountChange = (type, value) => {
    setCounts((prev) => ({ ...prev, [type]: parseInt(value) || 0 }));
  };

  const handleEmployeeChange = (type, index, field, value) => {
    const updatedEmployees = { ...employees };
    updatedEmployees[type][index] = {
      ...updatedEmployees[type][index],
      [field]: value,
    };
    setEmployees(updatedEmployees);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      const submittedData = {
        subBidang,
        judulPekerjaan,
        employees: Object.fromEntries(
          Object.entries(employees).map(([type, empList]) => [
            type,
            empList.map((emp) => ({
              name: emp.name,
              menu: emp.menu,
              note: emp.note || undefined,
            })),
          ])
        ),
        dropPoint,
        picName,
        picPhone,
      };
      console.log(submittedData);
      // Submit the form data
    }
  };

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
                    {plnipNames[subBidang]?.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
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
                value={employees[type][index]?.menu || ""}
                onValueChange={(value) =>
                  handleEmployeeChange(type, index, "menu", value)
                }
              >
                <SelectTrigger id={`${type}Menu${index}`}>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add Order</h1>
        <Button onClick={() => router.back()} variant="outline">
          Back to Order List
        </Button>
      </div>
      <div className="grid grid-cols-6 items-start gap-6">
        {/* Input Section */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
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
                    <Label htmlFor="zonaWaktu">Order</Label>
                    <Select value={zonaWaktu} onValueChange={setZonaWaktu}>
                      <SelectTrigger id="zonaWaktu">
                        <SelectValue placeholder="Select Order" />
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
                    <Label htmlFor="dropPoint">Drop Point</Label>
                    <Select value={dropPoint} onValueChange={setDropPoint}>
                      <SelectTrigger id="dropPoint">
                        <SelectValue placeholder="Select drop point" />
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
              <Button type="submit" className="w-full" disabled={!isFormValid}>
                Submit Order
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Summary Section */}
        <div className="col-span-2">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <strong>Sub Bidang:</strong>
                  <span>{subBidang || "Not selected"}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <strong>Judul Pekerjaan:</strong>
                  <span>{judulPekerjaan || "Not entered"}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <strong>Order:</strong>
                  <span>{zonaWaktu || "Not selected"}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <strong>Drop Point:</strong>
                  <span>{dropPoint || "Not selected"}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <strong>PIC Name:</strong>
                  <span>{picName || "Not entered"}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <strong>PIC Phone:</strong>
                  <span>{picPhone || "Not entered"}</span>
                </div>
                <div className="space-y-2">
                  <strong>Employee Counts:</strong>
                  <ul className="grid grid-cols-2 gap-2">
                    {Object.entries(counts).map(([type, count]) => (
                      <li key={type} className="flex items-center gap-2">
                        <span>•</span>
                        {type}: {count}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <strong>Employees:</strong>
                  {Object.entries(employees).map(
                    ([type, empList]) =>
                      empList.length > 0 && (
                        <div key={type} className="mt-3">
                          <h4 className="mb-2 font-semibold">{type}</h4>
                          <ul className="space-y-2">
                            {empList.map((emp, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span>•</span>
                                {emp.name} - {emp.menu}{" "}
                                {emp.note && `(${emp.note})`}
                              </li>
                            ))}
                          </ul>
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
