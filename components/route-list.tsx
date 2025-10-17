"use client"

import type { Route } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, MapPin } from "lucide-react"
import { useState } from "react"
import { RouteForm } from "./route-form"
import { deleteRoute } from "@/app/actions"
import { useRouter } from "next/navigation"

type RouteListProps = {
  routes: Route[]
}

export function RouteList({ routes }: RouteListProps) {
  const [editingRoute, setEditingRoute] = useState<Route | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta ruta?")) {
      try {
        await deleteRoute(id)
        router.refresh()
      } catch (error) {
        console.error("[v0] Error deleting route:", error)
        alert("Error al eliminar la ruta")
      }
    }
  }

  const handleEdit = (route: Route) => {
    setEditingRoute(route)
    setIsFormOpen(true)
  }

  const handleCancel = () => {
    setEditingRoute(null)
    setIsFormOpen(false)
  }

  const handleSuccess = () => {
    setEditingRoute(null)
    setIsFormOpen(false)
    router.refresh()
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {routes.length} {routes.length === 1 ? "ruta" : "rutas"} registradas
        </p>
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
                  <h3 className="font-mono text-lg font-semibold text-foreground">{route.route_code}</h3>
                  <p className="text-sm text-muted-foreground">
                    {route.origin} → {route.destination}
                  </p>
                </div>
                <Badge className={route.active ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-muted text-muted-foreground"}>
                  {route.active ? "Activa" : "Inactiva"}
                </Badge>
              </div>

              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Distancia</span>
                  <span className="font-medium text-foreground">{route.distance_km.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duración</span>
                  <span className="font-medium text-foreground">{formatDuration(route.estimated_duration)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frecuencia</span>
                  <span className="font-medium text-foreground">{route.frequency}</span>
                </div>
              </div>

              <div className="flex gap-2 border-t border-border pt-4">
                <Button variant="outline" size="sm" onClick={() => handleEdit(route)} className="flex-1 gap-2">
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
          <div className="flex flex-col items-center gap-4">
            <MapPin className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              No hay rutas registradas. Haz clic en "Agregar Ruta" para comenzar.
            </p>
          </div>
        </Card>
      )}

      <RouteForm route={editingRoute} isOpen={isFormOpen} onCancel={handleCancel} onSuccess={handleSuccess} />
    </div>
  )
}