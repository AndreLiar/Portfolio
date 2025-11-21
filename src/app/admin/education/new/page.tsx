import { EducationForm } from '@/components/admin/education-form';

export default function NewEducationPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create New Education Item</h1>
      <EducationForm mode="create" />
    </div>
  );
}
