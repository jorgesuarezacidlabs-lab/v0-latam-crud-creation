import { Users } from "lucide-react"
import { PilotList } from "@/components/pilot-list"
import { getPilots } from "@/app/actions"

export const dynamic = "force-dynamic"

export default async function PilotsPage() {
  const pilots = await getPilots()

  return (
    <div>
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Users className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestión de Pilotos</h1>
            <p className="text-sm text-muted-foreground">Administración de pilotos y certificaciones</p>
          </div>
        </div>
      </header>

      <PilotList pilots={pilots} />
    </div>
  )
}
