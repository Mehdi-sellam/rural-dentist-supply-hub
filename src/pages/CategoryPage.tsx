import React from 'react';
import { useParams } from 'react-router-dom';

const CategoryPage = () => {
  const { id } = useParams();
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Catégorie sélectionnée : {id}</h1>
      <p>Cette page affichera les produits de la catégorie sélectionnée.</p>
    </div>
  );
};

export default CategoryPage; 