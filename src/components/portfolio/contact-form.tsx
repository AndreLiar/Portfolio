"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRef, useState } from "react";
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
import { Send, Loader2 } from "lucide-react";

export function ContactForm({ contactFormData, contactEmail }: { contactFormData: any; contactEmail?: string }) {
  const t = contactFormData;
  const fallbackEmail = contactEmail || "kanmegneandre@gmail.com";

  const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    message: z.string().min(10, "Message must be at least 10 characters."),
  });

  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    try {
      // Same-origin API route → Resend (server-side; key never reaches the client).
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          botcheck: honeypotRef.current?.checked ? "true" : "",
        }),
      });
      const data = await res.json().catch(() => ({ success: false }));
      if (res.ok && data.success) {
        toast({
          title: t.toast.successTitle,
          description: t.toast.successDescription,
        });
        form.reset();
      } else {
        throw new Error(data?.message || "send failed");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: t.toast?.errorTitle ?? "Message not sent",
        description:
          err instanceof Error && err.message
            ? err.message
            : t.toast?.errorDescription ??
              `Something went wrong — please email me directly at ${fallbackEmail}.`,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-card/30 backdrop-blur-sm p-8 rounded-2xl border border-border/50 shadow-sm">
        {/* Honeypot: hidden from humans, tempting to bots. Not part of RHF. */}
        <input
          ref={honeypotRef}
          type="checkbox"
          name="botcheck"
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground/80 font-medium">{t.name}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t.namePlaceholder}
                    {...field}
                    className="bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300 h-12"
                  />
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
                <FormLabel className="text-foreground/80 font-medium">{t.email}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t.emailPlaceholder}
                    {...field}
                    className="bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300 h-12"
                  />
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
              <FormLabel className="text-foreground/80 font-medium">{t.message}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t.messagePlaceholder}
                  className="min-h-[150px] bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-center pt-4">
          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            className="min-h-[56px] px-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-lg hover:shadow-primary/25 hover:-translate-y-1 transition-all duration-300 rounded-xl disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {submitting ? (
              <>
                {t.button} <Loader2 className="ml-3 h-5 w-5 animate-spin" aria-hidden="true" />
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
