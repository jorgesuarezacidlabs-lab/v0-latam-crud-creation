import { Calendar } from "lucide-react"
import { FlightList } from "@/components/flight-list"
import { getFlights } from "@/app/actions"

export const dynamic = "force-dynamic"

export default async function FlightsPage() {
  const flights = await getFlights()

  return (
    <div>
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Calendar className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestión de Vuelos</h1>
            <p className="text-sm text-muted-foreground">Administración de vuelos programados</p>
          </div>
        </div>
      </header>

      <FlightList flights={flights} />
    </div>
  )
}
