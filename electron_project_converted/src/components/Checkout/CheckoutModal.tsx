import React, { useState } from 'react';
import { X, CreditCard, DollarSign, Smartphone } from 'lucide-react';
import { CartItem, Transaction } from '../../types';
import { addTransaction } from '../../services/firebaseService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onComplete: (transaction: Transaction) => void;
  cashierId: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  onComplete,
  cashierId,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'digital'>('cash');
  const [customerPaid, setCustomerPaid] = useState<string>('');
  const [processing, setProcessing] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const change = paymentMethod === 'cash' ? Math.max(0, parseFloat(customerPaid) - total) : 0;

  const handleComplete = async () => {
    if (paymentMethod === 'cash' && parseFloat(customerPaid) < total) {
      return;
    }

    setProcessing(true);

    try {
      const transactionData = {
        items: cart,
        subtotal,
        tax,
        total,
        paymentMethod,
        cashierId,
        customerPaid: paymentMethod === 'cash' ? parseFloat(customerPaid) : total,
        change,
      };

      const transactionId = await addTransaction(transactionData);
      
      const transaction: Transaction = {
        id: transactionId,
        ...transactionData,
        timestamp: new Date().toISOString(),
      };

      onComplete(transaction);
      setCustomerPaid('');
    } catch (error) {
      console.error('Error completing transaction:', error);
      alert('Error completing transaction. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Checkout</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Order Summary */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Payment Method</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`flex flex-col items-center p-3 border rounded-lg transition-colors ${
                  paymentMethod === 'cash'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <DollarSign className="h-6 w-6 mb-1" />
                <span className="text-sm">Cash</span>
              </button>
              
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex flex-col items-center p-3 border rounded-lg transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <CreditCard className="h-6 w-6 mb-1" />
                <span className="text-sm">Card</span>
              </button>
              
              <button
                onClick={() => setPaymentMethod('digital')}
                className={`flex flex-col items-center p-3 border rounded-lg transition-colors ${
                  paymentMethod === 'digital'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Smartphone className="h-6 w-6 mb-1" />
                <span className="text-sm">Digital</span>
              </button>
            </div>
          </div>

          {/* Cash Payment Input */}
          {paymentMethod === 'cash' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount Received
              </label>
              <input
                type="number"
                step="0.01"
                min={total}
                value={customerPaid}
                onChange={(e) => setCustomerPaid(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={`$${total.toFixed(2)}`}
              />
              {parseFloat(customerPaid) > total && (
                <p className="mt-2 text-sm text-green-600">
                  Change: ${change.toFixed(2)}
                </p>
              )}
              {customerPaid && parseFloat(customerPaid) < total && (
                <p className="mt-2 text-sm text-red-600">
                  Insufficient amount
                </p>
              )}
            </div>
          )}

          {/* Complete Button */}
          <button
            onClick={handleComplete}
            disabled={
              processing ||
              (paymentMethod === 'cash' && 
                (!customerPaid || parseFloat(customerPaid) < total))
            }
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {processing ? 'Processing...' : 'Complete Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
};