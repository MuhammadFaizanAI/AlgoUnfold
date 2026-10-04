import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Clock,
  HelpCircle,
  Layers,
  Maximize2,
  Minimize2,
  Zap,
} from "lucide-react"
import type { ExecutionStep } from "../../visualization/steps/Step"

interface ExplanationPanelProps {
  step: ExecutionStep
  isMaximized?: boolean
  onToggleMaximize?: () => void
}

export default function ExplanationPanel({
  step,
  isMaximized,
  onToggleMaximize,
}: ExplanationPanelProps) {
  const { explanationDetail, complexity, changedHighlight } = step

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-[var(--au-border)] bg-[var(--au-surface)]">
      {/* Panel Top Bar */}
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-[var(--au-border-subtle)] bg-[var(--au-surface-elevated)]/80 px-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-[var(--au-brand)]" />
            <span className="text-xs font-semibold tracking-wide text-[var(--au-text)] uppercase">
              Step Explanation & Concept
            </span>
          </div>

          <span className="text-[11px] text-[var(--au-border-strong)]">|</span>

          <span className="rounded-md bg-[var(--au-surface-high)] px-2 py-0.5 text-[11px] font-mono font-medium text-[var(--au-brand)]">
            Step {step.stepIndex + 1} of {step.totalSteps}
          </span>
        </div>

        {/* Panel Toolbar */}
        <div className="flex items-center gap-2">
          {onToggleMaximize && (
            <button
              type="button"
              onClick={onToggleMaximize}
              title={isMaximized ? "Restore" : "Maximize Panel"}
              className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--au-text-secondary)] transition-colors hover:bg-[var(--au-surface-high)] hover:text-[var(--au-text)]"
            >
              {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col gap-3.5 overflow-auto p-3.5 bg-[var(--au-background)]">
        {/* =========================================================
            PROMINENT HIGHLIGHTER BANNER: WHAT JUST CHANGED IN THIS STEP
            ========================================================= */}
        {changedHighlight && (
          <div className="relative overflow-hidden rounded-xl border-2 border-amber-400 bg-amber-400/10 p-3.5 shadow-md">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-black shadow-sm">
                <Zap size={14} className="fill-black" />
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                What Just Changed in This Step
              </span>
            </div>

            <h3 className="mt-1.5 text-sm font-bold text-amber-100">
              {changedHighlight.title}
            </h3>

            <p className="mt-1 text-xs leading-5 text-amber-200/90 font-medium">
              {changedHighlight.description}
            </p>
          </div>
        )}

        {/* Step Title Header Card */}
        <div className="rounded-lg border border-[var(--au-border)] bg-[var(--au-surface-elevated)] p-3.5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--au-brand)]">
                <CheckCircle2 size={14} />
                <span>ALGORITHM PHASE</span>
              </div>
              <h2 className="mt-1 text-sm font-bold text-[var(--au-text)]">
                {step.title}
              </h2>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--au-surface)] px-2 py-1 border border-[var(--au-border-subtle)]">
              <Clock size={12} className="text-[var(--au-text-muted)]" />
              <span className="font-mono text-xs font-semibold text-[var(--au-text)]">
                {complexity.time}
              </span>
            </div>
          </div>

          <p className="mt-2 text-xs leading-5 text-[var(--au-text-secondary)]">
            {step.description}
          </p>
        </div>

        {/* Narrative & Pedagogical Breakdown */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Action Taken */}
          <div className="flex flex-col rounded-lg border border-[var(--au-border)] bg-[var(--au-surface)] p-3">
            <div className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--au-text-muted)]">
              <AlertCircle size={13} className="text-[var(--au-brand)]" />
              <span>Exact Operation</span>
            </div>
            <p className="text-xs leading-5 text-[var(--au-text)] font-mono text-[11px]">
              {explanationDetail.action}
            </p>
          </div>

          {/* Why This Matters */}
          <div className="flex flex-col rounded-lg border border-[var(--au-border)] bg-[var(--au-surface)] p-3">
            <div className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--au-text-muted)]">
              <HelpCircle size={13} className="text-[var(--au-warning)]" />
              <span>Why This Matters</span>
            </div>
            <p className="text-xs leading-5 text-[var(--au-text-secondary)]">
              {explanationDetail.why}
            </p>
          </div>
        </div>

        {/* Invariant & State Assurance */}
        {explanationDetail.invariant && (
          <div className="flex items-start gap-2.5 rounded-lg border border-[var(--au-brand-soft)] bg-[var(--au-brand-soft)]/50 p-2.5">
            <Layers size={15} className="mt-0.5 shrink-0 text-[var(--au-brand)]" />
            <div className="text-xs">
              <span className="font-semibold text-[var(--au-brand)]">List Invariant: </span>
              <span className="text-[var(--au-text)]">{explanationDetail.invariant}</span>
            </div>
          </div>
        )}

        {/* Complexity Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="flex flex-col rounded-lg border border-[var(--au-border)] bg-[var(--au-surface-elevated)] p-2.5 text-center">
            <span className="text-[10px] uppercase tracking-wider text-[var(--au-text-muted)]">
              Time
            </span>
            <span className="mt-0.5 font-mono text-xs font-bold text-[var(--au-brand)]">
              {complexity.time}
            </span>
          </div>

          <div className="flex flex-col rounded-lg border border-[var(--au-border)] bg-[var(--au-surface-elevated)] p-2.5 text-center">
            <span className="text-[10px] uppercase tracking-wider text-[var(--au-text-muted)]">
              Space
            </span>
            <span className="mt-0.5 font-mono text-xs font-bold text-[var(--au-memory)]">
              {complexity.space}
            </span>
          </div>

          <div className="flex flex-col rounded-lg border border-[var(--au-border)] bg-[var(--au-surface-elevated)] p-2.5 text-center">
            <span className="text-[10px] uppercase tracking-wider text-[var(--au-text-muted)]">
              Step Cost
            </span>
            <span className="mt-0.5 font-mono text-xs font-bold text-[var(--au-success)]">
              {complexity.currentStepCost}
            </span>
          </div>
        </div>

        {/* Edge Cases Guide */}
        <div className="mt-auto rounded-lg border border-[var(--au-border)] bg-[var(--au-surface-elevated)] p-3">
          <div className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--au-warning)]">
            <AlertTriangle size={13} />
            <span>Important Notice & Pitfalls</span>
          </div>
          <ul className="space-y-1 text-xs text-[var(--au-text-secondary)]">
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[var(--au-warning)]" />
              <span><strong>Head Node:</strong> If index is 0, HEAD must be re-assigned.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[var(--au-warning)]" />
              <span><strong>Pointer Order:</strong> Always link newNode before overwriting existing pointers.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
