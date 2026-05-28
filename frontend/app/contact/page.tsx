"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle, AlertCircle, Loader2, Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import PageHero from "@/components/layout/PageHero";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Submission failed");
      }

      setSubmitted(true);
      toast.success("Message sent successfully!");
      reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const inputClasses = cn(
    "w-full bg-bicta-surface border border-bicta-border text-bicta-cream",
    "font-body text-sm px-3 py-2.5 rounded-md outline-none",
    "focus:border-bicta-gold transition-colors placeholder:text-bicta-subtle/40"
  );

  const labelClasses =
    "block font-body text-[0.6875rem] uppercase tracking-[0.15em] text-bicta-subtle mb-1.5";

  const errorClasses =
    "flex items-center gap-1 text-red-400 text-xs mt-1 font-body";

  return (
    <div className="min-h-screen bg-bicta-void">
      <PageHero
        badge="Contact"
        headline="Get in Touch"
        subtext="Have a question, partnership idea, or just want to say hello? We'd love to hear from you."
      />

      <section className="py-16 md:py-24">
        <div
          className="mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
          style={{ maxWidth: 1280 }}
        >
          {/* Left — Info */}
          <div>
            <h2
              className="font-display font-medium text-bicta-cream mb-6"
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                lineHeight: 1.1,
              }}
            >
              Let&apos;s Start a Conversation
            </h2>
            <p className="font-body text-bicta-muted leading-relaxed mb-8">
              Whether you&apos;re interested in partnership, have questions
              about our programs, or want to contribute to Bangladesh&apos;s
              tech ecosystem — reach out.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-bicta-gold/10 border border-bicta-gold/20 flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-bicta-gold" />
                </div>
                <div>
                  <span className="font-body text-[0.6875rem] uppercase tracking-wider text-bicta-subtle block mb-0.5">
                    Email
                  </span>
                  <a
                    href="mailto:info@bicta.org"
                    className="font-body text-sm text-bicta-cream hover:text-bicta-gold transition-colors"
                  >
                    info@bicta.org
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-bicta-gold/10 border border-bicta-gold/20 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-bicta-gold" />
                </div>
                <div>
                  <span className="font-body text-[0.6875rem] uppercase tracking-wider text-bicta-subtle block mb-0.5">
                    Location
                  </span>
                  <span className="font-body text-sm text-bicta-cream">
                    Dhaka, Bangladesh
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-bicta-surface border border-bicta-border rounded-xl p-6 md:p-8">
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle
                  size={40}
                  className="text-emerald-400 mx-auto mb-4"
                />
                <h3 className="font-display text-xl text-bicta-cream mb-2">
                  Message sent!
                </h3>
                <p className="text-sm text-bicta-muted font-body mb-4">
                  We&apos;ll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="font-body text-sm text-bicta-gold hover:text-bicta-gold-lt underline underline-offset-4 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className={labelClasses}>
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register("name")}
                    placeholder="Your name"
                    className={inputClasses}
                  />
                  {errors.name && (
                    <p className={errorClasses}>
                      <AlertCircle size={12} /> {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClasses}>
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    className={inputClasses}
                  />
                  {errors.email && (
                    <p className={errorClasses}>
                      <AlertCircle size={12} /> {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClasses}>Subject (optional)</label>
                  <input
                    {...register("subject")}
                    placeholder="What's this about?"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    {...register("message")}
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                    className={cn(inputClasses, "resize-none")}
                  />
                  {errors.message && (
                    <p className={errorClasses}>
                      <AlertCircle size={12} /> {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "w-full flex items-center justify-center gap-2",
                    "px-6 py-3 bg-bicta-gold text-bicta-void",
                    "font-body font-medium uppercase tracking-[0.08em] text-sm",
                    "hover:scale-[1.01] hover:shadow-cta-glow transition-all",
                    "disabled:opacity-50 disabled:pointer-events-none"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />{" "}
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
