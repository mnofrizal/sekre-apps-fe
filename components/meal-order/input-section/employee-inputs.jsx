import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Check, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function EmployeeInputs({
  type,
  count,
  employees,
  anonymousEnabled,
  setAnonymousEnabled,
  syncMenuEnabled,
  setSyncMenuEnabled,
  handleEmployeeChange,
  menuOptions,
  plnipNames,
  subBidang,
  setEmployees,
  showAllTypes,
  counts,
}) {
  if (!employees[type]) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold">{type}</h3>
          {count > 0 &&
            (employees[type]?.length === count &&
            employees[type]?.every((emp) => emp.name && emp.menu) ? (
              <div className="rounded-full bg-green-100 p-1">
                <Check className="h-3 w-3 text-green-500" />
              </div>
            ) : (
              <div className="rounded-full bg-red-100 p-1">
                <X className="h-3 w-3 text-red-500" />
              </div>
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label>Template Name</Label>
            <Input value={`Pegawai ${type}`} disabled className="bg-muted" />
            <div className="mt-1 text-xs text-muted-foreground">
              {`Akan diterapkan ke semua ${count} entri`}
            </div>
          </div>
          <div>
            <Label>Menu Template</Label>
            <Select
              value={employees[type][0]?.menu?.id || ""}
              onValueChange={(value) => {
                const menuItem = menuOptions.find((item) => item.id === value);
                const updatedEmployees = { ...employees };
                updatedEmployees[type] = Array(count).fill({
                  name: `Pegawai ${type}`,
                  menu: menuItem,
                  note: employees[type][0]?.note || "",
                });

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
                    if (type === "PLNIP" && syncMenuEnabled[type]) {
                      const updatedEmployees = { ...employees };
                      updatedEmployees[type] = updatedEmployees[type].map(
                        (emp) => ({
                          ...emp,
                          menu: menuItem,
                        })
                      );
                      setEmployees(updatedEmployees);
                    } else {
                      handleEmployeeChange(type, index, "menu", value);
                    }

                    if (!showAllTypes && type === "PLNIP" && index === 0) {
                      const updatedEmployees = { ...employees };
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
                      setEmployees(updatedEmployees);
                    }
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
}
