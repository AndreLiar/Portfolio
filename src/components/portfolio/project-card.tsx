import { ArrowUpRight, Github } from "lucide-react";
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
  description: string;
  stack: string[];
  link?: string;
  repoUrl?: string;
}

export function ProjectCard({ title, description, stack, link, repoUrl }: ProjectCardProps) {
  return (
    <Card className="flex flex-col h-full transition-transform transform hover:-translate-y-1 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{description}</CardDescription>
        <div className="mt-4 flex flex-wrap gap-2">
          {stack.map((tech, index) => (
            <Badge key={index} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center gap-4">
        {link && (
          <Button variant="outline" asChild>
            <a href={link} target="_blank" rel="noopener noreferrer">
              View Project
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
        {repoUrl && (
          <Button variant="secondary" asChild>
            <a href={repoUrl} target="_blank" rel="noopener noreferrer">
              Repo Link
              <Github className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
