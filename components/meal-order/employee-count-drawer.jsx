"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const employeeTypes = [
  { id: "PLNIP", label: "PLNIP" },
  { id: "IPS", label: "IPS" },
  { id: "KOP", label: "KOP" },
  { id: "RSU", label: "RSU" },
  { id: "MITRA", label: "MITRA" },
];

export function EmployeeCountDrawer({ counts, onCountChange }) {
  const handleIncrement = (type) => {
    onCountChange(type, counts[type] + 1);
  };

  const handleDecrement = (type) => {
    const currentValue = counts[type];
    if (currentValue > 0) {
      onCountChange(type, currentValue - 1);
    }
  };

  const getEmployeeCountText = () => {
    const nonZeroCounts = Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => `${count} ${type}`);

    if (nonZeroCounts.length === 0) {
      return "Pilih Pemesan";
    }

    return nonZeroCounts.join(", ");
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="h-12 w-full justify-start rounded-xl"
        >
          <span className="text-left">{getEmployeeCountText()}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Employee Count</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex flex-col gap-4">
              {employeeTypes.map((type) => (
                <div
                  key={type.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium">{type.label}</span>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDecrement(type.id)}
                      disabled={counts[type.id] === 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-4 text-center">{counts[type.id]}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleIncrement(type.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button className="w-full">Save Changes</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
