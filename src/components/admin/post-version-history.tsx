'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { History, RotateCcw, Eye, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { rollbackToVersion } from '@/app/admin/blog/actions';
import { useToast } from '@/hooks/use-toast';

interface PostVersion {
  id: string;
  version_number: number;
  title: string;
  change_summary: string;
  status: string;
  created_at: string;
  created_by_name: string;
}

interface PostVersionHistoryProps {
  postId: string;
  versions: PostVersion[];
  onVersionChange?: () => void;
}

export function PostVersionHistory({ postId, versions, onVersionChange }: PostVersionHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<PostVersion | null>(null);
  const [isRollingBack, setIsRollingBack] = useState(false);
  const { toast } = useToast();

  const handleRollback = async (version: PostVersion) => {
    if (!confirm(`Are you sure you want to rollback to version ${version.version_number}? This will create a new version with the content from version ${version.version_number}.`)) {
      return;
    }

    setIsRollingBack(true);

    try {
      const formData = new FormData();
      formData.append('postId', postId);
      formData.append('versionNumber', version.version_number.toString());

      const result = await rollbackToVersion(formData);

      if (result.success) {
        toast({ title: 'Success', description: `Successfully rolled back to version ${version.version_number}` });
        setSelectedVersion(null);
        onVersionChange?.();
      }
    } catch (error) {
      console.error('Rollback error:', error);
      toast({ title: 'Error', description: 'Failed to rollback to version', variant: 'destructive' });
    } finally {
      setIsRollingBack(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <History className="w-4 h-4 mr-2" />
            Version History ({versions.length})
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Post Version History</DialogTitle>
            <DialogDescription>
              View and manage different versions of this post. You can rollback to any previous version.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Changes</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versions.map((version) => (
                  <TableRow key={version.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <span className="text-lg font-bold">v{version.version_number}</span>
                        {version.version_number === Math.max(...versions.map(v => v.version_number)) && (
                          <Badge variant="secondary" className="ml-2">Current</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={version.title}>
                        {version.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(version.status)}>
                        {version.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={version.change_summary}>
                        {version.change_summary || 'No description'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {format(new Date(version.created_at), 'MMM dd, yyyy HH:mm')}
                      </div>
                      {version.created_by_name && (
                        <div className="text-xs text-muted-foreground">
                          by {version.created_by_name}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedVersion(version)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                        {version.version_number !== Math.max(...versions.map(v => v.version_number)) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRollback(version)}
                            disabled={isRollingBack}
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Rollback
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {selectedVersion && (
              <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">
                  Version {selectedVersion.version_number} Preview
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Title: </span>
                    {selectedVersion.title}
                  </div>
                  <div>
                    <span className="font-medium">Status: </span>
                    <Badge className={getStatusColor(selectedVersion.status)}>
                      {selectedVersion.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Changes: </span>
                    {selectedVersion.change_summary || 'No description provided'}
                  </div>
                  <div>
                    <span className="font-medium">Created: </span>
                    {format(new Date(selectedVersion.created_at), 'MMMM dd, yyyy at HH:mm')}
                    {selectedVersion.created_by_name && ` by ${selectedVersion.created_by_name}`}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}