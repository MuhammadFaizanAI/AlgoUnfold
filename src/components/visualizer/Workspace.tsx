import { useState } from "react"
import type { SupportedLanguage } from "../../hooks/useVisualizer"
import type { ExecutionStep } from "../../visualization/steps/Step"
import CodePanel from "./CodePanel"
import SimpleVariablesPanel from "./SimpleVariablesPanel"
import VisualizationCanvas from "./VisualizationCanvas"

interface WorkspaceProps {
  step: ExecutionStep
  operationId: string
  language: SupportedLanguage
  onLanguageChange: (lang: SupportedLanguage) => void
  selectedNodeId: string | null
  onSelectNode: (nodeId: string | null) => void
}

type MaximizedPanel = "none" | "canvas" | "code" | "variables"

export default function Workspace({
  step,
  operationId,
  language,
  onLanguageChange,
  selectedNodeId,
  onSelectNode,
}: WorkspaceProps) {
  const [maximizedPanel, setMaximizedPanel] = useState<MaximizedPanel>("none")

  const toggleMaximize = (panel: MaximizedPanel) => {
    setMaximizedPanel((curr) => (curr === panel ? "none" : panel))
  }

  // Fullscreen single panel views
  if (maximizedPanel === "canvas") {
    return (
      <div className="h-full w-full p-2">
        <VisualizationCanvas
          step={step}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
          isMaximized={true}
          onToggleMaximize={() => toggleMaximize("canvas")}
        />
      </div>
    )
  }

  if (maximizedPanel === "code") {
    return (
      <div className="h-full w-full p-2">
        <CodePanel
          step={step}
          operationId={operationId}
          language={language}
          onLanguageChange={onLanguageChange}
          isMaximized={true}
          onToggleMaximize={() => toggleMaximize("code")}
        />
      </div>
    )
  }

  if (maximizedPanel === "variables") {
    return (
      <div className="h-full w-full p-2">
        <SimpleVariablesPanel
          step={step}
          isMaximized={true}
          onToggleMaximize={() => toggleMaximize("variables")}
        />
      </div>
    )
  }

  // Main Streamlined Layout: Big Visualization Area on Top + Code and Variables on Bottom
  return (
    <div className="flex h-full w-full flex-col gap-2 p-2 overflow-hidden">
      {/* 1. TOP HERO SECTION: Big Visualization Canvas (65% screen height) */}
      <div className="h-[65%] min-h-[360px] w-full min-w-0 overflow-hidden">
        <VisualizationCanvas
          step={step}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
          isMaximized={false}
          onToggleMaximize={() => toggleMaximize("canvas")}
        />
      </div>

      {/* 2. BOTTOM SECTION: Code Panel + Simple Variables Watch (35% screen height) */}
      <div className="flex h-[35%] min-h-[190px] w-full gap-2 min-w-0 overflow-hidden">
        {/* Left: Code Implementation Panel */}
        <div className="h-full w-[60%] min-w-0 overflow-hidden">
          <CodePanel
            step={step}
            operationId={operationId}
            language={language}
            onLanguageChange={onLanguageChange}
            isMaximized={false}
            onToggleMaximize={() => toggleMaximize("code")}
          />
        </div>

        {/* Right: Simple Variables Watch Panel */}
        <div className="h-full w-[40%] min-w-0 overflow-hidden">
          <SimpleVariablesPanel
            step={step}
            isMaximized={false}
            onToggleMaximize={() => toggleMaximize("variables")}
          />
        </div>
      </div>
    </div>
  )
}
