import { getPilots } from "@/app/actions"
import { PilotList } from "@/components/pilot-list"

export default async function PilotsPage() {
  const pilots = await getPilots()

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pilotos</h1>
          <p className="text-muted-foreground">
            Gestiona la información de los pilotos
          </p>
        </div>
        
        <PilotList pilots={pilots} />
      </div>
    </div>
  )
}
