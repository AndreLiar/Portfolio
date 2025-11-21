import { JourneyForm } from '@/components/admin/journey-form';

export default function NewJourneyItemPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create New Journey Item</h1>
      <JourneyForm mode="create" />
    </div>
  );
}
