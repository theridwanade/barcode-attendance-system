"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

interface RouteParams {
  params: {
    slug: string;
  };
}

const beep = (duration = 200, frequency = 440, volume = 0.5) => {
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.frequency.value = frequency; // Hz
  gain.gain.value = volume;

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + duration / 1000);
};



const Page = ({ params }: RouteParams) => {
  const { slug } = params;
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [scanResult, setScanResult] = useState<string>("");

  // List all cameras
  const getCameras = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter((d) => d.kind === "videoinput");
      setDevices(videoDevices);
      if (videoDevices.length > 0) setSelectedDeviceId(videoDevices[0].deviceId);
    } catch (err) {
      console.error("Could not list cameras:", err);
    }
  };

  const startStream = async () => {
    if (!selectedDeviceId) return alert("Select a camera first");

    try {
      // stop old streams
      // biome-ignore lint/suspicious/useIterableCallbackReturn: There is a lot of things i don't understand in linting
            stream?.getTracks().forEach((t) => t.stop());

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: selectedDeviceId } },
      });

      setStream(mediaStream);
    } catch (error) {
      console.error("Error accessing selected camera:", error);
    }
  };

  // Attach video stream
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Stop stream on unmount
  useEffect(() => {
    // biome-ignore lint/suspicious/useIterableCallbackReturn: There is a lot of things i don't understand in linting
    return () => stream?.getTracks().forEach((track) => track.stop());
  }, [stream]);

  // Load camera list on mount
  
  // biome-ignore lint/correctness/useExhaustiveDependencies: I know i dont have a dependency
      useEffect(() => {
    getCameras();
  }, []);

  // 🧩 QR Scanning Loop
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
        setScanResult(code.data);
        beep();
        console.log("✅ QR Detected:", code.data);
      }
    };

    if (stream) {
      scanInterval = window.setInterval(scan, 200); // scan every 200ms
    }

    return () => {
      if (scanInterval) clearInterval(scanInterval);
    };
  }, [stream]);

  return (
    <div className="flex flex-col items-center justify-center h-screen max-w-[600px] w-full border bg-red-300 m-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Attendance for Devfest 2025</h1>
      <p>Scan QR codes to record attendance</p>

      <div className="relative w-[550px] h-[400px] overflow-hidden border rounded-lg mx-auto">
        {/** biome-ignore lint/a11y/useMediaCaption: This is even worse, this ain't never ending */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="mt-4 flex flex-col space-y-2 w-full max-w-[550px]">
        <div className="flex items-center justify-between">
          <select
            className="border rounded-md px-3 py-2 w-2/3"
            value={selectedDeviceId}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
          >
            {devices.map((device, index) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${index + 1}`}
              </option>
            ))}
          </select>

          <Button onClick={startStream}>Start Camera</Button>
        </div>

        {scanResult && (
          <div className="mt-3 p-2 bg-white text-black rounded-md text-center">
            <strong>QR Result:</strong> {scanResult}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
