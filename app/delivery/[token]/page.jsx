"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { Camera, Check, RefreshCcw, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  verifyApprovalToken,
  confirmDelivery,
  ERROR_CODES,
  respondToRequest,
  processOrder,
} from "@/lib/api/requests";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "@/components/approval/loading-state";
import { ErrorState } from "@/components/approval/error-state";
import { getMealCategory, getStatusColor, getStatusName } from "@/lib/constant";
import { Badge } from "@/components/ui/badge";

const getErrorDetails = (error) => {
  switch (error.code) {
    case ERROR_CODES.TOKEN_EXPIRED:
      return {
        title: "Link Kadaluarsa",
        message: "Link konfirmasi ini telah kadaluarsa. Mohon minta link baru.",
        canRetry: false,
      };
    case ERROR_CODES.TOKEN_INVALID:
      return {
        title: "Link Tidak Valid",
        message: "Link konfirmasi ini tidak valid atau sudah digunakan.",
        canRetry: false,
      };
    case ERROR_CODES.UNAUTHORIZED:
      return {
        title: "Tidak Diizinkan",
        message: "Anda tidak memiliki izin untuk mengakses halaman ini.",
        canRetry: false,
      };
    case ERROR_CODES.NETWORK_ERROR:
      return {
        title: "Kesalahan Koneksi",
        message:
          "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
        canRetry: true,
      };
    case ERROR_CODES.SERVER_ERROR:
      return {
        title: "Link Tidak Valid atau Kadaluarsa",
        message: "Link konfirmasi ini tidak valid atau sudah digunakan.",
        canRetry: true,
      };
    default:
      return {
        title: "Error",
        message: error.message || "Terjadi kesalahan yang tidak diketahui.",
        canRetry: true,
      };
  }
};

export default function DeliveryConfirmation() {
  const { token } = useParams();
  const { toast } = useToast();
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [captureTime, setCaptureTime] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isProcessed, setIsProcessed] = useState(false);
  const [showProcessDialog, setShowProcessDialog] = useState(false);

  const fetchData = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      const response = await verifyApprovalToken(token);
      console.log(response.data);
      // Transform the data to match our UI needs
      const request = response.data.request;

      const requestId = response.data.requestId;

      const items = request.employeeOrders.flatMap((order) =>
        order.orderItems.map((item) => ({
          name: item.menuItem.name,
          quantity: item.quantity,
          notes: item.notes,
          entity: order.entity,
        }))
      );

      setOrderDetails({
        orderId: requestId,
        status: request.status,
        items,
        total: `${items.length} item${items.length > 1 ? "s" : ""}`,
        deliveryAddress: request.dropPoint,
        requiredDate: new Date(request.requiredDate)
          .toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
          })
          .replace(".", ":"),
        pesananType: getMealCategory(request.requiredDate),
        pic: request.pic,
        supervisor: request.supervisor,
      });
    } catch (err) {
      const errorDetails = getErrorDetails(err);
      setError(errorDetails);
      toast({
        title: errorDetails.title,
        description: errorDetails.message,
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, toast]);

  const handleOpenCamera = async () => {
    try {
      console.log("Starting camera initialization...");
      // Set showCamera first to ensure video element is rendered
      setShowCamera(true);
      setError(null);

      // Small delay to ensure video element is mounted
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (!videoRef.current) {
        throw new Error("Video element not initialized");
      }

      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      console.log("Camera access granted, setting up video stream...");
      videoRef.current.srcObject = stream;

      try {
        await videoRef.current.play();
        console.log("Video stream started successfully");
      } catch (playError) {
        console.error("Error playing video:", playError);
        throw new Error("Failed to start video playback");
      }

      setCapturedImage(null);
    } catch (err) {
      console.error("Camera initialization error:", err);
      setShowCamera(false);
      setError(
        "Tidak dapat mengakses kamera. Pastikan Anda telah memberikan izin dan perangkat Anda mendukung akses kamera."
      );
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const imageDataUrl = canvasRef.current.toDataURL("image/jpeg");
        const timestamp = new Date()
          .toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "medium",
          })
          .replace(/\./g, ":");
        setCaptureTime(timestamp);
        setCapturedImage(imageDataUrl);
        setShowCamera(false);
        // Stop the camera stream
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const handleFinish = async () => {
    try {
      setLoading(true);

      // Convert captured image to dataURL and log payload
      if (capturedImage) {
        console.log("Payload being sent:", {
          token,
          image: capturedImage,
          message: "Request delivered",
        });
      }

      const response = await respondToRequest(
        token,
        true,
        "Request delivered",
        capturedImage
      );
      // const response = { success: true }; // Dummy response
      if (!response.success) {
        throw new Error(response.message || "Gagal mengkonfirmasi pengiriman");
      }
      toast({
        title: "Pengiriman Dikonfirmasi",
        description: "Terima kasih telah mengkonfirmasi pengiriman.",
      });
      stopCamera();
      setDialogOpen(false);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Gagal mengkonfirmasi pengiriman",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState
        title={error.title}
        message={error.message}
        onRetry={error.canRetry ? fetchData : undefined}
      />
    );
  }

  if (!orderDetails) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="bg-primary p-4 text-primary-foreground">
        <h1 className="text-center text-2xl font-bold">Pengiriman Pesanan</h1>
      </header>

      <main className="flex flex-grow flex-col justify-start overflow-y-auto p-4">
        <div
          className={`inline-flex items-center justify-center  px-2.5 py-3 text-sm rounded-t-lg  font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${getStatusColor(
            orderDetails.status
          )}`}
        >
          {getStatusName(orderDetails.status)}
        </div>
        <Card className="mb-4 rounded-lg rounded-t-none border-t-0">
          <CardHeader>
            <CardTitle>{`Ringkasan Pesanan ${orderDetails.pesananType}`}</CardTitle>
            <CardDescription>Pesanan #{orderDetails.orderId}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div className="flex flex-col">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    {item.notes && (
                      <span className="text-sm text-muted-foreground">
                        Catatan: {item.notes}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {item.entity}
                  </span>
                </div>
              ))}
              <div className="space-y-2 border-t pt-2 text-sm">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{orderDetails.total}</span>
                </div>
                <div className="">
                  <p>Alamat Pengiriman:</p>
                  <p className="text-muted-foreground">
                    {orderDetails.deliveryAddress}
                  </p>
                </div>
                <div className="">
                  <p>Waktu Pengiriman:</p>
                  <p className="text-muted-foreground">
                    {orderDetails.requiredDate}
                  </p>
                </div>
                <div className="space-y-2 border-t pt-2">
                  <div>
                    <p className="font-medium">PIC:</p>
                    <p className="text-muted-foreground">
                      {orderDetails.pic.name} ({orderDetails.pic.nomorHp})
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">ASMAN:</p>
                    <p className="text-muted-foreground">
                      {orderDetails.supervisor.name} (
                      {orderDetails.supervisor.nomorHp})
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Sub Bidang: {orderDetails.supervisor.subBidang}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Proses Pesanan</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin memproses pesanan ini?
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowProcessDialog(false)}
              >
                <X className="mr-2 h-5 w-5" /> Batal
              </Button>
              <Button
                onClick={async () => {
                  try {
                    await processOrder(orderDetails.orderId);
                    setIsProcessed(true);
                    setShowProcessDialog(false);
                    await fetchData(); // Refetch to get updated status
                    toast({
                      title: "Pesanan Diproses",
                      description: "Pesanan telah siap untuk diselesaikan.",
                    });
                  } catch (err) {
                    toast({
                      title: "Error",
                      description: err.message || "Gagal memproses pesanan",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <Check className="mr-2 h-5 w-5" /> Proses Pesanan
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="space-y-4">
          <Button
            size="lg"
            className="w-full rounded-2xl p-6"
            onClick={() => setShowProcessDialog(true)}
            disabled={isProcessed || orderDetails.status === "IN_PROGRESS"}
          >
            <Check className="mr-2 h-5 w-5" /> PROSES PESANAN
          </Button>

          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (open) {
                // Automatically open camera when dialog opens
                handleOpenCamera();
              } else {
                // Clean up camera stream when dialog closes
                stopCamera();
                setCapturedImage(null);
                setCaptureTime(null);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="w-full rounded-2xl p-6"
                disabled={!isProcessed && orderDetails.status !== "IN_PROGRESS"}
              >
                <Check className="mr-2 h-5 w-5" /> SELESAIKAN PESANAN
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Konfirmasi Pengiriman</DialogTitle>
                <DialogDescription>
                  Ambil foto untuk konfirmasi pengiriman.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                {showCamera ? (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="aspect-square w-full rounded-lg object-cover"
                      onLoadedMetadata={() =>
                        console.log("Video metadata loaded")
                      }
                      onPlay={() =>
                        console.log("Video element started playing")
                      }
                      onError={(e) => {
                        console.error("Video element error:", e);
                        setError("Gagal menampilkan kamera");
                        setShowCamera(false);
                      }}
                    />
                  </div>
                ) : capturedImage ? (
                  <div className="space-y-2">
                    <img
                      src={capturedImage || "/placeholder.svg"}
                      alt="Captured"
                      className="aspect-square w-full rounded-lg object-cover"
                    />
                    <p className="text-center text-sm text-muted-foreground">
                      diambil pada: {captureTime}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    {error && (
                      <p className="mb-4 text-center text-destructive">
                        {error}
                      </p>
                    )}
                    <Button onClick={handleOpenCamera} className="w-full">
                      <Camera className="mr-2 h-5 w-5" /> Ambil Foto
                    </Button>
                  </div>
                )}
              </div>
              <div className="mt-4 space-y-4">
                {showCamera ? (
                  <Button
                    onClick={handleCapture}
                    className="w-full rounded-xl p-6"
                    size="lg"
                    variant="secondary"
                  >
                    <Camera className="mr-2 h-5 w-5" /> Ambil Foto
                  </Button>
                ) : (
                  capturedImage && (
                    <Button
                      onClick={handleOpenCamera}
                      className="w-full rounded-xl p-6"
                      size="lg"
                      variant="secondary"
                    >
                      <RefreshCcw className="mr-2 h-5 w-5" /> Ulangi Foto
                    </Button>
                  )
                )}
                <Button
                  className="w-full rounded-xl p-6"
                  size="lg"
                  onClick={handleFinish}
                  disabled={!capturedImage || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Konfirmasi Pengiriman
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
