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
      className={`inline-block mr-[0.6em] text-[1.45rem] leading-loose tracking-wide ${!isActive && !isCompleted ? "text-muted-foreground/40" : ""
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

        return (
          <span
            key={charIndex}
            className="relative"
            data-word={wordIndex}
            data-char={charIndex}
          >
            <span className={`transition-colors duration-75 ${colorClass}`}>
              {char}
            </span>
          </span>
        )
      })}

      {isCurrent &&
        typed.slice(chars.length).map((extraChar, i) => (
          <span
            key={`extra-${i}`}
            className="relative"
            data-word={wordIndex}
            data-char={chars.length + i}
          >
            <span className="text-destructive/60">{extraChar}</span>
          </span>
        ))}

      {isCurrent && currentCharIndex >= chars.length && currentCharIndex === typed.length && (
        <span
          className="relative inline-block w-0"
          data-word={wordIndex}
          data-char={currentCharIndex}
        >
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
