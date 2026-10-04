import {
  BookOpen,
  ChartColumnBig,
  CircleUserRound,
  House,
  Puzzle,
  RefreshCw,
  Settings,
  SquarePlay,
} from "lucide-react"

export type AppScreen =
  | "home"
  | "learn"
  | "visualizer"
  | "practice"
  | "progress"
  | "updates"
  | "account"
  | "settings"

interface NavigationRailProps {
  activeScreen: AppScreen
  onNavigate: (screen: AppScreen) => void
}

const navigationItems: {
  id: AppScreen
  label: string
  icon: typeof House
}[] = [
  {
    id: "home",
    label: "Home",
    icon: House,
  },
  {
    id: "learn",
    label: "Learn",
    icon: BookOpen,
  },
  {
    id: "visualizer",
    label: "Visualizer",
    icon: SquarePlay,
  },
  {
    id: "practice",
    label: "Practice",
    icon: Puzzle,
  },
  {
    id: "progress",
    label: "Progress",
    icon: ChartColumnBig,
  },
]

function NavigationRail({
  activeScreen,
  onNavigate,
}: NavigationRailProps) {
  // Temporary value.
  // Later this will come from the real Tauri update checker.
  const updateAvailable = false;

  return (
    <aside className="flex w-14 shrink-0 flex-col items-center border-r border-[var(--au-border-subtle)] bg-[var(--au-surface)] py-3">
      {/* Main navigation */}
      <nav className="flex flex-col items-center gap-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const active = activeScreen === item.id

          return (
            <button
              key={item.id}
              type="button"
              title={item.label}
              aria-label={item.label}
              onClick={() => onNavigate(item.id)}
              className="flex h-10 w-10 items-center justify-center rounded-full"
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                  active
                    ? "bg-[var(--au-accent)]/12 text-[var(--au-accent)]"
                    : "text-[var(--au-text-muted)] hover:bg-[var(--au-surface-high)] hover:text-[var(--au-text)]"
                }`}
              >
                <Icon
                  size={19}
                  strokeWidth={active ? 2.2 : 1.8}
                />
              </span>
            </button>
          )
        })}
      </nav>

      {/* Bottom navigation */}
      <div className="mt-auto flex flex-col items-center gap-2">
        {/* Updates */}
        <button
          type="button"
          title={
            updateAvailable
              ? "Updates available"
              : "Updates"
          }
          aria-label={
            updateAvailable
              ? "Updates available"
              : "Updates"
          }
          onClick={() => onNavigate("updates")}
          className="relative flex h-10 w-10 items-center justify-center rounded-full"
        >
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              activeScreen === "updates"
                ? "bg-[var(--au-accent)]/12 text-[var(--au-accent)]"
                : "text-[var(--au-text-muted)] hover:bg-[var(--au-surface-high)] hover:text-[var(--au-text)]"
            }`}
          >
            <RefreshCw
              size={19}
              strokeWidth={activeScreen === "updates" ? 2.2 : 1.8}
            />
          </span>

          {/* Update indicator */}
          {updateAvailable && (
            <span
              className="absolute right-[6px] top-[5px] h-2 w-2 rounded-full bg-[var(--au-accent)] ring-2 ring-[var(--au-surface)]"
              aria-hidden="true"
            />
          )}
        </button>

        {/* Account */}
        <button
          type="button"
          title="Account"
          aria-label="Account"
          onClick={() => onNavigate("account")}
          className="flex h-10 w-10 items-center justify-center rounded-full"
        >
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              activeScreen === "account"
                ? "bg-[var(--au-accent)]/12 text-[var(--au-accent)]"
                : "text-[var(--au-text-muted)] hover:bg-[var(--au-surface-high)] hover:text-[var(--au-text)]"
            }`}
          >
            <CircleUserRound
              size={19}
              strokeWidth={activeScreen === "account" ? 2.2 : 1.8}
            />
          </span>
        </button>

        {/* Settings */}
        <button
          type="button"
          title="Settings"
          aria-label="Settings"
          onClick={() => onNavigate("settings")}
          className="flex h-10 w-10 items-center justify-center rounded-full"
        >
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              activeScreen === "settings"
                ? "bg-[var(--au-accent)]/12 text-[var(--au-accent)]"
                : "text-[var(--au-text-muted)] hover:bg-[var(--au-surface-high)] hover:text-[var(--au-text)]"
            }`}
          >
            <Settings
              size={19}
              strokeWidth={activeScreen === "settings" ? 2.2 : 1.8}
            />
          </span>
        </button>
      </div>
    </aside>
  )
}

export default NavigationRail