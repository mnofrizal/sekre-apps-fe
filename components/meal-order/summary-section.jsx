"use client";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function SummarySection({
  subBidang,
  judulPekerjaan,
  zonaWaktu,
  dropPoint,
  picName,
  picPhone,
  counts,
  employees,
}) {
  return (
    <div className="fixed right-0 top-[64px] flex h-[calc(100vh-64px)] w-[380px] flex-col border-l bg-white">
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
                  <div className="font-medium text-primary">
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
                  <div className="font-medium text-primary">
                    {judulPekerjaan || "Not entered"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Calendar className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
                <div className="flex-1">
                  <div className="mb-1 text-sm text-gray-500">Waktu</div>
                  <div className="font-medium text-primary">
                    {zonaWaktu || "Not selected"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
                <div className="flex-1">
                  <div className="mb-1 text-sm text-gray-500">Drop Point</div>
                  <div className="font-medium text-primary">
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
                  <div className="font-medium text-primary">
                    {picName || "Not entered"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-gray-500" />
                <div className="flex-1">
                  <div className="mb-1 text-sm text-gray-500">PIC Phone</div>
                  <div className="font-medium text-primary">
                    {picPhone || "Not entered"}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Employee Counts */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700">Employee Counts</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(counts).map(
                  ([type, count]) =>
                    count !== 0 && (
                      <div
                        key={type}
                        className={`rounded-lg p-3 ${
                          type === "PLNIP"
                            ? "bg-blue-50"
                            : type === "IPS"
                            ? "bg-orange-50"
                            : type === "KOP"
                            ? "bg-green-50"
                            : "bg-gray-50"
                        }`}
                      >
                        <div className="mb-1 text-sm text-gray-500">{type}</div>
                        <div className="text-lg font-semibold">{count}</div>
                      </div>
                    )
                )}
              </div>
            </div>

            <Separator />

            {/* Employees List */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700">Employees</h3>
              {Object.entries(employees).map(
                ([type, empList]) =>
                  empList.length > 0 && (
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
                            ? "bg-blue-50"
                            : type === "IPS"
                            ? "bg-orange-50"
                            : type === "KOP"
                            ? "bg-green-50"
                            : "bg-gray-50"
                        }`}
                      >
                        {empList.map((emp, index) => (
                          <div
                            key={index}
                            className="p-3 first:rounded-t-lg last:rounded-b-lg"
                          >
                            <div className="font-medium">{emp.name}</div>
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
                        ))}
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  );
}
