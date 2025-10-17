import { Wrench } from "lucide-react"
import { MaintenanceList } from "@/components/maintenance-list"
import { getMaintenanceRecords } from "@/app/actions"

export const dynamic = "force-dynamic"

export default async function MaintenancePage() {
  const records = await getMaintenanceRecords()

  return (
    <div>
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Wrench className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestión de Mantenimiento</h1>
            <p className="text-sm text-muted-foreground">Registros de mantenimiento y reparaciones</p>
          </div>
        </div>
      </header>

      <MaintenanceList records={records} />
    </div>
  )
}
