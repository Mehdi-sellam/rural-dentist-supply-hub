import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { products, categories } from '@/data/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [partialPayments, setPartialPayments] = useState<{[key: string]: string}>({});
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingBundle, setEditingBundle] = useState<any>(null);

  if (!user || !user.isAdmin) {
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

  const savedOrders = JSON.parse(localStorage.getItem('dentgo_orders') || '[]');
  const savedUsers = JSON.parse(localStorage.getItem('dentgo_users') || '[]');
  const savedProducts = JSON.parse(localStorage.getItem('dentgo_products') || JSON.stringify(products));
  const savedCategories = JSON.parse(localStorage.getItem('dentgo_categories') || JSON.stringify(categories));
  const savedBundles = JSON.parse(localStorage.getItem('dentgo_bundles') || '[]');

  const updateOrderStatus = (orderId: string, status: string) => {
    const orders = savedOrders.map((order: any) => 
      order.id === orderId ? { ...order, status } : order
    );
    localStorage.setItem('dentgo_orders', JSON.stringify(orders));
    toast.success('Statut mis à jour');
    window.location.reload();
  };

  const updatePaymentStatus = (orderId: string, paymentStatus: string) => {
    const orders = savedOrders.map((order: any) => 
      order.id === orderId ? { ...order, paymentStatus } : order
    );
    localStorage.setItem('dentgo_orders', JSON.stringify(orders));
    toast.success('Statut de paiement mis à jour');
    window.location.reload();
  };

  const updatePartialPayment = (orderId: string, amountPaid: number) => {
    const orders = savedOrders.map((order: any) => {
      if (order.id === orderId) {
        const existingPaid = order.amountPaid || 0;
        const newAmountPaid = existingPaid + amountPaid;
        const remainingBalance = order.totalAmount - newAmountPaid;
        
        return { 
          ...order, 
          amountPaid: newAmountPaid,
          remainingBalance: remainingBalance,
          paymentStatus: remainingBalance <= 0 ? 'paid' : 'partial'
        };
      }
      return order;
    });
    localStorage.setItem('dentgo_orders', JSON.stringify(orders));
    toast.success('Paiement partiel enregistré');
    setPartialPayments(prev => ({ ...prev, [orderId]: '' }));
    window.location.reload();
  };

  const saveProduct = (productData: any) => {
    const products = [...savedProducts];
    if (editingProduct) {
      const index = products.findIndex(p => p.id === editingProduct.id);
      products[index] = { ...editingProduct, ...productData };
    } else {
      const newProduct = {
        id: Date.now().toString(),
        productId: `PROD${Date.now()}`,
        productCode: productData.productCode,
        ...productData
      };
      products.push(newProduct);
    }
    localStorage.setItem('dentgo_products', JSON.stringify(products));
    setEditingProduct(null);
    toast.success('Produit sauvegardé');
    window.location.reload();
  };

  const deleteProduct = (productId: string) => {
    const products = savedProducts.filter((p: any) => p.id !== productId);
    localStorage.setItem('dentgo_products', JSON.stringify(products));
    toast.success('Produit supprimé');
    window.location.reload();
  };

  const saveCategory = (categoryData: any) => {
    const categories = [...savedCategories];
    if (editingCategory) {
      const index = categories.findIndex(c => c.id === editingCategory.id);
      categories[index] = { ...editingCategory, ...categoryData };
    } else {
      const newCategory = {
        id: Date.now().toString(),
        ...categoryData
      };
      categories.push(newCategory);
    }
    localStorage.setItem('dentgo_categories', JSON.stringify(categories));
    setEditingCategory(null);
    toast.success('Catégorie sauvegardée');
    window.location.reload();
  };

  const deleteCategory = (categoryId: string) => {
    const categories = savedCategories.filter((c: any) => c.id !== categoryId);
    localStorage.setItem('dentgo_categories', JSON.stringify(categories));
    toast.success('Catégorie supprimée');
    window.location.reload();
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Administration</h1>

        {/* Navigation */}
        <div className="flex space-x-4 mb-8 flex-wrap">
          <Button 
            variant={activeTab === 'orders' ? 'default' : 'outline'}
            onClick={() => setActiveTab('orders')}
          >
            Commandes
          </Button>
          <Button 
            variant={activeTab === 'clients' ? 'default' : 'outline'}
            onClick={() => setActiveTab('clients')}
          >
            Clients
          </Button>
          <Button 
            variant={activeTab === 'products' ? 'default' : 'outline'}
            onClick={() => setActiveTab('products')}
          >
            Produits
          </Button>
          <Button 
            variant={activeTab === 'categories' ? 'default' : 'outline'}
            onClick={() => setActiveTab('categories')}
          >
            Catégories
          </Button>
          <Button 
            variant={activeTab === 'bundles' ? 'default' : 'outline'}
            onClick={() => setActiveTab('bundles')}
          >
            Kits
          </Button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <Card>
            <CardHeader>
              <CardTitle>Gestion des commandes</CardTitle>
            </CardHeader>
            <CardContent>
              {savedOrders.length === 0 ? (
                <p className="text-muted-foreground">Aucune commande trouvée.</p>
              ) : (
                <div className="space-y-6">
                  {savedOrders.map((order: any) => {
                    const customer = savedUsers.find((u: any) => u.id === order.userId);
                    const amountPaid = order.amountPaid || 0;
                    const remainingBalance = order.totalAmount - amountPaid;
                    const paymentPercentage = (amountPaid / order.totalAmount) * 100;
                    
                    return (
                      <div key={order.id} className="border rounded p-6 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h3 className="font-medium">Commande #{order.id}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                            <p className="text-sm">
                              Client: {customer?.fullName || 'Client introuvable'}
                            </p>
                            <p className="text-sm">
                              Cabinet: {customer?.dentalOfficeName}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              {order.totalAmount.toLocaleString()} DZD
                            </p>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-green-600">
                                Payé: {amountPaid.toLocaleString()} DZD ({paymentPercentage.toFixed(1)}%)
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Restant: {remainingBalance.toLocaleString()} DZD
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <Label>Statut de la commande</Label>
                            <Select 
                              value={order.status} 
                              onValueChange={(value) => updateOrderStatus(order.id, value)}
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
                              value={order.paymentStatus} 
                              onValueChange={(value) => updatePaymentStatus(order.id, value)}
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

                          {order.paymentStatus === 'partial' && (
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
                          {order.items.map((item: any) => (
                            <div key={item.id} className="text-sm flex justify-between">
                              <span>{item.name} x{item.quantity}</span>
                              <span>{(item.price * item.quantity).toLocaleString()} DZD</span>
                            </div>
                          ))}
                          {order.bundles.map((bundle: any) => (
                            <div key={bundle.id} className="text-sm flex justify-between">
                              <span>{bundle.name} x{bundle.quantity}</span>
                              <span>{(parseInt(bundle.bundlePrice.replace(/[^0-9]/g, '')) * bundle.quantity).toLocaleString()} DZD</span>
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
              <CardTitle>Clients enregistrés</CardTitle>
            </CardHeader>
            <CardContent>
              {savedUsers.length === 0 ? (
                <p className="text-muted-foreground">Aucun client enregistré.</p>
              ) : (
                <div className="space-y-4">
                  {savedUsers.map((client: any) => {
                    const clientOrders = savedOrders.filter((order: any) => order.userId === client.id);
                    const totalSpent = clientOrders.reduce((sum: number, order: any) => sum + (order.amountPaid || 0), 0);
                    const totalOrdered = clientOrders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);
                    const totalRemaining = totalOrdered - totalSpent;
                    
                    return (
                      <div key={client.id} className="border rounded p-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-medium">{client.fullName}</h3>
                            <p className="text-sm text-muted-foreground">{client.dentalOfficeName}</p>
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
                Gestion des produits
                <Button onClick={() => setEditingProduct({})}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter produit
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
                        value={editingProduct.nameFr || ''}
                        onChange={(e) => setEditingProduct({...editingProduct, nameFr: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Code produit</Label>
                      <Input
                        value={editingProduct.productCode || ''}
                        onChange={(e) => setEditingProduct({...editingProduct, productCode: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Prix (DZD)</Label>
                      <Input
                        type="number"
                        value={editingProduct.price || ''}
                        onChange={(e) => setEditingProduct({...editingProduct, price: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Catégorie</Label>
                      <Select
                        value={editingProduct.category || ''}
                        onValueChange={(value) => setEditingProduct({...editingProduct, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {savedCategories.map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.nameFr}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label>Description française</Label>
                      <Textarea
                        value={editingProduct.descriptionFr || ''}
                        onChange={(e) => setEditingProduct({...editingProduct, descriptionFr: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>URL de l'image</Label>
                      <Input
                        value={editingProduct.image || ''}
                        onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => saveProduct(editingProduct)}>
                      Sauvegarder
                    </Button>
                    <Button variant="outline" onClick={() => setEditingProduct(null)}>
                      Annuler
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {savedProducts.map((product: any) => (
                  <div key={product.id} className="border rounded p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{product.nameFr}</h3>
                      <p className="text-sm text-muted-foreground">Code: {product.productCode}</p>
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
                Gestion des catégories
                <Button onClick={() => setEditingCategory({})}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter catégorie
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
                        value={editingCategory.nameFr || ''}
                        onChange={(e) => setEditingCategory({...editingCategory, nameFr: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Icône (emoji)</Label>
                      <Input
                        value={editingCategory.icon || ''}
                        onChange={(e) => setEditingCategory({...editingCategory, icon: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Description française</Label>
                      <Textarea
                        value={editingCategory.descriptionFr || ''}
                        onChange={(e) => setEditingCategory({...editingCategory, descriptionFr: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => saveCategory(editingCategory)}>
                      Sauvegarder
                    </Button>
                    <Button variant="outline" onClick={() => setEditingCategory(null)}>
                      Annuler
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {savedCategories.map((category: any) => (
                  <div key={category.id} className="border rounded p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        <span className="text-2xl">{category.icon}</span>
                        {category.nameFr}
                      </h3>
                      <p className="text-sm text-muted-foreground">{category.descriptionFr}</p>
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
              <CardTitle>Gestion des kits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Fonctionnalité de gestion des kits à implémenter.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
