'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';

export function SkillsPageHeader({ lang }: { lang: string }) {
  return (
    <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 print:hidden">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/${lang}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Technical Skills</h1>
            <p className="text-sm text-muted-foreground">
              Comprehensive breakdown of technologies and expertise
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="w-4 h-4 mr-2" />
          Print / Export PDF
        </Button>
      </div>
    </div>
  );
}
