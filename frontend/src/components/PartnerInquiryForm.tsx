"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const inquirySchema = z.object({
  organizationName: z.string().min(1, "Organization name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  interestType: z.enum([
    "sponsor",
    "university_partner",
    "media_partner",
    "ecosystem_partner",
    "other",
  ]),
  notes: z.string().optional(),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

export default function PartnerInquiryForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      interestType: "sponsor",
    },
  });

  const onSubmit = async (data: InquiryFormData) => {
    try {
      const res = await fetch("/api/partner-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Submission failed");
      }

      setSubmitted(true);
      toast.success("Inquiry submitted successfully!");
      reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  if (submitted) {
    return (
      <div className="bg-bicta-surface border border-emerald-500/20 rounded-xl p-8 text-center">
        <CheckCircle size={40} className="text-emerald-400 mx-auto mb-4" />
        <h3 className="font-display text-xl text-bicta-cream mb-2">
          Thank you for your interest!
        </h3>
        <p className="text-sm text-bicta-muted font-body mb-4">
          We&apos;ll reach out within 48 hours to discuss partnership
          opportunities.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="font-body text-sm text-bicta-gold hover:text-bicta-gold-lt underline underline-offset-4 transition-colors"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  const inputClasses = cn(
    "w-full bg-bicta-void border border-bicta-border text-bicta-cream",
    "font-body text-sm px-3 py-2.5 rounded-md outline-none",
    "focus:border-bicta-gold transition-colors placeholder:text-bicta-subtle/40"
  );

  const labelClasses =
    "block font-body text-[0.6875rem] uppercase tracking-[0.15em] text-bicta-subtle mb-1.5";

  const errorClasses = "flex items-center gap-1 text-red-400 text-xs mt-1 font-body";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Organization Name */}
      <div>
        <label className={labelClasses}>
          Organization Name <span className="text-red-400">*</span>
        </label>
        <input
          {...register("organizationName")}
          placeholder="e.g. Grameenphone"
          className={inputClasses}
        />
        {errors.organizationName && (
          <p className={errorClasses}>
            <AlertCircle size={12} /> {errors.organizationName.message}
          </p>
        )}
      </div>

      {/* Contact Name */}
      <div>
        <label className={labelClasses}>
          Contact Name <span className="text-red-400">*</span>
        </label>
        <input
          {...register("contactName")}
          placeholder="e.g. John Doe"
          className={inputClasses}
        />
        {errors.contactName && (
          <p className={errorClasses}>
            <AlertCircle size={12} /> {errors.contactName.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className={labelClasses}>
          Email <span className="text-red-400">*</span>
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="e.g. john@company.com"
          className={inputClasses}
        />
        {errors.email && (
          <p className={errorClasses}>
            <AlertCircle size={12} /> {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className={labelClasses}>Phone (optional)</label>
        <input
          {...register("phone")}
          placeholder="e.g. +880 1XXX-XXXXXX"
          className={inputClasses}
        />
      </div>

      {/* Interest Type */}
      <div>
        <label className={labelClasses}>
          Partnership Type <span className="text-red-400">*</span>
        </label>
        <select {...register("interestType")} className={inputClasses}>
          <option value="sponsor">Sponsor</option>
          <option value="university_partner">University Partner</option>
          <option value="media_partner">Media Partner</option>
          <option value="ecosystem_partner">Ecosystem Partner</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className={labelClasses}>Additional Notes (optional)</label>
        <textarea
          {...register("notes")}
          rows={4}
          placeholder="Tell us about your goals and how you'd like to partner..."
          className={cn(inputClasses, "resize-none")}
        />
      </div>

      {/* Submit */}
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
            <Loader2 size={16} className="animate-spin" /> Submitting...
          </>
        ) : (
          "Submit Inquiry"
        )}
      </button>
    </form>
  );
}
