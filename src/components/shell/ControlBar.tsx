import React, { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Dices,
  Menu,
  RotateCcw,
  Sparkles,
} from "lucide-react"

interface ControlBarProps {
  onToggleMenu: () => void
  operationTitle: string
  currentStepIndex: number
  totalSteps: number
  onStepForward: () => void
  onStepBackward: () => void
  onReset: () => void
  onApplyCustom: (val: number, idx: number) => void
  onRandomize: () => void
  initialValue?: number
  initialIndex?: number
  isMenuOpen: boolean
}

export default function ControlBar({
  onToggleMenu,
  operationTitle,
  currentStepIndex,
  totalSteps,
  onStepForward,
  onStepBackward,
  onReset,
  onApplyCustom,
  onRandomize,
  initialValue = 25,
  initialIndex = 2,
  isMenuOpen,
}: ControlBarProps) {
  const [valInput, setValInput] = useState<string>(String(initialValue))
  const [idxInput, setIdxInput] = useState<string>(String(initialIndex))

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    const val = parseInt(valInput, 10) || 0
    const idx = parseInt(idxInput, 10) || 0
    onApplyCustom(val, idx)
  }

  const progressPercent = totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 100

  return (
    <div className="flex h-12 w-full shrink-0 select-none items-center justify-between border-b border-[var(--au-border)] bg-[var(--au-surface)] px-4">
      {/* =======================================================
          LEFT: MENU ICON + STEPPING CONTROLS (RESET, PREV, NEXT, PROGRESS)
          ======================================================= */}
      <div className="flex items-center gap-2.5">
        {/* Menu Icon (Toggles Sidebar Overlay) */}
        <button
          type="button"
          onClick={onToggleMenu}
          title="Open Lessons Menu (Ctrl+M)"
          className={`flex h-8 items-center gap-2 rounded-lg px-3 text-xs font-semibold transition-all ${
            isMenuOpen
              ? "bg-[var(--au-brand)] text-[var(--au-text-inverse)] shadow-md"
              : "bg-[var(--au-surface-elevated)] text-[var(--au-text)] border border-[var(--au-border)] hover:bg-[var(--au-surface-high)]"
          }`}
        >
          <Menu size={16} strokeWidth={2} />
          <span>Select Topic</span>
        </button>

        <div className="h-5 w-[1px] bg-[var(--au-border-subtle)] mx-1" />

        {/* Reset Button */}
        <button
          type="button"
          onClick={onReset}
          title="Reset to Step 1"
          className="flex h-8 items-center gap-1.5 rounded-lg border border-[var(--au-border)] bg-[var(--au-surface-elevated)] px-2.5 text-xs text-[var(--au-text-secondary)] transition-colors hover:bg-[var(--au-surface-high)] hover:text-[var(--au-text)]"
        >
          <RotateCcw size={13} strokeWidth={2} />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* Previous Step Button */}
        <button
          type="button"
          onClick={onStepBackward}
          disabled={currentStepIndex <= 0}
          title="Previous Step"
          className="flex h-8 items-center gap-1 rounded-lg border border-[var(--au-border)] bg-[var(--au-surface-elevated)] px-3 text-xs font-semibold text-[var(--au-text)] transition-colors hover:bg-[var(--au-surface-high)] disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronLeft size={16} strokeWidth={2} />
          <span>Previous</span>
        </button>

        {/* Next Step Button (Prominent & Clear) */}
        <button
          type="button"
          onClick={onStepForward}
          disabled={currentStepIndex >= totalSteps - 1}
          title="Next Step"
          className="flex h-8 items-center gap-1.5 rounded-lg bg-[var(--au-brand)] px-3.5 text-xs font-bold text-[var(--au-text-inverse)] shadow-md transition-all hover:bg-[var(--au-brand-hover)] active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
        >
          <span>Next</span>
          <ChevronRight size={16} strokeWidth={2.2} />
        </button>

        {/* Step Badge & Mini Progress Bar */}
        <div className="flex items-center gap-2 rounded-lg bg-[var(--au-surface-elevated)] px-3 py-1 border border-[var(--au-border-subtle)]">
          <span className="font-mono text-xs font-semibold text-[var(--au-brand)]">
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
          <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-[var(--au-surface-high)] sm:block">
            <div
              className="h-full bg-[var(--au-brand)] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* =======================================================
          CENTER & RIGHT: OPERATION BADGE & CUSTOM INPUTS
          ======================================================= */}
      <div className="flex items-center gap-3">
        {/* Active Operation Breadcrumb */}
        <div className="hidden items-center gap-2 rounded-lg bg-[var(--au-surface-elevated)] px-3 py-1 border border-[var(--au-border-subtle)] md:flex">
          <span className="h-2 w-2 rounded-full bg-[var(--au-brand)] animate-pulse" />
          <span className="text-xs font-semibold text-[var(--au-text)]">
            {operationTitle}
          </span>
        </div>

        {/* Custom Input Form (Val & Idx) */}
        <form onSubmit={handleApply} className="flex items-center gap-1.5">
          <div className="flex items-center rounded-lg border border-[var(--au-border)] bg-[var(--au-surface-elevated)] px-2.5 py-1">
            <span className="text-[11px] font-mono text-[var(--au-text-muted)] mr-1">
              Val:
            </span>
            <input
              type="number"
              value={valInput}
              onChange={(e) => setValInput(e.target.value)}
              className="w-9 bg-transparent font-mono text-xs font-bold text-[var(--au-brand)] outline-none text-center"
              placeholder="val"
            />
          </div>

          <div className="flex items-center rounded-lg border border-[var(--au-border)] bg-[var(--au-surface-elevated)] px-2.5 py-1">
            <span className="text-[11px] font-mono text-[var(--au-text-muted)] mr-1">
              Idx:
            </span>
            <input
              type="number"
              value={idxInput}
              onChange={(e) => setIdxInput(e.target.value)}
              className="w-8 bg-transparent font-mono text-xs font-bold text-[var(--au-algorithm)] outline-none text-center"
              placeholder="idx"
            />
          </div>

          <button
            type="submit"
            title="Run with custom value and index"
            className="flex h-8 items-center gap-1 rounded-lg bg-[var(--au-surface-high)] px-2.5 text-xs font-semibold text-[var(--au-text)] border border-[var(--au-border)] transition-colors hover:bg-[var(--au-brand)] hover:text-[var(--au-text-inverse)] hover:border-[var(--au-brand)]"
          >
            <Sparkles size={12} />
            <span>Run</span>
          </button>
        </form>

        {/* Randomize Initial List */}
        <button
          type="button"
          onClick={onRandomize}
          title="Randomize List Data"
          className="flex h-8 items-center gap-1 rounded-lg border border-[var(--au-border)] bg-[var(--au-surface-elevated)] px-2.5 text-xs text-[var(--au-text-secondary)] transition-colors hover:bg-[var(--au-surface-high)] hover:text-[var(--au-text)]"
        >
          <Dices size={14} />
          <span className="hidden lg:inline">Randomize</span>
        </button>
      </div>
    </div>
  )
}
