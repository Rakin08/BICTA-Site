"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  if (!items || items.length === 0) {
    return (
      <p className="text-bicta-subtle text-sm font-body">
        No FAQ items available.
      </p>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          value={`faq-${i}`}
          className="bg-bicta-surface border border-bicta-border rounded-lg px-5 data-[state=open]:border-bicta-border-hover transition-colors"
        >
          <AccordionTrigger className="text-left font-body font-medium text-bicta-cream text-sm py-4 hover:no-underline hover:text-bicta-gold-lt transition-colors [&[data-state=open]>svg]:text-bicta-gold">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-bicta-muted font-body text-sm leading-relaxed pb-4">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
