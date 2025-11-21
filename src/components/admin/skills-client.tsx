'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit, Trash2, MoreHorizontal, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { skillApi } from '@/lib/api/skill-client';

// Define the Skill type based on your data structure
interface Skill {
  id: string;
  title: string;
  skills: string[];
}

interface AdminSkillsClientProps {
  initialSkills: Skill[];
}

export function AdminSkillsClient({ initialSkills }: AdminSkillsClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);

  const handleDeleteSkill = (skillId: string) => {
    setSkillToDelete(skillId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteSkill = async () => {
    if (!skillToDelete) return;

    try {
      await skillApi.deleteSkill(skillToDelete);
      toast({
        title: 'Skill deleted',
        description: 'The skill has been successfully deleted.',
      });
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete the skill. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setSkillToDelete(null);
    }
  };

  if (initialSkills.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No skills found</h3>
        <p className="text-muted-foreground mb-4">
          Get started by creating your first skill.
        </p>
        <Link href="/admin/skills/new">
          <Button>Create Skill</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="font-semibold text-gray-900">Title</TableHead>
              <TableHead className="font-semibold text-gray-900">Skills</TableHead>
              <TableHead className="text-right font-semibold text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialSkills.map((skill) => (
              <TableRow key={skill.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell className="font-medium text-gray-900">{skill.title}</TableCell>
                <TableCell className="text-gray-700">{skill.skills.join(', ')}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4 text-gray-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href={`/admin/skills/${skill.id}`} className="flex items-center">
                          <Edit className="mr-2 h-4 w-4 text-blue-600" />
                          <span className="text-gray-900">Edit</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteSkill(skill.id)} 
                        className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the skill.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSkill} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
