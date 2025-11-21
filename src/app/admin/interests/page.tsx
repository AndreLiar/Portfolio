import { AdminInterestsClient } from '@/components/admin/interests-client';
import { interestApi } from '@/lib/api/interest-client';

export default async function AdminInterestsPage() {
  const interests = await interestApi.getInterests();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Interests</h1>
        <p className="text-muted-foreground">Manage your interests.</p>
      </div>
      <AdminInterestsClient initialInterests={interests} />
    </div>
  );
}
