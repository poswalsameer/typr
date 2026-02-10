import type { Theme, Font } from "@/types"

export const THEMES: Theme[] = [
  {
    id: "ocean",
    name: "Ocean",
    colors: {
      primary: "#007ACC",      // Bright blue - accent/primary
      secondary: "#1E1E1E",    // Dark background
      text: "#D4D4D4",         // Light gray - text
    },
  },
  {
    id: "lavender",
    name: "Lavender",
    colors: {
      primary: "#CBA6F7",      // Lavender - accent/primary
      secondary: "#1E1E2E",    // Dark purple background
      text: "#CDD6F4",         // Light purple - text
    },
  },
  {
    id: "forest",
    name: "Forest",
    colors: {
      primary: "#66AC92",      // Teal - accent/primary
      secondary: "#0B1E1A",    // Dark teal background
      text: "#DCEAE5",         // Light mint - text
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
