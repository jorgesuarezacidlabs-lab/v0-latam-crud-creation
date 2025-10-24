"use client"

import type { Airplane } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus } from "lucide-react"
import { useState } from "react"
import { AirplaneForm } from "./airplane-form"
import { deleteAirplane } from "@/app/actions"
import { useRouter } from "next/navigation"
import { useAviationToast } from "@/lib/hooks/use-aviation-toast"

type AirplaneListProps = {
  airplanes: Airplane[]
}

const statusColors = {
  Activo: "bg-accent text-accent-foreground",
  "En mantenimiento": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  "Fuera de servicio": "bg-muted text-muted-foreground",
}

export function AirplaneList({ airplanes }: AirplaneListProps) {
  const { showAirplaneSuccess, showError } = useAviationToast()
  const [editingAirplane, setEditingAirplane] = useState<Airplane | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    const airplane = airplanes.find(a => a.id === id)
    if (confirm("¿Estás seguro de que deseas eliminar esta aeronave?")) {
      try {
        await deleteAirplane(id)
        showAirplaneSuccess("deleted", airplane?.registration)
        router.refresh()
      } catch (error) {
        console.error("[v0] Error deleting airplane:", error)
        showError("Error al eliminar la aeronave", "No se pudo eliminar la aeronave. Inténtalo de nuevo.")
      }
    }
  }

  const handleEdit = (airplane: Airplane) => {
    setEditingAirplane(airplane)
    setIsFormOpen(true)
  }

  const handleCancel = () => {
    setEditingAirplane(null)
    setIsFormOpen(false)
  }

  const handleSuccess = () => {
    setEditingAirplane(null)
    setIsFormOpen(false)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {airplanes.length} {airplanes.length === 1 ? "aeronave" : "aeronaves"} registradas
        </p>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Agregar Aeronave
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {airplanes.map((airplane) => (
          <Card key={airplane.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-mono text-lg font-semibold text-foreground">{airplane.registration}</h3>
                  <p className="text-sm text-muted-foreground">{airplane.model}</p>
                </div>
                <Badge className={statusColors[airplane.status]}>{airplane.status}</Badge>
              </div>

              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Aerolínea</span>
                  <span className="font-medium text-foreground">{airplane.airline}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Capacidad</span>
                  <span className="font-medium text-foreground">{airplane.capacity} pax</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Año</span>
                  <span className="font-medium text-foreground">{airplane.year}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">País</span>
                  <span className="font-medium text-foreground">{airplane.country}</span>
                </div>
              </div>

              <div className="flex gap-2 border-t border-border pt-4">
                <Button variant="outline" size="sm" onClick={() => handleEdit(airplane)} className="flex-1 gap-2">
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(airplane.id)}
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

      {airplanes.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            No hay aeronaves registradas. Haz clic en "Agregar Aeronave" para comenzar.
          </p>
        </Card>
      )}

      <AirplaneForm airplane={editingAirplane} isOpen={isFormOpen} onCancel={handleCancel} onSuccess={handleSuccess} />
    </div>
  )
}
