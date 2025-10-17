import { Wrench, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export const dynamic = "force-dynamic"

export default async function MaintenancePage() {
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

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Próximamente</AlertTitle>
        <AlertDescription>
          El módulo de gestión de mantenimiento estará disponible pronto. Podrás registrar y hacer seguimiento de
          mantenimientos preventivos y correctivos.
        </AlertDescription>
      </Alert>
    </div>
  )
}
