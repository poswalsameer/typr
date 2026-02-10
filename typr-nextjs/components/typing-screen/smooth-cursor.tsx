"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

interface SmoothCursorProps {
  currentWordIndex: number
  currentCharIndex: number
  containerRef: React.RefObject<HTMLDivElement | null>
}

export function SmoothCursor({
  currentWordIndex,
  currentCharIndex,
  containerRef,
}: SmoothCursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(true)
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Find the current character element
    const selector = `[data-word="${currentWordIndex}"][data-char="${currentCharIndex}"]`
    const charElement = containerRef.current.querySelector(selector) as HTMLElement

    if (charElement) {
      const containerRect = containerRef.current.getBoundingClientRect()

      // Get the parent word element for consistent baseline
      const wordElement = containerRef.current.querySelector(
        `[data-word-index="${currentWordIndex}"]`
      ) as HTMLElement

      if (wordElement) {
        const charRect = charElement.getBoundingClientRect()
        const wordRect = wordElement.getBoundingClientRect()

        // Calculate position relative to container
        const x = charRect.left - containerRect.left
        // Use word's top position for consistent baseline
        const y = wordRect.top - containerRect.top

        setPosition({ x, y })
        setIsVisible(true)
      }
    } else {
      setIsVisible(false)
    }
  }, [currentWordIndex, currentCharIndex, containerRef])

  if (!isVisible) return null

  return (
    <motion.div
      ref={cursorRef}
      className="absolute w-[2px] bg-accent-active pointer-events-none animate-caret"
      style={{
        height: "1.75rem", // Slightly taller to account for line-height
        top: "0.5rem", // Small offset from word top
      }}
      animate={{
        x: position.x - 1,
        y: position.y,
      }}
      transition={{
        type: "spring",
        stiffness: 800,
        damping: 35,
        mass: 0.5,
      }}
    />
  )
}
