import type { TopicDefinition } from "./topicTypes"

// Vite discovers every topic file in this folder at build time.
// To add a topic, create a .tsx file and export `topicDefinition` from it.
const modules = import.meta.glob<{ topicDefinition: TopicDefinition }>("./topics/*.tsx", {
  eager: true,
})

const definitions = Object.values(modules)
  .map((module) => module.topicDefinition)
  .filter(Boolean)

export const topicRegistry: Record<string, TopicDefinition> = Object.fromEntries(
  definitions.map((definition) => [definition.title, definition]),
)

export function getTopicDefinition(title: string): TopicDefinition | undefined {
  return topicRegistry[title]
}

export function getRegisteredTopics(): TopicDefinition[] {
  return definitions
}
