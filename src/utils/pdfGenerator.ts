
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateProductsPDF = (products: any[]) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Catalogue des Produits - DentGo', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 20, 30);
  doc.text('Site web: https://dentgo.dz', 20, 37);
  
  // Prepare data for table
  const tableData = products.map(product => [
    product.name_fr || product.name || 'N/A',
    product.product_code || 'N/A',
    `${(product.price || 0).toLocaleString()} DZD`,
    product.original_price ? `${product.original_price.toLocaleString()} DZD` : 'N/A',
    product.categories?.name_fr || 'Non catégorisé',
    product.in_stock ? 'En stock' : 'Rupture',
    product.badge || 'Aucun'
  ]);

  // Table
  doc.autoTable({
    head: [['Produit', 'Code', 'Prix', 'Prix Original', 'Catégorie', 'Stock', 'Badge']],
    body: tableData,
    startY: 50,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} sur ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
    doc.text('DentGo - Équipements Dentaires', 20, doc.internal.pageSize.height - 10);
  }

  return doc;
};

export const generateOrdersPDF = (orders: any[]) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Rapport des Commandes - DentGo', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 20, 30);
  doc.text(`Total des commandes: ${orders.length}`, 20, 37);
  
  // Statistics
  const completedOrders = orders.filter(order => order.status === 'delivered' && order.payment_status === 'paid');
  const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  
  doc.text(`Commandes terminées: ${completedOrders.length}`, 20, 44);
  doc.text(`Chiffre d'affaires: ${totalRevenue.toLocaleString()} DZD`, 20, 51);

  // Prepare data for table
  const tableData = orders.map(order => [
    `#${order.id?.slice(0, 8) || 'N/A'}`,
    order.profiles?.full_name || 'N/A',
    order.profiles?.dental_office_name || 'N/A',
    `${(order.total_amount || 0).toLocaleString()} DZD`,
    getOrderStatusText(order.status),
    getPaymentStatusText(order.payment_status),
    order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR') : 'N/A'
  ]);

  // Table
  doc.autoTable({
    head: [['ID', 'Client', 'Cabinet', 'Montant', 'Statut', 'Paiement', 'Date']],
    body: tableData,
    startY: 65,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [231, 76, 60] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} sur ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
    doc.text('DentGo - Rapport Commandes', 20, doc.internal.pageSize.height - 10);
  }

  return doc;
};

export const generateClientsPDF = (clients: any[]) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Liste des Clients - DentGo', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 20, 30);
  doc.text(`Total des clients: ${clients.length}`, 20, 37);

  // Prepare data for table
  const tableData = clients.map(client => [
    client.full_name || 'N/A',
    client.dental_office_name || 'N/A',
    client.email || 'N/A',
    client.phone || 'N/A',
    client.wilaya || 'N/A',
    client.address || 'N/A',
    client.created_at ? new Date(client.created_at).toLocaleDateString('fr-FR') : 'N/A'
  ]);

  // Table
  doc.autoTable({
    head: [['Nom', 'Cabinet', 'Email', 'Téléphone', 'Wilaya', 'Adresse', 'Inscription']],
    body: tableData,
    startY: 50,
    styles: { fontSize: 7 },
    headStyles: { fillColor: [46, 204, 113] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} sur ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
    doc.text('DentGo - Liste Clients', 20, doc.internal.pageSize.height - 10);
  }

  return doc;
};

export const generateCategoriesPDF = (categories: any[]) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Catalogue des Catégories - DentGo', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 20, 30);
  doc.text(`Total des catégories: ${categories.length}`, 20, 37);

  // Prepare data for table
  const tableData = categories.map(category => [
    category.name_fr || category.name || 'N/A',
    category.name_ar || 'N/A',
    category.description_fr || 'N/A',
    category.icon || 'N/A'
  ]);

  // Table
  doc.autoTable({
    head: [['Nom (FR)', 'Nom (AR)', 'Description', 'Icône']],
    body: tableData,
    startY: 50,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [155, 89, 182] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} sur ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
    doc.text('DentGo - Catégories', 20, doc.internal.pageSize.height - 10);
  }

  return doc;
};

export const generateBundlesPDF = (bundles: any[], products: any[]) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Catalogue des Kits - DentGo', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 20, 30);
  doc.text(`Total des kits: ${bundles.length}`, 20, 37);
  doc.text('Site web: https://dentgo.dz', 20, 44);

  // Prepare data for table
  const tableData = bundles.map(bundle => {
    const productNames = products
      .filter(product => bundle.items?.includes(product.id))
      .map(product => product.name_fr || product.name)
      .join(', ');
    
    return [
      bundle.name_fr || bundle.name || 'N/A',
      bundle.bundle_price || 'N/A',
      bundle.original_price || 'N/A',
      bundle.savings || 'N/A',
      bundle.procedures || 'N/A',
      bundle.popular ? 'Oui' : 'Non',
      bundle.badge || 'Aucun',
      productNames.substring(0, 50) + (productNames.length > 50 ? '...' : '')
    ];
  });

  // Table
  doc.autoTable({
    head: [['Kit', 'Prix', 'Prix Original', 'Économies', 'Procédures', 'Populaire', 'Badge', 'Produits']],
    body: tableData,
    startY: 55,
    styles: { fontSize: 7 },
    headStyles: { fillColor: [243, 156, 18] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} sur ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
    doc.text('DentGo - Kits Dentaires', 20, doc.internal.pageSize.height - 10);
  }

  return doc;
};

export const generateCompleteCatalogPDF = (products: any[], categories: any[], bundles: any[]) => {
  const doc = new jsPDF();
  
  // Cover page
  doc.setFontSize(28);
  doc.text('CATALOGUE DENTGO', doc.internal.pageSize.width / 2, 60, { align: 'center' });
  
  doc.setFontSize(16);
  doc.text('Équipements Dentaires Professionnels', doc.internal.pageSize.width / 2, 80, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, doc.internal.pageSize.width / 2, 100, { align: 'center' });
  
  // Company info
  doc.setFontSize(12);
  doc.text('DentGo - Votre partenaire en équipement dentaire', doc.internal.pageSize.width / 2, 140, { align: 'center' });
  doc.text('Site web: https://dentgo.dz', doc.internal.pageSize.width / 2, 150, { align: 'center' });
  doc.text('Email: contact@dentgo.dz', doc.internal.pageSize.width / 2, 160, { align: 'center' });
  
  // Statistics
  doc.setFontSize(14);
  doc.text('Nos Chiffres:', doc.internal.pageSize.width / 2, 180, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`${products.length} Produits de Qualité`, doc.internal.pageSize.width / 2, 195, { align: 'center' });
  doc.text(`${categories.length} Catégories Spécialisées`, doc.internal.pageSize.width / 2, 205, { align: 'center' });
  doc.text(`${bundles.length} Kits Économiques`, doc.internal.pageSize.width / 2, 215, { align: 'center' });
  
  // Add new page for content
  doc.addPage();
  
  // Table of contents
  doc.setFontSize(18);
  doc.text('Table des Matières', 20, 30);
  
  doc.setFontSize(12);
  let yPos = 50;
  doc.text('1. Catégories ......................................................... 3', 20, yPos);
  yPos += 10;
  doc.text('2. Produits ........................................................... 4', 20, yPos);
  yPos += 10;
  doc.text('3. Kits Économiques ................................................ 5', 20, yPos);
  yPos += 20;
  
  doc.setFontSize(10);
  doc.text('Pour plus d\'informations ou pour passer commande:', 20, yPos);
  yPos += 10;
  doc.text('• Visitez notre site: https://dentgo.dz', 20, yPos);
  yPos += 8;
  doc.text('• Contactez-nous: contact@dentgo.dz', 20, yPos);
  yPos += 8;
  doc.text('• Appelez-nous: +213 XXX XXX XXX', 20, yPos);
  
  // Categories section
  doc.addPage();
  doc.setFontSize(18);
  doc.text('1. Nos Catégories', 20, 30);
  
  const categoryData = categories.map(cat => [
    cat.name_fr || cat.name || 'N/A',
    cat.description_fr || 'N/A'
  ]);
  
  doc.autoTable({
    head: [['Catégorie', 'Description']],
    body: categoryData,
    startY: 45,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [155, 89, 182] }
  });
  
  // Products section
  doc.addPage();
  doc.setFontSize(18);
  doc.text('2. Notre Catalogue Produits', 20, 30);
  
  const productData = products.map(product => [
    product.name_fr || product.name || 'N/A',
    `${(product.price || 0).toLocaleString()} DZD`,
    product.categories?.name_fr || 'Non catégorisé',
    product.in_stock ? 'Disponible' : 'Sur commande'
  ]);
  
  doc.autoTable({
    head: [['Produit', 'Prix', 'Catégorie', 'Disponibilité']],
    body: productData,
    startY: 45,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [41, 128, 185] }
  });
  
  // Bundles section
  doc.addPage();
  doc.setFontSize(18);
  doc.text('3. Nos Kits Économiques', 20, 30);
  
  const bundleData = bundles.map(bundle => [
    bundle.name_fr || bundle.name || 'N/A',
    bundle.bundle_price || 'N/A',
    bundle.original_price || 'N/A',
    bundle.savings || 'N/A'
  ]);
  
  doc.autoTable({
    head: [['Kit', 'Prix Kit', 'Prix Séparé', 'Économies']],
    body: bundleData,
    startY: 45,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [243, 156, 18] }
  });
  
  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Page ${i} sur ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
    doc.text('DentGo © 2025 - Catalogue Officiel', 20, doc.internal.pageSize.height - 10);
  }
  
  return doc;
};

// Helper functions
const getOrderStatusText = (status: string) => {
  switch (status) {
    case 'pending': return 'En attente';
    case 'confirmed': return 'Confirmée';
    case 'shipped': return 'Expédiée';
    case 'delivered': return 'Livrée';
    case 'cancelled': return 'Annulée';
    default: return status || 'N/A';
  }
};

const getPaymentStatusText = (status: string) => {
  switch (status) {
    case 'pending': return 'En attente';
    case 'partial': return 'Partiel';
    case 'paid': return 'Payé';
    case 'refunded': return 'Remboursé';
    default: return status || 'N/A';
  }
};
