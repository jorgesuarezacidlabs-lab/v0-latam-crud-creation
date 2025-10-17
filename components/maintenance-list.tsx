"use client"

import type { Maintenance } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, Wrench } from "lucide-react"
import { useState } from "react"
import { MaintenanceForm } from "./maintenance-form"
import { deleteMaintenance } from "@/app/actions"
import { useRouter } from "next/navigation"

type MaintenanceListProps = {
  maintenance: Maintenance[]
}

const statusColors = {
  Programado: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "En progreso": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  Completado: "bg-green-500/10 text-green-600 dark:text-green-400",
  Cancelado: "bg-red-500/10 text-red-600 dark:text-red-400",
}

const typeColors = {
  Preventivo: "bg-green-500/10 text-green-600 dark:text-green-400",
  Correctivo: "bg-red-500/10 text-red-600 dark:text-red-400",
  Inspección: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Overhaul: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
}

export function MaintenanceList({ maintenance }: MaintenanceListProps) {
  const [editingMaintenance, setEditingMaintenance] = useState<Maintenance | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este registro de mantenimiento?")) {
      try {
        await deleteMaintenance(id)
        router.refresh()
      } catch (error) {
        console.error("[v0] Error deleting maintenance:", error)
        alert("Error al eliminar el registro de mantenimiento")
      }
    }
  }

  const handleEdit = (maintenance: Maintenance) => {
    setEditingMaintenance(maintenance)
    setIsFormOpen(true)
  }

  const handleCancel = () => {
    setEditingMaintenance(null)
    setIsFormOpen(false)
  }

  const handleSuccess = () => {
    setEditingMaintenance(null)
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

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "No especificado"
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {maintenance.length} {maintenance.length === 1 ? "registro" : "registros"} de mantenimiento
        </p>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Agregar Mantenimiento
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {maintenance.map((record) => (
          <Card key={record.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg text-foreground">{record.description}</h3>
                  <p className="text-sm text-muted-foreground">{record.technician}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={statusColors[record.status]}>{record.status}</Badge>
                  <Badge className={typeColors[record.maintenance_type]}>{record.maintenance_type}</Badge>
                </div>
              </div>

              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Aeronave</span>
                  <span className="font-medium text-foreground">
                    {record.airplane_id ? "Asignada" : "Sin asignar"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Inicio</span>
                  <span className="font-medium text-foreground">{formatDate(record.start_date)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Finalización</span>
                  <span className="font-medium text-foreground">
                    {record.end_date ? formatDate(record.end_date) : "En progreso"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Costo</span>
                  <span className="font-medium text-foreground">{formatCurrency(record.cost)}</span>
                </div>
              </div>

              <div className="flex gap-2 border-t border-border pt-4">
                <Button variant="outline" size="sm" onClick={() => handleEdit(record)} className="flex-1 gap-2">
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

      {maintenance.length === 0 && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <Wrench className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              No hay registros de mantenimiento. Haz clic en "Agregar Mantenimiento" para comenzar.
            </p>
          </div>
        </Card>
      )}

      <MaintenanceForm 
        maintenance={editingMaintenance} 
        isOpen={isFormOpen} 
        onCancel={handleCancel} 
        onSuccess={handleSuccess} 
      />
    </div>
  )
}