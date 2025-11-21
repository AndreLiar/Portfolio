import { WorkExperienceForm } from '@/components/admin/work-experience-form';
import { workExperienceApi } from '@/lib/api/work-experience-client';

export default async function EditWorkExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await workExperienceApi.getWorkExperience(id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Work Experience</h1>
      <WorkExperienceForm mode="edit" item={item} />
    </div>
  );
}
