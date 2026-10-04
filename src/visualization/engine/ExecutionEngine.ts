import {
  type ComplexityInfo,
  type ExecutionStep,
  type HeapBlock,
  type ListNodeData,
} from "../steps/Step"

export interface OperationParams {
  type: string
  initialValues: number[]
  index: number
  value: number
}

const HEX_BASES = ["0x1000", "0x1040", "0x1080", "0x10c0", "0x1100", "0x1140", "0x1180", "0x11c0"]

function makeInitialNodes(values: number[], structureType: "singly" | "doubly" | "circular" = "singly"): ListNodeData[] {
  return values.map((val, idx) => {
    const address = HEX_BASES[idx] || `0x1${(100 + idx * 40).toString(16)}`
    const isTail = idx === values.length - 1
    const nextAddress = isTail
      ? structureType === "circular" && values.length > 0
        ? HEX_BASES[0]
        : null
      : HEX_BASES[idx + 1] || `0x1${(100 + (idx + 1) * 40).toString(16)}`
    const prevAddress =
      structureType === "doubly"
        ? idx === 0
          ? null
          : HEX_BASES[idx - 1]
        : undefined

    return {
      id: `node-${idx}-${address}`,
      val,
      address,
      nextAddress,
      prevAddress,
      isHead: idx === 0,
      isTail,
      status: "normal",
    }
  })
}

function generateHeapFromNodes(nodes: ListNodeData[], extraBlock?: HeapBlock, changedAddress?: string): HeapBlock[] {
  const blocks: HeapBlock[] = nodes.map((node) => {
    const fields: Record<string, string> = {
      val: String(node.val),
      next: node.nextAddress || "nullptr",
    }
    if (node.prevAddress !== undefined) {
      fields.prev = node.prevAddress || "nullptr"
    }
    return {
      address: node.address,
      label: `Node [${node.val}]`,
      sizeBytes: node.prevAddress !== undefined ? 24 : 16,
      fields,
      state: node.status === "new" ? "allocating" : node.status === "deleting" ? "freeing" : "allocated",
      isChanged: node.address === changedAddress || node.status === "new" || node.status === "relinking",
    }
  })

  if (extraBlock) {
    blocks.push(extraBlock)
  }
  return blocks
}

// ============================================================================
// SINGLY LINKED LIST: INSERT AT
// ============================================================================
export function generateSinglyInsertAtSteps(
  initialValues: number[] = [10, 20, 30, 40],
  targetIndex: number = 2,
  newValue: number = 25,
): ExecutionStep[] {
  const clampedIndex = Math.max(0, Math.min(targetIndex, initialValues.length))
  const newAddress = "0x1200"
  const newNodeId = `node-new-${newAddress}`
  const steps: ExecutionStep[] = []

  const baseNodes = makeInitialNodes(initialValues, "singly")

  const defaultComplexity: ComplexityInfo = {
    time: clampedIndex === 0 ? "O(1)" : `O(${clampedIndex})`,
    space: "O(1) auxiliary",
    currentStepCost: "O(1)",
  }

  // STEP 0: Initial State
  steps.push({
    stepIndex: 0,
    totalSteps: 7,
    title: "Initial Linked List State",
    description: `Target: Insert node with value ${newValue} at index ${clampedIndex}.`,
    explanationDetail: {
      summary: `Current list has ${baseNodes.length} nodes. Ready to perform insertAt(index = ${clampedIndex}, val = ${newValue}).`,
      action: "Inspect parameters and verify head pointer.",
      why: "Before altering pointer chains, the initial state must be verified.",
      invariant: "List is contiguous from HEAD to NULL.",
    },
    complexity: defaultComplexity,
    activeCodeLines: { cpp: 1, python: 1, typescript: 1, java: 1 },
    nodes: JSON.parse(JSON.stringify(baseNodes)),
    pointers: [
      { name: "HEAD", targetNodeId: baseNodes[0]?.id || null, color: "var(--au-brand)", position: "top" },
    ],
    stackVariables: [
      { name: "head", type: "Node*", value: baseNodes[0]?.address || "nullptr" },
      { name: "index", type: "int", value: String(clampedIndex) },
      { name: "val", type: "int", value: String(newValue) },
    ],
    heapBlocks: generateHeapFromNodes(baseNodes),
    structureType: "singly",
    changedHighlight: {
      type: "initial_state",
      title: "State Initialized",
      description: "List loaded in memory. Ready to begin insertion.",
    },
  })

  // STEP 1: Allocate newNode
  const newNodeObj: ListNodeData = {
    id: newNodeId,
    val: newValue,
    address: newAddress,
    nextAddress: null,
    status: "new",
  }

  const step1Nodes = [...JSON.parse(JSON.stringify(baseNodes)), newNodeObj]
  steps.push({
    stepIndex: 1,
    totalSteps: 7,
    title: "Heap Memory Allocation",
    description: `Allocated new Node(${newValue}) at heap address ${newAddress}.`,
    explanationDetail: {
      summary: `Dynamically allocated 16 bytes on the heap at address ${newAddress} for the new node.`,
      action: "Call new Node(val) and store pointer in local variable newNode.",
      why: "Linked lists require dynamic node creation at runtime.",
      invariant: "newNode->next is initialized to nullptr.",
    },
    complexity: defaultComplexity,
    activeCodeLines: { cpp: 2, python: 2, typescript: 2, java: 2 },
    nodes: step1Nodes,
    pointers: [
      { name: "HEAD", targetNodeId: baseNodes[0]?.id || null, color: "var(--au-brand)", position: "top" },
      { name: "newNode", targetNodeId: newNodeId, color: "var(--au-success)", position: "bottom" },
    ],
    stackVariables: [
      { name: "head", type: "Node*", value: baseNodes[0]?.address || "nullptr" },
      { name: "index", type: "int", value: String(clampedIndex) },
      { name: "val", type: "int", value: String(newValue) },
      { name: "newNode", type: "Node*", value: newAddress, isChanged: true },
    ],
    heapBlocks: generateHeapFromNodes(step1Nodes, undefined, newAddress),
    structureType: "singly",
    changedHighlight: {
      type: "node_allocated",
      title: "New Node Allocated on Heap",
      description: `New Node(${newValue}) created at ${newAddress}. Stack pointer newNode points here.`,
      targetAddress: newAddress,
      targetNodeId: newNodeId,
      targetPointer: "newNode",
    },
  })

  if (clampedIndex === 0) {
    // Insert at Head branch
    const step2Nodes: ListNodeData[] = JSON.parse(JSON.stringify(step1Nodes))
    const nNode = step2Nodes.find((n) => n.id === newNodeId)!
    nNode.nextAddress = baseNodes[0]?.address || null
    nNode.status = "relinking"

    steps.push({
      stepIndex: 2,
      totalSteps: 4,
      title: "Link newNode->next to Current Head",
      description: `Point newNode->next (${newAddress}) to current head (${baseNodes[0]?.address || "nullptr"}).`,
      explanationDetail: {
        summary: "Connecting new node to the existing chain before moving the head pointer.",
        action: "newNode->next = head;",
        why: "Preserves the existing list chain so head is not detached.",
        invariant: "Both newNode->next and HEAD point to the old first node.",
      },
      complexity: { time: "O(1)", space: "O(1)", currentStepCost: "O(1)" },
      activeCodeLines: { cpp: 4, python: 4, typescript: 4, java: 4 },
      nodes: step2Nodes,
      pointers: [
        { name: "HEAD", targetNodeId: baseNodes[0]?.id || null, color: "var(--au-brand)", position: "top" },
        { name: "newNode", targetNodeId: newNodeId, color: "var(--au-success)", position: "bottom" },
      ],
      stackVariables: [
        { name: "head", type: "Node*", value: baseNodes[0]?.address || "nullptr" },
        { name: "newNode", type: "Node*", value: newAddress },
      ],
      heapBlocks: generateHeapFromNodes(step2Nodes, undefined, newAddress),
      structureType: "singly",
      changedHighlight: {
        type: "pointer_linked",
        title: "newNode->next Connected",
        description: `newNode->next points to current head (${baseNodes[0]?.address}).`,
        targetAddress: newAddress,
        field: "next",
      },
    })

    const step3Nodes: ListNodeData[] = [
      { ...nNode, isHead: true, status: "normal" },
      ...baseNodes.map((n) => ({ ...n, isHead: false })),
    ]

    steps.push({
      stepIndex: 3,
      totalSteps: 4,
      title: "Update HEAD Pointer",
      description: `HEAD pointer now updated to address ${newAddress}.`,
      explanationDetail: {
        summary: `Head pointer updated to point directly to newNode (${newAddress}). Insertion at index 0 completed.`,
        action: "head = newNode;",
        why: "The new node is now officially the start of the list.",
        invariant: "HEAD points to the newly inserted node.",
      },
      complexity: { time: "O(1)", space: "O(1)", currentStepCost: "O(1)" },
      activeCodeLines: { cpp: 5, python: 5, typescript: 5, java: 5 },
      nodes: step3Nodes,
      pointers: [
        { name: "HEAD", targetNodeId: newNodeId, color: "var(--au-brand)", position: "top" },
      ],
      stackVariables: [
        { name: "head", type: "Node*", value: newAddress, isChanged: true },
        { name: "newNode", type: "Node*", value: newAddress },
      ],
      heapBlocks: generateHeapFromNodes(step3Nodes),
      structureType: "singly",
      isCompleted: true,
      changedHighlight: {
        type: "head_updated",
        title: "HEAD Pointer Updated",
        description: `HEAD updated to point to newNode (${newAddress}). Insertion complete!`,
        targetAddress: newAddress,
        targetPointer: "HEAD",
      },
    })

    return steps
  }

  // STEP 2: Initialize Traversal Pointer `curr`
  const step2Nodes: ListNodeData[] = JSON.parse(JSON.stringify(step1Nodes))
  step2Nodes[0].status = "active"

  steps.push({
    stepIndex: 2,
    totalSteps: 7,
    title: "Initialize Traversal Pointer (curr = head)",
    description: `Set curr to head node at ${baseNodes[0]?.address}. Target predecessor index: ${clampedIndex - 1}.`,
    explanationDetail: {
      summary: `To insert at index ${clampedIndex}, we must advance a pointer to index ${clampedIndex - 1} (its immediate predecessor).`,
      action: "Node* curr = head;",
      why: "Singly linked lists can only traverse forward, so we must stop 1 position before the insertion target.",
      invariant: "curr is guaranteed non-null for index > 0.",
    },
    complexity: defaultComplexity,
    activeCodeLines: { cpp: 8, python: 7, typescript: 7, java: 7 },
    nodes: step2Nodes,
    pointers: [
      { name: "HEAD", targetNodeId: baseNodes[0]?.id || null, color: "var(--au-brand)", position: "top" },
      { name: "curr", targetNodeId: baseNodes[0]?.id || null, color: "var(--au-algorithm)", position: "top" },
      { name: "newNode", targetNodeId: newNodeId, color: "var(--au-success)", position: "bottom" },
    ],
    stackVariables: [
      { name: "head", type: "Node*", value: baseNodes[0]?.address || "nullptr" },
      { name: "curr", type: "Node*", value: baseNodes[0]?.address || "nullptr", isChanged: true },
      { name: "newNode", type: "Node*", value: newAddress },
      { name: "i", type: "int", value: "0" },
    ],
    heapBlocks: generateHeapFromNodes(step2Nodes),
    structureType: "singly",
    changedHighlight: {
      type: "pointer_moved",
      title: "curr Pointer Initialized",
      description: `curr initialized pointing to HEAD (${baseNodes[0]?.address}).`,
      targetPointer: "curr",
      targetAddress: baseNodes[0]?.address,
    },
  })

  // STEP 3: Traversal to predecessor
  let currIdx = 0
  const targetPredecessorIdx = clampedIndex - 1

  while (currIdx < targetPredecessorIdx && currIdx + 1 < baseNodes.length) {
    currIdx++
    const stepTravNodes: ListNodeData[] = JSON.parse(JSON.stringify(step1Nodes))
    for (let j = 0; j < currIdx; j++) {
      stepTravNodes[j].status = "traversed"
    }
    stepTravNodes[currIdx].status = "active"

    steps.push({
      stepIndex: 3,
      totalSteps: 7,
      title: `Traversing: Advance curr to Index ${currIdx}`,
      description: `curr = curr->next (address: ${baseNodes[currIdx]?.address}, val: ${baseNodes[currIdx]?.val}).`,
      explanationDetail: {
        summary: `Loop step: Advanced curr to index ${currIdx}. Checking if loop condition i < ${targetPredecessorIdx} is satisfied.`,
        action: "curr = curr->next;",
        why: "Traverse node by node until arriving right before the desired insertion location.",
        invariant: `curr is at index ${currIdx}.`,
      },
      complexity: defaultComplexity,
      activeCodeLines: { cpp: 10, python: 10, typescript: 9, java: 9 },
      nodes: stepTravNodes,
      pointers: [
        { name: "HEAD", targetNodeId: baseNodes[0]?.id || null, color: "var(--au-brand)", position: "top" },
        { name: "curr", targetNodeId: baseNodes[currIdx]?.id || null, color: "var(--au-algorithm)", position: "top" },
        { name: "newNode", targetNodeId: newNodeId, color: "var(--au-success)", position: "bottom" },
      ],
      stackVariables: [
        { name: "head", type: "Node*", value: baseNodes[0]?.address || "nullptr" },
        { name: "curr", type: "Node*", value: baseNodes[currIdx]?.address || "nullptr", isChanged: true },
        { name: "newNode", type: "Node*", value: newAddress },
        { name: "i", type: "int", value: String(currIdx), isChanged: true },
      ],
      heapBlocks: generateHeapFromNodes(stepTravNodes),
      structureType: "singly",
      changedHighlight: {
        type: "pointer_moved",
        title: "curr Advanced to Next Node",
        description: `curr moved forward to index ${currIdx} (Node [${baseNodes[currIdx]?.val}] at ${baseNodes[currIdx]?.address}).`,
        targetPointer: "curr",
        targetAddress: baseNodes[currIdx]?.address,
      },
    })
  }

  // STEP 4: Predecessor Reached
  const predecessor = baseNodes[currIdx]
  const step4Nodes: ListNodeData[] = JSON.parse(JSON.stringify(step1Nodes))
  step4Nodes[currIdx].status = "target"

  steps.push({
    stepIndex: 4,
    totalSteps: 7,
    title: "Predecessor Node Reached",
    description: `curr is at node [${predecessor.val}] (address ${predecessor.address}). Splicing will occur after this node.`,
    explanationDetail: {
      summary: `Traversal completed. Predecessor node is [${predecessor.val}]. Next node in original chain is [${predecessor.nextAddress || "NULL"}].`,
      action: "Loop completed; prepare pointer reconnection.",
      why: "Both predecessor and new node pointers are now accessible.",
      invariant: "curr->next points to the remaining subsequent nodes.",
    },
    complexity: defaultComplexity,
    activeCodeLines: { cpp: 12, python: 12, typescript: 12, java: 12 },
    nodes: step4Nodes,
    pointers: [
      { name: "HEAD", targetNodeId: baseNodes[0]?.id || null, color: "var(--au-brand)", position: "top" },
      { name: "curr", targetNodeId: predecessor.id, color: "var(--au-algorithm)", position: "top" },
      { name: "newNode", targetNodeId: newNodeId, color: "var(--au-success)", position: "bottom" },
    ],
    stackVariables: [
      { name: "head", type: "Node*", value: baseNodes[0]?.address || "nullptr" },
      { name: "curr", type: "Node*", value: predecessor.address },
      { name: "newNode", type: "Node*", value: newAddress },
    ],
    heapBlocks: generateHeapFromNodes(step4Nodes),
    structureType: "singly",
    changedHighlight: {
      type: "pointer_moved",
      title: "Predecessor Position Locked",
      description: `Target predecessor is Node [${predecessor.val}] at ${predecessor.address}. Ready to splice.`,
      targetPointer: "curr",
      targetAddress: predecessor.address,
    },
  })

  // STEP 5: Link newNode->next = curr->next
  const step5Nodes: ListNodeData[] = JSON.parse(JSON.stringify(step1Nodes))
  const nNode2 = step5Nodes.find((n) => n.id === newNodeId)!
  nNode2.nextAddress = predecessor.nextAddress
  nNode2.status = "relinking"

  steps.push({
    stepIndex: 5,
    totalSteps: 7,
    title: "Link newNode->next = curr->next",
    description: `Set newNode->next (${newAddress}) to ${predecessor.nextAddress || "nullptr"}.`,
    explanationDetail: {
      summary: "CRUCIAL STEP: Connect newNode to curr's successor before overwriting curr->next.",
      action: "newNode->next = curr->next;",
      why: "If we modified curr->next first, the rest of the list would be severed and lost forever (memory leak).",
      invariant: "Both curr and newNode point to the successor node.",
      edgeCaseNote: "Order of pointer assignments is vital in linked data structures.",
    },
    complexity: defaultComplexity,
    activeCodeLines: { cpp: 13, python: 13, typescript: 13, java: 13 },
    nodes: step5Nodes,
    pointers: [
      { name: "HEAD", targetNodeId: baseNodes[0]?.id || null, color: "var(--au-brand)", position: "top" },
      { name: "curr", targetNodeId: predecessor.id, color: "var(--au-algorithm)", position: "top" },
      { name: "newNode", targetNodeId: newNodeId, color: "var(--au-success)", position: "bottom" },
    ],
    stackVariables: [
      { name: "head", type: "Node*", value: baseNodes[0]?.address || "nullptr" },
      { name: "curr", type: "Node*", value: predecessor.address },
      { name: "newNode", type: "Node*", value: newAddress },
    ],
    heapBlocks: generateHeapFromNodes(step5Nodes, undefined, newAddress),
    structureType: "singly",
    changedHighlight: {
      type: "pointer_linked",
      title: "Pointer Wired: newNode->next",
      description: `newNode->next connected to ${predecessor.nextAddress || "NULL"}. Rest of list preserved!`,
      targetAddress: newAddress,
      field: "next",
    },
  })

  // STEP 6: Link curr->next = newNode
  const finalOrderedNodes: ListNodeData[] = []
  for (let k = 0; k <= currIdx; k++) {
    finalOrderedNodes.push({
      ...baseNodes[k],
      nextAddress: k === currIdx ? newAddress : baseNodes[k].nextAddress,
      status: "normal",
    })
  }
  finalOrderedNodes.push({
    ...newNodeObj,
    nextAddress: predecessor.nextAddress,
    status: "new",
  })
  for (let k = currIdx + 1; k < baseNodes.length; k++) {
    finalOrderedNodes.push({
      ...baseNodes[k],
      status: "normal",
      isTail: k === baseNodes.length - 1,
    })
  }

  steps.push({
    stepIndex: 6,
    totalSteps: 7,
    title: "Link curr->next = newNode (Insertion Complete)",
    description: `Re-link predecessor ${predecessor.address}->next to ${newAddress}. List spliced successfully!`,
    explanationDetail: {
      summary: `The list chain is now unbroken: ${predecessor.val} -> ${newValue} -> ${predecessor.nextAddress ? "..." : "NULL"}.`,
      action: "curr->next = newNode;",
      why: "Completes the insertion by routing predecessor traffic through newNode.",
      invariant: "Full list chain is restored and valid.",
    },
    complexity: defaultComplexity,
    activeCodeLines: { cpp: 14, python: 14, typescript: 14, java: 14 },
    nodes: finalOrderedNodes,
    pointers: [
      { name: "HEAD", targetNodeId: baseNodes[0]?.id || null, color: "var(--au-brand)", position: "top" },
      { name: "curr", targetNodeId: predecessor.id, color: "var(--au-algorithm)", position: "top" },
      { name: "newNode", targetNodeId: newNodeId, color: "var(--au-success)", position: "bottom" },
    ],
    stackVariables: [
      { name: "head", type: "Node*", value: baseNodes[0]?.address || "nullptr" },
      { name: "curr", type: "Node*", value: predecessor.address },
      { name: "newNode", type: "Node*", value: newAddress },
    ],
    heapBlocks: generateHeapFromNodes(finalOrderedNodes, undefined, predecessor.address),
    structureType: "singly",
    isCompleted: true,
    changedHighlight: {
      type: "pointer_linked",
      title: "Chain Spliced: curr->next = newNode",
      description: `Predecessor node at ${predecessor.address} now points to ${newAddress}. List is contiguous!`,
      targetAddress: predecessor.address,
      field: "next",
    },
  })

  return steps
}

// ============================================================================
// SINGLY LINKED LIST: DELETE AT
// ============================================================================
export function generateSinglyDeleteAtSteps(
  initialValues: number[] = [10, 20, 30, 40],
  targetIndex: number = 2,
): ExecutionStep[] {
  const clampedIndex = Math.max(0, Math.min(targetIndex, Math.max(0, initialValues.length - 1)))
  const baseNodes = makeInitialNodes(initialValues, "singly")
  const steps: ExecutionStep[] = []

  const defaultComplexity: ComplexityInfo = {
    time: clampedIndex === 0 ? "O(1)" : `O(${clampedIndex})`,
    space: "O(1) auxiliary",
    currentStepCost: "O(1)",
  }

  // STEP 0: Initial state
  steps.push({
    stepIndex: 0,
    totalSteps: 5,
    title: "Initial State for Deletion",
    description: `Target: Delete node at index ${clampedIndex} (value: ${initialValues[clampedIndex]}).`,
    explanationDetail: {
      summary: `List contains ${baseNodes.length} nodes. Preparing to delete element at index ${clampedIndex}.`,
      action: "Verify head is not null and target index is valid.",
      why: "Cannot delete from an empty list or invalid index.",
      invariant: "List is contiguous from HEAD to NULL.",
    },
    complexity: defaultComplexity,
    activeCodeLines: { cpp: 1, python: 1, typescript: 1, java: 1 },
    nodes: JSON.parse(JSON.stringify(baseNodes)),
    pointers: [
      { name: "HEAD", targetNodeId: baseNodes[0]?.id || null, color: "var(--au-brand)", position: "top" },
    ],
    stackVariables: [
      { name: "head", type: "Node*", value: baseNodes[0]?.address || "nullptr" },
      { name: "index", type: "int", value: String(clampedIndex) },
    ],
    heapBlocks: generateHeapFromNodes(baseNodes),
    structureType: "singly",
    changedHighlight: {
      type: "initial_state",
      title: "Ready for Deletion",
      description: `Target is Node at index ${clampedIndex} (value: ${initialValues[clampedIndex]}).`,
    },
  })

  if (clampedIndex === 0) {
    const toDeleteNode = baseNodes[0]
    const step1Nodes: ListNodeData[] = JSON.parse(JSON.stringify(baseNodes))
    step1Nodes[0].status = "deleting"

    steps.push({
      stepIndex: 1,
      totalSteps: 3,
      title: "Identify Head as toDelete",
      description: `Target index is 0. Point toDelete to HEAD (${toDeleteNode.address}).`,
      explanationDetail: {
        summary: "Special case: removing the head node requires updating the HEAD pointer directly.",
        action: "Node* toDelete = head;",
        why: "Need to hold a reference to free memory after unlinking.",
        invariant: "toDelete points to index 0.",
      },
      complexity: { time: "O(1)", space: "O(1)", currentStepCost: "O(1)" },
      activeCodeLines: { cpp: 4, python: 4, typescript: 4, java: 4 },
      nodes: step1Nodes,
      pointers: [
        { name: "HEAD", targetNodeId: toDeleteNode.id, color: "var(--au-brand)", position: "top" },
        { name: "toDelete", targetNodeId: toDeleteNode.id, color: "var(--au-error)", position: "bottom" },
      ],
      stackVariables: [
        { name: "head", type: "Node*", value: toDeleteNode.address },
        { name: "toDelete", type: "Node*", value: toDeleteNode.address, isChanged: true },
      ],
      heapBlocks: generateHeapFromNodes(step1Nodes, undefined, toDeleteNode.address),
      structureType: "singly",
      changedHighlight: {
        type: "pointer_moved",
        title: "Victim Marked (toDelete)",
        description: `toDelete holds address ${toDeleteNode.address}.`,
        targetAddress: toDeleteNode.address,
        targetPointer: "toDelete",
      },
    })

    const remainingNodes: ListNodeData[] = baseNodes.slice(1).map((n, i) => ({
      ...n,
      isHead: i === 0,
      status: "normal",
    }))

    steps.push({
      stepIndex: 2,
      totalSteps: 3,
      title: "Advance HEAD & Free Memory",
      description: `head = head->next (${toDeleteNode.nextAddress || "NULL"}). Deallocated ${toDeleteNode.address}.`,
      explanationDetail: {
        summary: `HEAD updated to node [${remainingNodes[0]?.val}]. Memory at ${toDeleteNode.address} freed back to heap.`,
        action: "head = head->next; delete toDelete;",
        why: "Prevents memory leaks and restores head invariant.",
        invariant: "New HEAD is the previous second element.",
      },
      complexity: { time: "O(1)", space: "O(1)", currentStepCost: "O(1)" },
      activeCodeLines: { cpp: 5, python: 5, typescript: 5, java: 5 },
      nodes: remainingNodes,
      pointers: [
        { name: "HEAD", targetNodeId: remainingNodes[0]?.id || null, color: "var(--au-brand)", position: "top" },
      ],
      stackVariables: [
        { name: "head", type: "Node*", value: remainingNodes[0]?.address || "nullptr", isChanged: true },
      ],
      heapBlocks: generateHeapFromNodes(remainingNodes),
      structureType: "singly",
      isCompleted: true,
      changedHighlight: {
        type: "node_deleted",
        title: "HEAD Shifted & Node Freed",
        description: `HEAD moved to 0x${remainingNodes[0]?.address.slice(2)}. Old head deallocated.`,
        targetAddress: toDeleteNode.address,
        targetPointer: "HEAD",
      },
    })

    return steps
  }

  // Deletion at index > 0
  const predIdx = clampedIndex - 1
  const predecessor = baseNodes[predIdx]
  const targetNode = baseNodes[clampedIndex]

  // Step 1: Traverse to predecessor
  const step1Nodes: ListNodeData[] = JSON.parse(JSON.stringify(baseNodes))
  step1Nodes[predIdx].status = "active"

  steps.push({
    stepIndex: 1,
    totalSteps: 5,
    title: "Traverse to Predecessor Node",
    description: `curr reached index ${predIdx} (${predecessor.address}, val: ${predecessor.val}).`,
    explanationDetail: {
      summary: `Found node right before the victim node. We need curr to rewire pointers around index ${clampedIndex}.`,
      action: "while (i < index - 1) curr = curr->next;",
      why: "Predecessor's next pointer must be redirected to bypass target node.",
      invariant: "curr points to node immediately preceding target.",
    },
    complexity: defaultComplexity,
    activeCodeLines: { cpp: 9, python: 8, typescript: 8, java: 8 },
    nodes: step1Nodes,
    pointers: [
      { name: "HEAD", targetNodeId: baseNodes[0]?.id || null, color: "var(--au-brand)", position: "top" },
      { name: "curr", targetNodeId: predecessor.id, color: "var(--au-algorithm)", position: "top" },
    ],
    stackVariables: [
      { name: "head", type: "Node*", value: baseNodes[0]?.address || "nullptr" },
      { name: "curr", type: "Node*", value: predecessor.address, isChanged: true },
    ],
    heapBlocks: generateHeapFromNodes(step1Nodes),
    structureType: "singly",
    changedHighlight: {
      type: "pointer_moved",
      title: "curr Positioned at Predecessor",
      description: `curr reached index ${predIdx} (Node [${predecessor.val}] at ${predecessor.address}).`,
      targetPointer: "curr",
      targetAddress: predecessor.address,
    },
  })

  // Step 2: Identify toDelete
  const step2Nodes: ListNodeData[] = JSON.parse(JSON.stringify(baseNodes))
  step2Nodes[predIdx].status = "active"
  step2Nodes[clampedIndex].status = "deleting"

  steps.push({
    stepIndex: 2,
    totalSteps: 5,
    title: "Mark Node to Delete",
    description: `toDelete = curr->next (${targetNode.address}, val: ${targetNode.val}).`,
    explanationDetail: {
      summary: `Identified target node [${targetNode.val}] at address ${targetNode.address}.`,
      action: "Node* toDelete = curr->next;",
      why: "Keep pointer to victim node so it can be safely deallocated.",
      invariant: "toDelete points to node being deleted.",
    },
    complexity: defaultComplexity,
    activeCodeLines: { cpp: 12, python: 11, typescript: 11, java: 11 },
    nodes: step2Nodes,
    pointers: [
      { name: "HEAD", targetNodeId: baseNodes[0]?.id || null, color: "var(--au-brand)", position: "top" },
      { name: "curr", targetNodeId: predecessor.id, color: "var(--au-algorithm)", position: "top" },
      { name: "toDelete", targetNodeId: targetNode.id, color: "var(--au-error)", position: "bottom" },
    ],
    stackVariables: [
      { name: "head", type: "Node*", value: baseNodes[0]?.address || "nullptr" },
      { name: "curr", type: "Node*", value: predecessor.address },
      { name: "toDelete", type: "Node*", value: targetNode.address, isChanged: true },
    ],
    heapBlocks: generateHeapFromNodes(step2Nodes, undefined, targetNode.address),
    structureType: "singly",
    changedHighlight: {
      type: "pointer_moved",
      title: "Victim Node Marked",
      description: `toDelete locked onto Node [${targetNode.val}] at ${targetNode.address}.`,
      targetPointer: "toDelete",
      targetAddress: targetNode.address,
    },
  })

  // Step 3: Bypass target node (curr->next = toDelete->next)
  const step3Nodes: ListNodeData[] = JSON.parse(JSON.stringify(step2Nodes))
  const predIn3 = step3Nodes.find((n) => n.id === predecessor.id)!
  predIn3.nextAddress = targetNode.nextAddress
  predIn3.status = "relinking"

  steps.push({
    stepIndex: 3,
    totalSteps: 5,
    title: "Bypass Target Node (curr->next = toDelete->next)",
    description: `Bypassed ${targetNode.address}: predecessor ${predecessor.address}->next now points to ${targetNode.nextAddress || "NULL"}.`,
    explanationDetail: {
      summary: `Node [${targetNode.val}] is now detached from the active chain. The list remains unbroken.`,
      action: "curr->next = toDelete->next;",
      why: "Skips over the target node so traversals will not visit it.",
      invariant: "predecessor now links directly to target's successor.",
    },
    complexity: defaultComplexity,
    activeCodeLines: { cpp: 13, python: 12, typescript: 12, java: 12 },
    nodes: step3Nodes,
    pointers: [
      { name: "HEAD", targetNodeId: baseNodes[0]?.id || null, color: "var(--au-brand)", position: "top" },
      { name: "curr", targetNodeId: predecessor.id, color: "var(--au-algorithm)", position: "top" },
      { name: "toDelete", targetNodeId: targetNode.id, color: "var(--au-error)", position: "bottom" },
    ],
    stackVariables: [
      { name: "head", type: "Node*", value: baseNodes[0]?.address || "nullptr" },
      { name: "curr", type: "Node*", value: predecessor.address },
      { name: "toDelete", type: "Node*", value: targetNode.address },
    ],
    heapBlocks: generateHeapFromNodes(step3Nodes, undefined, predecessor.address),
    structureType: "singly",
    changedHighlight: {
      type: "pointer_linked",
      title: "Pointer Re-routed (Bypass)",
      description: `predecessor->next updated to ${targetNode.nextAddress || "NULL"}. Target detached.`,
      targetAddress: predecessor.address,
      field: "next",
    },
  })

  // Step 4: Deallocate / Free memory
  const finalNodes: ListNodeData[] = baseNodes
    .filter((_, idx) => idx !== clampedIndex)
    .map((n, idx) => ({
      ...n,
      nextAddress: idx === predIdx ? targetNode.nextAddress : n.nextAddress,
      isTail: idx === baseNodes.length - 2,
      status: "normal",
    }))

  steps.push({
    stepIndex: 4,
    totalSteps: 5,
    title: "Deallocate Memory (delete toDelete)",
    description: `Freed node at address ${targetNode.address}. Deletion completed cleanly.`,
    explanationDetail: {
      summary: `Returned 16 bytes of heap memory at ${targetNode.address} to the operating system.`,
      action: "delete toDelete; toDelete = nullptr;",
      why: "Avoids memory leaks in C++ / manual memory management.",
      invariant: "List length is reduced by 1. All pointers are valid.",
    },
    complexity: defaultComplexity,
    activeCodeLines: { cpp: 14, python: 13, typescript: 13, java: 13 },
    nodes: finalNodes,
    pointers: [
      { name: "HEAD", targetNodeId: finalNodes[0]?.id || null, color: "var(--au-brand)", position: "top" },
    ],
    stackVariables: [
      { name: "head", type: "Node*", value: finalNodes[0]?.address || "nullptr" },
    ],
    heapBlocks: generateHeapFromNodes(finalNodes),
    structureType: "singly",
    isCompleted: true,
    changedHighlight: {
      type: "node_deleted",
      title: "Heap Memory Deallocated",
      description: `Node at ${targetNode.address} safely freed. Memory reclaimed!`,
      targetAddress: targetNode.address,
    },
  })

  return steps
}

// ============================================================================
// DOUBLY LINKED LIST: INSERT AT
// ============================================================================
export function generateDoublyInsertAtSteps(
  initialValues: number[] = [10, 20, 30, 40],
  targetIndex: number = 2,
  newValue: number = 25,
): ExecutionStep[] {
  const clampedIndex = Math.max(0, Math.min(targetIndex, initialValues.length))
  const newAddress = "0x1200"
  const newNodeId = `node-new-${newAddress}`
  const baseNodes = makeInitialNodes(initialValues, "doubly")
  const steps: ExecutionStep[] = []

  const defaultComplexity: ComplexityInfo = {
    time: `O(${clampedIndex})`,
    space: "O(1) auxiliary",
    currentStepCost: "O(1)",
  }

  // STEP 0: Initial state
  steps.push({
    stepIndex: 0,
    totalSteps: 6,
    title: "Initial Doubly Linked List State",
    description: `Doubly linked list with bidirectional pointers (next and prev). Target: Insert [${newValue}] at index ${clampedIndex}.`,
    explanationDetail: {
      summary: "In a Doubly Linked List, each node maintains two pointer references: next and prev.",
      action: "Verify list state and input arguments.",
      why: "Both forward and backward chains must be maintained consistently.",
      invariant: "node->next->prev == node for all adjacent internal nodes.",
    },
    complexity: defaultComplexity,
    activeCodeLines: { cpp: 1, python: 1, typescript: 1, java: 1 },
    nodes: JSON.parse(JSON.stringify(baseNodes)),
    pointers: [
      { name: "HEAD", targetNodeId: baseNodes[0]?.id || null, color: "var(--au-brand)", position: "top" },
    ],
    stackVariables: [
      { name: "head", type: "DNode*", value: baseNodes[0]?.address || "nullptr" },
      { name: "index", type: "int", value: String(clampedIndex) },
      { name: "val", type: "int", value: String(newValue) },
    ],
    heapBlocks: generateHeapFromNodes(baseNodes),
    structureType: "doubly",
    changedHighlight: {
      type: "initial_state",
      title: "Doubly List Initialized",
      description: "Bidirectional list loaded. Ready to insert node.",
    },
  })

  // STEP 1: Allocate new DNode
  const newNodeObj: ListNodeData = {
    id: newNodeId,
    val: newValue,
    address: newAddress,
    nextAddress: null,
    prevAddress: null,
    status: "new",
  }
  const step1Nodes = [...JSON.parse(JSON.stringify(baseNodes)), newNodeObj]

  steps.push({
    stepIndex: 1,
    totalSteps: 6,
    title: "Allocate Doubly Linked Node",
    description: `Allocated DNode(${newValue}) at address ${newAddress} (24 bytes: val, next, prev).`,
    explanationDetail: {
      summary: "DNode requires 24 bytes in 64-bit systems to store value, next pointer, and prev pointer.",
      action: "DNode* newNode = new DNode(val);",
      why: "Prepare new node container before linking into bidirectional chain.",
      invariant: "newNode->next = nullptr, newNode->prev = nullptr.",
    },
    complexity: defaultComplexity,
    activeCodeLines: { cpp: 2, python: 2, typescript: 2, java: 2 },
    nodes: step1Nodes,
    pointers: [
      { name: "HEAD", targetNodeId: baseNodes[0]?.id || null, color: "var(--au-brand)", position: "top" },
      { name: "newNode", targetNodeId: newNodeId, color: "var(--au-success)", position: "bottom" },
    ],
    stackVariables: [
      { name: "head", type: "DNode*", value: baseNodes[0]?.address || "nullptr" },
      { name: "newNode", type: "DNode*", value: newAddress, isChanged: true },
    ],
    heapBlocks: generateHeapFromNodes(step1Nodes, undefined, newAddress),
    structureType: "doubly",
    changedHighlight: {
      type: "node_allocated",
      title: "DNode Allocated on Heap",
      description: `Created 24-byte DNode(${newValue}) at address ${newAddress}.`,
      targetAddress: newAddress,
      targetPointer: "newNode",
    },
  })

  const predIdx = Math.max(0, clampedIndex - 1)
  const predecessor = baseNodes[predIdx]

  // STEP 2: Traversal to curr
  const step2Nodes: ListNodeData[] = JSON.parse(JSON.stringify(step1Nodes))
  step2Nodes[predIdx].status = "active"

  steps.push({
    stepIndex: 2,
    totalSteps: 6,
    title: "Locate Predecessor (curr)",
    description: `curr positioned at node [${predecessor.val}] (${predecessor.address}).`,
    explanationDetail: {
      summary: `Traversed to index ${predIdx}. Both forward and backward pointers will connect around this node.`,
      action: "curr = curr->next until predecessor reached.",
      why: "We splice newNode between curr and curr->next.",
      invariant: "curr is guaranteed valid.",
    },
    complexity: defaultComplexity,
    activeCodeLines: { cpp: 8, python: 7, typescript: 7, java: 7 },
    nodes: step2Nodes,
    pointers: [
      { name: "HEAD", targetNodeId: baseNodes[0]?.id || null, color: "var(--au-brand)", position: "top" },
      { name: "curr", targetNodeId: predecessor.id, color: "var(--au-algorithm)", position: "top" },
      { name: "newNode", targetNodeId: newNodeId, color: "var(--au-success)", position: "bottom" },
    ],
    stackVariables: [
      { name: "head", type: "DNode*", value: baseNodes[0]?.address || "nullptr" },
      { name: "curr", type: "DNode*", value: predecessor.address, isChanged: true },
      { name: "newNode", type: "DNode*", value: newAddress },
    ],
    heapBlocks: generateHeapFromNodes(step2Nodes),
    structureType: "doubly",
    changedHighlight: {
      type: "pointer_moved",
      title: "curr Positioned",
      description: `curr reached predecessor Node [${predecessor.val}] at ${predecessor.address}.`,
      targetPointer: "curr",
      targetAddress: predecessor.address,
    },
  })

  // STEP 3: Connect newNode's pointers
  const step3Nodes: ListNodeData[] = JSON.parse(JSON.stringify(step2Nodes))
  const nNode3 = step3Nodes.find((n) => n.id === newNodeId)!
  nNode3.nextAddress = predecessor.nextAddress
  nNode3.prevAddress = predecessor.address
  nNode3.status = "relinking"

  steps.push({
    stepIndex: 3,
    totalSteps: 6,
    title: "Connect newNode->next & newNode->prev",
    description: `newNode->next = ${predecessor.nextAddress || "NULL"}, newNode->prev = ${predecessor.address}.`,
    explanationDetail: {
      summary: "First set both pointers of the new node before modifying the existing list pointers.",
      action: "newNode->next = curr->next; newNode->prev = curr;",
      why: "Safe pointer linking order: configure newNode first without mutating the list.",
      invariant: "newNode now points forward to successor and backward to predecessor.",
    },
    complexity: defaultComplexity,
    activeCodeLines: { cpp: 12, python: 11, typescript: 11, java: 11 },
    nodes: step3Nodes,
    pointers: [
      { name: "HEAD", targetNodeId: baseNodes[0]?.id || null, color: "var(--au-brand)", position: "top" },
      { name: "curr", targetNodeId: predecessor.id, color: "var(--au-algorithm)", position: "top" },
      { name: "newNode", targetNodeId: newNodeId, color: "var(--au-success)", position: "bottom" },
    ],
    stackVariables: [
      { name: "head", type: "DNode*", value: baseNodes[0]?.address || "nullptr" },
      { name: "curr", type: "DNode*", value: predecessor.address },
      { name: "newNode", type: "DNode*", value: newAddress },
    ],
    heapBlocks: generateHeapFromNodes(step3Nodes, undefined, newAddress),
    structureType: "doubly",
    changedHighlight: {
      type: "pointer_linked",
      title: "Both newNode Pointers Linked",
      description: `newNode->next = ${predecessor.nextAddress || "NULL"}, newNode->prev = ${predecessor.address}.`,
      targetAddress: newAddress,
    },
  })

  // STEP 4: Connect successor's prev pointer
  const step4Nodes: ListNodeData[] = JSON.parse(JSON.stringify(step3Nodes))
  let successorAddr = ""
  if (predecessor.nextAddress) {
    const successor = step4Nodes.find((n) => n.address === predecessor.nextAddress)
    if (successor) {
      successor.prevAddress = newAddress
      successor.status = "relinking"
      successorAddr = successor.address
    }
  }

  steps.push({
    stepIndex: 4,
    totalSteps: 6,
    title: "Connect Successor's prev Pointer",
    description: `curr->next->prev = newNode (${newAddress}). Backward chain linked!`,
    explanationDetail: {
      summary: "Update the successor node's prev pointer to point back to newNode.",
      action: "if (curr->next) curr->next->prev = newNode;",
      why: "Ensures bidirectional navigation remains symmetric and intact.",
      invariant: "Successor now correctly points backward to newNode.",
    },
    complexity: defaultComplexity,
    activeCodeLines: { cpp: 14, python: 13, typescript: 13, java: 13 },
    nodes: step4Nodes,
    pointers: [
      { name: "HEAD", targetNodeId: baseNodes[0]?.id || null, color: "var(--au-brand)", position: "top" },
      { name: "curr", targetNodeId: predecessor.id, color: "var(--au-algorithm)", position: "top" },
      { name: "newNode", targetNodeId: newNodeId, color: "var(--au-success)", position: "bottom" },
    ],
    stackVariables: [
      { name: "head", type: "DNode*", value: baseNodes[0]?.address || "nullptr" },
      { name: "curr", type: "DNode*", value: predecessor.address },
      { name: "newNode", type: "DNode*", value: newAddress },
    ],
    heapBlocks: generateHeapFromNodes(step4Nodes, undefined, successorAddr),
    structureType: "doubly",
    changedHighlight: {
      type: "pointer_linked",
      title: "Successor Backward Pointer Linked",
      description: `Successor's prev now points back to newNode (${newAddress}).`,
      targetAddress: successorAddr,
      field: "prev",
    },
  })

  // STEP 5: Connect curr->next = newNode
  const finalDoublyNodes: ListNodeData[] = []
  for (let k = 0; k <= predIdx; k++) {
    finalDoublyNodes.push({
      ...baseNodes[k],
      nextAddress: k === predIdx ? newAddress : baseNodes[k].nextAddress,
      status: "normal",
    })
  }
  finalDoublyNodes.push({
    ...newNodeObj,
    nextAddress: predecessor.nextAddress,
    prevAddress: predecessor.address,
    status: "new",
  })
  for (let k = predIdx + 1; k < baseNodes.length; k++) {
    finalDoublyNodes.push({
      ...baseNodes[k],
      prevAddress: k === predIdx + 1 ? newAddress : baseNodes[k].prevAddress,
      status: "normal",
      isTail: k === baseNodes.length - 1,
    })
  }

  steps.push({
    stepIndex: 5,
    totalSteps: 6,
    title: "Connect curr->next = newNode (Doubly Insertion Complete)",
    description: `Linked predecessor ${predecessor.address}->next to ${newAddress}. 4-pointer splice complete!`,
    explanationDetail: {
      summary: "All 4 pointers updated: curr->next, newNode->prev, newNode->next, successor->prev.",
      action: "curr->next = newNode;",
      why: "Completes bidirectional insertion with 100% symmetric link integrity.",
      invariant: "Both forward traversal and backward traversal yield correct ordered sequences.",
    },
    complexity: defaultComplexity,
    activeCodeLines: { cpp: 15, python: 14, typescript: 14, java: 14 },
    nodes: finalDoublyNodes,
    pointers: [
      { name: "HEAD", targetNodeId: baseNodes[0]?.id || null, color: "var(--au-brand)", position: "top" },
    ],
    stackVariables: [
      { name: "head", type: "DNode*", value: baseNodes[0]?.address || "nullptr" },
    ],
    heapBlocks: generateHeapFromNodes(finalDoublyNodes, undefined, predecessor.address),
    structureType: "doubly",
    isCompleted: true,
    changedHighlight: {
      type: "pointer_linked",
      title: "Predecessor Linked (Splice Complete)",
      description: `curr->next rewired to newNode (${newAddress}). All 4 pointers valid!`,
      targetAddress: predecessor.address,
      field: "next",
    },
  })

  return steps
}

// ============================================================================
// CIRCULAR LINKED LIST: INSERT AT
// ============================================================================
export function generateCircularInsertAtSteps(
  initialValues: number[] = [10, 20, 30, 40],
  targetIndex: number = 2,
  newValue: number = 25,
): ExecutionStep[] {
  const baseNodes = makeInitialNodes(initialValues, "circular")
  const newAddress = "0x1200"
  const newNodeId = `node-new-${newAddress}`
  const steps: ExecutionStep[] = []

  const defaultComplexity: ComplexityInfo = {
    time: `O(${targetIndex})`,
    space: "O(1) auxiliary",
    currentStepCost: "O(1)",
  }

  // STEP 0: Initial state
  steps.push({
    stepIndex: 0,
    totalSteps: 5,
    title: "Initial Circular Linked List State",
    description: `Circular linked list: Tail node (${baseNodes[baseNodes.length - 1]?.address}) points back to HEAD (${baseNodes[0]?.address}).`,
    explanationDetail: {
      summary: "In a circular linked list, there is no NULL terminator; tail->next loops back to head.",
      action: "Verify cycle integrity and starting pointers.",
      why: "Circular lists require careful termination conditions to avoid infinite loops.",
      invariant: "tail->next == head.",
    },
    complexity: defaultComplexity,
    activeCodeLines: { cpp: 1, python: 1, typescript: 1, java: 1 },
    nodes: JSON.parse(JSON.stringify(baseNodes)),
    pointers: [
      { name: "HEAD", targetNodeId: baseNodes[0]?.id || null, color: "var(--au-brand)", position: "top" },
    ],
    stackVariables: [
      { name: "head", type: "CNode*", value: baseNodes[0]?.address || "nullptr" },
      { name: "index", type: "int", value: String(targetIndex) },
      { name: "val", type: "int", value: String(newValue) },
    ],
    heapBlocks: generateHeapFromNodes(baseNodes),
    structureType: "circular",
    changedHighlight: {
      type: "initial_state",
      title: "Circular Ring Loaded",
      description: `Circular list loaded: tail connects back to HEAD (${baseNodes[0]?.address}).`,
    },
  })

  // STEP 1: Allocate CNode
  const newNodeObj: ListNodeData = {
    id: newNodeId,
    val: newValue,
    address: newAddress,
    nextAddress: null,
    status: "new",
  }
  const step1Nodes = [...JSON.parse(JSON.stringify(baseNodes)), newNodeObj]

  steps.push({
    stepIndex: 1,
    totalSteps: 5,
    title: "Allocate Circular Node",
    description: `Created new CNode(${newValue}) at heap address ${newAddress}.`,
    explanationDetail: {
      summary: `Allocated dynamic memory for value ${newValue}. Initialized next pointer.`,
      action: "CNode* newNode = new CNode(val);",
      why: "Dynamic node creation on the heap.",
      invariant: "newNode created.",
    },
    complexity: defaultComplexity,
    activeCodeLines: { cpp: 2, python: 2, typescript: 2, java: 2 },
    nodes: step1Nodes,
    pointers: [
      { name: "HEAD", targetNodeId: baseNodes[0]?.id || null, color: "var(--au-brand)", position: "top" },
      { name: "newNode", targetNodeId: newNodeId, color: "var(--au-success)", position: "bottom" },
    ],
    stackVariables: [
      { name: "head", type: "CNode*", value: baseNodes[0]?.address || "nullptr" },
      { name: "newNode", type: "CNode*", value: newAddress, isChanged: true },
    ],
    heapBlocks: generateHeapFromNodes(step1Nodes, undefined, newAddress),
    structureType: "circular",
    changedHighlight: {
      type: "node_allocated",
      title: "New Circular Node Allocated",
      description: `CNode(${newValue}) allocated at address ${newAddress}.`,
      targetAddress: newAddress,
      targetPointer: "newNode",
    },
  })

  // Step 2: Traversal
  const predIdx = Math.max(0, targetIndex - 1)
  const predecessor = baseNodes[predIdx]
  const step2Nodes: ListNodeData[] = JSON.parse(JSON.stringify(step1Nodes))
  step2Nodes[predIdx].status = "active"

  steps.push({
    stepIndex: 2,
    totalSteps: 5,
    title: "Traverse to Predecessor Node",
    description: `curr reached index ${predIdx} (${predecessor.address}, val: ${predecessor.val}).`,
    explanationDetail: {
      summary: `Positioned curr at predecessor node before the insertion index.`,
      action: "for (int i = 0; i < index - 1; ++i) curr = curr->next;",
      why: "Allows insertion between curr and curr->next.",
      invariant: "curr->next is within the circular loop.",
    },
    complexity: defaultComplexity,
    activeCodeLines: { cpp: 16, python: 14, typescript: 14, java: 14 },
    nodes: step2Nodes,
    pointers: [
      { name: "HEAD", targetNodeId: baseNodes[0]?.id || null, color: "var(--au-brand)", position: "top" },
      { name: "curr", targetNodeId: predecessor.id, color: "var(--au-algorithm)", position: "top" },
      { name: "newNode", targetNodeId: newNodeId, color: "var(--au-success)", position: "bottom" },
    ],
    stackVariables: [
      { name: "head", type: "CNode*", value: baseNodes[0]?.address || "nullptr" },
      { name: "curr", type: "CNode*", value: predecessor.address, isChanged: true },
      { name: "newNode", type: "CNode*", value: newAddress },
    ],
    heapBlocks: generateHeapFromNodes(step2Nodes),
    structureType: "circular",
    changedHighlight: {
      type: "pointer_moved",
      title: "curr Positioned at Predecessor",
      description: `curr reached Node [${predecessor.val}] at ${predecessor.address}.`,
      targetPointer: "curr",
      targetAddress: predecessor.address,
    },
  })

  // Step 3: Connect newNode->next = curr->next
  const step3Nodes: ListNodeData[] = JSON.parse(JSON.stringify(step2Nodes))
  const nNodeC = step3Nodes.find((n) => n.id === newNodeId)!
  nNodeC.nextAddress = predecessor.nextAddress
  nNodeC.status = "relinking"

  steps.push({
    stepIndex: 3,
    totalSteps: 5,
    title: "Link newNode->next = curr->next",
    description: `newNode->next (${newAddress}) set to ${predecessor.nextAddress}.`,
    explanationDetail: {
      summary: "Link newNode into the ring before updating predecessor.",
      action: "newNode->next = curr->next;",
      why: "Maintains ring continuity.",
      invariant: "Both curr and newNode point to successor in ring.",
    },
    complexity: defaultComplexity,
    activeCodeLines: { cpp: 20, python: 18, typescript: 18, java: 18 },
    nodes: step3Nodes,
    pointers: [
      { name: "HEAD", targetNodeId: baseNodes[0]?.id || null, color: "var(--au-brand)", position: "top" },
      { name: "curr", targetNodeId: predecessor.id, color: "var(--au-algorithm)", position: "top" },
      { name: "newNode", targetNodeId: newNodeId, color: "var(--au-success)", position: "bottom" },
    ],
    stackVariables: [
      { name: "head", type: "CNode*", value: baseNodes[0]?.address || "nullptr" },
      { name: "curr", type: "CNode*", value: predecessor.address },
      { name: "newNode", type: "CNode*", value: newAddress },
    ],
    heapBlocks: generateHeapFromNodes(step3Nodes, undefined, newAddress),
    structureType: "circular",
    changedHighlight: {
      type: "pointer_linked",
      title: "newNode Linked into Ring",
      description: `newNode->next connected to ${predecessor.nextAddress}. Ring unbroken.`,
      targetAddress: newAddress,
      field: "next",
    },
  })

  // Step 4: Complete circular link
  const finalCircNodes: ListNodeData[] = []
  for (let k = 0; k <= predIdx; k++) {
    finalCircNodes.push({
      ...baseNodes[k],
      nextAddress: k === predIdx ? newAddress : baseNodes[k].nextAddress,
      status: "normal",
    })
  }
  finalCircNodes.push({
    ...newNodeObj,
    nextAddress: predecessor.nextAddress,
    status: "new",
  })
  for (let k = predIdx + 1; k < baseNodes.length; k++) {
    finalCircNodes.push({
      ...baseNodes[k],
      status: "normal",
      isTail: k === baseNodes.length - 1,
      nextAddress: k === baseNodes.length - 1 ? baseNodes[0].address : baseNodes[k].nextAddress,
    })
  }

  steps.push({
    stepIndex: 4,
    totalSteps: 5,
    title: "Link curr->next = newNode (Circular Ring Restored)",
    description: `Updated ${predecessor.address}->next to ${newAddress}. Ring unbroken!`,
    explanationDetail: {
      summary: "The circular chain is fully connected and loops continuously back to HEAD.",
      action: "curr->next = newNode;",
      why: "Restores unbroken circular invariant.",
      invariant: "Traversing from any node will loop through all nodes back to start.",
    },
    complexity: defaultComplexity,
    activeCodeLines: { cpp: 21, python: 19, typescript: 19, java: 19 },
    nodes: finalCircNodes,
    pointers: [
      { name: "HEAD", targetNodeId: baseNodes[0]?.id || null, color: "var(--au-brand)", position: "top" },
    ],
    stackVariables: [
      { name: "head", type: "CNode*", value: baseNodes[0]?.address || "nullptr" },
    ],
    heapBlocks: generateHeapFromNodes(finalCircNodes, undefined, predecessor.address),
    structureType: "circular",
    isCompleted: true,
    changedHighlight: {
      type: "pointer_linked",
      title: "Predecessor Linked (Ring Complete)",
      description: `predecessor->next updated to ${newAddress}. Continuous cycle verified!`,
      targetAddress: predecessor.address,
      field: "next",
    },
  })

  return steps
}

// Master generator dispatcher
export function generateStepsForOperation(
  operationId: string,
  initialValues: number[] = [10, 20, 30, 40],
  index: number = 2,
  value: number = 25,
): ExecutionStep[] {
  switch (operationId) {
    case "singly-deleteAt":
      return generateSinglyDeleteAtSteps(initialValues, index)

    case "doubly-insertAt":
      return generateDoublyInsertAtSteps(initialValues, index, value)

    case "circular-insertAt":
      return generateCircularInsertAtSteps(initialValues, index, value)

    case "singly-insertAt":
    default:
      return generateSinglyInsertAtSteps(initialValues, index, value)
  }
}
