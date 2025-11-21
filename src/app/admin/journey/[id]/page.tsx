import { JourneyForm } from '@/components/admin/journey-form';
import { journeyApi } from '@/lib/api/journey-client';

export default async function EditJourneyItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await journeyApi.getJourneyItem(id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Journey Item</h1>
      <JourneyForm mode="edit" item={item} />
    </div>
  );
}
