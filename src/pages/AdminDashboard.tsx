
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Download
} from 'lucide-react';
import { generateProductsPDF, generateOrdersPDF, generateClientsPDF, generateCategoriesPDF, generateBundlesPDF } from '@/utils/pdfGenerator';

interface Product {
  id: string;
  name: string;
  name_fr?: string;
  product_code?: string;
  price?: number;
  original_price?: number;
  categories?: { id: string; name_fr: string; name: string };
  in_stock?: boolean;
  badge?: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  name_fr?: string;
  name_ar?: string;
  description_fr?: string;
  icon?: string;
}

interface Bundle {
  id: string;
  name: string;
  name_fr?: string;
  bundle_price?: string;
  original_price?: string;
  savings?: string;
  procedures?: string;
  popular?: boolean;
  badge?: string;
  items?: string[];
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  amount_paid: number;
  status: string;
  payment_status: string;
  created_at: string;
  preferred_delivery_date?: string;
  order_items?: any[];
  order_bundles?: any[];
  profiles?: {
    full_name: string;
    dental_office_name: string;
  };
}

interface Client {
  id: string;
  full_name: string;
  dental_office_name: string;
  email: string;
  phone: string;
  wilaya: string;
  address: string;
  created_at: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, bundlesRes, ordersRes, clientsRes] = await Promise.all([
        supabase.from('products').select('*, categories(*)'),
        supabase.from('categories').select('*'),
        supabase.from('bundles').select('*'),
        supabase.from('orders').select('*, profiles(full_name, dental_office_name)'),
        supabase.from('profiles').select('*')
      ]);

      if (productsRes.error) throw productsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      if (bundlesRes.error) throw bundlesRes.error;
      if (ordersRes.error) throw ordersRes.error;
      if (clientsRes.error) throw clientsRes.error;

      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
      setBundles(bundlesRes.data || []);
      setOrders(ordersRes.data || []);
      setClients(clientsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Download functions
  const downloadProductsPDF = () => {
    try {
      const doc = generateProductsPDF(products);
      doc.save('catalogue-produits.pdf');
      toast.success('Catalogue des produits téléchargé');
    } catch (error) {
      console.error('Error generating products PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    }
  };

  const downloadOrdersPDF = () => {
    try {
      const doc = generateOrdersPDF(orders);
      doc.save('rapport-commandes.pdf');
      toast.success('Rapport des commandes téléchargé');
    } catch (error) {
      console.error('Error generating orders PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    }
  };

  const downloadClientsPDF = () => {
    try {
      const doc = generateClientsPDF(clients);
      doc.save('liste-clients.pdf');
      toast.success('Liste des clients téléchargée');
    } catch (error) {
      console.error('Error generating clients PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    }
  };

  const downloadCategoriesPDF = () => {
    try {
      const doc = generateCategoriesPDF(categories);
      doc.save('catalogue-categories.pdf');
      toast.success('Catalogue des catégories téléchargé');
    } catch (error) {
      console.error('Error generating categories PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    }
  };

  const downloadBundlesPDF = () => {
    try {
      const doc = generateBundlesPDF(bundles, products);
      doc.save('catalogue-kits.pdf');
      toast.success('Catalogue des kits téléchargé');
    } catch (error) {
      console.error('Error generating bundles PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    }
  };

  // Calculate total revenue and payment percentage
  const completedOrders = orders.filter(order => order.status === 'delivered' && order.payment_status === 'paid');
  const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const totalPaid = completedOrders.reduce((sum, order) => sum + (order.amount_paid || 0), 0);
  const paymentPercentage = totalRevenue > 0 ? (totalPaid / totalRevenue) * 100 : 0;

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tableau de bord Admin</h1>
          <div className="flex gap-2">
            <button 
              onClick={fetchData}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              {loading ? 'Actualisation...' : 'Actualiser'}
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} DZD</div>
              <Progress value={paymentPercentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">{paymentPercentage.toFixed(1)}% collecté</p>
            </CardContent>
          </Card>
        </div>

        {/* Download Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Products Download */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Produits ({products.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Téléchargez la liste complète des produits avec leurs détails, prix et catégories.
              </p>
              <Button onClick={downloadProductsPDF} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Télécharger PDF
              </Button>
            </CardContent>
          </Card>

          {/* Categories Download */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Catégories ({categories.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Téléchargez la liste des catégories avec leurs descriptions et icônes.
              </p>
              <Button onClick={downloadCategoriesPDF} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Télécharger PDF
              </Button>
            </CardContent>
          </Card>

          {/* Bundles Download */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Kits ({bundles.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Téléchargez la liste des kits avec leurs prix et économies.
              </p>
              <Button onClick={downloadBundlesPDF} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Télécharger PDF
              </Button>
            </CardContent>
          </Card>

          {/* Orders Download */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Commandes ({orders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Téléchargez le rapport complet des commandes avec les statuts et montants.
              </p>
              <Button onClick={downloadOrdersPDF} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Télécharger PDF
              </Button>
            </CardContent>
          </Card>

          {/* Clients Download */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Clients ({clients.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Téléchargez la liste complète des clients avec leurs informations de contact.
              </p>
              <Button onClick={downloadClientsPDF} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Télécharger PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
