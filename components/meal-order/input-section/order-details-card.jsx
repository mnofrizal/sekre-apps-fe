import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  );
}
