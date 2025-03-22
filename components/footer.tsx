export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 text-center text-muted-foreground text-sm z-10">
      <div className="container">
        <p>© {new Date().getFullYear()} Drbaph All Rights Reserved</p>
      </div>
    </footer>
  )
}

