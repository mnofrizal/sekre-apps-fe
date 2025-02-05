"use client";

import { motion } from "framer-motion";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  Building2,
  Calendar,
  ForkKnife,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function SummarySection({
  subBidang,
  judulPekerjaan,
  zonaWaktu,
  dropPoint,
  picName,
  picPhone,
  counts,
  employees,
  handleSubmit,
  isFormValid,
  submitting,
}) {
  // Check if there are any employees with data
  const hasEmployeeData =
    employees &&
    Object.values(employees).some(
      (empList) =>
        empList &&
        empList.length > 0 &&
        empList.some((emp) => emp?.name || emp?.menu)
    );

  // Calculate the number of active types for grid columns
  const activeTypeCount = Object.values(counts).filter(
    (count) => count > 0
  ).length;

  // Get the appropriate grid class based on active type count
  const getGridClass = (count) => {
    switch (count) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-3";
      case 4:
        return "grid-cols-4";
      case 5:
        return "grid-cols-5";
      default:
        return "grid-cols-2";
    }
  };

  return (
    <div className="fixed right-0 top-[64px] h-[calc(100vh-64px)] w-[380px] bg-[#fafbff]">
      <motion.div
        className="flex h-full w-full flex-col border-l bg-white shadow-md"
        initial={{ x: 380 }}
        animate={{ x: 0 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 100,
        }}
      >
        <div className="flex h-full flex-col">
          <CardHeader className="flex-shrink-0 border-b p-5 text-center">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Ringkasan Pesanan
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-4">
                  <Building2 className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
                  <div className="flex-1">
                    <div className="mb-1 text-sm text-gray-500">Sub Bidang</div>
                    <div className="font-semibold text-primary">
                      {subBidang || "Not selected"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Briefcase className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
                  <div className="flex-1">
                    <div className="mb-1 text-sm text-gray-500">
                      Judul Pekerjaan
                    </div>
                    <div className="font-semibold text-primary">
                      {judulPekerjaan || "Not entered"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Calendar className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
                  <div className="flex-1">
                    <div className="mb-1 text-sm text-gray-500">Waktu</div>
                    <div className="font-semibold text-primary">
                      {zonaWaktu || "Not selected"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
                  <div className="flex-1">
                    <div className="mb-1 text-sm text-gray-500">Drop Point</div>
                    <div className="font-semibold text-primary">
                      {dropPoint || "Not selected"}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* PIC Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-4">
                  <User className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
                  <div className="flex-1">
                    <div className="mb-1 text-sm text-gray-500">PIC Name</div>
                    <div className="font-semibold text-primary">
                      {picName || "Not entered"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
                  <div className="flex-1">
                    <div className="mb-1 text-sm text-gray-500">PIC Phone</div>
                    <div className="font-semibold text-primary">
                      {picPhone || "Not entered"}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Employee Counts */}
              {Object.values(counts).some((count) => count > 0) && (
                <>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-700">
                      Employee Counts
                    </h3>
                    <div
                      className={cn(
                        "grid gap-0",
                        getGridClass(activeTypeCount)
                      )}
                    >
                      {Object.entries(counts).map(
                        ([type, count]) =>
                          count !== 0 && (
                            <div
                              key={type}
                              className={`rounded-none p-3 shadow-sm border-none ${
                                type === "PLNIP"
                                  ? "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
                                  : type === "IPS"
                                  ? "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
                                  : type === "KOP"
                                  ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
                                  : type === "RSU"
                                  ? "bg-gradient-to-br from-purple-50 to-purple-100"
                                  : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
                              }`}
                            >
                              <div className="mb-1 text-sm text-gray-500">
                                {type}
                              </div>
                              <div className="text-lg font-semibold">
                                {count}
                              </div>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Employees List */}
              {hasEmployeeData && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-700">Employees</h3>
                  {Object.entries(employees).map(
                    ([type, empList]) =>
                      empList?.length > 0 &&
                      empList.some((emp) => emp?.name || emp?.menu) && (
                        <div key={type} className="space-y-3">
                          <h4 className="text-sm font-medium text-gray-600">
                            {type === "PLNIP"
                              ? "PLN INDONESIA POWER"
                              : type === "IPS"
                              ? "INDONESIA POWER SERVICES"
                              : type === "KOP"
                              ? "KOPERASI"
                              : type === "RSU"
                              ? "RUSAMAS SARANA USAHA"
                              : type}
                          </h4>
                          <div
                            className={`divide-y rounded-lg ${
                              type === "PLNIP"
                                ? "bg-gradient-to-br from-blue-50 to-blue-100"
                                : type === "IPS"
                                ? "bg-gradient-to-br from-orange-50 to-orange-100"
                                : type === "KOP"
                                ? "bg-gradient-to-br from-green-50 to-green-100"
                                : type === "RSU"
                                ? "bg-gradient-to-br from-purple-50 to-purple-100"
                                : "bg-gradient-to-br from-gray-50 to-gray-100"
                            }`}
                          >
                            {(() => {
                              // Group entries by name and menu
                              const groupedEntries = empList.reduce(
                                (acc, emp) => {
                                  if (!emp?.name && !emp?.menu) return acc;

                                  const key = `${emp.name || ""}-${
                                    emp.menu?.name || ""
                                  }-${emp.note || ""}`;
                                  if (!acc[key]) {
                                    acc[key] = { emp, count: 1 };
                                  } else {
                                    acc[key].count++;
                                  }
                                  return acc;
                                },
                                {}
                              );

                              return Object.values(groupedEntries).map(
                                ({ emp, count }, index) => (
                                  <div
                                    key={index}
                                    className="p-3 first:rounded-t-lg last:rounded-b-lg"
                                  >
                                    {count >= 1 ? (
                                      <div className="space-y-1">
                                        <div className="text-lg font-medium">
                                          {` ${emp.name}`}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          {`${count}x ${emp.menu?.name}`}
                                        </div>
                                        {emp.note && (
                                          <div className="text-sm text-gray-400">
                                            • {emp.note}
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <div>
                                        <div className="font-medium">
                                          {emp.name}
                                        </div>
                                        {(emp.menu?.name || emp.note) && (
                                          <div className="mt-1 flex text-sm text-gray-500">
                                            <div className="flex items-center">
                                              <ForkKnife className="mr-1 h-3 w-3 flex-shrink-0 text-gray-500" />
                                              <span>{emp.menu?.name}</span>
                                              {emp.note && (
                                                <span className="ml-1 text-gray-400">
                                                  • {emp.note}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )
                              );
                            })()}
                          </div>
                        </div>
                      )
                  )}
                </div>
              )}
            </div>
          </CardContent>
          <div className="border-t bg-white p-4 shadow-md">
            <Button
              type="submit"
              form="meal-order-form"
              className="w-full py-5"
              disabled={!isFormValid || submitting}
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                "SUBMIT PESANAN"
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
