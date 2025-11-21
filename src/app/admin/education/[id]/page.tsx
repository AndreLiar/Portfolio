import { EducationForm } from '@/components/admin/education-form';
import { educationApi } from '@/lib/api/education-client';

export default async function EditEducationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await educationApi.getEducationItem(id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Education Item</h1>
      <EducationForm mode="edit" item={item} />
    </div>
  );
}
