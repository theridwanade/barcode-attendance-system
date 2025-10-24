"use client";

import { use, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface RouteParams {
  params: { slug: string };
}

const beep = (duration = 200, frequency = 440, volume = 0.5) => {
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.frequency.value = frequency;
  gain.gain.value = volume;

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + duration / 1000);
};

const Page = ({ params }: RouteParams) => {
  const { slug } = use(params);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [scanResponse, setScanResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // 🎥 List all cameras
  const getCameras = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter((d) => d.kind === "videoinput");
      setDevices(videoDevices);
      if (videoDevices.length > 0)
        setSelectedDeviceId(videoDevices[0].deviceId);
    } catch (err) {
      console.error("Could not list cameras:", err);
    }
  };

  // 🎞 Start stream
  const startStream = async () => {
    if (!selectedDeviceId) return alert("Select a camera first");
    try {
      stream?.getTracks().forEach((t) => t.stop());
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: selectedDeviceId } },
      });
      setStream(mediaStream);
    } catch (error) {
      console.error("Error accessing selected camera:", error);
    }
  };

  const recordAttendance = async (qrData: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/events/${slug}/record`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrData }),
      });
      const data = await response.json();
      setScanResponse(data.message);
    } catch (error: any) {
      setScanResponse(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Attach video stream
  useEffect(() => {
    if (stream && videoRef.current) videoRef.current.srcObject = stream;
  }, [stream]);

  // Stop stream on unmount
  useEffect(() => {
    return () => stream?.getTracks().forEach((track) => track.stop());
  }, [stream]);

  // Load camera list
  useEffect(() => {
    getCameras();
  }, []);

  // 🔍 QR Scan Loop
  useEffect(() => {
    let scanInterval: number;

    const scan = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = video.videoWidth;
      const h = video.videoHeight;
      if (!w || !h) return;

      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(video, 0, 0, w, h);

      const imageData = ctx.getImageData(0, 0, w, h);
      const code = jsQR(imageData.data, w, h);
      if (code) {
        beep();
        recordAttendance(code.data);
      }
    };

    if (stream) scanInterval = window.setInterval(scan, 200);

    return () => clearInterval(scanInterval);
  }, [stream]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white px-4 py-6">
      <motion.h1
        className="text-2xl md:text-3xl font-bold mb-2 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Record attendance for your event
      </motion.h1>
      <p className="text-gray-400 mb-6 text-center text-sm">
        Scan your QR code to mark attendance
      </p>

      {/* Video Box */}
      <div className="relative w-full max-w-[420px] aspect-[3/2] bg-black border border-gray-700 rounded-2xl overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        {!stream && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
            Camera not active
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="w-full max-w-[420px] mt-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedDeviceId}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
          >
            {devices.map((device, index) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${index + 1}`}
              </option>
            ))}
          </select>

          <Button
            onClick={startStream}
            className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto"
          >
            Start Camera
          </Button>
        </div>

        {scanResponse && (
          <motion.div
            className="mt-3 text-center text-sm bg-slate-800 border border-slate-700 rounded-lg py-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {loading ? "Processing..." : scanResponse}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Page;
