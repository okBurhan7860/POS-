import { useState, useEffect } from 'react';
import { Product } from '../types';
import { 
  getProducts, 
  addProduct as addProductToFirestore, 
  updateProduct as updateProductInFirestore, 
  deleteProduct as deleteProductFromFirestore,
  findProductByBarcode as findProductByBarcodeInFirestore
} from '../services/firebaseService';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateStock = (productId: string, newStock: number) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, stock: newStock }
          : product
      )
    );
  };

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const productId = await addProductToFirestore(product);
      const newProduct: Product = {
        ...product,
        id: productId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      await updateProductInFirestore(productId, updates);
      setProducts(prev =>
        prev.map(product =>
          product.id === productId
            ? { ...product, ...updates, updatedAt: new Date().toISOString() }
            : product
        )
      );
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await deleteProductFromFirestore(productId);
      setProducts(prev => prev.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const findProductByBarcode = async (barcode: string) => {
    try {
      const product = await findProductByBarcodeInFirestore(barcode);
      return product;
    } catch (error) {
      console.error('Error finding product by barcode:', error);
      return null;
    }
  };

  return {
    products,
    loading,
    updateStock,
    addProduct,
    updateProduct,
    deleteProduct,
    findProductByBarcode,
    refetch: fetchProducts,
  };
};