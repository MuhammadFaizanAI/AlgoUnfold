import {
  Maximize2,
  Minimize2,
  Variable,
  Zap,
} from "lucide-react"
import type { ExecutionStep } from "../../visualization/steps/Step"

interface SimpleVariablesPanelProps {
  step: ExecutionStep
  isMaximized?: boolean
  onToggleMaximize?: () => void
}

export default function SimpleVariablesPanel({
  step,
  isMaximized,
  onToggleMaximize,
}: SimpleVariablesPanelProps) {
  // Find node value for pointer variables if pointing to an address
  const getNodeValByAddress = (addr: string) => {
    const node = step.nodes.find((n) => n.address === addr)
    return node ? node.val : null
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-[var(--au-border)] bg-[var(--au-surface)]">
      {/* Top Header Bar */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-[var(--au-border-subtle)] bg-[var(--au-surface-elevated)]/80 px-4 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <Variable size={15} className="text-[var(--au-brand)]" />
          <span className="text-xs font-bold tracking-wide text-[var(--au-text)] uppercase">
            Variables Watch
          </span>
          <span className="text-[11px] text-[var(--au-border-strong)]">|</span>
          <span className="text-[11px] text-[var(--au-text-muted)]">
            Live Program State
          </span>
        </div>

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

      {/* Variables List / Grid */}
      <div className="flex-1 overflow-auto p-3 bg-[var(--au-background)]">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-3">
          {step.stackVariables.map((v) => {
            const isMutated = v.isChanged
            const isPointer = v.value.startsWith("0x")
            const pointedVal = isPointer ? getNodeValByAddress(v.value) : null

            return (
              <div
                key={v.name}
                className={`flex flex-col justify-between rounded-lg border p-2.5 transition-all duration-300 ${
                  isMutated
                    ? "border-amber-400 bg-amber-400/10 ring-2 ring-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                    : "border-[var(--au-border)] bg-[var(--au-surface-elevated)] hover:border-[var(--au-border-strong)]"
                }`}
              >
                {/* Variable Name & Mutated Badge */}
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    <span className="font-bold text-[var(--au-text)]">{v.name}</span>
                    <span className="text-[10px] text-[var(--au-text-disabled)]">({v.type})</span>
                  </div>

                  {isMutated && (
                    <span className="flex items-center gap-1 rounded bg-amber-400 px-1.5 py-0.2 text-[9px] font-black uppercase text-black animate-pulse">
                      <Zap size={9} className="fill-black" />
                      UPDATED
                    </span>
                  )}
                </div>

                {/* Variable Value */}
                <div className="mt-2 flex items-baseline justify-between font-mono">
                  <span
                    className={`text-sm font-bold ${
                      isMutated
                        ? "text-amber-200"
                        : isPointer
                        ? "text-[var(--au-brand)]"
                        : "text-[var(--au-algorithm)]"
                    }`}
                  >
                    {v.value}
                  </span>

                  {pointedVal !== null && (
                    <span className="rounded bg-[var(--au-surface-high)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--au-text-secondary)] border border-[var(--au-border-subtle)]">
                      node: <strong className="text-[var(--au-text)]">{pointedVal}</strong>
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
