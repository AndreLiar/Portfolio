import { InterestForm } from '@/components/admin/interest-form';

export default function NewInterestPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create New Interest</h1>
      <InterestForm mode="create" />
    </div>
  );
}
