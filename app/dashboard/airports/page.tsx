import { Building2 } from "lucide-react"
import { AirportList } from "@/components/airport-list"
import { getAirports } from "@/app/actions"

export const dynamic = "force-dynamic"

export default async function AirportsPage() {
  const airports = await getAirports()

  return (
    <div>
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestión de Aeropuertos</h1>
            <p className="text-sm text-muted-foreground">Administración de aeropuertos y terminales</p>
          </div>
        </div>
      </header>

      <AirportList airports={airports} />
    </div>
  )
}
