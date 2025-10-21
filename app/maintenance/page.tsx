import { getMaintenanceRecords } from "@/app/actions"
import { MaintenanceList } from "@/components/maintenance-list"

export default async function MaintenancePage() {
  const maintenance = await getMaintenanceRecords()

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mantenimiento de Aeronaves</h1>
          <p className="text-muted-foreground">
            Gestiona los registros de mantenimiento de la flota
          </p>
        </div>
        
        <MaintenanceList maintenance={maintenance} />
      </div>
    </div>
  )
}
