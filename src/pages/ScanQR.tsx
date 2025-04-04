
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

// Note: In a real application, you would use react-qr-reader
// This is a simplified version for demo purposes
const ScanQR = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  // Simulated QR scanning function
  const startScanning = () => {
    setScanning(true);
    
    // In a real app, this would use the camera and react-qr-reader
    // For this demo, we'll simulate a scan after 3 seconds
    setTimeout(() => {
      const simulatedResult = 'https://example.com/scanned-url';
      setResult(simulatedResult);
      setScanning(false);
      
      toast({
        title: 'QR Code Scanned',
        description: 'Successfully scanned a QR code',
      });
    }, 3000);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Scan QR Code</h1>
      
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Scan a QR Code</CardTitle>
            <CardDescription>Use your device's camera to scan a QR code</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div 
                className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg border"
              >
                {scanning ? (
                  <div className="text-center">
                    <div className="animate-pulse mb-2">Scanning...</div>
                    <div className="text-sm text-gray-500">Please point your camera at a QR code</div>
                  </div>
                ) : result ? (
                  <div className="text-center p-4">
                    <p className="font-bold mb-2">Scanned Result:</p>
                    <p className="break-all">{result}</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    Camera preview will appear here
                  </div>
                )}
              </div>
              
              <Button 
                onClick={startScanning}
                disabled={scanning}
                className="w-full"
              >
                {scanning ? 'Scanning...' : 'Start Scanning'}
              </Button>
              
              {result && (
                <div className="w-full pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Actions</h3>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        navigator.clipboard.writeText(result);
                        toast({
                          title: 'Copied to Clipboard',
                          description: 'The QR code content has been copied to your clipboard.',
                        });
                      }}
                    >
                      Copy to Clipboard
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        // If it's a URL, open it
                        if (result.startsWith('http')) {
                          window.open(result, '_blank');
                        }
                      }}
                    >
                      Open URL
                    </Button>
                  </div>
                </div>
              )}
              
              <p className="text-xs text-gray-500 text-center mt-4">
                Note: In the actual application, this would use your device's camera to scan QR codes in real-time.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScanQR;
