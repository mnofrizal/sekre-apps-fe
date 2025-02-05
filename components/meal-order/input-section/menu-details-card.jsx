import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ForkKnife } from "lucide-react";
import { cn } from "@/lib/utils";
import { TYPE_COLORS } from "./type-selector";
import { EmployeeInputs } from "./employee-inputs";

export function MenuDetailsCard({
  counts,
  handleCountChange,
  showAllTypes,
  setShowAllTypes,
  activeTypes,
  plnipNames,
  subBidang,
  employees,
  setEmployees,
  syncMenuEnabled,
  setSyncMenuEnabled,
  anonymousEnabled,
  setAnonymousEnabled,
  menuOptions,
  handleEmployeeChange,
}) {
  return (
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
                    const maxEmployees = plnipNames[subBidang]?.length || 0;
                    if (value > maxEmployees) {
                      handleCountChange(type, maxEmployees.toString());
                      return;
                    }
                  }
                  // Initialize employees array when count changes
                  const newCount = parseInt(e.target.value) || 0;
                  const updatedEmployees = { ...employees };

                  if (type === "PLNIP") {
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
                    if (!showAllTypes) {
                      const plnipFirstMenu = employees.PLNIP?.[0]?.menu;
                      updatedEmployees[type] = Array(newCount).fill({
                        name: `Pegawai ${type}`,
                        menu: plnipFirstMenu,
                        note: "",
                      });
                      setAnonymousEnabled((prev) => ({
                        ...prev,
                        [type]: true,
                      }));
                    } else {
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
                  handleCountChange(type, e.target.value);
                }}
                className={cn(
                  activeTypes[type] &&
                    count > 0 &&
                    TYPE_COLORS[type].replace("bg-", "bg-opacity-100 bg-"),
                  !activeTypes[type] && "text-gray-400 bg-gray-200"
                )}
              />
              {type === "PLNIP" && (
                <div className="mt-1 text-xs text-muted-foreground">
                  Max: {plnipNames[subBidang]?.length || 0} Pegawai
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
                  <EmployeeInputs
                    type={type}
                    count={count}
                    employees={employees}
                    anonymousEnabled={anonymousEnabled}
                    setAnonymousEnabled={setAnonymousEnabled}
                    syncMenuEnabled={syncMenuEnabled}
                    setSyncMenuEnabled={setSyncMenuEnabled}
                    handleEmployeeChange={handleEmployeeChange}
                    menuOptions={menuOptions}
                    plnipNames={plnipNames}
                    subBidang={subBidang}
                    setEmployees={setEmployees}
                    showAllTypes={showAllTypes}
                    counts={counts}
                  />
                  {index < Object.entries(counts).length - 1 &&
                    showAllTypes && <Separator className="my-4" />}
                </div>
              )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
