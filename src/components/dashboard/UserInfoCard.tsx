
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserInfoCardProps {
  profile: any;
  userEmail: string;
}

export const UserInfoCard: React.FC<UserInfoCardProps> = ({ profile, userEmail }) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Informations du compte</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p><strong>Nom:</strong> {profile?.full_name || 'Non défini'}</p>
            <p><strong>Cabinet:</strong> {profile?.dental_office_name || 'Non défini'}</p>
            <p><strong>Email:</strong> {profile?.email || userEmail}</p>
          </div>
          <div>
            <p><strong>Téléphone:</strong> {profile?.phone || 'Non défini'}</p>
            <p><strong>Wilaya:</strong> {profile?.wilaya || 'Non défini'}</p>
            <p><strong>Adresse:</strong> {profile?.address || 'Non défini'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
