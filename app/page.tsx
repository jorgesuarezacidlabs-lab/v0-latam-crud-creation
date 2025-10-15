import { AirplaneList } from "@/components/airplane-list"
import { Plane } from "lucide-react"
import { getAirplanes } from "./actions"

export default async function Home() {
  const airplanes = await getAirplanes()

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Plane className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestión de Flota</h1>
            <p className="text-sm text-muted-foreground">Sistema de administración de aeronaves LATAM</p>
          </div>
        </header>

        <AirplaneList airplanes={airplanes} />
      </div>
    </main>
  )
}
