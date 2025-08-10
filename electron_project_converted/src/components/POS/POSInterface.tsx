import React, { useState } from 'react';
import { ShoppingCart, Scan, Settings } from 'lucide-react';
import { ProductGrid } from '../Products/ProductGrid';
import { CartSidebar } from '../Cart/CartSidebar';
import { CheckoutModal } from '../Checkout/CheckoutModal';
import { ReceiptModal } from '../Receipt/ReceiptModal';
import { BarcodeScanner } from '../BarcodeScanner/BarcodeScanner';
import { ProductManagement } from '../Products/ProductManagement';
import { Product, CartItem, Transaction, User, BarcodeResult } from '../../types';

interface POSInterfaceProps {
  user: User;
  products: Product[];
  cart: CartItem[];
  loading: boolean;
  onAddToCart: (product: Product, quantity: number) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
  onUpdateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
  onFindProductByBarcode: (barcode: string) => Promise<Product | null>;
}

export const POSInterface: React.FC<POSInterfaceProps> = ({
  user,
  products,
  cart,
  loading,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  getCartTotal,
  getItemCount,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onFindProductByBarcode,
}) => {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [showManagement, setShowManagement] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleTransactionComplete = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setCheckoutOpen(false);
    setReceiptOpen(true);
    onClearCart();
  };

  const handleBarcodeScanned = async (result: BarcodeResult) => {
    try {
      const product = await onFindProductByBarcode(result.decodedText);
      if (product) {
        onAddToCart(product, 1);
        // Show success message or highlight the product
      } else {
        alert(`Product with barcode ${result.decodedText} not found`);
      }
    } catch (error) {
      console.error('Error finding product:', error);
      alert('Error finding product. Please try again.');
    }
  };

  const itemCount = getItemCount();
  const total = getCartTotal();

  if (showManagement) {
    return (
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <button
              onClick={() => setShowManagement(false)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to POS
            </button>
          </div>
          <ProductManagement
            products={products}
            user={user}
            onAddProduct={onAddProduct}
            onUpdateProduct={onUpdateProduct}
            onDeleteProduct={onDeleteProduct}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Point of Sale</h2>
            <p className="text-gray-600 mt-1">Scan or select products to add to cart</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setScannerOpen(true)}
              className="bg-green-600 text-white px-4 py-3 rounded-xl flex items-center space-x-2 hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Scan className="h-5 w-5" />
              <span>Scan Barcode</span>
            </button>
            
            {user.role === 'manager' && (
              <button
                onClick={() => setShowManagement(true)}
                className="bg-purple-600 text-white px-4 py-3 rounded-xl flex items-center space-x-2 hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Settings className="h-5 w-5" />
                <span>Manage Products</span>
              </button>
            )}
            
            <button
              onClick={() => setCartOpen(true)}
              className="relative bg-blue-600 text-white px-4 py-3 rounded-xl flex items-center space-x-2 hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <ProductGrid
          products={products}
          onAddToCart={onAddToCart}
          loading={loading}
        />
      </div>

      <BarcodeScanner
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={handleBarcodeScanned}
      />

      <CartSidebar
        cart={cart}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveFromCart}
        onCheckout={handleCheckout}
        total={total}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        onComplete={handleTransactionComplete}
        cashierId={user.id}
      />

      {currentTransaction && (
        <ReceiptModal
          isOpen={receiptOpen}
          onClose={() => setReceiptOpen(false)}
          transaction={currentTransaction}
        />
      )}
    </div>
  );
};