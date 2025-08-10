import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Camera, Search } from 'lucide-react';
import { BarcodeResult } from '../../types';

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (result: BarcodeResult) => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  isOpen,
  onClose,
  onScan,
}) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [manualBarcode, setManualBarcode] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (isOpen && !scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        'barcode-scanner',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false
      );

      scanner.render(
        (decodedText, result) => {
          onScan({ decodedText, result });
          scanner.clear();
          scannerRef.current = null;
          onClose();
        },
        (error) => {
          // Handle scan error silently
        }
      );

      scannerRef.current = scanner;
      setIsScanning(true);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
        setIsScanning(false);
      }
    };
  }, [isOpen, onScan, onClose]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onScan({ decodedText: manualBarcode.trim(), result: null });
      setManualBarcode('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center space-x-3">
            <Camera className="h-6 w-6 text-white" />
            <h2 className="text-xl font-semibold text-white">Barcode Scanner</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Camera Scanner */}
          <div className="text-center">
            <div
              id="barcode-scanner"
              className="mx-auto rounded-lg overflow-hidden border-2 border-gray-200"
            />
            {isScanning && (
              <p className="mt-3 text-sm text-gray-600">
                Position the barcode within the scanning area
              </p>
            )}
          </div>

          {/* Manual Entry */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Search className="h-5 w-5 mr-2 text-gray-500" />
              Manual Entry
            </h3>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <input
                type="text"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                placeholder="Enter barcode manually"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Search Product
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};