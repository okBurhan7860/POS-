import React from 'react';
import { LogOut, ShoppingCart, User, Store } from 'lucide-react';
import { User as UserType } from '../../types';

interface HeaderProps {
  user: UserType;
  onLogout: () => void;
  cartItemCount: number;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, cartItemCount }) => {
  return (
    <header className="bg-white shadow-lg border-b border-gray-200 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl shadow-lg">
                <Store className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  SuperMarket POS
                </h1>
                <p className="text-sm text-gray-500">Professional Point of Sale System</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {cartItemCount > 0 && (
              <div className="hidden sm:flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-xl">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  {cartItemCount} item{cartItemCount !== 1 ? 's' : ''} in cart
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-xl">
              <User className="h-5 w-5 text-gray-500" />
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-500 capitalize">{user.role}</div>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};