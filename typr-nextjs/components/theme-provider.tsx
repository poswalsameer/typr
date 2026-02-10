"use client"

import { useEffect } from "react"
import { useAtomValue } from "jotai"
import { selectedThemeAtom, selectedFontAtom } from "@/store/atoms"
import { THEMES, FONTS } from "@/lib/constants"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const selectedTheme = useAtomValue(selectedThemeAtom)
  const selectedFont = useAtomValue(selectedFontAtom)

  useEffect(() => {
    const theme = THEMES.find((t) => t.id === selectedTheme)
    if (!theme) return

    // Apply theme colors to CSS variables
    document.documentElement.style.setProperty("--accent-active", theme.colors.primary)
    document.documentElement.style.setProperty("--primary", theme.colors.primary)
    document.documentElement.style.setProperty("--ring", theme.colors.primary)
    document.documentElement.style.setProperty("--muted-foreground", theme.colors.secondary)
    document.documentElement.style.setProperty("--foreground", theme.colors.text)
  }, [selectedTheme])

  useEffect(() => {
    const font = FONTS.find((f) => f.id === selectedFont)
    if (!font) return

    // Apply font family to body
    document.body.style.fontFamily = font.family
  }, [selectedFont])

  return <>{children}</>
}
