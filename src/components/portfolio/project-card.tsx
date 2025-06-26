import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, PlayCircle } from "lucide-react";

interface ProjectCardProps {
  title: string;
  purpose: string;
  stack: string[];
  impact: string;
  role: string;
  features: string[];
  link?: string;
  repoUrl?: string;
}

export function ProjectCard({ title, purpose, stack, impact, role, features, link, repoUrl }: ProjectCardProps) {
  return (
    <Card className="flex flex-col h-full transition-transform transform hover:-translate-y-1 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-xl">{title}</CardTitle>
        <CardDescription>{purpose}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <h4 className="font-semibold mb-2 text-sm">Role</h4>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-sm">Impact</h4>
          <p className="text-sm text-muted-foreground">{impact}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-sm">Features</h4>
          <ul className="space-y-1 pl-5 text-muted-foreground">
            {features.map((feature, index) => (
              <li key={index} className="text-sm list-disc">{feature}</li>
            ))}
          </ul>
        </div>
        <div>
            <h4 className="font-semibold mb-2 text-sm">Stack</h4>
            <div className="mt-2 flex flex-wrap gap-2">
            {stack.map((tech, index) => (
                <Badge key={index} variant="secondary">
                {tech}
                </Badge>
            ))}
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center gap-4 pt-6 border-t mt-auto">
        {link && (
          <Button asChild>
            <a href={link} target="_blank" rel="noopener noreferrer">
              <PlayCircle className="mr-2 h-4 w-4" />
              Live Demo
            </a>
          </Button>
        )}
        {repoUrl && (
          <Button variant="secondary" asChild>
            <a href={repoUrl} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
