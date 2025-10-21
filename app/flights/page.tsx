import { getFlights } from "@/app/actions"
import { FlightList } from "@/components/flight-list"

export default async function FlightsPage() {
  const flights = await getFlights()

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vuelos</h1>
          <p className="text-muted-foreground">
            Gestiona los vuelos de la aerolínea
          </p>
        </div>
        
        <FlightList flights={flights} />
      </div>
    </div>
  )
}
