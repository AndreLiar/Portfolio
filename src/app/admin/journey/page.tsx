import { AdminJourneyClient } from '@/components/admin/journey-client';
import { journeyApi } from '@/lib/api/journey-client';

export default async function AdminJourneyPage() {
  const journeyItems = await journeyApi.getJourneyItems();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Journey</h1>
        <p className="text-muted-foreground">Manage your journey/timeline.</p>
      </div>
      <AdminJourneyClient initialJourneyItems={journeyItems} />
    </div>
  );
}
