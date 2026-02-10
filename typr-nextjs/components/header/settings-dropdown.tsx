"use client"

import { useState } from "react"
import { useAtom } from "jotai"
import { Settings } from "lucide-react"
import { selectedThemeAtom, selectedFontAtom } from "@/store/atoms"
import { THEMES, FONTS } from "@/lib/constants"
import type { ThemeId, FontId } from "@/types"

export function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"themes" | "fonts">("themes")
  const [selectedTheme, setSelectedTheme] = useAtom(selectedThemeAtom)
  const [selectedFont, setSelectedFont] = useAtom(selectedFontAtom)

  const handleThemeChange = (themeId: ThemeId) => {
    setSelectedTheme(themeId)
  }

  const handleFontChange = (fontId: FontId) => {
    setSelectedFont(fontId)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-card-elevated transition-colors"
        aria-label="Settings"
      >
        <Settings className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-card-elevated rounded-xl shadow-lg border border-border z-50 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab("themes")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === "themes"
                    ? "text-primary bg-card"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Themes
              </button>
              <button
                onClick={() => setActiveTab("fonts")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === "fonts"
                    ? "text-primary bg-card"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Fonts
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {activeTab === "themes" && (
                <div className="space-y-3">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme.id)}
                      className={`w-full p-3 rounded-lg border-2 transition-all hover:scale-[1.02] ${selectedTheme === theme.id
                          ? "border-primary bg-card"
                          : "border-border hover:border-muted-foreground"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">
                          {theme.name}
                        </span>
                        {selectedTheme === theme.id && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <div
                          className="w-8 h-8 rounded border border-border"
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                        <div
                          className="w-8 h-8 rounded border border-border"
                          style={{ backgroundColor: theme.colors.secondary }}
                        />
                        <div
                          className="w-8 h-8 rounded border border-border"
                          style={{ backgroundColor: theme.colors.text }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {activeTab === "fonts" && (
                <div className="space-y-3">
                  {FONTS.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => handleFontChange(font.id)}
                      className={`w-full p-3 rounded-lg border-2 transition-all hover:scale-[1.02] ${selectedFont === font.id
                          ? "border-primary bg-card"
                          : "border-border hover:border-muted-foreground"
                        }`}
                      style={{ fontFamily: font.family }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <div className="font-medium text-foreground mb-1">
                            {font.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            The quick brown fox
                          </div>
                        </div>
                        {selectedFont === font.id && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
