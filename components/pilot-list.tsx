"use client"

import type { Pilot } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, User } from "lucide-react"
import { useState } from "react"
import { PilotForm } from "./pilot-form"
import { deletePilot } from "@/app/actions"
import { useRouter } from "next/navigation"

type PilotListProps = {
  pilots: Pilot[]
}

const statusColors = {
  Activo: "bg-green-500/10 text-green-600 dark:text-green-400",
  Inactivo: "bg-muted text-muted-foreground",
  "En entrenamiento": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
}

export function PilotList({ pilots }: PilotListProps) {
  const [editingPilot, setEditingPilot] = useState<Pilot | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este piloto?")) {
      try {
        await deletePilot(id)
        router.refresh()
      } catch (error) {
        console.error("[v0] Error deleting pilot:", error)
        alert("Error al eliminar el piloto")
      }
    }
  }

  const handleEdit = (pilot: Pilot) => {
    setEditingPilot(pilot)
    setIsFormOpen(true)
  }

  const handleCancel = () => {
    setEditingPilot(null)
    setIsFormOpen(false)
  }

  const handleSuccess = () => {
    setEditingPilot(null)
    setIsFormOpen(false)
    router.refresh()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {pilots.length} {pilots.length === 1 ? "piloto" : "pilotos"} registrados
        </p>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Agregar Piloto
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pilots.map((pilot) => (
          <Card key={pilot.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg text-foreground">{pilot.name}</h3>
                  <p className="text-sm text-muted-foreground">{pilot.license_number}</p>
                </div>
                <Badge className={statusColors[pilot.status]}>{pilot.status}</Badge>
              </div>

              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nacionalidad</span>
                  <span className="font-medium text-foreground">{pilot.nationality}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Horas de Vuelo</span>
                  <span className="font-medium text-foreground">{pilot.flight_hours.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Contratación</span>
                  <span className="font-medium text-foreground">{formatDate(pilot.hire_date)}</span>
                </div>
                {pilot.certifications.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Certificaciones</span>
                    <div className="flex flex-wrap gap-1">
                      {pilot.certifications.map((cert, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 border-t border-border pt-4">
                <Button variant="outline" size="sm" onClick={() => handleEdit(pilot)} className="flex-1 gap-2">
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(pilot.id)}
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

      {pilots.length === 0 && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <User className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              No hay pilotos registrados. Haz clic en "Agregar Piloto" para comenzar.
            </p>
          </div>
        </Card>
      )}

      <PilotForm pilot={editingPilot} isOpen={isFormOpen} onCancel={handleCancel} onSuccess={handleSuccess} />
    </div>
  )
}