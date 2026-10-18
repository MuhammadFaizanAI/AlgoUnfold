import type { ComponentType } from "react"

/** One teachable moment in a visualization. Keep this small and easy to read. */
export interface TopicStep {
  /** 1-based line number in the C++ source; null means no line is active. */
  codeLine: number | null
  /** Short status shown above the detailed explanation. */
  message: string
  /** Detailed explanation shown at the bottom of the visualization panel. */
  explanation: string
  /** Topic-specific snapshot. The topic file owns this shape. */
  state: Record<string, unknown>
}

export interface TopicVisualizationProps {
  step: TopicStep
  stepIndex: number
}

/** Every topic file exports one definition; no manual registry entry is needed. */
export interface TopicDefinition {
  id: string
  title: string
  category: string
  description: string
  code: string
  steps: TopicStep[]
  Component: ComponentType<TopicVisualizationProps>
}
