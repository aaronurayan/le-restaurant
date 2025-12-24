export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Phase 4.4 - Inventory Management
  stockQuantity?: number;
  lowStockThreshold?: number;
}