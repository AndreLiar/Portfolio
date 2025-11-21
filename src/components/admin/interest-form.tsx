'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { interestApi } from '@/lib/api/interest-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const interestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

type InterestFormData = z.infer<typeof interestSchema>;

interface InterestFormProps {
  item?: InterestFormData & { id: string };
  mode: 'create' | 'edit';
}

export function InterestForm({ item, mode }: InterestFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<InterestFormData>({
    resolver: zodResolver(interestSchema),
    defaultValues: {
      name: item?.name || '',
    },
  });

  const onSubmit = async (data: InterestFormData) => {
    try {
      if (mode === 'create') {
        await interestApi.createInterest(data);
        toast({ title: 'Interest created' });
      } else if (item) {
        await interestApi.updateInterest(item.id, data);
        toast({ title: 'Interest updated' });
      }
      router.push('/admin/interests');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${mode} interest. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'Create Interest' : 'Edit Interest'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register('name')} />
            {form.formState.errors.name && <p className="text-destructive">{form.formState.errors.name.message}</p>}
          </div>
          <Button type="submit">{mode === 'create' ? 'Create' : 'Update'}</Button>
        </CardContent>
      </Card>
    </form>
  );
}
