import { useLayoutEffect, useRef } from "react"
import { gsap } from "gsap"
import type {
  TopicDefinition,
  TopicStep,
  TopicVisualizationProps,
} from "../topicTypes"

const values = [10, 20, 30, 40, 50]

// Keep the C++ source here beside its visualization so this topic is self-contained.
const cppCode = `#include <iostream>
using namespace std;

int main() {

    int values[5] = {10, 20, 30, 40, 50};

    return 0;
}`

// These are the teaching frames for this topic. The shared Workspace only moves
// through this list; all array-specific state and explanation stays in this file.
const steps: TopicStep[] = [
  {
    codeLine: 6,
    message: "Reserve space for five integers",
    explanation:
      "The declaration creates an array named values with five integer slots. Each slot has an index from 0 to 4. The slots are shown as empty until their initial values are assigned in this teaching sequence.",
    state: { initializedCount: 0, currentIndex: null, values },
  },
  ...values.map((value, index): TopicStep => ({
    codeLine: 6,
    message: `Initialize index ${index} with ${value}`,
    explanation: `The initializer places ${value} in values[${index}]. Array indexing starts at zero, so this is slot ${index + 1} in memory. The earlier slots remain initialized.`,
    state: { initializedCount: index + 1, currentIndex: index, values },
  })),
  {
    codeLine: 9,
    message: "Array creation is complete",
    explanation:
      "All five slots have values. The array is ready to be read by later operations such as traversal, searching, updating, or sorting.",
    state: { initializedCount: values.length, currentIndex: null, values },
  },
]

function CreatingArrayVisualization({
  step,
  stepIndex,
}: TopicVisualizationProps) {
  const stageRef = useRef<SVGSVGElement>(null)
  const state = step.state as {
    initializedCount: number
    currentIndex: number | null
    values: number[]
  }

  // Animate only the slot that changed. The data for the frame still comes from `step`.
  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const activeIndex = state.currentIndex
    const activeSlot =
      activeIndex === null
        ? null
        : stage.querySelector<SVGGElement>(`[data-array-slot="${activeIndex}"]`)

    const slots = stage.querySelectorAll<SVGGElement>("[data-array-slot]")
    gsap.killTweensOf(slots)
    if (activeSlot) {
      gsap.fromTo(
        activeSlot,
        { y: 10, opacity: 0.55, scale: 0.97, transformOrigin: "50% 50%" },
        { y: 0, opacity: 1, scale: 1, duration: 0.38, ease: "power2.out" }
      )
    }
    return () => gsap.killTweensOf(slots)
  }, [stepIndex, state.currentIndex])

  return (
    <div className="topic-visualization topic-visualization--array">
      <div className="topic-visualization__canvas">
        <div className="array-canvas-heading">
          <div>
            <span className="array-eyebrow">MEMORY VIEW</span>
            <h2>Creating an array</h2>
            <p>Five contiguous integer slots · zero-based indexing</p>
          </div>
          <span className="array-status">
            {state.initializedCount}/5 initialized
          </span>
        </div>
        <svg
          ref={stageRef}
          className="array-memory-svg"
          viewBox="0 0 760 250"
          role="img"
          aria-label="Array memory slots with index and value labels"
          preserveAspectRatio="xMidYMid meet"
        >
          <text x="28" y="38" className="array-svg-caption">
            INDEX
          </text>
          <text x="28" y="118" className="array-svg-caption">
            VALUE
          </text>
          <path d="M125 52 H722" className="array-memory-bracket" />
          {values.map((value, index) => {
            const x = 130 + index * 118
            const initialized = index < state.initializedCount
            const active = state.currentIndex === index
            return (
              <g
                key={index}
                data-array-slot={index}
                className={[
                  "array-slot",
                  initialized ? "is-initialized" : "is-empty",
                  active ? "is-active" : "",
                ].join(" ")}
              >
                <text
                  x={x + 42}
                  y="39"
                  textAnchor="middle"
                  className="array-index-text"
                >
                  {index}
                </text>
                <rect
                  x={x}
                  y="66"
                  width="84"
                  height="76"
                  rx="12"
                  className="array-slot-rect"
                />
                <text
                  x={x + 42}
                  y="111"
                  textAnchor="middle"
                  className="array-value-text"
                >
                  {initialized ? value : "—"}
                </text>
                <text
                  x={x + 42}
                  y="166"
                  textAnchor="middle"
                  className="array-address-text"
                >
                  values[{index}]
                </text>
                {active && (
                  <path
                    d={`M${x + 42} 184 l-7 9 h14 z`}
                    className="array-current-marker"
                  />
                )}
              </g>
            )
          })}
          <text x="130" y="226" className="array-svg-footnote">
            One array · adjacent memory slots · fixed size: 5
          </text>
        </svg>
        <div className="array-memory-legend">
          <span>
            <i className="legend-dot legend-dot--filled" /> Initialized
          </span>
          <span>
            <i className="legend-dot legend-dot--active" /> Current assignment
          </span>
          <span>
            <i className="legend-dot legend-dot--empty" /> Not initialized yet
          </span>
        </div>
      </div>
    </div>
  )
}

export const topicDefinition: TopicDefinition = {
  id: "creating-array",
  title: "Create Array",
  category: "Arrays",
  description:
    "See how a fixed-size array is declared and initialized, one slot at a time.",
  code: cppCode,
  steps,
  Component: CreatingArrayVisualization,
}

export default CreatingArrayVisualization
