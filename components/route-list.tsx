"use client"

import type { Route } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus } from "lucide-react"
import { useState } from "react"
import { RouteForm } from "./route-form"
import { deleteRoute } from "@/app/actions"
import { useRouter } from "next/navigation"
import { useAviationToast } from "@/lib/hooks/use-aviation-toast"

type RouteListProps = {
  routes: Route[]
}

export function RouteList({ routes }: RouteListProps) {
  const { showRouteSuccess, showError } = useAviationToast()
  const [editingRoute, setEditingRoute] = useState<Route | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    const route = routes.find(r => r.id === id)
    if (confirm("¿Estás seguro de que deseas eliminar esta ruta?")) {
      try {
        await deleteRoute(id)
        showRouteSuccess("deleted", route?.route_code)
        router.refresh()
      } catch (error) {
        showError("Error al eliminar la ruta", "No se pudo eliminar la ruta. Inténtalo de nuevo.")
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{routes.length} rutas registradas</p>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Agregar Ruta
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {routes.map((route) => (
          <Card key={route.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-mono text-lg font-semibold">{route.route_code}</h3>
                  <p className="text-sm text-muted-foreground">
                    {route.origin} → {route.destination}
                  </p>
                </div>
                <Badge className={route.active ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}>
                  {route.active ? "Activa" : "Inactiva"}
                </Badge>
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Distancia</span>
                  <span className="font-medium">{route.distance_km.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duración</span>
                  <span className="font-medium">{route.estimated_duration} min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frecuencia</span>
                  <span className="font-medium">{route.frequency}</span>
                </div>
              </div>

              <div className="flex gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingRoute(route)
                    setIsFormOpen(true)
                  }}
                  className="flex-1 gap-2"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(route.id)}
                  className="flex-1 gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Eliminar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {routes.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No hay rutas registradas.</p>
        </Card>
      )}

      <RouteForm
        route={editingRoute}
        isOpen={isFormOpen}
        onCancel={() => {
          setEditingRoute(null)
          setIsFormOpen(false)
        }}
        onSuccess={() => {
          setEditingRoute(null)
          setIsFormOpen(false)
          router.refresh()
        }}
      />
    </div>
  )
}
