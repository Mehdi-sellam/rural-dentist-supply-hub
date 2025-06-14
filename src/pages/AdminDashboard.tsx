import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  Plus, 
  Edit, 
  Trash2, 
  Download,
  Eye,
  X,
  Check
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
  bundle_price?: number;
  original_price?: number;
  savings?: number;
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

  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [newCategory, setNewCategory] = useState<Partial<Category>>({});
  const [newBundle, setNewBundle] = useState<Partial<Bundle>>({ items: [] });

  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editBundleId, setEditBundleId] = useState<string | null>(null);

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
        supabase.from('orders').select('*'),
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

  // Add Product
  const addProduct = async () => {
    if (!newProduct.name) {
      toast.error('Le nom du produit est requis');
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase.from('products').insert([newProduct]);
      if (error) throw error;
      toast.success('Produit ajouté avec succès');
      setNewProduct({});
      fetchData();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Erreur lors de l\'ajout du produit');
    } finally {
      setLoading(false);
    }
  };

  // Update Product
  const updateProduct = async () => {
    if (!editProductId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase.from('products').update(newProduct).eq('id', editProductId);
      if (error) throw error;
      toast.success('Produit mis à jour avec succès');
      setEditProductId(null);
      setNewProduct({});
      fetchData();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Erreur lors de la mise à jour du produit');
    } finally {
      setLoading(false);
    }
  };

  // Delete Product
  const deleteProduct = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    try {
      setLoading(true);
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast.success('Produit supprimé avec succès');
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Erreur lors de la suppression du produit');
    } finally {
      setLoading(false);
    }
  };

  // Add Category
  const addCategory = async () => {
    if (!newCategory.name) {
      toast.error('Le nom de la catégorie est requis');
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase.from('categories').insert([newCategory]);
      if (error) throw error;
      toast.success('Catégorie ajoutée avec succès');
      setNewCategory({});
      fetchData();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Erreur lors de l\'ajout de la catégorie');
    } finally {
      setLoading(false);
    }
  };

  // Update Category
  const updateCategory = async () => {
    if (!editCategoryId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase.from('categories').update(newCategory).eq('id', editCategoryId);
      if (error) throw error;
      toast.success('Catégorie mise à jour avec succès');
      setEditCategoryId(null);
      setNewCategory({});
      fetchData();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Erreur lors de la mise à jour de la catégorie');
    } finally {
      setLoading(false);
    }
  };

  // Delete Category
  const deleteCategory = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;
    try {
      setLoading(true);
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      toast.success('Catégorie supprimée avec succès');
      fetchData();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Erreur lors de la suppression de la catégorie');
    } finally {
      setLoading(false);
    }
  };

  // Add Bundle
  const addBundle = async () => {
    if (!newBundle.name) {
      toast.error('Le nom du kit est requis');
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase.from('bundles').insert([newBundle]);
      if (error) throw error;
      toast.success('Kit ajouté avec succès');
      setNewBundle({ items: [] });
      fetchData();
    } catch (error) {
      console.error('Error adding bundle:', error);
      toast.error('Erreur lors de l\'ajout du kit');
    } finally {
      setLoading(false);
    }
  };

  // Update Bundle
  const updateBundle = async () => {
    if (!editBundleId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase.from('bundles').update(newBundle).eq('id', editBundleId);
      if (error) throw error;
      toast.success('Kit mis à jour avec succès');
      setEditBundleId(null);
      setNewBundle({ items: [] });
      fetchData();
    } catch (error) {
      console.error('Error updating bundle:', error);
      toast.error('Erreur lors de la mise à jour du kit');
    } finally {
      setLoading(false);
    }
  };

  // Delete Bundle
  const deleteBundle = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce kit ?')) return;
    try {
      setLoading(true);
      const { error } = await supabase.from('bundles').delete().eq('id', id);
      if (error) throw error;
      toast.success('Kit supprimé avec succès');
      fetchData();
    } catch (error) {
      console.error('Error deleting bundle:', error);
      toast.error('Erreur lors de la suppression du kit');
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

  // Helper functions for status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline">En attente</Badge>;
      case 'confirmed': return <Badge className="bg-blue-500">Confirmée</Badge>;
      case 'shipped': return <Badge className="bg-orange-500">Expédiée</Badge>;
      case 'delivered': return <Badge className="bg-green-500">Livrée</Badge>;
      case 'cancelled': return <Badge variant="destructive">Annulée</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline">En attente</Badge>;
      case 'partial': return <Badge className="bg-orange-500">Partiel</Badge>;
      case 'paid': return <Badge className="bg-green-500">Payé</Badge>;
      case 'refunded': return <Badge variant="destructive">Remboursé</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

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

        {/* Products Management */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Gestion des Produits ({products.length})</CardTitle>
              <div className="flex gap-2">
                <Button onClick={downloadProductsPDF} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger PDF
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter Produit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Ajouter un nouveau produit</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Nom (FR)</Label>
                        <Input
                          value={newProduct.name_fr || ''}
                          onChange={e => setNewProduct({ ...newProduct, name_fr: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Nom (EN)</Label>
                        <Input
                          value={newProduct.name || ''}
                          onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Code Produit</Label>
                        <Input
                          value={newProduct.product_code || ''}
                          onChange={e => setNewProduct({ ...newProduct, product_code: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Prix</Label>
                        <Input
                          type="number"
                          value={newProduct.price || ''}
                          onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>Prix Original</Label>
                        <Input
                          type="number"
                          value={newProduct.original_price || ''}
                          onChange={e => setNewProduct({ ...newProduct, original_price: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>Catégorie</Label>
                        <Select
                          onValueChange={value => setNewProduct({ ...newProduct, categories: categories.find(c => c.id === value) })}
                          value={newProduct.categories?.id || ''}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name_fr || category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>En stock</Label>
                        <Select
                          onValueChange={value => setNewProduct({ ...newProduct, in_stock: value === 'true' })}
                          value={newProduct.in_stock ? 'true' : 'false'}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Oui</SelectItem>
                            <SelectItem value="false">Non</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Badge</Label>
                        <Input
                          value={newProduct.badge || ''}
                          onChange={e => setNewProduct({ ...newProduct, badge: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={newProduct.description || ''}
                          onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button onClick={() => {
                          if (editProductId) {
                            updateProduct();
                          } else {
                            addProduct();
                          }
                        }}>
                          {editProductId ? 'Mettre à jour' : 'Ajouter'}
                        </Button>
                        <Button variant="outline" onClick={() => {
                          setEditProductId(null);
                          setNewProduct({});
                        }}>
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Nom (FR)</th>
                  <th className="border p-2">Nom (EN)</th>
                  <th className="border p-2">Code</th>
                  <th className="border p-2">Prix</th>
                  <th className="border p-2">Catégorie</th>
                  <th className="border p-2">Stock</th>
                  <th className="border p-2">Badge</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td className="border p-2">{product.name_fr || product.name}</td>
                    <td className="border p-2">{product.name}</td>
                    <td className="border p-2">{product.product_code}</td>
                    <td className="border p-2">{product.price?.toLocaleString()} DZD</td>
                    <td className="border p-2">{product.categories?.name_fr || product.categories?.name}</td>
                    <td className="border p-2">{product.in_stock ? 'Oui' : 'Non'}</td>
                    <td className="border p-2">{product.badge}</td>
                    <td className="border p-2 space-x-2">
                      <Button size="sm" variant="outline" onClick={() => {
                        setEditProductId(product.id);
                        setNewProduct(product);
                      }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteProduct(product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Categories Management */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Gestion des Catégories ({categories.length})</CardTitle>
              <div className="flex gap-2">
                <Button onClick={downloadCategoriesPDF} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger PDF
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter Catégorie
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter une nouvelle catégorie</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Nom (FR)</Label>
                        <Input
                          value={newCategory.name_fr || ''}
                          onChange={e => setNewCategory({ ...newCategory, name_fr: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Nom (EN)</Label>
                        <Input
                          value={newCategory.name || ''}
                          onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Nom (AR)</Label>
                        <Input
                          value={newCategory.name_ar || ''}
                          onChange={e => setNewCategory({ ...newCategory, name_ar: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Description (FR)</Label>
                        <Textarea
                          value={newCategory.description_fr || ''}
                          onChange={e => setNewCategory({ ...newCategory, description_fr: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Icône</Label>
                        <Input
                          value={newCategory.icon || ''}
                          onChange={e => setNewCategory({ ...newCategory, icon: e.target.value })}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button onClick={() => {
                          if (editCategoryId) {
                            updateCategory();
                          } else {
                            addCategory();
                          }
                        }}>
                          {editCategoryId ? 'Mettre à jour' : 'Ajouter'}
                        </Button>
                        <Button variant="outline" onClick={() => {
                          setEditCategoryId(null);
                          setNewCategory({});
                        }}>
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Nom (FR)</th>
                  <th className="border p-2">Nom (EN)</th>
                  <th className="border p-2">Nom (AR)</th>
                  <th className="border p-2">Description (FR)</th>
                  <th className="border p-2">Icône</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category.id}>
                    <td className="border p-2">{category.name_fr || category.name}</td>
                    <td className="border p-2">{category.name}</td>
                    <td className="border p-2">{category.name_ar}</td>
                    <td className="border p-2">{category.description_fr}</td>
                    <td className="border p-2">{category.icon}</td>
                    <td className="border p-2 space-x-2">
                      <Button size="sm" variant="outline" onClick={() => {
                        setEditCategoryId(category.id);
                        setNewCategory(category);
                      }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteCategory(category.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Bundles Management */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Gestion des Kits ({bundles.length})</CardTitle>
              <div className="flex gap-2">
                <Button onClick={downloadBundlesPDF} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger PDF
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter Kit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Ajouter un nouveau kit</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Nom (FR)</Label>
                        <Input
                          value={newBundle.name_fr || ''}
                          onChange={e => setNewBundle({ ...newBundle, name_fr: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Nom (EN)</Label>
                        <Input
                          value={newBundle.name || ''}
                          onChange={e => setNewBundle({ ...newBundle, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Prix Kit</Label>
                        <Input
                          type="number"
                          value={newBundle.bundle_price || ''}
                          onChange={e => setNewBundle({ ...newBundle, bundle_price: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>Prix Original</Label>
                        <Input
                          type="number"
                          value={newBundle.original_price || ''}
                          onChange={e => setNewBundle({ ...newBundle, original_price: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>Économies</Label>
                        <Input
                          type="number"
                          value={newBundle.savings || ''}
                          onChange={e => setNewBundle({ ...newBundle, savings: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>Procédures</Label>
                        <Textarea
                          value={newBundle.procedures || ''}
                          onChange={e => setNewBundle({ ...newBundle, procedures: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Populaire</Label>
                        <Select
                          onValueChange={value => setNewBundle({ ...newBundle, popular: value === 'true' })}
                          value={newBundle.popular ? 'true' : 'false'}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Oui</SelectItem>
                            <SelectItem value="false">Non</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Badge</Label>
                        <Input
                          value={newBundle.badge || ''}
                          onChange={e => setNewBundle({ ...newBundle, badge: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Produits (IDs séparés par des virgules)</Label>
                        <Textarea
                          value={newBundle.items?.join(', ') || ''}
                          onChange={e => {
                            const items = e.target.value.split(',').map(item => item.trim());
                            setNewBundle({ ...newBundle, items });
                          }}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button onClick={() => {
                          if (editBundleId) {
                            updateBundle();
                          } else {
                            addBundle();
                          }
                        }}>
                          {editBundleId ? 'Mettre à jour' : 'Ajouter'}
                        </Button>
                        <Button variant="outline" onClick={() => {
                          setEditBundleId(null);
                          setNewBundle({ items: [] });
                        }}>
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Nom (FR)</th>
                  <th className="border p-2">Prix Kit</th>
                  <th className="border p-2">Prix Original</th>
                  <th className="border p-2">Économies</th>
                  <th className="border p-2">Procédures</th>
                  <th className="border p-2">Populaire</th>
                  <th className="border p-2">Badge</th>
                  <th className="border p-2">Produits (IDs)</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bundles.map(bundle => (
                  <tr key={bundle.id}>
                    <td className="border p-2">{bundle.name_fr || bundle.name}</td>
                    <td className="border p-2">{bundle.bundle_price?.toLocaleString()} DZD</td>
                    <td className="border p-2">{bundle.original_price?.toLocaleString()} DZD</td>
                    <td className="border p-2">{bundle.savings?.toLocaleString()} DZD</td>
                    <td className="border p-2">{bundle.procedures}</td>
                    <td className="border p-2">{bundle.popular ? 'Oui' : 'Non'}</td>
                    <td className="border p-2">{bundle.badge}</td>
                    <td className="border p-2">{bundle.items?.join(', ')}</td>
                    <td className="border p-2 space-x-2">
                      <Button size="sm" variant="outline" onClick={() => {
                        setEditBundleId(bundle.id);
                        setNewBundle(bundle);
                      }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteBundle(bundle.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Orders Management */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Gestion des Commandes ({orders.length})</CardTitle>
              <Button onClick={downloadOrdersPDF} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Télécharger PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Client</th>
                  <th className="border p-2">Montant Total</th>
                  <th className="border p-2">Montant Payé</th>
                  <th className="border p-2">Statut</th>
                  <th className="border p-2">Paiement</th>
                  <th className="border p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td className="border p-2">#{order.id.slice(0, 8)}</td>
                    <td className="border p-2">{order.user_id}</td>
                    <td className="border p-2">{order.total_amount.toLocaleString()} DZD</td>
                    <td className="border p-2">{order.amount_paid.toLocaleString()} DZD</td>
                    <td className="border p-2">{getStatusBadge(order.status)}</td>
                    <td className="border p-2">{getPaymentStatusBadge(order.payment_status)}</td>
                    <td className="border p-2">{new Date(order.created_at).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Clients Management */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Gestion des Clients ({clients.length})</CardTitle>
              <Button onClick={downloadClientsPDF} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Télécharger PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Nom</th>
                  <th className="border p-2">Cabinet</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Téléphone</th>
                  <th className="border p-2">Wilaya</th>
                  <th className="border p-2">Adresse</th>
                  <th className="border p-2">Inscription</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(client => (
                  <tr key={client.id}>
                    <td className="border p-2">{client.full_name}</td>
                    <td className="border p-2">{client.dental_office_name}</td>
                    <td className="border p-2">{client.email}</td>
                    <td className="border p-2">{client.phone}</td>
                    <td className="border p-2">{client.wilaya}</td>
                    <td className="border p-2">{client.address}</td>
                    <td className="border p-2">{new Date(client.created_at).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
