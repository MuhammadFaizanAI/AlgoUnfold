import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import CodeEditor from "./CodeEditor"
import Icon from "./Icon"
import { getTopicDefinition } from "../visualizations/topicRegistry"

const MIN_PANEL = 190

/** Shared shell only: topic-specific logic stays inside each visualization file. */
export default function Workspace({ topic }: { topic: string }) {
  const [mode, setMode] = useState<"both" | "code" | "visual">("both")
  const [split, setSplit] = useState(40)
  const [vertical, setVertical] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const workspaceRef = useRef<HTMLElement>(null)
  const dragRef = useRef<{ start: number; split: number; dimension: number } | null>(null)

  const definition = useMemo(() => getTopicDefinition(topic), [topic])
  const steps = definition?.steps ?? []
  const safeIndex = Math.min(stepIndex, Math.max(0, steps.length - 1))
  const step = steps[safeIndex]
  const Visualizer = definition?.Component

  // Every new topic begins at its first teaching step.
  useEffect(() => setStepIndex(0), [topic])

  useEffect(() => {
    const element = workspaceRef.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setVertical(width < 760 || (width < 1050 && height > width * 1.15))
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const move = useCallback((event: PointerEvent) => {
    const drag = dragRef.current
    if (!drag) return
    const delta = (vertical ? event.clientY : event.clientX) - drag.start
    const next = drag.split + (delta / drag.dimension) * 100
    const minimum = (MIN_PANEL / drag.dimension) * 100
    if (next < minimum * 0.65) { setMode("visual"); return }
    if (next > 100 - minimum * 0.65) { setMode("code"); return }
    setMode("both")
    setSplit(Math.max(minimum, Math.min(100 - minimum, next)))
  }, [vertical])

  const stopDrag = useCallback(() => {
    dragRef.current = null
    document.body.classList.remove("is-resizing")
  }, [])

  useEffect(() => {
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", stopDrag)
    window.addEventListener("pointercancel", stopDrag)
    return () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", stopDrag)
      window.removeEventListener("pointercancel", stopDrag)
    }
  }, [move, stopDrag])

  function beginDrag(event: React.PointerEvent<HTMLDivElement>) {
    const rect = workspaceRef.current?.getBoundingClientRect()
    if (!rect) return
    dragRef.current = {
      start: vertical ? event.clientY : event.clientX,
      split,
      dimension: vertical ? rect.height : rect.width,
    }
    document.body.classList.add("is-resizing")
  }

  function toggle(panel: "code" | "visual") {
    setMode((current) => current === panel ? "both" : panel)
  }

  function restore() { setMode("both"); setSplit(40) }
  function reset() { setStepIndex(0) }
  function previous() { setStepIndex((current) => Math.max(0, current - 1)) }
  function next() { setStepIndex((current) => Math.min(steps.length - 1, current + 1)) }
  const effectiveSplit = Math.max(25, Math.min(70, split))

  return (
    <main ref={workspaceRef} className={`workspace ${vertical ? "stacked" : ""} mode-${mode}`} style={{ "--split": `${effectiveSplit}%` } as React.CSSProperties}>
      <section className="panel code-panel">
        <div className="panel-header">
          <div className="panel-heading">
            <span className="panel-icon code-icon"><Icon name="code" /></span>
            <strong>C++ Code</strong>
          </div>
          <button className="panel-max icon-btn" onClick={() => toggle("code")} title={mode === "code" ? "Restore panels" : "Focus code"}>
            <Icon name={mode === "code" ? "restore" : "maximize"} />
          </button>
        </div>
        <CodeEditor key={topic} code={definition?.code ?? `// ${topic}\n// Create a topic file in src/visualizations/topics/ to implement this visualization.`} activeLine={step?.codeLine ?? null} />
      </section>

      {mode === "both" && (
        <div className="splitter" role="separator" tabIndex={0} aria-label="Resize code and visualization panels" onPointerDown={beginDrag} onDoubleClick={restore}>
          <span className="splitter-grip"><Icon name="grip" /></span>
        </div>
      )}

      <section className="panel visual-panel">
        <div className="panel-header">
          <div className="panel-heading">
            <span className="panel-icon visual-icon"><Icon name="layers" /></span>
            <strong>Visualization</strong>
            <span className="active-topic">{definition?.title ?? topic}</span>
          </div>
          <div className="panel-buttons">
            {mode !== "both" && <button className="icon-btn" onClick={restore} title="Show both panels"><Icon name="columns" /></button>}
            <button className="icon-btn" onClick={() => toggle("visual")} title={mode === "visual" ? "Restore panels" : "Focus visualization"}>
              <Icon name={mode === "visual" ? "restore" : "maximize"} />
            </button>
          </div>
        </div>

        <div className="visual-content">
          <div className="visual-stage">
            {Visualizer && step ? (
              <Visualizer step={step} stepIndex={safeIndex} />
            ) : (
              <div className="topic-not-implemented">
                <span className="topic-not-implemented__icon"><Icon name="layers" size={22} /></span>
                <strong>{topic}</strong>
                <p>This topic is not implemented yet. Add a self-contained file under <code>src/visualizations/topics/</code> and export its <code>topicDefinition</code>.</p>
              </div>
            )}
          </div>
          <aside className="visual-info-card" aria-live="polite">
            <span className="visual-info-icon"><Icon name="info" size={16} /></span>
            <div className="visual-info-body">
              <div className="visual-info-heading">
                {step?.message ?? "Step explanation"}
                {steps.length > 0 && <span className="explanation-step-count">Step {safeIndex + 1} of {steps.length}</span>}
              </div>
              <p>{step?.explanation ?? "The explanation for this topic will appear here once its topic file is registered."}</p>
              {step?.codeLine && <span className="explanation-code-line"><Icon name="code" size={12} /> C++ line {step.codeLine}</span>}
            </div>
          </aside>
        </div>

        <div className="playback">
          <div className="step-count">Step <b>{steps.length ? safeIndex + 1 : 0}</b><span>/</span>{steps.length}</div>
          <div className="playback-actions">
            <button onClick={reset} className="reset-btn" title="Reset" disabled={!steps.length}><Icon name="reset" /><span>Reset</span></button>
            <button onClick={previous} disabled={!steps.length || safeIndex === 0} title="Previous step"><Icon name="previous" /><span>Previous</span></button>
            <button onClick={next} disabled={!steps.length || safeIndex >= steps.length - 1} className="next-btn" title="Next step"><span>Next</span><Icon name="next" /></button>
          </div>
        </div>
      </section>

      {mode !== "both" && <button className="floating-restore" onClick={restore} title="Restore both panels"><Icon name="columns" /><span>Split view</span></button>}
    </main>
  )
}
