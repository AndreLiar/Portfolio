import { AdminWorkExperienceClient } from '@/components/admin/work-experience-client';
import { workExperienceApi } from '@/lib/api/work-experience-client';

export default async function AdminWorkExperiencePage() {
  const workExperience = await workExperienceApi.getWorkExperiences();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Work Experience</h1>
        <p className="text-muted-foreground">Manage your work experience.</p>
      </div>
      <AdminWorkExperienceClient initialWorkExperience={workExperience} />
    </div>
  );
}
