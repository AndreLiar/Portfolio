"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2, Wifi, WifiOff, AlertCircle } from "lucide-react";
import { sendEmail } from "@/app/actions";

export function ContactForm({ contactFormData }: { contactFormData: any }) {
  const t = contactFormData;
  
  const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    message: z.string().min(10, "Message must be at least 10 characters."),
  });
  
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const getErrorMessage = (error: any) => {
    if (typeof error === 'string') {
      if (error.includes('network') || error.includes('fetch')) {
        return { message: t.toast.errorNetwork || 'Network error. Please check your connection and try again.', icon: WifiOff };
      }
      if (error.includes('timeout')) {
        return { message: t.toast.errorTimeout || 'Request timed out. Please try again.', icon: AlertCircle };
      }
      if (error.includes('Resend API Key')) {
        return { message: t.toast.errorResend || 'Email service temporarily unavailable.', icon: AlertCircle };
      }
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return { message: t.toast.errorNetwork || 'Network error. Please check your connection and try again.', icon: WifiOff };
    }
    
    return { message: t.toast.errorDescription || 'Something went wrong. Please try again.', icon: AlertCircle };
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setLastError(null);
    setSubmitAttempted(true);
    
    try {
      const result = await sendEmail(values);
      if (result?.error) {
        const errorInfo = getErrorMessage(result.error);
        setLastError(result.error);
        toast({
          title: t.toast.errorTitle,
          description: errorInfo.message,
          variant: "destructive",
        });
      } else {
        setLastError(null);
        toast({
          title: t.toast.successTitle,
          description: t.toast.successDescription,
        });
        form.reset();
        setSubmitAttempted(false);
        // Focus back to name field after successful submission
        setTimeout(() => {
          const nameField = document.querySelector('input[name="name"]') as HTMLInputElement;
          if (nameField) nameField.focus();
        }, 100);
      }
    } catch (e) {
      console.error('Contact form error:', e);
      const errorInfo = getErrorMessage(e);
      setLastError(e instanceof Error ? e.message : 'Unknown error');
      toast({
        title: t.toast.errorTitle,
        description: errorInfo.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      // Focus on error message if there was an error
      if (lastError) {
        setTimeout(() => {
          const errorElement = document.querySelector('[role="alert"]');
          if (errorElement) {
            (errorElement as HTMLElement).focus();
          }
        }, 100);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.name}</FormLabel>
                <FormControl>
                  <Input placeholder={t.namePlaceholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.email}</FormLabel>
                <FormControl>
                  <Input placeholder={t.emailPlaceholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.message}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t.messagePlaceholder}
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Enhanced error display */}
        {lastError && (
          <div 
            className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
            role="alert"
            aria-live="polite"
            tabIndex={-1}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">
                  {lastError.includes('network') || lastError.includes('fetch') ? 'Connection Issue' : 
                   lastError.includes('timeout') ? 'Request Timeout' :
                   lastError.includes('Resend') ? 'Service Unavailable' : 'Error'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {lastError.includes('network') || lastError.includes('fetch') ? 
                    'Please check your internet connection and try again.' :
                   lastError.includes('timeout') ? 
                    'The request took too long. Please try again.' :
                   lastError.includes('Resend') ? 
                    'Email service is temporarily unavailable. Please try again later.' :
                    'Please try again or contact me directly.'}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-center">
          <Button 
            type="submit" 
            size="lg" 
            disabled={isSubmitting}
            className="min-h-[52px] px-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-describedby={submitAttempted && lastError ? "form-error" : undefined}
          >
             {isSubmitting ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" aria-hidden="true" />
                {t.buttonSending}
              </>
            ) : (
              <>
                {t.button} <Send className="ml-3 h-5 w-5" aria-hidden="true" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
