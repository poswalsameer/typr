"use client"

import { useEffect } from "react"
import { useAtomValue } from "jotai"
import { selectedThemeAtom, selectedFontAtom } from "@/store"
import { THEMES, FONTS } from "@/lib/constants"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const selectedTheme = useAtomValue(selectedThemeAtom)
  const selectedFont = useAtomValue(selectedFontAtom)

  useEffect(() => {
    const theme = THEMES.find((t) => t.id === selectedTheme)
    if (!theme) return

    // Helper function to darken a color slightly
    const darkenColor = (hex: string, percent: number) => {
      const num = parseInt(hex.replace("#", ""), 16)
      const amt = Math.round(2.55 * percent)
      const R = (num >> 16) - amt
      const G = ((num >> 8) & 0x00ff) - amt
      const B = (num & 0x0000ff) - amt
      return (
        "#" +
        (
          0x1000000 +
          (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
          (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
          (B < 255 ? (B < 1 ? 0 : B) : 255)
        )
          .toString(16)
          .slice(1)
      )
    }

    // Apply theme colors to CSS variables
    // Background: Use secondary (darkest color)
    document.documentElement.style.setProperty("--background", theme.colors.secondary)

    // Card backgrounds: Slightly lighter than background
    const cardColor = darkenColor(theme.colors.secondary, -5)
    document.documentElement.style.setProperty("--card", cardColor)
    document.documentElement.style.setProperty("--card-elevated", cardColor)
    document.documentElement.style.setProperty("--popover", cardColor)

    // Primary/Accent colors
    document.documentElement.style.setProperty("--primary", theme.colors.primary)
    document.documentElement.style.setProperty("--accent-active", theme.colors.primary)
    document.documentElement.style.setProperty("--ring", theme.colors.primary)

    // Text colors
    document.documentElement.style.setProperty("--foreground", theme.colors.text)
    document.documentElement.style.setProperty("--card-foreground", theme.colors.text)
    document.documentElement.style.setProperty("--popover-foreground", theme.colors.text)

    // Muted text: Slightly dimmed version of main text
    const mutedText = theme.colors.text + "99" // Add alpha for transparency
    document.documentElement.style.setProperty("--muted-foreground", mutedText)

    // Border color: Between background and text
    const borderColor = theme.colors.text + "33" // More transparent
    document.documentElement.style.setProperty("--border", borderColor)
    document.documentElement.style.setProperty("--input", borderColor)
  }, [selectedTheme])

  useEffect(() => {
    const font = FONTS.find((f) => f.id === selectedFont)
    if (!font) return

    // Apply font family to body
    document.body.style.fontFamily = font.family
  }, [selectedFont])

  return <>{children}</>
}
