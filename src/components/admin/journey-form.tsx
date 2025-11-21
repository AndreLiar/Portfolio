'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { journeyApi } from '@/lib/api/journey-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const journeySchema = z.object({
  date: z.string().min(1, 'Date is required'),
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['milestone', 'achievement', 'personal'], {
    required_error: 'Type is required',
  }),
  description: z.string().min(1, 'Description is required'),
});

type JourneyFormData = z.infer<typeof journeySchema>;

interface JourneyFormProps {
  item?: JourneyFormData & { id: string };
  mode: 'create' | 'edit';
}

export function JourneyForm({ item, mode }: JourneyFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<JourneyFormData>({
    resolver: zodResolver(journeySchema),
    defaultValues: {
      date: item?.date || '',
      title: item?.title || '',
      type: item?.type || 'achievement',
      description: item?.description || '',
    },
  });

  const onSubmit = async (data: JourneyFormData) => {
    try {
      if (mode === 'create') {
        await journeyApi.createJourneyItem(data);
        toast({ title: 'Journey item created' });
      } else if (item) {
        await journeyApi.updateJourneyItem(item.id, data);
        toast({ title: 'Journey item updated' });
      }
      router.push('/admin/journey');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${mode} journey item. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'Create Journey Item' : 'Edit Journey Item'}</CardTitle>
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
            <Label htmlFor="type">Type</Label>
            <Select
              value={form.watch('type')}
              onValueChange={(value) => form.setValue('type', value as 'milestone' | 'achievement' | 'personal')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="milestone">Milestone</SelectItem>
                <SelectItem value="achievement">Achievement</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.type && <p className="text-destructive">{form.formState.errors.type.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description (HTML supported)</Label>
            <Textarea 
              id="description" 
              {...form.register('description')} 
              rows={8}
              placeholder="You can use HTML tags like <strong>, <em>, <ul>, <li>, <a>, etc."
            />
            {form.formState.errors.description && <p className="text-destructive">{form.formState.errors.description.message}</p>}
          </div>
          <Button type="submit">{mode === 'create' ? 'Create' : 'Update'}</Button>
        </CardContent>
      </Card>
    </form>
  );
}
