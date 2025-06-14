import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { Trash2, Edit, Download, Plus, Save, X } from 'lucide-react';
import { generateProductsPDF, generateOrdersPDF, generateClientsPDF, generateCategoriesPDF, generateBundlesPDF, generateCompleteCatalogPDF } from '../utils/pdfGenerator';

interface Product {
  id: string;
  name: string;
  name_fr?: string;
  product_code: string;
  price: number;
  original_price?: number;
  categories?: { id: string; name: string; name_fr?: string };
  in_stock: boolean;
  badge?: string;
}

interface Order {
  id: string;
  profiles?: { full_name: string; dental_office_name: string };
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
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
  bundle_price: number;
  original_price?: number;
  savings?: number;
  procedures?: string;
  popular?: boolean;
  badge?: string;
  items?: string[];
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddBundle, setShowAddBundle] = useState(false);

  // Product form state
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    product_code: '',
    price: 0,
    in_stock: true,
  });

  // Category form state
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    description_fr: '',
    icon: '',
  });

  // Bundle form state
  const [newBundle, setNewBundle] = useState<Partial<Bundle>>({
    name: '',
    bundle_price: 0,
    original_price: 0,
    savings: 0,
    procedures: '',
    popular: false,
    badge: '',
    items: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: productsData, error: productsError } = await supabase.from('products').select('*');
        if (productsError) throw productsError;
        setProducts(productsData || []);

        const { data: ordersData, error: ordersError } = await supabase.from('orders').select('*');
        if (ordersError) throw ordersError;
        setOrders(ordersData || []);

        const { data: clientsData, error: clientsError } = await supabase.from('clients').select('*');
        if (clientsError) throw clientsError;
        setClients(clientsData || []);

        const { data: categoriesData, error: categoriesError } = await supabase.from('categories').select('*');
        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);

        const { data: bundlesData, error: bundlesError } = await supabase.from('bundles').select('*');
        if (bundlesError) throw bundlesError;
        setBundles(bundlesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownloadProductsPDF = () => {
    try {
      const doc = generateProductsPDF(products);
      doc.save('dentgo-produits.pdf');
      toast.success('PDF des produits téléchargé avec succès');
    } catch (error) {
      console.error('Error generating products PDF:', error);
      toast.error('Erreur lors de la génération du PDF des produits');
    }
  };

  const handleDownloadOrdersPDF = () => {
    try {
      const doc = generateOrdersPDF(orders);
      doc.save('dentgo-commandes.pdf');
      toast.success('PDF des commandes téléchargé avec succès');
    } catch (error) {
      console.error('Error generating orders PDF:', error);
      toast.error('Erreur lors de la génération du PDF des commandes');
    }
  };

  const handleDownloadClientsPDF = () => {
    try {
      const doc = generateClientsPDF(clients);
      doc.save('dentgo-clients.pdf');
      toast.success('PDF des clients téléchargé avec succès');
    } catch (error) {
      console.error('Error generating clients PDF:', error);
      toast.error('Erreur lors de la génération du PDF des clients');
    }
  };

  const handleDownloadCategoriesPDF = () => {
    try {
      const doc = generateCategoriesPDF(categories);
      doc.save('dentgo-categories.pdf');
      toast.success('PDF des catégories téléchargé avec succès');
    } catch (error) {
      console.error('Error generating categories PDF:', error);
      toast.error('Erreur lors de la génération du PDF des catégories');
    }
  };

  const handleDownloadBundlesPDF = () => {
    try {
      const doc = generateBundlesPDF(bundles, products);
      doc.save('dentgo-kits.pdf');
      toast.success('PDF des kits téléchargé avec succès');
    } catch (error) {
      console.error('Error generating bundles PDF:', error);
      toast.error('Erreur lors de la génération du PDF des kits');
    }
  };

  const handleDownloadCompleteCatalog = () => {
    try {
      const doc = generateCompleteCatalogPDF(products, categories, bundles);
      doc.save('dentgo-catalogue-complet.pdf');
      toast.success('Catalogue complet téléchargé avec succès');
    } catch (error) {
      console.error('Error generating complete catalog PDF:', error);
      toast.error('Erreur lors de la génération du catalogue complet');
    }
  };

  // Example handlers for adding products, categories, bundles (simplified)
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.product_code) {
      toast.error('Veuillez remplir tous les champs obligatoires du produit');
      return;
    }
    try {
      const { data, error } = await supabase.from('products').insert([newProduct]);
      if (error) throw error;
      setProducts(prev => [...prev, data[0]]);
      setShowAddProduct(false);
      setNewProduct({ name: '', product_code: '', price: 0, in_stock: true });
      toast.success('Produit ajouté avec succès');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Erreur lors de l\'ajout du produit');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name) {
      toast.error('Veuillez remplir le nom de la catégorie');
      return;
    }
    try {
      const { data, error } = await supabase.from('categories').insert([newCategory]);
      if (error) throw error;
      setCategories(prev => [...prev, data[0]]);
      setShowAddCategory(false);
      setNewCategory({ name: '', description_fr: '', icon: '' });
      toast.success('Catégorie ajoutée avec succès');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Erreur lors de l\'ajout de la catégorie');
    }
  };

  const handleAddBundle = async () => {
    if (!newBundle.name || !newBundle.bundle_price) {
      toast.error('Veuillez remplir tous les champs obligatoires du kit');
      return;
    }
    try {
      const { data, error } = await supabase.from('bundles').insert([newBundle]);
      if (error) throw error;
      setBundles(prev => [...prev, data[0]]);
      setShowAddBundle(false);
      setNewBundle({ name: '', bundle_price: 0, original_price: 0, savings: 0, procedures: '', popular: false, badge: '', items: [] });
      toast.success('Kit ajouté avec succès');
    } catch (error) {
      console.error('Error adding bundle:', error);
      toast.error('Erreur lors de l\'ajout du kit');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de Bord Administrateur</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Catégories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bundles.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Products Section */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gestion des Produits</CardTitle>
            <div className="flex gap-2">
              <Button onClick={handleDownloadProductsPDF} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button onClick={() => setShowAddProduct(!showAddProduct)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {showAddProduct && (
            <div className="mb-4 p-4 border rounded">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Nom (FR)</Label>
                  <Input
                    value={newProduct.name_fr || ''}
                    onChange={e => setNewProduct(prev => ({ ...prev, name_fr: e.target.value }))}
                    placeholder="Nom en français"
                  />
                </div>
                <div>
                  <Label>Nom (EN)</Label>
                  <Input
                    value={newProduct.name || ''}
                    onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Name in English"
                  />
                </div>
                <div>
                  <Label>Code Produit</Label>
                  <Input
                    value={newProduct.product_code || ''}
                    onChange={e => setNewProduct(prev => ({ ...prev, product_code: e.target.value }))}
                    placeholder="Code produit"
                  />
                </div>
                <div>
                  <Label>Prix</Label>
                  <Input
                    type="number"
                    value={newProduct.price || 0}
                    onChange={e => setNewProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
                    placeholder="Prix"
                  />
                </div>
                <div>
                  <Label>En Stock</Label>
                  <Select
                    onValueChange={value => setNewProduct(prev => ({ ...prev, in_stock: value === 'true' }))}
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
                  <Label>Catégorie</Label>
                  <Select
                    onValueChange={value => {
                      const category = categories.find(cat => cat.id === value);
                      setNewProduct(prev => ({ ...prev, categories: category }));
                    }}
                    value={newProduct.categories?.id || ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name_fr || cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Badge</Label>
                  <Input
                    value={newProduct.badge || ''}
                    onChange={e => setNewProduct(prev => ({ ...prev, badge: e.target.value }))}
                    placeholder="Badge"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={handleAddProduct} variant="primary" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </Button>
                <Button onClick={() => setShowAddProduct(false)} variant="outline" size="sm">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Nom</th>
                <th className="border border-gray-300 p-2">Code</th>
                <th className="border border-gray-300 p-2">Prix</th>
                <th className="border border-gray-300 p-2">Catégorie</th>
                <th className="border border-gray-300 p-2">Stock</th>
                <th className="border border-gray-300 p-2">Badge</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td className="border border-gray-300 p-2">{product.name_fr || product.name}</td>
                  <td className="border border-gray-300 p-2">{product.product_code}</td>
                  <td className="border border-gray-300 p-2">{product.price.toLocaleString()} DZD</td>
                  <td className="border border-gray-300 p-2">{product.categories?.name_fr || product.categories?.name || 'Non catégorisé'}</td>
                  <td className="border border-gray-300 p-2">{product.in_stock ? 'En stock' : 'Rupture'}</td>
                  <td className="border border-gray-300 p-2">{product.badge || 'Aucun'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Orders Section */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gestion des Commandes</CardTitle>
            <Button onClick={handleDownloadOrdersPDF} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Client</th>
                <th className="border border-gray-300 p-2">Cabinet</th>
                <th className="border border-gray-300 p-2">Montant</th>
                <th className="border border-gray-300 p-2">Statut</th>
                <th className="border border-gray-300 p-2">Paiement</th>
                <th className="border border-gray-300 p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td className="border border-gray-300 p-2">#{order.id?.slice(0, 8)}</td>
                  <td className="border border-gray-300 p-2">{order.profiles?.full_name || 'N/A'}</td>
                  <td className="border border-gray-300 p-2">{order.profiles?.dental_office_name || 'N/A'}</td>
                  <td className="border border-gray-300 p-2">{(order.total_amount || 0).toLocaleString()} DZD</td>
                  <td className="border border-gray-300 p-2">{(() => {
                    switch (order.status) {
                      case 'pending': return 'En attente';
                      case 'confirmed': return 'Confirmée';
                      case 'shipped': return 'Expédiée';
                      case 'delivered': return 'Livrée';
                      case 'cancelled': return 'Annulée';
                      default: return order.status || 'N/A';
                    }
                  })()}</td>
                  <td className="border border-gray-300 p-2">{(() => {
                    switch (order.payment_status) {
                      case 'pending': return 'En attente';
                      case 'partial': return 'Partiel';
                      case 'paid': return 'Payé';
                      case 'refunded': return 'Remboursé';
                      default: return order.payment_status || 'N/A';
                    }
                  })()}</td>
                  <td className="border border-gray-300 p-2">{order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR') : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Clients Section */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gestion des Clients</CardTitle>
            <Button onClick={handleDownloadClientsPDF} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Nom</th>
                <th className="border border-gray-300 p-2">Cabinet</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Téléphone</th>
                <th className="border border-gray-300 p-2">Wilaya</th>
                <th className="border border-gray-300 p-2">Adresse</th>
                <th className="border border-gray-300 p-2">Inscription</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id}>
                  <td className="border border-gray-300 p-2">{client.full_name}</td>
                  <td className="border border-gray-300 p-2">{client.dental_office_name}</td>
                  <td className="border border-gray-300 p-2">{client.email}</td>
                  <td className="border border-gray-300 p-2">{client.phone}</td>
                  <td className="border border-gray-300 p-2">{client.wilaya}</td>
                  <td className="border border-gray-300 p-2">{client.address}</td>
                  <td className="border border-gray-300 p-2">{client.created_at ? new Date(client.created_at).toLocaleDateString('fr-FR') : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Categories Section */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gestion des Catégories</CardTitle>
            <div className="flex gap-2">
              <Button onClick={handleDownloadCategoriesPDF} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button onClick={() => setShowAddCategory(!showAddCategory)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {showAddCategory && (
            <div className="mb-4 p-4 border rounded">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Nom (FR)</Label>
                  <Input
                    value={newCategory.name_fr || ''}
                    onChange={e => setNewCategory(prev => ({ ...prev, name_fr: e.target.value }))}
                    placeholder="Nom en français"
                  />
                </div>
                <div>
                  <Label>Nom (EN)</Label>
                  <Input
                    value={newCategory.name || ''}
                    onChange={e => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Name in English"
                  />
                </div>
                <div>
                  <Label>Description (FR)</Label>
                  <Textarea
                    value={newCategory.description_fr || ''}
                    onChange={e => setNewCategory(prev => ({ ...prev, description_fr: e.target.value }))}
                    placeholder="Description en français"
                  />
                </div>
                <div>
                  <Label>Icône</Label>
                  <Input
                    value={newCategory.icon || ''}
                    onChange={e => setNewCategory(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="Icône (URL ou nom)"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={handleAddCategory} variant="primary" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </Button>
                <Button onClick={() => setShowAddCategory(false)} variant="outline" size="sm">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Nom (FR)</th>
                <th className="border border-gray-300 p-2">Nom (EN)</th>
                <th className="border border-gray-300 p-2">Description</th>
                <th className="border border-gray-300 p-2">Icône</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id}>
                  <td className="border border-gray-300 p-2">{category.name_fr || category.name}</td>
                  <td className="border border-gray-300 p-2">{category.name}</td>
                  <td className="border border-gray-300 p-2">{category.description_fr || 'N/A'}</td>
                  <td className="border border-gray-300 p-2">{category.icon || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Bundles Section */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gestion des Kits</CardTitle>
            <div className="flex gap-2">
              <Button onClick={handleDownloadBundlesPDF} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button onClick={() => setShowAddBundle(!showAddBundle)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {showAddBundle && (
            <div className="mb-4 p-4 border rounded">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Nom (FR)</Label>
                  <Input
                    value={newBundle.name_fr || ''}
                    onChange={e => setNewBundle(prev => ({ ...prev, name_fr: e.target.value }))}
                    placeholder="Nom en français"
                  />
                </div>
                <div>
                  <Label>Nom (EN)</Label>
                  <Input
                    value={newBundle.name || ''}
                    onChange={e => setNewBundle(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Name in English"
                  />
                </div>
                <div>
                  <Label>Prix Kit</Label>
                  <Input
                    type="number"
                    value={newBundle.bundle_price || 0}
                    onChange={e => setNewBundle(prev => ({ ...prev, bundle_price: Number(e.target.value) }))}
                    placeholder="Prix du kit"
                  />
                </div>
                <div>
                  <Label>Prix Original</Label>
                  <Input
                    type="number"
                    value={newBundle.original_price || 0}
                    onChange={e => setNewBundle(prev => ({ ...prev, original_price: Number(e.target.value) }))}
                    placeholder="Prix original"
                  />
                </div>
                <div>
                  <Label>Économies</Label>
                  <Input
                    type="number"
                    value={newBundle.savings || 0}
                    onChange={e => setNewBundle(prev => ({ ...prev, savings: Number(e.target.value) }))}
                    placeholder="Économies"
                  />
                </div>
                <div>
                  <Label>Procédures</Label>
                  <Textarea
                    value={newBundle.procedures || ''}
                    onChange={e => setNewBundle(prev => ({ ...prev, procedures: e.target.value }))}
                    placeholder="Procédures"
                  />
                </div>
                <div>
                  <Label>Populaire</Label>
                  <Select
                    onValueChange={value => setNewBundle(prev => ({ ...prev, popular: value === 'true' }))}
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
                    onChange={e => setNewBundle(prev => ({ ...prev, badge: e.target.value }))}
                    placeholder="Badge"
                  />
                </div>
                <div>
                  <Label>Produits (IDs séparés par virgule)</Label>
                  <Textarea
                    value={newBundle.items ? newBundle.items.join(',') : ''}
                    onChange={e => setNewBundle(prev => ({ ...prev, items: e.target.value.split(',').map(s => s.trim()) }))}
                    placeholder="IDs des produits"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={handleAddBundle} variant="primary" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </Button>
                <Button onClick={() => setShowAddBundle(false)} variant="outline" size="sm">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Nom</th>
                <th className="border border-gray-300 p-2">Prix Kit</th>
                <th className="border border-gray-300 p-2">Prix Original</th>
                <th className="border border-gray-300 p-2">Économies</th>
                <th className="border border-gray-300 p-2">Procédures</th>
                <th className="border border-gray-300 p-2">Populaire</th>
                <th className="border border-gray-300 p-2">Badge</th>
                <th className="border border-gray-300 p-2">Produits</th>
              </tr>
            </thead>
            <tbody>
              {bundles.map(bundle => {
                const productNames = products
                  .filter(product => bundle.items?.includes(product.id))
                  .map(product => product.name_fr || product.name)
                  .join(', ');
                return (
                  <tr key={bundle.id}>
                    <td className="border border-gray-300 p-2">{bundle.name_fr || bundle.name}</td>
                    <td className="border border-gray-300 p-2">{bundle.bundle_price}</td>
                    <td className="border border-gray-300 p-2">{bundle.original_price || 'N/A'}</td>
                    <td className="border border-gray-300 p-2">{bundle.savings || 'N/A'}</td>
                    <td className="border border-gray-300 p-2">{bundle.procedures || 'N/A'}</td>
                    <td className="border border-gray-300 p-2">{bundle.popular ? 'Oui' : 'Non'}</td>
                    <td className="border border-gray-300 p-2">{bundle.badge || 'Aucun'}</td>
                    <td className="border border-gray-300 p-2">{productNames.substring(0, 50)}{productNames.length > 50 ? '...' : ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Complete Catalog Download */}
      <Card>
        <CardHeader>
          <CardTitle>Catalogue Complet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Button onClick={handleDownloadCompleteCatalog} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Download className="w-4 h-4 mr-2" />
              Télécharger le Catalogue Complet PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
