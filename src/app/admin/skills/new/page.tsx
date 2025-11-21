import { SkillForm } from '@/components/admin/skill-form';

export default function NewSkillPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create New Skill</h1>
      <SkillForm mode="create" />
    </div>
  );
}
