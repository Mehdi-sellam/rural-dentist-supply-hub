
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { seedTestData, clearTestData } from '@/utils/testDataSeeder';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Database, Trash2, Upload, Loader2 } from 'lucide-react';

const DatabaseSeeder = () => {
  const { user, profile } = useAuth();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [lastSeedResult, setLastSeedResult] = useState<any>(null);

  if (!user || !profile?.is_admin) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Vous devez être administrateur pour accéder à cette fonctionnalité.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleSeedData = async () => {
    if (!confirm('Êtes-vous sûr de vouloir alimenter la base de données avec les données de test ? Cela ajoutera des catégories, produits et kits.')) {
      return;
    }

    setIsSeeding(true);
    try {
      const result = await seedTestData();
      setLastSeedResult(result);
      toast.success('Base de données alimentée avec succès!');
      console.log('Seeding completed:', result);
    } catch (error) {
      console.error('Error seeding data:', error);
      toast.error('Erreur lors de l\'alimentation de la base de données');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearData = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer TOUTES les données ? Cette action est irréversible !')) {
      return;
    }

    setIsClearing(true);
    try {
      await clearTestData();
      setLastSeedResult(null);
      toast.success('Toutes les données ont été supprimées avec succès!');
      console.log('Data clearing completed');
    } catch (error) {
      console.error('Error clearing data:', error);
      toast.error('Erreur lors de la suppression des données');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Gestion des données de la base
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <h3 className="font-medium text-green-800 mb-2">Alimenter la base de données</h3>
              <p className="text-sm text-green-700 mb-4">
                Ajoute toutes les catégories, produits et kits depuis les données statiques du frontend.
                Inclut 22 produits, 7 catégories et 6 kits complets.
              </p>
              <Button 
                onClick={handleSeedData}
                disabled={isSeeding}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isSeeding ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Alimentation en cours...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Alimenter la base
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <h3 className="font-medium text-red-800 mb-2">Vider la base de données</h3>
              <p className="text-sm text-red-700 mb-4">
                Supprime TOUTES les catégories, produits et kits de la base de données.
                ⚠️ Cette action est irréversible !
              </p>
              <Button 
                onClick={handleClearData}
                disabled={isClearing}
                variant="destructive"
                className="w-full"
              >
                {isClearing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Suppression en cours...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Vider la base
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {lastSeedResult && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <h3 className="font-medium text-blue-800 mb-3">Dernière alimentation réussie</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">Catégories ajoutées:</span>
                  <Badge variant="secondary">{lastSeedResult.categoriesData?.length || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">Produits ajoutés:</span>
                  <Badge variant="secondary">{lastSeedResult.productsData?.length || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">Kits ajoutés:</span>
                  <Badge variant="secondary">{lastSeedResult.bundlesData?.length || 0}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">Instructions importantes:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Utilisez "Alimenter la base" pour migrer les données du frontend vers la base de données</li>
            <li>• Après l'alimentation, les composants utiliseront automatiquement les données de la base</li>
            <li>• Vous pouvez ensuite gérer ces données via l'interface d'administration</li>
            <li>• "Vider la base" supprime TOUT - utilisez avec précaution !</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseSeeder;
