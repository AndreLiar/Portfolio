'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { skillApi } from '@/lib/api/skill-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const skillSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  skills: z.array(z.string()).min(1, 'Skills are required'),
});

type SkillFormData = z.infer<typeof skillSchema>;

interface SkillFormProps {
  skill?: SkillFormData & { id: string };
  mode: 'create' | 'edit';
}

export function SkillForm({ skill, mode }: SkillFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      title: skill?.title || '',
      skills: skill?.skills || [],
    },
  });

  const onSubmit = async (data: SkillFormData) => {
    try {
      if (mode === 'create') {
        await skillApi.createSkill(data);
        toast({ title: 'Skill created' });
      } else if (skill) {
        await skillApi.updateSkill(skill.id, data);
        toast({ title: 'Skill updated' });
      }
      router.push('/admin/skills');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${mode} skill. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'Create Skill' : 'Edit Skill'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register('title')} />
            {form.formState.errors.title && <p className="text-destructive">{form.formState.errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input 
              id="skills" 
              defaultValue={skill?.skills ? skill.skills.join(', ') : ''} 
              {...form.register('skills', { 
                setValueAs: (value) => {
                  if (Array.isArray(value)) return value;
                  return typeof value === 'string' ? value.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
                }
              })} 
            />
            {form.formState.errors.skills && <p className="text-destructive">{form.formState.errors.skills.message}</p>}
          </div>
          <Button type="submit">{mode === 'create' ? 'Create' : 'Update'}</Button>
        </CardContent>
      </Card>
    </form>
  );
}
