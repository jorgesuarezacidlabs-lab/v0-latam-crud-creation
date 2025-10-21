import { AirplaneList } from "@/components/airplane-list"
import { Plane, AlertCircle } from "lucide-react"
import { getAirplanes } from "../actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Suspense } from "react"
import { Card } from "@/components/ui/card"

export const dynamic = "force-dynamic"

async function AirplanesContent() {
  try {
    const airplanes = await getAirplanes()
    return <AirplaneList airplanes={airplanes} />
  } catch (error) {
    console.error("[v0] Error loading airplanes:", error)
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error de conexión</AlertTitle>
        <AlertDescription>
          No se pudieron cargar las aeronaves. Por favor, verifica tu conexión a internet y recarga la página.
        </AlertDescription>
      </Alert>
    )
  }
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        <div className="h-10 w-40 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <div className="h-6 w-24 animate-pulse rounded bg-muted" />
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="space-y-2 border-t border-border pt-4">
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default async function Home() {
  return (
    <div>
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Plane className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestión de Flota</h1>
            <p className="text-sm text-muted-foreground">Sistema de administración de aeronaves LATAM</p>
          </div>
        </div>
      </header>

      <Suspense fallback={<LoadingSkeleton />}>
        <AirplanesContent />
      </Suspense>
    </div>
  )
}
