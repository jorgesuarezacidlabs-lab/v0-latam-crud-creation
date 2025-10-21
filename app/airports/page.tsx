import { getAirports } from "@/app/actions"
import { AirportList } from "@/components/airport-list"

export default async function AirportsPage() {
  const airports = await getAirports()

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aeropuertos</h1>
          <p className="text-muted-foreground">
            Gestiona la información de los aeropuertos
          </p>
        </div>
        
        <AirportList airports={airports} />
      </div>
    </div>
  )
}
