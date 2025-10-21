import { AirplaneList } from "@/components/airplane-list"
import { Plane, AlertCircle, MapPin, Users, Wrench, Route, Building2 } from "lucide-react"
import { getAirplanes } from "../actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Suspense } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Sistema de Gestión Aérea</h1>
            <p className="text-sm text-muted-foreground">Plataforma integral de administración LATAM</p>
          </div>
        </div>
      </header>

      {/* Navigation Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/flights">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Plane className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Vuelos</h3>
                <p className="text-sm text-muted-foreground">Gestionar vuelos</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/pilots">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Pilotos</h3>
                <p className="text-sm text-muted-foreground">Gestionar pilotos</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/maintenance">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                <Wrench className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Mantenimiento</h3>
                <p className="text-sm text-muted-foreground">Registros de mantenimiento</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/routes">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <Route className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Rutas</h3>
                <p className="text-sm text-muted-foreground">Rutas y mapas</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/airports">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                <Building2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold">Aeropuertos</h3>
                <p className="text-sm text-muted-foreground">Gestionar aeropuertos</p>
              </div>
            </div>
          </Card>
        </Link>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Plane className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Aeronaves</h3>
              <p className="text-sm text-muted-foreground">Gestionar flota</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Aeronaves Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Aeronaves</h2>
          <Button asChild>
            <Link href="/flights">Ver todos los módulos</Link>
          </Button>
        </div>
        
        <Suspense fallback={<LoadingSkeleton />}>
          <AirplanesContent />
        </Suspense>
      </div>
    </div>
  )
}
