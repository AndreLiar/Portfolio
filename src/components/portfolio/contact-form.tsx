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

// Web3Forms access key — safe to expose (it only routes submissions to the
// registered inbox, it is not a secret). Override via NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
// in Vercel env if you ever rotate it; the baked-in default keeps it working.
const WEB3FORMS_ACCESS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "a2113f54-1a53-4e74-b316-42c4d6beb6e2";

export function ContactForm({ contactFormData, contactEmail }: { contactFormData: any; contactEmail?: string }) {
  const t = contactFormData;
  const fallbackEmail = contactEmail || "kanmegnea@gmail.com";

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
    // No key configured yet → keep the (corrected) mailto behaviour so the
    // button is never a dead click.
    if (!WEB3FORMS_ACCESS_KEY) {
      const subject = encodeURIComponent(`Portfolio contact from ${values.name}`);
      const body = encodeURIComponent(
        `Name: ${values.name}\nEmail: ${values.email}\n\nMessage:\n${values.message}`
      );
      window.location.href = `mailto:${fallbackEmail}?subject=${subject}&body=${body}`;
      return;
    }

    setSubmitting(true);
    try {
      // Web3Forms' documented React path is multipart FormData (their JSON
      // endpoint can 400 on some field combinations). No Content-Type header —
      // the browser sets the multipart boundary itself.
      const fd = new FormData();
      fd.append("access_key", WEB3FORMS_ACCESS_KEY);
      fd.append("subject", `Portfolio contact from ${values.name}`);
      fd.append("from_name", values.name);
      fd.append("name", values.name);
      fd.append("email", values.email);
      fd.append("message", values.message);
      // honeypot — bots that tick this hidden box get rejected by Web3Forms
      fd.append("botcheck", honeypotRef.current?.checked ? "true" : "");

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: t.toast.successTitle,
          description: t.toast.successDescription,
        });
        form.reset();
      } else {
        console.error("Web3Forms error:", data);
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
