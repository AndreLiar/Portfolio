'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { bioApi } from '@/lib/api/bio-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const bioSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  location: z.string().min(1, 'Location is required'),
  summary: z.string().min(1, 'Summary is required'),
});

type BioFormData = z.infer<typeof bioSchema>;

interface BioFormProps {
  bio: BioFormData;
}

export function BioForm({ bio }: BioFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<BioFormData>({
    resolver: zodResolver(bioSchema),
    defaultValues: bio,
  });

  const onSubmit = async (data: BioFormData) => {
    try {
      await bioApi.updateBio(data);
      toast({ title: 'Bio updated' });
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to update bio. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Bio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register('name')} />
            {form.formState.errors.name && <p className="text-destructive">{form.formState.errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register('title')} />
            {form.formState.errors.title && <p className="text-destructive">{form.formState.errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...form.register('location')} />
            {form.formState.errors.location && <p className="text-destructive">{form.formState.errors.location.message}</p>}
          </div>
          <div>
            <Label htmlFor="summary">Summary</Label>
            <Textarea id="summary" {...form.register('summary')} />
            {form.formState.errors.summary && <p className="text-destructive">{form.formState.errors.summary.message}</p>}
          </div>
          <Button type="submit">Update</Button>
        </CardContent>
      </Card>
    </form>
  );
}
