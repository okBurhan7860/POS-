import React from 'react';
import { Header } from './components/Layout/Header';
import { LoginForm } from './components/Auth/LoginForm';
import { POSInterface } from './components/POS/POSInterface';
import { useAuth } from './hooks/useAuth';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';

function App() {
  const { user, isAuthenticated, loading: authLoading, login, logout } = useAuth();
  const { 
    products, 
    loading: productsLoading, 
    updateStock, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    findProductByBarcode 
  } = useProducts();
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
  } = useCart();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <LoginForm onLogin={login} loading={authLoading} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <Header
        user={user}
        onLogout={logout}
        cartItemCount={getItemCount()}
      />
      
      <POSInterface
        user={user}
        products={products}
        cart={cart}
        loading={productsLoading}
        onAddToCart={addToCart}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        onClearCart={clearCart}
        getCartTotal={getCartTotal}
        getItemCount={getItemCount}
        onAddProduct={addProduct}
        onUpdateProduct={updateProduct}
        onDeleteProduct={deleteProduct}
        onFindProductByBarcode={findProductByBarcode}
      />
    </div>
  );
}

export default App;