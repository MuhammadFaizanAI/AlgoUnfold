// import { useMemo, useState } from "react"
// import { ArrowLeft, Search } from "lucide-react"

// import LearningMap from "../learning/LearningMap"
// import Lesson from "../learning/Lesson"

// import {
//   curriculum,
//   type LearningTopic,
// } from "../learning/carriculum"

// import type { AppScreen } from "../components/shell/NavigationRail"

// interface LearnProps {
//   onNavigate?: (screen: AppScreen) => void
// }

// function Learn({ onNavigate }: LearnProps) {
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedTopic, setSelectedTopic] =
//     useState<LearningTopic | null>(null)

//   const [lessonOpen, setLessonOpen] = useState(false)

//   const filteredCurriculum = useMemo(() => {
//     const query = searchQuery.trim().toLowerCase()

//     if (!query) {
//       return curriculum
//     }

//     return curriculum
//       .map((unit) => {
//         const matchingTopics = unit.topics.filter(
//           (topic) =>
//             topic.title.toLowerCase().includes(query) ||
//             topic.description.toLowerCase().includes(query),
//         )

//         if (
//           unit.title.toLowerCase().includes(query) ||
//           unit.description.toLowerCase().includes(query)
//         ) {
//           return unit
//         }

//         if (matchingTopics.length > 0) {
//           return {
//             ...unit,
//             topics: matchingTopics,
//           }
//         }

//         return null
//       })
//       .filter(
//         (unit): unit is NonNullable<typeof unit> =>
//           unit !== null,
//       )
//   }, [searchQuery])

//   const handleTopicSelect = (topic: LearningTopic) => {
//     setSelectedTopic(topic)

//     /*
//      * For now, only the first lesson exists.
//      *
//      * Later this should be replaced with a lesson registry:
//      *
//      * const lesson = lessonRegistry[topic.id]
//      *
//      * This allows every curriculum topic to open
//      * its own lesson without adding if-statements here.
//      */
//     if (topic.id === "introduction-to-dsa") {
//       setLessonOpen(true)
//     }
//   }

//   const handleBackToMap = () => {
//     setLessonOpen(false)
//     setSelectedTopic(null)
//   }

//   /*
//    * ---------------------------------------------------------
//    * LESSON VIEW
//    * ---------------------------------------------------------
//    */

//   if (lessonOpen && selectedTopic) {
//     return (
//       <Lesson
//         onBack={handleBackToMap}
//       />
//     )
//   }

//   /*
//    * ---------------------------------------------------------
//    * LEARN / CURRICULUM MAP VIEW
//    * ---------------------------------------------------------
//    */

//   return (
//     <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[var(--au-background)]">
//       {/* -------------------------------------------------- */}
//       {/* Header                                             */}
//       {/* -------------------------------------------------- */}

//       <header className="shrink-0 border-b border-[var(--au-border)] bg-[var(--au-background)]">
//         <div className="flex h-[72px] items-center justify-between gap-6 px-6">
//           {/* Left side */}

//           <div className="min-w-0">
//             <div className="flex items-center gap-3">
//               {selectedTopic && (
//                 <button
//                   type="button"
//                   onClick={handleBackToMap}
//                   className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--au-text-muted)] transition-colors hover:bg-[var(--au-surface-high)] hover:text-[var(--au-text)]"
//                   aria-label="Back to curriculum"
//                   title="Back to curriculum"
//                 >
//                   <ArrowLeft
//                     size={16}
//                     strokeWidth={1.8}
//                   />
//                 </button>
//               )}

//               <div className="min-w-0">
//                 <h1 className="truncate text-lg font-semibold tracking-tight text-[var(--au-text)]">
//                   Learn
//                 </h1>

//                 <p className="mt-0.5 truncate text-xs text-[var(--au-text-muted)]">
//                   Follow the path from foundations to advanced algorithms.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Search */}

//           <div className="relative w-[280px] shrink-0">
//             <Search
//               size={15}
//               strokeWidth={1.8}
//               className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--au-text-muted)]"
//             />

//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(event) =>
//                 setSearchQuery(event.target.value)
//               }
//               placeholder="Search topics..."
//               className="h-9 w-full rounded-lg border border-[var(--au-border)] bg-[var(--au-surface)] pl-9 pr-3 text-xs text-[var(--au-text)] outline-none placeholder:text-[var(--au-text-disabled)] transition-colors focus:border-[var(--au-brand)]"
//             />
//           </div>
//         </div>
//       </header>

//       {/* -------------------------------------------------- */}
//       {/* Main learning area                                 */}
//       {/* -------------------------------------------------- */}

//       <main className="min-h-0 flex-1 overflow-hidden">
//         {filteredCurriculum.length > 0 ? (
//           <LearningMap
//             units={filteredCurriculum}
//             onTopicSelect={handleTopicSelect}
//           />
//         ) : (
//           <div className="flex h-full items-center justify-center px-6">
//             <div className="max-w-md text-center">
//               <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--au-border)] bg-[var(--au-surface)]">
//                 <Search
//                   size={20}
//                   strokeWidth={1.7}
//                   className="text-[var(--au-text-muted)]"
//                 />
//               </div>

//               <h2 className="mt-4 text-base font-semibold text-[var(--au-text)]">
//                 No topics found
//               </h2>

//               <p className="mt-2 text-sm leading-6 text-[var(--au-text-muted)]">
//                 Try a different search term or clear the search
//                 to explore the complete curriculum.
//               </p>

//               <button
//                 type="button"
//                 onClick={() => setSearchQuery("")}
//                 className="mt-5 rounded-lg bg-[var(--au-brand)] px-4 py-2 text-xs font-semibold text-[var(--au-text-inverse)] transition-colors hover:bg-[var(--au-brand-hover)]"
//               >
//                 Clear Search
//               </button>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   )
// }

// export default Learn