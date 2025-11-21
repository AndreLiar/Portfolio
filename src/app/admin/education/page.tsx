import { AdminEducationClient } from '@/components/admin/education-client';
import { educationApi } from '@/lib/api/education-client';

export default async function AdminEducationPage() {
  const education = await educationApi.getEducationItems();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Education</h1>
        <p className="text-muted-foreground">Manage your education.</p>
      </div>
      <AdminEducationClient initialEducation={education} />
    </div>
  );
}
