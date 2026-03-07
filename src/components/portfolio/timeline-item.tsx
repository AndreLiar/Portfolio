import { Briefcase, Calendar, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface TimelineItemProps {
  date: string;
  title: string;
  subtitle: string;
  description: string;
  icon?: LucideIcon;
  isLast?: boolean;
}

export function TimelineItem({
  date,
  title,
  subtitle,
  description,
  icon: Icon = Briefcase,
  isLast
}: TimelineItemProps) {
  return (
    <div className="relative pl-8 sm:pl-12 py-2 group">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-[11px] sm:left-[15px] top-10 bottom-0 w-px bg-border group-hover:bg-primary/50 transition-colors duration-300" />
      )}

      {/* Timeline Dot */}
      <div className="absolute left-0 sm:left-1 top-1 w-6 h-6 rounded-full border-2 border-primary bg-background flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-300 shadow-sm group-hover:shadow-primary/20">
        <div className="w-2 h-2 rounded-full bg-primary" />
      </div>

      {/* Content Card */}
      <motion.div
        className="ml-2 sm:ml-4 p-4 sm:p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/20 hover:bg-card/80 hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
        whileHover={{ x: 5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h4 className="text-xl font-bold font-headline text-foreground group-hover:text-primary transition-colors">
            {title}
          </h4>
          <div className="flex items-center text-xs font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full w-fit border border-transparent group-hover:border-primary/10 transition-colors">
            <Calendar className="w-3 h-3 mr-2" />
            {date}
          </div>
        </div>

        <div className="text-primary/80 font-medium mb-3 flex items-center text-sm" dangerouslySetInnerHTML={{ __html: subtitle }} />

        <div className="text-muted-foreground text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
      </motion.div>
    </div>
  );
}
