'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { projectApi } from '@/lib/api/project-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  purpose: z.string().min(1, 'Purpose is required'),
  stack: z.array(z.string()).min(1, 'Stack is required'),
  impact: z.string().min(1, 'Impact is required'),
  role: z.string().min(1, 'Role is required'),
  features: z.array(z.string()).min(1, 'Features are required'),
  link: z.string().optional().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: 'Must be a valid URL'
  }),
  repoUrl: z.string().optional().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: 'Must be a valid URL'
  }),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: ProjectFormData & { id: string };
  mode: 'create' | 'edit';
}

export function ProjectForm({ project, mode }: ProjectFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || '',
      purpose: project?.purpose || '',
      stack: project?.stack || [],
      impact: project?.impact || '',
      role: project?.role || '',
      features: project?.features || [],
      link: project?.link || '',
      repoUrl: project?.repoUrl || '',
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      if (mode === 'create') {
        // Include required fields for creation
        const projectData = {
          ...data,
          status: 'published' as const,
          imageUrl: null,
        };
        await projectApi.createProject(projectData);
        toast({ title: 'Project created' });
      } else if (project) {
        await projectApi.updateProject(project.id, data);
        toast({ title: 'Project updated' });
      }
      router.push('/admin/projects');
      router.refresh();
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'Error',
        description: `Failed to ${mode} project. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'Create Project' : 'Edit Project'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register('title')} />
            {form.formState.errors.title && <p className="text-destructive">{form.formState.errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="purpose">Purpose</Label>
            <Textarea id="purpose" {...form.register('purpose')} />
            {form.formState.errors.purpose && <p className="text-destructive">{form.formState.errors.purpose.message}</p>}
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Input id="role" {...form.register('role')} />
            {form.formState.errors.role && <p className="text-destructive">{form.formState.errors.role.message}</p>}
          </div>
          <div>
            <Label htmlFor="impact">Impact</Label>
            <Textarea id="impact" {...form.register('impact')} />
            {form.formState.errors.impact && <p className="text-destructive">{form.formState.errors.impact.message}</p>}
          </div>
          <div>
            <Label htmlFor="features">Features (comma-separated)</Label>
            <Input 
              id="features" 
              defaultValue={project?.features ? project.features.join(', ') : ''} 
              {...form.register('features', { 
                setValueAs: (value) => {
                  if (Array.isArray(value)) return value;
                  return typeof value === 'string' ? value.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
                }
              })} 
            />
            {form.formState.errors.features && <p className="text-destructive">{form.formState.errors.features.message}</p>}
          </div>
          <div>
            <Label htmlFor="stack">Stack (comma-separated)</Label>
            <Input 
              id="stack" 
              defaultValue={project?.stack ? project.stack.join(', ') : ''} 
              {...form.register('stack', { 
                setValueAs: (value) => {
                  if (Array.isArray(value)) return value;
                  return typeof value === 'string' ? value.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
                }
              })} 
            />
            {form.formState.errors.stack && <p className="text-destructive">{form.formState.errors.stack.message}</p>}
          </div>
          <div>
            <Label htmlFor="link">Live Demo URL</Label>
            <Input id="link" {...form.register('link')} />
            {form.formState.errors.link && <p className="text-destructive">{form.formState.errors.link.message}</p>}
          </div>
          <div>
            <Label htmlFor="repoUrl">GitHub URL</Label>
            <Input id="repoUrl" {...form.register('repoUrl')} />
            {form.formState.errors.repoUrl && <p className="text-destructive">{form.formState.errors.repoUrl.message}</p>}
          </div>
          <Button type="submit">{mode === 'create' ? 'Create' : 'Update'}</Button>
        </CardContent>
      </Card>
    </form>
  );
}
