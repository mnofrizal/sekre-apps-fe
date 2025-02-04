"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, ClipboardList, ForkKnife, X } from "lucide-react";

const TYPE_COLORS = {
  PLNIP: "bg-blue-50/60 data-[state=active]:bg-blue-200/90 hover:bg-blue-100",
  IPS: "bg-orange-50/60 data-[state=active]:bg-orange-200/90 hover:bg-orange-100",
  KOP: "bg-green-50/60 data-[state=active]:bg-green-200/90 hover:bg-green-100",
  RSU: "bg-purple-50/60 data-[state=active]:bg-purple-200/90 hover:bg-purple-100",
  MITRA: "bg-gray-50/60 data-[state=active]:bg-gray-200/90 hover:bg-gray-100",
};

const TYPE_NAMES = {
  PLNIP: "PLN INDONESIA POWER",
  IPS: "INDONESIA POWER SERVICES",
  KOP: "KOPERASI",
  RSU: "RUSAMAS SARANA USAHA",
  MITRA: "MITRA",
};

export default function InputSection({
  handleSubmit,
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
  counts,
  handleCountChange,
  employees,
  handleEmployeeChange,
  bidangOptions,
  zonaWaktuOrder,
  plnipNames,
  menuOptions,
  syncMenuEnabled,
  setSyncMenuEnabled,
  anonymousEnabled,
  setAnonymousEnabled,
  isFormValid,
  submitting,
  setEmployees,
}) {
  const [activeTypes, setActiveTypes] = useState({});
  const [showAllTypes, setShowAllTypes] = useState(true);
  const [defaultSwitchesSet, setDefaultSwitchesSet] = useState(false);

  // Set default switches on first render
  useEffect(() => {
    if (!defaultSwitchesSet) {
      // Set all types except PLNIP to have "Isi Anonim" on by default
      const defaultAnonymous = {};
      Object.keys(TYPE_NAMES).forEach((type) => {
        if (type !== "PLNIP") {
          defaultAnonymous[type] = true;
        }
      });
      setAnonymousEnabled(defaultAnonymous);

      // Set all types to have "Samakan Menu" on by default
      const defaultSync = {};
      Object.keys(TYPE_NAMES).forEach((type) => {
        defaultSync[type] = true;
      });
      setSyncMenuEnabled(defaultSync);

      setDefaultSwitchesSet(true);
    }
  }, []);

  // Effect to sync other types with PLNIP when showAllTypes is false
  useEffect(() => {
    if (!showAllTypes) {
      const updatedEmployees = { ...employees };
      const plnipFirstMenu = employees.PLNIP?.[0]?.menu;

      Object.keys(employees).forEach((type) => {
        if (type !== "PLNIP") {
          updatedEmployees[type] = Array(counts[type]).fill({
            name: `Pegawai ${type}`,
            menu: plnipFirstMenu,
            note: "",
          });
        }
      });
      setEmployees(updatedEmployees);
    }
  }, [showAllTypes, employees.PLNIP, counts]);

  // Initialize active types based on counts
  useEffect(() => {
    const initialActiveTypes = {};
    Object.entries(counts).forEach(([type, count]) => {
      initialActiveTypes[type] = count > 0;
    });
    setActiveTypes(initialActiveTypes);
  }, [counts]); // Update when counts change

  const [typeToReset, setTypeToReset] = useState(null);

  useEffect(() => {
    if (typeToReset) {
      handleCountChange(typeToReset, "0");
      setTypeToReset(null);
    }
  }, [typeToReset, handleCountChange]);

  const handleTypeToggle = (type) => {
    setActiveTypes((prev) => {
      const newState = {
        ...prev,
        [type]: !prev[type],
      };

      // If turning off a type, queue it for reset
      if (!newState[type]) {
        setTypeToReset(type);
      } else if (!showAllTypes && type !== "PLNIP" && counts[type] > 0) {
        // When turning on a type and "Isi Lengkap" is off, automatically fill entries
        const updatedEmployees = { ...employees };
        const plnipFirstMenu = employees.PLNIP?.[0]?.menu;

        // Fill entries based on current count
        updatedEmployees[type] = Array(counts[type]).fill({
          name: `Pegawai ${type}`,
          menu: plnipFirstMenu,
          note: "",
        });

        setEmployees(updatedEmployees);
        // Set anonymous mode on for non-PLNIP types
        setAnonymousEnabled((prev) => ({ ...prev, [type]: true }));
      }

      return newState;
    });
  };
  const renderEmployeeInputs = (type, count) => (
    <div key={type} className="space-y-4">
      <div className="flex items-center justify-between">
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
        <div className="flex items-center gap-4">
          {type !== "PLNIP" && (
            <div className="flex items-center space-x-2">
              <Label htmlFor={`anonymous-${type}`}>Isi Anonim</Label>
              <Switch
                id={`anonymous-${type}`}
                checked={anonymousEnabled[type] || false}
                onCheckedChange={(checked) => {
                  setAnonymousEnabled((prev) => ({ ...prev, [type]: checked }));
                  if (checked) {
                    // Fill all employee names with "Pegawai {type}"
                    const updatedEmployees = { ...employees };
                    updatedEmployees[type] = updatedEmployees[type].map(
                      (emp) => ({
                        ...emp,
                        name: `Pegawai ${type}`,
                      })
                    );
                    setEmployees(updatedEmployees);
                  }
                }}
              />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Label htmlFor={`sync-${type}`}>Samakan Menu</Label>
            <Switch
              id={`sync-${type}`}
              checked={syncMenuEnabled[type] || false}
              onCheckedChange={(checked) => {
                setSyncMenuEnabled((prev) => ({ ...prev, [type]: checked }));
              }}
            />
          </div>
        </div>
      </div>
      {anonymousEnabled[type] ? (
        // Show one template row for anonymous mode
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label>Template Name</Label>
            <Input value={`Pegawai ${type}`} disabled className="bg-muted" />
            <div className="mt-1 text-xs text-muted-foreground">
              {`Will be applied to all ${count} entries`}
            </div>
          </div>
          <div>
            <Label>Menu Template</Label>
            <Select
              value={employees[type][0]?.menu?.id || ""}
              onValueChange={(value) => {
                // Apply to all entries when menu changes
                const menuItem = menuOptions.find((item) => item.id === value);
                const updatedEmployees = { ...employees };
                updatedEmployees[type] = Array(count).fill({
                  name: `Pegawai ${type}`,
                  menu: menuItem,
                  note: employees[type][0]?.note || "",
                });

                // When "Isi Lengkap" is off and this is PLNIP, sync menu to other types
                if (!showAllTypes && type === "PLNIP") {
                  Object.keys(updatedEmployees).forEach((otherType) => {
                    if (otherType !== "PLNIP") {
                      updatedEmployees[otherType] = Array(
                        counts[otherType]
                      ).fill({
                        name: `Pegawai ${otherType}`,
                        menu: menuItem,
                        note: "",
                      });
                    }
                  });
                }

                setEmployees(updatedEmployees);
              }}
            >
              <SelectTrigger>
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
            <Label>Note Template</Label>
            <Input
              value={employees[type][0]?.note || ""}
              onChange={(e) => {
                // Apply to all entries when note changes
                const updatedEmployees = { ...employees };
                updatedEmployees[type] = updatedEmployees[type].map((emp) => ({
                  ...emp,
                  note: e.target.value,
                }));
                setEmployees(updatedEmployees);
              }}
              placeholder="Enter note for all"
            />
          </div>
        </div>
      ) : (
        // Show individual rows when not anonymous
        Array(count)
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
                  onValueChange={(value) => {
                    const menuItem = menuOptions.find(
                      (item) => item.id === value
                    );
                    const updatedEmployees = { ...employees };

                    // When "Samakan Menu" is on for PLNIP, sync all PLNIP rows
                    if (type === "PLNIP" && syncMenuEnabled[type]) {
                      updatedEmployees[type] = updatedEmployees[type].map(
                        (emp) => ({
                          ...emp,
                          menu: menuItem,
                        })
                      );
                    } else {
                      handleEmployeeChange(type, index, "menu", value);
                    }

                    // When "Isi Lengkap" is off and this is PLNIP, sync menu to other types
                    if (!showAllTypes && type === "PLNIP" && index === 0) {
                      Object.keys(updatedEmployees).forEach((otherType) => {
                        if (otherType !== "PLNIP") {
                          updatedEmployees[otherType] = Array(
                            counts[otherType]
                          ).fill({
                            name: `Pegawai ${otherType}`,
                            menu: menuItem,
                            note: "",
                          });
                        }
                      });
                    }

                    setEmployees(updatedEmployees);
                  }}
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
          ))
      )}
    </div>
  );

  return (
    <div className="fixed left-64 top-[64px] flex h-[calc(100vh-64px)] w-[calc(100%-380px-256px)] flex-col border-none bg-[#fafbff] shadow-none">
      <ScrollArea className="flex-1 p-6">
        <form
          id="meal-order-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
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
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
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
          </Card>
          <div className="mb-6 grid grid-cols-2 gap-4 px-1 sm:grid-cols-3 md:grid-cols-5">
            {Object.entries(counts).map(([type, count]) => (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeToggle(type)}
                data-state={activeTypes[type] ? "active" : "inactive"}
                className={cn(
                  "border shadow-md flex flex-col items-center justify-center rounded-xl p-4 transition-all",
                  TYPE_COLORS[type],
                  activeTypes[type] ? "ring-1 ring-primary ring-offset-0" : "",
                  "hover:shadow-lg"
                )}
              >
                {/* <div className="text-xl font-semibold">{count}</div> */}
                <div className="text-sm font-semibold text-gray-600">
                  {TYPE_NAMES[type]}
                </div>
                <div className="mt-1 text-xs text-gray-500">{`${
                  activeTypes[type] ? "Hide" : "Show"
                } Menu`}</div>
              </button>
            ))}
          </div>
          <Card className="shadow-md">
            <CardContent className="space-y-6 pt-6">
              <div className="mb-4 flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-primary">
                  <ForkKnife className="h-5 w-5" />
                  Detail Menu
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Label htmlFor="isi-lengkap">Isi Lengkap</Label>
                  <Switch
                    id="isi-lengkap"
                    checked={showAllTypes}
                    onCheckedChange={(checked) => {
                      if (!checked) {
                        // When turning off, apply PLNIP's first menu to all other types
                        const updatedEmployees = { ...employees };
                        const plnipFirstMenu = employees.PLNIP?.[0]?.menu;
                        Object.keys(employees).forEach((type) => {
                          if (type !== "PLNIP") {
                            updatedEmployees[type] = Array(counts[type]).fill({
                              name: `Pegawai ${type}`,
                              menu: plnipFirstMenu,
                              note: "",
                            });
                          }
                        });
                        setEmployees(updatedEmployees);
                      }
                      setShowAllTypes(checked);
                    }}
                  />
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
                      max={
                        type === "PLNIP"
                          ? plnipNames[subBidang]?.length || 0
                          : undefined
                      }
                      value={count}
                      disabled={!activeTypes[type]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (type === "PLNIP") {
                          const maxEmployees =
                            plnipNames[subBidang]?.length || 0;
                          if (value > maxEmployees) {
                            handleCountChange(type, maxEmployees.toString());
                            return;
                          }
                        }
                        // Update the count first
                        handleCountChange(type, e.target.value);

                        // Auto-fill entries based on the new count value
                        const updatedEmployees = { ...employees };
                        const newCount = parseInt(e.target.value) || 0;

                        if (type === "PLNIP") {
                          // For PLNIP, just resize the array maintaining existing entries
                          const currentEntries = updatedEmployees[type] || [];
                          updatedEmployees[type] = Array(newCount)
                            .fill(null)
                            .map(
                              (_, i) =>
                                currentEntries[i] || {
                                  name: "",
                                  menu: null,
                                  note: "",
                                }
                            );
                        } else {
                          // For other types:
                          // When "Isi Lengkap" is off, use PLNIP's first menu and anonymous names
                          if (!showAllTypes) {
                            const plnipFirstMenu = employees.PLNIP?.[0]?.menu;
                            updatedEmployees[type] = Array(newCount).fill({
                              name: `Pegawai ${type}`,
                              menu: plnipFirstMenu,
                              note: "",
                            });
                            // Enable anonymous mode
                            setAnonymousEnabled((prev) => ({
                              ...prev,
                              [type]: true,
                            }));
                          } else {
                            // When "Isi Lengkap" is on, just initialize empty entries
                            const currentEntries = updatedEmployees[type] || [];
                            updatedEmployees[type] = Array(newCount)
                              .fill(null)
                              .map(
                                (_, i) =>
                                  currentEntries[i] || {
                                    name: "",
                                    menu: null,
                                    note: "",
                                  }
                              );
                          }
                        }
                        setEmployees(updatedEmployees);
                      }}
                      className={cn(
                        activeTypes[type] &&
                          count > 0 &&
                          TYPE_COLORS[type].replace("bg-", "bg-opacity-100 bg-")
                      )}
                    />
                    {type === "PLNIP" && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        Max: {plnipNames[subBidang]?.length || 0} employees
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                {Object.entries(counts).map(
                  ([type, count], index) =>
                    activeTypes[type] &&
                    count > 0 &&
                    (showAllTypes || type === "PLNIP") && (
                      <div key={type}>
                        {renderEmployeeInputs(type, count)}
                        {index < Object.entries(counts).length - 1 &&
                          showAllTypes && <Separator className="my-4" />}
                      </div>
                    )
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </ScrollArea>
    </div>
  );
}
