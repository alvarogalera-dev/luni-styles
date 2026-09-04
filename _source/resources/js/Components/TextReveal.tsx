import { useRef, useEffect, useState, useCallback } from 'react';
import { useInView } from 'motion/react';

interface TextRevealProps {
  text:      string;
  className?: string;
  delay?:     number;
}

export default function TextReveal({ text, className = '', delay = 0 }: TextRevealProps) {
  const ref   = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const words = text.split(' ');

  return (
    <div ref={ref} className={`overflow-hidden ${className}`} aria-label={text}>
      <div className="flex flex-wrap gap-x-[0.3em] gap-y-1">
        {words.map((word, wi) => (
          <span key={wi} className="overflow-hidden inline-block">
            <span
              className="inline-block transition-transform duration-700"
              style={{
                transform:        inView ? 'translateY(0)' : 'translateY(110%)',
                opacity:          inView ? 1 : 0,
                transitionDelay:  `${delay + wi * 0.06}s`,
                transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)',
              }}
            >
              {word}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

interface CharRevealProps {
  text:       string;
  className?: string;
  delay?:     number;
  stagger?:   number;
}

export function CharReveal({ text, className = '', delay = 0, stagger = 0.03 }: CharRevealProps) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const chars  = text.split('');

  return (
    <div ref={ref} className={`overflow-hidden ${className}`} aria-label={text}>
      {chars.map((char, i) => (
        <span
          key={i}
          className="inline-block transition-all duration-600"
          style={{
            transform:        inView ? 'translateY(0)' : 'translateY(100%)',
            opacity:          inView ? 1 : 0,
            transitionDelay:  `${delay + i * stagger}s`,
            transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)',
            whiteSpace:       char === ' ' ? 'pre' : 'normal',
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}
