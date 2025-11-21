import { AdminLanguagesClient } from '@/components/admin/languages-client';
import { languageApi } from '@/lib/api/language-client';

export default async function AdminLanguagesPage() {
  const languages = await languageApi.getLanguages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Languages</h1>
        <p className="text-muted-foreground">Manage your languages.</p>
      </div>
      <AdminLanguagesClient initialLanguages={languages} />
    </div>
  );
}
