import { Card, CardContent } from "@/components/ui/card";

interface RecommendationCardProps {
  quote: string;
  author: string;
  title: string;
}

export function RecommendationCard({ quote, author, title }: RecommendationCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <blockquote className="border-l-4 border-accent pl-4 italic text-muted-foreground">
          {quote}
        </blockquote>
        <p className="mt-4 font-semibold font-headline">{author}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </CardContent>
    </Card>
  );
}
