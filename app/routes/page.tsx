import { getRoutes } from "@/app/actions"
import { RouteList } from "@/components/route-list"
import { RouteMap } from "@/components/route-map"

export default async function RoutesPage() {
  const routes = await getRoutes()

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rutas de Vuelo</h1>
          <p className="text-muted-foreground">
            Visualiza y gestiona las rutas de la aerolínea
          </p>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Lista de Rutas</h2>
            <RouteList routes={routes} />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Mapa de Rutas</h2>
            <RouteMap routes={routes} />
          </div>
        </div>
      </div>
    </div>
  )
}
