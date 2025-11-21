import { BioForm } from '@/components/admin/bio-form';
import { bioApi } from '@/lib/api/bio-client';

export default async function AdminBioPage() {
  const bio = await bioApi.getBio();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">About/Bio</h1>
        <p className="text-muted-foreground">Manage your personal information and bio.</p>
      </div>
      <BioForm bio={bio} />
    </div>
  );
}
