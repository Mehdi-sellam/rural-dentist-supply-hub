
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Search, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  name_fr: string;
  price: number;
  product_code: string;
}

interface ProductSelectorProps {
  selectedProducts: string[];
  onProductsChange: (products: string[]) => void;
}

const ProductSelector = ({ selectedProducts, onProductsChange }: ProductSelectorProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.product_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, name_fr, price, product_code')
        .eq('in_stock', true)
        .order('name_fr');

      if (error) throw error;
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductToggle = (productId: string) => {
    const isSelected = selectedProducts.includes(productId);
    if (isSelected) {
      onProductsChange(selectedProducts.filter(id => id !== productId));
    } else {
      onProductsChange([...selectedProducts, productId]);
    }
  };

  const getSelectedProductNames = () => {
    return products
      .filter(product => selectedProducts.includes(product.id))
      .map(product => product.name_fr);
  };

  if (loading) {
    return <div>Chargement des produits...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">Produits sélectionnés ({selectedProducts.length})</h3>
        {selectedProducts.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {getSelectedProductNames().map((name, index) => (
              <span key={index} className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm">
                {name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-4">Aucun produit sélectionné</p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sélectionner des produits</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom ou code produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredProducts.map((product) => (
              <div key={product.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded">
                <Checkbox
                  id={product.id}
                  checked={selectedProducts.includes(product.id)}
                  onCheckedChange={() => handleProductToggle(product.id)}
                />
                <label htmlFor={product.id} className="flex-1 cursor-pointer">
                  <div className="font-medium">{product.name_fr}</div>
                  <div className="text-sm text-muted-foreground">
                    Code: {product.product_code} - Prix: {product.price.toLocaleString()} DZD
                  </div>
                </label>
              </div>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Aucun produit trouvé
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductSelector;
