"use client"

import type React from "react"
import { useEffect, useState } from "react"
import type { Maintenance, MaintenanceFormData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createMaintenance, updateMaintenance } from "@/app/actions"

type MaintenanceFormProps = {
  record: Maintenance | null
  isOpen: boolean
  onCancel: () => void
  onSuccess: () => void
}

export function MaintenanceForm({ record, isOpen, onCancel, onSuccess }: MaintenanceFormProps) {
  const [formData, setFormData] = useState({
    airplane_id: "",
    maintenance_type: "Preventivo" as MaintenanceFormData["maintenance_type"],
    description: "",
    technician: "",
    start_date: "",
    end_date: "",
    cost: "",
    status: "Programado" as MaintenanceFormData["status"],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (record) {
      setFormData({
        airplane_id: record.airplane_id || "",
        maintenance_type: record.maintenance_type,
        description: record.description,
        technician: record.technician,
        start_date: record.start_date,
        end_date: record.end_date || "",
        cost: record.cost?.toString() || "",
        status: record.status,
      })
    } else {
      setFormData({
        airplane_id: "",
        maintenance_type: "Preventivo",
        description: "",
        technician: "",
        start_date: "",
        end_date: "",
        cost: "",
        status: "Programado",
      })
    }
  }, [record, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const maintenanceData: MaintenanceFormData = {
        airplane_id: formData.airplane_id || null,
        maintenance_type: formData.maintenance_type,
        description: formData.description,
        technician: formData.technician,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        cost: formData.cost ? Number.parseFloat(formData.cost) : null,
        status: formData.status,
      }

      if (record) {
        await updateMaintenance(record.id, maintenanceData)
      } else {
        await createMaintenance(maintenanceData)
      }

      onSuccess()
    } catch (error) {
      alert("Error al guardar el registro")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{record ? "Editar Registro" : "Agregar Registro"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="maintenance_type">Tipo</Label>
              <Select
                value={formData.maintenance_type}
                onValueChange={(value: MaintenanceFormData["maintenance_type"]) =>
                  setFormData({ ...formData, maintenance_type: value })
                }
              >
                <SelectTrigger id="maintenance_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Preventivo">Preventivo</SelectItem>
                  <SelectItem value="Correctivo">Correctivo</SelectItem>
                  <SelectItem value="Inspección">Inspección</SelectItem>
                  <SelectItem value="Overhaul">Overhaul</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value: MaintenanceFormData["status"]) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Programado">Programado</SelectItem>
                  <SelectItem value="En progreso">En progreso</SelectItem>
                  <SelectItem value="Completado">Completado</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe el trabajo de mantenimiento..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="technician">Técnico</Label>
            <Input
              id="technician"
              placeholder="Nombre del técnico"
              value={formData.technician}
              onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_date">Fecha de Inicio</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">Fecha de Fin</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">Costo (USD)</Label>
            <Input
              id="cost"
              type="number"
              placeholder="5000"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              min="0"
              step="0.01"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : record ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
