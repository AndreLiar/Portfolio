"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import Image from "next/image";

const TAG_ACCENTS: Record<string, string> = {
  kubernetes: "#326CE5",
  gitops: "#10b981",
  argocd: "#f97316",
  "platform-engineering": "#8b5cf6",
  devops: "#0ea5e9",
  "bare-metal": "#64748b",
  k3s: "#3b82f6",
  ai: "#f43f5e",
  reloader: "#10b981",
};

const CARD_GRADIENTS = [
  "from-blue-500/20 via-blue-400/10 to-transparent",
  "from-emerald-500/20 via-emerald-400/10 to-transparent",
  "from-violet-500/20 via-violet-400/10 to-transparent",
  "from-orange-500/20 via-orange-400/10 to-transparent",
];

interface BlogCardProps {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readTime: number;
  url: string;
  image?: string;
  index?: number;
  t: {
    readPost: string;
    minRead: string;
    postedOn: string;
  };
}

export function BlogCard({
  title,
  description,
  date,
  tags,
  readTime,
  url,
  image,
  index = 0,
  t,
}: BlogCardProps) {
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const primaryTagColor = TAG_ACCENTS[tags[0]] ?? "#3b82f6";

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="flex flex-col h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group">
      {/* Cover image / gradient banner */}
      <div className="relative h-44 w-full overflow-hidden bg-muted flex-shrink-0">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        )}
        {/* Overlay gradient at bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
        {/* Primary tag chip over image */}
        <div className="absolute bottom-3 left-3">
          <span
            className="text-white text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: primaryTagColor }}
          >
            {tags[0]}
          </span>
        </div>
      </div>

      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-base font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {description}
        </p>

        {/* Remaining tags (skip first — shown in image overlay) */}
        {tags.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tags.slice(1, 4).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs px-2 py-0.5 font-medium"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between gap-2 border-t border-border/40 mt-auto">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {readTime} {t.minRead}
          </span>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-8 px-3 hover:bg-primary/10 hover:text-primary group/btn"
          >
            {t.readPost}
            <ArrowUpRight className="w-3 h-3 ml-1 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}
