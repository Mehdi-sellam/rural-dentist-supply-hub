import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const DatabasePopulator = () => {
  const [isLoading, setIsLoading] = useState(false);

  const populateDatabase = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('populate-products');
      
      if (error) throw error;
      
      toast.success(`Base de données mise à jour avec succès! ${data.categories} catégories, ${data.products} produits, ${data.bundles} kits ajoutés.`);
    } catch (error) {
      console.error('Error populating database:', error);
      toast.error('Erreur lors de la mise à jour de la base de données.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mise à jour des Produits</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Cliquez pour mettre à jour la base de données avec les produits d'Actual Med.
        </p>
        <Button 
          onClick={populateDatabase} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Mise à jour en cours...' : 'Mettre à jour les produits'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DatabasePopulator;