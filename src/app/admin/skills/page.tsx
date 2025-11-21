'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminSkillsClient } from '@/components/admin/skills-client';
import { skillApi } from '@/lib/api/skill-client';

interface Skill {
  id: string;
  title: string;
  skills: string[];
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skillsData = await skillApi.getSkills();
        setSkills(skillsData);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading skills...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200/50">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Skills</h1>
          <p className="text-lg text-muted-foreground mt-1">Manage your technical skills and expertise areas.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/skills/new">
            <Button size="lg" className="shadow-sm">
              <Plus className="w-5 h-5 mr-2" />
              Add Skill
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1">
        <AdminSkillsClient initialSkills={skills} />
      </div>
    </div>
  );
}
