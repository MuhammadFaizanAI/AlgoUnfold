import { useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  Compass,
  FolderGit2,
  RefreshCw,
  Search,
  Settings,
  X,
} from "lucide-react"

export interface TopicItem {
  id: string
  title: string
  complexity?: string
  isPopular?: boolean
}

export interface SubCategory {
  title: string
  items: TopicItem[]
}

export interface Category {
  title: string
  subcategories: SubCategory[]
}

const topicCategories: Category[] = [
  {
    title: "Linked List",
    subcategories: [
      {
        title: "Singly",
        items: [
          { id: "singly-insertAt", title: "InsertAt", complexity: "O(n)", isPopular: true },
          { id: "singly-deleteAt", title: "DeleteAt", complexity: "O(n)" },
        ],
      },
      {
        title: "Doubly Linked List",
        items: [
          { id: "doubly-insertAt", title: "InsertAt", complexity: "O(n)" },
        ],
      },
      {
        title: "Circular",
        items: [
          { id: "circular-insertAt", title: "InsertAt", complexity: "O(n)" },
        ],
      },
    ],
  },
  {
    title: "Arrays & Dynamic Arrays",
    subcategories: [
      {
        title: "Operations",
        items: [
          { id: "array-insert", title: "Insert At Index", complexity: "O(n)" },
          { id: "array-binary-search", title: "Binary Search", complexity: "O(log n)" },
        ],
      },
    ],
  },
  {
    title: "Stack & Queue",
    subcategories: [
      {
        title: "Linear Collections",
        items: [
          { id: "stack-push-pop", title: "Stack (Push / Pop)", complexity: "O(1)" },
          { id: "queue-enqueue", title: "Queue (Enqueue / Dequeue)", complexity: "O(1)" },
        ],
      },
    ],
  },
]

interface SidebarOverlayProps {
  isOpen: boolean
  onClose: () => void
  activeOperationId: string
  onSelectOperation: (id: string) => void
  onOpenDialog: (type: "update" | "account" | "settings") => void
}

export default function SidebarOverlay({
  isOpen,
  onClose,
  activeOperationId,
  onSelectOperation,
  onOpenDialog,
}: SidebarOverlayProps) {
  const [search, setSearch] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "Linked List": true,
    "Linked List-Singly": true,
    "Linked List-Doubly Linked List": true,
    "Linked List-Circular": true,
  })

  if (!isOpen) return null

  const toggleCategory = (key: string) => {
    setExpandedCategories((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Filter topics based on search query
  const query = search.toLowerCase().trim()

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Dimmed Backdrop */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Close sidebar"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      {/* Sliding Drawer Container */}
      <aside className="relative z-10 flex h-full w-80 max-w-[85vw] flex-col border-r border-[var(--au-border)] bg-[var(--au-surface)] shadow-2xl animate-slide-right">
        {/* Drawer Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--au-border-subtle)] px-4">
          <div className="flex items-center gap-2.5">
            <Compass size={18} className="text-[var(--au-brand)]" />
            <h2 className="text-sm font-bold tracking-tight text-[var(--au-text)]">
              Select Topic
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Close Menu (Esc)"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--au-text-muted)] transition-colors hover:bg-[var(--au-surface-high)] hover:text-[var(--au-text)]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search Input */}
        <div className="border-b border-[var(--au-border-subtle)] p-3">
          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--au-text-muted)]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search topics, operations..."
              className="h-8 w-full rounded-lg border border-[var(--au-border)] bg-[var(--au-surface-elevated)] pl-9 pr-3 text-xs text-[var(--au-text)] outline-none placeholder:text-[var(--au-text-disabled)] focus:border-[var(--au-brand)] transition-colors"
            />
          </div>
        </div>

        {/* Tree View of Lessons and Categories */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          <div className="space-y-3">
            {topicCategories.map((category) => {
              const isCatExpanded = expandedCategories[category.title] ?? true

              // Filter subcategories & items if searching
              const filteredSubcategories = category.subcategories
                .map((sub) => {
                  const filteredItems = sub.items.filter((item) => {
                    if (!query) return true
                    return (
                      item.title.toLowerCase().includes(query) ||
                      sub.title.toLowerCase().includes(query) ||
                      category.title.toLowerCase().includes(query)
                    )
                  })
                  return { ...sub, items: filteredItems }
                })
                .filter((sub) => sub.items.length > 0)

              if (filteredSubcategories.length === 0) return null

              return (
                <div key={category.title} className="space-y-1">
                  {/* Category Level (e.g. Linked List) */}
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.title)}
                    className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs font-bold text-[var(--au-text)] hover:bg-[var(--au-surface-high)] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FolderGit2 size={15} className="text-[var(--au-brand)]" />
                      <span>{category.title}</span>
                    </div>
                    {isCatExpanded ? (
                      <ChevronDown size={14} className="text-[var(--au-text-muted)]" />
                    ) : (
                      <ChevronRight size={14} className="text-[var(--au-text-muted)]" />
                    )}
                  </button>

                  {/* Subcategories (e.g. Doubly Linked List, Singly, Circular) */}
                  {isCatExpanded && (
                    <div className="ml-3 pl-2 border-l border-[var(--au-border-subtle)] space-y-1">
                      {filteredSubcategories.map((sub) => {
                        const subKey = `${category.title}-${sub.title}`
                        const isSubExpanded = expandedCategories[subKey] ?? true

                        return (
                          <div key={sub.title} className="space-y-0.5">
                            <button
                              type="button"
                              onClick={() => toggleCategory(subKey)}
                              className="flex w-full items-center justify-between rounded px-2 py-1 text-left text-[11px] font-semibold text-[var(--au-text-secondary)] hover:bg-[var(--au-surface-high)]/60 transition-colors"
                            >
                              <span>{sub.title}</span>
                              {isSubExpanded ? (
                                <ChevronDown size={12} className="text-[var(--au-text-muted)]" />
                              ) : (
                                <ChevronRight size={12} className="text-[var(--au-text-muted)]" />
                              )}
                            </button>

                            {/* Operations (e.g. InsertAt, DeleteAt) */}
                            {isSubExpanded && (
                              <div className="ml-2 pl-2 border-l border-[var(--au-border-subtle)] space-y-0.5">
                                {sub.items.map((item) => {
                                  const isActive = activeOperationId === item.id

                                  return (
                                    <button
                                      key={item.id}
                                      type="button"
                                      onClick={() => {
                                        onSelectOperation(item.id)
                                        onClose()
                                      }}
                                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-all ${
                                        isActive
                                          ? "bg-[var(--au-brand)] font-semibold text-[var(--au-text-inverse)] shadow-sm"
                                          : "text-[var(--au-text-secondary)] hover:bg-[var(--au-surface-high)] hover:text-[var(--au-text)]"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span
                                          className={`h-1.5 w-1.5 rounded-full ${
                                            isActive
                                              ? "bg-[var(--au-text-inverse)]"
                                              : "bg-[var(--au-brand)]/60"
                                          }`}
                                        />
                                        <span>{item.title}</span>
                                      </div>

                                      {item.complexity && (
                                        <span
                                          className={`font-mono text-[10px] ${
                                            isActive
                                              ? "text-[var(--au-text-inverse)]/80 font-bold"
                                              : "text-[var(--au-text-muted)]"
                                          }`}
                                        >
                                          {item.complexity}
                                        </span>
                                      )}
                                    </button>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Drawer Bottom Navigation (Update, Account, Settings) */}
        <div className="border-t border-[var(--au-border)] bg-[var(--au-surface-elevated)] p-2 space-y-1">
          {/* Update */}
          <button
            type="button"
            onClick={() => {
              onOpenDialog("update")
              onClose()
            }}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-[var(--au-text-secondary)] hover:bg-[var(--au-surface-high)] hover:text-[var(--au-text)] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <RefreshCw size={15} className="text-[var(--au-info)]" />
              <span>Update</span>
            </div>
            <span className="rounded bg-[var(--au-brand)]/15 px-1.5 py-0.2 font-mono text-[10px] font-semibold text-[var(--au-brand)]">
              v1.0.0
            </span>
          </button>

          {/* Account */}
          <button
            type="button"
            onClick={() => {
              onOpenDialog("account")
              onClose()
            }}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-[var(--au-text-secondary)] hover:bg-[var(--au-surface-high)] hover:text-[var(--au-text)] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <CircleUserRound size={15} className="text-[var(--au-brand)]" />
              <span>Account</span>
            </div>
            <span className="text-[10px] text-[var(--au-text-muted)]">
              Raif
            </span>
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={() => {
              onOpenDialog("settings")
              onClose()
            }}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-[var(--au-text-secondary)] hover:bg-[var(--au-surface-high)] hover:text-[var(--au-text)] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Settings size={15} className="text-[var(--au-warning)]" />
              <span>Settings</span>
            </div>
            <span className="text-[10px] text-[var(--au-text-muted)]">
              Preferences
            </span>
          </button>
        </div>
      </aside>
    </div>
  )
}
