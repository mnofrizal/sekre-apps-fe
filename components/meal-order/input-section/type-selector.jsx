import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

export const TYPE_COLORS = {
  PLNIP:
    "bg-blue-50/60 data-[state=active]:bg-gradient-to-br from-blue-200 to-blue-300 hover:bg-blue-100",
  IPS: "bg-orange-50/60 data-[state=active]:bg-gradient-to-br from-orange-200 to-orange-300 hover:bg-orange-100",
  KOP: "bg-green-50/60 data-[state=active]:bg-gradient-to-br from-green-200 to-green-300 hover:bg-green-100",
  RSU: "bg-purple-50/60 data-[state=active]:bg-gradient-to-br from-purple-200 to-purple-300 hover:bg-purple-100",
  MITRA:
    "bg-gray-50/60 data-[state=active]:bg-gradient-to-br from-gray-200 to-gray-300 hover:bg-gray-100",
};

export const TEXT_COLORS = {
  PLNIP: {
    active: "text-blue-700",
    inactive: "text-blue-500",
  },
  IPS: {
    active: "text-orange-700",
    inactive: "text-orange-500",
  },
  KOP: {
    active: "text-green-700",
    inactive: "text-green-500",
  },
  RSU: {
    active: "text-purple-700",
    inactive: "text-purple-500",
  },
  MITRA: {
    active: "text-gray-700",
    inactive: "text-gray-500",
  },
};

export const TYPE_NAMES = {
  PLNIP: "PLN INDONESIA POWER",
  IPS: "INDONESIA POWER SERVICES",
  KOP: "KOPERASI",
  RSU: "RUSAMAS SARANA USAHA",
  MITRA: "MITRA",
};

export function TypeSelector({ counts, activeTypes, onTypeToggle }) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-4 px-1 sm:grid-cols-3 md:grid-cols-5">
      {Object.entries(counts).map(([type, count]) => (
        <button
          key={type}
          type="button"
          onClick={() => onTypeToggle(type)}
          data-state={activeTypes[type] ? "active" : "inactive"}
          className={cn(
            "border shadow-md flex flex-col items-center justify-center rounded-xl p-4 transition-all relative",
            TYPE_COLORS[type],
            activeTypes[type] ? "ring-1 ring-primary/500 ring-offset-0" : "",
            "hover:shadow-lg"
          )}
        >
          {activeTypes[type] && (
            <div className="absolute -right-1.5 -top-1.5 rounded-full bg-green-200 p-0.5 shadow-md">
              <div
                className={cn(
                  "rounded-full p-1",
                  TEXT_COLORS[type].active.replace("text-", "bg-")
                )}
              >
                <CheckIcon className="h-3 w-3 text-green-700" />
              </div>
            </div>
          )}
          <div
            className={cn(
              "text-sm font-semibold",
              activeTypes[type]
                ? TEXT_COLORS[type].active
                : TEXT_COLORS[type].inactive
            )}
          >
            {TYPE_NAMES[type]}
          </div>
          <div
            className={cn(
              "mt-1 text-xs opacity-75",
              activeTypes[type]
                ? TEXT_COLORS[type].active
                : TEXT_COLORS[type].inactive
            )}
          >
            {`${activeTypes[type] ? "Hide" : "Show"} Menu`}
          </div>
        </button>
      ))}
    </div>
  );
}
