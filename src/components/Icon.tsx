import type { ReactNode, SVGProps } from "react"
export type IconName =
  | "menu"
  | "close"
  | "minimize"
  | "maximize"
  | "restore"
  | "copy"
  | "check"
  | "code"
  | "layers"
  | "reset"
  | "previous"
  | "next"
  | "columns"
  | "panel"
  | "grip"
  | "chevron"
  | "chevron-down"
  | "lock"
  | "refresh"
  | "settings"
  | "sidebar-open"
  | "sidebar-close"
  | "window-maximize"
  | "array"
  | "link"
  | "stack"
  | "sort"
  | "tree"
  | "graph"
  | "download-cloud"
  | "info"
  | "search"
const paths: Record<IconName, ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  minimize: <path d="M5 12h14" />,
  maximize: (
    <>
      <path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4" />
      <path d="m4 4 6 6m10-6-6 6M4 20l6-6m10 6-6-6" />
    </>
  ),
  restore: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 9h6v6H9z" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  code: (
    <>
      <path d="m8 8-4 4 4 4m8-8 4 4-4 4m-5-11-2 14" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5" />
    </>
  ),
  reset: (
    <>
      <path d="M3 11a9 9 0 1 1 2.6 6.4" />
      <path d="M3 4v7h7" />
    </>
  ),
  previous: <path d="m15 18-6-6 6-6" />,
  next: <path d="m9 18 6-6-6-6" />,
  columns: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M12 4v16" />
    </>
  ),
  panel: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
    </>
  ),
  "sidebar-close": (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16m-3 6 2 2-2 2" />
    </>
  ),
  "sidebar-open": (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16m-3 6-2 2 2 2" />
    </>
  ),
  "window-maximize": <rect x="5" y="5" width="14" height="14" rx="1.5" />,
  array: (
    <>
      <rect x="2" y="7" width="6" height="10" rx="1" />
      <rect x="9" y="7" width="6" height="10" rx="1" />
      <rect x="16" y="7" width="6" height="10" rx="1" />
    </>
  ),
  link: (
    <>
      <rect x="2" y="8" width="7" height="8" rx="2" />
      <rect x="15" y="8" width="7" height="8" rx="2" />
      <path d="M9 12h6" />
    </>
  ),
  stack: (
    <>
      <path d="m3 8 9-5 9 5-9 5-9-5Zm0 5 9 5 9-5m-18 5 9 5 9-5" />
    </>
  ),
  sort: <path d="M5 20V10m5 10V4m5 16v-7m5 7V7" />,
  tree: (
    <>
      <path d="M12 21v-7m0 0L5 7m7 7 7-7M5 7V3m0 4H2m17 0V3m0 4h3" />
    </>
  ),
  graph: (
    <>
      <circle cx="5" cy="5" r="2" />
      <circle cx="19" cy="6" r="2" />
      <circle cx="9" cy="19" r="2" />
      <circle cx="19" cy="18" r="2" />
      <path d="m7 6 10 0M6 7l2 10m3 1 6-1m1-9 1 8" />
    </>
  ),
  grip: (
    <>
      <path
        d="M9 7h.01M15 7h.01M9 12h.01M15 12h.01M9 17h.01M15 17h.01"
        strokeWidth="3"
      />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  lock: (
    <>
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  "download-cloud": (
    <>
      <path d="M12 3v12m-4-4 4 4 4-4" />
      <path d="M4 17v3h16v-3" />
      <path d="M5 8a5 5 0 0 1 9-3 5 5 0 0 1 6 7" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 7v5h-5M4 17v-5h5" />
      <path d="M5.7 9a7 7 0 0 1 12.1-2L20 12M4 12l2.2 5a7 7 0 0 0 12.1-2" />
    </>
  ),
  settings: (
    <>
      <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
      <path
        d="m19.4 15 1.1 1.9-2.2 2.2-1.9-1.1a8 8 0 0 1-2.4 1v2.1h-3.1V19a8 8 0 0 1-2.4-1l-1.9 1.1-2.2-2.2L5.5 15a8 8 0 0 1-1-2.4H2.4V9.5h2.1a8 8 0 0 1 1-2.4L4.4 5.2 6.6 3l1.9 1.1a8 8 0 0 1 2.4-1V1h3.1v2.1a8 8 0 0 1 2.4 1L18.3 3l2.2 2.2-1.1 1.9a8 8 0 0 1 1 2.4h2.1v3.1h-2.1a8 8 0 0 1-1 2.4Z"
        transform="translate(0 1) scale(.95)"
      />
    </>
  ),
}
export default function Icon({
  name,
  size = 16,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  )
}
