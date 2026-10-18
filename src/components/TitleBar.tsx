import { useState } from "react"
import Icon from "./Icon"
export default function TitleBar({ onMenu }: { onMenu: () => void }) {
  const [maximized, setMaximized] = useState(false)
  async function windowAction(action: "minimize" | "maximize" | "close") {
    try {
      const { isTauri } = await import("@tauri-apps/api/core")
      if (!isTauri()) return
      const { getCurrentWindow } = await import("@tauri-apps/api/window")
      const win = getCurrentWindow()
      if (action === "minimize") await win.minimize()
      if (action === "close") await win.close()
      if (action === "maximize") {
        await win.toggleMaximize()
        setMaximized(await win.isMaximized())
      }
    } catch (error) {
      console.warn("Native window controls unavailable:", error)
    }
  }
  return (
    <header className="titlebar">
      <button
        className="mobile-menu icon-btn"
        onClick={onMenu}
        aria-label="Open topics"
      >
        <Icon name="menu" />
      </button>
      <div className="drag-region" data-tauri-drag-region>
        <div className="app-mark" data-tauri-drag-region>
          AU
        </div>
        <strong data-tauri-drag-region>AlgoUnfold</strong>
        <span className="title-divider" />
        <span className="title-caption" data-tauri-drag-region>
          DSA Visualizer
        </span>
      </div>
      <div className="window-actions">
        <button
          aria-label="Minimize window"
          onClick={() => windowAction("minimize")}
        >
          <Icon name="minimize" />
        </button>
        <button
          aria-label={maximized ? "Restore window" : "Maximize window"}
          onClick={() => windowAction("maximize")}
        >
          <Icon name={maximized ? "restore" : "window-maximize"} />
        </button>
        <button
          className="close-window"
          aria-label="Close window"
          onClick={() => windowAction("close")}
        >
          <Icon name="close" />
        </button>
      </div>
    </header>
  )
}
