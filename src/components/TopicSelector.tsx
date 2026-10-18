import { useMemo, useState } from "react"
import { groups, sections } from "../data/topics"
import { getRegisteredTopics } from "../visualizations/topicRegistry"
import Icon from "./Icon"

type Dialog = "settings" | "updates" | null

// Registered topic files automatically appear under their declared category.
const registeredTopics = getRegisteredTopics()
const navigationGroups = groups.map((group) => {
  const items = [...group.items] as string[]
  const additions = registeredTopics
    .filter((definition) => definition.category === group.name)
    .map((definition) => definition.title)
    .filter((title) => !items.includes(title))
  return { ...group, items: [...additions, ...items] }
})
const categoryIcons = [
  "array",
  "link",
  "stack",
  "stack",
  "refresh",
  "sort",
  "array",
  "tree",
  "graph",
  "layers",
  "code",
  "check",
] as const

export default function TopicSelector({
  active,
  onSelect,
  open,
  onClose,
}: {
  active: string
  onSelect: (topic: string) => void
  open: boolean
  onClose: () => void
}) {
  const [dialog, setDialog] = useState<Dialog>(null)
  const [compact, setCompact] = useState(false)
  const [query, setQuery] = useState("")
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    const configured = Object.entries(sections).flatMap(([group, parts]) =>
      parts.some((part) => part.items.includes(active))
        ? [
            group +
              "::" +
              parts.find((part) => part.items.includes(active))?.name,
          ]
        : []
    )
    const registered = registeredTopics.find(
      (definition) => definition.title === active
    )
    if (
      registered &&
      !(sections[registered.category] ?? []).some((section) =>
        section.items.includes(active)
      )
    ) {
      configured.push(registered.category + "::New visualizations")
    }
    return configured
  })
  const toggleSection = (key: string) =>
    setExpandedSections((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    )
  const [expanded, setExpanded] = useState<string[]>(() =>
    navigationGroups
      .filter((group) => group.items.includes(active))
      .map((group) => group.name)
  )
  const filteredGroups = useMemo(
    () =>
      navigationGroups
        .map((g) => ({
          ...g,
          items: g.items.filter((item) =>
            item.toLowerCase().includes(query.trim().toLowerCase())
          ),
        }))
        .filter(
          (g) =>
            !query.trim() ||
            g.name.toLowerCase().includes(query.trim().toLowerCase()) ||
            g.items.length
        ),
    [query]
  )
  const toggleGroup = (name: string) =>
    setExpanded((prev) =>
      prev.includes(name) ? prev.filter((g) => g !== name) : [...prev, name]
    )
  return (
    <>
      <div
        className={"sidebar-scrim " + (open ? "visible" : "")}
        onClick={onClose}
      />
      <aside className={"sidebar " + (open ? "sidebar-open " : "") + ""}>
        <div className="sidebar-heading">
          <span className="sidebar-title">TOPICS</span>
          <button
            className="sidebar-toggle icon-btn"
            onClick={onClose}
            title="Close topics"
            aria-label="Close topics"
          >
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="sidebar-topic-search">
          <Icon name="search" size={16} />
          <input
            aria-label="Search topics and operations"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search operations..."
          />
          {query && (
            <button
              aria-label="Clear search"
              title="Clear search"
              onClick={() => setQuery("")}
            >
              <Icon name="close" size={14} />
            </button>
          )}
        </div>
        <nav
          className="sidebar-nav"
          aria-label="Algorithms and data structures"
        >
          {filteredGroups.map((group) => {
            const groupIndex = navigationGroups.findIndex(
              (g) => g.name === group.name
            )
            const isOpen =
              Boolean(query.trim()) || expanded.includes(group.name)
            const items: readonly string[] =
              query.trim() &&
              group.name.toLowerCase().includes(query.trim().toLowerCase())
                ? navigationGroups[groupIndex].items
                : group.items
            const configuredSections = sections[group.name] ?? [
              { name: "Operations", items: navigationGroups[groupIndex].items },
            ]
            const alreadySectioned = new Set(
              configuredSections.flatMap((section) => section.items)
            )
            const newlyRegistered = registeredTopics
              .filter((definition) => definition.category === group.name)
              .map((definition) => definition.title)
              .filter((title) => !alreadySectioned.has(title))
            const topicSections = newlyRegistered.length
              ? [
                  ...configuredSections,
                  { name: "New visualizations", items: newlyRegistered },
                ]
              : configuredSections
            return (
              <div
                className="topic-group"
                data-group={groupIndex}
                key={group.name}
              >
                <button
                  className={
                    "group-label category-button category-" + groupIndex
                  }
                  title={group.name}
                  aria-expanded={isOpen}
                  aria-controls={"topics-group-" + groupIndex}
                  onClick={() => toggleGroup(group.name)}
                >
                  <Icon name={categoryIcons[groupIndex]} size={17} />
                  <span>{group.name}</span>
                  <span className="sidebar-group-count">
                    {navigationGroups[groupIndex].items.length}
                  </span>
                  <Icon
                    name="chevron-down"
                    size={14}
                    className={
                      "sidebar-group-chevron " + (isOpen ? "open" : "")
                    }
                  />
                </button>
                {isOpen && (
                  <div
                    className="group-topics"
                    id={"topics-group-" + groupIndex}
                  >
                    {topicSections.map((section) => {
                      const visible = section.items.filter((item) =>
                        items.includes(item)
                      )
                      if (!visible.length) return null
                      const key = group.name + "::" + section.name
                      const sectionOpen =
                        Boolean(query.trim()) || expandedSections.includes(key)
                      return (
                        <div className="sidebar-subgroup" key={key}>
                          <button
                            className={"sidebar-subgroup-label"}
                            onClick={() => toggleSection(key)}
                            aria-expanded={sectionOpen}
                          >
                            <Icon
                              name="chevron-down"
                              size={13}
                              className={
                                "sidebar-subgroup-chevron " +
                                (sectionOpen ? "open" : "")
                              }
                            />
                            <span>{section.name}</span>
                            <span className="sidebar-subgroup-count">
                              {section.items.length}
                            </span>
                          </button>
                          {sectionOpen && (
                            <div className="sidebar-subgroup-items">
                              {visible.map((item) => (
                                <button
                                  key={item}
                                  title={item}
                                  aria-label={item}
                                  aria-current={
                                    active === item ? "page" : undefined
                                  }
                                  className={
                                    "topic-item category-topic-" +
                                    groupIndex +
                                    " " +
                                    (active === item ? "selected" : "")
                                  }
                                  onClick={() => {
                                    onSelect(item)
                                    onClose()
                                  }}
                                >
                                  <span className="topic-indicator" />
                                  <span className="topic-text">{item}</span>
                                </button>
                              ))}
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
          {!filteredGroups.length && (
            <p className="sidebar-no-results">No matching operations</p>
          )}
        </nav>
        <div className="sidebar-footer">
          <button
            className="updates-action"
            title="Application updates"
            aria-label="Application updates"
            onClick={() => setDialog("updates")}
          >
            <Icon name="download-cloud" />
            <span>Updates</span>
          </button>
          <button
            className="settings-action"
            title="Application settings"
            aria-label="Application settings"
            onClick={() => setDialog("settings")}
          >
            <Icon name="settings" />
            <span>Settings</span>
          </button>
        </div>
      </aside>
      {dialog && (
        <div
          className="app-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setDialog(null)
          }}
        >
          <section
            className="app-modal"
            role="dialog"
            aria-modal="true"
            aria-label={
              dialog === "settings"
                ? "Application settings"
                : "Application updates"
            }
          >
            <header>
              <strong>
                {dialog === "settings"
                  ? "Application settings"
                  : "Application updates"}
              </strong>
              <button onClick={() => setDialog(null)} aria-label="Close dialog">
                <Icon name="close" />
              </button>
            </header>
            {dialog === "settings" ? (
              <div className="app-modal-body">
                <label className="setting-row">
                  <span>Compact topic spacing</span>
                  <input
                    type="checkbox"
                    checked={compact}
                    onChange={(e) => setCompact(e.target.checked)}
                  />
                </label>
                <p>
                  Additional application preferences can be connected here
                  later.
                </p>
              </div>
            ) : (
              <div className="app-modal-body">
                <p>Update checking has not been connected yet.</p>
                <p>
                  Connect the Tauri updater plugin when you implement
                  application updates.
                </p>
              </div>
            )}
            <footer>
              <button onClick={() => setDialog(null)}>Close</button>
            </footer>
          </section>
        </div>
      )}
      <style>
        {compact
          ? ".sidebar .topic-item{padding-top:6px;padding-bottom:6px}"
          : ""}
      </style>
    </>
  )
}
