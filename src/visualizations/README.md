# Adding a visualization to AlgoUnfold

This starter intentionally has no `src/engine` folder. Each topic is self-contained: it owns its C++ source, teaching steps, SVG, and GSAP animation.

## Add a topic in three steps

1. Create `src/visualizations/topics/yourTopic.tsx`.
2. Export a `topicDefinition` object from that file. Copy `creatingArray.tsx` as the starter example and change its `id`, `title`, `category`, `code`, `steps`, and `Component`.
3. Run the app. Vite's `import.meta.glob` discovers the file automatically. If its `category` matches an existing topic group, the topic appears automatically under **New visualizations** in the topic selector. No manual registry entry is required.

The topic selector is `src/components/TopicSelector.tsx`. The dynamic registry is `src/visualizations/topicRegistry.ts`. Shared contracts live in `src/visualizations/topicTypes.ts`. The common responsive workspace and playback buttons live in `src/components/Workspace.tsx`.

## Topic contract

Every file exports:

- `id`: stable machine-readable identifier.
- `title`: label displayed in the topic selector; must be unique.
- `category`: an existing group such as `Arrays`, `Linked Lists`, `Stacks`, `Queues`, `Recursion`, `Sorting`, `Trees`, or `Graphs`.
- `code`: C++ source shown in the read-only CodeMirror panel.
- `steps`: ordered teaching frames. Each has `codeLine`, `message`, `explanation`, and topic-owned `state`.
- `Component`: React component that renders the current frame using SVG and can use GSAP to animate changes.

The global Next / Previous / Reset controls select a frame. The topic component reads the frame and animates its visual transition. Keep data/state updates deterministic so Previous and Reset always show the correct picture.

## Install dependencies

The uploaded archive contains `src/` only, so keep your existing project-level `package.json`, Vite config and `index.html`. In the project root run:

```bash
npm install gsap @uiw/react-codemirror @codemirror/lang-cpp @codemirror/state @codemirror/view react-icons
```

React and React DOM should already be installed in your Vite project.
