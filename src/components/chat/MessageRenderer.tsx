'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MessageRendererProps {
  content: string;
  sender: 'user' | 'ai';
  className?: string;
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

function CollapsibleSection({ title, children, defaultExpanded = false }: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-gray-600 rounded-lg mb-4 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-left flex items-center justify-between transition-colors"
      >
        <span className="font-medium text-purple-300">{title}</span>
        <span className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="p-4 bg-gray-900/30">
          {children}
        </div>
      </div>
    </div>
  );
}

export function MessageRenderer({ content, sender, className = '' }: MessageRendererProps) {
  const [copiedBlocks, setCopiedBlocks] = useState<Set<string>>(new Set());

  // Function to detect and wrap collapsible sections
  const processCollapsibleContent = (content: string): string => {
    // Look for sections that should be collapsible (long detailed analyses)
    const collapsiblePatterns = [
      {
        pattern: /(\*\*Analysis Results\*\*[\s\S]*?)(?=\n\*\*|$)/g,
        title: 'Analysis Results'
      },
      {
        pattern: /(\*\*Agent Insights\*\*[\s\S]*?)(?=\n\*\*|$)/g,
        title: 'Agent Insights'
      },
      {
        pattern: /(\*\*Implementation Details\*\*[\s\S]*?)(?=\n\*\*|$)/g,
        title: 'Implementation Details'
      },
      {
        pattern: /(\*\*Technical Breakdown\*\*[\s\S]*?)(?=\n\*\*|$)/g,
        title: 'Technical Breakdown'
      }
    ];

    let processedContent = content;
    
    collapsiblePatterns.forEach(({ pattern, title }) => {
      processedContent = processedContent.replace(pattern, (match, group1) => {
        if (group1.length > 300) { // Only make long sections collapsible
          return `<details><summary>${title}</summary>\n\n${group1}</details>`;
        }
        return match;
      });
    });

    return processedContent;
  };

  const handleCopyCode = async (code: string, blockId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedBlocks(prev => new Set([...prev, blockId]));
      
      // Clear the copied state after 2 seconds
      setTimeout(() => {
        setCopiedBlocks(prev => {
          const newSet = new Set(prev);
          newSet.delete(blockId);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const handleCopyInsight = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (error) {
      console.error('Failed to copy insight:', error);
    }
  };

  // Custom components for markdown rendering
  const components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const codeString = String(children).replace(/\n$/, '');
      const blockId = `${language}-${codeString.slice(0, 50)}`;

      if (!inline && match) {
        return (
          <div className="relative group">
            <button
              onClick={() => handleCopyCode(codeString, blockId)}
              className="absolute top-2 right-2 z-10 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copiedBlocks.has(blockId) ? '✓ Copied' : 'Copy'}
            </button>
            <SyntaxHighlighter
              style={oneDark}
              language={language}
              PreTag="div"
              className="rounded-lg"
              {...props}
            >
              {codeString}
            </SyntaxHighlighter>
          </div>
        );
      }

      return (
        <code
          className="bg-gray-800 text-purple-300 px-1 py-0.5 rounded text-sm"
          {...props}
        >
          {children}
        </code>
      );
    },

    // Enhanced list rendering
    ul({ children }: any) {
      return (
        <ul className="list-disc list-inside space-y-2 text-gray-200 ml-4">
          {children}
        </ul>
      );
    },

    ol({ children }: any) {
      return (
        <ol className="list-decimal list-inside space-y-2 text-gray-200 ml-4">
          {children}
        </ol>
      );
    },

    // Enhanced headers
    h1({ children }: any) {
      return (
        <h1 className="text-2xl font-bold text-white mb-4 border-b border-purple-400/30 pb-2">
          {children}
        </h1>
      );
    },

    h2({ children }: any) {
      return (
        <h2 className="text-xl font-bold text-white mb-3 mt-6">
          {children}
        </h2>
      );
    },

    h3({ children }: any) {
      return (
        <h3 className="text-lg font-semibold text-purple-300 mb-2 mt-4">
          {children}
        </h3>
      );
    },

    // Enhanced blockquotes for Alex Hormozi quotes
    blockquote({ children }: any) {
      return (
        <blockquote className="border-l-4 border-purple-400 pl-4 py-2 my-4 bg-purple-900/20 rounded-r-lg">
          <div className="text-purple-200 italic relative">
            <span className="text-purple-400 text-2xl absolute -top-2 -left-2">"</span>
            {children}
            <span className="text-purple-400 text-2xl">"</span>
          </div>
        </blockquote>
      );
    },

    // Enhanced tables
    table({ children }: any) {
      return (
        <div className="overflow-x-auto my-4">
          <table className="min-w-full border border-gray-600 rounded-lg">
            {children}
          </table>
        </div>
      );
    },

    thead({ children }: any) {
      return (
        <thead className="bg-purple-900/50">
          {children}
        </thead>
      );
    },

    th({ children }: any) {
      return (
        <th className="border border-gray-600 px-4 py-2 text-left font-semibold text-purple-300">
          {children}
        </th>
      );
    },

    td({ children }: any) {
      return (
        <td className="border border-gray-600 px-4 py-2 text-gray-200">
          {children}
        </td>
      );
    },

    // Enhanced links
    a({ href, children }: any) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 underline"
        >
          {children}
        </a>
      );
    },

    // Handle HTML details/summary elements for collapsible sections
    details({ children }: any) {
      return (
        <CollapsibleSection title="Show Details" defaultExpanded={false}>
          {children}
        </CollapsibleSection>
      );
    },

    summary({ children }: any) {
      // Summary content is handled by CollapsibleSection title
      return null;
    },

    // Enhanced paragraphs with copy capability for insights
    p({ children }: any) {
      const textContent = typeof children === 'string' ? children : 
                         Array.isArray(children) ? children.join('') : '';
      
      // Check if this looks like an important insight (starts with certain patterns)
      const isInsight = /^(🎯|💡|⭐|✅|🔥|💰)/.test(textContent) || 
                       /^(Key insight|Important|Remember|Pro tip)/i.test(textContent);

      if (isInsight && textContent.length > 20) {
        return (
          <div className="group relative">
            <p className="text-gray-200 leading-relaxed mb-4">
              {children}
            </p>
            <button
              onClick={() => handleCopyInsight(textContent)}
              className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs transition-opacity"
            >
              Copy Insight
            </button>
          </div>
        );
      }

      return (
        <p className="text-gray-200 leading-relaxed mb-4">
          {children}
        </p>
      );
    }
  };

  if (sender === 'user') {
    // Simple text rendering for user messages
    return (
      <div className={className}>
        <div className="whitespace-pre-wrap">{content}</div>
      </div>
    );
  }

  // Enhanced AI message rendering with markdown
  const processedContent = processCollapsibleContent(content);
  
  return (
    <div className={`message-renderer ${className}`}>
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown
          components={components}
          remarkPlugins={[remarkGfm]}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}