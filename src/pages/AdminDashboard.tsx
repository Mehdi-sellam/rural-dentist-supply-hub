import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductSelector from '@/components/admin/ProductSelector';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Download, Upload, Eye } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];
type PaymentStatus = Database['public']['Enums']['payment_status'];

// Predefined color palette for categories
const CATEGORY_COLORS = [
  'from-blue-50 to-indigo-100',
  'from-green-50 to-emerald-100',
  'from-purple-50 to-violet-100',
  'from-red-50 to-rose-100',
  'from-yellow-50 to-amber-100',
  'from-pink-50 to-fuchsia-100',
  'from-cyan-50 to-sky-100',
  'from-orange-50 to-orange-100',
  'from-teal-50 to-teal-100',
  'from-lime-50 to-lime-100'
];

const PRODUCT_BADGES = ['Nouveau', 'Populaire', 'Promo', 'Recommandé', 'Exclusif'];
const BUNDLE_BADGES = ['Bestseller', 'Économique', 'Complet', 'Premium', 'Essentiel'];

const AdminDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for data
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  
  // State for forms
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingBundle, setEditingBundle] = useState<any>(null);
  const [partialPaymentAmount, setPartialPaymentAmount] = useState<{[key: string]: string}>({});
  const [orderPaymentStatuses, setOrderPaymentStatuses] = useState<{[key: string]: PaymentStatus}>({});
  
  // File upload states
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [categoryIconFile, setCategoryIconFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // New product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    name_fr: '',
    name_ar: '',
    description: '',
    description_fr: '',
    description_ar: '',
    price: '',
    original_price: '',
    product_code: '',
    product_id: '',
    category_id: '',
    image: '/placeholder.svg',
    in_stock: true,
    badge: '',
    specifications: [] as string[]
  });

  // New category form
  const [newCategory, setNewCategory] = useState({
    name: '',
    name_fr: '',
    name_ar: '',
    description: '',
    description_fr: '',
    description_ar: '',
    icon: '📦',
    color: ''
  });

  // New bundle form
  const [newBundle, setNewBundle] = useState({
    name: '',
    name_fr: '',
    name_ar: '',
    description: '',
    description_fr: '',
    description_ar: '',
    bundle_price: '',
    original_price: '',
    items: [] as string[],
    procedures: '10+',
    savings: '',
    popular: false,
    badge: '',
    sub_description: '',
    selectedProducts: [] as string[]
  });

  useEffect(() => {
    if (!user || !profile?.is_admin) {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, profile, navigate]);

  const fetchData = async () => {
    try {
      // Fetch all data
      const [productsRes, categoriesRes, bundlesRes, ordersRes, clientsRes] = await Promise.all([
        supabase.from('products').select('*, categories(name_fr)'),
        supabase.from('categories').select('*'),
        supabase.from('bundles').select('*'),
        supabase.from('orders').select('*, profiles(full_name, dental_office_name)'),
        supabase.from('profiles').select('*').eq('is_admin', false)
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

      // Initialize payment status state
      const paymentStatusState: {[key: string]: PaymentStatus} = {};
      (ordersRes.data || []).forEach(order => {
        paymentStatusState[order.id] = order.payment_status;
      });
      setOrderPaymentStatuses(paymentStatusState);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement des données');
    }
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    setUploadingImage(true);
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Erreur lors du téléchargement du fichier');
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      
      fetchData();
      toast.success('Statut de commande mis à jour');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: PaymentStatus, partialAmount?: number) => {
    try {
      const updateData: any = { payment_status: paymentStatus };
      
      if (paymentStatus === 'partial' && partialAmount) {
        updateData.amount_paid = partialAmount;
      } else if (paymentStatus === 'paid') {
        const order = orders.find(o => o.id === orderId);
        if (order) {
          updateData.amount_paid = order.total_amount;
        }
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;
      
      setPartialPaymentAmount(prev => ({ ...prev, [orderId]: '' }));
      fetchData();
      toast.success('Statut de paiement mis à jour');
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handlePaymentStatusChange = (orderId: string, newStatus: PaymentStatus) => {
    setOrderPaymentStatuses(prev => ({
      ...prev,
      [orderId]: newStatus
    }));

    if (newStatus !== 'partial') {
      updatePaymentStatus(orderId, newStatus);
    }
  };

  const calculateSavings = (originalPrice: string, bundlePrice: string) => {
    const original = parseFloat(originalPrice.replace(/[^0-9]/g, '')) || 0;
    const bundle = parseFloat(bundlePrice.replace(/[^0-9]/g, '')) || 0;
    const savings = original - bundle;
    return savings > 0 ? `${savings.toLocaleString()} DZD` : '';
  };

  const getNextCategoryColor = () => {
    const usedColors = categories.map(cat => cat.color);
    return CATEGORY_COLORS.find(color => !usedColors.includes(color)) || CATEGORY_COLORS[0];
  };

  const handleAddProduct = async () => {
    if (!newProduct.name_fr || !newProduct.price || !newProduct.product_code || !newProduct.category_id) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      let imageUrl = newProduct.image;
      
      if (productImageFile) {
        const fileName = `products/${Date.now()}_${productImageFile.name}`;
        imageUrl = await uploadFile(productImageFile, 'product-images', fileName);
      }

      const { error } = await supabase
        .from('products')
        .insert({
          ...newProduct,
          name: newProduct.name_fr,
          description: newProduct.description_fr,
          price: parseFloat(newProduct.price),
          original_price: newProduct.original_price ? parseFloat(newProduct.original_price) : null,
          image: imageUrl
        });

      if (error) throw error;

      // Reset form
      setNewProduct({
        name: '',
        name_fr: '',
        name_ar: '',
        description: '',
        description_fr: '',
        description_ar: '',
        price: '',
        original_price: '',
        product_code: '',
        product_id: '',
        category_id: '',
        image: '/placeholder.svg',
        in_stock: true,
        badge: '',
        specifications: []
      });
      setProductImageFile(null);

      fetchData();
      toast.success('Produit ajouté avec succès');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Erreur lors de l\'ajout du produit');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name_fr) {
      toast.error('Veuillez remplir le nom de la catégorie');
      return;
    }

    try {
      const categoryColor = getNextCategoryColor();
      let iconUrl = newCategory.icon;
      
      if (categoryIconFile) {
        const fileName = `categories/${Date.now()}_${categoryIconFile.name}`;
        iconUrl = await uploadFile(categoryIconFile, 'category-icons', fileName);
      }
      
      const { error } = await supabase
        .from('categories')
        .insert({
          ...newCategory,
          name: newCategory.name_fr,
          description: newCategory.description_fr,
          color: categoryColor,
          icon: iconUrl
        });

      if (error) throw error;

      // Reset form
      setNewCategory({
        name: '',
        name_fr: '',
        name_ar: '',
        description: '',
        description_fr: '',
        description_ar: '',
        icon: '📦',
        color: ''
      });
      setCategoryIconFile(null);

      fetchData();
      toast.success('Catégorie ajoutée avec succès');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Erreur lors de l\'ajout de la catégorie');
    }
  };

  const handleAddBundle = async () => {
    if (!newBundle.name_fr || !newBundle.bundle_price || !newBundle.original_price) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const savings = calculateSavings(newBundle.original_price, newBundle.bundle_price);
      
      const { error } = await supabase
        .from('bundles')
        .insert({
          name: newBundle.name_fr,
          name_fr: newBundle.name_fr,
          name_ar: newBundle.name_ar,
          description: newBundle.description_fr,
          description_fr: newBundle.description_fr,
          description_ar: newBundle.description_ar,
          bundle_price: newBundle.bundle_price,
          original_price: newBundle.original_price,
          items: newBundle.selectedProducts, // Store product IDs instead of text
          procedures: newBundle.procedures,
          savings,
          popular: newBundle.popular,
          badge: newBundle.badge,
          sub_description: newBundle.sub_description
        });

      if (error) throw error;

      // Reset form
      setNewBundle({
        name: '',
        name_fr: '',
        name_ar: '',
        description: '',
        description_fr: '',
        description_ar: '',
        bundle_price: '',
        original_price: '',
        items: [],
        procedures: '10+',
        savings: '',
        popular: false,
        badge: '',
        sub_description: '',
        selectedProducts: []
      });

      fetchData();
      toast.success('Kit ajouté avec succès');
    } catch (error) {
      console.error('Error adding bundle:', error);
      toast.error('Erreur lors de l\'ajout du kit');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      fetchData();
      toast.success('Produit supprimé');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      fetchData();
      toast.success('Catégorie supprimée');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleDeleteBundle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bundles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      fetchData();
      toast.success('Kit supprimé');
    } catch (error) {
      console.error('Error deleting bundle:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const downloadData = (data: any[], filename: string) => {
    const csv = data.map(item => Object.values(item).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${filename} téléchargé avec succès`);
  };

  const completedOrders = orders.filter(order => 
    order.status === 'delivered' && order.payment_status === 'paid'
  );

  if (!user || !profile?.is_admin) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Tableau de Bord Admin</h1>
          <p className="text-gray-600">Gérez vos produits, commandes et clients</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="categories">Catégories</TabsTrigger>
            <TabsTrigger value="bundles">Kits</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Commandes Terminées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedOrders.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{clients.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Catégories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{categories.length}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Ajouter un nouveau produit
                  <Button onClick={() => downloadData(products, 'products.csv')} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nom (Français) *</Label>
                    <Input
                      value={newProduct.name_fr}
                      onChange={(e) => setNewProduct({...newProduct, name_fr: e.target.value})}
                      placeholder="Nom du produit en français"
                    />
                  </div>
                  <div>
                    <Label>Nom (Arabe)</Label>
                    <Input
                      value={newProduct.name_ar}
                      onChange={(e) => setNewProduct({...newProduct, name_ar: e.target.value})}
                      placeholder="Nom du produit en arabe"
                    />
                  </div>
                  <div>
                    <Label>Code produit *</Label>
                    <Input
                      value={newProduct.product_code}
                      onChange={(e) => setNewProduct({...newProduct, product_code: e.target.value})}
                      placeholder="Code produit unique"
                    />
                  </div>
                  <div>
                    <Label>Prix (DZD) *</Label>
                    <Input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      placeholder="Prix en DZD"
                    />
                  </div>
                  <div>
                    <Label>Prix original (DZD)</Label>
                    <Input
                      type="number"
                      value={newProduct.original_price}
                      onChange={(e) => setNewProduct({...newProduct, original_price: e.target.value})}
                      placeholder="Prix original en DZD"
                    />
                  </div>
                  <div>
                    <Label>Catégorie *</Label>
                    <Select value={newProduct.category_id} onValueChange={(value) => setNewProduct({...newProduct, category_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name_fr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Badge</Label>
                    <Select value={newProduct.badge} onValueChange={(value) => setNewProduct({...newProduct, badge: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un badge" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_BADGES.map((badge) => (
                          <SelectItem key={badge} value={badge}>
                            {badge}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="in_stock"
                      checked={newProduct.in_stock}
                      onCheckedChange={(checked) => setNewProduct({...newProduct, in_stock: !!checked})}
                    />
                    <Label htmlFor="in_stock">En stock</Label>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Image du produit</Label>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProductImageFile(e.target.files?.[0] || null)}
                      />
                      {productImageFile && (
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">{productImageFile.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Description (Français)</Label>
                    <Textarea
                      value={newProduct.description_fr}
                      onChange={(e) => setNewProduct({...newProduct, description_fr: e.target.value})}
                      placeholder="Description du produit en français"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Description (Arabe)</Label>
                    <Textarea
                      value={newProduct.description_ar}
                      onChange={(e) => setNewProduct({...newProduct, description_ar: e.target.value})}
                      placeholder="Description du produit en arabe"
                    />
                  </div>
                </div>
                <Button onClick={handleAddProduct} disabled={uploadingImage}>
                  <Plus className="w-4 h-4 mr-2" />
                  {uploadingImage ? 'Téléchargement...' : 'Ajouter le produit'}
                </Button>
              </CardContent>
            </Card>

            {/* Products List */}
            <Card>
              <CardHeader>
                <CardTitle>Liste des produits ({products.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <h3 className="font-medium">{product.name_fr}</h3>
                        <p className="text-sm text-gray-600">Code: {product.product_code}</p>
                        <p className="text-sm text-gray-600">Prix: {product.price.toLocaleString()} DZD</p>
                        <p className="text-sm text-gray-600">Catégorie: {product.categories?.name_fr || 'Non catégorisé'}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Ajouter une nouvelle catégorie
                  <Button onClick={() => downloadData(categories, 'categories.csv')} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nom (Français) *</Label>
                    <Input
                      value={newCategory.name_fr}
                      onChange={(e) => setNewCategory({...newCategory, name_fr: e.target.value})}
                      placeholder="Nom de la catégorie en français"
                    />
                  </div>
                  <div>
                    <Label>Nom (Arabe)</Label>
                    <Input
                      value={newCategory.name_ar}
                      onChange={(e) => setNewCategory({...newCategory, name_ar: e.target.value})}
                      placeholder="Nom de la catégorie en arabe"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Icône de la catégorie</Label>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCategoryIconFile(e.target.files?.[0] || null)}
                      />
                      {categoryIconFile && (
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">{categoryIconFile.name}</span>
                        </div>
                      )}
                      {!categoryIconFile && (
                        <Input
                          value={newCategory.icon}
                          onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                          placeholder="Ou entrez un emoji pour l'icône"
                        />
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Description (Français)</Label>
                    <Textarea
                      value={newCategory.description_fr}
                      onChange={(e) => setNewCategory({...newCategory, description_fr: e.target.value})}
                      placeholder="Description de la catégorie en français"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Description (Arabe)</Label>
                    <Textarea
                      value={newCategory.description_ar}
                      onChange={(e) => setNewCategory({...newCategory, description_ar: e.target.value})}
                      placeholder="Description de la catégorie en arabe"
                    />
                  </div>
                </div>
                <Button onClick={handleAddCategory} disabled={uploadingImage}>
                  <Plus className="w-4 h-4 mr-2" />
                  {uploadingImage ? 'Téléchargement...' : 'Ajouter la catégorie'}
                </Button>
              </CardContent>
            </Card>

            {/* Categories List */}
            <Card>
              <CardHeader>
                <CardTitle>Liste des catégories ({categories.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div key={category.id} className={`p-4 border rounded bg-gradient-to-br ${category.color}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-2xl">{category.icon}</div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <h3 className="font-medium">{category.name_fr}</h3>
                      <p className="text-sm text-gray-600">{category.description_fr}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Bundles Tab */}
          <TabsContent value="bundles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Ajouter un nouveau kit
                  <Button onClick={() => downloadData(bundles, 'bundles.csv')} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nom (Français) *</Label>
                    <Input
                      value={newBundle.name_fr}
                      onChange={(e) => setNewBundle({...newBundle, name_fr: e.target.value})}
                      placeholder="Nom du kit en français"
                    />
                  </div>
                  <div>
                    <Label>Nom (Arabe)</Label>
                    <Input
                      value={newBundle.name_ar}
                      onChange={(e) => setNewBundle({...newBundle, name_ar: e.target.value})}
                      placeholder="Nom du kit en arabe"
                    />
                  </div>
                  <div>
                    <Label>Prix du kit (DZD) *</Label>
                    <Input
                      value={newBundle.bundle_price}
                      onChange={(e) => setNewBundle({...newBundle, bundle_price: e.target.value})}
                      placeholder="Ex: 15000 DZD"
                    />
                  </div>
                  <div>
                    <Label>Prix original (DZD) *</Label>
                    <Input
                      value={newBundle.original_price}
                      onChange={(e) => setNewBundle({...newBundle, original_price: e.target.value})}
                      placeholder="Ex: 20000 DZD"
                    />
                  </div>
                  <div>
                    <Label>Badge</Label>
                    <Select value={newBundle.badge} onValueChange={(value) => setNewBundle({...newBundle, badge: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un badge" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUNDLE_BADGES.map((badge) => (
                          <SelectItem key={badge} value={badge}>
                            {badge}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Procédures</Label>
                    <Input
                      value={newBundle.procedures}
                      onChange={(e) => setNewBundle({...newBundle, procedures: e.target.value})}
                      placeholder="Ex: 25+"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Sous-description</Label>
                    <Input
                      value={newBundle.sub_description}
                      onChange={(e) => setNewBundle({...newBundle, sub_description: e.target.value})}
                      placeholder="Ex: Idéal pour 25+ procédures"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="popular"
                      checked={newBundle.popular}
                      onCheckedChange={(checked) => setNewBundle({...newBundle, popular: !!checked})}
                    />
                    <Label htmlFor="popular">Kit populaire</Label>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Description (Français)</Label>
                    <Textarea
                      value={newBundle.description_fr}
                      onChange={(e) => setNewBundle({...newBundle, description_fr: e.target.value})}
                      placeholder="Description du kit en français"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Description (Arabe)</Label>
                    <Textarea
                      value={newBundle.description_ar}
                      onChange={(e) => setNewBundle({...newBundle, description_ar: e.target.value})}
                      placeholder="Description du kit en arabe"
                    />
                  </div>
                </div>

                {/* Product Selection */}
                <div className="md:col-span-2">
                  <Label>Produits inclus dans le kit *</Label>
                  <ProductSelector
                    selectedProducts={newBundle.selectedProducts}
                    onProductsChange={(products) => setNewBundle({...newBundle, selectedProducts: products})}
                  />
                </div>

                {/* Automatic Savings Display */}
                {newBundle.bundle_price && newBundle.original_price && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <Label>Économies calculées automatiquement</Label>
                    <p className="text-lg font-semibold text-green-600">
                      {calculateSavings(newBundle.original_price, newBundle.bundle_price)}
                    </p>
                  </div>
                )}

                <Button onClick={handleAddBundle} disabled={newBundle.selectedProducts.length === 0}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter le kit
                </Button>
              </CardContent>
            </Card>

            {/* Bundles List */}
            <Card>
              <CardHeader>
                <CardTitle>Liste des kits ({bundles.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bundles.map((bundle) => (
                    <div key={bundle.id} className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <h3 className="font-medium">{bundle.name_fr || bundle.name}</h3>
                        <p className="text-sm text-gray-600">Prix: {bundle.bundle_price}</p>
                        <p className="text-sm text-gray-600">Prix original: {bundle.original_price}</p>
                        <p className="text-sm text-gray-600">Économies: {bundle.calculated_savings ? `${bundle.calculated_savings.toLocaleString()} DZD` : bundle.savings}</p>
                        {bundle.popular && <Badge variant="secondary">Populaire</Badge>}
                        {bundle.badge && <Badge variant="outline">{bundle.badge}</Badge>}
                        {bundle.sub_description && <p className="text-sm text-muted-foreground">{bundle.sub_description}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteBundle(bundle.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Commandes ({orders.length})
                  <Button onClick={() => downloadData(orders, 'orders.csv')} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium">Commande #{order.id.slice(0, 8)}</h3>
                            <p className="text-sm text-gray-600">Client: {order.profiles?.full_name}</p>
                            <p className="text-sm text-gray-600">Cabinet: {order.profiles?.dental_office_name}</p>
                            <p className="text-sm text-gray-600">Total: {order.total_amount.toLocaleString()} DZD</p>
                            <p className="text-sm text-gray-600">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                            {order.preferred_delivery_date && (
                              <p className="text-sm text-gray-600">Date de livraison préférée: {new Date(order.preferred_delivery_date).toLocaleDateString()}</p>
                            )}
                            {order.amount_paid > 0 && (
                              <p className="text-sm text-green-600">Montant payé: {order.amount_paid.toLocaleString()} DZD</p>
                            )}
                            {order.remaining_balance > 0 && (
                              <p className="text-sm text-orange-600">Solde restant: {order.remaining_balance.toLocaleString()} DZD</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <div>
                              <Label>Statut de la commande</Label>
                              <Select 
                                value={order.status} 
                                onValueChange={(value: OrderStatus) => updateOrderStatus(order.id, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">En attente</SelectItem>
                                  <SelectItem value="confirmed">Confirmée</SelectItem>
                                  <SelectItem value="shipped">Expédiée</SelectItem>
                                  <SelectItem value="delivered">Livrée</SelectItem>
                                  <SelectItem value="cancelled">Annulée</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Statut du paiement</Label>
                              <Select 
                                value={orderPaymentStatuses[order.id] || order.payment_status} 
                                onValueChange={(value: PaymentStatus) => handlePaymentStatusChange(order.id, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">En attente</SelectItem>
                                  <SelectItem value="partial">Partiel</SelectItem>
                                  <SelectItem value="paid">Payé</SelectItem>
                                  <SelectItem value="refunded">Remboursé</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {/* Conditional partial payment section */}
                            {orderPaymentStatuses[order.id] === 'partial' && (
                              <div className="space-y-2">
                                <Label>Montant du paiement partiel</Label>
                                <div className="flex gap-2">
                                  <Input
                                    type="number"
                                    placeholder="Montant en DZD"
                                    value={partialPaymentAmount[order.id] || ''}
                                    onChange={(e) => setPartialPaymentAmount(prev => ({
                                      ...prev,
                                      [order.id]: e.target.value
                                    }))}
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      const amount = parseFloat(partialPaymentAmount[order.id] || '0');
                                      if (amount > 0) {
                                        updatePaymentStatus(order.id, 'partial', amount);
                                      }
                                    }}
                                    disabled={!partialPaymentAmount[order.id] || parseFloat(partialPaymentAmount[order.id]) <= 0}
                                  >
                                    Appliquer
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Show if order is completed */}
                        {order.status === 'delivered' && order.payment_status === 'paid' && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Commande Terminée
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Clients ({clients.length})
                  <Button onClick={() => downloadData(clients, 'clients.csv')} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <h3 className="font-medium">{client.full_name}</h3>
                        <p className="text-sm text-gray-600">Cabinet: {client.dental_office_name}</p>
                        <p className="text-sm text-gray-600">Email: {client.email}</p>
                        <p className="text-sm text-gray-600">Téléphone: {client.phone}</p>
                        <p className="text-sm text-gray-600">Wilaya: {client.wilaya}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        Inscrit le: {new Date(client.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
