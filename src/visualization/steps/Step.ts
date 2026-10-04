export type NodeHighlightStatus =
  | "normal"
  | "active"
  | "traversed"
  | "new"
  | "deleting"
  | "relinking"
  | "target"

export interface ListNodeData {
  id: string
  val: number | string
  address: string
  nextAddress: string | null
  prevAddress?: string | null
  status?: NodeHighlightStatus
  isHead?: boolean
  isTail?: boolean
}

export interface PointerMarker {
  name: string
  targetNodeId: string | null // null if pointing to nullptr
  color: string
  position?: "top" | "bottom"
  label?: string
}

export interface StackVariable {
  name: string
  type: string
  value: string
  addressRef?: string
  isChanged?: boolean
}

export interface HeapBlock {
  address: string
  label: string
  sizeBytes: number
  fields: Record<string, string>
  state: "allocated" | "allocating" | "freeing" | "freed" | "relinking"
  isChanged?: boolean
}

export interface StepExplanation {
  summary: string
  action: string
  why: string
  invariant?: string
  edgeCaseNote?: string
}

export interface ComplexityInfo {
  time: string
  space: string
  currentStepCost: string
}

export interface StepChangeHighlight {
  type: "node_allocated" | "pointer_moved" | "pointer_linked" | "node_deleted" | "head_updated" | "initial_state"
  title: string
  description: string
  targetNodeId?: string
  targetPointer?: string
  targetAddress?: string
  field?: string
}

export interface ExecutionStep {
  stepIndex: number
  totalSteps: number
  title: string
  description: string
  explanationDetail: StepExplanation
  complexity: ComplexityInfo
  activeCodeLines: {
    cpp: number
    python: number
    typescript: number
    java: number
  }
  nodes: ListNodeData[]
  pointers: PointerMarker[]
  stackVariables: StackVariable[]
  heapBlocks: HeapBlock[]
  structureType: "singly" | "doubly" | "circular"
  isCompleted?: boolean
  changedHighlight?: StepChangeHighlight
}
