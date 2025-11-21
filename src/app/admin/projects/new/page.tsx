import { ProjectForm } from '@/components/admin/project-form';

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create New Project</h1>
      <ProjectForm mode="create" />
    </div>
  );
}
