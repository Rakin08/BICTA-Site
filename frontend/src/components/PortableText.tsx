"use client";

import {
  PortableText as PortableTextComponent,
  type PortableTextComponents,
  type PortableTextBlock,
} from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-body text-bicta-muted leading-relaxed mb-4">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="font-display font-medium text-bicta-cream text-2xl mb-4 mt-8">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display font-medium text-bicta-cream text-xl mb-3 mt-6">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-bicta-gold pl-4 my-6 italic text-bicta-gold-lt font-display text-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-4 text-bicta-muted font-body">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 text-bicta-muted font-body">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-bicta-cream">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-bicta-gold hover:text-bicta-gold-lt underline underline-offset-2 transition-colors"
      >
        {children}
      </a>
    ),
  },
};

interface PortableTextProps {
  value: PortableTextBlock[];
}

export default function PortableText({ value }: PortableTextProps) {
  if (!value || value.length === 0) return null;

  return (
    <PortableTextComponent
      value={value as unknown as Parameters<typeof PortableTextComponent>[0]["value"]}
      components={components}
    />
  );
}
