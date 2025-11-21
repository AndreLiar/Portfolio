import { WorkExperienceForm } from '@/components/admin/work-experience-form';

export default function NewWorkExperiencePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create New Work Experience</h1>
      <WorkExperienceForm mode="create" />
    </div>
  );
}
