'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { educationApi } from '@/lib/api/education-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const educationSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  description: z.string().min(1, 'Description is required'),
});

type EducationFormData = z.infer<typeof educationSchema>;

interface EducationFormProps {
  item?: EducationFormData & { id: string };
  mode: 'create' | 'edit';
}

export function EducationForm({ item, mode }: EducationFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      date: item?.date || '',
      title: item?.title || '',
      subtitle: item?.subtitle || '',
      description: item?.description || '',
    },
  });

  const onSubmit = async (data: EducationFormData) => {
    try {
      if (mode === 'create') {
        await educationApi.createEducationItem(data);
        toast({ title: 'Education item created' });
      } else if (item) {
        await educationApi.updateEducationItem(item.id, data);
        toast({ title: 'Education item updated' });
      }
      router.push('/admin/education');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${mode} education item. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'Create Education Item' : 'Edit Education Item'}</CardTitle>
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
