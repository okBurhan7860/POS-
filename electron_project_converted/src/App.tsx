import React from 'react';
import { Header } from './components/Layout/Header';
import { LoginForm } from './components/Auth/LoginForm';
import { POSInterface } from './components/POS/POSInterface';
import { useAuth } from './hooks/useAuth';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';

function App() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { 
    products, 
    loading, 
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

  if (!isAuthenticated || !user) {
    return <LoginForm onLogin={login} />;
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
        loading={loading}
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