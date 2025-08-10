import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  writeBatch,
  getDoc
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';
import { db, auth } from '../config/firebase';
import { Product, User, Transaction } from '../types';

// Authentication Services
export const signUp = async (email: string, password: string, userData: Omit<User, 'id'>) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Create user document in Firestore
  await addDoc(collection(db, 'users'), {
    ...userData,
    uid: user.uid,
    email: user.email,
    createdAt: new Date().toISOString()
  });
  
  return user;
};

export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signOut = async () => {
  await firebaseSignOut(auth);
};

export const getUserData = async (uid: string): Promise<User | null> => {
  const q = query(collection(db, 'users'), where('uid', '==', uid));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
  }
  
  return null;
};

// Product Services
export const getProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, 'products'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[];
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'products'), {
    ...product,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return docRef.id;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
  const productRef = doc(db, 'products', id);
  await updateDoc(productRef, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
};

export const deleteProduct = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'products', id));
};

export const findProductByBarcode = async (barcode: string): Promise<Product | null> => {
  const q = query(collection(db, 'products'), where('barcode', '==', barcode));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Product;
  }
  
  return null;
};

// Transaction Services
export const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<string> => {
  const batch = writeBatch(db);
  
  // Add transaction
  const transactionRef = doc(collection(db, 'transactions'));
  batch.set(transactionRef, {
    ...transaction,
    timestamp: new Date().toISOString()
  });
  
  // Update product stock
  for (const item of transaction.items) {
    const productRef = doc(db, 'products', item.product.id);
    const productDoc = await getDoc(productRef);
    
    if (productDoc.exists()) {
      const currentStock = productDoc.data().stock;
      batch.update(productRef, {
        stock: currentStock - item.quantity,
        updatedAt: new Date().toISOString()
      });
    }
  }
  
  await batch.commit();
  return transactionRef.id;
};

export const getTransactions = async (): Promise<Transaction[]> => {
  const q = query(collection(db, 'transactions'), orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Transaction[];
};

// Initialize demo data
export const initializeDemoData = async () => {
  try {
    // Check if products already exist
    const productsSnapshot = await getDocs(collection(db, 'products'));
    if (!productsSnapshot.empty) {
      return; // Data already exists
    }

    // Create demo products
    const demoProducts = [
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
    ];

    // Add products to Firestore
    const batch = writeBatch(db);
    demoProducts.forEach(product => {
      const productRef = doc(collection(db, 'products'));
      batch.set(productRef, {
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });

    await batch.commit();
    console.log('Demo data initialized successfully');
  } catch (error) {
    console.error('Error initializing demo data:', error);
  }
};