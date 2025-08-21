import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ICON_VARIANTS } from "@/lib/icon-constants";
import type { LucideIcon } from "lucide-react";

interface SkillCardProps {
  title: string;
  skills: string[];
  Icon: LucideIcon;
}

export function SkillCard({ title, skills, Icon }: SkillCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Icon className={ICON_VARIANTS.skill} />
        <CardTitle className="font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge key={index} variant="outline">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
