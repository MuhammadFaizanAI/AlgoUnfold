import {
  ArrowRight,
  BookOpen,
  ChartColumnBig,
  Clock3,
  House,
  Puzzle,
  SquarePlay,
} from "lucide-react"

import type { AppScreen } from "../components/shell/NavigationRail"

interface HomeProps {
  onNavigate: (screen: AppScreen) => void
}

const recentItems = [
  {
    title: "Binary Search",
    type: "Algorithm",
    icon: SquarePlay,
    color: "text-[var(--au-algorithm)]",
  },
  {
    title: "Linked List",
    type: "Data Structure",
    icon: BookOpen,
    color: "text-[var(--au-memory)]",
  },
  {
    title: "Stack",
    type: "Data Structure",
    icon: BookOpen,
    color: "text-[var(--au-brand)]",
  },
]

const exploreItems = [
  {
    title: "Data Structures",
    description:
      "Understand how data is organized, stored, and connected in memory.",
    icon: BookOpen,
    screen: "learn" as AppScreen,
    color: "var(--au-memory)",
  },
  {
    title: "Algorithms",
    description:
      "Step through execution and see how every operation changes state.",
    icon: SquarePlay,
    screen: "visualizer" as AppScreen,
    color: "var(--au-algorithm)",
  },
  {
    title: "Practice",
    description:
      "Test your understanding with problems connected to what you learn.",
    icon: Puzzle,
    screen: "practice" as AppScreen,
    color: "var(--au-success)",
  },
]

function Home({ onNavigate }: HomeProps) {
  return (
    <div className="h-full overflow-hidden bg-[var(--au-background)]">
      <div className="mx-auto flex h-full w-full max-w-[1500px] flex-col overflow-y-auto px-8 py-8">

        {/* =====================================================
            HERO
            ===================================================== */}

        <section className="shrink-0">
          <div className="flex items-center gap-2">
            <House
              size={14}
              strokeWidth={1.8}
              className="text-[var(--au-brand)]"
            />

            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--au-text-muted)]">
              Home
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--au-text)]">
            Welcome to AlgoUnfold
          </h1>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[var(--au-text-secondary)]">
            A DSA visualization and learning laboratory where you can
            explore algorithms, understand data structures, and see
            what happens during execution.
          </p>
        </section>


        {/* =====================================================
            CONTINUE LEARNING
            ===================================================== */}

        <section className="mt-7 shrink-0">
          <div className="mb-3">
            <h2 className="text-sm font-semibold leading-5 text-[var(--au-text)]">
              Continue learning
            </h2>

            <p className="mt-0.5 text-xs leading-5 text-[var(--au-text-muted)]">
              Pick up where you left off.
            </p>
          </div>

          <div className="au-card overflow-hidden">
            <div className="flex items-center gap-4 p-5">

              {/* Icon */}

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--au-brand-soft)] text-[var(--au-brand)]">
                <BookOpen
                  size={21}
                  strokeWidth={1.9}
                />
              </div>


              {/* Content */}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold leading-5 text-[var(--au-text)]">
                    Arrays
                  </h3>

                  <span className="au-badge au-badge-memory">
                    Data Structure
                  </span>
                </div>

                <p className="mt-0.5 text-xs leading-5 text-[var(--au-text-secondary)]">
                  Array traversal and memory representation
                </p>

                {/* Progress */}

                <div className="mt-2.5 flex items-center gap-2.5">
                  <div className="w-40">
                    <div className="au-progress-track">
                      <div
                        className="au-progress-value"
                        style={{ width: "42%" }}
                      />
                    </div>
                  </div>

                  <span className="font-mono text-[11px] text-[var(--au-text-muted)]">
                    42%
                  </span>
                </div>
              </div>


              {/* Button */}

              <button
                type="button"
                onClick={() => onNavigate("visualizer")}
                className="au-button au-button-secondary shrink-0"
              >
                Continue
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>


        {/* =====================================================
            RECENT + QUICK START
            ===================================================== */}

        <section className="mt-7 grid shrink-0 grid-cols-1 gap-5 xl:grid-cols-[1.35fr_1fr]">

          {/* ---------------------------------------------------
              RECENTLY OPENED
              --------------------------------------------------- */}

          <div className="au-card overflow-hidden">
            <div className="au-panel-header">
              <div>
                <h2 className="text-sm font-semibold leading-5 text-[var(--au-text)]">
                  Recently opened
                </h2>

                <p className="mt-0.5 text-xs leading-5 text-[var(--au-text-muted)]">
                  Your latest visualizations and learning sessions.
                </p>
              </div>
            </div>

            <div className="divide-y divide-[var(--au-border-subtle)]">
              {recentItems.map((item) => {
                const Icon = item.icon

                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => onNavigate("visualizer")}
                    className="group flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-[var(--au-surface-high)]"
                  >

                    {/* Icon */}

                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--au-border)] bg-[var(--au-surface-high)] ${item.color}`}
                    >
                      <Icon
                        size={17}
                        strokeWidth={1.8}
                      />
                    </div>


                    {/* Text */}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium leading-5 text-[var(--au-text)]">
                        {item.title}
                      </p>

                      <p className="text-[11px] leading-4 text-[var(--au-text-muted)]">
                        {item.type}
                      </p>
                    </div>


                    {/* Metadata */}

                    <Clock3
                      size={14}
                      className="shrink-0 text-[var(--au-text-muted)]"
                      strokeWidth={1.7}
                    />

                    <ArrowRight
                      size={14}
                      className="shrink-0 text-transparent transition-colors group-hover:text-[var(--au-text-secondary)]"
                      strokeWidth={1.7}
                    />
                  </button>
                )
              })}
            </div>
          </div>


          {/* ---------------------------------------------------
              QUICK START
              --------------------------------------------------- */}

          <div className="au-card overflow-hidden">
            <div className="au-panel-header">
              <div>
                <h2 className="text-sm font-semibold leading-5 text-[var(--au-text)]">
                  Quick start
                </h2>

                <p className="mt-0.5 text-xs leading-5 text-[var(--au-text-muted)]">
                  Jump directly into AlgoUnfold.
                </p>
              </div>
            </div>

            <div className="p-2">

              {/* Learn */}

              <button
                type="button"
                onClick={() => onNavigate("learn")}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[var(--au-surface-high)]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--au-memory-soft)] text-[var(--au-memory)]">
                  <BookOpen
                    size={17}
                    strokeWidth={1.8}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium leading-5 text-[var(--au-text)]">
                    Browse Learn
                  </p>

                  <p className="text-[11px] leading-4 text-[var(--au-text-muted)]">
                    Explore data structures and algorithms.
                  </p>
                </div>

                <ArrowRight
                  size={14}
                  className="shrink-0 text-[var(--au-text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--au-text)]"
                />
              </button>


              {/* Visualizer */}

              <button
                type="button"
                onClick={() => onNavigate("visualizer")}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[var(--au-surface-high)]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--au-algorithm-soft)] text-[var(--au-algorithm)]">
                  <SquarePlay
                    size={17}
                    strokeWidth={1.8}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium leading-5 text-[var(--au-text)]">
                    Open Visualizer
                  </p>

                  <p className="text-[11px] leading-4 text-[var(--au-text-muted)]">
                    Step through an algorithm execution.
                  </p>
                </div>

                <ArrowRight
                  size={14}
                  className="shrink-0 text-[var(--au-text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--au-text)]"
                />
              </button>


              {/* Practice */}

              <button
                type="button"
                onClick={() => onNavigate("practice")}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[var(--au-surface-high)]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--au-success-soft)] text-[var(--au-success)]">
                  <Puzzle
                    size={17}
                    strokeWidth={1.8}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium leading-5 text-[var(--au-text)]">
                    Practice
                  </p>

                  <p className="text-[11px] leading-4 text-[var(--au-text-muted)]">
                    Test what you understand.
                  </p>
                </div>

                <ArrowRight
                  size={14}
                  className="shrink-0 text-[var(--au-text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--au-text)]"
                />
              </button>

            </div>
          </div>

        </section>


        {/* =====================================================
            EXPLORE
            ===================================================== */}

        <section className="mt-7 shrink-0">

          <div className="mb-3">
            <h2 className="text-sm font-semibold leading-5 text-[var(--au-text)]">
              Explore
            </h2>

            <p className="mt-0.5 text-xs leading-5 text-[var(--au-text-muted)]">
              Choose what you want to understand next.
            </p>
          </div>


          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            {exploreItems.map((item) => {
              const Icon = item.icon

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => onNavigate(item.screen)}
                  className="group au-card au-card-interactive p-5 text-left"
                >

                  {/* Icon */}

                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg border"
                    style={{
                      color: item.color,
                      borderColor: `color-mix(in srgb, ${item.color} 28%, var(--au-border))`,
                      background: `color-mix(in srgb, ${item.color} 8%, transparent)`,
                    }}
                  >
                    <Icon
                      size={19}
                      strokeWidth={1.8}
                    />
                  </div>


                  {/* Title */}

                  <h3 className="mt-5 text-sm font-semibold leading-5 text-[var(--au-text)] pt-4">
                    {item.title}
                  </h3>


                  {/* Description */}

                  <p className="mt-1.5 text-xs leading-5 text-[var(--au-text-muted)]">
                    {item.description}
                  </p>


                  {/* Action */}

                  <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-[var(--au-text-muted)] transition-colors group-hover:text-[var(--au-text-secondary)]">
                    Explore

                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </div>

                </button>
              )
            })}

          </div>
        </section>


        {/* =====================================================
            LEARNING PRINCIPLE
            ===================================================== */}

        <section className="mt-7 mb-8 shrink-0">

          <div className="rounded-xl border border-[var(--au-border-subtle)] bg-[var(--au-surface)] p-5">

            <div className="flex items-start gap-3.5">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--au-brand-soft)] text-[var(--au-brand)]">
                <ChartColumnBig
                  size={18}
                  strokeWidth={1.8}
                />
              </div>

              <div className="min-w-0">

                <p className="text-xs font-semibold leading-5 text-[var(--au-text)]">
                  Learn by seeing what happens
                </p>

                <p className="mt-0.5 max-w-3xl text-xs leading-5 text-[var(--au-text-muted)]">
                  AlgoUnfold connects algorithm execution, code,
                  memory, state, and visualization so you can understand
                  not only what an algorithm does, but why it does it.
                </p>

              </div>

            </div>

          </div>

        </section>

      </div>
    </div>
  )
}

export default Home