'use client';

import { useEffect, useRef, useState } from 'react';
import { Save, Clock, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface AutoSaveDraftProps {
  postId?: string;
  title: string;
  content: string;
  onSave?: (data: { title: string; content: string }) => Promise<void>;
  saveInterval?: number; // in milliseconds, default 30 seconds
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function AutoSaveDraft({
  postId,
  title,
  content,
  onSave,
  saveInterval = 30000, // 30 seconds
}: AutoSaveDraftProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastDataRef = useRef({ title: '', content: '' });
  const { toast } = useToast();

  // Auto-save effect
  useEffect(() => {
    const currentData = { title, content };
    
    // Check if data has changed
    const hasChanged = 
      currentData.title !== lastDataRef.current.title ||
      currentData.content !== lastDataRef.current.content;

    if (!hasChanged || (!title.trim() && !content.trim())) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      if (!title.trim() && !content.trim()) return;
      
      setSaveStatus('saving');
      
      try {
        // Use localStorage as fallback if no onSave provided
        if (onSave) {
          await onSave(currentData);
        } else {
          // Store in localStorage with postId as key
          const storageKey = postId ? `draft-${postId}` : 'draft-new';
          const draftData = {
            title: currentData.title,
            content: currentData.content,
            savedAt: new Date().toISOString(),
          };
          localStorage.setItem(storageKey, JSON.stringify(draftData));
        }
        
        lastDataRef.current = currentData;
        setLastSaved(new Date());
        setSaveStatus('saved');
        
        // Reset to idle after 3 seconds
        setTimeout(() => setSaveStatus('idle'), 3000);
      } catch (error) {
        console.error('Auto-save failed:', error);
        setSaveStatus('error');
        toast({ title: 'Error', description: 'Auto-save failed. Your changes may not be saved.', variant: 'destructive' });
        
        // Reset to idle after 5 seconds
        setTimeout(() => setSaveStatus('idle'), 5000);
      }
    }, saveInterval);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [title, content, onSave, postId, saveInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getStatusDisplay = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Save className="w-3 h-3 animate-spin" />
            Saving...
          </Badge>
        );
      case 'saved':
        return (
          <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3" />
            Saved
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <Save className="w-3 h-3" />
            Save failed
          </Badge>
        );
      default:
        return lastSaved ? (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last saved: {lastSaved.toLocaleTimeString()}
          </Badge>
        ) : null;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {getStatusDisplay()}
    </div>
  );
}

// Hook for loading drafts
export function useDraftLoader(postId?: string) {
  const [draft, setDraft] = useState<{
    title: string;
    content: string;
    savedAt: string;
  } | null>(null);

  useEffect(() => {
    const storageKey = postId ? `draft-${postId}` : 'draft-new';
    const savedDraft = localStorage.getItem(storageKey);
    
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setDraft(parsedDraft);
      } catch (error) {
        console.error('Failed to parse saved draft:', error);
        // Clean up corrupted data
        localStorage.removeItem(storageKey);
      }
    }
  }, [postId]);

  const clearDraft = (postId?: string) => {
    const storageKey = postId ? `draft-${postId}` : 'draft-new';
    localStorage.removeItem(storageKey);
    setDraft(null);
  };

  return { draft, clearDraft };
}

// Component for showing draft recovery option
export function DraftRecovery({
  postId,
  onRestore,
}: {
  postId?: string;
  onRestore: (data: { title: string; content: string }) => void;
}) {
  const { draft, clearDraft } = useDraftLoader(postId);

  if (!draft) return null;

  const savedDate = new Date(draft.savedAt);
  const isRecent = Date.now() - savedDate.getTime() < 24 * 60 * 60 * 1000; // 24 hours

  if (!isRecent) return null;

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">
            Unsaved draft found
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              onRestore({ title: draft.title, content: draft.content });
              clearDraft(postId);
            }}
            className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Restore
          </button>
          <button
            onClick={() => clearDraft(postId)}
            className="text-sm px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Dismiss
          </button>
        </div>
      </div>
      <div className="mt-2 text-xs text-blue-700">
        Saved {savedDate.toLocaleString()}
      </div>
    </div>
  );
}