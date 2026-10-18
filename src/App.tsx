import { useState } from "react"
import TitleBar from "./components/TitleBar"
import TopicSelector from "./components/TopicSelector"
import Workspace from "./components/Workspace"
import { allTopics } from "./data/topics"
import { getRegisteredTopics } from "./visualizations/topicRegistry"

const firstTopic = getRegisteredTopics()[0]?.title ?? allTopics[0]

export default function App() {
  const [topic, setTopic] = useState(firstTopic)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div className="app">
      <TitleBar onMenu={() => setSidebarOpen((value) => !value)} />
      <div className="app-body">
        <TopicSelector
          active={topic}
          onSelect={setTopic}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <Workspace topic={topic} />
      </div>
    </div>
  )
}
