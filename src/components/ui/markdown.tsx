"use client";

import React from 'react';

interface MarkdownProps {
  children: string;
  className?: string;
}

export function Markdown({ children, className = '' }: MarkdownProps) {
  // Simple markdown parser for basic formatting
  const parseMarkdown = (text: string) => {
    // Split by double line breaks to create paragraphs
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, paragraphIndex) => {
      // Handle bullet points
      if (paragraph.includes('•')) {
        const lines = paragraph.split('\n');
        const bulletPoints = lines.filter(line => line.trim().startsWith('•'));
        const nonBulletLines = lines.filter(line => !line.trim().startsWith('•'));
        
        return (
          <div key={paragraphIndex} className="space-y-3">
            {nonBulletLines.length > 0 && (
              <div>
                {nonBulletLines.map((line, lineIndex) => (
                  <p key={lineIndex} className="mb-3">
                    {parseInlineMarkdown(line)}
                  </p>
                ))}
              </div>
            )}
            {bulletPoints.length > 0 && (
              <ul className="space-y-3 ml-0 list-none">
                {bulletPoints.map((item, itemIndex) => {
                  const cleanItem = item.replace('•', '').trim();
                  // Extract emoji if present at the start
                  const emojiMatch = cleanItem.match(/^(🚀|🤖|☁️|💡|⚡)\s*/);
                  const emoji = emojiMatch ? emojiMatch[1] : '';
                  const text = emojiMatch ? cleanItem.replace(emojiMatch[0], '') : cleanItem;
                  
                  return (
                    <li key={itemIndex} className="flex items-start gap-3">
                      {emoji ? (
                        <span className="text-xl mt-0.5 flex-shrink-0" role="img" aria-hidden="true">
                          {emoji}
                        </span>
                      ) : (
                        <span className="text-primary mt-1 flex-shrink-0">•</span>
                      )}
                      <span className="flex-1">{parseInlineMarkdown(text)}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      } else {
        // Regular paragraph
        return (
          <p key={paragraphIndex} className="mb-4">
            {parseInlineMarkdown(paragraph)}
          </p>
        );
      }
    });
  };

  const parseInlineMarkdown = (text: string) => {
    // Handle bold text with **text**
    const parts = text.split(/(\*\*.*?\*\*)/);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      } else if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={index} className="italic text-muted-foreground">
            {part.slice(1, -1)}
          </em>
        );
      } else {
        return part;
      }
    });
  };

  return (
    <div className={className}>
      {parseMarkdown(children)}
    </div>
  );
}