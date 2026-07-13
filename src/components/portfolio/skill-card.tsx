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
  accent?: string;
}

export function SkillCard({ title, description, skills, subcategories, Icon, accent }: SkillCardProps) {
  const hasSubcategories = subcategories && subcategories.length > 0;
  const iconStyle = accent ? { color: accent } : undefined;
  const iconBgStyle = accent ? { backgroundColor: `${accent}18` } : undefined;
  const borderStyle = accent ? { borderLeftColor: accent } : undefined;

  return (
    <Card
      className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-border/50 bg-card/50 backdrop-blur-sm group border-l-[3px]"
      style={borderStyle}
    >
      <CardHeader className="flex flex-row items-center gap-4 pb-3">
        <div
          className="p-2 rounded-lg transition-colors duration-300"
          style={iconBgStyle ?? { backgroundColor: "hsl(var(--primary) / 0.05)" }}
        >
          <Icon
            className={`${ICON_VARIANTS.skill} transition-transform duration-300 group-hover:scale-110`}
            style={iconStyle ?? { color: "hsl(var(--primary))" }}
          />
        </div>
        <div className="flex-1">
          <CardTitle className="font-headline text-xl transition-colors duration-300">{title}</CardTitle>
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
