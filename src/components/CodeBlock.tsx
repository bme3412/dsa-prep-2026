import React, { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: "python" | "typescript" | "javascript";
  title?: string;
  showLineNumbers?: boolean;
}

interface HighlightedLine {
  lineNumber: number;
  tokens: React.ReactNode[];
}

// Syntax highlighting for Python
const highlightPython = (code: string): HighlightedLine[] => {
  const lines = code.split('\n');

  return lines.map((line, lineIndex) => {
    const tokens: React.ReactNode[] = [];
    let remaining = line;
    let key = 0;

    while (remaining.length > 0) {
      let matched = false;

      // Comments
      const commentMatch = remaining.match(/^(#.*)$/);
      if (commentMatch) {
        tokens.push(<span key={key++} style={{ color: '#6b7280' }}>{commentMatch[1]}</span>);
        remaining = '';
        matched = true;
      }

      // Strings
      if (!matched) {
        const stringMatch = remaining.match(/^(f?"""[\s\S]*?"""|f?'''[\s\S]*?'''|f?"[^"]*"|f?'[^']*')/);
        if (stringMatch) {
          tokens.push(<span key={key++} style={{ color: '#10b981' }}>{stringMatch[1]}</span>);
          remaining = remaining.slice(stringMatch[1].length);
          matched = true;
        }
      }

      // Decorators
      if (!matched) {
        const decoratorMatch = remaining.match(/^(@\w+)/);
        if (decoratorMatch) {
          tokens.push(<span key={key++} style={{ color: '#f59e0b' }}>{decoratorMatch[1]}</span>);
          remaining = remaining.slice(decoratorMatch[1].length);
          matched = true;
        }
      }

      // Keywords
      if (!matched) {
        const keywordMatch = remaining.match(/^(def|class|import|from|return|if|else|elif|for|while|try|except|finally|with|as|async|await|yield|raise|pass|break|continue|and|or|not|in|is|None|True|False|self|lambda|global|nonlocal)\b/);
        if (keywordMatch) {
          tokens.push(<span key={key++} style={{ color: '#c084fc' }}>{keywordMatch[1]}</span>);
          remaining = remaining.slice(keywordMatch[1].length);
          matched = true;
        }
      }

      // Built-ins
      if (!matched) {
        const builtinMatch = remaining.match(/^(print|len|range|str|int|float|list|dict|set|tuple|bool|type|isinstance|hasattr|getattr|setattr|open|enumerate|zip|map|filter|sorted|reversed|sum|min|max|abs|round|any|all|next|iter)\b/);
        if (builtinMatch) {
          tokens.push(<span key={key++} style={{ color: '#60a5fa' }}>{builtinMatch[1]}</span>);
          remaining = remaining.slice(builtinMatch[1].length);
          matched = true;
        }
      }

      // Numbers
      if (!matched) {
        const numberMatch = remaining.match(/^(\d+\.?\d*)/);
        if (numberMatch) {
          tokens.push(<span key={key++} style={{ color: '#f97316' }}>{numberMatch[1]}</span>);
          remaining = remaining.slice(numberMatch[1].length);
          matched = true;
        }
      }

      // Function calls
      if (!matched) {
        const funcMatch = remaining.match(/^(\w+)(\()/);
        if (funcMatch) {
          tokens.push(<span key={key++} style={{ color: '#60a5fa' }}>{funcMatch[1]}</span>);
          tokens.push(<span key={key++}>{funcMatch[2]}</span>);
          remaining = remaining.slice(funcMatch[1].length + 1);
          matched = true;
        }
      }

      if (!matched) {
        tokens.push(<span key={key++}>{remaining[0]}</span>);
        remaining = remaining.slice(1);
      }
    }

    return { lineNumber: lineIndex + 1, tokens };
  });
};

// Syntax highlighting for TypeScript/JavaScript
const highlightTypeScript = (code: string): HighlightedLine[] => {
  const lines = code.split('\n');

  return lines.map((line, lineIndex) => {
    const tokens: React.ReactNode[] = [];
    let remaining = line;
    let key = 0;

    while (remaining.length > 0) {
      let matched = false;

      // Comments
      const commentMatch = remaining.match(/^(\/\/.*)$/);
      if (commentMatch) {
        tokens.push(<span key={key++} style={{ color: '#6b7280' }}>{commentMatch[1]}</span>);
        remaining = '';
        matched = true;
      }

      // Template strings
      if (!matched) {
        const templateMatch = remaining.match(/^(`[^`]*`)/);
        if (templateMatch) {
          tokens.push(<span key={key++} style={{ color: '#10b981' }}>{templateMatch[1]}</span>);
          remaining = remaining.slice(templateMatch[1].length);
          matched = true;
        }
      }

      // Strings
      if (!matched) {
        const stringMatch = remaining.match(/^("[^"]*"|'[^']*')/);
        if (stringMatch) {
          tokens.push(<span key={key++} style={{ color: '#10b981' }}>{stringMatch[1]}</span>);
          remaining = remaining.slice(stringMatch[1].length);
          matched = true;
        }
      }

      // Keywords
      if (!matched) {
        const keywordMatch = remaining.match(/^(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|class|extends|implements|interface|type|enum|export|import|from|async|await|try|catch|finally|throw|new|this|super|static|public|private|protected|readonly|typeof|instanceof|void|null|undefined|true|false)\b/);
        if (keywordMatch) {
          tokens.push(<span key={key++} style={{ color: '#c084fc' }}>{keywordMatch[1]}</span>);
          remaining = remaining.slice(keywordMatch[1].length);
          matched = true;
        }
      }

      // Types (capitalized words, common types)
      if (!matched) {
        const typeMatch = remaining.match(/^(string|number|boolean|object|any|never|unknown|Array|Map|Set|Promise|Record)\b/);
        if (typeMatch) {
          tokens.push(<span key={key++} style={{ color: '#22d3ee' }}>{typeMatch[1]}</span>);
          remaining = remaining.slice(typeMatch[1].length);
          matched = true;
        }
      }

      // Numbers
      if (!matched) {
        const numberMatch = remaining.match(/^(\d+\.?\d*)/);
        if (numberMatch) {
          tokens.push(<span key={key++} style={{ color: '#f97316' }}>{numberMatch[1]}</span>);
          remaining = remaining.slice(numberMatch[1].length);
          matched = true;
        }
      }

      // Function calls
      if (!matched) {
        const funcMatch = remaining.match(/^(\w+)(\()/);
        if (funcMatch) {
          tokens.push(<span key={key++} style={{ color: '#60a5fa' }}>{funcMatch[1]}</span>);
          tokens.push(<span key={key++}>{funcMatch[2]}</span>);
          remaining = remaining.slice(funcMatch[1].length + 1);
          matched = true;
        }
      }

      // Arrow functions
      if (!matched) {
        const arrowMatch = remaining.match(/^(=>)/);
        if (arrowMatch) {
          tokens.push(<span key={key++} style={{ color: '#c084fc' }}>{arrowMatch[1]}</span>);
          remaining = remaining.slice(2);
          matched = true;
        }
      }

      if (!matched) {
        tokens.push(<span key={key++}>{remaining[0]}</span>);
        remaining = remaining.slice(1);
      }
    }

    return { lineNumber: lineIndex + 1, tokens };
  });
};

export function CodeBlock({ code, language = "python", title, showLineNumbers = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightedLines = language === "python"
    ? highlightPython(code)
    : highlightTypeScript(code);

  return (
    <div
      className="rounded-[var(--radius-lg)] overflow-hidden my-4"
      style={{
        background: '#0d1117',
        border: '1px solid #30363d',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ background: '#161b22', borderBottom: '1px solid #30363d' }}
      >
        <div className="flex items-center gap-2">
          {/* Traffic light dots */}
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f56' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#27ca40' }} />
          </div>
          {title && (
            <p className="text-xs font-medium ml-2" style={{ color: '#8b949e' }}>{title}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded"
            style={{ background: '#21262d', color: '#8b949e' }}
          >
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="text-[10px] px-2 py-0.5 rounded transition-colors"
            style={{
              background: copied ? '#238636' : '#21262d',
              color: copied ? '#ffffff' : '#8b949e'
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <pre
          className="text-[13px] leading-relaxed p-4"
          style={{
            fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
            color: '#e6edf3',
            margin: 0,
          }}
        >
          <code className="table w-full">
            {highlightedLines.map((line, idx) => (
              <div key={idx} className="table-row hover:bg-[#161b22]">
                {showLineNumbers && (
                  <span
                    className="table-cell pr-4 text-right select-none"
                    style={{ color: '#484f58', minWidth: '2.5rem', userSelect: 'none' }}
                  >
                    {line.lineNumber}
                  </span>
                )}
                <span className="table-cell whitespace-pre">{line.tokens}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
