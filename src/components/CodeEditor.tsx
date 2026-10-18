import { useEffect, useMemo, useRef, useState } from "react"
import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror"
import { cpp } from "@codemirror/lang-cpp"
import { EditorState, StateEffect, StateField } from "@codemirror/state"
import {
  Decoration,
  EditorView,
  type DecorationSet,
  lineNumbers,
  highlightActiveLineGutter,
} from "@codemirror/view"
import { SiCplusplus } from "react-icons/si"
import Icon from "./Icon"

// A CodeMirror decoration highlights the C++ source line associated with a step.
const setStepLine = StateEffect.define<number | null>()
const stepLineMark = Decoration.line({ class: "cm-algounfold-step-line" })
const stepLineField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(decorations, transaction) {
    for (const effect of transaction.effects) {
      if (effect.is(setStepLine)) {
        const lineNumber = effect.value
        if (
          !lineNumber ||
          lineNumber < 1 ||
          lineNumber > transaction.state.doc.lines
        ) {
          return Decoration.none
        }
        const line = transaction.state.doc.line(lineNumber)
        return Decoration.set([stepLineMark.range(line.from)])
      }
    }
    return transaction.docChanged
      ? decorations.map(transaction.changes)
      : decorations
  },
  provide: (field) => EditorView.decorations.from(field),
})

const editorTheme = EditorView.theme(
  {
    "&": {
      height: "100%",
      minHeight: "0",
      backgroundColor: "#030a17",
      color: "#d9e5f7",
    },
    ".cm-scroller": {
      overflow: "auto",
      fontFamily: '"Cascadia Code", "Fira Code", Consolas, monospace',
      fontSize: "12px",
      lineHeight: "1.8",
    },
    ".cm-content": { padding: "14px 0 24px" },
    ".cm-gutters": {
      backgroundColor: "#030a17",
      color: "#536783",
      borderRight: "1px solid #1c2b42",
    },
    ".cm-lineNumbers .cm-gutterElement": { padding: "0 12px 0 8px" },
    ".cm-activeLineGutter": { backgroundColor: "#12243a", color: "#9bb7d8" },
    ".cm-cursor": { borderLeftColor: "transparent" },
    ".cm-selectionBackground": { backgroundColor: "transparent !important" },
    ".cm-focused": { outline: "none" },
    ".cm-algounfold-step-line": { backgroundColor: "#17365b" },
    ".cm-algounfold-step-line span": { color: "#f0f6ff" },
  },
  { dark: true }
)

export default function CodeEditor({
  code,
  activeLine,
}: {
  code: string
  activeLine: number | null
}) {
  const [copied, setCopied] = useState(false)
  const editorRef = useRef<ReactCodeMirrorRef>(null)
  const lineCount = code.split("\n").length
  const extensions = useMemo(
    () => [
      cpp(),
      lineNumbers(),
      highlightActiveLineGutter(),
      stepLineField,
      editorTheme,
      EditorState.readOnly.of(true),
      EditorView.editable.of(false),
    ],
    []
  )

  // Keep the editor mounted while changing the selected teaching step.
  useEffect(() => {
    const view = editorRef.current?.view
    if (!view) return
    view.dispatch({ effects: setStepLine.of(activeLine) })
    if (activeLine && activeLine > 0 && activeLine <= view.state.doc.lines) {
      const line = view.state.doc.line(activeLine)
      view.dispatch({
        selection: { anchor: line.from },
        effects: EditorView.scrollIntoView(line.from, { y: "center" }),
      })
    }
  }, [activeLine, code])

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="static-code-shell codemirror-shell">
      <div className="editor-tabbar">
        <div className="file-tab">
          <span className="language-logo cpp">
            <SiCplusplus size={17} aria-hidden="true" />
          </span>
          <span>main.cpp</span>
          <span className="language-label">C++</span>
        </div>
        <div className="editor-actions">
          <button
            className="copy-button"
            onClick={copyCode}
            title="Copy source code"
            type="button"
          >
            <Icon name={copied ? "check" : "copy"} size={15} />
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>
      <div className="codemirror-body" aria-label="Read-only C++ source code">
        <CodeMirror
          ref={editorRef}
          value={code}
          height="100%"
          theme="dark"
          extensions={extensions}
          editable={false}
          basicSetup={false}
          onCreateEditor={(view) => {
            if (activeLine)
              view.dispatch({ effects: setStepLine.of(activeLine) })
          }}
        />
      </div>
      <footer className="editor-statusbar" aria-label="Editor status">
        <div className="editor-statusbar__left">
          <span className="editor-statusbar__language">
            <SiCplusplus size={13} aria-hidden="true" />
            <span>C++</span>
          </span>
          <span className="editor-statusbar__readonly">
            <Icon name="lock" size={12} />
            <span>Read-only</span>
          </span>
        </div>
        <div className="editor-statusbar__right">
          <span>{lineCount} lines</span>
          <span>UTF-8</span>
        </div>
      </footer>
    </div>
  )
}
