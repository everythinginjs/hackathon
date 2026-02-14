import React from 'react';

export interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export function H1({ children, className = '' }: TypographyProps) {
  return (
    <h1
      className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className = '' }: TypographyProps) {
  return (
    <h2
      className={`scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${className}`}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className = '' }: TypographyProps) {
  return (
    <h3
      className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`}
    >
      {children}
    </h3>
  );
}

export function H4({ children, className = '' }: TypographyProps) {
  return (
    <h4
      className={`scroll-m-20 text-xl font-semibold tracking-tight ${className}`}
    >
      {children}
    </h4>
  );
}

export function H5({ children, className = '' }: TypographyProps) {
  return (
    <h5
      className={`scroll-m-20 text-lg font-semibold tracking-tight ${className}`}
    >
      {children}
    </h5>
  );
}

export function H6({ children, className = '' }: TypographyProps) {
  return (
    <h6
      className={`scroll-m-20 text-base font-semibold tracking-tight ${className}`}
    >
      {children}
    </h6>
  );
}

export function Title({ children, className = '' }: TypographyProps) {
  return <p className={`text-xl font-semibold ${className}`}>{children}</p>;
}

export function Subtitle({ children, className = '' }: TypographyProps) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
  );
}

export function Caption({ children, className = '' }: TypographyProps) {
  return (
    <p className={`text-xs text-muted-foreground ${className}`}>{children}</p>
  );
}

export function Lead({ children, className = '' }: TypographyProps) {
  return (
    <p className={`text-xl text-muted-foreground ${className}`}>{children}</p>
  );
}

export function Large({ children, className = '' }: TypographyProps) {
  return <div className={`text-lg font-semibold ${className}`}>{children}</div>;
}

export function Small({ children, className = '' }: TypographyProps) {
  return (
    <small className={`text-sm font-medium leading-none ${className}`}>
      {children}
    </small>
  );
}

export function Muted({ children, className = '' }: TypographyProps) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
  );
}

export function P({ children, className = '' }: TypographyProps) {
  return (
    <p className={`leading-7 [&:not(:first-child)]:mt-6 ${className}`}>
      {children}
    </p>
  );
}

export function Blockquote({ children, className = '' }: TypographyProps) {
  return (
    <blockquote className={`mt-6 border-l-2 pl-6 italic ${className}`}>
      {children}
    </blockquote>
  );
}

export function InlineCode({ children, className = '' }: TypographyProps) {
  return (
    <code
      className={`relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold ${className}`}
    >
      {children}
    </code>
  );
}

// Export all components as a named object for easier importing
export const Typography = {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Title,
  Subtitle,
  Caption,
  Lead,
  Large,
  Small,
  Muted,
  P,
  Blockquote,
  InlineCode,
};
