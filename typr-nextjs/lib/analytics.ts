export function calculateWPM(
  correctChars: number,
  timeInSeconds: number
): number {
  if (timeInSeconds <= 0) return 0
  const timeInMinutes = timeInSeconds / 60
  return Math.round((correctChars / 5) / timeInMinutes)
}

export function calculateRawWPM(
  totalChars: number,
  timeInSeconds: number
): number {
  if (timeInSeconds <= 0) return 0
  const timeInMinutes = timeInSeconds / 60
  return Math.round((totalChars / 5) / timeInMinutes)
}

export function calculateAccuracy(
  correctChars: number,
  totalChars: number
): number {
  if (totalChars <= 0) return 100
  return Math.round((correctChars / totalChars) * 100)
}
