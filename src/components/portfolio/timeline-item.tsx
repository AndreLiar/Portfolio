import { Briefcase, type LucideIcon } from "lucide-react";

interface TimelineItemProps {
  date: string;
  title: string;
  subtitle: string;
  description: string;
  icon?: LucideIcon;
}

export function TimelineItem({
  date,
  title,
  subtitle,
  description,
  icon: Icon = Briefcase,
}: TimelineItemProps) {
  return (
    <div className="relative pl-8 sm:pl-32 py-6 group">
      <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-accent after:border-2 after:box-content after:border-border after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
          <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-20 h-6 mb-3 sm:mb-0 text-accent bg-accent/20 rounded-full">{date}</time>
          <div className="text-xl font-bold font-headline text-primary">{title}</div>
      </div>
      <div className="text-muted-foreground sm:pl-32">{subtitle}</div>
      <div className="text-muted-foreground mt-2 sm:pl-32" dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  );
}
