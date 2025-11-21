import { SkillForm } from '@/components/admin/skill-form';
import { skillApi } from '@/lib/api/skill-client';

export default async function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const skill = await skillApi.getSkill(id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Skill</h1>
      <SkillForm mode="edit" skill={skill} />
    </div>
  );
}
