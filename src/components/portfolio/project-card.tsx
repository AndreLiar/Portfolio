import { ArrowUpRight, Github, ListChecks, Rocket, User } from "lucide-react";
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
      <CardContent className="flex-grow space-y-6">
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm text-muted-foreground"><User className="w-4 h-4 text-accent" /> Role</h4>
          <p className="text-sm">{role}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm text-muted-foreground"><Rocket className="w-4 h-4 text-accent" /> Impact</h4>
          <p className="text-sm">{impact}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm text-muted-foreground"><ListChecks className="w-4 h-4 text-accent" /> Features</h4>
          <ul className="space-y-1 pl-5">
            {features.map((feature, index) => (
              <li key={index} className="text-sm list-disc">{feature}</li>
            ))}
          </ul>
        </div>
        <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm text-muted-foreground">Stack</h4>
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
        {link && link !=='#' && (
          <Button asChild>
            <a href={link} target="_blank" rel="noopener noreferrer">
              Live Demo
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
        {repoUrl && repoUrl !== '#' && (
          <Button variant="secondary" asChild>
            <a href={repoUrl} target="_blank" rel="noopener noreferrer">
              GitHub
              <Github className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
