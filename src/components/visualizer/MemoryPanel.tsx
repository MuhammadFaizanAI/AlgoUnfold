import { useState } from "react"
import {
  Cpu,
  Database,
  Layers,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Zap,
} from "lucide-react"
import type { ExecutionStep } from "../../visualization/steps/Step"

interface MemoryPanelProps {
  step: ExecutionStep
  isMaximized?: boolean
  onToggleMaximize?: () => void
}

export default function MemoryPanel({
  step,
  isMaximized,
  onToggleMaximize,
}: MemoryPanelProps) {
  const [viewTab, setViewTab] = useState<"all" | "heap" | "stack">("all")

  const totalHeapBytes = step.heapBlocks.reduce((acc, b) => acc + b.sizeBytes, 0)

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-[var(--au-border)] bg-[var(--au-surface)]">
      {/* Panel Top Bar */}
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-[var(--au-border-subtle)] bg-[var(--au-surface-elevated)]/80 px-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-[var(--au-memory)]" />
            <span className="text-xs font-semibold tracking-wide text-[var(--au-text)] uppercase">
              Memory & Pointer Inspector
            </span>
          </div>

          <span className="text-[11px] text-[var(--au-border-strong)]">|</span>

          {/* View Filter Pills */}
          <div className="flex items-center gap-1 rounded-lg bg-[var(--au-surface)] p-0.5 border border-[var(--au-border-subtle)]">
            {(["all", "heap", "stack"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setViewTab(tab)}
                className={`rounded-md px-2 py-0.5 text-[11px] font-medium capitalize transition-all ${
                  viewTab === tab
                    ? "bg-[var(--au-memory)] text-[var(--au-text-inverse)] shadow-sm font-semibold"
                    : "text-[var(--au-text-muted)] hover:text-[var(--au-text)]"
                }`}
              >
                {tab === "all" ? "Stack & Heap" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Memory Metrics & Toolbar */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 text-[11px] font-mono text-[var(--au-text-muted)] md:flex">
            <span className="rounded bg-[var(--au-surface-high)] px-1.5 py-0.5">
              Heap: {totalHeapBytes}B
            </span>
            <span className="rounded bg-[var(--au-surface-high)] px-1.5 py-0.5">
              Ptr: 8B (64-bit)
            </span>
          </div>

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

      {/* Memory Content */}
      <div className="flex flex-1 flex-col gap-3.5 overflow-auto p-3.5 bg-[var(--au-background)]">
        {/* =========================================================
            SECTION 1: CALL STACK (STACK FRAME)
            ========================================================= */}
        {(viewTab === "all" || viewTab === "stack") && (
          <div className="flex flex-col rounded-lg border border-[var(--au-border)] bg-[var(--au-surface-elevated)] p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between border-b border-[var(--au-border-subtle)] pb-2">
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-[var(--au-brand)]" />
                <span className="text-xs font-semibold text-[var(--au-text)]">
                  Call Stack (Local Scope)
                </span>
              </div>
              <span className="rounded bg-[var(--au-surface-high)] px-2 py-0.5 font-mono text-[10px] text-[var(--au-brand)]">
                Local Variables
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[var(--au-border-subtle)] text-[10px] uppercase tracking-wider text-[var(--au-text-muted)]">
                    <th className="pb-1.5 font-semibold">Variable</th>
                    <th className="pb-1.5 font-semibold">Type</th>
                    <th className="pb-1.5 font-semibold">Value</th>
                    <th className="pb-1.5 font-semibold">Target Heap Addr</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--au-border-subtle)]/50">
                  {step.stackVariables.map((v) => {
                    const isMutated = v.isChanged

                    return (
                      <tr
                        key={v.name}
                        className={`transition-colors ${
                          isMutated
                            ? "bg-amber-400/10 font-bold"
                            : "hover:bg-[var(--au-surface-high)]/50"
                        }`}
                      >
                        <td className="py-1.5 font-semibold text-[var(--au-text)] flex items-center gap-1.5">
                          {isMutated && (
                            <Zap size={10} className="fill-amber-300 text-amber-300 animate-pulse" />
                          )}
                          <span>{v.name}</span>
                        </td>
                        <td className="py-1.5 text-[var(--au-text-muted)]">
                          {v.type}
                        </td>
                        <td className={`py-1.5 ${isMutated ? "text-amber-200" : "text-[var(--au-brand)]"}`}>
                          {v.value}
                        </td>
                        <td className="py-1.5">
                          {v.value.startsWith("0x") ? (
                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                                isMutated
                                  ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                                  : "bg-[var(--au-memory)]/15 text-[var(--au-memory)]"
                              }`}
                            >
                              → {v.value}
                            </span>
                          ) : (
                            <span className="text-[var(--au-text-disabled)]">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================
            SECTION 2: HEAP MEMORY BLOCKS
            ========================================================= */}
        {(viewTab === "all" || viewTab === "heap") && (
          <div className="flex flex-1 flex-col rounded-lg border border-[var(--au-border)] bg-[var(--au-surface-elevated)] p-3 shadow-sm">
            <div className="mb-2.5 flex items-center justify-between border-b border-[var(--au-border-subtle)] pb-2">
              <div className="flex items-center gap-2">
                <Database size={14} className="text-[var(--au-memory)]" />
                <span className="text-xs font-semibold text-[var(--au-text)]">
                  Heap Memory Blocks ({step.heapBlocks.length} Nodes in RAM)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[var(--au-text-muted)]">
                <ShieldCheck size={12} className="text-[var(--au-success)]" />
                <span>Memory Clean</span>
              </div>
            </div>

            {/* Grid of Allocated Heap Blocks */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
              {step.heapBlocks.map((block) => {
                const isMutated = block.isChanged
                const isNew = block.state === "allocating"
                const isFreeing = block.state === "freeing"

                let cardStyle = "border-[var(--au-border)] bg-[var(--au-surface)]"
                if (isMutated) {
                  cardStyle = "border-amber-400/80 bg-amber-400/10 ring-2 ring-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.15)]"
                } else if (isNew) {
                  cardStyle = "border-[var(--au-success)]/60 bg-[var(--au-success)]/5 ring-1 ring-[var(--au-success)]/30"
                } else if (isFreeing) {
                  cardStyle = "border-[var(--au-error)]/60 bg-[var(--au-error)]/5 ring-1 ring-[var(--au-error)]/30"
                }

                return (
                  <div
                    key={block.address}
                    className={`flex flex-col rounded-lg border p-2.5 transition-all shadow-sm ${cardStyle}`}
                  >
                    {/* Block Header */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-[var(--au-border-subtle)]">
                      <div className="flex items-center gap-1.5 font-mono">
                        {isMutated && (
                          <Zap size={11} className="fill-amber-300 text-amber-300 animate-pulse" />
                        )}
                        <span
                          className={`text-xs font-bold ${
                            isMutated ? "text-amber-300" : "text-[var(--au-memory)]"
                          }`}
                        >
                          {block.address}
                        </span>
                        <span className="text-[10px] text-[var(--au-text-muted)]">
                          ({block.sizeBytes}B)
                        </span>
                      </div>

                      <span
                        className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider ${
                          isMutated
                            ? "bg-amber-400 text-black font-extrabold"
                            : isNew
                            ? "bg-[var(--au-success)]/20 text-[var(--au-success)]"
                            : isFreeing
                            ? "bg-[var(--au-error)]/20 text-[var(--au-error)]"
                            : "bg-[var(--au-surface-high)] text-[var(--au-text-secondary)]"
                        }`}
                      >
                        {isMutated ? "MUTATED" : block.state}
                      </span>
                    </div>

                    {/* Block Internal Struct Layout */}
                    <div className="mt-2 space-y-1 font-mono text-[11px]">
                      {Object.entries(block.fields).map(([fieldName, fieldVal]) => (
                        <div
                          key={fieldName}
                          className="flex items-center justify-between rounded bg-[var(--au-surface-high)]/60 px-2 py-0.5"
                        >
                          <span className="text-[var(--au-text-muted)] uppercase text-[10px]">
                            {fieldName}:
                          </span>
                          <span
                            className={`font-semibold ${
                              fieldVal.startsWith("0x")
                                ? isMutated
                                  ? "text-amber-200 font-bold"
                                  : "text-[var(--au-algorithm)]"
                                : fieldVal === "nullptr" || fieldVal === "NULL"
                                ? "text-[var(--au-text-disabled)]"
                                : "text-[var(--au-text)]"
                            }`}
                          >
                            {fieldVal}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
