"use client"

import type { Pilot } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus } from "lucide-react"
import { useState } from "react"
import { PilotForm } from "./pilot-form"
import { deletePilot } from "@/app/actions"
import { useRouter } from "next/navigation"

type PilotListProps = {
  pilots: Pilot[]
}

const statusColors = {
  Activo: "bg-accent text-accent-foreground",
  Inactivo: "bg-muted text-muted-foreground",
  "En entrenamiento": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
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
        alert("Error al eliminar el piloto")
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{pilots.length} pilotos registrados</p>
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
                  <h3 className="text-lg font-semibold">{pilot.name}</h3>
                  <p className="text-sm text-muted-foreground font-mono">{pilot.license_number}</p>
                </div>
                <Badge className={statusColors[pilot.status]}>{pilot.status}</Badge>
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nacionalidad</span>
                  <span className="font-medium">{pilot.nationality}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Horas de vuelo</span>
                  <span className="font-medium">{pilot.flight_hours.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Contratación</span>
                  <span className="font-medium">{new Date(pilot.hire_date).toLocaleDateString("es")}</span>
                </div>
                {pilot.certifications.length > 0 && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Certificaciones:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {pilot.certifications.map((cert, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingPilot(pilot)
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
          <p className="text-muted-foreground">No hay pilotos registrados.</p>
        </Card>
      )}

      <PilotForm
        pilot={editingPilot}
        isOpen={isFormOpen}
        onCancel={() => {
          setEditingPilot(null)
          setIsFormOpen(false)
        }}
        onSuccess={() => {
          setEditingPilot(null)
          setIsFormOpen(false)
          router.refresh()
        }}
      />
    </div>
  )
}
