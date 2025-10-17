import { RouteIcon } from "lucide-react"
import { RouteList } from "@/components/route-list"
import { getRoutes } from "@/app/actions"

export const dynamic = "force-dynamic"

export default async function RoutesPage() {
  const routes = await getRoutes()

  return (
    <div>
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <RouteIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestión de Rutas</h1>
            <p className="text-sm text-muted-foreground">Administración de rutas de vuelo</p>
          </div>
        </div>
      </header>

      <RouteList routes={routes} />
    </div>
  )
}
