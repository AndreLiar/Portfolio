'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { workExperienceApi } from '@/lib/api/work-experience-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const workExperienceSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  description: z.string().min(1, 'Description is required'),
});

type WorkExperienceFormData = z.infer<typeof workExperienceSchema>;

interface WorkExperienceFormProps {
  item?: WorkExperienceFormData & { id: string };
  mode: 'create' | 'edit';
}

export function WorkExperienceForm({ item, mode }: WorkExperienceFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<WorkExperienceFormData>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      date: item?.date || '',
      title: item?.title || '',
      subtitle: item?.subtitle || '',
      description: item?.description || '',
    },
  });

  const onSubmit = async (data: WorkExperienceFormData) => {
    try {
      if (mode === 'create') {
        await workExperienceApi.createWorkExperience(data);
        toast({ title: 'Work experience created' });
      } else if (item) {
        await workExperienceApi.updateWorkExperience(item.id, data);
        toast({ title: 'Work experience updated' });
      }
      router.push('/admin/work-experience');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${mode} work experience. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'Create Work Experience' : 'Edit Work Experience'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" {...form.register('date')} />
            {form.formState.errors.date && <p className="text-destructive">{form.formState.errors.date.message}</p>}
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register('title')} />
            {form.formState.errors.title && <p className="text-destructive">{form.formState.errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input id="subtitle" {...form.register('subtitle')} />
            {form.formState.errors.subtitle && <p className="text-destructive">{form.formState.errors.subtitle.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register('description')} />
            {form.formState.errors.description && <p className="text-destructive">{form.formState.errors.description.message}</p>}
          </div>
          <Button type="submit">{mode === 'create' ? 'Create' : 'Update'}</Button>
        </CardContent>
      </Card>
    </form>
  );
}
