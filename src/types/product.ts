
export interface Product {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  description: string;
  descriptionAr: string;
  descriptionFr: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  badge?: string;
  specifications?: string[];
  productId: string;
  productCode: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Bundle {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  description: string;
  items: string[];
  originalPrice: string;
  bundlePrice: string;
  savings: string;
  procedures: string;
  popular: boolean;
}
