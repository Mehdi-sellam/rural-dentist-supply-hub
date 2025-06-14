import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DatabaseSeeder from '@/components/DatabaseSeeder';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Download, RotateCcw } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];
type PaymentStatus = Database['public']['Enums']['payment_status'];

const AdminDashboard = () => {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  
  // ALL useState hooks MUST be called before any conditional returns
  const [activeTab, setActiveTab] = useState('database');
  const [partialPayments, setPartialPayments] = useState<{[key: string]: string}>({});
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingBundle, setEditingBundle] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // NOW we can have conditional returns after ALL hooks are called
  if (!user || !profile?.is_admin) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
          <p>Vous n'avez pas les permissions pour accéder à cette page.</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Fetch data from Supabase
  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*),
          order_bundles (*)
        `);
      
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Erreur lors du chargement des commandes');
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_admin', false);
      
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Erreur lors du chargement des clients');
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name_fr,
            icon
          )
        `);
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Erreur lors du chargement des produits');
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Erreur lors du chargement des catégories');
    }
  };

  const fetchBundles = async () => {
    try {
      const { data, error } = await supabase
        .from('bundles')
        .select('*');
      
      if (error) throw error;
      setBundles(data || []);
    } catch (error) {
      console.error('Error fetching bundles:', error);
      toast.error('Erreur lors du chargement des kits');
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'clients') {
      fetchClients();
    } else if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'categories') {
      fetchCategories();
    } else if (activeTab === 'bundles') {
      fetchBundles();
    }
  }, [activeTab]);

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw error;
      await fetchOrders();
      toast.success('Statut mis à jour');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: PaymentStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: paymentStatus })
        .eq('id', orderId);
      
      if (error) throw error;
      await fetchOrders();
      toast.success('Statut de paiement mis à jour');
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const updatePartialPayment = async (orderId: string, amountPaid: number) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const newAmountPaid = (order.amount_paid || 0) + amountPaid;
      const remainingBalance = order.total_amount - newAmountPaid;
      
      const { error } = await supabase
        .from('orders')
        .update({ 
          amount_paid: newAmountPaid,
          remaining_balance: remainingBalance,
          payment_status: remainingBalance <= 0 ? 'paid' : 'partial'
        })
        .eq('id', orderId);
      
      if (error) throw error;
      await fetchOrders();
      toast.success('Paiement partiel enregistré');
      setPartialPayments(prev => ({ ...prev, [orderId]: '' }));
    } catch (error) {
      console.error('Error updating partial payment:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      try {
        const { error } = await supabase
          .from('orders')
          .delete()
          .eq('id', orderId);
        
        if (error) throw error;
        await fetchOrders();
        toast.success('Commande supprimée avec succès');
      } catch (error) {
        console.error('Error deleting order:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const saveProduct = async (productData: any) => {
    try {
      if (editingProduct && editingProduct.id) {
        // Edit existing product
        const { error } = await supabase
          .from('products')
          .update({
            name_fr: productData.nameFr,
            description_fr: productData.descriptionFr,
            price: parseInt(productData.price) || 0,
            category_id: productData.category,
            image: productData.image || '/placeholder.svg',
            product_code: productData.productCode
          })
          .eq('id', editingProduct.id);
        
        if (error) throw error;
      } else {
        // Add new product
        const { error } = await supabase
          .from('products')
          .insert({
            name_fr: productData.nameFr,
            name: productData.nameFr,
            description_fr: productData.descriptionFr,
            description: productData.descriptionFr,
            price: parseInt(productData.price) || 0,
            category_id: productData.category,
            image: productData.image || '/placeholder.svg',
            product_code: productData.productCode || `PC${Date.now()}`,
            product_id: `PROD${Date.now()}`,
            in_stock: true
          });
        
        if (error) throw error;
      }
      
      await fetchProducts();
      setEditingProduct(null);
      toast.success('Produit sauvegardé avec succès');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const deleteProduct = async (productId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);
        
        if (error) throw error;
        await fetchProducts();
        toast.success('Produit supprimé avec succès');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const saveCategory = async (categoryData: any) => {
    try {
      if (editingCategory && editingCategory.id) {
        // Edit existing category
        const { error } = await supabase
          .from('categories')
          .update({
            name_fr: categoryData.nameFr,
            name: categoryData.nameFr,
            description_fr: categoryData.descriptionFr,
            description: categoryData.descriptionFr,
            icon: categoryData.icon || '📦'
          })
          .eq('id', editingCategory.id);
        
        if (error) throw error;
      } else {
        // Add new category
        const { error } = await supabase
          .from('categories')
          .insert({
            name_fr: categoryData.nameFr,
            name: categoryData.nameFr,
            description_fr: categoryData.descriptionFr,
            description: categoryData.descriptionFr,
            icon: categoryData.icon || '📦'
          });
        
        if (error) throw error;
      }
      
      await fetchCategories();
      setEditingCategory(null);
      toast.success('Catégorie sauvegardée avec succès');
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const deleteCategory = async (categoryId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', categoryId);
        
        if (error) throw error;
        await fetchCategories();
        toast.success('Catégorie supprimée avec succès');
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const saveBundle = async (bundleData: any) => {
    try {
      if (editingBundle && editingBundle.id) {
        // Edit existing bundle
        const { error } = await supabase
          .from('bundles')
          .update({
            name: bundleData.name,
            name_fr: bundleData.name,
            description: bundleData.description,
            description_fr: bundleData.description,
            bundle_price: bundleData.bundlePrice,
            original_price: bundleData.originalPrice,
            savings: bundleData.savings,
            items: bundleData.items || [],
            procedures: bundleData.procedures || '10+',
            popular: bundleData.popular || false
          })
          .eq('id', editingBundle.id);
        
        if (error) throw error;
      } else {
        // Add new bundle
        const { error } = await supabase
          .from('bundles')
          .insert({
            name: bundleData.name,
            name_fr: bundleData.name,
            description: bundleData.description,
            description_fr: bundleData.description,
            bundle_price: bundleData.bundlePrice,
            original_price: bundleData.originalPrice,
            savings: bundleData.savings,
            items: bundleData.items || [],
            procedures: bundleData.procedures || '10+',
            popular: bundleData.popular || false
          });
        
        if (error) throw error;
      }
      
      await fetchBundles();
      setEditingBundle(null);
      toast.success('Kit sauvegardé avec succès');
    } catch (error) {
      console.error('Error saving bundle:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const deleteBundle = async (bundleId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce kit ?')) {
      try {
        const { error } = await supabase
          .from('bundles')
          .delete()
          .eq('id', bundleId);
        
        if (error) throw error;
        await fetchBundles();
        toast.success('Kit supprimé avec succès');
      } catch (error) {
        console.error('Error deleting bundle:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const downloadData = async (type: 'orders' | 'clients') => {
    try {
      let data, filename;
      
      if (type === 'orders') {
        data = orders;
        filename = 'commandes-dentgo.csv';
      } else {
        data = clients;
        filename = 'clients-dentgo.csv';
      }

      if (data.length === 0) {
        toast.error('Aucune donnée à télécharger');
        return;
      }

      const headers = Object.keys(data[0]).join(',');
      const csvContent = [
        headers,
        ...data.map(item => Object.values(item).map(val => `"${val}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Données téléchargées avec succès');
    } catch (error) {
      console.error('Error downloading data:', error);
      toast.error('Erreur lors du téléchargement');
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('admin.title')}</h1>

        {/* Navigation */}
        <div className="flex space-x-4 mb-8 flex-wrap">
          <Button 
            variant={activeTab === 'database' ? 'default' : 'outline'}
            onClick={() => setActiveTab('database')}
          >
            {t('admin.database')}
          </Button>
          <Button 
            variant={activeTab === 'orders' ? 'default' : 'outline'}
            onClick={() => setActiveTab('orders')}
          >
            {t('admin.orders')}
          </Button>
          <Button 
            variant={activeTab === 'clients' ? 'default' : 'outline'}
            onClick={() => setActiveTab('clients')}
          >
            {t('admin.clients')}
          </Button>
          <Button 
            variant={activeTab === 'products' ? 'default' : 'outline'}
            onClick={() => setActiveTab('products')}
          >
            {t('admin.products')}
          </Button>
          <Button 
            variant={activeTab === 'categories' ? 'default' : 'outline'}
            onClick={() => setActiveTab('categories')}
          >
            {t('admin.categories')}
          </Button>
          <Button 
            variant={activeTab === 'bundles' ? 'default' : 'outline'}
            onClick={() => setActiveTab('bundles')}
          >
            {t('admin.bundles')}
          </Button>
        </div>

        {/* Database Tab */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <DatabaseSeeder />
            
            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle>Gestion des données</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 flex-wrap">
                  <Button 
                    onClick={() => downloadData('orders')}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger les commandes
                  </Button>
                  <Button 
                    onClick={() => downloadData('clients')}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger les clients
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.orderManagement')}</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-muted-foreground">{t('admin.noOrders')}</p>
              ) : (
                <div className="space-y-6">
                  {orders.map((order: any) => {
                    const client = clients.find((c: any) => c.id === order.user_id);
                    const amountPaid = order.amount_paid || 0;
                    const remainingBalance = order.total_amount - amountPaid;
                    const paymentPercentage = (amountPaid / order.total_amount) * 100;
                    
                    return (
                      <div key={order.id} className="border rounded p-6 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h3 className="font-medium">Commande #{order.id.slice(0, 8)}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString('fr-FR')}
                            </p>
                            <p className="text-sm">
                              Client: {client?.full_name || 'Client introuvable'}
                            </p>
                            <p className="text-sm">
                              Cabinet: {client?.dental_office_name}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              {order.total_amount.toLocaleString()} DZD
                            </p>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-green-600">
                                Payé: {amountPaid.toLocaleString()} DZD ({paymentPercentage.toFixed(1)}%)
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Restant: {remainingBalance.toLocaleString()} DZD
                              </p>
                            </div>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              className="mt-2"
                              onClick={() => deleteOrder(order.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Supprimer
                            </Button>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-4">
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
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>Statut du paiement</Label>
                            <Select 
                              value={order.payment_status} 
                              onValueChange={(value: PaymentStatus) => updatePaymentStatus(order.id, value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">En attente</SelectItem>
                                <SelectItem value="partial">Partiel</SelectItem>
                                <SelectItem value="paid">Payé</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {order.payment_status === 'partial' && (
                            <div>
                              <Label>Ajouter paiement (DZD)</Label>
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  placeholder="Montant"
                                  value={partialPayments[order.id] || ''}
                                  onChange={(e) => setPartialPayments(prev => ({ 
                                    ...prev, 
                                    [order.id]: e.target.value 
                                  }))}
                                />
                                <Button 
                                  size="sm"
                                  onClick={() => {
                                    const amount = parseFloat(partialPayments[order.id] || '0');
                                    if (amount > 0) {
                                      updatePartialPayment(order.id, amount);
                                    }
                                  }}
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-medium">Produits:</h4>
                          {order.order_items?.map((item: any) => (
                            <div key={item.id} className="text-sm flex justify-between">
                              <span>{item.product_name} x{item.quantity}</span>
                              <span>{(item.product_price * item.quantity).toLocaleString()} DZD</span>
                            </div>
                          ))}
                          {order.order_bundles?.map((bundle: any) => (
                            <div key={bundle.id} className="text-sm flex justify-between">
                              <span>{bundle.bundle_name} x{bundle.quantity}</span>
                              <span>{(parseInt(bundle.bundle_price.replace(/[^0-9]/g, '')) * bundle.quantity).toLocaleString()} DZD</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.clientsRegistered')}</CardTitle>
            </CardHeader>
            <CardContent>
              {clients.length === 0 ? (
                <p className="text-muted-foreground">{t('admin.noClients')}</p>
              ) : (
                <div className="space-y-4">
                  {clients.map((client: any) => {
                    const clientOrders = orders.filter((order: any) => order.user_id === client.id);
                    const totalSpent = clientOrders.reduce((sum: number, order: any) => sum + (order.amount_paid || 0), 0);
                    const totalOrdered = clientOrders.reduce((sum: number, order: any) => sum + order.total_amount, 0);
                    const totalRemaining = totalOrdered - totalSpent;
                    
                    return (
                      <div key={client.id} className="border rounded p-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-medium">{client.full_name}</h3>
                            <p className="text-sm text-muted-foreground">{client.dental_office_name}</p>
                            <p className="text-sm">{client.email}</p>
                            <p className="text-sm">{client.phone}</p>
                            <p className="text-sm">{client.wilaya}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm"><strong>Commandes:</strong> {clientOrders.length}</p>
                            <p className="text-sm text-green-600"><strong>Total payé:</strong> {totalSpent.toLocaleString()} DZD</p>
                            <p className="text-sm text-muted-foreground"><strong>Total restant:</strong> {totalRemaining.toLocaleString()} DZD</p>
                            <p className="text-sm"><strong>Total commandé:</strong> {totalOrdered.toLocaleString()} DZD</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {t('admin.productManagement')}
                <Button onClick={() => setEditingProduct({})}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('admin.addProduct')}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingProduct && (
                <div className="border rounded p-4 mb-6">
                  <h3 className="font-medium mb-4">
                    {editingProduct.id ? 'Modifier produit' : 'Nouveau produit'}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nom français</Label>
                      <Input
                        value={editingProduct.nameFr || editingProduct.name_fr || ''}
                        onChange={(e) => setEditingProduct({...editingProduct, nameFr: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Code produit</Label>
                      <Input
                        value={editingProduct.productCode || editingProduct.product_code || ''}
                        onChange={(e) => setEditingProduct({...editingProduct, productCode: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Prix (DZD)</Label>
                      <Input
                        type="number"
                        value={editingProduct.price || ''}
                        onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Catégorie</Label>
                      <Select
                        value={editingProduct.category || editingProduct.category_id || ''}
                        onValueChange={(value) => setEditingProduct({...editingProduct, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name_fr}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label>Description française</Label>
                      <Textarea
                        value={editingProduct.descriptionFr || editingProduct.description_fr || ''}
                        onChange={(e) => setEditingProduct({...editingProduct, descriptionFr: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>URL de l'image</Label>
                      <Input
                        value={editingProduct.image || ''}
                        onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                        placeholder="/placeholder.svg"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => saveProduct(editingProduct)}>
                      {t('common.save')}
                    </Button>
                    <Button variant="outline" onClick={() => setEditingProduct(null)}>
                      {t('common.cancel')}
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {products.map((product: any) => (
                  <div key={product.id} className="border rounded p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{product.name_fr}</h3>
                      <p className="text-sm text-muted-foreground">Code: {product.product_code}</p>
                      <p className="text-sm">{product.price.toLocaleString()} DZD</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingProduct(product)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteProduct(product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {t('admin.categoryManagement')}
                <Button onClick={() => setEditingCategory({})}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('admin.addCategory')}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingCategory && (
                <div className="border rounded p-4 mb-6">
                  <h3 className="font-medium mb-4">
                    {editingCategory.id ? 'Modifier catégorie' : 'Nouvelle catégorie'}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nom français</Label>
                      <Input
                        value={editingCategory.nameFr || editingCategory.name_fr || ''}
                        onChange={(e) => setEditingCategory({...editingCategory, nameFr: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Icône (emoji)</Label>
                      <Input
                        value={editingCategory.icon || ''}
                        onChange={(e) => setEditingCategory({...editingCategory, icon: e.target.value})}
                        placeholder="🦷"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Description française</Label>
                      <Textarea
                        value={editingCategory.descriptionFr || editingCategory.description_fr || ''}
                        onChange={(e) => setEditingCategory({...editingCategory, descriptionFr: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => saveCategory(editingCategory)}>
                      {t('common.save')}
                    </Button>
                    <Button variant="outline" onClick={() => setEditingCategory(null)}>
                      {t('common.cancel')}
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {categories.map((category: any) => (
                  <div key={category.id} className="border rounded p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        <span className="text-2xl">{category.icon}</span>
                        {category.name_fr}
                      </h3>
                      <p className="text-sm text-muted-foreground">{category.description_fr}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingCategory(category)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteCategory(category.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bundles Tab */}
        {activeTab === 'bundles' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {t('admin.bundleManagement')}
                <Button onClick={() => setEditingBundle({ items: [] })}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('admin.addBundle')}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingBundle && (
                <div className="border rounded p-4 mb-6">
                  <h3 className="font-medium mb-4">
                    {editingBundle.id ? 'Modifier kit' : 'Nouveau kit'}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nom du kit</Label>
                      <Input
                        value={editingBundle.name || editingBundle.name_fr || ''}
                        onChange={(e) => setEditingBundle({...editingBundle, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Prix du kit</Label>
                      <Input
                        value={editingBundle.bundlePrice || editingBundle.bundle_price || ''}
                        onChange={(e) => setEditingBundle({...editingBundle, bundlePrice: e.target.value})}
                        placeholder="18,900 DZD"
                      />
                    </div>
                    <div>
                      <Label>Prix original</Label>
                      <Input
                        value={editingBundle.originalPrice || editingBundle.original_price || ''}
                        onChange={(e) => setEditingBundle({...editingBundle, originalPrice: e.target.value})}
                        placeholder="24,500 DZD"
                      />
                    </div>
                    <div>
                      <Label>Économies</Label>
                      <Input
                        value={editingBundle.savings || ''}
                        onChange={(e) => setEditingBundle({...editingBundle, savings: e.target.value})}
                        placeholder="5,600 DZD"
                      />
                    </div>
                    <div>
                      <Label>Procédures</Label>
                      <Input
                        value={editingBundle.procedures || ''}
                        onChange={(e) => setEditingBundle({...editingBundle, procedures: e.target.value})}
                        placeholder="20+ procedures"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="popular"
                        checked={editingBundle.popular || false}
                        onChange={(e) => setEditingBundle({...editingBundle, popular: e.target.checked})}
                      />
                      <Label htmlFor="popular">Kit populaire</Label>
                    </div>
                    <div className="md:col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        value={editingBundle.description || editingBundle.description_fr || ''}
                        onChange={(e) => setEditingBundle({...editingBundle, description: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Articles inclus (un par ligne)</Label>
                      <Textarea
                        value={editingBundle.items?.join('\n') || ''}
                        onChange={(e) => setEditingBundle({...editingBundle, items: e.target.value.split('\n').filter(item => item.trim())})}
                        placeholder="Matériaux de restauration composite (3 teintes)&#10;Agent de liaison&#10;Gel de mordançage"
                        rows={6}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => saveBundle(editingBundle)}>
                      {t('common.save')}
                    </Button>
                    <Button variant="outline" onClick={() => setEditingBundle(null)}>
                      {t('common.cancel')}
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {bundles.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Aucun kit créé. Cliquez sur "Ajouter kit" pour commencer.
                  </p>
                ) : (
                  bundles.map((bundle: any) => (
                    <div key={bundle.id} className="border rounded p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{bundle.name_fr || bundle.name}</h3>
                        <p className="text-sm text-muted-foreground">{bundle.description_fr || bundle.description}</p>
                        <p className="text-sm">Prix: {bundle.bundle_price}</p>
                        <p className="text-xs text-muted-foreground">{bundle.items?.length || 0} article(s) inclus</p>
                        {bundle.popular && <Badge className="mt-1">Populaire</Badge>}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingBundle(bundle)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deleteBundle(bundle.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
