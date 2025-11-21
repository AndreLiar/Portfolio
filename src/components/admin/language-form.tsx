'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { languageApi } from '@/lib/api/language-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const languageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  level: z.string().min(1, 'Level is required'),
});

type LanguageFormData = z.infer<typeof languageSchema>;

interface LanguageFormProps {
  item?: LanguageFormData & { id: string };
  mode: 'create' | 'edit';
}

export function LanguageForm({ item, mode }: LanguageFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LanguageFormData>({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      name: item?.name || '',
      level: item?.level || '',
    },
  });

  const onSubmit = async (data: LanguageFormData) => {
    try {
      if (mode === 'create') {
        await languageApi.createLanguage(data);
        toast({ title: 'Language created' });
      } else if (item) {
        await languageApi.updateLanguage(item.id, data);
        toast({ title: 'Language updated' });
      }
      router.push('/admin/languages');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${mode} language. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'Create Language' : 'Edit Language'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register('name')} />
            {form.formState.errors.name && <p className="text-destructive">{form.formState.errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="level">Level</Label>
            <Input id="level" {...form.register('level')} />
            {form.formState.errors.level && <p className="text-destructive">{form.formState.errors.level.message}</p>}
          </div>
          <Button type="submit">{mode === 'create' ? 'Create' : 'Update'}</Button>
        </CardContent>
      </Card>
    </form>
  );
}
