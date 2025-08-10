import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import { Transaction } from '../../types';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const receiptContent = generateReceiptText(transaction);
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${transaction.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Receipt</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Print Receipt"
            >
              <Printer className="h-5 w-5 text-gray-500" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Download Receipt"
            >
              <Download className="h-5 w-5 text-gray-500" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 font-mono text-sm">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold">SuperMarket POS</h3>
            <p className="text-gray-600">123 Main Street</p>
            <p className="text-gray-600">Anytown, ST 12345</p>
            <p className="text-gray-600">Phone: (555) 123-4567</p>
          </div>

          <div className="border-b border-gray-300 pb-4 mb-4">
            <p><strong>Transaction ID:</strong> {transaction.id}</p>
            <p><strong>Date:</strong> {new Date(transaction.timestamp).toLocaleString()}</p>
            <p><strong>Cashier:</strong> {transaction.cashierId}</p>
          </div>

          <div className="border-b border-gray-300 pb-4 mb-4">
            <div className="flex justify-between font-bold mb-2">
              <span>Item</span>
              <span>Price</span>
            </div>
            {transaction.items.map((item, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between">
                  <span>{item.product.name}</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
                <div className="text-gray-600 text-xs">
                  {item.quantity} x ${item.product.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${transaction.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${transaction.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>${transaction.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-4 mt-4">
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="capitalize">{transaction.paymentMethod}</span>
            </div>
            {transaction.paymentMethod === 'cash' && (
              <>
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span>${transaction.customerPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Change:</span>
                  <span>${transaction.change.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          <div className="text-center mt-6 pt-4 border-t border-gray-300">
            <p className="text-gray-600">Thank you for shopping with us!</p>
            <p className="text-gray-600">Have a great day!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const generateReceiptText = (transaction: Transaction): string => {
  const timestamp = new Date(transaction.timestamp).toLocaleString();
  
  let receipt = `
SuperMarket POS
123 Main Street
Anytown, ST 12345
Phone: (555) 123-4567

================================

Transaction ID: ${transaction.id}
Date: ${timestamp}
Cashier: ${transaction.cashierId}

================================

`;

  transaction.items.forEach(item => {
    receipt += `${item.product.name}\n`;
    receipt += `${item.quantity} x $${item.product.price.toFixed(2)} = $${(item.product.price * item.quantity).toFixed(2)}\n\n`;
  });

  receipt += `================================

Subtotal: $${transaction.subtotal.toFixed(2)}
Tax: $${transaction.tax.toFixed(2)}
Total: $${transaction.total.toFixed(2)}

Payment Method: ${transaction.paymentMethod}
`;

  if (transaction.paymentMethod === 'cash') {
    receipt += `Amount Paid: $${transaction.customerPaid.toFixed(2)}\n`;
    receipt += `Change: $${transaction.change.toFixed(2)}\n`;
  }

  receipt += `
================================

Thank you for shopping with us!
Have a great day!
`;

  return receipt;
};