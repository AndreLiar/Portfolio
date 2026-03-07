import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ICON_VARIANTS } from "@/lib/icon-constants";
import type { LucideIcon } from "lucide-react";

interface Subcategory {
  name: string;
  items: string[];
}

interface SkillCardProps {
  title: string;
  description?: string;
  skills?: string[];
  subcategories?: Subcategory[];
  Icon: LucideIcon;
}

export function SkillCard({ title, description, skills, subcategories, Icon }: SkillCardProps) {
  // Use subcategories if available, otherwise fall back to skills array
  const hasSubcategories = subcategories && subcategories.length > 0;

  return (
    <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-border/50 bg-card/50 backdrop-blur-sm group">
      <CardHeader className="flex flex-row items-center gap-4 pb-3">
        <div className="p-2 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors duration-300">
          <Icon className={`${ICON_VARIANTS.skill} text-primary transition-transform duration-300 group-hover:scale-110`} />
        </div>
        <div className="flex-1">
          <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors duration-300">{title}</CardTitle>
          {description && (
            <CardDescription className="text-sm text-muted-foreground mt-1">
              {description}
            </CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {hasSubcategories ? (
          <div className="space-y-4">
            {subcategories.map((subcategory, index) => (
              <div key={index} className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground/80">
                  {subcategory.name}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {subcategory.items.map((item, itemIndex) => (
                    <Badge
                      key={itemIndex}
                      variant="outline"
                      className="bg-background/50 hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-all duration-300 py-1"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills?.map((skill, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-background/50 hover:bg-primary/5 hover:text-primary hover:border-primary/50 transition-all duration-300 py-1"
              >
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
