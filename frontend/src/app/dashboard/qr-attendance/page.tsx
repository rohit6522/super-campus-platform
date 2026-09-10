'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { scanQrCode } from '@/lib/api/qr-attendance';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import axios from 'axios';

export default function QrAttendancePage() {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startScanning = async () => {
    setError(null);
    setResult(null);
    setIsScanning(true);

    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          await scanner.stop();
          setIsScanning(false);
          try {
            const response = await scanQrCode(decodedText);
            setResult(response.message);
          } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data?.message) {
              setError(err.response.data.message);
            } else {
              setError('Failed to check in.');
            }
          }
        },
        undefined,
      );
    } catch {
      setError('Could not access camera. Please grant camera permission.');
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      scannerRef.current?.stop().catch(() => {});
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">QR Check-in</h1>
        <p className="text-muted-foreground">Scan the QR code shown by your faculty to mark attendance</p>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div id="qr-reader" className="mx-auto w-full max-w-sm" />

          {!isScanning && !result && (
            <Button onClick={startScanning} className="w-full">
              Start Scanning
            </Button>
          )}

          {result && <p className="text-center text-sm font-medium text-green-600">{result}</p>}
          {error && <p className="text-center text-sm text-destructive">{error}</p>}

          {(result || error) && (
            <Button variant="outline" onClick={startScanning} className="w-full">
              Scan Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}