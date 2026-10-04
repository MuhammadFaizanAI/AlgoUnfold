import { Minus, Square, X } from "lucide-react"
import { getCurrentWindow } from "@tauri-apps/api/window"

interface TitleBarProps {
  activeTitle?: string
}

function TitleBar({ activeTitle = "DSA Laboratory" }: TitleBarProps) {
  const appWindow = getCurrentWindow()

  const minimizeWindow = async () => {
    try {
      await appWindow.minimize()
    } catch (error) {
      console.error("Failed to minimize window:", error)
    }
  }

  const maximizeWindow = async () => {
    try {
      const maximized = await appWindow.isMaximized()

      if (maximized) {
        await appWindow.unmaximize()
      } else {
        await appWindow.maximize()
      }
    } catch (error) {
      console.error("Failed to maximize window:", error)
    }
  }

  const closeWindow = async () => {
    try {
      await appWindow.close()
    } catch (error) {
      console.error("Failed to close window:", error)
    }
  }

  return (
    <header className="flex h-11 w-full shrink-0 select-none border-b border-[var(--au-border-subtle)] bg-[var(--au-surface)]">
      {/* Drag region */}
      <div
        data-tauri-drag-region
        className="flex min-w-0 flex-1 items-center"
      >
        {/* Logo + application name */}
        <div className="flex items-center gap-2.5 px-4">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-[var(--au-surface-high)] text-[11px] font-bold text-[var(--au-brand)] ring-1 ring-[var(--au-border)]">
            AU
          </div>

          <span className="text-[13px] font-semibold tracking-wide text-[var(--au-text)]">
            AlgoUnfold
          </span>
        </div>

        {/* Current Topic / Screen Breadcrumb */}
        <div className="ml-3 flex h-6 items-center border-l border-[var(--au-border-subtle)] pl-4">
          <span className="text-[12px] font-medium text-[var(--au-text-secondary)]">
            {activeTitle}
          </span>
        </div>
      </div>

      {/* Window controls */}
      <div className="flex h-full shrink-0 items-center">
        {/* Minimize */}
        <button
          type="button"
          onClick={minimizeWindow}
          aria-label="Minimize"
          title="Minimize"
          className="flex h-full w-11 items-center justify-center text-[var(--au-text-secondary)] transition-colors hover:bg-[var(--au-surface-high)] hover:text-[var(--au-text)]"
        >
          <Minus size={15} strokeWidth={1.8} />
        </button>

        {/* Maximize / Restore */}
        <button
          type="button"
          onClick={maximizeWindow}
          aria-label="Maximize"
          title="Maximize"
          className="flex h-full w-11 items-center justify-center text-[var(--au-text-secondary)] transition-colors hover:bg-[var(--au-surface-high)] hover:text-[var(--au-text)]"
        >
          <Square size={13} strokeWidth={1.8} />
        </button>

        {/* Close */}
        <button
          type="button"
          onClick={closeWindow}
          aria-label="Close"
          title="Close"
          className="flex h-full w-11 items-center justify-center text-[var(--au-text-secondary)] transition-colors hover:bg-[#d83b3b] hover:text-white"
        >
          <X size={16} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  )
}

export default TitleBar