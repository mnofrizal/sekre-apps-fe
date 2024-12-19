"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { importEmployees } from "@/lib/api/employees";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

export function ImportExcelDialog({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const { toast } = useToast();

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an Excel file (.xlsx or .xls)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      // Read file for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet, {
            header: [
              "bagian",
              "name",
              "nip",
              "subBidang",
              "jabatan",
              "nomorHP",
              "isAsman",
              "email",
            ],
            range: 1,
          });

          setSelectedFile(file);
          setPreviewData(data);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to read Excel file",
            variant: "destructive",
          });
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process file",
        variant: "destructive",
      });
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    try {
      setIsLoading(true);
      const result = await importEmployees(selectedFile);

      toast({
        title: "Success",
        description: result.message,
      });

      // Close dialog and reset state
      setOpen(false);
      setSelectedFile(null);
      setPreviewData(null);

      // Trigger refresh of employee list
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to import employees",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setOpen(false);
      setSelectedFile(null);
      setPreviewData(null);
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Import from Excel
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Employees from Excel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please select an Excel file (.xlsx) with the following columns:
              bagian, name, nip, subBidang, jabatan, nomorHP, isAsman, email
            </p>
            <div className="space-y-2">
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileSelect}
                disabled={isLoading}
                className="w-full cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
              />
              {previewData && (
                <div className="space-y-1 text-sm">
                  <p className="font-medium">Preview:</p>
                  <p>Number of employees to import: {previewData.length}</p>
                  {previewData.length > 0 && (
                    <div className="text-muted-foreground">
                      First entry: {previewData[0].name} ({previewData[0].nip})
                    </div>
                  )}
                </div>
              )}
              {isLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading and processing file...
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!selectedFile || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                "Import"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
