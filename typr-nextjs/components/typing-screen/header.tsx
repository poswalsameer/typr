export function Header() {
  return (
    <header className="flex items-center font-mono justify-between w-full max-w-4xl mx-auto py-6 px-4">
      <div className="flex items-center gap-2">
        <span className="text-4xl font-semibold tracking-tight text-primary select-none">
          typr
        </span>
        <span className="text-sm text-muted-foreground font-medium">(No bs, only wpm)</span>
      </div>
    </header>
  )
}
