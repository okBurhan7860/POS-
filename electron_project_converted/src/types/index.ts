export interface User {
  id: string;
  username: string;
  role: 'cashier' | 'manager';
  name: string;
  email: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  barcode: string;
  stock: number;
  image: string;
  description: string;
  supplier?: string;
  costPrice?: number;
  minStock?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'digital';
  cashierId: string;
  timestamp: string;
  customerPaid: number;
  change: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface AppState {
  auth: AuthState;
  cart: CartItem[];
  products: Product[];
  transactions: Transaction[];
}

export interface BarcodeResult {
  decodedText: string;
  result: any;
}