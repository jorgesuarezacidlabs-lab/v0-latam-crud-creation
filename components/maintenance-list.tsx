"use client"

import type { Maintenance } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus } from "lucide-react"
import { useState } from "react"
import { MaintenanceForm } from "./maintenance-form"
import { deleteMaintenance } from "@/app/actions"
import { useRouter } from "next/navigation"

type MaintenanceListProps = {
  records: Maintenance[]
}

const statusColors = {
  Programado: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "En progreso": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  Completado: "bg-green-500/10 text-green-600 dark:text-green-400",
  Cancelado: "bg-muted text-muted-foreground",
}

const typeColors = {
  Preventivo: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Correctivo: "bg-red-500/10 text-red-600 dark:text-red-400",
  Inspección: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  Overhaul: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
}

export function MaintenanceList({ records }: MaintenanceListProps) {
  const [editingRecord, setEditingRecord] = useState<Maintenance | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      try {
        await deleteMaintenance(id)
        router.refresh()
      } catch (error) {
        alert("Error al eliminar el registro")
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{records.length} registros de mantenimiento</p>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Agregar Registro
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {records.map((record) => (
          <Card key={record.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <Badge className={typeColors[record.maintenance_type]}>{record.maintenance_type}</Badge>
                <Badge className={statusColors[record.status]}>{record.status}</Badge>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-2">{record.description}</p>
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Técnico</span>
                  <span className="font-medium">{record.technician}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Inicio</span>
                  <span className="font-medium">{new Date(record.start_date).toLocaleDateString("es")}</span>
                </div>
                {record.end_date && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fin</span>
                    <span className="font-medium">{new Date(record.end_date).toLocaleDateString("es")}</span>
                  </div>
                )}
                {record.cost && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Costo</span>
                    <span className="font-medium">${record.cost.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingRecord(record)
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
                  onClick={() => handleDelete(record.id)}
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

      {records.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No hay registros de mantenimiento.</p>
        </Card>
      )}

      <MaintenanceForm
        record={editingRecord}
        isOpen={isFormOpen}
        onCancel={() => {
          setEditingRecord(null)
          setIsFormOpen(false)
        }}
        onSuccess={() => {
          setEditingRecord(null)
          setIsFormOpen(false)
          router.refresh()
        }}
      />
    </div>
  )
}
