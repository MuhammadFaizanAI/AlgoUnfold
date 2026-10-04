import { useEffect, useState } from "react"
import { useVisualizer } from "../../hooks/useVisualizer"
import Workspace from "../visualizer/Workspace"
import AppModals from "./AppModals"
import ControlBar from "./ControlBar"
import SidebarOverlay from "./SidebarOverlay"
import TitleBar from "./TitleBar"

const operationTitles: Record<string, string> = {
  "singly-insertAt": "Linked List > Singly > InsertAt",
  "singly-deleteAt": "Linked List > Singly > DeleteAt",
  "doubly-insertAt": "Linked List > Doubly Linked List > InsertAt",
  "circular-insertAt": "Linked List > Circular > InsertAt",
  "array-insert": "Arrays > Dynamic Array > Insert",
  "array-binary-search": "Arrays > Binary Search",
  "stack-push-pop": "Stack & Queue > Stack (Push / Pop)",
  "queue-enqueue": "Stack & Queue > Queue (Enqueue / Dequeue)",
}

export default function AppShell() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDialog, setActiveDialog] = useState<"update" | "account" | "settings" | null>(null)

  const visualizer = useVisualizer("singly-insertAt")

  const currentOpTitle = operationTitles[visualizer.operationId] || "Linked List > Singly > InsertAt"

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input / form
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (e.key === " " || e.code === "Space" || e.key === "ArrowRight") {
        e.preventDefault()
        visualizer.stepForward()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        visualizer.stepBackward()
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "m") {
        e.preventDefault()
        setIsMenuOpen((prev) => !prev)
      } else if (e.key === "Escape") {
        if (isMenuOpen) setIsMenuOpen(false)
        if (activeDialog) setActiveDialog(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [visualizer, isMenuOpen, activeDialog])

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[var(--au-background)] text-[var(--au-text)] select-none">
      {/* 1. TitleBar at top */}
      <TitleBar activeTitle={currentOpTitle} />

      {/* 2. ControlBar directly below TitleBar (Without Play button, focused on Next/Prev) */}
      <ControlBar
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
        isMenuOpen={isMenuOpen}
        operationTitle={currentOpTitle}
        currentStepIndex={visualizer.currentStepIndex}
        totalSteps={visualizer.steps.length}
        onStepForward={visualizer.stepForward}
        onStepBackward={visualizer.stepBackward}
        onReset={visualizer.reset}
        onApplyCustom={visualizer.applyCustomOperation}
        onRandomize={visualizer.randomizeList}
        initialValue={visualizer.inputValue}
        initialIndex={visualizer.inputIndex}
      />

      {/* 3. Main Workspace Screen: Code, Visualization, Memory, and Explanation Panels */}
      <main className="relative min-h-0 flex-1 overflow-hidden bg-[var(--au-background)]">
        <Workspace
          step={visualizer.currentStep}
          operationId={visualizer.operationId}
          language={visualizer.language}
          onLanguageChange={visualizer.setLanguage}
          selectedNodeId={visualizer.selectedNodeId}
          onSelectNode={visualizer.setSelectedNodeId}
        />
      </main>

      {/* 4. Sliding Sidebar Overlay (Opened via Menu Icon on Control Bar) */}
      <SidebarOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeOperationId={visualizer.operationId}
        onSelectOperation={visualizer.switchOperation}
        onOpenDialog={(type) => setActiveDialog(type)}
      />

      {/* 5. Update, Account, and Settings Modals */}
      <AppModals
        dialogType={activeDialog}
        onClose={() => setActiveDialog(null)}
      />
    </div>
  )
}