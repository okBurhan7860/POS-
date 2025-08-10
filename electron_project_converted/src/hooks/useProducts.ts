import { useState, useEffect } from 'react';
import { Product } from '../types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock product data - in production, this would fetch from an API
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Organic Bananas',
        price: 2.99,
        category: 'Fruits',
        barcode: '1234567890123',
        stock: 50,
        image: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Fresh organic bananas, perfect for snacking',
        supplier: 'Fresh Farms Co.',
        costPrice: 1.50,
        minStock: 10,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Whole Milk',
        price: 3.49,
        category: 'Dairy',
        barcode: '2345678901234',
        stock: 25,
        image: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: '1 gallon of fresh whole milk',
        supplier: 'Dairy Fresh Ltd.',
        costPrice: 2.20,
        minStock: 5,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Sourdough Bread',
        price: 4.99,
        category: 'Bakery',
        barcode: '3456789012345',
        stock: 15,
        image: 'https://images.pexels.com/photos/209196/pexels-photo-209196.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Artisan sourdough bread, freshly baked',
        supplier: 'Artisan Bakery',
        costPrice: 2.50,
        minStock: 3,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'Ground Beef',
        price: 8.99,
        category: 'Meat',
        barcode: '4567890123456',
        stock: 20,
        image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Fresh ground beef, 80/20 lean',
        supplier: 'Premium Meats Inc.',
        costPrice: 5.50,
        minStock: 5,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '5',
        name: 'Roma Tomatoes',
        price: 1.99,
        category: 'Vegetables',
        barcode: '5678901234567',
        stock: 40,
        image: 'https://images.pexels.com/photos/257840/pexels-photo-257840.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Fresh Roma tomatoes, perfect for cooking',
        supplier: 'Garden Fresh Produce',
        costPrice: 0.99,
        minStock: 10,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '6',
        name: 'Greek Yogurt',
        price: 5.99,
        category: 'Dairy',
        barcode: '6789012345678',
        stock: 30,
        image: 'https://images.pexels.com/photos/406152/pexels-photo-406152.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Creamy Greek yogurt, high in protein',
        supplier: 'Dairy Fresh Ltd.',
        costPrice: 3.50,
        minStock: 8,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '7',
        name: 'Olive Oil',
        price: 12.99,
        category: 'Pantry',
        barcode: '7890123456789',
        stock: 18,
        image: 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=300',
        description: 'Extra virgin olive oil, cold pressed',
        supplier: 'Mediterranean Imports',
        costPrice: 8.00,
        minStock: 5,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '8',
        name: 'Chicken Breast',
        price: 9.99,
        category: 'Meat',
        barcode: '8901234567890',
        stock: 12,
        image: 'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: 'Boneless skinless chicken breast',
        supplier: 'Premium Meats Inc.',
        costPrice: 6.50,
        minStock: 3,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 500);
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

  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: `product_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, ...updates, updatedAt: new Date().toISOString() }
          : product
      )
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
  };

  const findProductByBarcode = (barcode: string) => {
    return products.find(product => product.barcode === barcode);
  };

  return {
    products,
    loading,
    updateStock,
    addProduct,
    updateProduct,
    deleteProduct,
    findProductByBarcode,
  };
};