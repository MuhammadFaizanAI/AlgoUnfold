import { useState } from "react"
import {
  Check,
  Code2,
  Copy,
  Maximize2,
  Minimize2,
} from "lucide-react"
import type { SupportedLanguage } from "../../hooks/useVisualizer"
import { codeSnippets } from "../../visualization/engine/codeTemplates"
import type { ExecutionStep } from "../../visualization/steps/Step"

interface CodePanelProps {
  step: ExecutionStep
  operationId: string
  language: SupportedLanguage
  onLanguageChange: (lang: SupportedLanguage) => void
  isMaximized?: boolean
  onToggleMaximize?: () => void
}

const languageLabels: Record<SupportedLanguage, string> = {
  cpp: "C++",
  python: "Python",
  typescript: "TypeScript",
  java: "Java",
}

export default function CodePanel({
  step,
  operationId,
  language,
  onLanguageChange,
  isMaximized,
  onToggleMaximize,
}: CodePanelProps) {
  const [copied, setCopied] = useState(false)

  // Get snippet for current operation or fallback
  const snippet = codeSnippets[operationId] || codeSnippets["singly-insertAt"]
  const codeLines = snippet[language] || snippet.cpp

  // Active line for current step
  const activeLine = step.activeCodeLines[language] || step.activeCodeLines.cpp || 1

  const handleCopy = () => {
    navigator.clipboard.writeText(codeLines.join("\n"))
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-[var(--au-border)] bg-[var(--au-surface)]">
      {/* Panel Top Bar */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-[var(--au-border-subtle)] bg-[var(--au-surface-elevated)]/80 px-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Code2 size={15} className="text-[var(--au-algorithm)]" />
            <span className="text-xs font-bold tracking-wide text-[var(--au-text)] uppercase">
              Implementation Code
            </span>
          </div>

          <span className="text-[11px] text-[var(--au-border-strong)]">|</span>

          {/* Language Selector Pills */}
          <div className="flex items-center gap-1 rounded-lg bg-[var(--au-surface)] p-0.5 border border-[var(--au-border-subtle)]">
            {(["cpp", "python", "typescript", "java"] as SupportedLanguage[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageChange(lang)}
                className={`rounded-md px-2 py-0.5 text-[11px] font-mono font-medium transition-all ${
                  language === lang
                    ? "bg-[var(--au-brand)] text-[var(--au-text-inverse)] shadow-sm font-semibold"
                    : "text-[var(--au-text-muted)] hover:text-[var(--au-text)]"
                }`}
              >
                {languageLabels[lang]}
              </button>
            ))}
          </div>

          <span className="text-[10px] font-mono text-[var(--au-text-disabled)] hidden sm:inline">
            (Line {activeLine})
          </span>
        </div>

        {/* Panel Toolbar */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            title="Copy Code"
            className="flex h-6 items-center gap-1 rounded-md px-2 text-[11px] text-[var(--au-text-secondary)] transition-colors hover:bg-[var(--au-surface-high)] hover:text-[var(--au-text)]"
          >
            {copied ? (
              <>
                <Check size={12} className="text-[var(--au-success)]" />
                <span className="text-[var(--au-success)] font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy</span>
              </>
            )}
          </button>

          {onToggleMaximize && (
            <button
              type="button"
              onClick={onToggleMaximize}
              title={isMaximized ? "Restore" : "Maximize Panel"}
              className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--au-text-secondary)] transition-colors hover:bg-[var(--au-surface-high)] hover:text-[var(--au-text)]"
            >
              {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
          )}
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="relative flex-1 overflow-auto bg-[var(--au-background)] p-3 font-mono text-xs leading-6">
        <div className="min-w-fit">
          {codeLines.map((line, idx) => {
            const lineNum = idx + 1
            const isHighlighted = lineNum === activeLine

            return (
              <div
                key={lineNum}
                className={`flex items-center rounded px-2 transition-all duration-200 ${
                  isHighlighted
                    ? "bg-amber-400/15 border-l-4 border-amber-400 font-bold text-amber-100 shadow-[0_0_15px_rgba(251,191,36,0.15)]"
                    : "text-[var(--au-text-secondary)] hover:bg-[var(--au-surface-high)]/40"
                }`}
              >
                {/* Line Number & Indicator */}
                <div className="flex w-10 shrink-0 items-center justify-between pr-3 select-none">
                  <span
                    className={`text-[11px] ${
                      isHighlighted
                        ? "text-amber-300 font-bold"
                        : "text-[var(--au-text-disabled)]"
                    }`}
                  >
                    {lineNum}
                  </span>
                  {isHighlighted && (
                    <span className="text-[10px] text-amber-300 animate-pulse">
                      ▶
                    </span>
                  )}
                </div>

                {/* Code Text with Syntax Coloring */}
                <div className="flex-1 whitespace-pre pl-1">
                  {renderSyntaxHighlight(line)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function renderSyntaxHighlight(line: string) {
  const keywords = ["void", "int", "const", "let", "function", "def", "return", "if", "for", "while", "public", "class", "new", "delete", "nullptr", "null", "None", "break"]
  const types = ["Node", "ListNode", "DNode", "CNode", "number"]

  const words = line.split(/(\s+|[(){}[\];,.<>=!+*&|:-])/g)

  return words.map((word, i) => {
    if (keywords.includes(word)) {
      return (
        <span key={i} className="text-[var(--au-brand)] font-semibold">
          {word}
        </span>
      )
    }
    if (types.includes(word)) {
      return (
        <span key={i} className="text-[var(--au-algorithm)] font-semibold">
          {word}
        </span>
      )
    }
    if (word.startsWith("//") || word.startsWith("#")) {
      return (
        <span key={i} className="text-[var(--au-text-disabled)] italic">
          {word}
        </span>
      )
    }
    if (/^\d+$/.test(word)) {
      return (
        <span key={i} className="text-[var(--au-warning)]">
          {word}
        </span>
      )
    }
    return <span key={i}>{word}</span>
  })
}
