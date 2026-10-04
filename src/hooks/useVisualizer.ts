import { useCallback, useMemo, useState } from "react"
import {
  generateStepsForOperation,
} from "../visualization/engine/ExecutionEngine"
import type { ExecutionStep } from "../visualization/steps/Step"

export type SupportedLanguage = "cpp" | "python" | "typescript" | "java"

export interface VisualizerState {
  operationId: string
  steps: ExecutionStep[]
  currentStepIndex: number
  language: SupportedLanguage
  inputValue: number
  inputIndex: number
  listValues: number[]
  selectedNodeId: string | null
}

export function useVisualizer(defaultOperationId: string = "singly-insertAt") {
  const [operationId, setOperationId] = useState<string>(defaultOperationId)
  const [listValues, setListValues] = useState<number[]>([10, 20, 30, 40])
  const [inputValue, setInputValue] = useState<number>(25)
  const [inputIndex, setInputIndex] = useState<number>(2)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)
  const [language, setLanguage] = useState<SupportedLanguage>("cpp")
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  // Generate steps whenever operation or list/inputs change
  const steps = useMemo(() => {
    return generateStepsForOperation(operationId, listValues, inputIndex, inputValue)
  }, [operationId, listValues, inputIndex, inputValue])

  // Current active step
  const currentStep = useMemo(() => {
    return steps[currentStepIndex] || steps[0]
  }, [steps, currentStepIndex])

  // Next Step
  const stepForward = useCallback(() => {
    setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1))
  }, [steps.length])

  // Previous Step
  const stepBackward = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1))
  }, [])

  // Jump to Step
  const goToStep = useCallback((index: number) => {
    setCurrentStepIndex(Math.max(0, Math.min(index, steps.length - 1)))
  }, [steps.length])

  // Reset
  const reset = useCallback(() => {
    setCurrentStepIndex(0)
  }, [])

  // Change operation
  const switchOperation = useCallback((newOpId: string) => {
    setOperationId(newOpId)
    setCurrentStepIndex(0)
    setSelectedNodeId(null)
  }, [])

  // Apply custom values
  const applyCustomOperation = useCallback((val: number, idx: number) => {
    setInputValue(val)
    setInputIndex(idx)
    setCurrentStepIndex(0)
  }, [])

  // Randomize list
  const randomizeList = useCallback(() => {
    const count = Math.floor(Math.random() * 3) + 3 // 3 to 5 nodes
    const newVals: number[] = []
    for (let i = 0; i < count; i++) {
      newVals.push((i + 1) * 10 + Math.floor(Math.random() * 9))
    }
    setListValues(newVals)
    setCurrentStepIndex(0)
  }, [])

  return {
    operationId,
    steps,
    currentStep,
    currentStepIndex,
    language,
    inputValue,
    inputIndex,
    listValues,
    selectedNodeId,
    setLanguage,
    setSelectedNodeId,
    setInputValue,
    setInputIndex,
    stepForward,
    stepBackward,
    goToStep,
    reset,
    switchOperation,
    applyCustomOperation,
    randomizeList,
  }
}
