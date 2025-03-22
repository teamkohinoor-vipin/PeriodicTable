import { Loader2 } from "lucide-react"

interface LoadingOverlayProps {
  status?: string
}

export function LoadingOverlay({ status = "Loading..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="mt-4 text-lg font-medium">{status}</p>
      <p className="mt-2 text-sm text-muted-foreground">This may take a few moments</p>
    </div>
  )
}

