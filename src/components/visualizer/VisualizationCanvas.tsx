import { Fragment, useState } from "react"
import {
  ArrowDown,
  ArrowRight,
  Maximize2,
  Minimize2,
  MoveRight,
  RotateCcw,
  Sparkles,
  Zap,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import type { ExecutionStep, ListNodeData } from "../../visualization/steps/Step"

interface VisualizationCanvasProps {
  step: ExecutionStep
  onSelectNode?: (nodeId: string | null) => void
  selectedNodeId?: string | null
  isMaximized?: boolean
  onToggleMaximize?: () => void
}

export default function VisualizationCanvas({
  step,
  onSelectNode,
  selectedNodeId,
  isMaximized,
  onToggleMaximize,
}: VisualizationCanvasProps) {
  const [zoom, setZoom] = useState(1)

  const handleZoomIn = () => setZoom((z) => Math.min(1.5, z + 0.1))
  const handleZoomOut = () => setZoom((z) => Math.max(0.6, z - 0.1))
  const handleResetZoom = () => setZoom(1)

  const nodes = step.nodes || []
  const pointers = step.pointers || []
  const structureType = step.structureType || "singly"
  const change = step.changedHighlight

  // Separate normal nodes from floating new nodes if any
  const inlineNodes = nodes.filter((n) => n.id !== "node-new-0x1200" || step.stepIndex >= 6)
  const floatingNode = nodes.find((n) => n.id === "node-new-0x1200" && step.stepIndex < 6)

  // Determine flying address animation state
  // Step 5 of insertAt: copying predecessor's next address (e.g. 0x1080) UP into newNode->next
  const isAddressFlyingUp = step.stepIndex === 5 && floatingNode !== undefined
  const flyingAddressUpVal = inlineNodes[1]?.nextAddress || "0x1080"

  // Step 6 of insertAt: copying newNode address (0x1200) DOWN into curr->next
  const isAddressFlyingDown = step.stepIndex === 6

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-[var(--au-border)] bg-[var(--au-surface)]">
      {/* Canvas Top Bar */}
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-[var(--au-border-subtle)] bg-[var(--au-surface-elevated)]/90 px-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[var(--au-brand)] ring-4 ring-[var(--au-brand-soft)] animate-pulse" />
            <span className="text-xs font-bold tracking-wider text-[var(--au-text)] uppercase">
              Visual Data Structure Canvas
            </span>
          </div>

          <span className="text-[11px] text-[var(--au-border-strong)]">|</span>

          <span className="rounded-md bg-[var(--au-surface-high)] px-2.5 py-0.5 text-xs font-mono font-medium text-[var(--au-text-secondary)]">
            {structureType === "doubly"
              ? "Doubly Linked List"
              : structureType === "circular"
              ? "Circular Linked List"
              : "Singly Linked List"}
          </span>

          {/* Active Change Highlighter Pill */}
          {change && (
            <div className="flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-400/50 px-3 py-0.5 text-xs font-bold text-amber-300 shadow-sm animate-pulse">
              <Zap size={12} className="fill-amber-300" />
              <span>{change.title}</span>
            </div>
          )}
        </div>

        {/* Canvas Controls */}
        <div className="flex items-center gap-1.5">
          <div className="mr-3 hidden items-center gap-3.5 text-xs text-[var(--au-text-muted)] md:flex">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--au-brand)]" />
              HEAD
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--au-algorithm)]" />
              curr
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--au-success)]" />
              newNode
            </span>
          </div>

          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--au-text-secondary)] transition-colors hover:bg-[var(--au-surface-high)] hover:text-[var(--au-text)]"
          >
            <ZoomOut size={15} />
          </button>

          <span className="text-xs font-mono text-[var(--au-text-muted)] w-10 text-center font-bold">
            {Math.round(zoom * 100)}%
          </span>

          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--au-text-secondary)] transition-colors hover:bg-[var(--au-surface-high)] hover:text-[var(--au-text)]"
          >
            <ZoomIn size={15} />
          </button>

          <button
            type="button"
            onClick={handleResetZoom}
            title="Reset Zoom"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--au-text-secondary)] transition-colors hover:bg-[var(--au-surface-high)] hover:text-[var(--au-text)]"
          >
            <RotateCcw size={14} />
          </button>

          {onToggleMaximize && (
            <button
              type="button"
              onClick={onToggleMaximize}
              title={isMaximized ? "Restore Layout" : "Maximize Canvas Fullscreen"}
              className="ml-1 flex h-7 w-7 items-center justify-center rounded-lg text-[var(--au-text-secondary)] transition-colors hover:bg-[var(--au-surface-high)] hover:text-[var(--au-text)]"
            >
              {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Main Large Visual Canvas Area with Spatial Grid */}
      <div
        className="relative flex-1 overflow-auto bg-[var(--au-background)] select-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1.5px 1.5px, rgba(255, 255, 255, 0.08) 1.5px, transparent 0)
          `,
          backgroundSize: "28px 28px",
        }}
      >
        <div
          className="flex min-h-full min-w-full flex-col items-center justify-center p-12 transition-transform duration-300"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
        >
          {/* =======================================================
              FLOATING NEW NODE SECTION (WITH ANIMATED ADDRESS TRANSFER)
              ======================================================= */}
          {floatingNode && (
            <div className="relative mb-12 flex flex-col items-center">
              <div className="mb-2 flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-400/50 shadow-lg animate-pulse">
                <Sparkles size={13} />
                <span>ALLOCATED NEW NODE: {floatingNode.address}</span>
              </div>

              <div className="relative">
                <NodeCard
                  node={floatingNode}
                  index={-1}
                  structureType={structureType}
                  isSelected={selectedNodeId === floatingNode.id}
                  onSelect={() => onSelectNode?.(floatingNode.id)}
                  topPointers={pointers.filter((p) => p.targetNodeId === floatingNode.id && p.position === "top")}
                  bottomPointers={pointers.filter((p) => p.targetNodeId === floatingNode.id && p.position !== "top")}
                  isChanged={change?.targetAddress === floatingNode.address || change?.targetNodeId === floatingNode.id}
                  changedField={change?.field}
                  activeTargetPointer={change?.targetPointer}
                />

                {/* Animated Flying Address Chip: Step 5 (Flying up into newNode->next) */}
                {isAddressFlyingUp && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none z-30">
                    <div className="animate-fly-address-up flex items-center gap-1 rounded-full bg-amber-400 text-black px-2.5 py-1 text-xs font-black shadow-xl ring-4 ring-amber-400/30">
                      <span>{flyingAddressUpVal}</span>
                      <ArrowRight size={12} strokeWidth={2.5} />
                    </div>
                  </div>
                )}
              </div>

              {/* Connecting Curved Arrow pointing down from newNode to target */}
              {step.stepIndex === 5 && (
                <div className="mt-2 flex flex-col items-center text-amber-300">
                  <div className="flex items-center gap-1 rounded bg-amber-400/20 px-2 py-0.5 text-[10px] font-mono font-bold border border-amber-400/40 animate-pulse">
                    <span>newNode-&gt;next = {floatingNode.nextAddress || "NULL"}</span>
                  </div>
                  <ArrowDown size={20} className="animate-bounce mt-1" strokeWidth={2.5} />
                </div>
              )}
            </div>
          )}

          {/* =======================================================
              LINEAR CHAIN OF NODES WITH LARGE CRISP SVG ARROWS
              ======================================================= */}
          <div className="relative flex items-center gap-4 py-8">
            {inlineNodes.map((node, idx) => {
              const topPtrs = pointers.filter((p) => p.targetNodeId === node.id && p.position === "top")
              const bottomPtrs = pointers.filter((p) => p.targetNodeId === node.id && p.position !== "top")
              const isNodeChanged =
                change?.targetAddress === node.address ||
                change?.targetNodeId === node.id

              return (
                <Fragment key={node.id}>
                  {/* The Node Card */}
                  <div className="relative">
                    <NodeCard
                      node={node}
                      index={idx}
                      structureType={structureType}
                      isSelected={selectedNodeId === node.id}
                      onSelect={() => onSelectNode?.(node.id)}
                      topPointers={topPtrs}
                      bottomPointers={bottomPtrs}
                      isChanged={isNodeChanged}
                      changedField={isNodeChanged ? change?.field : undefined}
                      activeTargetPointer={change?.targetPointer}
                    />

                    {/* Animated Flying Address Chip: Step 6 (Flying down from newNode into curr->next) */}
                    {isAddressFlyingDown && node.status === "active" && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none z-30">
                        <div className="animate-fly-address-down flex items-center gap-1 rounded-full bg-amber-400 text-black px-2.5 py-1 text-xs font-black shadow-xl ring-4 ring-amber-400/30">
                          <ArrowDown size={12} strokeWidth={2.5} />
                          <span>0x1200</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Inter-node Connecting Arrow */}
                  {idx < inlineNodes.length - 1 && (
                    <ArrowConnector
                      structureType={structureType}
                      isBroken={node.status === "relinking" && step.stepIndex === 5}
                      isHighlighted={isNodeChanged && change?.field === "next"}
                    />
                  )}
                </Fragment>
              )
            })}

            {/* List Terminator / Ground */}
            {structureType !== "circular" ? (
              <div className="flex items-center gap-2 pl-3">
                <div className="flex h-1 w-8 bg-[var(--au-border-strong)]" />
                <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--au-border)] bg-[var(--au-surface-elevated)] px-4 py-3 text-center shadow-lg">
                  <span className="font-mono text-sm font-bold text-[var(--au-text-muted)]">
                    NULL
                  </span>
                  <span className="text-[10px] font-mono text-[var(--au-text-disabled)] mt-0.5">
                    nullptr
                  </span>
                </div>
              </div>
            ) : (
              // Circular Back Arrow Loop to Head
              <div className="relative flex items-center pl-3">
                <div className="flex h-1 w-10 bg-[var(--au-brand)]/70" />
                <div className="rounded-lg border border-[var(--au-brand)]/50 bg-[var(--au-brand-soft)] px-3 py-1.5 text-xs font-mono font-bold text-[var(--au-brand)] shadow-md">
                  loops to HEAD
                </div>
              </div>
            )}
          </div>

          {/* =======================================================
              CIRCULAR LIST: CURVED LOOP ARROW BACK TO HEAD
              ======================================================= */}
          {structureType === "circular" && inlineNodes.length > 0 && (
            <div className="relative mt-4 h-14 w-full max-w-3xl">
              <svg className="h-full w-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <marker
                    id="circ-arrow-large"
                    viewBox="0 0 10 10"
                    refX="5"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--au-brand)" />
                  </marker>
                </defs>
                <path
                  d="M 98% 0 C 98% 50, 2% 50, 2% 0"
                  fill="none"
                  stroke="var(--au-brand)"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  markerEnd="url(#circ-arrow-large)"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// NODE CARD COMPONENT
// ============================================================================
interface NodeCardProps {
  node: ListNodeData
  index: number
  structureType: "singly" | "doubly" | "circular"
  isSelected: boolean
  onSelect: () => void
  topPointers: { name: string; color: string }[]
  bottomPointers: { name: string; color: string }[]
  isChanged?: boolean
  changedField?: string
  activeTargetPointer?: string
}

function NodeCard({
  node,
  index,
  structureType,
  isSelected,
  onSelect,
  topPointers,
  bottomPointers,
  isChanged,
  changedField,
  activeTargetPointer,
}: NodeCardProps) {
  const isNew = node.status === "new"
  const isActive = node.status === "active"
  const isTarget = node.status === "target"
  const isDeleting = node.status === "deleting"
  const isRelinking = node.status === "relinking"

  let borderStyle = "border-[var(--au-border)] hover:border-[var(--au-border-strong)]"
  let glowStyle = "shadow-xl shadow-black/40"

  // Prominent Highlighter priority
  if (isChanged) {
    borderStyle = "border-amber-400 ring-4 ring-amber-400/40"
    glowStyle = "shadow-[0_0_30px_rgba(251,191,36,0.4)]"
  } else if (isNew) {
    borderStyle = "border-[var(--au-success)] ring-2 ring-[var(--au-success)]/20"
    glowStyle = "shadow-lg shadow-[var(--au-success)]/10"
  } else if (isTarget) {
    borderStyle = "border-[var(--au-warning)] ring-2 ring-[var(--au-warning)]/20"
    glowStyle = "shadow-lg shadow-[var(--au-warning)]/15"
  } else if (isActive) {
    borderStyle = "border-[var(--au-algorithm)] ring-2 ring-[var(--au-algorithm)]/20"
    glowStyle = "shadow-lg shadow-[var(--au-algorithm)]/15"
  } else if (isDeleting) {
    borderStyle = "border-[var(--au-error)] ring-2 ring-[var(--au-error)]/20"
    glowStyle = "shadow-lg shadow-[var(--au-error)]/20 opacity-80"
  } else if (isRelinking) {
    borderStyle = "border-[var(--au-info)] ring-1 ring-[var(--au-info)]/30"
  }

  if (isSelected) {
    borderStyle = "border-[var(--au-brand)] ring-2 ring-[var(--au-brand)]"
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Changed Highlighter Badge right above the node */}
      {isChanged && (
        <div className="absolute -top-8 z-20 flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-black shadow-xl animate-bounce">
          <Zap size={11} className="fill-black" />
          <span>UPDATED</span>
        </div>
      )}

      {/* Top Pointers Container (HEAD, curr, etc.) */}
      <div className="mb-2.5 flex min-h-[36px] items-end justify-center gap-2">
        {topPointers.map((ptr) => {
          const isPtrTarget = activeTargetPointer === ptr.name
          return (
            <div
              key={ptr.name}
              className={`flex flex-col items-center transition-all duration-300 ${
                isPtrTarget ? "scale-115 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" : ""
              }`}
            >
              <span
                className={`rounded-lg px-2.5 py-1 text-xs font-mono font-bold tracking-tight text-[var(--au-text-inverse)] shadow-lg ${
                  isPtrTarget ? "ring-2 ring-amber-300 font-extrabold" : ""
                }`}
                style={{ backgroundColor: ptr.color }}
              >
                {ptr.name}
              </span>
              <div
                className="h-2.5 w-1"
                style={{ backgroundColor: ptr.color }}
              />
              <div
                className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px]"
                style={{ borderTopColor: ptr.color }}
              />
            </div>
          )
        })}
      </div>

      {/* Node Address Tag */}
      <div className="mb-1 flex items-center gap-2">
        <span
          className={`font-mono text-xs ${
            isChanged ? "font-bold text-amber-300" : "text-[var(--au-text-muted)]"
          }`}
        >
          {node.address}
        </span>
        {index >= 0 && (
          <span className="rounded bg-[var(--au-surface-high)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--au-text-disabled)] font-semibold">
            index {index}
          </span>
        )}
      </div>

      {/* Main Node Card with Big Clear Cells */}
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => e.key === "Enter" && onSelect()}
        className={`group relative flex overflow-hidden rounded-2xl border bg-[var(--au-surface-elevated)] transition-all duration-300 cursor-pointer ${borderStyle} ${glowStyle}`}
      >
        {/* Doubly: Prev Pointer cell */}
        {structureType === "doubly" && (
          <div
            className={`flex w-16 flex-col items-center justify-center border-r border-[var(--au-border-subtle)] px-2 py-4 text-center transition-colors ${
              changedField === "prev"
                ? "bg-amber-400/25 text-amber-200"
                : "bg-[var(--au-surface)]/70 text-[var(--au-text-secondary)]"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--au-text-muted)]">
              prev
            </span>
            <span className="mt-1 font-mono text-xs font-bold">
              {node.prevAddress ? node.prevAddress.slice(2) : "null"}
            </span>
          </div>
        )}

        {/* Data Cell */}
        <div className="flex min-w-[80px] flex-col items-center justify-center px-5 py-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--au-text-muted)]">
            data
          </span>
          <span className="mt-0.5 font-mono text-2xl font-black text-[var(--au-text)] group-hover:text-[var(--au-brand)] transition-colors">
            {node.val}
          </span>
        </div>

        {/* Next Pointer Cell (with Highlighter if mutated) */}
        <div
          className={`flex w-16 flex-col items-center justify-center border-l border-[var(--au-border-subtle)] px-2 py-4 text-center transition-colors ${
            changedField === "next"
              ? "bg-amber-400/25 text-amber-200"
              : "bg-[var(--au-surface)]/70 text-[var(--au-text-secondary)]"
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--au-text-muted)]">
            next
          </span>
          <span className="mt-1 font-mono text-xs font-bold">
            {node.nextAddress ? node.nextAddress.slice(2) : "null"}
          </span>
        </div>
      </div>

      {/* Bottom Pointers Container (newNode, toDelete, prev) */}
      <div className="mt-2.5 flex min-h-[36px] items-start justify-center gap-2">
        {bottomPointers.map((ptr) => {
          const isPtrTarget = activeTargetPointer === ptr.name
          return (
            <div
              key={ptr.name}
              className={`flex flex-col items-center transition-all duration-300 ${
                isPtrTarget ? "scale-115 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" : ""
              }`}
            >
              <div
                className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px]"
                style={{ borderBottomColor: ptr.color }}
              />
              <div
                className="h-2.5 w-1"
                style={{ backgroundColor: ptr.color }}
              />
              <span
                className={`rounded-lg px-2.5 py-1 text-xs font-mono font-bold tracking-tight text-[var(--au-text-inverse)] shadow-lg ${
                  isPtrTarget ? "ring-2 ring-amber-300 font-extrabold" : ""
                }`}
                style={{ backgroundColor: ptr.color }}
              >
                {ptr.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// BIG BOLD ARROW CONNECTOR
// ============================================================================
function ArrowConnector({
  structureType,
  isBroken,
  isHighlighted,
}: {
  structureType: "singly" | "doubly" | "circular"
  isBroken?: boolean
  isHighlighted?: boolean
}) {
  if (structureType === "doubly") {
    return (
      <div className="flex flex-col items-center justify-center px-1">
        {/* Forward next arrow */}
        <div
          className={`flex items-center transition-all ${
            isHighlighted ? "text-amber-300 font-bold scale-110" : "text-[var(--au-brand)]"
          }`}
        >
          <div
            className={`h-1 w-10 rounded-full ${
              isHighlighted ? "bg-amber-300 shadow-[0_0_10px_#fde047]" : "bg-[var(--au-brand)]"
            }`}
          />
          <MoveRight size={18} className="-ml-1" strokeWidth={2.5} />
        </div>
        {/* Backward prev arrow */}
        <div className="flex items-center text-[var(--au-memory)] -mt-1">
          <MoveRight size={18} className="-mr-1 rotate-180" strokeWidth={2.5} />
          <div className="h-1 w-10 rounded-full bg-[var(--au-memory)]" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center px-1">
      <div
        className={`h-1 w-10 rounded-full transition-all duration-300 ${
          isBroken
            ? "border-b-2 border-dashed border-[var(--au-error)]"
            : isHighlighted
            ? "bg-amber-300 shadow-[0_0_15px_#fde047] h-1.5"
            : "bg-[var(--au-border-strong)]"
        }`}
      />
      <MoveRight
        size={22}
        strokeWidth={2.5}
        className={`-ml-2 transition-all duration-300 ${
          isBroken
            ? "text-[var(--au-error)]"
            : isHighlighted
            ? "text-amber-300 font-bold scale-125"
            : "text-[var(--au-border-strong)]"
        }`}
      />
    </div>
  )
}
