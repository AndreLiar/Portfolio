"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Sparkles, FileText, BarChart, Lightbulb, AlertCircle, WifiOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
  const [lastError, setLastError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeText: "",
    },
  });

  const getErrorDetails = (error: any) => {
    if (error?.message || typeof error === 'string') {
      const errorMessage = error?.message || error;
      
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        return {
          title: 'Connection Issue',
          description: 'Unable to reach the AI service. Please check your internet connection and try again.',
          icon: WifiOff
        };
      }
      
      if (errorMessage.includes('timeout')) {
        return {
          title: 'Request Timeout',
          description: 'The analysis is taking longer than expected. Please try again with a shorter resume.',
          icon: AlertCircle
        };
      }
      
      if (errorMessage.includes('rate limit') || errorMessage.includes('quota')) {
        return {
          title: 'Service Temporarily Unavailable',
          description: 'The AI service has reached its limit. Please try again in a few minutes.',
          icon: AlertCircle
        };
      }
      
      if (errorMessage.includes('invalid') || errorMessage.includes('format')) {
        return {
          title: 'Invalid Content',
          description: 'The resume content appears to be invalid. Please ensure you\'ve pasted readable text.',
          icon: FileText
        };
      }
    }
    
    return {
      title: 'Analysis Failed',
      description: 'An unexpected error occurred. Please try again or try with different content.',
      icon: AlertCircle
    };
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysis(null);
    setLastError(null);
    
    try {
      const result = await analyzeResume(values);
      setAnalysis(result);
      setLastError(null);
    } catch (error) {
      console.error('Resume analysis failed:', error);
      const errorDetails = getErrorDetails(error);
      const errorString = error instanceof Error ? error.message : (typeof error === 'string' ? error : String(error));
      setLastError(errorString);
      
      toast({
        title: errorDetails.title,
        description: errorDetails.description,
        variant: 'destructive',
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
              
              {/* Enhanced error display */}
              {lastError && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    {lastError.includes('network') || lastError.includes('fetch') ? (
                      <WifiOff className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    ) : lastError.includes('timeout') ? (
                      <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    )}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-destructive">
                        {lastError.includes('network') || lastError.includes('fetch') ? 'Connection Issue' : 
                         lastError.includes('timeout') ? 'Analysis Timeout' :
                         lastError.includes('rate limit') ? 'Service Limit Reached' :
                         lastError.includes('invalid') ? 'Invalid Content' : 'Analysis Failed'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {lastError.includes('network') || lastError.includes('fetch') ? 
                          'Please check your internet connection and try again.' :
                         lastError.includes('timeout') ? 
                          'Try again with a shorter resume or check your connection.' :
                         lastError.includes('rate limit') ? 
                          'Please wait a few minutes before trying again.' :
                         lastError.includes('invalid') ? 
                          'Please ensure you\'ve pasted readable resume text.' :
                          'Please try again or contact support if the issue persists.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
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
