"use client"

import type React from "react"
import { useEffect, useState } from "react"
import type { Pilot, PilotFormData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createPilot, updatePilot } from "@/app/actions"
import { useAviationToast } from "@/lib/hooks/use-aviation-toast"

type PilotFormProps = {
  pilot: Pilot | null
  isOpen: boolean
  onCancel: () => void
  onSuccess: () => void
}

export function PilotForm({ pilot, isOpen, onCancel, onSuccess }: PilotFormProps) {
  const { showPilotSuccess, showError } = useAviationToast()
  const [formData, setFormData] = useState({
    name: "",
    license_number: "",
    nationality: "",
    flight_hours: "",
    certifications: "",
    status: "Activo" as PilotFormData["status"],
    hire_date: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (pilot) {
      setFormData({
        name: pilot.name,
        license_number: pilot.license_number,
        nationality: pilot.nationality,
        flight_hours: pilot.flight_hours.toString(),
        certifications: pilot.certifications.join(", "),
        status: pilot.status,
        hire_date: pilot.hire_date,
      })
    } else {
      setFormData({
        name: "",
        license_number: "",
        nationality: "",
        flight_hours: "",
        certifications: "",
        status: "Activo",
        hire_date: "",
      })
    }
  }, [pilot, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const pilotData: PilotFormData = {
        name: formData.name,
        license_number: formData.license_number,
        nationality: formData.nationality,
        flight_hours: Number.parseInt(formData.flight_hours),
        certifications: formData.certifications
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        status: formData.status,
        hire_date: formData.hire_date,
      }

      if (pilot) {
        await updatePilot(pilot.id, pilotData)
        showPilotSuccess("updated", pilot.name)
      } else {
        await createPilot(pilotData)
        showPilotSuccess("created", formData.name)
      }

      onSuccess()
    } catch (error) {
      showError("Error al guardar el piloto", "Verifica que todos los datos sean correctos")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{pilot ? "Editar Piloto" : "Agregar Piloto"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input
              id="name"
              placeholder="Juan Pérez"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="license_number">Licencia</Label>
              <Input
                id="license_number"
                placeholder="ATP-12345"
                value={formData.license_number}
                onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality">Nacionalidad</Label>
              <Input
                id="nationality"
                placeholder="Chilena"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="flight_hours">Horas de Vuelo</Label>
              <Input
                id="flight_hours"
                type="number"
                placeholder="5000"
                value={formData.flight_hours}
                onChange={(e) => setFormData({ ...formData, flight_hours: e.target.value })}
                required
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hire_date">Fecha de Contratación</Label>
              <Input
                id="hire_date"
                type="date"
                value={formData.hire_date}
                onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="certifications">Certificaciones (separadas por coma)</Label>
            <Input
              id="certifications"
              placeholder="Boeing 787, Airbus A320"
              value={formData.certifications}
              onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={formData.status}
              onValueChange={(value: PilotFormData["status"]) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
                <SelectItem value="En entrenamiento">En entrenamiento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : pilot ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
