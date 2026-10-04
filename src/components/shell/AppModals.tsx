import { useState } from "react"
import {
  Check,
  CircleUserRound,
  RefreshCw,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react"

interface AppModalsProps {
  dialogType: "update" | "account" | "settings" | null
  onClose: () => void
}

export default function AppModals({ dialogType, onClose }: AppModalsProps) {
  const [checkingUpdate, setCheckingUpdate] = useState(false)
  const [updateMessage, setUpdateMessage] = useState<string | null>(null)

  if (!dialogType) return null

  const handleCheckUpdate = () => {
    setCheckingUpdate(true)
    setUpdateMessage(null)
    setTimeout(() => {
      setCheckingUpdate(false)
      setUpdateMessage("AlgoUnfold v1.0.0 is currently the latest version. You're up to date!")
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed Backdrop */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Close dialog"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        className="fixed inset-0 bg-black/65 backdrop-blur-sm animate-fade-in"
      />

      {/* Dialog Modal Container */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--au-border)] bg-[var(--au-surface)] p-6 shadow-2xl animate-scale-up">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-[var(--au-text-muted)] hover:bg-[var(--au-surface-high)] hover:text-[var(--au-text)] transition-colors"
        >
          <X size={16} />
        </button>

        {/* =======================================================
            UPDATE DIALOG
            ======================================================= */}
        {dialogType === "update" && (
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--au-info-soft)] text-[var(--au-info)] border border-[var(--au-info)]/20">
                <RefreshCw size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--au-text)]">
                  Software Updates
                </h3>
                <p className="text-xs text-[var(--au-text-muted)]">
                  AlgoUnfold Native Desktop App
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-[var(--au-border)] bg-[var(--au-surface-elevated)] p-3.5">
                <div>
                  <span className="text-xs font-semibold text-[var(--au-text)]">
                    Current Version
                  </span>
                  <p className="text-[11px] text-[var(--au-text-muted)]">
                    Channel: Stable Production
                  </p>
                </div>
                <span className="rounded-lg bg-[var(--au-brand)]/15 px-2.5 py-1 font-mono text-xs font-bold text-[var(--au-brand)]">
                  v1.0.0
                </span>
              </div>

              {updateMessage && (
                <div className="flex items-center gap-2 rounded-xl bg-[var(--au-success)]/10 border border-[var(--au-success)]/30 p-3 text-xs text-[var(--au-success)]">
                  <Check size={16} className="shrink-0" />
                  <span>{updateMessage}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleCheckUpdate}
                disabled={checkingUpdate}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--au-brand)] py-2.5 text-xs font-bold text-[var(--au-text-inverse)] hover:bg-[var(--au-brand-hover)] transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={checkingUpdate ? "animate-spin" : ""}
                />
                <span>{checkingUpdate ? "Checking Servers..." : "Check for Updates"}</span>
              </button>
            </div>
          </div>
        )}

        {/* =======================================================
            ACCOUNT DIALOG
            ======================================================= */}
        {dialogType === "account" && (
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--au-brand-soft)] text-[var(--au-brand)] border border-[var(--au-brand)]/30">
                <CircleUserRound size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--au-text)]">
                  User Account
                </h3>
                <p className="text-xs text-[var(--au-text-muted)]">
                  DSA Visualizer Profile
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-[var(--au-border)] bg-[var(--au-surface-elevated)] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[var(--au-text)]">
                    Raif
                  </span>
                  <span className="rounded-full bg-[var(--au-brand)]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--au-brand)]">
                    Pro Scholar
                  </span>
                </div>
                <p className="mt-1 text-xs text-[var(--au-text-secondary)]">
                  raif@algounfold.local
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[var(--au-border-subtle)] pt-3 text-center">
                  <div>
                    <span className="font-mono text-base font-bold text-[var(--au-brand)]">
                      14
                    </span>
                    <p className="text-[10px] text-[var(--au-text-muted)]">
                      Lessons Done
                    </p>
                  </div>
                  <div>
                    <span className="font-mono text-base font-bold text-[var(--au-success)]">
                      7 Days
                    </span>
                    <p className="text-[10px] text-[var(--au-text-muted)]">
                      Streak
                    </p>
                  </div>
                  <div>
                    <span className="font-mono text-base font-bold text-[var(--au-warning)]">
                      980
                    </span>
                    <p className="text-[10px] text-[var(--au-text-muted)]">
                      XP Points
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-[var(--au-border)] bg-[var(--au-surface-elevated)] p-3 text-xs">
                <div className="flex items-center gap-2 text-[var(--au-text-secondary)]">
                  <ShieldCheck size={16} className="text-[var(--au-success)]" />
                  <span>Cloud Progress Sync</span>
                </div>
                <span className="font-mono text-[11px] text-[var(--au-success)]">
                  Active
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================
            SETTINGS DIALOG
            ======================================================= */}
        {dialogType === "settings" && (
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--au-warning)]/15 text-[var(--au-warning)] border border-[var(--au-warning)]/30">
                <Settings size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--au-text)]">
                  Visualizer Settings
                </h3>
                <p className="text-xs text-[var(--au-text-muted)]">
                  Configure visual engine and code options
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-[var(--au-border)] bg-[var(--au-surface-elevated)] p-3">
                <div>
                  <span className="text-xs font-semibold text-[var(--au-text)]">
                    Memory Address Format
                  </span>
                  <p className="text-[11px] text-[var(--au-text-muted)]">
                    Hexadecimal (0x1040) or Decimal
                  </p>
                </div>
                <span className="rounded bg-[var(--au-surface-high)] px-2 py-1 font-mono text-xs font-bold text-[var(--au-brand)]">
                  HEX
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-[var(--au-border)] bg-[var(--au-surface-elevated)] p-3">
                <div>
                  <span className="text-xs font-semibold text-[var(--au-text)]">
                    Pointer Animations
                  </span>
                  <p className="text-[11px] text-[var(--au-text-muted)]">
                    Smooth pointer transitions and glowing pulses
                  </p>
                </div>
                <span className="rounded bg-[var(--au-success)]/15 px-2 py-0.5 text-[11px] font-bold text-[var(--au-success)]">
                  Enabled
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-[var(--au-border)] bg-[var(--au-surface-elevated)] p-3">
                <div>
                  <span className="text-xs font-semibold text-[var(--au-text)]">
                    Visual Blueprint Grid
                  </span>
                  <p className="text-[11px] text-[var(--au-text-muted)]">
                    Canvas grid texture for spatial clarity
                  </p>
                </div>
                <span className="rounded bg-[var(--au-success)]/15 px-2 py-0.5 text-[11px] font-bold text-[var(--au-success)]">
                  Enabled
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
