import type { Theme, Font } from "@/types"

export const THEMES: Theme[] = [
  {
    id: "ocean",
    name: "Ocean",
    colors: {
      primary: "#007ACC",
      secondary: "#4D4D4D",
      text: "#D4D4D4",
    },
  },
  {
    id: "lavender",
    name: "Lavender",
    colors: {
      primary: "#CBA6F7",
      secondary: "#7F849C",
      text: "#CDD6F4",
    },
  },
  {
    id: "forest",
    name: "Forest",
    colors: {
      primary: "#66AC92",
      secondary: "#015C53",
      text: "#DCEAE5",
    },
  },
]

export const FONTS: Font[] = [
  {
    id: "geist-mono",
    name: "Geist Mono",
    family: "var(--font-geist-mono)",
  },
  {
    id: "geist-sans",
    name: "Geist Sans",
    family: "var(--font-geist-sans)",
  },
  {
    id: "monaco",
    name: "Monaco",
    family: "Monaco, 'Courier New', monospace",
  },
]
