"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Sparkles, FileText, BarChart, Lightbulb } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import type { AnalyzeResumeOutput } from "@/ai/flows/resume-analyzer";
import { analyzeResume } from "@/ai/flows/resume-analyzer";

const formSchema = z.object({
  resumeText: z
    .string()
    .min(200, "Resume text must be at least 200 characters to be analyzed effectively."),
});

export function ResumeAnalyzerClient() {
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<AnalyzeResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeText: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeResume(values);
      setAnalysis(result);
    } catch (error) {
      console.error("Resume analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Your Resume</CardTitle>
          <CardDescription>Paste the full text of your resume below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="resumeText"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your resume here..."
                        className="min-h-[300px] text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze My Resume
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="min-h-[480px]">
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>AI-generated feedback will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Performing AI magic...</p>
            </div>
          )}
          {!isLoading && !analysis && (
             <div className="flex flex-col items-center justify-center h-64 text-muted-foreground text-center">
                <FileText className="h-12 w-12 mb-4" />
                <p>Your feedback is just a click away.</p>
             </div>
          )}
          {analysis && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-semibold">Overall Score</h4>
                  <span className="text-lg font-bold text-accent">
                    {analysis.feedback.overallScore}/100
                  </span>
                </div>
                <Progress value={analysis.feedback.overallScore} className="w-full" />
              </div>
              <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Content Feedback
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {analysis.feedback.content}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <BarChart className="w-4 h-4" />
                      Structure & Formatting
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {analysis.feedback.structure}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Keyword Optimization
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {analysis.feedback.keywordOptimization}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
