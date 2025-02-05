import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { ClipboardList, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useMemo, useState } from "react";

import { useMealOrderStore } from "@/lib/store/meal-order-store";

export function OrderDetailsCard({
  subBidang,
  setSubBidang,
  judulPekerjaan,
  setJudulPekerjaan,
  zonaWaktu,
  setZonaWaktu,
  dropPoint,
  setDropPoint,
  picName,
  setPicName,
  picPhone,
  setPicPhone,
  bidangOptions,
  zonaWaktuOrder,
}) {
  const [open, setOpen] = useState(false);
  const { subBidangEmployees } = useMealOrderStore();

  const employees = useMemo(() => {
    // Get all employees from all sub-bidangs with their subBidang and phoneNumber
    return Object.entries(subBidangEmployees).flatMap(([bidang, employees]) =>
      employees.map((employee) => ({
        value: employee.name,
        label: employee.name,
        subBidang: bidang,
        phoneNumber: employee.nomorHp,
      }))
    );
  }, [subBidangEmployees]);

  const findEmployeeDetails = useCallback(
    (name) => {
      return employees.find((emp) => emp.value === name);
    },
    [employees]
  );

  const filteredEmployees = useMemo(() => {
    // Only show employees when there's text input
    if (!picName) return [];

    const searchTerm = picName.toLowerCase();
    // First filter all matching employees
    const matches = employees.filter((employee) =>
      employee.label.toLowerCase().includes(searchTerm)
    );

    // Sort them by relevance (exact matches first, then by position of match)
    matches.sort((a, b) => {
      const aName = a.label.toLowerCase();
      const bName = b.label.toLowerCase();

      // Exact matches go first
      if (aName === searchTerm) return -1;
      if (bName === searchTerm) return 1;

      // Then sort by position of match
      const aIndex = aName.indexOf(searchTerm);
      const bIndex = bName.indexOf(searchTerm);
      return aIndex - bIndex;
    });

    // Return only the top 20 matches
    return matches.slice(0, 20);
  }, [employees, picName]);

  const handleSelect = useCallback(
    (currentValue) => {
      setPicName(currentValue);
      setOpen(false);

      // Find and set employee details if it's a known employee
      const employeeDetails = findEmployeeDetails(currentValue);
      if (employeeDetails) {
        setSubBidang(employeeDetails.subBidang);
        setPicPhone(employeeDetails.phoneNumber || "");
      }
    },
    [setPicName, findEmployeeDetails, setSubBidang, setPicPhone]
  );

  return (
    <Card className="p-6">
      <CardTitle className="mb-4 flex items-center gap-2 text-2xl font-semibold text-primary">
        <ClipboardList className="h-5 w-5" />
        Detail Pesanan
      </CardTitle>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <Label htmlFor="subBidang">Sub Bidang</Label>
            <Select
              value={subBidang}
              onValueChange={setSubBidang}
              className="w-full"
            >
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
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <Label htmlFor="zonaWaktu">Waktu</Label>
            <Select
              value={zonaWaktu.name}
              onValueChange={(value) => {
                const selectedOption = zonaWaktuOrder.find(
                  (opt) => opt.name === value
                );
                if (selectedOption) {
                  setZonaWaktu(value);
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
            <Label htmlFor="dropPoint">Drop Point</Label>
            <Input
              id="dropPoint"
              value={dropPoint}
              onChange={(e) => setDropPoint(e.target.value)}
              placeholder="Enter Droppoint"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <Label htmlFor="picName">PIC Name</Label>
            <div className="relative">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {picName || "Enter PIC name"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0"
                  align="start"
                >
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search PIC name..."
                      value={picName}
                      onValueChange={setPicName}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSelect(picName);
                        }
                      }}
                    />
                    <CommandList>
                      <CommandEmpty>Type to search employees...</CommandEmpty>
                      <CommandGroup>
                        {filteredEmployees.length === 0 && picName ? (
                          // Show custom input when no matches
                          <CommandItem value={picName} onSelect={handleSelect}>
                            <Check className="mr-2 h-4 w-4 opacity-0" />
                            {picName}
                          </CommandItem>
                        ) : (
                          // Show filtered employees when there are matches
                          filteredEmployees.map((employee) => (
                            <CommandItem
                              key={employee.value}
                              value={employee.value}
                              onSelect={handleSelect}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  picName === employee.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {employee.label}
                            </CommandItem>
                          ))
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
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
    </Card>
  );
}
