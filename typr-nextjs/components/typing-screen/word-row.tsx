"use client"

import React from "react"

interface WordRowProps {
  word: string
  wordIndex: number
  currentWordIndex: number
  currentCharIndex: number
  typedChars: string
  isActive: boolean
}

export const WordRow = React.memo(function WordRow({
  word,
  wordIndex,
  currentWordIndex,
  currentCharIndex,
  typedChars,
  isActive,
}: WordRowProps) {
  const chars = word.split("")
  const typed = typedChars.split("")
  const isCompleted = wordIndex < currentWordIndex
  const isCurrent = wordIndex === currentWordIndex

  return (
    <span
      className={`inline-block mr-[0.6em] text-[1.45rem] leading-loose font-mono tracking-wide ${!isActive && !isCompleted ? "text-muted-foreground/40" : ""
        }`}
      data-word-index={wordIndex}
    >
      {chars.map((char, charIndex) => {
        let colorClass = "text-muted-foreground/40"

        if (isCompleted || (isCurrent && charIndex < typed.length)) {
          const typedChar = isCompleted
            ? typedChars[charIndex]
            : typed[charIndex]

          if (typedChar === char) {
            colorClass = "text-foreground"
          } else {
            colorClass = "text-destructive"
          }
        }

        const showCaret =
          isCurrent && charIndex === currentCharIndex

        return (
          <span key={charIndex} className="relative">
            {showCaret && (
              <span className="absolute -left-px top-[0.15em] w-[2px] h-[1.2em] bg-accent-active animate-caret" />
            )}
            <span className={`transition-colors duration-75 ${colorClass}`}>
              {char}
            </span>
          </span>
        )
      })}

      {isCurrent &&
        typed.slice(chars.length).map((extraChar, i) => (
          <span key={`extra-${i}`} className="relative">
            <span className="text-destructive/60">{extraChar}</span>
          </span>
        ))}

      {isCurrent && currentCharIndex >= chars.length && currentCharIndex === typed.length && (
        <span className="relative">
          <span className="absolute -left-px top-[0.15em] w-[2px] h-[1.2em] bg-accent-active animate-caret" />
        </span>
      )}

      {isCompleted &&
        typed.slice(chars.length).map((extraChar, i) => (
          <span key={`extra-done-${i}`} className="text-destructive/40">
            {extraChar}
          </span>
        ))}
    </span>
  )
})
