import { useState, useEffect } from 'react';
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
import { Plus, Edit, Trash2, Download, Upload, Eye, X, Search, Calendar } from 'lucide-react';
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

const sb: any = supabase;

const AdminDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Search states
  const [productSearch, setProductSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [bundleSearch, setBundleSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  
  // Client search states
  const [clientSearch, setClientSearch] = useState('');
  const [clientDateFilter, setClientDateFilter] = useState('');
  
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
  const [editingPartialFor, setEditingPartialFor] = useState<string | null>(null);
  
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

  // Messages state
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [response, setResponse] = useState('');

  // Clear form functions
  const clearProductForm = () => {
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
    setEditingProduct(null);
  };

  const clearCategoryForm = () => {
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
    setEditingCategory(null);
  };

  const clearBundleForm = () => {
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
    setEditingBundle(null);
  };

  useEffect(() => {
    if (!user || !profile?.is_admin) {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, profile, navigate]);

  const fetchData = async () => {
    try {
      console.log('Fetching data...');
      // Fetch all data
      const [productsRes, categoriesRes, bundlesRes, ordersRes, clientsRes] = await Promise.all([
        sb.from('products').select('*, categories(name_fr)'),
        sb.from('categories').select('*'),
        sb.from('bundles').select('*'),
        sb.from('orders').select('*, profiles(full_name, dental_office_name)'),
        sb.from('profiles').select('*').eq('is_admin', false)
      ]);

      console.log('Orders response:', ordersRes);

      if (productsRes.error) {
        console.error('Products error:', productsRes.error);
        throw productsRes.error;
      }
      if (categoriesRes.error) {
        console.error('Categories error:', categoriesRes.error);
        throw categoriesRes.error;
      }
      if (bundlesRes.error) {
        console.error('Bundles error:', bundlesRes.error);
        throw bundlesRes.error;
      }
      if (ordersRes.error) {
        console.error('Orders error:', ordersRes.error);
        throw ordersRes.error;
      }
      if (clientsRes.error) {
        console.error('Clients error:', clientsRes.error);
        throw clientsRes.error;
      }

      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
      setBundles(bundlesRes.data || []);
      setOrders(ordersRes.data || []);
      setClients(clientsRes.data || []);

      console.log('Data fetched successfully:', {
        products: productsRes.data?.length,
        categories: categoriesRes.data?.length,
        bundles: bundlesRes.data?.length,
        orders: ordersRes.data?.length,
        clients: clientsRes.data?.length
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement des données');
    }
  };

  // Search filter functions with error handling
  const filteredProducts = products.filter(product => {
    try {
      return product.name_fr?.toLowerCase().includes(productSearch.toLowerCase()) ||
        product.product_code?.toLowerCase().includes(productSearch.toLowerCase()) ||
        product.categories?.name_fr?.toLowerCase().includes(productSearch.toLowerCase());
    } catch (error) {
      console.error('Error filtering products:', error);
      return true;
    }
  });

  const filteredCategories = categories.filter(category => {
    try {
      return category.name_fr?.toLowerCase().includes(categorySearch.toLowerCase()) ||
        category.description_fr?.toLowerCase().includes(categorySearch.toLowerCase());
    } catch (error) {
      console.error('Error filtering categories:', error);
      return true;
    }
  });

  const filteredBundles = bundles.filter(bundle => {
    try {
      return bundle.name_fr?.toLowerCase().includes(bundleSearch.toLowerCase()) ||
        bundle.name?.toLowerCase().includes(bundleSearch.toLowerCase()) ||
        bundle.description_fr?.toLowerCase().includes(bundleSearch.toLowerCase());
    } catch (error) {
      console.error('Error filtering bundles:', error);
      return true;
    }
  });

  const filteredOrders = orders.filter(order => {
    try {
      const matchesText = !orderSearch || 
        order.id?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.profiles?.full_name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.profiles?.dental_office_name?.toLowerCase().includes(orderSearch.toLowerCase());
      
      const matchesOrderStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
      const matchesPaymentStatus = paymentStatusFilter === 'all' || order.payment_status === paymentStatusFilter;
      
      return matchesText && matchesOrderStatus && matchesPaymentStatus;
    } catch (error) {
      console.error('Error filtering orders:', error, order);
      return true;
    }
  });

  // Enhanced client filtering function
  const filteredClients = clients.filter(client => {
    try {
      // Text search filter - now includes address
      const matchesText = !clientSearch || 
        client.full_name?.toLowerCase().includes(clientSearch.toLowerCase()) ||
        client.dental_office_name?.toLowerCase().includes(clientSearch.toLowerCase()) ||
        client.email?.toLowerCase().includes(clientSearch.toLowerCase()) ||
        client.phone?.toLowerCase().includes(clientSearch.toLowerCase()) ||
        client.wilaya?.toLowerCase().includes(clientSearch.toLowerCase()) ||
        client.address?.toLowerCase().includes(clientSearch.toLowerCase());
      
      // Date filter
      const matchesDate = !clientDateFilter || (() => {
        if (!client.created_at) return false;
        const clientDate = new Date(client.created_at);
        const [year, month] = clientDateFilter.split('-');
        return clientDate.getFullYear().toString() === year && 
               (clientDate.getMonth() + 1).toString().padStart(2, '0') === month;
      })();
      
      return matchesText && matchesDate;
    } catch (error) {
      console.error('Error filtering clients:', error, client);
      return true;
    }
  });

  // Cancel order function
  const cancelOrder = async (orderId: string) => {
    try {
      console.log('Cancelling order:', orderId);
      
      const { error } = await sb
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);

      if (error) throw error;
      
      // Update local state instead of refetching all data
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      ));
      
      toast.success('Commande annulée avec succès');
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Erreur lors de l\'annulation de la commande');
    }
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    setUploadingImage(true);
    try {
      const { data, error } = await sb.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: urlData } = sb.storage
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
      console.log('Updating order status:', orderId, status);
      
      const { error } = await sb
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      
      // Update local state instead of refetching all data
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      
      toast.success('Statut de commande mis à jour');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Erreur lors de la mise à jour du statut de commande');
    }
  };

  const updatePaymentStatus = async (
    orderId: string,
    paymentStatus: PaymentStatus,
    partialAmount?: number
  ) => {
    try {
      const order = orders.find((o) => o.id === orderId);
      if (!order) throw new Error('Order not found');

      let updateData: any = { payment_status: paymentStatus };
      let newPartialHistory = Array.isArray(order.partial_payment_history) ? order.partial_payment_history : [];

      if (paymentStatus === 'partial' && partialAmount) {
        // Add to amount_paid, append to partial_payment_history
        const newAmountPaid = (order.amount_paid || 0) + partialAmount;
        updateData.amount_paid = newAmountPaid;
        updateData.partial_payment_history = [
          ...newPartialHistory,
          {
            amount: partialAmount,
            date: new Date().toISOString(),
            by: user?.id || 'admin',
          },
        ];
      } else if (paymentStatus === 'paid') {
        updateData.amount_paid = order.total_amount;
        updateData.partial_payment_history = [];
      } else if (paymentStatus === 'pending' || paymentStatus === 'refunded') {
        updateData.amount_paid = 0;
        updateData.partial_payment_history = [];
      }

      // remaining_balance is a generated column, so no need to update manually

      const { error } = await sb
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, ...updateData } : order
        )
      );

      toast.success('Statut de paiement mis à jour');
    } catch (error) {
      console.error('[updatePaymentStatus] Error:', error);
      toast.error('Erreur lors de la mise à jour du statut de paiement');
    }
  };

  const handlePaymentStatusChange = async (orderId: string, paymentStatus: PaymentStatus) => {
    try {
      // If setting payment status to pending, cancelled, or refunded, cancel the order
      if (paymentStatus === 'pending' || paymentStatus === 'refunded') {
        await cancelOrder(orderId);
      } else {
        await updatePaymentStatus(orderId, paymentStatus);
      }
    } catch (error) {
      console.error('Error handling payment status change:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handlePartialPaymentSubmit = (orderId: string) => {
    const amount = parseFloat(partialPaymentAmount[orderId] || '0');
    console.log(`[Partial Submit] Order: ${orderId}, Entered amount: ${amount}`);
    if (amount > 0) {
      updatePaymentStatus(orderId, 'partial', amount);
      setEditingPartialFor(null);
    } else {
      toast.error('Veuillez entrer un montant valide');
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

  const getProductNames = (productIds: string[]) => {
    return products
      .filter(product => productIds.includes(product.id))
      .map(product => product.name_fr || product.name)
      .join(', ');
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name || '',
      name_fr: product.name_fr || '',
      name_ar: product.name_ar || '',
      description: product.description || '',
      description_fr: product.description_fr || '',
      description_ar: product.description_ar || '',
      price: product.price?.toString() || '',
      original_price: product.original_price?.toString() || '',
      product_code: product.product_code || '',
      product_id: product.product_id || '',
      category_id: product.category_id || '',
      image: product.image || '/placeholder.svg',
      in_stock: product.in_stock ?? true,
      badge: product.badge || '',
      specifications: product.specifications || []
    });
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct || !newProduct.name_fr || !newProduct.price || !newProduct.product_code || !newProduct.category_id) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      let imageUrl = newProduct.image;
      
      if (productImageFile) {
        const fileName = `products/${Date.now()}_${productImageFile.name}`;
        imageUrl = await uploadFile(productImageFile, 'product-images', fileName);
      }

      const { error } = await sb
        .from('products')
        .update({
          ...newProduct,
          name: newProduct.name_fr,
          description: newProduct.description_fr,
          price: parseFloat(newProduct.price),
          original_price: newProduct.original_price ? parseFloat(newProduct.original_price) : null,
          image: imageUrl
        })
        .eq('id', editingProduct.id);

      if (error) throw error;

      clearProductForm();
      fetchData();
      toast.success('Produit mis à jour avec succès');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Erreur lors de la mise à jour du produit');
    }
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name || '',
      name_fr: category.name_fr || '',
      name_ar: category.name_ar || '',
      description: category.description || '',
      description_fr: category.description_fr || '',
      description_ar: category.description_ar || '',
      icon: category.icon || '📦',
      color: category.color || ''
    });
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !newCategory.name_fr) {
      toast.error('Veuillez remplir le nom de la catégorie');
      return;
    }

    try {
      let iconUrl = newCategory.icon;
      
      if (categoryIconFile) {
        const fileName = `categories/${Date.now()}_${categoryIconFile.name}`;
        iconUrl = await uploadFile(categoryIconFile, 'category-icons', fileName);
      }
      
      const { error } = await sb
        .from('categories')
        .update({
          ...newCategory,
          name: newCategory.name_fr,
          description: newCategory.description_fr,
          icon: iconUrl
        })
        .eq('id', editingCategory.id);

      if (error) throw error;

      clearCategoryForm();
      fetchData();
      toast.success('Catégorie mise à jour avec succès');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Erreur lors de la mise à jour de la catégorie');
    }
  };

  const handleEditBundle = (bundle: any) => {
    setEditingBundle(bundle);
    setNewBundle({
      name: bundle.name || '',
      name_fr: bundle.name_fr || '',
      name_ar: bundle.name_ar || '',
      description: bundle.description || '',
      description_fr: bundle.description_fr || '',
      description_ar: bundle.description_ar || '',
      bundle_price: bundle.bundle_price || '',
      original_price: bundle.original_price || '',
      items: bundle.items || [],
      procedures: bundle.procedures || '10+',
      savings: bundle.savings || '',
      popular: bundle.popular || false,
      badge: bundle.badge || '',
      sub_description: bundle.sub_description || '',
      selectedProducts: bundle.items || []
    });
  };

  const handleUpdateBundle = async () => {
    if (!editingBundle || !newBundle.name_fr || !newBundle.bundle_price || !newBundle.original_price) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const savings = calculateSavings(newBundle.original_price, newBundle.bundle_price);
      
      const { error } = await sb
        .from('bundles')
        .update({
          name: newBundle.name_fr,
          name_fr: newBundle.name_fr,
          name_ar: newBundle.name_ar,
          description: newBundle.description_fr,
          description_fr: newBundle.description_fr,
          description_ar: newBundle.description_ar,
          bundle_price: newBundle.bundle_price,
          original_price: newBundle.original_price,
          items: newBundle.selectedProducts,
          procedures: newBundle.procedures,
          savings,
          popular: newBundle.popular,
          badge: newBundle.badge,
          sub_description: newBundle.sub_description
        })
        .eq('id', editingBundle.id);

      if (error) throw error;

      clearBundleForm();
      fetchData();
      toast.success('Kit mis à jour avec succès');
    } catch (error) {
      console.error('Error updating bundle:', error);
      toast.error('Erreur lors de la mise à jour du kit');
    }
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

      // Generate a unique product_id if not provided
      const productId = newProduct.product_id || generateUniqueProductId();

      const { error } = await sb
        .from('products')
        .insert({
          ...newProduct,
          name: newProduct.name_fr,
          description: newProduct.description_fr,
          price: parseFloat(newProduct.price),
          original_price: newProduct.original_price ? parseFloat(newProduct.original_price) : null,
          image: imageUrl,
          product_id: productId
        });

      if (error) {
        console.error('Error adding product:', error);
        if (error.code === '23505' && error.message.includes('product_id_key')) {
          toast.error('Cet ID produit existe déjà. Veuillez en choisir un autre ou laisser vide pour génération automatique.');
        } else if (error.code === '23505' && error.message.includes('product_code_key')) {
          toast.error('Ce code produit existe déjà. Veuillez en choisir un autre.');
        } else {
          toast.error('Erreur lors de l\'ajout du produit: ' + (error.message || 'Erreur inconnue'));
        }
        return;
      }

      clearProductForm();
      fetchData();
      toast.success('Produit ajouté avec succès');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Erreur lors de l\'ajout du produit');
    }
  };

  const generateUniqueProductId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `PRD-${timestamp}-${random}`;
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
      
      const { error } = await sb
        .from('categories')
        .insert({
          ...newCategory,
          name: newCategory.name_fr,
          description: newCategory.description_fr,
          color: categoryColor,
          icon: iconUrl
        });

      if (error) throw error;

      clearCategoryForm();
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
      
      const { error } = await sb
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
          items: newBundle.selectedProducts,
          procedures: newBundle.procedures,
          savings,
          popular: newBundle.popular,
          badge: newBundle.badge,
          sub_description: newBundle.sub_description
        });

      if (error) throw error;

      clearBundleForm();
      fetchData();
      toast.success('Kit ajouté avec succès');
    } catch (error) {
      console.error('Error adding bundle:', error);
      toast.error('Erreur lors de l\'ajout du kit');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await sb
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
      const { error } = await sb
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
      const { error } = await sb
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

  const getOrderStatusBadge = (status: string) => {
    try {
      switch (status) {
        case 'pending': return <Badge variant="outline">En attente</Badge>;
        case 'confirmed': return <Badge className="bg-blue-500">Confirmée</Badge>;
        case 'shipped': return <Badge className="bg-orange-500">Expédiée</Badge>;
        case 'delivered': return <Badge className="bg-green-500">Livrée</Badge>;
        case 'cancelled': return <Badge variant="destructive">Annulée</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
      }
    } catch (error) {
      console.error('Error creating order status badge:', error);
      return <Badge variant="outline">-</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    try {
      switch (status) {
        case 'pending': return <Badge variant="outline">En attente</Badge>;
        case 'partial': return <Badge className="bg-orange-500">Partiel</Badge>;
        case 'paid': return <Badge className="bg-green-500">Payé</Badge>;
        case 'refunded': return <Badge variant="destructive">Remboursé</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
      }
    } catch (error) {
      console.error('Error creating payment status badge:', error);
      return <Badge variant="outline">-</Badge>;
    }
  };

  const fetchMessages = async () => {
    const { data, error: fetchError } = await sb
      .from('messages')
      .select('*, message_responses(*)')
      .order('created_at', { ascending: false });
    if (!fetchError) setMessages(data || []);
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleRespond = async () => {
    if (!selectedMessage || !response) return;
    const { error: respondError } = await sb.from('message_responses').insert([
      { message_id: selectedMessage.id, responder_id: user.id, response }
    ]);
    if (!respondError) {
      setResponse('');
      fetchMessages();
      toast.success('Réponse envoyée !');
    }
  };

  if (!user || !profile?.is_admin) {
    return null;
  }

  console.log('Rendering AdminDashboard, orders count:', orders.length);

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
            <TabsTrigger value="messages">Messages</TabsTrigger>
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
                  {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
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
                    <Label>ID produit (optionnel)</Label>
                    <Input
                      value={newProduct.product_id}
                      onChange={(e) => setNewProduct({...newProduct, product_id: e.target.value})}
                      placeholder="Laissez vide pour génération automatique"
                    />
                    <p className="text-xs text-gray-500 mt-1">Si vide, un ID unique sera généré automatiquement</p>
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
                <div className="flex gap-2">
                  <Button onClick={editingProduct ? handleUpdateProduct : handleAddProduct} disabled={uploadingImage}>
                    <Plus className="w-4 h-4 mr-2" />
                    {uploadingImage ? 'Téléchargement...' : editingProduct ? 'Mettre à jour le produit' : 'Ajouter le produit'}
                  </Button>
                  <Button variant="outline" onClick={clearProductForm}>
                    <X className="w-4 h-4 mr-2" />
                    Vider les champs
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Products List with Search */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Liste des produits ({filteredProducts.length})</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Rechercher des produits..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <h3 className="font-medium">{product.name_fr}</h3>
                        <p className="text-sm text-gray-600">Code: {product.product_code}</p>
                        <p className="text-sm text-gray-600">Prix: {product.price.toLocaleString()} DZD</p>
                        <p className="text-sm text-gray-600">Catégorie: {product.categories?.name_fr || 'Non catégorisé'}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
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
                  {editingCategory ? 'Modifier la catégorie' : 'Ajouter une nouvelle catégorie'}
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
                <div className="flex gap-2">
                  <Button onClick={editingCategory ? handleUpdateCategory : handleAddCategory} disabled={uploadingImage}>
                    <Plus className="w-4 h-4 mr-2" />
                    {uploadingImage ? 'Téléchargement...' : editingCategory ? 'Mettre à jour la catégorie' : 'Ajouter la catégorie'}
                  </Button>
                  <Button variant="outline" onClick={clearCategoryForm}>
                    <X className="w-4 h-4 mr-2" />
                    Vider les champs
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Categories List with Search */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Liste des catégories ({filteredCategories.length})</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Rechercher des catégories..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCategories.map((category) => (
                    <div key={category.id} className={`p-4 border rounded bg-gradient-to-br ${category.color}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-2xl">{category.icon}</div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
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

          {/* Enhanced Bundles Tab with Grid View */}
          <TabsContent value="bundles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {editingBundle ? 'Modifier le kit' : 'Ajouter un nouveau kit'}
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

                <div className="flex gap-2">
                  <Button onClick={editingBundle ? handleUpdateBundle : handleAddBundle} disabled={newBundle.selectedProducts.length === 0}>
                    <Plus className="w-4 h-4 mr-2" />
                    {editingBundle ? 'Mettre à jour le kit' : 'Ajouter le kit'}
                  </Button>
                  <Button variant="outline" onClick={clearBundleForm}>
                    <X className="w-4 h-4 mr-2" />
                    Vider les champs
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Bundles Grid with Search */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Liste des kits ({filteredBundles.length})</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Rechercher des kits..."
                      value={bundleSearch}
                      onChange={(e) => setBundleSearch(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBundles.map((bundle) => (
                    <div key={bundle.id} className="p-4 border rounded bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex gap-2">
                          {bundle.popular && <Badge variant="secondary">Populaire</Badge>}
                          {bundle.badge && <Badge variant="outline">{bundle.badge}</Badge>}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditBundle(bundle)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteBundle(bundle.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <h3 className="font-medium mb-2">{bundle.name_fr || bundle.name}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Prix: {bundle.bundle_price}</p>
                        <p>Prix original: {bundle.original_price}</p>
                        <p>Économies: {bundle.calculated_savings ? `${bundle.calculated_savings.toLocaleString()} DZD` : bundle.savings}</p>
                        <p>Procédures: {bundle.procedures}</p>
                        {bundle.sub_description && <p className="text-muted-foreground">{bundle.sub_description}</p>}
                        <p className="truncate">Produits: {getProductNames(bundle.items || [])}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Orders Tab with Fixes */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Commandes ({filteredOrders.length})</CardTitle>
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Rechercher des commandes..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Statut commande" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="confirmed">Confirmée</SelectItem>
                        <SelectItem value="shipped">Expédiée</SelectItem>
                        <SelectItem value="delivered">Livrée</SelectItem>
                        <SelectItem value="cancelled">Annulée</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Statut paiement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les paiements</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="partial">Partiel</SelectItem>
                        <SelectItem value="paid">Payé</SelectItem>
                        <SelectItem value="refunded">Remboursé</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={() => downloadData(orders, 'orders.csv')} variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucune commande trouvée
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredOrders.map((order) => {
                      try {
                        const remainingAmount = (order.total_amount || 0) - (order.amount_paid || 0);
                        
                        return (
                          <Card key={order.id} className="border">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">#{order.id?.slice(0, 8) || 'N/A'}</h3>
                                    <p className="text-sm text-gray-600">{order.profiles?.full_name || 'N/A'}</p>
                                    <p className="text-xs text-gray-500">{order.profiles?.dental_office_name || 'N/A'}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">{(order.total_amount || 0).toLocaleString()} DZD</p>
                                    <p className="text-xs text-gray-500">
                                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                                    </p>
                                    <div className="flex gap-1 mt-1 flex-wrap">
                                      {getOrderStatusBadge(order.status || 'pending')}
                                      {order.status !== 'cancelled' && getPaymentStatusBadge(order.payment_status || 'pending')}
                                    </div>
                                  </div>
                                </div>
                                
                                {order.preferred_delivery_date && (
                                  <p className="text-xs text-gray-500">
                                    Date de livraison préférée: {new Date(order.preferred_delivery_date).toLocaleDateString()}
                                  </p>
                                )}
                                
                                {(order.amount_paid || 0) > 0 && order.status !== 'cancelled' && (
                                  <div className="space-y-1">
                                    <p className="text-sm text-green-600">Payé: {(order.amount_paid || 0).toLocaleString()} DZD</p>
                                    {remainingAmount > 0 && (
                                      <p className="text-sm text-red-600">Montant restant: {remainingAmount.toLocaleString()} DZD</p>
                                    )}
                                  </div>
                                )}
                                
                                <div className="space-y-2">
                                  <div>
                                    <Label className="text-xs">Statut commande</Label>
                                    <Select 
                                      value={order.status || 'pending'} 
                                      onValueChange={(value: OrderStatus) => updateOrderStatus(order.id, value)}
                                    >
                                      <SelectTrigger className="h-8">
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
                                  
                                  {order.status !== 'cancelled' && (
                                    <div>
                                      <Label className="text-xs">Statut paiement</Label>
                                      <Select 
                                        value={order.payment_status || 'pending'}
                                        onValueChange={(value: PaymentStatus) => {
                                          console.log(`[Dropdown] Order: ${order.id}, Selected status: ${value}`);
                                          if (value === 'partial') {
                                            setEditingPartialFor(order.id);
                                          } else {
                                            updatePaymentStatus(order.id, value);
                                            setEditingPartialFor(null);
                                          }
                                        }}
                                      >
                                        <SelectTrigger className="h-8">
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
                                  )}
                                </div>
                                
                                <div className="flex gap-2">
                                  {order.status === 'delivered' && order.payment_status === 'paid' && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                      Terminée
                                    </Badge>
                                  )}
                                </div>

                                {editingPartialFor === order.id && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <Input
                                      type="number"
                                      placeholder="Montant partiel"
                                      value={partialPaymentAmount[order.id] || ''}
                                      onChange={(e) =>
                                        setPartialPaymentAmount((prev) => ({
                                          ...prev,
                                          [order.id]: e.target.value,
                                        }))
                                      }
                                      className="h-8"
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        const amount = parseFloat(partialPaymentAmount[order.id] || '0');
                                        console.log(`[Partial Submit] Order: ${order.id}, Entered amount: ${amount}`);
                                        if (amount > 0) {
                                          updatePaymentStatus(order.id, 'partial', amount);
                                          setEditingPartialFor(null);
                                        } else {
                                          toast.error('Veuillez entrer un montant valide');
                                        }
                                      }}
                                      className="h-8"
                                    >
                                      Soumettre
                                    </Button>
                                  </div>
                                )}

                                {/* Show partial payment history if exists */}
                                {Array.isArray(order.partial_payment_history) && order.partial_payment_history.length > 0 && (
                                  <div className="mt-2">
                                    <Label className="text-xs">Historique des paiements partiels</Label>
                                    <ul className="text-xs text-gray-700">
                                      {order.partial_payment_history.map((entry, idx) => (
                                        <li key={idx}>
                                          {entry.amount} DZD le {new Date(entry.date).toLocaleString()}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      } catch (error) {
                        console.error('Error rendering order card:', error, order);
                        return (
                          <Card key={order.id || Math.random()} className="border">
                            <CardContent className="p-4">
                              <div className="text-red-500">
                                Erreur lors de l'affichage de cette commande
                              </div>
                            </CardContent>
                          </Card>
                        );
                      }
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Clients Tab with Search Functionality */}
          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Clients ({filteredClients.length})</CardTitle>
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Rechercher par nom, cabinet, email, téléphone, wilaya, adresse..."
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                        className="pl-10 w-96"
                      />
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="month"
                        placeholder="Filtrer par mois d'inscription"
                        value={clientDateFilter}
                        onChange={(e) => setClientDateFilter(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button onClick={() => downloadData(clients, 'clients.csv')} variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredClients.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {clientSearch || clientDateFilter ? 'Aucun client trouvé avec ces critères' : 'Aucun client trouvé'}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredClients.map((client) => (
                      <div key={client.id} className="flex items-center justify-between p-4 border rounded">
                        <div>
                          <h3 className="font-medium">{client.full_name || 'Nom non renseigné'}</h3>
                          <p className="text-sm text-gray-600">Cabinet: {client.dental_office_name || 'Non renseigné'}</p>
                          <p className="text-sm text-gray-600">Email: {client.email || 'Non renseigné'}</p>
                          <p className="text-sm text-gray-600">Téléphone: {client.phone || 'Non renseigné'}</p>
                          <p className="text-sm text-gray-600">Wilaya: {client.wilaya || 'Non renseigné'}</p>
                          <p className="text-sm text-gray-600">Adresse: {client.address || 'Non renseigné'}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          <div>Inscrit le:</div>
                          <div className="font-medium">
                            {client.created_at ? new Date(client.created_at).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'Date inconnue'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Messages des clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {messages.map(msg => (
                    <Card key={msg.id} className="cursor-pointer" onClick={() => setSelectedMessage(msg)}>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div><b>Nom:</b> {msg.nom}</div>
                          <Badge variant={msg.status === 'closed' ? 'destructive' : 'default'}>{msg.status === 'closed' ? 'Fermé' : 'Ouvert'}</Badge>
                        </div>
                        <div><b>Email:</b> {msg.email}</div>
                        <div><b>Sujet:</b> {msg.sujet}</div>
                        <div><b>Message:</b> {msg.message}</div>
                        <div className="text-xs text-gray-500">Envoyé le {new Date(msg.created_at).toLocaleString()}</div>
                        {msg.message_responses && msg.message_responses.length > 0 && (
                          <div className="mt-2 pl-4 border-l">
                            {msg.message_responses.map((resp: any) => (
                              <div key={resp.id} className="mb-2">
                                <div><b>Réponse admin:</b> {resp.response}</div>
                                <div className="text-xs text-gray-500">Répondu le {new Date(resp.created_at).toLocaleString()}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {selectedMessage && (
                  <div className="mt-6 p-4 border rounded bg-gray-50">
                    <h3 className="font-bold mb-2">Répondre à {selectedMessage.nom}</h3>
                    <div className="flex justify-between items-center mb-2">
                      <div><b>Nom du cabinet:</b> {selectedMessage.cabinet_name || ''}</div>
                      <Badge variant={selectedMessage.status === 'closed' ? 'destructive' : 'default'}>{selectedMessage.status === 'closed' ? 'Fermé' : 'Ouvert'}</Badge>
                      {selectedMessage.status !== 'closed' && (
                        <Button size="sm" variant="destructive" onClick={async () => {
                          await sb.from('messages').update({ status: 'closed' }).eq('id', selectedMessage.id);
                          fetchMessages();
                        }}>Fermer le ticket</Button>
                      )}
                    </div>
                    <div><b>Numéro de téléphone:</b> {selectedMessage.phone || ''}</div>
                    <div><b>Sujet:</b> {selectedMessage.sujet}</div>
                    <div><b>Message:</b> {selectedMessage.message}</div>
                    <Textarea value={response} onChange={e => setResponse(e.target.value)} placeholder="Votre réponse..." className="my-2" disabled={selectedMessage.status === 'closed'} />
                    <Button onClick={handleRespond} disabled={!response || selectedMessage.status === 'closed'}>Envoyer la réponse</Button>
                    <Button variant="outline" className="ml-2" onClick={() => setSelectedMessage(null)}>Fermer</Button>
                  </div>
                )}
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
