export interface Product {
  id: string;
  name: string;
  category: 'Men' | 'Women' | 'Kids';
  subCategory: string;
  price: number;
  image: string;
  badge?: 'New Arrival' | 'Best Seller';
}

export interface SaleRecord {
  id: string;
  productName: string;
  price: number;
  category: string;
  time: string;
  soldBy: string;
}

export interface DailyStat {
  day: string;
  sales: number;
}

export interface CategoryStat {
  name: string;
  value: number;
  color: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
}

export interface InventoryEntry {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'purchase' | 'expense';
}

export const products: Product[] = [
  { id: '1', name: 'Royal Silk Sherwani', category: 'Men', subCategory: 'Sherwani', price: 15999, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop', badge: 'Best Seller' },
  { id: '2', name: 'Embroidered Kurta Set', category: 'Men', subCategory: 'Kurta', price: 3499, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop', badge: 'New Arrival' },
  { id: '3', name: 'Designer Banarasi Saree', category: 'Women', subCategory: 'Saree', price: 8999, image: 'https://images.unsplash.com/photo-1610030469668-bd4ec3c4e2e7?w=400&h=500&fit=crop', badge: 'Best Seller' },
  { id: '4', name: 'Anarkali Suit', category: 'Women', subCategory: 'Suit', price: 5499, image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=500&fit=crop' },
  { id: '5', name: 'Cotton Casual Shirt', category: 'Men', subCategory: 'Shirt', price: 1299, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop' },
  { id: '6', name: 'Festive Lehenga', category: 'Women', subCategory: 'Lehenga', price: 12999, image: 'https://images.unsplash.com/photo-1583391733981-8498408d36c9?w=400&h=500&fit=crop', badge: 'New Arrival' },
  { id: '7', name: 'Kids Party Wear', category: 'Kids', subCategory: 'Ethnic', price: 2499, image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&h=500&fit=crop' },
  { id: '8', name: 'Formal Trouser', category: 'Men', subCategory: 'Pant', price: 1899, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop' },
  { id: '9', name: 'Chikankari Kurti', category: 'Women', subCategory: 'Kurti', price: 2199, image: 'https://images.unsplash.com/photo-1594938291221-5e98b1c3d52c?w=400&h=500&fit=crop' },
  { id: '10', name: 'Kids Kurta Pajama', category: 'Kids', subCategory: 'Kurta', price: 1599, image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&h=500&fit=crop', badge: 'Best Seller' },
  { id: '11', name: 'Printed Palazzo Set', category: 'Women', subCategory: 'Suit', price: 3299, image: 'https://images.unsplash.com/photo-1583391733920-5c8c1c8a3f0b?w=400&h=500&fit=crop' },
  { id: '12', name: 'Nehru Jacket', category: 'Men', subCategory: 'Jacket', price: 2799, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop', badge: 'New Arrival' },
];

export const recentSales: SaleRecord[] = [
  { id: '1', productName: 'Royal Silk Sherwani', price: 15999, category: 'Men - Sherwani', time: '10 mins ago', soldBy: 'Rahul' },
  { id: '2', productName: 'Designer Banarasi Saree', price: 8999, category: 'Women - Saree', time: '25 mins ago', soldBy: 'Priya' },
  { id: '3', productName: 'Cotton Casual Shirt', price: 1299, category: 'Men - Shirt', time: '1 hour ago', soldBy: 'Rahul' },
  { id: '4', productName: 'Kids Party Wear', price: 2499, category: 'Kids - Ethnic', time: '2 hours ago', soldBy: 'Priya' },
  { id: '5', productName: 'Anarkali Suit', price: 5499, category: 'Women - Suit', time: '3 hours ago', soldBy: 'Rahul' },
];

export const weeklySales: DailyStat[] = [
  { day: 'Mon', sales: 8500 },
  { day: 'Tue', sales: 12200 },
  { day: 'Wed', sales: 9800 },
  { day: 'Thu', sales: 15400 },
  { day: 'Fri', sales: 18900 },
  { day: 'Sat', sales: 24500 },
  { day: 'Sun', sales: 12500 },
];

export const categorySales: CategoryStat[] = [
  { name: 'Men', value: 45, color: '#1E3A8A' },
  { name: 'Women', value: 40, color: '#D4AF37' },
  { name: 'Kids', value: 15, color: '#10B981' },
];

export const ownerNotes: Note[] = [
  { id: '1', content: 'Restock Banarasi Sarees before Diwali season', createdAt: '2 days ago' },
  { id: '2', content: 'Contact Party B for bulk kurta order', createdAt: '4 days ago' },
  { id: '3', content: 'Staff meeting on Saturday 5 PM', createdAt: '1 week ago' },
];

export const inventoryLog: InventoryEntry[] = [
  { id: '1', description: 'Bulk Purchase from Party A - Sherwanis', amount: 50000, date: '2024-01-15', type: 'purchase' },
  { id: '2', description: 'Saree Collection from Varanasi Supplier', amount: 35000, date: '2024-01-12', type: 'purchase' },
  { id: '3', description: 'Kids Wear from Delhi Market', amount: 15000, date: '2024-01-10', type: 'purchase' },
  { id: '4', description: 'Shop Maintenance', amount: 5000, date: '2024-01-08', type: 'expense' },
];

export const categories = {
  Men: ['Shirt', 'Pant', 'Kurta', 'Sherwani', 'Jacket', 'Suit'],
  Women: ['Saree', 'Suit', 'Kurti', 'Lehenga', 'Dress', 'Palazzo'],
  Kids: ['Kurta', 'Dress', 'Ethnic', 'Casual', 'Party Wear'],
};
