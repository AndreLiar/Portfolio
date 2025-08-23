'use client';

import { useState } from 'react';
import { Trash2, Copy, Archive, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { bulkDeletePosts, duplicatePost, togglePostStatus } from '@/app/admin/blog/actions';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  title: string;
  status: string;
  slug: string;
}

interface BulkOperationsProps {
  posts: Post[];
  selectedPosts: string[];
  onSelectionChange: (selectedPosts: string[]) => void;
  onRefresh: () => void;
}

export function BulkOperations({ posts, selectedPosts, onSelectionChange, onRefresh }: BulkOperationsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const { toast } = useToast();

  const selectedCount = selectedPosts.length;
  const allSelected = posts.length > 0 && selectedPosts.length === posts.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(posts.map(post => post.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) return;

    setIsDeleting(true);
    try {
      const formData = new FormData();
      selectedPosts.forEach(id => formData.append('postIds', id));

      const result = await bulkDeletePosts(formData);

      if (result.success) {
        toast({ title: 'Success', description: `Successfully deleted ${result.deletedCount} posts` });
        onSelectionChange([]);
        onRefresh();
      }
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast({ title: 'Error', description: 'Failed to delete posts', variant: 'destructive' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicatePost = async (postId: string) => {
    setIsDuplicating(true);
    try {
      const formData = new FormData();
      formData.append('postId', postId);

      const result = await duplicatePost(formData);

      if (result.success) {
        toast({ title: 'Success', description: 'Post duplicated successfully' });
        onRefresh();
      }
    } catch (error) {
      console.error('Duplicate error:', error);
      toast({ title: 'Error', description: 'Failed to duplicate post', variant: 'destructive' });
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleToggleStatus = async (postId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    setIsTogglingStatus(true);
    try {
      const formData = new FormData();
      formData.append('id', postId);
      formData.append('status', newStatus);

      const result = await togglePostStatus(formData);

      if (result.success) {
        toast({ title: 'Success', description: `Post ${newStatus === 'published' ? 'published' : 'unpublished'}` });
        onRefresh();
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      toast({ title: 'Error', description: 'Failed to update post status', variant: 'destructive' });
    } finally {
      setIsTogglingStatus(false);
    }
  };

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={allSelected}
          onCheckedChange={handleSelectAll}
        />
        <span className="text-sm font-medium">
          {selectedCount > 0 ? `${selectedCount} selected` : 'Select all'}
        </span>
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center gap-2 ml-auto">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isDeleting}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete ({selectedCount})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Posts</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {selectedCount} post{selectedCount > 1 ? 's' : ''}? 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleBulkDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* Individual post actions */}
      {selectedCount === 1 && (
        <div className="flex items-center gap-2">
          {(() => {
            const selectedPost = posts.find(p => p.id === selectedPosts[0]);
            if (!selectedPost) return null;

            return (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDuplicatePost(selectedPost.id)}
                  disabled={isDuplicating}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleStatus(selectedPost.id, selectedPost.status)}
                  disabled={isTogglingStatus}
                >
                  {selectedPost.status === 'published' ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Publish
                    </>
                  )}
                </Button>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}